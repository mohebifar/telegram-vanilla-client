import { Document } from "../../core/tl/TLObjects";
import { Component, createElement, Element } from "../../utils/dom";
import * as styles from "./emoji-panel.scss";
import EmojiPicker from "./emoji-picker";
import StickerPicker from "./sticker-picker";
import Tabs, { Tab } from "./tabs";

interface Options {
  onEmojiSelect(emoji: string): any;
  onStickerSelect(document: Document): any;
}

export default class EmojiPanel implements Component<Options> {
  public readonly element: HTMLElement;

  private visible = false;
  private timeout: number;
  private tabsContainer: Element<Tabs>;

  private tabs: Tab[];

  constructor({ onEmojiSelect, onStickerSelect }: Options) {
    const emojiPicker = createElement(EmojiPicker, { onEmojiSelect });
    const stickerPicker = createElement(StickerPicker, {
      onStickerSelect: sticker => {
        onStickerSelect(sticker);
        this.setVisibility(false);
      }
    });

    this.tabs = [
      { title: "Emojis", content: emojiPicker },
      { title: "Stickers", content: stickerPicker },
      { title: "GIFs" }
    ];

    this.tabsContainer = createElement(Tabs, {
      tabs: this.tabs,
      onTabChange: index => {
        if (index === 1) {
          stickerPicker.instance.panelOpen();
        } else {
          stickerPicker.instance.panelClose();
        }
      }
    });

    const element = createElement(
      "div",
      { class: styles.container },
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
    this.element.classList[visible ? "add" : "remove"](styles.visible);
    this.visible = visible;
    if (!this.visible) {
      this.tabsContainer.instance.setTab(0);
    }
  }

  public deferHide(timeout = 600) {
    this.clearTimeout();
    this.timeout = setTimeout(() => {
      this.setVisibility(false);
    }, timeout);
  }

  private clearTimeout() {
    clearTimeout(this.timeout);
  }
}
