import { Document } from "../../core/tl/TLObjects";
import { IStickerSet, StickerSet } from "../../models/sticker-set";
import { Component, createElement, removeChildren } from "../../utils/dom";
import Lottie from "./lottie";
import * as styles from "./sticker-picker.scss";
import { EMPTY_IMG } from "../../utils/images";

interface Options {
  onStickerSelect(document: Document): any;
}

export default class StickerPicker implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly dialogs: HTMLElement;
  private onStickerSelect: Options["onStickerSelect"];
  private stickerSets: IStickerSet[];
  private currentOffset = 0;
  private limit = 2;
  private lockLoadMore = true;

  constructor({ onStickerSelect }: Options) {
    this.onStickerSelect = onStickerSelect;

    const element = createElement("div", { class: styles.container });

    StickerSet.fetchAll().then(stickerSets => {
      this.stickerSets = stickerSets;
      this.element.addEventListener("scroll", () => {
        if (!this.lockLoadMore && this.isAtBottom()) {
          this.renderStickers();
        }
      });
    });

    this.element = element;
  }

  private observer = new IntersectionObserver(
    async entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const stickerSet = (entry.target as any).sticker as IStickerSet;
          this.observer.unobserve(entry.target);
          stickerSet.loadPack().then(() => {
            stickerSet.save();
            this.renderPreviewsInHolder(
              stickerSet,
              entry.target as HTMLElement
            );
          });
        }
      }
    },
    {
      root: document.body,
      rootMargin: "0px",
      threshold: 0
    }
  );

  private isAtBottom(threshold = 50) {
    const obj = this.element;
    return (
      Math.abs(obj.scrollTop - (obj.scrollHeight - obj.offsetHeight)) <
      threshold
    );
  }

  private renderStickers() {
    this.lockLoadMore = true;
    const stickers = this.stickerSets.slice(
      this.currentOffset,
      (this.currentOffset += this.limit)
    );

    for (const sticker of stickers) {
      const titleElement = createElement(
        "div",
        { class: styles.title },
        sticker.set.title
      );
      const stickerHolder = createElement("div", { class: styles.holder });
      const stickerElement = createElement("div", titleElement, stickerHolder);
      (stickerHolder as any).sticker = sticker;
      this.observer.observe(stickerHolder);

      this.element.append(stickerElement);
    }

    this.lockLoadMore = false;
  }

  private renderPreviewsInHolder(
    sticker: IStickerSet,
    stickerHolder: HTMLElement
  ) {
    const { animated } = sticker.set;
    for (const document of sticker.documents) {
      if (document.$t !== "Document") {
        continue;
      }

      if (animated) {
        const lottie = createElement(Lottie, {});
        const preview = createElement("div", { class: styles.preview }, lottie);

        preview.addEventListener("mouseup", () => {
          this.onStickerSelect(document);
        });

        stickerHolder.append(preview);

        sticker.tg.fileStorage
          .downloadDocument(document, undefined, document.dcId)
          .then(url => {
            lottie.instance.updateConfig({
              path: url,
              loop: true,
              autoplay: true
            });
          });
      } else {
        const img = createElement("img", {
          src: EMPTY_IMG
        }) as HTMLImageElement;
        const preview = createElement("div", { class: styles.preview }, img);

        preview.addEventListener("mouseup", () => {
          this.onStickerSelect(document);
        });

        stickerHolder.append(preview);

        sticker.tg.fileStorage
          .downloadDocument(document, undefined, document.dcId)
          .then(url => {
            img.src = url;
          });
      }
    }
  }

  public panelClose() {
    removeChildren(this.element);
  }

  public panelOpen() {
    this.currentOffset = 0;
    this.renderStickers();
    requestAnimationFrame(() => {
      this.element.scrollTop = 0;
    });
  }
}
