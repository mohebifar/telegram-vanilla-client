import {
  Component,
  createElement,
  Element,
  on,
  removeChildren,
} from "../../utils/dom";
import * as styles from "./emoji-picker.scss";
import Icon, { Icons } from "./icon";
import countries from "../../data/countries";
import { throttle } from "../../utils/utils";
import { getEmojiImage } from "../../utils/emojis";
import db from "../../utils/db";

interface Options {
  onEmojiSelect(emoji: string): any;
}

type EmojiCategories =
  | "Recent"
  | "Smileys & Emotion"
  | "Animals & Nature"
  | "Food & Drink"
  | "Travel & Places"
  | "Activities"
  | "Objects"
  | "Flags";

const icons: { [k in EmojiCategories]: Icons } = {
  Recent: Icons.Recent,
  "Smileys & Emotion": Icons.Smile,
  "Animals & Nature": Icons.Animals,
  "Food & Drink": Icons.Eats,
  "Travel & Places": Icons.Car,
  Activities: Icons.Sport,
  Objects: Icons.Lamp,
  Flags: Icons.Flag,
};

const RECENT_EMOJIS_KEY = "recentEmojis";

export default class EmojiPicker implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly dialogs: HTMLElement;
  private onEmojiSelect: Options["onEmojiSelect"];

  public static emojisRanges: {
    [k in EmojiCategories]?: [number, number][];
  } = {
    "Smileys & Emotion": [
      [128512, 128580],
      [129296, 129303],
      [129312, 129317],
      [129319, 129327],
      [128147, 128159],
      [128162, 128166],
    ],
    "Animals & Nature": [
      [127793, 127797],
      [127799, 127804],
      [127806, 127811],
      [128000, 128063],
      [129409, 129423],
      [129426, 129437],
      [129445, 129449],
    ],
    "Food & Drink": [
      [127812, 127871],
      [129360, 129391],
    ],
    "Travel & Places": [
      [9728, 9732],
      [127744, 127777],
      [127780, 127788],
      [127956, 127974],
      [127976, 127981],
      [128336, 128359],
      [128506, 128510],
      [128640, 128674],
      [128676, 128680],
    ],
    Activities: [
      [127878, 127883],
      [127885, 127889],
      [127917, 127924],
      [127951, 127955],
      [129351, 129359],
    ],
    Objects: [
      [127925, 127932],
      [128081, 128098],
      [128176, 128185],
      [128187, 128218],
      [128220, 128242],
      [128247, 128253],
      [128263, 128279],
      [129403, 129407],
      [129506, 129510],
      [129529, 129534],
    ],
  };

  public static emojis: { [k in EmojiCategories]: string[] };

  static async prepareEmojis() {
    if (this.emojis) {
      return;
    }

    EmojiPicker.emojis = {} as any;

    EmojiPicker.emojis.Recent = await this.getRecentEmojis();

    const { emojisRanges } = EmojiPicker;

    for (const category in emojisRanges) {
      EmojiPicker.emojis[category] = [];

      const ranges = emojisRanges[category];
      for (const [start, end] of ranges) {
        for (let i = start; i <= end; i++) {
          EmojiPicker.emojis[category].push(String.fromCodePoint(i));
        }
      }
    }

    EmojiPicker.emojis.Flags = countries.map(({ e }) => e);
  }

  static async useEmojis(emojis: string[]) {
    const recentEmojis = await this.getRecentEmojis();
    const newEmojis = [
      ...emojis,
      ...recentEmojis.filter((emoji) => !emojis.includes(emoji)),
    ].slice(0, 18);

    await db.configs.put({
      key: RECENT_EMOJIS_KEY,
      value: newEmojis,
    });
  }

  static async getRecentEmojis(): Promise<string[]> {
    const recentEmojis = await db.configs.get(RECENT_EMOJIS_KEY);
    return (
      (recentEmojis && recentEmojis.value) || [
        "😂",
        "😁",
        "😃",
        "🙏",
        "😕",
        "😐",
        "😘",
        "😍",
        "😏",
        "😒",
        "😞",
        "🥳",
        "🤣",
        "😎",
        "👍",
        "😅",
      ]
    );
  }

  constructor({ onEmojiSelect }: Options) {
    this.onEmojiSelect = onEmojiSelect;

    this.element = createElement("div", {
      class: styles.container,
    });

    this.register();
  }

  private async register() {
    await EmojiPicker.prepareEmojis();
    const titleElements: HTMLElement[] = [];
    const categoryElements: HTMLElement[] = [];
    const pickers: Element<Icon>[] = [];

    const emojiWrapper = createElement("div", { class: styles.emojiWrapper });

    Object.keys(EmojiPicker.emojis).forEach((category: EmojiCategories) => {
      const emojis = createElement("div", {
        class: styles.emojisList,
        "data-emoji-cat": category,
      });
      const title = createElement("h3", { class: styles.title }, category);

      this.fillEmojis(category, emojis);

      const categoryElement = createElement(
        "div",
        { class: styles.category },
        title,
        emojis
      );

      titleElements.push(title);
      categoryElements.push(categoryElement);

      emojiWrapper.append(categoryElement);

      pickers.push(
        createElement(Icon, {
          icon: icons[category],
          color: "grey",
        })
      );
    });

    const updateTabColor = throttle(
      () => {
        const { scrollTop } = emojiWrapper;
        for (let i = categoryElements.length - 1; i >= 0; i--) {
          const titleElement = categoryElements[i];
          if (titleElement.offsetTop - 60 <= scrollTop) {
            pickers.forEach((picker) => picker.instance.setColor("grey"));
            pickers[i].instance.setColor("blue");
            break;
          }
        }
      },
      300,
      true
    );

    on(emojiWrapper, "scroll", updateTabColor);
    pickers[0].instance.setColor("blue");

    this.element.append(
      emojiWrapper,
      createElement(
        "div",
        { class: styles.tabs },
        ...pickers.map((icon, i) => {
          const element = createElement("div", { class: "categoryTab" }, icon);
          on(element, "click", () => {
            emojiWrapper.scrollTo({
              top: categoryElements[i].offsetTop - 60,
              behavior: "smooth",
            });
          });
          return element;
        })
      )
    );
  }

  private fillEmojis(category: EmojiCategories, wrapper: HTMLElement) {
    removeChildren(wrapper);
    EmojiPicker.emojis[category].forEach((emoji) => {
      const button = createElement("button", { type: "button" });
      button.innerHTML = getEmojiImage(emoji);
      on(button, "click", () => {
        this.onEmojiSelect(emoji);
      });
      wrapper.append(button);
    });
  }

  public async panelOpen() {
    EmojiPicker.emojis.Recent = await EmojiPicker.getRecentEmojis();
    const element = this.element.querySelector(
      '[data-emoji-cat="Recent"]'
    ) as HTMLElement;
    this.fillEmojis("Recent", element);
  }
}
