import { Document } from "../../core/tl/TLObjects";
import { IStickerSet, StickerSet } from "../../models/sticker-set";
import { Component, createElement, removeChildren, on } from "../../utils/dom";
import Lottie from "./lottie";
import * as styles from "./sticker-picker.scss";
import { EMPTY_IMG } from "../../utils/images";
import { debounce } from "../../utils/utils";

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
            this.renderTabssInHolder(
              stickerSet,
              entry.target as HTMLElement
            );
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
      const titleElement = createElement("button", { title: sticker.set.title });
      if (sticker.set.animated) {
        const lottie = createElement(Lottie, {});
        titleElement.append(lottie);
        sticker.loadPack().then(() => {
          const document = sticker.documents && sticker.documents[0];

          if (document && document.$t === "Document") {
            sticker.tg.fileStorage
              .downloadDocument(document, undefined, document.dcId)
              .then((url) => {
                lottie.instance.updateConfig({
                  path: url,
                  loop: true,
                  autoplay: false,
                });

                on(lottie, "mouseenter", () => {
                  if ((lottie.instance.animation as any).isPaused) {
                    lottie.instance.animation.goToAndPlay(0);
                  }
                });
                on(lottie, "mouseleave", () => {
                  lottie.instance.animation.stop();
                });
              });
          }
        });
      } else {
        const img = createElement("img", {
          src: EMPTY_IMG,
        }) as HTMLImageElement;
        titleElement.append(img);
        sticker.loadPack().then(() => {
          const document = sticker.documents && sticker.documents[0];

          if (document && document.$t === "Document") {
            sticker.tg.fileStorage
              .downloadDocument(document, undefined, document.dcId)
              .then((url) => {
                img.src = url;
              });
          }
        });
      }
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

  private renderTabssInHolder(
    sticker: IStickerSet,
    stickerHolder: HTMLElement
  ) {
    const { animated } = sticker.set;
    const callbacks: Function[] = [];
    
    for (const document of sticker.documents) {
      if (document.$t !== "Document") {
        continue;
      }

      if (animated) {
        const preview = createElement("div", { class: styles.preview });

        on(preview, "mouseup", () => {
          this.onStickerSelect(document);
        });

        stickerHolder.append(preview);

        callbacks.push(() => {
          const lottie = createElement(Lottie, {});
          preview.append(lottie);

          sticker.tg.fileStorage
            .downloadDocument(document, undefined, document.dcId)
            .then((url) => {
              lottie.instance.updateConfig({
                path: url,
                loop: true,
                autoplay: false,
              });

              on(lottie, "mouseenter", () => {
                if ((lottie.instance.animation as any).isPaused) {
                  lottie.instance.animation.goToAndPlay(0);
                }
              });
              on(lottie, "mouseleave", () => {
                lottie.instance.animation.stop();
              });
            });
        });
      } else {
        const img = createElement("img", {
          src: EMPTY_IMG,
        }) as HTMLImageElement;
        const preview = createElement("div", { class: styles.preview }, img);

        on(preview, "mouseup", () => {
          this.onStickerSelect(document);
        });

        stickerHolder.append(preview);

        sticker.tg.fileStorage
          .downloadDocument(document, undefined, document.dcId)
          .then((url) => {
            img.src = url;
          });
      }
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
