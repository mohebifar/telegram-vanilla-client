const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
// For debug:
// const isApple = false;

let emojiMap: Map<string, string>;

const regex = /(\u00a9|\u00ae|[\u2030-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
const allEmojiRegex = /^(\u00a9|\u00ae|[\u2030-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]){1,3}$/;

export function extractEmojis(text: string) {
  return Array.from(new Set(text.match(regex))).filter(Boolean);
}

export function isAllEmoji(emoji: string) {
  return allEmojiRegex.test(emoji.trim());
}

export function getEmojiImage(emoji: string) {
  if (isApple) {
    return emoji;
  }

  const unified = emojiMap.get(emoji);
  if (!unified) {
    return emoji;
  }

  return `<img loading="lazy" class="emoji" src="/assets/emojis/${unified}.png" />`;
}

export function replaceEmoji(text: string) {
  if (isApple) {
    return text;
  }

  return text.replace(regex, getEmojiImage);
}

export async function prepareEmojiMap() {
  if (isApple) {
    return;
  }
  const consoleTag = "TimeToPrepareAppleEmojis";
  console.time(consoleTag);
  const { default: emojis } = await import(
    /* webpackChunkName: "emojis" */ "../data/emojis"
  );

  emojiMap = new Map();

  for (const emoji of emojis) {
    emojiMap.set(emoji.e, emoji.u);
  }
  console.timeEnd(consoleTag);
}
