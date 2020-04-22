import { concatBuffers } from "../binary";
import { AES } from "./AES";

type Key = Uint8Array | number[];

export async function encryptIGE(rawInput: Uint8Array, key: Key, iv: Key) {
  const aes = new AES(key);
  const padding = rawInput.length % 16;
  let input = rawInput;
  if (padding) {
    input = new Uint8Array(rawInput.length + 16 - padding);
    input.set(rawInput);
  }

  let iv1 = iv.slice(0, Math.floor(iv.length / 2));
  let iv2 = iv.slice(Math.floor(iv.length / 2));

  const cipherText: Uint8Array[] = [];
  const blocksCount = Math.floor(input.length / 16);
  for (let blockIndex = 0; blockIndex < blocksCount; blockIndex++) {
    const block = input
      .slice(blockIndex * 16, blockIndex * 16 + 16)
      .map((v, i) => (v ^= iv1[i]));

    const jsResult = new Uint8Array(16);
    aes.encrypt(block, jsResult);
    const cipherBlock = jsResult.map((v, i) => (v ^= iv2[i]));
    iv1 = cipherBlock;
    iv2 = input.slice(blockIndex * 16, blockIndex * 16 + 16);
    cipherText.push(cipherBlock);
  }

  return concatBuffers(cipherText);
}

export async function decryptIGE(cipherText: Uint8Array, key: Key, iv: Key) {
  let iv1 = iv.slice(0, Math.floor(iv.length / 2));
  let iv2 = iv.slice(Math.floor(iv.length / 2));

  const plainText: Uint8Array[] = [];
  const cipherTextBlock = new Uint8Array(16);
  const blocksCount = Math.floor(cipherText.length / 16);

  const aes = new AES(key);

  for (let blockIndex = 0; blockIndex < blocksCount; blockIndex++) {
    for (let i = 0; i < 16; i++) {
      cipherTextBlock[i] = cipherText[blockIndex * 16 + i] ^ iv2[i];
    }

    const jsResult = new Uint8Array(16);
    aes.decrypt(cipherTextBlock, jsResult);
    const plainTextBlock = jsResult.map((v, i) => v ^ iv1[i]);
    iv1 = cipherText.slice(blockIndex * 16, blockIndex * 16 + 16);
    iv2 = plainTextBlock;

    plainText.push(plainTextBlock);
  }

  return concatBuffers(plainText);
}

export const decryptorCTR = encryptorCTR;

export async function encryptorCTR(key: Key, iv: Uint8Array) {
  const aes = new AES(key);
  let counter = iv;
  let remainingCounter = new Uint8Array(16);
  let remainingCounterIndex = 16;

  const counterIncerement = () => {
    for (var i = 15; i >= 0; i--) {
      if (counter[i] === 255) {
        counter[i] = 0;
      } else {
        counter[i]++;
        break;
      }
    }
  };

  return (rawInput: Uint8Array) => {
    const encrypted = new Uint8Array(rawInput);
    for (var i = 0; i < encrypted.length; i++) {
      if (remainingCounterIndex === 16) {
        aes.encrypt(counter, remainingCounter);
        remainingCounterIndex = 0;
        counterIncerement();
      }
      encrypted[i] ^= remainingCounter[remainingCounterIndex++];
    }

    return encrypted;
  };
}

export async function sha256(data: Uint8Array) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

export async function sha1(data: Uint8Array) {
  return new Uint8Array(await crypto.subtle.digest("SHA-1", data));
}

/*
export const crc32 = (function() {
  const table = new Uint32Array(256);

  // Pre-generate crc32 polynomial lookup table
  // http://wiki.osdev.org/CRC32#Building_the_Lookup_Table
  // ... Actually use Alex's because it generates the correct bit order
  //     so no need for the reversal function
  for (let i = 256; i--; ) {
    let tmp = i;

    for (let k = 8; k--; ) {
      tmp = tmp & 1 ? 3988292384 ^ (tmp >>> 1) : tmp >>> 1;
    }

    table[i] = tmp;
  }

  // crc32b
  // Example input        : [97, 98, 99, 100, 101] (Uint8Array)
  // Example output       : 2240272485 (Uint32)
  return function(data) {
    let crc = -1; // Begin with all bits set ( 0xffffffff )

    for (let i = 0, l = data.length; i < l; i++) {
      crc = (crc >>> 8) ^ table[(crc & 255) ^ data[i]];
    }

    return (crc ^ -1) >>> 0; // Apply binary NOT
  };
})();
*/
