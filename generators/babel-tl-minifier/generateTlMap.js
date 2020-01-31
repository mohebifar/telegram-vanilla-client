const fs = require("fs");

const chars = [];
for (var i = 0; i < 26; i++) {
  const char = String.fromCharCode(65 + i);
  chars.push(char, char.toLowerCase());
}

const keys = [];
for (const i of chars) {
  for (const j of chars) {
    keys.push(`${i}${j}`);
  }
}

const typesMap = new Map();
let index = 0;
const vectorRegex = /Vector<(\w+)>/;
const flagRegex = /Flag(\d+)<(\w+|\w+<\w+>)>/;

function addType(type) {
  if (
    type === "string" ||
    type === "#FLAG" ||
    typesMap.has(type) ||
    vectorRegex.test(type) ||
    flagRegex.test(type)
  ) {
    return;
  }

  const value = type.endsWith("Request")
    ? keys[index++] + "Request"
    : keys[index++];

  typesMap.set(type, value);
}

const ast = require("@babel/parser").parse(
  String(fs.readFileSync("./src/core/tl/schema.ts")),
  {
    sourceType: "module",
    plugins: ["typescript"]
  }
);

const node = ast.program.body[0].declaration.declarations[0];
if (node.id.name === "tlObjectsDefinitions") {
  const elements = node.init.elements;
  for (const {
    elements: [, def]
  } of elements) {
    addType(def.elements[0].elements[0].value);
    const b = def.elements[1].elements;
    // for (const t of b) {
    //   addType(t.elements[1].value);
    // }
  }
}

// ["bytes", "int", "long", "int128", "int256", "double", "Bool", "true"].forEach(
//   addType
// );

fs.writeFileSync(
  __dirname + "/map.json",
  JSON.stringify([...typesMap.entries()])
);
