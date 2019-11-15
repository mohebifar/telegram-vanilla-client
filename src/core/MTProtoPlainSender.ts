import { MTProtoState } from "./MTProtoState";
import { MTConnection } from "./MTConnection";
import { concatBuffers, pack } from "../utils/binary";
import { BinaryReader } from "./extensions/BinaryReader";
import { InvalidBufferError } from "./errors";

export class MTProtoPlainSender {
  private state: MTProtoState;

  constructor(private connection: MTConnection) {
    this.state = new MTProtoState();
  }

  async send(request: Uint8Array) {
    let body = request;
    let msgId = this.state.getNewMessageId();

    const res = concatBuffers([
      new Uint8Array(8),
      pack(msgId, "q", true),
      pack(body.length, "i", true),
      body
    ]);

    await this.connection.send(res);
    body = await this.connection.recv();
    if (body.length < 9) {
      throw new InvalidBufferError(body);
    }
    const reader = new BinaryReader(body);
    const authKeyId = reader.readLong();
    if (authKeyId !== BigInt(0)) {
      throw new Error("Bad authKeyId");
    }
    msgId = reader.readLong();
    if (msgId === BigInt(0)) {
      throw new Error("Bad msgId");
    }
    const length = reader.readInt();
    if (length <= 0) {
      throw new Error("Bad length");
    }

    return reader.tgReadObject();
  }
}
