import { Document } from "../../core/tl/TLObjects";
import { Component, createElement, Element } from "../../utils/dom";
import * as styles from "./emoji-panel.scss";
import EmojiPicker from "./emoji-picker";
import StickerPicker from "./sticker-picker";
import Tabs, { Tab } from "./tabs";
import GifPicker from "./gif-picker";

interface Options {
  onEmojiSelect(emoji: string): any;
  onStickerSelect(document: Document): any;
  onGifSelect(document: Document): any;
}

export default class EmojiPanel implements Component<Options> {
  public readonly element: HTMLElement;

  private visible = false;
  private timeout: number;
  private tabsContainer: Element<Tabs>;

  private tabs: Tab[];

  constructor({ onEmojiSelect, onStickerSelect, onGifSelect }: Options) {
    const emojiPicker = createElement(EmojiPicker, { onEmojiSelect });
    const gifPicker = createElement(GifPicker, {
      onGifSelect: (gif) => {
        onGifSelect(gif);
        this.setVisibility(false);
      },
    });
    const stickerPicker = createElement(StickerPicker, {
      onStickerSelect: (sticker) => {
        onStickerSelect(sticker);
        this.setVisibility(false);
      },
    });

    this.tabs = [
      { title: "Emojis", content: emojiPicker },
      { title: "Stickers", content: stickerPicker },
      { title: "GIFs", content: gifPicker },
    ];

    this.tabsContainer = createElement(Tabs, {
      tabs: this.tabs,
      onTabChange: (index) => {
        stickerPicker.instance[index === 1 ? "panelOpen" : "panelClose"]();
        gifPicker.instance[index === 2 ? "panelOpen" : "panelClose"]();
      },
    });

    const element = createElement(
      "div",
      { class: `${styles.container} hidden` },
      this.tabsContainer
    );

    element.addEventListener("mouseenter", () => {
      this.clearTimeout();
    });

    element.addEventListener("mouseleave", () => {
      this.deferHide();
    });

    this.element = element;
  }

  public setVisibility(visible = !this.visible) {
    this.clearTimeout();
    this.visible = visible;
    if (visible) {
      this.element.classList.remove("hidden");
      this.element.classList.add("visible");
    } else {
      this.element.classList.remove("visible");
      this.element.addEventListener(
        "transitionend",
        () => {
          this.tabsContainer.instance.setTab(0);
          this.element.classList.add("hidden");
        },
        { once: true }
      );
    }
  }

  public deferHide(timeout = 300) {
    this.clearTimeout();
    this.timeout = setTimeout(() => {
      this.setVisibility(false);
    }, timeout);
  }

  private clearTimeout() {
    clearTimeout(this.timeout);
  }
}
