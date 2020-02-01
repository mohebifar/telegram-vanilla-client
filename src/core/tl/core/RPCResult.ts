import { BigInteger as JBigInt } from "big-integer";
import { BinaryReader } from "../../extensions/BinaryReader";
import {
  CONSTRUCTOR_ID as GZIP_CONSTRUCTOR_ID,
  gzipPackedReader
} from "./GZIPPacked";

export interface RPCResult {
  $t: "RPCResult";
  reqMsgId: JBigInt;
  body?: Uint8Array;
  error?: any;
}

const RPC_ERROR_CONSTRUCTOR_ID = 0x2144ca19;

export const CONSTRUCTOR_ID = 0xf35c6d01;

export function rpcResultReader(
  tlObjectReader: Function,
  reader: BinaryReader
): RPCResult {
  const msgId = reader.readLong();
  const innerCode = reader.readInt(false);

  if (innerCode === RPC_ERROR_CONSTRUCTOR_ID) {
    return {
      $t: "RPCResult",
      reqMsgId: msgId,
      body: null,
      error: tlObjectReader(RPC_ERROR_CONSTRUCTOR_ID)(reader)
    };
  }

  if (innerCode === GZIP_CONSTRUCTOR_ID) {
    const gzipPacked = gzipPackedReader(tlObjectReader, reader);

    return {
      $t: "RPCResult",
      reqMsgId: msgId,
      body: gzipPacked.data
    };
  }

  reader.seek(-4);
  // This reader.read() will read more than necessary, but it's okay.
  // We could make use of MessageContainer's length here, but since
  // it's not necessary we don't need to care about it.
  return {
    $t: "RPCResult",
    reqMsgId: msgId,
    body: reader.read(),
    error: null
  };
}
