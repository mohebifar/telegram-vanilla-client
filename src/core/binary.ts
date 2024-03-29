import jBigInt, { BigInteger as JBigInt } from "big-integer";

export function byteBuffersEqual(
  a: Uint8Array | number[],
  b: Uint8Array | number[]
) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((v: number, i: number) => v === b[i]);
}

export function generateRandomBytes(size: number) {
  const array = new Uint8Array(size);
  crypto.getRandomValues(array);
  return array;
}

export function generateRandomLong(signed?: boolean) {
  return unpack(new Uint8Array(generateRandomBytes(8)), signed ? "q" : "Q");
}

export function readBytesFromString(input: string) {
  const encoder = new TextEncoder();
  return encoder.encode(input);
}

export function unpack(
  bytes: Uint8Array,
  type: "q" | "Q",
  little?: boolean,
  offset?: number
): JBigInt;

export function unpack(
  bytes: Uint8Array,
  type: "I" | "i" | "B" | "h" | "H" | "f" | "F",
  little?: boolean,
  offset?: number
): number;

export function unpack(
  bytes: Uint8Array,
  type: "I" | "i" | "B" | "q" | "Q" | "h" | "H" | "f" | "F",
  little: boolean = true,
  offset = 0
): JBigInt | number {
  const dataView = new DataView(bytes.buffer);
  switch (type) {
    case "I":
      return dataView.getUint32(offset, little);
    case "i":
      return dataView.getInt32(offset, little);
    case "H":
      return dataView.getUint16(offset, little);
    case "h":
      return dataView.getInt16(offset, little);
    case "B":
      return dataView.getUint8(offset);
    case "f":
      return dataView.getFloat32(offset, little);
    case "F":
      return dataView.getFloat64(offset, little);
    case "q":
      // Safari does not support bigint in DataView
      // return dataView.getBigInt64(0, little);
      return readBigIntFromBuffer(bytes, little, true);
    case "Q":
      // return dataView.getBigUint64(0, little);
      return readBigIntFromBuffer(bytes, little, false);
  }
}

export function readBufferFromHex(hex: number | string) {
  if (typeof hex === "string") {
    return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  }

  return pack(hex, "i", false);
}

export function pack(
  input: number | JBigInt,
  type: "I" | "i" | "B" | "q" | "Q",
  little: boolean = true
): Uint8Array {
  let buffer: ArrayBuffer;
  let dataView: DataView;

  switch (type) {
    case "I":
      [buffer, dataView] = makeDataViewOfSize(4);
      dataView.setUint32(0, input as number, little);
      return new Uint8Array(buffer);
    case "i":
      [buffer, dataView] = makeDataViewOfSize(4);
      dataView.setInt32(0, input as number, little);
      return new Uint8Array(buffer);
    case "B":
      [buffer, dataView] = makeDataViewOfSize(1);
      dataView.setUint8(0, input as number);
      return new Uint8Array(buffer);
    case "q":
    case "Q":
      return readBufferFromBigInt(input as JBigInt, 8, little, type === "q");
  }
}

export function readBigIntFromBuffer(
  bytes: Uint8Array,
  little = true,
  signed = false
) {
  const bytesNumber = bytes.length;
  if (little) {
    bytes = bytes.reverse();
  }

  const hex = bytes.reduce((a, b) => {
    let h = b.toString(16);
    if (h.length % 2) {
      h = "0" + h;
    }
    return a + h;
  }, "");

  let bigInt = jBigInt(hex, 16);
  if (signed && Math.floor(bigInt.toString(2).length / 8) >= bytesNumber) {
    bigInt = bigInt.minus(jBigInt(2).pow(jBigInt(bytesNumber * 8)));
  }
  return bigInt;
}

export function readBufferFromBigInt(
  input: JBigInt,
  bytesNumber: number,
  little = true,
  signed = false
) {
  const bitLength = input.toString(2).length;

  const bytes = Math.ceil(bitLength / 8);
  if (bytesNumber < bytes) {
    throw new Error("OverflowError: int too big to convert");
  }
  if (!signed && input.lesser(0)) {
    throw new Error("Cannot convert to unsigned");
  }
  let below = false;
  if (input.lesser(0)) {
    below = true;
    input = input.multiply(-1);
  }

  const hex = input.toString(16).padStart(bytesNumber * 2, "0");

  var len = hex.length / 2;
  var l = new Uint8Array(len);

  var i = 0;
  var j = 0;
  while (i < len) {
    l[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  if (little) {
    l = l.reverse();
  }

  if (signed && below) {
    if (little) {
      l[0] = 256 - l[0];
      for (let i = 1; i < l.length; i++) {
        l[i] = 255 - l[i];
      }
    } else {
      l[l.length - 1] = 256 - l[l.length - 1];
      for (let i = 0; i < l.length - 1; i++) {
        l[i] = 255 - l[i];
      }
    }
  }
  return l;
}

export function concatBuffers(buffers: Array<number[] | Uint8Array>) {
  const size = buffers.reduce((a, b) => a + b.length, 0);
  const array = new Uint8Array(size);
  let offset = 0;
  buffers.forEach(buffer => {
    array.set(buffer, offset);
    offset += buffer.length;
  });

  return array;
}

export function mod<T extends number | JBigInt>(n: T, m: T): T {
  if (typeof n === "number" && typeof m === "number") {
    return (((n % m) + m) % m) as T;
  }

  return (n as JBigInt)
    .mod(m)
    .add(m)
    .mod(m) as T;
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function modExp(a: JBigInt, b: JBigInt, n: JBigInt) {
  a = a.mod(n);
  let result = jBigInt(1);
  let x = a;
  while (b.greater(0)) {
    const leastSignificantBit = b.mod(2);
    b = b.divide(2);
    if (leastSignificantBit.equals(1)) {
      result = result.multiply(x);
      result = result.mod(n);
    }
    x = x.multiply(x);
    x = x.mod(n);
  }
  return result;
}

export function getByteArray(integer: JBigInt, signed = false) {
  const { length: bits } = integer.toString(2);
  const byteLength = Math.floor((bits + 8 - 1) / 8);
  return readBufferFromBigInt(jBigInt(integer), byteLength, false, signed);
}

export function base64ToBufferAsync(base64: string) {
  const dataUrl = "data:application/octet-binary;base64," + base64;
  return dataUriBufferAsync(dataUrl);
}

export async function dataUriBufferAsync(dataUrl: string) {
  const response = await fetch(dataUrl);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

function makeDataViewOfSize(size: number): [ArrayBuffer, DataView] {
  const buffer = new ArrayBuffer(size);
  return [buffer, new DataView(buffer, 0)];
}
