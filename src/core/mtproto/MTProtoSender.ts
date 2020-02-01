import jBigInt, { BigInteger as JBigInt } from "big-integer";
import { MTConnection } from "./MTConnection";
import { MTProtoState } from "./MTProtoState";
import { TLMessage } from "../types";
import { performAuthentication } from "./MTAuth";
import { MTProtoPlainSender } from "./MTProtoPlainSender";
import { RequestState } from "./RequestState";
import { MessagePacker } from "./MessagePacker";
import { BinaryReader } from "../extensions/BinaryReader";
import { TLObjectTypes } from "../tl/types";
import { AuthKey } from "../crypto/AuthKey";
import { RPCError, InvalidBufferError } from "./errors";
// import { RPCResult } from "./tl/core/RPCResult";
import { sleep } from "../../utils/utils";
import { MTSession } from "./MTSessionManager";

interface Options {
  updateCallback?: (obj: TLObjectTypes) => any;
  autoReconnectCallback?: () => any;
  authKeyCallback?: (authKey: AuthKey) => any;
}

export class MTProtoSender {
  private connection: MTConnection;
  private state = new MTProtoState(this.session);
  private reconnecting = false;
  private sendQueue = new MessagePacker(this.state);
  private lastAcks: RequestState[] = [];
  private userConnected = false;
  private pendingState = new Map<string, RequestState>();
  private pendingAck = new Set<string>();
  private authKeyCallback: Options["authKeyCallback"];
  private updateCallback: Options["updateCallback"];
  private autoReconnectCallback: Options["autoReconnectCallback"];
  private handlers = new Map([
    ["RPCResult", this.handleRPCResult.bind(this)],
    ["MessageContainer", this.handleContainer.bind(this)],
    ["GZIPPacked", this.handleGzipPacked.bind(this)],
    ["Pong", this.handlePong.bind(this)],
    ["BadServerSalt", this.handleBadServerSalt.bind(this)],
    ["BadMsgNotification", this.handleBadNotification.bind(this)],
    ["MsgDetailedInfo", this.handleDetailedInfo.bind(this)],
    ["MsgNewDetailedInfo", this.handleNewDetailedInfo.bind(this)],
    ["NewSessionCreated", this.handleNewSessionCreated.bind(this)],
    ["MsgsAck", this.handleAck.bind(this)],
    ["FutureSalts", this.handleFutureSalts.bind(this)],
    ["MsgsStateReq", this.handleStateForgotten.bind(this)],
    ["MsgResendReq", this.handleStateForgotten.bind(this)],
    ["MsgsAllInfo", this.handleMsgAll.bind(this)],
    ["OnDisconnect", this._handleDisconnect.bind(this)]
  ]);

  constructor(
    public session: MTSession,
    { updateCallback, authKeyCallback, autoReconnectCallback }: Options = {}
  ) {
    this.updateCallback = updateCallback;
    this.autoReconnectCallback = autoReconnectCallback;
    this.authKeyCallback = authKeyCallback;
    this.connection = new MTConnection(this.handlers.get("OnDisconnect"));
  }

  public async connect(should = true) {
    await this.connection.connect(this.session.url);

    if (should && !this.session.authKey.key) {
      for (let i = 0; i < 5; i++) {
        try {
          const plainSender = new MTProtoPlainSender(this.connection);
          const { authKey, timeOffset } = await performAuthentication(
            plainSender
          );
          this.session.authKey = authKey;
          this.state.timeOffset = timeOffset;

          if (this.authKeyCallback) {
            this.authKeyCallback(this.session.authKey);
          }
          this.session.save();
          break;
        } catch {
          console.error("Failed to initiate MTProto connection attempt: ", i);
          await sleep(1000);
        }
      }
    }

    this.userConnected = true;

    this.sendLoop();
    this.recvLoop();
  }

  public disconnect() {
    if (this.connection === null) {
      console.log("Not disconnecting (already have no connection)");
      return;
    }
    console.info(`Disconnecting from ${this.session.dcId}...`);
    console.debug("Closing current connection...");
    return this.connection.disconnect();
  }

