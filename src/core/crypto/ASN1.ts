const ASN1OctetString = 4;

export class BerReader {
  private _buf: Uint8Array;
  private _size: number;
  private _len: number;
  private _offset: number;

  constructor(data: Uint8Array) {
    this._buf = data;
    this._size = data.length;

    // These hold the "current" state
    this._len = 0;
    this._offset = 0;
  }

  get length() {
    return this._len;
  }

  readByte(peek: boolean) {
    if (this._size - this._offset < 1) {
      return null;
    }

    const b = this._buf[this._offset] & 0xff;

    if (!peek) {
      this._offset += 1;
    }

    return b;
  }

  peek() {
    return this.readByte(true);
  }

  readLength(offset: number) {
    if (offset === undefined) {
      offset = this._offset;
    }

    if (offset >= this._size) {
      return null;
    }

    let lenB = this._buf[offset++] & 0xff;
    if (lenB === null) {
      return null;
    }

    if ((lenB & 0x80) == 0x80) {
      lenB &= 0x7f;

      if (lenB == 0) throw Error("Indefinite length not supported");

      if (lenB > 4) throw Error("encoding too long");

      if (this._size - offset < lenB) return null;

      this._len = 0;
      for (let i = 0; i < lenB; i++) {
        this._len = (this._len << 8) + (this._buf[offset++] & 0xff);
      }
    } else {
      // Wasn't a variable length
      this._len = lenB;
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

    const o = this.readLength(this._offset + 1);
    if (o === null) return null;

    this._offset = o;
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

    const o = this.readLength(this._offset + 1);

    if (o === null) {
      return null;
    }

    if (this.length > this._size - o) {
      return null;
    }

    this._offset = o;

    if (this.length === 0) {
      new Uint8Array(0);
    }

    const str = this._buf.slice(this._offset, this._offset + this.length);
    this._offset += this.length;

    return str;
  }
}
