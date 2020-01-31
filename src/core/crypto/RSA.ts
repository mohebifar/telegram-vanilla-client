import { sha1 } from "../crypto";
import {
  readBufferFromBigInt,
  readBigIntFromBuffer,
  generateRandomBytes,
  modExp,
  concatBuffers,
  getByteArray,
  base64ToBufferAsync
} from "../binary";
import { serializeBytes } from "../../core/tl/types";
import { BerReader } from "./ASN1";

interface RSAKeyPair {
  n: Uint8Array; // Modulus
  e: Uint8Array; // Public Exponent
}

const serverKeys = new Map<bigint, RSAKeyPair>();

const PUBLIC_OPENING_BOUNDARY = "-----BEGIN RSA PUBLIC KEY-----";
const PUBLIC_CLOSING_BOUNDARY = "-----END RSA PUBLIC KEY-----";

const publicKeys = [
  `-----BEGIN RSA PUBLIC KEY-----
  MIIBCgKCAQEAwVACPi9w23mF3tBkdZz+zwrzKOaaQdr01vAbU4E1pvkfj4sqDsm6
  lyDONS789sVoD/xCS9Y0hkkC3gtL1tSfTlgCMOOul9lcixlEKzwKENj1Yz/s7daS
  an9tqw3bfUV/nqgbhGX81v/+7RFAEd+RwFnK7a+XYl9sluzHRyVVaTTveB2GazTw
  Efzk2DWgkBluml8OREmvfraX3bkHZJTKX4EQSjBbbdJ2ZXIsRrYOXfaA+xayEGB+
  8hdlLmAjbCVfaigxX0CDqWeR1yFL9kwd9P0NsZRPsmoqVwMbMu7mStFai6aIhc3n
  Slv8kg9qv1m6XHVQY3PnEw+QQtqSIXklHwIDAQAB
  -----END RSA PUBLIC KEY-----`,

  `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAxq7aeLAqJR20tkQQMfRn+ocfrtMlJsQ2Uksfs7Xcoo77jAid0bRt
ksiVmT2HEIJUlRxfABoPBV8wY9zRTUMaMA654pUX41mhyVN+XoerGxFvrs9dF1Ru
vCHbI02dM2ppPvyytvvMoefRoL5BTcpAihFgm5xCaakgsJ/tH5oVl74CdhQw8J5L
xI/K++KJBUyZ26Uba1632cOiq05JBUW0Z2vWIOk4BLysk7+U9z+SxynKiZR3/xdi
XvFKk01R3BHV+GUKM2RYazpS/P8v7eyKhAbKxOdRcFpHLlVwfjyM1VlDQrEZxsMp
NTLYXb6Sce1Uov0YtNx5wEowlREH1WOTlwIDAQAB
-----END RSA PUBLIC KEY-----`,

  `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAsQZnSWVZNfClk29RcDTJQ76n8zZaiTGuUsi8sUhW8AS4PSbPKDm+
DyJgdHDWdIF3HBzl7DHeFrILuqTs0vfS7Pa2NW8nUBwiaYQmPtwEa4n7bTmBVGsB
1700/tz8wQWOLUlL2nMv+BPlDhxq4kmJCyJfgrIrHlX8sGPcPA4Y6Rwo0MSqYn3s
g1Pu5gOKlaT9HKmE6wn5Sut6IiBjWozrRQ6n5h2RXNtO7O2qCDqjgB2vBxhV7B+z
hRbLbCmW0tYMDsvPpX5M8fsO05svN+lKtCAuz1leFns8piZpptpSCFn7bWxiA9/f
x5x17D7pfah3Sy2pA+NDXyzSlGcKdaUmwQIDAQAB
-----END RSA PUBLIC KEY-----`,

  `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAwqjFW0pi4reKGbkc9pK83Eunwj/k0G8ZTioMMPbZmW99GivMibwa
xDM9RDWabEMyUtGoQC2ZcDeLWRK3W8jMP6dnEKAlvLkDLfC4fXYHzFO5KHEqF06i
qAqBdmI1iBGdQv/OQCBcbXIWCGDY2AsiqLhlGQfPOI7/vvKc188rTriocgUtoTUc
/n/sIUzkgwTqRyvWYynWARWzQg0I9olLBBC2q5RQJJlnYXZwyTL3y9tdb7zOHkks
WV9IMQmZmyZh/N7sMbGWQpt4NMchGpPGeJ2e5gHBjDnlIf2p1yZOYeUYrdbwcS0t
UiggS4UeE8TzIuXFQxw7fzEIlmhIaq3FnwIDAQAB
-----END RSA PUBLIC KEY-----`
];

let loadedDefault = false;

async function loadDefault() {
  if (loadedDefault) {
    return;
  }

  for (const pub of publicKeys) {
    await addKey(pub);
  }

  loadedDefault = true;
}

async function computeFingerprint(key: RSAKeyPair) {
  const buf = readBigIntFromBuffer(key.n, false);
  const nArray = getByteArray(buf);

  const n = serializeBytes(nArray);
  const e = serializeBytes(key.e);

  // Telegram uses the last 8 bytes as the fingerprint
  const sh = await sha1(concatBuffers([n, e]));
  return readBigIntFromBuffer(sh.slice(-8), true, true);
}

async function readKey(publicKey: string | Uint8Array): Promise<RSAKeyPair> {
  let buffer: Uint8Array;

  if (typeof publicKey === "string") {
    const pem = publicKey
      .replace(PUBLIC_OPENING_BOUNDARY, "")
      .replace(PUBLIC_CLOSING_BOUNDARY, "")
      .replace(/\s+|\n\r|\n|\r$/gm, "");

    buffer = await base64ToBufferAsync(pem);
  } else {
    buffer = publicKey;
  }

  var body = new BerReader(buffer);
  body.readSequence();

  return {
    n: body.readString(0x02), // modulus
    e: body.readString(0x02) // publicExponent
  };
}

async function addKey(publicKey: string | Uint8Array) {
  const key = await readKey(publicKey);
  const fingerPrint = await computeFingerprint(key);

  serverKeys.set(fingerPrint, key);
}

async function encrypt(fingerprint: bigint, data: Uint8Array) {
  await loadDefault();
  const keyPair = serverKeys.get(fingerprint);
  if (!keyPair) {
    return undefined;
  }

  const buf = readBigIntFromBuffer(keyPair.n, false);
  const rand = generateRandomBytes(235 - data.length);
  const toEncrypt = concatBuffers([await sha1(data), data, rand]);
  const payload = readBigIntFromBuffer(toEncrypt, false);
  const encrypted = modExp(payload, readBigIntFromBuffer(keyPair.e), buf);
  const block = readBufferFromBigInt(encrypted, 256, false);
  return block;
}

export { encrypt, addKey };