  public async reconnect(_e?: Error) {
    console.debug("Closing current connection...");
    await this.connection.disconnect();
    this.reconnecting = false;
    this.state.reset();

    // Retry 5 times
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        await this.connect();
        this.sendQueue.extend(Object.values(this.pendingState));
        this.pendingState = new Map();
        if (this.autoReconnectCallback) {
          this.autoReconnectCallback();
        }
        break;
      } catch (e) {
        console.error(e);
        await sleep(1000);
      }
    }
  }

  public async send(request: TLObjectTypes) {
    if (!this.userConnected) {
      throw new Error("Cannot send requests while disconnected");
    }

    let resolved = false;
    let timeout = 0;

    setTimeout(() => {
      if (!resolved) {
        state.reject(new Error("Timeout"));
      }
    }, 5000);

    const state = new RequestState(request);
    this.sendQueue.append(state);
    const result = await state.promise;
    clearInterval(timeout);
    resolved = true;

    return result;
  }

  private async sendLoop() {
    while (this.userConnected && !this.reconnecting) {
      if (this.pendingAck.size) {
        const ack = new RequestState({
          $t: "MsgsAck",
          msgIds: Array.from(this.pendingAck).map(v => jBigInt(v).toString())
        });

        this.sendQueue.append(ack);
        this.lastAcks.push(ack);
        this.pendingAck.clear();
      }

      console.debug("Waiting for messages to send...");

      const pack = await this.sendQueue.get();
      if (!pack) {
        continue;
      }

      const batch = pack.batch;

      console.debug(
        `Encrypting ${batch.length} message(s) in ${pack.data.length} bytes for sending`
      );

      const data = await this.state.encryptMessageData(pack.data);

      try {
        await this.connection.send(data);
      } catch (e) {
        console.log(e);
        console.info("Connection closed while sending data");
        return;
      }
      for (const state of batch) {
        this.pendingState.set(state.msgId.toString(), state);
      }
      console.debug("Encrypted messages put in a queue to be sent");
    }
  }

  private async recvLoop() {
    let body: Uint8Array;
    let message: TLMessage;

    while (this.userConnected && !this.reconnecting) {
      console.debug("Receiving items from the network...");

      try {
        body = await this.connection.recv();
      } catch (e) {
        console.warn("Connection closed while receiving data");
        return;
      }

      try {
        message = await this.state.decryptMessageData(body);
      } catch (e) {
        console.error("Error while decrypting incoming data", e);

        if (e instanceof InvalidBufferError) {
          console.info("Broken authorization key; resetting");
          if (this.authKeyCallback) {
            this.authKeyCallback(null);
          }
          this.startReconnect(e);
        }
      }

      try {
        await this.processMessage(message);
      } catch (e) {
        console.log(e);
        console.error("Unhandled error while receiving data");
      }
    }
  }

  private async processMessage(message: TLMessage<any>) {
    this.pendingAck.add(message.msgId.toString());
    const handler =
      this.handlers.get(message.obj.$t) || this.handleUpdate.bind(this);

    await handler(message);
  }

  private popStates(msgId: JBigInt): RequestState[] {
    let state = this.pendingState.get(msgId.toString());
    if (state) {
      this.pendingState.delete(msgId.toString());
      return [state];
    }

    const toPop: JBigInt[] = [];

    this.pendingState.forEach(state => {
      if (state.containerId === msgId) {
        toPop.push(state.msgId);
      }
    });

    if (toPop.length) {
      const temp = [];
      for (const x of toPop) {
        temp.push(this.pendingState.get(x.toString()));
        this.pendingState.delete(x.toString());
      }
      return temp;
    }

    for (const ack of this.lastAcks) {
      if (ack.msgId === msgId) {
        return [ack];
      }
    }

    return [];
  }

  private async handleRPCResult(message: TLMessage<any>) {
    const rpcResult = message.obj;
    const reqMsgId = rpcResult.reqMsgId.toString();
    const state = this.pendingState.get(reqMsgId);
    if (state) {
      this.pendingState.delete(reqMsgId);
    }
    console.debug(`Handling RPC result for message ${reqMsgId}`);

    if (!state) {
      try {
        const reader = new BinaryReader(rpcResult.body);

        console.log("reader.tgReadObject()", reader.tgReadObject());
        if (!(reader.tgReadObject() instanceof File)) {
          throw new Error("Not an upload.File");
        }
      } catch (e) {
        console.log(e);
        if (e instanceof Error) {
          console.info(
            `Received response without parent request: ${rpcResult.body}`
          );
          return;
        } else {
          throw e;
        }
      }
    }

    if (rpcResult.error) {
      const error = new RPCError(
        rpcResult.error.errorMessage,
        rpcResult.error.errorCode
      );
      this.sendQueue.append(
        new RequestState({ msgIds: [state.msgId.toString()], $t: "MsgsAck" })
      );
      state.reject(error);
    } else {
      const reader = new BinaryReader(rpcResult.body);
      const read = reader.tgReadObject();
      state.resolve(read);
    }
  }

  private async handleContainer(message: TLMessage<any>) {
    console.debug("Handling container");
    for (const innerMessage of message.obj.messages) {
      await this.processMessage(innerMessage);
    }
  }

  private async handleGzipPacked(message: TLMessage<any>) {
    console.debug("Handling gzipped data");
    const reader = new BinaryReader(message.obj.data);
    message.obj = reader.tgReadObject();
    await this.processMessage(message);
  }

  private async handleUpdate(message: TLMessage<any>) {
    if (message.obj.subclassOfId !== 0x8af52aac) {
      console.warn(
        `Note: ${message.obj.$t} is not an update, not dispatching it`
      );
      return;
    }
    console.debug("Handling update", message.obj.$t);
    if (this.updateCallback) {
      this.updateCallback(message.obj);
    }
  }

  private async handlePong(message: TLMessage<any>) {
    const pong = message.obj;
    console.debug(`Handling pong for message ${pong.msgId}`);
    const state = this.pendingState.get(pong.msgId);
    this.pendingState.delete(pong.msgId);

    // Todo Check result
    if (state) {
      state.resolve(pong);
    }
  }

  private async handleBadServerSalt(message: TLMessage<any>) {
    const badSalt = message.obj;
    console.debug(`Handling bad salt for message ${badSalt.badMsgId}`);
    this.state.salt = jBigInt(badSalt.newServerSalt);
    const states = this.popStates(badSalt.badMsgId);
    this.sendQueue.extend(states);
    console.debug(`${states.length} message(s) will be resent`);
  }

  private async handleBadNotification(message: TLMessage<any>) {
    const badMsg = message.obj;
    const states = this.popStates(badMsg.badMsgId);
    console.debug(`Handling bad msg`, badMsg);
    if ([16, 17].includes(badMsg.errorCode)) {
      // Sent msg_id too low or too high (respectively).
      // Use the current msg_id to determine the right time offset.
      const to = this.state.updateTimeOffset(message.msgId);
      console.info(`System clock is wrong, set time offset to ${to}s`);
    } else if (badMsg.errorCode === 32) {
      // msg_seqno too low, so just pump it up by some "large" amount
      // TODO A better fix would be to start with a new fresh session ID
      this.state.sequence += 64;
    } else if (badMsg.errorCode === 33) {
      // msg_seqno too high never seems to happen but just in case
      this.state.sequence -= 16;
    } else {
      // for (const state of states) {
      // TODO set errors;
      /* state.future.set_exception(
        BadMessageError(state.request, bad_msg.error_code))*/
      // }

      return;
    }
    // Messages are to be re-sent once we've corrected the issue
    this.sendQueue.extend(states);
    console.debug(`${states.length} messages will be resent due to bad msg`);
  }

  private async handleDetailedInfo(message: TLMessage<any>) {
    // TODO https://goo.gl/VvpCC6
    const msgId = message.obj.answerMsgId;
    console.debug(`Handling detailed info for message ${msgId}`);
    this.pendingAck.add(msgId);
  }

  private async handleNewDetailedInfo(message: TLMessage<any>) {
    // TODO https://goo.gl/VvpCC6
    const msgId = message.obj.answerMsgId;
    console.debug(`Handling new detailed info for message ${msgId}`);
    this.pendingAck.add(msgId);
  }

  private async handleNewSessionCreated(message: TLMessage<any>) {
    // TODO https://goo.gl/LMyN7A
    console.debug("Handling new session created");
    this.state.salt = jBigInt(message.obj.serverSalt);
  }

  private async handleAck(message: TLMessage<any>) {
    const ack = message.obj;
    console.debug(`Handling acknowledge for ${ack.msgIds}`);
    for (const msgId of ack.msgIds) {
      const state = this.pendingState.get(msgId);
      if (state && state.request.$t === "auth_LogOutRequest") {
        this.pendingState.delete(msgId);
        state.resolve(true);
      }
    }
  }

  private async handleFutureSalts(message: TLMessage<any>) {
    // TODO save these salts and automatically adjust to the
    // correct one whenever the salt in use expires.
    console.debug(`Handling future salts for message ${message.msgId}`);
    const state = this.pendingState.get(message.msgId.toString());

    if (state) {
      this.pendingState.delete(message.msgId.toString());
      state.resolve(message.obj);
    }
  }

  private async handleStateForgotten(message: TLMessage<any>) {
    this.sendQueue.append(
      new RequestState({
        $t: "MsgsStateInfo",
        reqMsgId: message.msgId.toString(),
        info: String.fromCharCode(1).repeat(message.obj.msgIds)
      })
    );
  }

  private async handleMsgAll(_message: TLMessage<any>) {}

  private async _handleDisconnect() {
    this.startReconnect();
  }

  private startReconnect(e?: Error) {
    if (this.userConnected && !this.reconnecting) {
      this.reconnecting = true;
      this.reconnect(e);
    }
  }
}
