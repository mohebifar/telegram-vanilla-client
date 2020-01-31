import { MTProtoPlainSender } from "./MTProtoPlainSender";
import {
  generateRandomBytes,
  readBigIntFromBuffer,
  readBufferFromBigInt,
  pack,
  concatBuffers,
  readBufferFromHex,
  getByteArray,
  modExp
} from "../binary";
import { serializeTLObject, invariant } from "../tl/types";
import { Factorizator } from "../crypto/Factorizer";
import * as RSA from "../crypto/RSA";
import { AuthKey } from "../crypto/AuthKey";
import { decryptIGE, sha1, encryptIGE } from "../crypto";
import { BinaryReader } from "../extensions/BinaryReader";
import { TLObjectTypes, ResPQ, ServerDHInnerData } from "../tl/TLObjects";

export async function performAuthentication(sender: MTProtoPlainSender) {
  // Step 1 sending: PQ Request, endianness doesn't matter since it's random
  let bytes = generateRandomBytes(16);

  const nonce = readBigIntFromBuffer(bytes, false, true);

  const request = concatBuffers([
    readBufferFromHex(0xf18e7ebe),
    readBufferFromBigInt(nonce, 16, true, true)
  ]);

  const resPQ = (await sender.send(request)) as ResPQ;
  if (!invariant(resPQ, "ResPQ")) {
    throw new Error("Unexpected response from the server");
  }
  console.debug("Starting authKey generation step 1");

  if (resPQ.nonce !== nonce) {
    throw new Error("Step 1 invalid nonce from server");
  }
  const pq = readBigIntFromBuffer(resPQ.pq, false, true);

  console.debug("Finished authKey generation step 1");
  console.debug("Starting authKey generation step 2");
  // Step 2 sending: DH Exchange
  let { p: initialP, q: initialQ } = Factorizator.factorize(pq);
  const p = getByteArray(initialP);
  const q = getByteArray(initialQ);

  bytes = generateRandomBytes(32);

  const newNonce = readBigIntFromBuffer(bytes, true, true);

  const pqInnerData = serializeTLObject({
    $t: "PQInnerData",
    pq: getByteArray(pq),
    p,
    q,
    nonce: resPQ.nonce,
    serverNonce: resPQ.serverNonce,
    newNonce
  });

  // sha_digest + data + random_bytes
  let cipherText = null;
  let targetFingerprint = null;
  for (const fingerprint of resPQ.serverPublicKeyFingerprints) {
    cipherText = await RSA.encrypt(fingerprint, pqInnerData);
    if (cipherText !== null && cipherText !== undefined) {
      targetFingerprint = fingerprint;
      break;
    }
  }
  if (cipherText === null || cipherText === undefined) {
    throw new Error("Step 2 could not find a valid key for fingerprints");
  }

  const reqDHParams = serializeTLObject({
    $t: "ReqDHParamsRequest",
    nonce: resPQ.nonce,
    serverNonce: resPQ.serverNonce,
    p,
    q,
    publicKeyFingerprint: targetFingerprint,
    encryptedData: cipherText
  });

  const serverDhParams = (await sender.send(reqDHParams)) as TLObjectTypes;

  if (serverDhParams.$t === "ServerDHParamsFail") {
    const sh = await sha1(
      readBufferFromBigInt(newNonce, 32, true, true).slice(4, 20)
    );
    const nnh = readBigIntFromBuffer(sh, true, true);
    if (serverDhParams.newNonceHash !== nnh) {
      throw new Error("Step 2 invalid DH fail nonce from server");
    }
  }

  if (serverDhParams.$t !== "ServerDHParamsOk") {
    throw new Error(`Step 2.2 answer was ${serverDhParams}`);
  }

  console.debug("Finished authKey generation step 2");
  console.debug("Starting authKey generation step 3");

  // Step 3 sending: Complete DH Exchange
  const { key, iv } = await generateKeyDataFromNonce(
    resPQ.serverNonce,
    newNonce
  );
  if (serverDhParams.encryptedAnswer.length % 16 !== 0) {
    // See PR#453
    throw new Error("Step 3 AES block size mismatch");
  }
  const plainTextAnswer = await decryptIGE(
    serverDhParams.encryptedAnswer,
    key,
    iv
  );
  const reader = new BinaryReader(plainTextAnswer);
  reader.read(20); // hash sum
  const serverDhInner = reader.tgReadObject() as ServerDHInnerData;

  if (serverDhInner.$t !== "ServerDHInnerData") {
    throw new Error(`Step 3 answer was ${serverDhInner}`);
  }

  if (serverDhInner.nonce !== resPQ.nonce) {
    throw new Error("Step 3 Invalid nonce in encrypted answer");
  }
  if (serverDhInner.serverNonce !== resPQ.serverNonce) {
    throw new Error("Step 3 Invalid server nonce in encrypted answer");
  }

  const dhPrime = readBigIntFromBuffer(serverDhInner.dhPrime, false, false);
  const ga = readBigIntFromBuffer(serverDhInner.gA, false, false);
  const timeOffset =
    serverDhInner.serverTime - Math.floor(new Date().getTime() / 1000);

  const b = readBigIntFromBuffer(generateRandomBytes(256), false, false);
  const gb = modExp(BigInt(serverDhInner.g), b, dhPrime);
  const gab = modExp(ga, b, dhPrime);

  // Prepare client DH Inner Data
  const clientDhInner = serializeTLObject({
    $t: "ClientDHInnerData",
    nonce: resPQ.nonce,
    serverNonce: resPQ.serverNonce,
    retryId: BigInt(0),
    gB: getByteArray(gb)
  });

  const clientDdhInnerHashed = concatBuffers([
    await sha1(clientDhInner),
    clientDhInner
  ]);

  // Encryption
  const clientDhEncrypted = await encryptIGE(clientDdhInnerHashed, key, iv);
  const setClientDHParamsRequest = serializeTLObject({
    $t: "SetClientDHParamsRequest",
    encryptedData: clientDhEncrypted,
    nonce: resPQ.nonce,
    serverNonce: resPQ.serverNonce
  });
  const dhGen = (await sender.send(setClientDHParamsRequest)) as TLObjectTypes;

  if (
    !(
      dhGen.$t === "DhGenOk" ||
      dhGen.$t === "DhGenRetry" ||
      dhGen.$t === "DhGenFail"
    )
  ) {
    throw new Error(`Step 3.1 answer was ${dhGen}`);
  }

  const { name } = dhGen.constructor;
  if (dhGen.nonce !== resPQ.nonce) {
    throw new Error(`Step 3 invalid ${name} nonce from server`);
  }

  if (dhGen.serverNonce !== resPQ.serverNonce) {
    throw new Error(`Step 3 invalid ${name} server nonce from server`);
  }
  const authKey = new AuthKey();
  await authKey.setKey(getByteArray(gab));

  const nonceTypes = ["DhGenOk", "DhGenRetry", "DhGenFail"];
  const nonceNumber = 1 + nonceTypes.indexOf(dhGen.$t);

  const newNonceHash = await calcNewNonceHash(newNonce, nonceNumber, authKey);
  const dhHash = dhGen[`newNonceHash${nonceNumber}`];

  if (dhHash !== newNonceHash) {
    throw new Error("Step 3 invalid new nonce hash");
  }

  if (dhGen.$t !== "DhGenOk") {
    throw new Error(`Step 3.2 answer was ${dhGen}`);
  }
  console.debug("Finished authKey generation step 3", { authKey, timeOffset });
  // store.setServerTime(serverDhInner.serverTime);

  return { authKey, timeOffset };
}

