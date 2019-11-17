import { BinaryReader } from "../extensions/BinaryReader";
import {
  pack,
  concatBuffers,
  readBufferFromBigInt,
  readBytesFromString
} from "../../utils/binary";
import { tlObjectsDefinitions } from "./schema";
import { TLObjectTypes } from "./TLObjects";
import {
  gzipPackedReader,
  CONSTRUCTOR_ID as GZIP_CONSTRUCTOR_ID
} from "./core/GZIPPacked";
import {
  RPCResult,
  rpcResultReader,
  CONSTRUCTOR_ID as RPC_RESULT_CONSTRUCTOR_ID
} from "./core/RPCResult";
import {
  MessageContainer,
  messageContaienerReader,
  CONSTRUCTOR_ID as MESSAGE_CONTAINER_CONSTRUCTOR_ID
} from "./core/MessageContainer";

type CoreTypes = MessageContainer | RPCResult;

type TLObjectWithCoreTypes = TLObjectTypes | CoreTypes;

const vectorRegex = /Vector<(\w+)>/;
const flagRegex = /Flag(\d+)<(\w+|\w+<\w+>)>/;

const primitiveTypes = (<const>[
  "string",
  "bytes",
  "int",
  "long",
  "int128",
  "int256",
  "double",
  "Bool",
  "true"
]) as readonly string[];

type Reader<T> = (reader: BinaryReader) => T;
type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never;

type PrimitiveTypes = typeof primitiveTypes[number];
type SchemaTypes = PrimitiveTypes | "#FLAG" | string;
type SchemaArgDefinition = [keyof TypesCombined, SchemaTypes];
type TLTypeNames = TLObjectTypes["$t"];
type TypeDefinition = [[TLTypeNames, number], SchemaArgDefinition[]]; // [[name, subclassOfId], Definitiions[]]
type TypesCombined = UnionToIntersection<TLObjectTypes>;
export type TLObjectDefinition = [
  TLObjectTypes["constructorId"],
  TypeDefinition
];

export interface TLObjectType<Type, ConstructorId, SubclassOfId> {
  constructorId?: ConstructorId;
  subclassOfId?: SubclassOfId;
  $t: Type;
}

const vectorConstructorId = pack(0x1cb5c415, "I", true);

type MapType = TypeDefinition | Reader<CoreTypes>;

const tlObjectsDefintionMap = new Map<number, MapType>(
  tlObjectsDefinitions as any
);

tlObjectsDefintionMap.set(GZIP_CONSTRUCTOR_ID, gzipPackedReader as any);
tlObjectsDefintionMap.set(RPC_RESULT_CONSTRUCTOR_ID, rpcResultReader as any);
tlObjectsDefintionMap.set(
  MESSAGE_CONTAINER_CONSTRUCTOR_ID,
  messageContaienerReader as any
);

const tlObjectsDefintionMapByType = new Map<TLTypeNames, TLObjectDefinition>();

tlObjectsDefintionMap.forEach((definition, constructorId) => {
  if (Array.isArray(definition)) {
    const [[name]] = definition;
    tlObjectsDefintionMapByType.set(name, [constructorId as any, definition]);
  }
});

export function tlObjectReader(
  contructorId: number
): Reader<TLObjectWithCoreTypes | any[] | boolean> | undefined {
  if (!tlObjectsDefintionMap.has(contructorId)) {
    if (contructorId === 0x997275b5) {
      return _ => true;
    } else if (contructorId === 0xbc799737) {
      return _ => false;
    } else if (contructorId === 0x1cb5c415) {
      const vector = [];
      const length = this.readInt();
      for (let i = 0; i < length; i++) {
        vector.push(this.tgReadObject());
      }

      return _ => vector;
    }

    return undefined;
  }

  const def = tlObjectsDefintionMap.get(contructorId);

  if (typeof def === "function") {
    return def.bind(this, tlObjectReader);
  }

  const [[objectName, subclassOfId], args] = def;

  const readScalarArg = (type: string, reader: BinaryReader): any => {
    if (primitiveTypes.includes(type)) {
      return deserializePrimitive(type, reader);
    }

    return reader.tgReadObject();
  };

  return (reader: BinaryReader) => {
    const object = { $t: objectName, subclassOfId };

    let flagIndicator: number | undefined;

    args.forEach(([name, type]) => {
      let isFlag = false;
      let flag: number;

      if (flagRegex.test(type)) {
        isFlag = true;
        const matches = type.match(flagRegex);
        flag = 2 ** Number(matches[1]);
        type = matches[2];

        if (isFlag && !(flagIndicator & flag)) {
          return null;
        }
      }

      if (type === "#FLAG") {
        flagIndicator = reader.readInt();
      } else if (vectorRegex.test(type)) {
        const innerType = type.match(vectorRegex)[1] as PrimitiveTypes;
        reader.readInt(); // Vector ID
        const len = reader.readInt();
        const value = [];

        for (let i = 0; i < len; i++) {
          value.push(readScalarArg(innerType, reader));
        }

        object[name] = value;
      } else {
        object[name] = readScalarArg(type, reader);
      }
    });

    return object as TLObjectTypes;
  };
}

