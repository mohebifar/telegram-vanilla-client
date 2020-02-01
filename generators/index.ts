import { smart } from "@babel/template";
import generate from "@babel/generator";
import * as prettier from "prettier";
import { crc32 } from "crc";
import * as fs from "fs";
import { findLayer, parseTl } from "./parser/parser";
import { parseMethods } from "./parser/methods";
import { variableSnakeToCamelCase } from "./utils";
import { TLArg } from "./parser/tlarg";
import { TLObject } from "./parser/tlobject";

const template = smart({
  plugins: ["typescript"],
  parserOpts: {
    parser: "recast"
  }
});

const mergeLines = (lines: string[]) =>
  lines.reduce((a, b) => a + "\n" + b, "");

const GENERATOR_DIR = __dirname;

const METHODS_IN = `${GENERATOR_DIR}/data/methods.csv`;

// Which raw API methods are covered by *friendly* methods in the client?
const FRIENDLY_IN = `${GENERATOR_DIR}/data/friendly.csv`;

const TLOBJECT_IN_TLS = [
  `${GENERATOR_DIR}/data/mtproto.tl`,
  `${GENERATOR_DIR}/data/api.tl`
];

const errors = [];

const [layer] = TLOBJECT_IN_TLS.map(findLayer).filter(Boolean);

const methods = [
  ...parseMethods(
    METHODS_IN,
    FRIENDLY_IN,
    errors.reduce((errors, error) => {
      errors[error.stringCode] = error;
      return errors;
    }, {})
  )
];

const tlobjects = TLOBJECT_IN_TLS.reduce(
  (files, file) => [...files, ...parseTl(file, layer, methods)],
  [] as TLObject[]
);

const TLTypeToTSTypeMap = new Map<string, string>([
  ["string", "string"],
  ["bytes", "Uint8Array"],
  ["int", "number"],
  ["long", "BigInteger | string"],
  ["int64", "BigInteger | string"],
  ["int128", "BigInteger | string"],
  ["int256", "BigInteger | string"],
  ["double", "number"],
  ["Bool", "boolean"],
  ["true", "boolean"]
]);

const allTypes = tlobjects.map(({ className }) => className);

function getArgTypeDef(arg: TLArg) {
  const argName = variableSnakeToCamelCase(arg.name);
  let type = arg.type;

  if (TLTypeToTSTypeMap.has(arg.type)) {
    type = TLTypeToTSTypeMap.get(arg.type);
  } else {
    const guesses = tlobjects
      .filter(({ result }) => type === result)
      .map(({ className }) => className);

    if (guesses.length === 0) {
      type = "any";
    } else {
      type = "(" + guesses.join(" | ") + ")";
    }
  }

  const isOptional = arg.isFlag || arg.canBeInferred;

  return `${argName}${isOptional ? "?" : ""}: ${
    arg.isVector && type.includes(" ") ? `(${type})` : type
  }${arg.isVector ? "[]" : ""};`;
}

function tlObjectToRuntimeDefinition({
  type,
  name,
  isVector,
  genericDefinition,
  flagIndicator,
  isFlag,
  flagIndex
}: TLArg) {
  if (genericDefinition) {
    return;
  }

  const argName = variableSnakeToCamelCase(name);

  let normalizedType = TLTypeToTSTypeMap.has(type) ? type : "_";

  if (flagIndicator) {
    normalizedType = "#FLAG";
  } else if (isVector) {
    normalizedType = `Vector<${normalizedType}>`;
  }

  normalizedType = normalizedType.replace(".", "_");

  if (isFlag) {
    normalizedType = `Flag${flagIndex}<${normalizedType}>`;
  }

  return `["${argName}", "${normalizedType}"],`;
}

function tlObjectToTSInterface({
  id,
  className,
  result,
  realArgs,
  args
}: TLObject) {
  const constructorId = "0x" + id.toString(16).padStart(8, "0");
  const subclassOfId = "0x" + crc32(result).toString(16);

  const typeDef = `
  export interface ${className} 
    extends TLObjectType<"${className}", ${constructorId}, ${subclassOfId}> {
    ${mergeLines(realArgs.map(getArgTypeDef))}
  }
  `;

  const runtimeTypeDef = `[
    ${constructorId},
    [
      ["${className}", ${subclassOfId}],
      [
        ${mergeLines(args.map(tlObjectToRuntimeDefinition).filter(Boolean))}
      ]
    ]
  ],`;

  return [typeDef, runtimeTypeDef];
}

const [typeDefs, runtimeTypeDefs] = tlobjects.reduce(
  ([typeDefs, runtimeTypeDefs], tlObject) => {
    const [typeDef, runtimeTypeDef] = tlObjectToTSInterface(tlObject);

    return [
      [...typeDefs, typeDef],
      [...runtimeTypeDefs, runtimeTypeDef]
    ];
  },
  [[], []]
);

const runtimeAst = template.ast`
export const tlObjectsDefinitions: any[] = [${mergeLines(runtimeTypeDefs)}]
`;

const typesAst = template.ast`
import { BigInteger } from "big-integer";
import { TLObjectType } from "./types";

${mergeLines(typeDefs)}

export type TLObjectTypes =
  ${mergeLines(allTypes.map(name => "| " + name))};
`;

const runtimeCode = prettier.format(
  generate(
    {
      type: "Program",
      body: [].concat(runtimeAst)
    },
    {
      plugins: ["generator-prettier"]
    }
  ).code
);

const typesCode = prettier.format(
  generate(
    {
      type: "Program",
      body: [].concat(typesAst)
    },
    {
      plugins: ["generator-prettier"]
    }
  ).code
);

fs.writeFileSync(`${GENERATOR_DIR}/../src/core/tl/schema.ts`, runtimeCode);

fs.writeFileSync(`${GENERATOR_DIR}/../src/core/tl/TLObjects.d.ts`, typesCode);
