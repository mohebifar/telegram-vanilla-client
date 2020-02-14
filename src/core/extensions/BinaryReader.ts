import { unpack, readBigIntFromBuffer } from "../binary";
import { tlObjectReader } from "../tl/types";

export class BinaryReader {
  private last: Uint8Array = null;
  private offset = 0;

  constructor(private stream: Uint8Array) {}

  read(length = -1) {
    if (length === -1) {
      length = this.stream.length - this.offset;
    }
    const result = this.stream.slice(this.offset, this.offset + length);
    this.offset += length;
    if (result.length !== length) {
      throw Error(
        `No more data left to read (need ${length}, got ${result.length}: ${result}); last read ${this.last}`
      );
    }
    this.last = result;
    return result;
  }

  readByte() {
    return this.read(1)[0];
  }

  readInt(signed = true) {
    let res: number;
    if (signed) {
      res = unpack(this.stream, "i", true, this.offset);
    } else {
      res = unpack(this.stream, "I", true, this.offset);
    }
    this.offset += 4;
    return res;
  }

  public readLong(signed = true) {
    return this.readLargeInt(64, signed);
  }

  readFloat() {
    return unpack(this.read(4), "f");
  }

  readDouble() {
    return unpack(this.read(8), "F");
  }

  readLargeInt(bits: number, signed = true) {
    const buffer = this.read(Math.floor(bits / 8));
    return readBigIntFromBuffer(buffer, true, signed);
  }

  getBuffer() {
    return this.stream;
  }

  tgReadBytes() {
    const firstByte = this.readByte();
    let padding: number;
    let length: number;
    if (firstByte === 254) {
      length =
        this.readByte() | (this.readByte() << 8) | (this.readByte() << 16);
      padding = length % 4;
    } else {
      length = firstByte;
      padding = (length + 1) % 4;
    }
    const data = this.read(length);

    if (padding > 0) {
      padding = 4 - padding;
      this.read(padding);
    }

    return data;
  }

  tgReadString() {
    const utf8decoder = new TextDecoder();
    return utf8decoder.decode(this.tgReadBytes());
  }

  tgReadBool() {
    const value = this.readInt(false);
    if (value === 0x997275b5) {
      // boolTrue
      return true;
    } else if (value === 0xbc799737) {
      // boolFalse
      return false;
    } else {
      throw new Error(`Invalid boolean code ${value.toString(16)}`);
    }
  }

  tgReadDate() {
    const value = this.readInt();
    return new Date(value * 1000);
  }

  tgReadObject() {
    const constructorId = this.readInt(false);
    const reader = tlObjectReader(constructorId);

    if (reader === undefined) {
      this.seek(-4);
      const position = this.getPosition();
      this.setPosition(position);
      throw new Error(`Unknown constructor type ${constructorId.toString(16)}`);
    }

    return reader(this);
  }

  tgReadVector() {
    if (this.readInt(false) !== 0x1cb5c415) {
      throw new Error("Invalid constructor code, vector was expected");
    }
    const count = this.readInt();
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push(this.tgReadObject());
    }
    return temp;
  }

  close() {
    this.stream = null;
  }

  getPosition() {
    return this.offset;
  }

  setPosition(position: number) {
    this.offset = position;
  }

  seek(offset: number) {
    this.offset += offset;
  }
}
