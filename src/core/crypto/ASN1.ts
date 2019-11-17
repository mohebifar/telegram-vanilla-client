const ASN1OctetString = 4;

export class BerReader {
  private buffer: Uint8Array;
  private size: number;
  private offset: number;
  private _length: number;

  constructor(data: Uint8Array) {
    this.buffer = data;
    this.size = data.length;

    this._length = 0;
    this.offset = 0;
  }

  get length() {
    return this._length;
  }

  readByte(peek: boolean) {
    if (this.size - this.offset < 1) {
      return null;
    }

    const b = this.buffer[this.offset] & 0xff;

    if (!peek) {
      this.offset += 1;
    }

    return b;
  }

  peek() {
    return this.readByte(true);
  }

  readLength(offset?: number) {
    if (offset >= this.size) {
      return null;
    }

    let lenB = this.buffer[offset++] & 0xff;
    if (lenB === null) {
      return null;
    }

    if ((lenB & 0x80) == 0x80) {
      lenB &= 0x7f;

      if (lenB == 0) throw Error("Indefinite length not supported");

      if (lenB > 4) throw Error("encoding too long");

      if (this.size - offset < lenB) return null;

      this._length = 0;
      for (let i = 0; i < lenB; i++) {
        this._length = (this._length << 8) + (this.buffer[offset++] & 0xff);
      }
    } else {
      // Wasn't a variable length
      this._length = lenB;
    }

    return offset;
  }

  readSequence(tag?: number) {
    const seq = this.peek();
    if (seq === null) {
      return null;
    }
    if (tag !== undefined && tag !== seq) {
      throw Error(`Expected 0x${tag.toString(16)}: got 0x${seq.toString(16)}`);
    }

    const o = this.readLength(this.offset + 1);
    if (o === null) return null;

    this.offset = o;
    return seq;
  }

  readString(tag?: number) {
    if (!tag) {
      tag = ASN1OctetString;
    }

    const b = this.peek();
    if (b === null) {
      return null;
    }

    if (b !== tag) {
      throw Error(`Expected 0x${tag.toString(16)}: got 0x${b.toString(16)}`);
    }

    const o = this.readLength(this.offset + 1);

    if (o === null) {
      return null;
    }

    if (this.length > this.size - o) {
      return null;
    }

    this.offset = o;

    if (this.length === 0) {
      new Uint8Array(0);
    }

    const str = this.buffer.slice(this.offset, this.offset + this.length);
    this.offset += this.length;

    return str;
  }
}
