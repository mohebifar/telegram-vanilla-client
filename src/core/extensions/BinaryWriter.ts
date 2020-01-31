import { concatBuffers } from "../binary";

export class BinaryWriter {
  constructor(private stream: Uint8Array) {}

  write(buffer: Uint8Array) {
    this.stream = concatBuffers([this.stream, buffer]);
  }

  getValue() {
    return this.stream;
  }
}