async function calcNewNonceHash(
  nonce: bigint,
  nonceNumber: number,
  authKey: AuthKey
) {
  const newNonce = readBufferFromBigInt(nonce, 32, true, true);

  const data = concatBuffers([
    newNonce,
    pack(nonceNumber, "B"),
    pack(authKey.auxHash, "Q", true)
  ]);

  // Calculates the message key from the given data
  const shaData = (await sha1(data)).slice(4, 20);
  return readBigIntFromBuffer(shaData, true, true);
}

async function generateKeyDataFromNonce(
  serverNonceBigInt: bigint,
  newNonceBigInt: bigint
) {
  const serverNonce = readBufferFromBigInt(serverNonceBigInt, 16, true, true);
  const newNonce = readBufferFromBigInt(newNonceBigInt, 32, true, true);
  const hash1 = await sha1(concatBuffers([newNonce, serverNonce]));
  const hash2 = await sha1(concatBuffers([serverNonce, newNonce]));
  const hash3 = await sha1(concatBuffers([newNonce, newNonce]));
  const keyBuffer = concatBuffers([hash1, hash2.slice(0, 12)]);
  const ivBuffer = concatBuffers([
    hash2.slice(12, 20),
    hash3,
    newNonce.slice(0, 4)
  ]);
  return { key: keyBuffer, iv: ivBuffer };
}
