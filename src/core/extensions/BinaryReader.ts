import { unpack, readBigIntFromBuffer } from "../../utils/binary";
import { tlObjectReader } from "../tl/types";

export class BinaryReader {
  private last: Uint8Array = null;
  private offset = 0;
  /**
   * Small utility class to read binary data.
   * @param data {Buffer}
   */
  constructor(private stream: Uint8Array) {}

  // region Reading

  // "All numbers are written as little endian."
  // https://core.telegram.org/mtproto
  /**
   * Reads a single byte value.
   */
  readByte() {
    return this.read(1)[0];
  }

  /**
   * Reads an integer (4 bytes or 32 bits) value.
   * @param signed {Boolean}
   */
  readInt(signed = true): number {
    let res;
    if (signed) {
      res = unpack(this.stream, "i", true, this.offset);
    } else {
      res = unpack(this.stream, "I", true, this.offset);
    }
    this.offset += 4;
    return res;
  }

  /**
   * Reads a long integer (8 bytes or 64 bits) value.
   * @param signed
   * @returns {bigint}
   */
  public readLong(signed = true) {
    return this.readLargeInt(64, signed);
  }

  /**
   * Reads a real floating point (4 bytes) value.
   * @returns {number}
   */
  readFloat() {
    // return unpack("<f", this.read(4))[0];
  }

  /**
   * Reads a real floating point (8 bytes) value.
   * @returns {BigInt}
   */
  readDouble() {
    // return unpack("<f", this.read(8))[0];
  }

  /**
   * Reads a n-bits long integer value.
   * @param bits
   * @param signed {Boolean}
   */
  readLargeInt(bits, signed = true) {
    const buffer = this.read(Math.floor(bits / 8));
    return readBigIntFromBuffer(buffer, true, signed);
  }

  /**
   * Read the given amount of bytes, or -1 to read all remaining.
   * @param length {number}
   */
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

  /**
   * Gets the byte array representing the current buffer as a whole.
   * @returns {Buffer}
   */
  getBuffer() {
    return this.stream;
  }

  // endregion

  // region Telegram custom reading
  /**
   * Reads a Telegram-encoded byte array, without the need of
   * specifying its length.
   * @returns {Buffer}
   */
  tgReadBytes() {
    const firstByte = this.readByte();
    let padding;
    let length;
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

  /**
   * Reads a Telegram-encoded string.
   * @returns {string}
   */
  tgReadString() {
    const utf8decoder = new TextDecoder();
    return utf8decoder.decode(this.tgReadBytes());
  }

  /**
   * Reads a Telegram boolean value.
   * @returns {boolean}
   */
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

  /**
   * Reads and converts Unix time (used by Telegram)
   * into a Javascript {Date} object.
   * @returns {Date}
   */
  tgReadDate() {
    const value = this.readInt();
    return new Date(value * 1000);
  }

  /**
   * Reads a Telegram object.
   */
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

  /**
   * Reads a vector (a list) of Telegram objects.
   * @returns {[Buffer]}
   */
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

  // endregion

  /**
   * Closes the reader.
   */
  close() {
    this.stream = null;
  }

  // region Position related

  /**
   * Tells the current position on the stream.
   * @returns {number}
   */
  getPosition() {
    return this.offset;
  }

  /**
   * Sets the current position on the stream.
   * @param position
   */
  setPosition(position: number) {
    this.offset = position;
  }

  /**
   * Seeks the stream position given an offset from the current position.
   * The offset may be negative.
   * @param offset
   */
  seek(offset: number) {
    this.offset += offset;
  }

  // endregion
}