export function invariant<T extends TLObjectTypes, K extends T["$t"]>(
  tlRawObject: any,
  $t: K
): tlRawObject is T;

export function invariant(tlRawObject: any, $t: TLTypeNames): boolean {
  return (
    typeof tlRawObject === "object" &&
    "$t" in tlRawObject &&
    tlRawObject.$t === $t
  );
}

function deserializePrimitive(type: PrimitiveTypes, reader: BinaryReader) {
  if (type === "int128") {
    return reader.readLargeInt(128);
  } else if (type === "long") {
    return reader.readLong();
  } else if (type === "bytes") {
    return reader.tgReadBytes();
  } else if (type === "string") {
    return reader.tgReadString();
  } else if (type === "int") {
    return reader.readInt();
  } else if (type === "Bool") {
    return reader.tgReadBool();
  } else if (type === "true") {
    return true;
  } else {
    return 0;
  }
}

export function serializeTLObject(object: TLObjectTypes) {
  if (!tlObjectsDefintionMapByType.has(object.$t)) {
    return undefined;
  }

  const [constructorId, [, definitions]] = tlObjectsDefintionMapByType.get(
    object.$t
  );
  const idLE = pack(constructorId, "I", true);

  let flagIndicatorIndex: number = undefined;
  let flagIndicatorValue = 0;

  const buffers = [
    idLE,
    ...definitions.map(([key, type], index) => {
      const value = object[key];

      if (flagRegex.test(type)) {
        if (value === null || value === undefined || value === false) {
          return [];
        }

        const matches = type.match(flagRegex);
        const flagIndex = Number(matches[2]);
        const flag = 2 ** flagIndex;

        flagIndicatorValue |= flag;
        type = matches[2];
      }

      if (type === "#FLAG") {
        flagIndicatorIndex = index;
        return [];
      } else if (vectorRegex.test(type)) {
        const innerType = type.match(vectorRegex)[1] as PrimitiveTypes;

        return concatBuffers([
          vectorConstructorId,
          pack(value.length, "i", true),
          ...value.map((x: any) => serializeScalar(innerType, x))
        ]);
      } else {
        return serializeScalar(type, value);
      }

      return [];
    })
  ];

  if (flagIndicatorIndex !== undefined) {
    buffers[flagIndicatorIndex + 1] = serializeScalar(
      "int",
      flagIndicatorValue
    );
  }

  return concatBuffers(buffers);
}

function serializeScalar(type: PrimitiveTypes, value: any) {
  if (type === "bytes") {
    return serializeBytes(value);
  } else if (type === "int128") {
    return readBufferFromBigInt(value, 16, true, true);
  } else if (type === "int256") {
    return readBufferFromBigInt(value, 32, true, true);
  } else if (type === "long") {
    return readBufferFromBigInt(value, 8, true, true);
  } else if (type === "string") {
    return serializeBytes(value);
  } else if (type === "int") {
    return pack(value, "i", true);
  }

  return serializeTLObject(value) || new Uint8Array(0);
  //  else if (type === "true") {
  //   // return true;
  // } else if (type === "Bool") {
  //   // return true;
  // }
  // return new Uint8Array(0);
}

export function serializeBytes(input: string | Uint8Array) {
  let data: Uint8Array;
  if (!(input instanceof Uint8Array)) {
    if (typeof input == "string") {
      data = readBytesFromString(input);
    } else {
      throw Error(`Bytes or bigint or str expected, not ${typeof input}`);
    }
  } else {
    data = input;
  }

  const r: Uint8Array[] = [];
  let padding: number;
  if (data.length < 254) {
    padding = (data.length + 1) % 4;
    if (padding !== 0) {
      padding = 4 - padding;
    }
    r.push(new Uint8Array([data.length]));
    r.push(data);
  } else {
    padding = data.length % 4;
    if (padding !== 0) {
      padding = 4 - padding;
    }
    r.push(
      new Uint8Array([
        254,
        data.length % 256,
        (data.length >> 8) % 256,
        (data.length >> 16) % 256
      ])
    );
    r.push(data);
  }
  r.push(new Uint8Array(padding));

  return concatBuffers(r);
}

export function serializeDate(dt: Date | number) {
  if (!dt) {
    return new Uint8Array(4);
  }
  if (dt instanceof Date) {
    dt = Math.floor((Date.now() - dt.getTime()) / 1000);
  }
  if (typeof dt == "number") {
    return pack(dt, "i", true);
  }
  throw Error(`Cannot interpret "${dt}" as a date`);
}

export { TLObjectTypes };
