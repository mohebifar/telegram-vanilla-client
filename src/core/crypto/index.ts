import aesWasm from "./aes.wasm";

type Key = Uint8Array | number[];

export async function encryptIGE(rawInput: Uint8Array, key: Key, iv: Key) {
  const cipher = await initAES(key, "encrypt");
  const padding = rawInput.length % 16;
  let input = rawInput;
  if (padding) {
    input = new Uint8Array(rawInput.length + 16 - padding);
    input.set(rawInput);
  }

  let iv1 = iv.slice(0, Math.floor(iv.length / 2));
  let iv2 = iv.slice(Math.floor(iv.length / 2));

  let cipherText = [];
  const blocksCount = Math.floor(input.length / 16);
  for (let blockIndex = 0; blockIndex < blocksCount; blockIndex++) {
    const block = input
      .slice(blockIndex * 16, blockIndex * 16 + 16)
      .map((v, i) => (v ^= iv1[i]));

    const cipherBlock = cipher(block).map((v, i) => (v ^= iv2[i]));
    iv1 = cipherBlock;
    iv2 = input.slice(blockIndex * 16, blockIndex * 16 + 16);
    cipherText = cipherText.concat(Array.from(cipherBlock));
  }

  return new Uint8Array(cipherText);
}

export async function decryptIGE(cipherText: Uint8Array, key: Key, iv: Key) {
  const decipher = await initAES(key, "decrypt");

  let iv1 = iv.slice(0, Math.floor(iv.length / 2));
  let iv2 = iv.slice(Math.floor(iv.length / 2));

  let plainText: number[] = [];
  const cipherTextBlock = new Uint8Array(16);
  const blocksCount = Math.floor(cipherText.length / 16);

  for (let blockIndex = 0; blockIndex < blocksCount; blockIndex++) {
    for (let i = 0; i < 16; i++) {
      cipherTextBlock[i] = cipherText[blockIndex * 16 + i] ^ iv2[i];
    }

    const plainTextBlock = decipher(cipherTextBlock).map((v, i) => v ^ iv1[i]);
    iv1 = cipherText.slice(blockIndex * 16, blockIndex * 16 + 16);
    iv2 = plainTextBlock;

    plainText = plainText.concat(Array.from(plainTextBlock));
  }

  return new Uint8Array(plainText);
}

export const decryptorCTR = encryptorCTR;

export async function encryptorCTR(key: Key, iv: Uint8Array) {
  const cipher = await initAES(key, "encrypt");
  let counter = iv;
  let remainingCounter = null;
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
        remainingCounter = cipher(counter);
        remainingCounterIndex = 0;
        counterIncerement();
      }
      encrypted[i] ^= remainingCounter[remainingCounterIndex++];
    }

    return encrypted;
  };
}

async function initAES(
  key: Uint8Array | number[],
  type: "encrypt" | "decrypt"
) {
  const module = await WebAssembly.compile(aesWasm);
  const memory = new WebAssembly.Memory({ initial: 2 });

  const instance = await WebAssembly.instantiate(module, {
    env: {
      memory,
      consoleLog: () => {
        // console.log("done");
      }
    }
  });

  const inputBuffer = new Uint8Array(memory.buffer, 0, 16);

  const keyBuffer = new Uint8Array(memory.buffer, 32, 32);
  keyBuffer.set(key);

  const fn =
    type === "encrypt"
      ? instance.exports.AES_ECB_encrypt
      : instance.exports.AES_ECB_decrypt;

  return (input: Uint8Array) => {
    inputBuffer.set(input);
    fn(0, 32);
    return inputBuffer.slice();
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
