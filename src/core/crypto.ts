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

  let plainText = [];
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

  return plainText;
}

async function initAES(
  key: Uint8Array | number[],
  type: "encrypt" | "decrypt"
) {
  const binary = await import("./aes.wasm");
  const module = await WebAssembly.compile(binary.default);
  const memory = new WebAssembly.Memory({ initial: 2 });

  const instance = await WebAssembly.instantiate(module, {
    env: {
      memory,
      consoleLog: () => {
        console.log("done");
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
