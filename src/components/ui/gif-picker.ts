import { Document } from "../../core/tl/TLObjects";
import { Gif } from "../../models/gifs";
import { Component, createElement, removeChildren, on } from "../../utils/dom";
import VideoAttachment from "../attachments/video";
import * as styles from "./gif-picker.scss";

interface Options {
  onGifSelect(document: Document): any;
}

export default class GifPicker implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly dialogs: HTMLElement;
  private currentOffset = 0;
  private limit = 10;
  private gifs: Document[];
  private onGifSelect: Options["onGifSelect"];

  private loadPromise = Gif.fetchSaved().then(gifs => {
    this.gifs = gifs.filter(({ $t }) => $t === "Document") as Document[];
  });

  constructor({ onGifSelect }: Options) {
    this.onGifSelect = onGifSelect;
    this.element = createElement("div", { class: styles.container });

    on(this.element, "scroll", () => {
      if (this.isAtBottom()) {
        this.renderPreviews();
      }
    });
  }

  private isAtBottom(threshold = 50) {
    const obj = this.element;
    return (
      Math.abs(obj.scrollTop - (obj.scrollHeight - obj.offsetHeight)) <
      threshold
    );
  }

  private renderPreviews() {
    const gifs = this.gifs.slice(
      this.currentOffset,
      (this.currentOffset += this.limit)
    );
    const measureSize = (): [number, number] => {
      return [undefined, undefined];
    };

    for (const document of gifs) {
      if (document.$t !== "Document") {
        continue;
      }

      const video = createElement(VideoAttachment, {
        document,
        tg: Gif.tg,
        measureSize,
        autoDownload: true
      });
      const preview = createElement("div", { class: styles.preview }, video);

      on(preview, "mouseup", () => {
        this.onGifSelect(document);
      });

      this.element.append(preview);
    }
  }

  public panelClose() {
    removeChildren(this.element);
  }

  public async panelOpen() {
    this.currentOffset = 0;
    await this.loadPromise;
    this.renderPreviews();
    requestAnimationFrame(() => {
      this.element.scrollTop = 0;
    });
  }
}
