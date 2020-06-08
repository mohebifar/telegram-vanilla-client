import { Document } from "../../core/tl/TLObjects";
import { IStickerSet, StickerSet } from "../../models/sticker-set";
import { Component, createElement, removeChildren, on } from "../../utils/dom";
import Lottie from "./lottie";
import * as styles from "./sticker-picker.scss";
import { EMPTY_IMG } from "../../utils/images";
import { debounce } from "../../utils/utils";
import { TelegramClientProxy } from "../../telegram-worker-proxy";

interface Options {
  onStickerSelect(document: Document): any;
}

export default class StickerPicker implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly wrapper: HTMLElement;
  public readonly dialogs: HTMLElement;
  public readonly tabs: HTMLElement;
  private onStickerSelect: Options["onStickerSelect"];
  private stickerSets: IStickerSet[];
  private currentOffset = 0;
  private currentPreviewOffset = 0;
  private limit = 2;
  private lockLoadMore = true;
  private loadPromise = StickerSet.fetchAll().then((stickerSets) => {
    this.stickerSets = stickerSets;
    on(this.wrapper, "scroll", () => {
      if (!this.lockLoadMore && this.isAtEnd()) {
        this.renderStickers();
      }
    });

    on(this.tabs, "scroll", () => {
      if (!this.lockLoadMore && this.isTabsAtEnd()) {
        this.renderTabs();
      }
    });
  });

  constructor({ onStickerSelect }: Options) {
    this.onStickerSelect = onStickerSelect;
    this.tabs = createElement("div", { class: styles.tabs });

    on(this.tabs, "wheel", (e) => {
      this.tabs.scrollLeft += e.deltaY;
    });

    this.wrapper = createElement("div", { class: styles.stickerWrapper });
    this.element = createElement(
      "div",
      { class: styles.container },
      this.wrapper,
      this.tabs
    );
  }

  private observer = new IntersectionObserver(
    debounce((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const stickerSet = (entry.target as any).sticker as IStickerSet;
          this.observer.unobserve(entry.target);
          stickerSet.loadPack().then(() => {
            stickerSet.save();
            this.renderTabsInHolder(stickerSet, entry.target as HTMLElement);
          });
        }
      }
    }, 70),
    { threshold: 0 }
  );

  private isAtEnd(threshold = 50) {
    const obj = this.wrapper;
    return (
      Math.abs(obj.scrollTop - (obj.scrollHeight - obj.offsetHeight)) <
      threshold
    );
  }

  private isTabsAtEnd(threshold = 2) {
    const obj = this.tabs;
    return (
      Math.abs(obj.scrollLeft - obj.scrollWidth + obj.offsetWidth) < threshold
    );
  }

  private renderTabs() {
    this.lockLoadMore = true;
    const stickers = this.stickerSets.slice(
      this.currentPreviewOffset,
      (this.currentPreviewOffset += 20)
    );

    for (const sticker of stickers) {
      const titleElement = createElement("button", {
        title: sticker.set.title,
      });
      const [document] = sticker.documents;
      if (document.$t !== "Document") {
        continue;
      }

      const { animated } = sticker.set;

      this.fillStickerPreview(sticker.tg, document, animated, titleElement);

      on(titleElement, "click", () => {
        const index = this.stickerSets.indexOf(sticker);
        const limit = index - this.currentOffset + 1;
        if (limit > 0) {
          this.renderStickers(limit);
        }
        this.wrapper
          .querySelector('[data-index="' + index + '"]')
          .scrollIntoView();
      });

      this.tabs.append(titleElement);
    }
    this.lockLoadMore = false;
  }

  private renderStickers(limit = this.limit) {
    this.lockLoadMore = true;
    const isFirstLoad = this.currentOffset === 0;
    const stickers = this.stickerSets.slice(
      this.currentOffset,
      (this.currentOffset += limit)
    );

    for (const sticker of stickers) {
      const titleElement = createElement(
        "div",
        { class: styles.title },
        sticker.set.title
      );
      const stickerHolder = createElement("div", {
        class: styles.holder,
        "data-index": this.stickerSets.indexOf(sticker),
      });
      const stickerElement = createElement("div", titleElement, stickerHolder);
      (stickerHolder as any).sticker = sticker;
      this.observer.observe(stickerHolder);

      this.wrapper.append(stickerElement);
    }

    if (isFirstLoad) {
      this.renderTabs();
    }

    this.lockLoadMore = false;
  }

  private renderTabsInHolder(sticker: IStickerSet, stickerHolder: HTMLElement) {
    const { animated } = sticker.set;
    const callbacks: Function[] = [];

    for (const document of sticker.documents) {
      if (document.$t !== "Document") {
        continue;
      }

      const preview = createElement("div", { class: styles.preview });

      this.fillStickerPreview(
        sticker.tg,
        document,
        animated,
        preview,
        callbacks
      );

      stickerHolder.append(preview);

      on(preview, "mouseup", () => {
        this.onStickerSelect(document);
      });
    }

    const call = () => {
      const callbacksToCall = callbacks.splice(0, 5);
      if (callbacksToCall.length > 0) {
        callbacksToCall.forEach((cb) => cb());
        requestAnimationFrame(call);
      }
    };

    requestAnimationFrame(call);
  }

  private fillStickerPreview(
    tg: TelegramClientProxy,
    document: Document,
    animated: boolean,
    container: HTMLElement,
    callbacks?: Function[]
  ) {
    if (animated) {
      const callback = () => {
        tg.fileStorage
          .downloadDocument(document, undefined, document.dcId)
          .then((url) => {
            const lottie = createElement(Lottie, {
              config: {
                path: url,
                loop: true,
                autoplay: false,
              },
            });
            container.append(lottie);

            on(lottie, "mouseenter", () => {
              if ((lottie.instance.animation as any).isPaused) {
                lottie.instance.animation.goToAndPlay(0);
              }
            });

            on(lottie, "mouseleave", () => {
              lottie.instance.animation.stop();
            });
          });
      };

      if (callbacks) {
        callbacks.push(callback);
      } else {
        callback();
      }
    } else {
      const img = createElement("img", {
        src: EMPTY_IMG,
      }) as HTMLImageElement;
      container.append(img);

      tg.fileStorage
        .downloadDocument(document, undefined, document.dcId)
        .then((url) => {
          img.src = url;
        });
    }
  }

  public panelClose() {
    this.lockLoadMore = true;
    this.wrapper.scrollTop = 0;
    removeChildren(this.wrapper);
  }

  public async panelOpen() {
    this.currentOffset = 0;
    await this.loadPromise;
    this.renderStickers();
    requestAnimationFrame(() => {
      this.wrapper.scrollTop = 0;
    });
  }
}
