import { encryptorCTR, decryptorCTR } from "../crypto";
import {
  byteBuffersEqual,
  unpack,
  generateRandomBytes,
  concatBuffers,
  readBufferFromBigInt,
  pack
} from "../../utils/binary";
import { MTConnection } from "./MTConnection";

export class MTTransport {
  public header: Uint8Array;
  public obfuscate: (input: Uint8Array) => Uint8Array;
  public deobfuscate: (input: Uint8Array) => Uint8Array;

  constructor(private connection: MTConnection) {}

  async initHeader() {
    const keywords = [
      new Uint8Array([80, 86, 114, 71]),
      new Uint8Array([71, 69, 84]),
      new Uint8Array([80, 79, 83, 84]),
      new Uint8Array([238, 238, 238, 238])
    ];
    const zero = new Uint8Array([0, 0, 0, 0]);

    const codec = [239, 239, 239, 239];

    let random: Uint8Array;

    do {
      // Lock random for testing purposes
      // random = new Uint8Array(
      //   "219,245,56,149,158,126,237,138,91,67,46,107,108,68,100,36,161,38,242,159,207,234,121,204,239,216,3,146,59,125,112,194,17,143,134,236,252,146,46,94,126,25,56,223,6,201,86,218,176,181,29,237,81,16,236,89,141,199,254,252,172,208,181,20"
      //     .split(",")
      //     .map(Number)
      // );
      random = generateRandomBytes(64);
    } while (
      random[0] === 0xef ||
      byteBuffersEqual(random.slice(4, 8), zero) ||
      keywords.some(keyword => byteBuffersEqual(random.slice(0, 4), keyword))
    );

    const randomReversed = random.slice(8, 56).reverse();

    const encryptKey = random.slice(8, 40);
    const encryptIv = random.slice(40, 56);
    const decryptKey = randomReversed.slice(0, 32);
    const decryptIv = randomReversed.slice(32, 48);

    this.obfuscate = await encryptorCTR(encryptKey, encryptIv);
    this.deobfuscate = await decryptorCTR(decryptKey, decryptIv);

    random = concatBuffers([random.slice(0, 56), codec, random.slice(60)]);

    random = concatBuffers([
      random.slice(0, 56),
      this.obfuscate(random).slice(56, 64)
    ]);

    this.header = random;
  }

  encodePacket(data: Uint8Array) {
    const dataLength = data.length >> 2;
    let length: Uint8Array;

    if (dataLength < 127) {
      length = pack(dataLength, "B");
    } else {
      length = concatBuffers([
        [127],
        readBufferFromBigInt(BigInt(dataLength), 3)
      ]);
    }
    return concatBuffers([length, data]);
  }

  async decodePacket() {
    const { connection } = this;
    const readData = await connection.read(1);

    let length = unpack(readData, "B");

    if (length >= 127) {
      length = unpack(
        concatBuffers([readData, await connection.read(3)]),
        "i",
        true
      );
    }

    const payload = await connection.read(length << 2);
    return payload;
  }
}
