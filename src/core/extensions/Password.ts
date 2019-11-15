import { Factorizator } from "../crypto/Factorizer";
import {
  readBigIntFromBuffer,
  modExp,
  readBufferFromBigInt,
  concatBuffers,
  generateRandomBytes,
  readBytesFromString,
  byteBuffersEqual,
  mod
} from "../../utils/utils";
import {
  PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow,
  account_Password,
  InputCheckPasswordSRP
} from "../tl/TLObjects";
import { sha256 } from "../crypto";

const SIZE_FOR_HASH = 256;

function checkPrimeAndGoodCheck(prime: bigint, g: bigint) {
  const goodPrimeBitsCount = 2048;
  if (prime < 0 || prime.toString(2).length !== goodPrimeBitsCount) {
    throw new Error(
      `bad prime count ${
        prime.toString(2).length
      },expected ${goodPrimeBitsCount}`
    );
  }
  // TODO this is kinda slow
  if (Factorizator.factorize(prime)[0] !== 1) {
    throw new Error('give "prime" is not prime');
  }
  if (g === BigInt(2)) {
    if (prime % BigInt(8) !== BigInt(7)) {
      throw new Error(`bad g mod8`);
    }
  } else if (g === BigInt(3)) {
    if (prime % BigInt(3) !== BigInt(2)) {
      throw new Error(`bad g, mod3`);
    }
    // eslint-disable-next-line no-empty
  } else if (g === BigInt(4)) {
  } else if (g === BigInt(5)) {
    if (![BigInt(1), BigInt(4)].includes(prime % BigInt(5))) {
      throw new Error(`bad g, mod8`);
    }
  } else if (g === BigInt(6)) {
    if (![BigInt(19), BigInt(23)].includes(prime % BigInt(24))) {
      throw new Error(`bad g, mod8}`);
    }
  } else if (g === BigInt(7)) {
    if (![BigInt(3), BigInt(5), BigInt(6)].includes(prime % BigInt(7))) {
      throw new Error(`bad g, mod8`);
    }
  } else {
    throw new Error(`bad g`);
  }
  const primeSub1Div2 = (prime - BigInt(1)) / BigInt(2);
  if (Factorizator.factorize(primeSub1Div2)[0] !== 1) {
    throw new Error("(prime - 1) // 2 is not prime");
  }
}

