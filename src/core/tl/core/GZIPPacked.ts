import { deflate, inflate } from "pako";
import { pack, concatBuffers } from "../../../utils/binary";
import { BinaryReader } from "../../extensions/BinaryReader";
import { serializeBytes, TLObjectType } from "../types";

export const CONSTRUCTOR_ID = 0x3072cfa1;

interface GZIPPacked extends TLObjectType<"GZIPPacked", 0x3072cfa1, 0> {
  data: Uint8Array;
}

export function gzipPackedReader(
  _: Function,
  reader: BinaryReader
): GZIPPacked {
  const bytes = reader.tgReadBytes();
  const data = inflate(bytes);

  return {
    constructorId: CONSTRUCTOR_ID,
    $t: "GZIPPacked",
    data
  };
}

// GZIP is currently buggy
export function gzipIfLarge(contentRelated: boolean, data: Uint8Array) {
  if (contentRelated && data.length > 512) {
    const gzipped = serializeGZIPPacked(data);
    if (gzipped.length < data.length) {
      return gzipped;
    }
  }

  return data;
}

function serializeGZIPPacked(data: Uint8Array) {
  return concatBuffers([
    pack(CONSTRUCTOR_ID, "I"),
    serializeBytes(deflate(data))
  ]);
}
