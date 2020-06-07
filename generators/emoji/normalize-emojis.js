const emojis = require("./emoji.json");

const mapper = (emoji) => {
  if (emoji.skin_variations) {
    return Object.values(emoji.skin_variations).flatMap(mapper);
  }

  if (!emoji.has_img_apple) {
    return null;
  }

  return {
    n: emoji.short_name,
    x: emoji.sheet_x,
    y: emoji.sheet_y,
    u: emoji.unified.toLowerCase(),
    e: decodeUnicode(emoji.unified),
  };
};

const result = emojis.flatMap(mapper).filter(Boolean);

console.log(`export default ${JSON.stringify(result)};`);

function decodeUnicode(str) {
  const replaced = str.replace(/([A-F0-9]{4,})-?/g, "\\u{$1}");
  return eval(`"${replaced}"`);
}
