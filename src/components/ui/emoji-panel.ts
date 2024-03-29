import { Document } from "../../core/tl/TLObjects";
import {
  Component,
  createElement,
  Element,
  on,
  removeClass,
  addClass,
  isDescendentOf,
} from "../../utils/dom";
import * as styles from "./emoji-panel.scss";
import EmojiPicker from "./emoji-picker";
import StickerPicker from "./sticker-picker";
import Tabs, { Tab } from "./tabs";
import GifPicker from "./gif-picker";
import { isMobile } from "../../utils/mobile";
import Icon, { Icons } from "./icon";
import IconButton from "./icon-button";

interface Options {
  onEmojiSelect(emoji: string): any;
  onStickerSelect(document: Document): any;
  onGifSelect(document: Document): any;
  activator: HTMLElement;
}

export default class EmojiPanel implements Component<Options> {
  public readonly element: HTMLElement;

  public visible = false;
  private lockVisibility = false;
  private timeout: number;
  private tabsContainer: Element<Tabs>;
  private visibleTime: number;

  private tabs: Tab[];

  constructor({
    onEmojiSelect,
    onStickerSelect,
    activator,
    onGifSelect,
  }: Options) {
    const emojiPicker = createElement(EmojiPicker, {
      onEmojiSelect,
    });
    const gifPicker = createElement(GifPicker, {
      onGifSelect: (gif) => {
        onGifSelect(gif);
        // this.setVisibility(false);
      },
    });
    const stickerPicker = createElement(StickerPicker, {
      onStickerSelect: (sticker) => {
        onStickerSelect(sticker);
        // this.setVisibility(false);
      },
    });
    const searchButton = createElement(IconButton, {
      icon: Icons.Search,
      color: "grey",
      class: styles.searchIcon + " hidden",
      onClick: () => {
        const { router } =
          this.tabsContainer.instance.tab === 1
            ? stickerPicker.instance
            : gifPicker.instance;

        if (router.currentRouteName !== "search") {
          router.replace("search");
        }
      },
    });

    this.tabs = [
      {
        title: createElement(Icon, {
          icon: Icons.Smile,
        }),
        content: emojiPicker,
      },
      {
        title: createElement(Icon, {
          icon: Icons.Stickers,
        }),
        content: stickerPicker,
      },
      {
        title: createElement(Icon, {
          icon: Icons.Gifs,
        }),
        content: gifPicker,
      },
    ];

    this.tabsContainer = createElement(Tabs, {
      class: styles.tabsContainer,
      tabs: this.tabs,
      onTabChange: (index) => {
        searchButton.classList[index !== 0 ? "remove" : "add"]("hidden");
        stickerPicker.instance[index === 1 ? "panelOpen" : "panelClose"]();
        gifPicker.instance[index === 2 ? "panelOpen" : "panelClose"]();
      },
    });
    this.tabsContainer.instance.setTab(0);

    const element = createElement(
      "div",
      { class: `${styles.container} hidden` },
      this.tabsContainer,
      searchButton
    );

    on(element, "mouseenter", () => {
      this.clearTimeout();
    });

    on(element, ["mouseleave", "blur"], () => {
      if (!isMobile()) {
        this.deferHide(300);
      }
    });

    on(
      document.body,
      "click",
      (event) => {
        if (!this.visible) {
          return;
        }

        const target = event.target as HTMLElement;
        const clickedOnContainer = isDescendentOf(target, this.element);

        const shouldClose = isMobile()
          ? target === activator || !clickedOnContainer
          : !clickedOnContainer;

        if (
          this.visible &&
          shouldClose &&
          Date.now() - this.visibleTime > 300
        ) {
          this.deferHide(300);
        }
      },
      { capture: true }
    );

    this.element = element;
  }

  public setVisibility(visible = !this.visible) {
    if (visible === this.visible) {
      if (visible) {
        this.clearTimeout();
      }
      return;
    }

    if (this.lockVisibility) {
      return;
    }

    this.clearTimeout();
    this.visible = visible;

    if (visible) {
      (this.tabs[0].content as any).instance.panelOpen();
      this.visibleTime = Date.now();
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

  public deferHide(timeout = 600) {
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