function checkPrimeAndGood(primeBytes: Uint8Array, g: number) {
  const goodPrime = new Uint8Array([
    0xc7,
    0x1c,
    0xae,
    0xb9,
    0xc6,
    0xb1,
    0xc9,
    0x04,
    0x8e,
    0x6c,
    0x52,
    0x2f,
    0x70,
    0xf1,
    0x3f,
    0x73,
    0x98,
    0x0d,
    0x40,
    0x23,
    0x8e,
    0x3e,
    0x21,
    0xc1,
    0x49,
    0x34,
    0xd0,
    0x37,
    0x56,
    0x3d,
    0x93,
    0x0f,
    0x48,
    0x19,
    0x8a,
    0x0a,
    0xa7,
    0xc1,
    0x40,
    0x58,
    0x22,
    0x94,
    0x93,
    0xd2,
    0x25,
    0x30,
    0xf4,
    0xdb,
    0xfa,
    0x33,
    0x6f,
    0x6e,
    0x0a,
    0xc9,
    0x25,
    0x13,
    0x95,
    0x43,
    0xae,
    0xd4,
    0x4c,
    0xce,
    0x7c,
    0x37,
    0x20,
    0xfd,
    0x51,
    0xf6,
    0x94,
    0x58,
    0x70,
    0x5a,
    0xc6,
    0x8c,
    0xd4,
    0xfe,
    0x6b,
    0x6b,
    0x13,
    0xab,
    0xdc,
    0x97,
    0x46,
    0x51,
    0x29,
    0x69,
    0x32,
    0x84,
    0x54,
    0xf1,
    0x8f,
    0xaf,
    0x8c,
    0x59,
    0x5f,
    0x64,
    0x24,
    0x77,
    0xfe,
    0x96,
    0xbb,
    0x2a,
    0x94,
    0x1d,
    0x5b,
    0xcd,
    0x1d,
    0x4a,
    0xc8,
    0xcc,
    0x49,
    0x88,
    0x07,
    0x08,
    0xfa,
    0x9b,
    0x37,
    0x8e,
    0x3c,
    0x4f,
    0x3a,
    0x90,
    0x60,
    0xbe,
    0xe6,
    0x7c,
    0xf9,
    0xa4,
    0xa4,
    0xa6,
    0x95,
    0x81,
    0x10,
    0x51,
    0x90,
    0x7e,
    0x16,
    0x27,
    0x53,
    0xb5,
    0x6b,
    0x0f,
    0x6b,
    0x41,
    0x0d,
    0xba,
    0x74,
    0xd8,
    0xa8,
    0x4b,
    0x2a,
    0x14,
    0xb3,
    0x14,
    0x4e,
    0x0e,
    0xf1,
    0x28,
    0x47,
    0x54,
    0xfd,
    0x17,
    0xed,
    0x95,
    0x0d,
    0x59,
    0x65,
    0xb4,
    0xb9,
    0xdd,
    0x46,
    0x58,
    0x2d,
    0xb1,
    0x17,
    0x8d,
    0x16,
    0x9c,
    0x6b,
    0xc4,
    0x65,
    0xb0,
    0xd6,
    0xff,
    0x9c,
    0xa3,
    0x92,
    0x8f,
    0xef,
    0x5b,
    0x9a,
    0xe4,
    0xe4,
    0x18,
    0xfc,
    0x15,
    0xe8,
    0x3e,
    0xbe,
    0xa0,
    0xf8,
    0x7f,
    0xa9,
    0xff,
    0x5e,
    0xed,
    0x70,
    0x05,
    0x0d,
    0xed,
    0x28,
    0x49,
    0xf4,
    0x7b,
    0xf9,
    0x59,
    0xd9,
    0x56,
    0x85,
    0x0c,
    0xe9,
    0x29,
    0x85,
    0x1f,
    0x0d,
    0x81,
    0x15,
    0xf6,
    0x35,
    0xb1,
    0x05,
    0xee,
    0x2e,
    0x4e,
    0x15,
    0xd0,
    0x4b,
    0x24,
    0x54,
    0xbf,
    0x6f,
    0x4f,
    0xad,
    0xf0,
    0x34,
    0xb1,
    0x04,
    0x03,
    0x11,
    0x9c,
    0xd8,
    0xe3,
    0xb9,
    0x2f,
    0xcc,
    0x5b
  ]);
  if (byteBuffersEqual(goodPrime, primeBytes)) {
    if ([3, 4, 5, 7].includes(g)) {
      return; // It's good
    }
  }
  checkPrimeAndGoodCheck(readBigIntFromBuffer(primeBytes, false), BigInt(g));
}

function isGoodLarge(number: bigint, p: bigint) {
  return number > BigInt(0) && p - number > BigInt(0);
}

function numBytesForHash(number: Uint8Array) {
  return concatBuffers([new Uint8Array(SIZE_FOR_HASH - number.length), number]);
}

function bigNumForHash(g: bigint) {
  return readBufferFromBigInt(g, SIZE_FOR_HASH, false);
}

/**
 *
 * @param modexp
 * @param prime
 * @returns {Boolean}
 */
function isGoodModExpFirst(modexp: bigint, prime: bigint) {
  const diff = prime - modexp;

  const minDiffBitsCount = 2048 - 64;
  const maxModExpSize = 256;

  return !(
    diff < 0 ||
    diff.toString(2).length < minDiffBitsCount ||
    modexp.toString(2).length < minDiffBitsCount ||
    Math.floor((modexp.toString(2).length + 7) / 8) > maxModExpSize
  );
}

