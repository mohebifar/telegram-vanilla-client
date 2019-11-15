import { MTConnection } from "./MTConnection";
import { MTProtoState } from "./MTProtoState";
import { TLMessage } from "./types";
import { performAuthentication } from "./MTAuth";
import { MTProtoPlainSender } from "./MTProtoPlainSender";
import { RequestState } from "./RequestState";
import { MessagePacker } from "./MessagePacker";
import { BinaryReader } from "./extensions/BinaryReader";
import { TLObjectTypes } from "./tl/types";
import { AuthKey } from "./crypto/AuthKey";
import { RPCError, InvalidBufferError } from "./errors";
// import { RPCResult } from "./tl/core/RPCResult";
import { TLSession } from "./TLSession";
import { sleep } from "../utils/utils";

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
  private pendingState = new Map<bigint, RequestState>();
  private pendingAck = new Set<bigint>();
  private authKeyCallback: Options["authKeyCallback"];
  private updateCallback: Options["updateCallback"];
  private autoReconnectCallback: Options["autoReconnectCallback"];
  private handlers = {
    RPCResult: this._handleRPCResult.bind(this),
    MessageContainer: this._handleContainer.bind(this),
    GZIPPacked: this._handleGzipPacked.bind(this),
    Pong: this._handlePong.bind(this),
    BadServerSalt: this._handleBadServerSalt.bind(this),
    BadMsgNotification: this._handleBadNotification.bind(this),
    MsgDetailedInfo: this._handleDetailedInfo.bind(this),
    MsgNewDetailedInfo: this._handleNewDetailedInfo.bind(this),
    NewSessionCreated: this._handleNewSessionCreated.bind(this),
    MsgsAck: this._handleAck.bind(this),
    FutureSalts: this._handleFutureSalts.bind(this),
    MsgsStateReq: this._handleStateForgotten.bind(this),
    MsgResendReq: this._handleStateForgotten.bind(this),
    MsgsAllInfo: this._handleMsgAll.bind(this),
    OnDisconnect: this._handleDisconnect.bind(this)
  };

  constructor(
    public session: TLSession,
    { updateCallback, authKeyCallback, autoReconnectCallback }: Options = {}
  ) {
    this.updateCallback = updateCallback;
    this.autoReconnectCallback = autoReconnectCallback;
    this.authKeyCallback = authKeyCallback;
    this.connection = new MTConnection(this.handlers.OnDisconnect);
  }

  public async connect(should = true) {
    await this.connection.connect(this.session.url);

    if (should && !this.session.authKey.key) {
      const plainSender = new MTProtoPlainSender(this.connection);
      const { authKey, timeOffset } = await performAuthentication(plainSender);
      this.session.authKey = authKey;
      this.state.timeOffset = timeOffset;

      if (this.authKeyCallback) {
        this.authKeyCallback(this.session.authKey);
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
          msgIds: Array.from(this.pendingAck)
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
        this.pendingState.set(state.msgId, state);
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
    this.pendingAck.add(message.msgId);
    let handler = this.handlers[message.obj.$t];
    if (!handler) {
      handler = this._handleUpdate.bind(this);
    }

    await handler(message);
  }

  /**
   * Pops the states known to match the given ID from pending messages.
   * This method should be used when the response isn't specific.
   * @param msgId
   * @returns {*[]}
   * @private
   */
  _popStates(msgId: bigint): RequestState[] {
    let state = this.pendingState.get(msgId);
    if (state) {
      this.pendingState.delete(msgId);
      return [state];
    }

    const toPop: bigint[] = [];

    this.pendingState.forEach(state => {
      if (state.containerId === msgId) {
        toPop.push(state.msgId);
      }
    });

    if (toPop.length) {
      const temp = [];
      for (const x of toPop) {
        temp.push(this.pendingState.get(x));
        this.pendingState.delete(x);
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

  async _handleRPCResult(message: TLMessage<any>) {
    const rpcResult = message.obj;
    const state = this.pendingState.get(rpcResult.reqMsgId);
    if (state) {
      this.pendingState.delete(rpcResult.reqMsgId);
    }
    console.debug(`Handling RPC result for message ${rpcResult.reqMsgId}`);

    if (!state) {
      try {
        const reader = new BinaryReader(rpcResult.body);
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
        new RequestState({ msgIds: [state.msgId], $t: "MsgsAck" })
      );
      state.reject(error);
    } else {
      const reader = new BinaryReader(rpcResult.body);
      const read = reader.tgReadObject();
      state.resolve(read);
    }
  }

  async _handleContainer(message: TLMessage<any>) {
    console.debug("Handling container");
    for (const innerMessage of message.obj.messages) {
      await this.processMessage(innerMessage);
    }
  }

  /**
   * Unpacks the data from a gzipped object and processes it:
   * gzip_packed#3072cfa1 packed_data:bytes = Object;
   * @param message
   * @returns {Promise<void>}
   * @private
   */
  async _handleGzipPacked(message: TLMessage<any>) {
    console.debug("Handling gzipped data");
    const reader = new BinaryReader(message.obj.data);
    message.obj = reader.tgReadObject();
    await this.processMessage(message);
  }

  async _handleUpdate(message: TLMessage<any>) {
    if (message.obj.subclassOfId !== 0x8af52aac) {
      console.warn(
        `Note: ${message.obj.$t} is not an update, not dispatching it`
      );
      return;
    }
    console.debug("Handling update %s", message.obj.$t);
    if (this.updateCallback) {
      this.updateCallback(message.obj);
    }
  }

  /**
   * Handles pong results, which don't come inside a ``RPCResult``
   * but are still sent through a request:
   * pong#347773c5 msg_id:long ping_id:long = Pong;
   * @param message
   * @returns {Promise<void>}
   * @private
   */
  async _handlePong(message: TLMessage<any>) {
    const pong = message.obj;
    console.debug(`Handling pong for message ${pong.msgId}`);
    const state = this.pendingState.get(pong.msgId);
    this.pendingState.delete(pong.msgId);

    // Todo Check result
    if (state) {
      state.resolve(pong);
    }
  }

  /**
   * Corrects the currently used server salt to use the right value
   * before enqueuing the rejected message to be re-sent:
   * bad_server_salt#edab447b bad_msg_id:long bad_msg_seqno:int
   * error_code:int new_server_salt:long = BadMsgNotification;
   * @param message
   * @returns {Promise<void>}
   * @private
   */
  async _handleBadServerSalt(message: TLMessage<any>) {
    const badSalt = message.obj;
    console.debug(`Handling bad salt for message ${badSalt.badMsgId}`);
    this.state.salt = badSalt.newServerSalt;
    const states = this._popStates(badSalt.badMsgId);
    this.sendQueue.extend(states);
    console.debug(`${states.length} message(s) will be resent`);
  }

  /**
   * Adjusts the current state to be correct based on the
   * received bad message notification whenever possible:
   * bad_msg_notification#a7eff811 bad_msg_id:long bad_msg_seqno:int
   * error_code:int = BadMsgNotification;
   * @param message
   * @returns {Promise<void>}
   * @private
   */
  async _handleBadNotification(message: TLMessage<any>) {
    const badMsg = message.obj;
    const states = this._popStates(badMsg.badMsgId);
    console.debug(`Handling bad msg ${badMsg}`);
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

  /**
   * Updates the current status with the received detailed information:
   * msg_detailed_info#276d3ec6 msg_id:long answer_msg_id:long
   * bytes:int status:int = MsgDetailedInfo;
   * @param message
   * @returns {Promise<void>}
   * @private
   */
  async _handleDetailedInfo(message: TLMessage<any>) {
    // TODO https://goo.gl/VvpCC6
    const msgId = message.obj.answerMsgId;
    console.debug(`Handling detailed info for message ${msgId}`);
    this.pendingAck.add(msgId);
  }

  /**
   * Updates the current status with the received detailed information:
   * msg_new_detailed_info#809db6df answer_msg_id:long
   * bytes:int status:int = MsgDetailedInfo;
   * @param message
   * @returns {Promise<void>}
   * @private
   */
  async _handleNewDetailedInfo(message: TLMessage<any>) {
    // TODO https://goo.gl/VvpCC6
    const msgId = message.obj.answerMsgId;
    console.debug(`Handling new detailed info for message ${msgId}`);
    this.pendingAck.add(msgId);
  }

  /**
   * Updates the current status with the received session information:
   * new_session_created#9ec20908 first_msg_id:long unique_id:long
   * server_salt:long = NewSession;
   * @param message
   * @returns {Promise<void>}
   * @private
   */
  async _handleNewSessionCreated(message: TLMessage<any>) {
    // TODO https://goo.gl/LMyN7A
    console.debug("Handling new session created");
    this.state.salt = message.obj.serverSalt;
  }

  /**
 * Handles a server acknowledge about our messages. Normally
 * these can be ignored except in the case of ``auth.logOut``:
 *
 *     auth.logOut#5717da40 = Bool;
 *
 * Telegram doesn't seem to send its result so we need to confirm
 * it manually. No other request is known to have this behaviour.

 * Since the ID of sent messages consisting of a container is
 * never returned (unless on a bad notification), this method
 * also removes containers messages when any of their inner
 * messages are acknowledged.

 * @param message
 * @returns {Promise<void>}
 * @private
 */
  async _handleAck(message: TLMessage<any>) {
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

  /**
   * Handles future salt results, which don't come inside a
   * ``rpc_result`` but are still sent through a request:
   *     future_salts#ae500895 req_msg_id:long now:int
   *     salts:vector<future_salt> = FutureSalts;
   * @param message
   * @returns {Promise<void>}
   * @private
   */
  async _handleFutureSalts(message: TLMessage<any>) {
    // TODO save these salts and automatically adjust to the
    // correct one whenever the salt in use expires.
    console.debug(`Handling future salts for message ${message.msgId}`);
    const state = this.pendingState.get(message.msgId);

    if (state) {
      this.pendingState.delete(message.msgId);
      state.resolve(message.obj);
    }
  }

  /**
   * Handles both :tl:`MsgsStateReq` and :tl:`MsgResendReq` by
   * enqueuing a :tl:`MsgsStateInfo` to be sent at a later point.
   * @param message
   * @returns {Promise<void>}
   * @private
   */
  async _handleStateForgotten(message: TLMessage<any>) {
    this.sendQueue.append(
      new RequestState({
        $t: "MsgsStateInfo",
        reqMsgId: message.msgId,
        info: String.fromCharCode(1).repeat(message.obj.msgIds)
      })
    );
  }

  /**
   * Handles :tl:`MsgsAllInfo` by doing nothing (yet).
   * @param message
   * @returns {Promise<void>}
   * @private
   */
  async _handleMsgAll(_message: TLMessage<any>) {}

  private async _handleDisconnect() {
    this.startReconnect();
  }

  private startReconnect(e?: Error) {
    if (this.userConnected && !this.reconnecting) {
      this.reconnecting = true;
      this.reconnect(e);
    }
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
}
