import jBigInt, { BigInteger as JBigInt } from "big-integer";
import {
  generateRandomLong,
  generateRandomBytes,
  readBufferFromBigInt,
  readBigIntFromBuffer,
  concatBuffers,
  byteBuffersEqual,
  pack,
  mod
} from "../binary";
import { sha256, encryptIGE, decryptIGE } from "../crypto";
import { TLMessage } from "../types";
import { BinaryReader } from "../extensions/BinaryReader";
import { BinaryWriter } from "../extensions/BinaryWriter";
import { serializeTLObject } from "../tl/types";
import { InvalidBufferError } from "./errors";
import { gzipIfLarge } from "../tl/core/GZIPPacked";
import { MTSession } from "./MTSessionManager";

export class MTProtoState {
  public timeOffset = 0;
  private lastMsgId: JBigInt;
  public sequence: number;
  private id: JBigInt;
  public salt: JBigInt = jBigInt(0);

  constructor(public session?: MTSession) {
    this.reset();
  }

  public reset() {
    this.id = generateRandomLong(true);
    this.sequence = 0;
    this.lastMsgId = jBigInt(0);
  }

  public writeDataAsMessage(
    buffer: BinaryWriter,
    data: Uint8Array,
    contentRelated: boolean,
    afterId?: JBigInt
  ): JBigInt {
    const msgId = this.getNewMessageId();
    const seqNo = this.getSequenceNumber(contentRelated);
    let body: Uint8Array;

    if (!afterId) {
      body = gzipIfLarge(contentRelated, data);
    } else {
      body = gzipIfLarge(
        contentRelated,
        serializeTLObject({
          $t: "InvokeAfterMsgRequest",
          msgId: afterId.toString(),
          query: data as any
        })
      );
    }

    buffer.write(pack(msgId, "q", true));
    buffer.write(pack(seqNo, "i", true));
    buffer.write(pack(body.length, "i", true));
    buffer.write(body);
    return msgId;
  }

  public async encryptMessageData(rawData: Uint8Array) {
    const data = concatBuffers([
      pack(this.salt, "q"),
      pack(this.id, "q"),
      rawData
    ]);
    const padding = generateRandomBytes(mod(-(data.length + 12), 16) + 12);
    // Being substr(what, offset, length); x = 0 for client
    // "msg_key_large = SHA256(substr(auth_key, 88+x, 32) + pt + padding)"
    const msgKeyLarge = await sha256(
      concatBuffers([
        this.session.authKey.key.slice(88, 88 + 32),
        data,
        padding
      ])
    );

    const msgKey = msgKeyLarge.slice(8, 24);

    const { iv, key } = await this.calculateKeyAndIv(
      this.session.authKey.key,
      msgKey,
      true
    );

    const keyId = readBufferFromBigInt(this.session.authKey.keyId, 8);
    return concatBuffers([
      keyId,
      msgKey,
      await encryptIGE(concatBuffers([data, padding]), key, iv)
    ]);
  }

  public async decryptMessageData(body: Uint8Array): Promise<TLMessage> {
    if (body.length < 8) {
      throw new InvalidBufferError(body);
    }

    // TODO Check salt,sessionId, and sequenceNumber
    const keyId = readBigIntFromBuffer(body.slice(0, 8));

    if (!keyId.equals(this.session.authKey.keyId)) {
      throw new Error("Server replied with an invalid auth key");
    }

    const msgKey = body.slice(8, 24);
    const { iv, key } = await this.calculateKeyAndIv(
      this.session.authKey.key,
      msgKey,
      false
    );
    body = await decryptIGE(body.slice(24), key, iv);

    // https://core.telegram.org/mtproto/security_guidelines
    // Sections "checking sha256 hash" and "message length"

    const ourKey = await sha256(
      concatBuffers([this.session.authKey.key.slice(96, 96 + 32), body])
    );

    if (!byteBuffersEqual(msgKey, ourKey.slice(8, 24))) {
      throw new Error("Received msg_key doesn't match with expected one");
    }

    const reader = new BinaryReader(body);
    reader.readLong(); // removeSalt
    const serverId = reader.readLong();
    if (!serverId.equals(this.id)) {
      throw new Error("Server replied with a wrong session ID");
    }

    const remoteMsgId = reader.readLong();
    const remoteSequence = reader.readInt();
    reader.readInt(); // msgLen for the inner object, padding ignored

    // We could read msg_len bytes and use those in a new reader to read
    // the next TLObject without including the padding, but since the
    // reader isn't used for anything else after this, it's unnecessary.
    const obj = reader.tgReadObject();

    return {
      msgId: remoteMsgId,
      seqNo: remoteSequence,
      obj
    } as any;
  }

  public getNewMessageId() {
    const now = new Date().getTime() / 1000 + this.timeOffset;
    const nanoseconds = Math.floor((now - Math.floor(now)) * 1e9);
    let newMsgId = jBigInt(Math.floor(now))
      .shiftLeft(32)
      .or(jBigInt(nanoseconds).shiftLeft(2));

    if (this.lastMsgId.greaterOrEquals(newMsgId)) {
      newMsgId = this.lastMsgId.add(4);
    }
    this.lastMsgId = newMsgId;
    return newMsgId;
  }

  public updateTimeOffset(correctMsgId: JBigInt) {
    const bad = this.getNewMessageId();
    const old = this.timeOffset;
    const now = Math.floor(new Date().getTime() / 1000);
    const correct = correctMsgId.shiftRight(32);
    this.timeOffset = Number(correct) - now;

    if (this.timeOffset !== old) {
      this.lastMsgId = jBigInt(0);
      console.log(
        `Updated time offset (old offset ${old}, bad ${bad}, good ${correctMsgId}, new ${this.timeOffset})`
      );
    }

    return this.timeOffset;
  }

  private getSequenceNumber(contentRelated: boolean) {
    if (contentRelated) {
      const result = this.sequence * 2 + 1;
      this.sequence += 1;
      return result;
    } else {
      return this.sequence * 2;
    }
  }

  private async calculateKeyAndIv(
    authKey: Uint8Array,
    msgKey: Uint8Array,
    client: boolean
  ) {
    const x = client === true ? 0 : 8;
    const sha256a = await sha256(
      concatBuffers([msgKey, authKey.slice(x, x + 36)])
    );
    const sha256b = await sha256(
      concatBuffers([authKey.slice(x + 40, x + 76), msgKey])
    );

    const key = concatBuffers([
      sha256a.slice(0, 8),
      sha256b.slice(8, 24),
      sha256a.slice(24, 32)
    ]);

    const iv = concatBuffers([
      sha256b.slice(0, 8),
      sha256a.slice(8, 24),
      sha256b.slice(24, 32)
    ]);

    return { key, iv };
  }
}
