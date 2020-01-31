const map = require("./map.json");

const typesMap = new Map(map);
const vectorRegex = /Vector<(\w+)>/;
const flagRegex = /Flag(\d+)<(\w+|\w+<\w+>)>/;

function getType(type) {
  // if (flagRegex.test(type)) {
  //   const matches = type.match(flagRegex);
  //   const flagIndex = Number(matches[1]);
  //   const t = getType(matches[2]);
  //   if (!t) {
  //     return;
  //   }
  //   return `Flag${flagIndex}<${t}>`;
  // }

  // if (vectorRegex.test(type)) {
  //   const match = type.match(vectorRegex)[1];
  //   const t = getType(match);
  //   if (!t) {
  //     return;
  //   }
  //   return `Vector<${t}>`;
  // }

  return typesMap.get(type);
}

module.exports = function({ types: t }) {
  return {
    pre(state) {},
    visitor: {
      StringLiteral(path, state) {
        const type = getType(path.node.value);

        if (type) {
          path.node.value = type;
        }
      }
    }
  };
};