function xor(a: Uint8Array, b: Uint8Array) {
  const length = Math.min(a.length, b.length);

  for (let i = 0; i < length; i++) {
    a[i] = a[i] ^ b[i];
  }

  return a;
}

async function pbkdf2sha512(
  password: Uint8Array,
  salt: Uint8Array,
  iterations: number
) {
  const key = await window.crypto.subtle.importKey(
    "raw",
    password,
    {
      name: "PBKDF2"
    } as any,
    false,
    ["deriveBits"]
  );

  const buffer = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: { name: "SHA-512" }
    },
    key,
    512
  );

  return new Uint8Array(buffer);
}

async function computeHash(
  algo: PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow,
  password: string
) {
  const hash1 = await sha256(
    concatBuffers([algo.salt1, readBytesFromString(password), algo.salt1])
  );
  const hash2 = await sha256(concatBuffers([algo.salt2, hash1, algo.salt2]));
  const hash3 = await pbkdf2sha512(hash2, algo.salt1, 100000);
  return await sha256(concatBuffers([algo.salt2, hash3, algo.salt2]));
}

export async function computeDigest(
  algo: PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow,
  password: string
) {
  try {
    checkPrimeAndGood(algo.p, algo.g);
  } catch (e) {
    throw new Error("bad p/g in password");
  }

  const value = modExp(
    BigInt(algo.g),
    readBigIntFromBuffer(await computeHash(algo, password), false),
    readBigIntFromBuffer(algo.p, false)
  );
  return bigNumForHash(value);
}

export async function computeCheck(
  request: account_Password,
  password: string
): Promise<InputCheckPasswordSRP> {
  const algo = request.currentAlgo;
  if (
    algo.$t !==
    "PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow"
  ) {
    throw new Error(`Unsupported password algorithm ${algo.$t}`);
  }

  const pwHash = await computeHash(algo, password);
  const p = readBigIntFromBuffer(algo.p, false);
  const g = algo.g;
  const B = readBigIntFromBuffer(request.srp_B, false);
  try {
    checkPrimeAndGood(algo.p, g);
  } catch (e) {
    throw new Error("bad /g in password");
  }
  if (!isGoodLarge(B, p)) {
    throw new Error("bad b in check");
  }
  const x = readBigIntFromBuffer(pwHash, false);
  const pForHash = numBytesForHash(algo.p);
  const gForHash = bigNumForHash(BigInt(g));
  const bForHash = numBytesForHash(request.srp_B);
  const gX = modExp(BigInt(g), x, p);
  const k = readBigIntFromBuffer(
    await sha256(concatBuffers([pForHash, gForHash])),
    false
  );
  const kgX = (k * gX) % p;
  const generateAndCheckRandom = async (): Promise<[
    bigint,
    Uint8Array,
    bigint
  ]> => {
    const randomSize = 256;

    while (true) {
      const random = generateRandomBytes(randomSize);
      const a = readBigIntFromBuffer(random, false);
      const A = modExp(BigInt(g), a, p);
      if (isGoodModExpFirst(A, p)) {
        const aForHash = bigNumForHash(A);
        const u = readBigIntFromBuffer(
          await sha256(concatBuffers([aForHash, bForHash])),
          false
        );
        if (u > BigInt(0)) {
          return [a, aForHash, u];
        }
      }
    }
  };

  const [a, aForHash, u] = await generateAndCheckRandom();
  const gB: bigint = mod(B - kgX, p) as any;

  if (!isGoodModExpFirst(gB, p)) {
    throw new Error("bad gB");
  }

  const ux = u * x;
  const aUx = a + ux;
  const S = modExp(gB, aUx, p);
  const K = await sha256(bigNumForHash(S));
  const M1 = await sha256(
    concatBuffers([
      xor(await sha256(pForHash), await sha256(gForHash)),
      await sha256(algo.salt1),
      await sha256(algo.salt2),
      aForHash,
      bForHash,
      K
    ])
  );

  return {
    $t: "InputCheckPasswordSRP",
    srpId: request.srpId,
    A: aForHash,
    M1
  };
}
