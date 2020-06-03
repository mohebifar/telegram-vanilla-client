import { Document } from "../../core/tl/TLObjects";
import { Component, createElement, Element, on, removeClass, addClass } from "../../utils/dom";
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
  private lockVisibility = false;
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
      class: styles.tabsContainer,
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

    on(element, "mouseenter", () => {
      this.clearTimeout();
    });

    on(element, "mouseleave", () => {
      this.deferHide();
    });

    this.element = element;
  }

  public setVisibility(visible = !this.visible) {
    if (this.lockVisibility) {
      return;
    }
    this.clearTimeout();
    this.visible = visible;

    if (visible) {
      removeClass(this.element, "hidden");
      addClass(this.element, "visible");
    } else {
      removeClass(this.element, "visible");
      addClass(this.element, "hidden");
      // this.lockVisibility = true;
      // on(this.element, 
      //   "transitionend",
      //   () => {
      //     this.lockVisibility = false;
      //     // this.tabsContainer.instance.setTab(0);
      //     addClass(this.element, "hidden");
      //   },
      //   { once: true }
      // );
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
    this.timeout = 0;
  }
}
