import { Component, createElement, Element, on } from "../../utils/dom";
import * as styles from "./emoji-picker.scss";
import Icon, { Icons } from "./icon";
import countries from "../../data/countries.json";
import { throttle } from "../../utils/utils";

interface Options {
  onEmojiSelect(emoji: string): any;
}

type EmojiCategories =
  | "Smileys & Emotion"
  | "Animals & Nature"
  | "Food & Drink"
  | "Travel & Places"
  | "Activities"
  | "Objects"
  | "Flags";

const icons: { [k in EmojiCategories]: Icons } = {
  "Smileys & Emotion": Icons.Smile,
  "Animals & Nature": Icons.Animals,
  "Food & Drink": Icons.Eats,
  "Travel & Places": Icons.Car,
  Activities: Icons.Sport,
  Objects: Icons.Lamp,
  Flags: Icons.Flag
};

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
      [128162, 128166]
    ],
    "Animals & Nature": [
      [127793, 127797],
      [127799, 127804],
      [127806, 127811],
      [128000, 128063],
      [129409, 129423],
      [129426, 129437],
      [129445, 129449]
    ],
    "Food & Drink": [
      [127812, 127871],
      [129360, 129391]
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
      [128676, 128680]
    ],
    Activities: [
      [127878, 127883],
      [127885, 127889],
      [127917, 127924],
      [127951, 127955],
      [129351, 129359]
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
      [129529, 129534]
    ]
  };

  public static emojis: { [k in EmojiCategories]: string[] };

  static prepareEmojis() {
    if (this.emojis) {
      return;
    }

    EmojiPicker.emojis = {} as any;

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

  constructor({ onEmojiSelect }: Options) {
    this.onEmojiSelect = onEmojiSelect;

    const element = createElement("div", {
      class: styles.container
    });

    EmojiPicker.prepareEmojis();
    const titleElements: HTMLElement[] = [];
    const categoryElements: HTMLElement[] = [];
    const pickers: Element<Icon>[] = [];

    const emojiWrapper = createElement("div", { class: styles.emojiWrapper });

    Object.keys(EmojiPicker.emojis).forEach((category: EmojiCategories) => {
      const emojis = createElement("div", { class: styles.emojisList });
      const title = createElement("h3", { class: styles.title }, category);

      EmojiPicker.emojis[category].forEach(emoji => {
        const button = createElement("button", { type: "button" }, emoji);
        on(button, "click", () => {
          this.onEmojiSelect(emoji);
        });
        emojis.append(button);
      });

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
          color: "grey"
        })
      );
    });

    const updateTabColor = throttle(
      () => {
        const { scrollTop } = emojiWrapper;
        for (let i = titleElements.length - 1; i >= 0; i--) {
          const titleElement = titleElements[i];
          if (titleElement.offsetTop <= scrollTop) {
            pickers.forEach(picker => picker.instance.setColor("grey"));
            pickers[i].instance.setColor("blue");
            break;
          }
        }
      },
      200,
      true
    );

    on(emojiWrapper, "scroll", updateTabColor);
    pickers[0].instance.setColor("blue");

    element.append(
      emojiWrapper,
      createElement(
        "div",
        { class: styles.tabs },
        ...pickers.map((icon, i) => {
          const element = createElement("div", { class: "categoryTab" }, icon);
          on(element, "click", () => {
            categoryElements[i].scrollIntoView({ behavior: "smooth" });
          });
          return element;
        })
      )
    );

    this.element = element;
  }
}
