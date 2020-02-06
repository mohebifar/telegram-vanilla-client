import { Component, createElement } from "../../utils/dom";
import * as styles from "./emoji-panel.scss";
import EmojiPicker from "./emoji-picker";

interface Options {
  onEmojiSelect(emoji: string): any;
}

export default class EmojiPanel implements Component<Options> {
  public readonly element: HTMLElement;
  private visible = false;
  private panels: HTMLElement[];

  private timeout: number;

  constructor({ onEmojiSelect }: Options) {
    const emojiPicker = createElement(EmojiPicker, { onEmojiSelect });

    this.panels = [
      createElement("button", { class: styles.tab, type: "button" }, "Emojis"),
      createElement(
        "button",
        { class: styles.tab, type: "button" },
        "Stickers"
      ),
      createElement("button", { class: styles.tab, type: "button" }, "GIFs")
    ];

    const tabs = createElement("div", { class: styles.tabs }, ...this.panels);

    const element = createElement(
      "div",
      { class: styles.container },
      tabs,
      emojiPicker
    );

    this.setCurrentPanel(0);

    element.addEventListener("mouseenter", () => {
      this.clearTimeout();
    });

    element.addEventListener("mouseleave", () => {
      this.clearTimeout();
      this.setVisibility(false);
    });

    this.element = element;
  }

  public setVisibility(visible = !this.visible) {
    this.clearTimeout();
    this.element.classList[visible ? "add" : "remove"](styles.visible);
    this.visible = visible;
  }

  public deferHide() {
    this.clearTimeout();
    this.timeout = setTimeout(() => {
      this.setVisibility(false);
    }, 600);
  }

  private setCurrentPanel(index: number) {
    this.panels.forEach(panel => panel.classList.remove(styles.active));
    this.panels[index].classList.add(styles.active);
  }

  private clearTimeout() {
    clearTimeout(this.timeout);
  }
}
