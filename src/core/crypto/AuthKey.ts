import { BigInteger as JBigInt } from "big-integer";
import { sha1 } from "../crypto";
import { BinaryReader } from "../extensions/BinaryReader";

export class AuthKey {
  private _key: Uint8Array = null;
  public auxHash: JBigInt = null;
  public keyId: JBigInt = null;

  async setKey(value: Uint8Array) {
    this._key = value;
    const reader = new BinaryReader(await sha1(this._key));
    this.auxHash = reader.readLong(false);
    reader.read(4);
    this.keyId = reader.readLong(false);
  }

  get key() {
    return this._key;
  }

  toJSON() {
    return this.toArray();
  }

  toArray() {
    return this._key ? Array.from(this._key) : undefined;
  }

  equals(other: AuthKey) {
    return other instanceof AuthKey && other.key === this._key;
  }
}
