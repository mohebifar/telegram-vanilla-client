import { MessageMediaPhoto, Photo, PhotoSize } from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { sortPhotoSizes } from "../../utils/chat";
import { Component, createElement, removeClass, on } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import { fitImageSize, readDataURL } from "../../utils/upload-file";
import { TransientMedia } from "../../utils/useful-types";
import * as styles from "../chat/chat.scss";
import Progress from "../ui/progress";

export interface Options {
  media: MessageMediaPhoto | TransientMedia;
  tg: TelegramClientProxy;
  onClick?: () => any;
}

export default class PhotoAttachment implements Component<Options> {
  public readonly element: HTMLElement;
  private img: HTMLImageElement;

  constructor({ media, onClick, tg }: Options) {
    const img = createElement("img", {
      class: "pointer blur ogmedia",
      src: (media.$t === "TransientMedia" && media.thumbnail) || EMPTY_IMG,
    });
    this.img = img;

    const blurredImage = createElement("img", {
      class: "blur " + styles.blurredPreview,
      src: (media.$t === "TransientMedia" && media.thumbnail) || EMPTY_IMG,
    });

    const progress = createElement(Progress);
    const downloadIndicator = createElement(
      "div",
      { class: "downloadIndicator" },
      progress
    );
    const element = createElement(
      "div",
      { class: styles.attachment },
      blurredImage,
      img,
      downloadIndicator
    );

    if (media.$t === "MessageMediaPhoto") {
      const sorted = sortPhotoSizes((media.photo as Photo).sizes, [
        "x",
        "m",
        "y",
        "i",
      ]);
      const size = sorted[0] as PhotoSize;

      if (size) {
        let scale: number;
        if (size.h > size.w) {
          element.setAttribute("data-vertical", "true");
          scale = Math.min(size.h, 500) / size.h;
        } else {
          scale = Math.min(size.w, 400) / size.w;
        }

        img.width = Math.floor(size.w * scale);
        element.style.height = Math.floor(size.h * scale) + "px";
      }

      let downloaded = false;

      tg.fileStorage.downloadMedia(media, 0).then((url) => {
        blurredImage.src = url;
        if (!downloaded) {
          img.setAttribute("src", url);
        }
      });

      tg.fileStorage
        .downloadMedia(media, size, (t) => {
          progress.instance.progress(t);
        })
        .then((url) => {
          downloaded = true;
          removeClass(img, "blur");
          img.setAttribute("src", url);
          downloadIndicator.remove();
          on(element, "click", onClick);
        });
    } else {
      // Transient Media
      if (media.subscribe) {
        media.subscribe((t) => {
          if (t === 1) {
            downloadIndicator.remove();
            progress.remove();
            removeClass(img, "blur");
          } else {
            progress.instance.progress(t || 0);
          }
        });
      }

      const [w, h] = fitImageSize(media.width, media.height, 320, 320);
      element.style.width = `${w}px`;
      element.style.height = `${h}px`;

      if (!media.thumbnail) {
        readDataURL(media.file).then((url) => {
          img.setAttribute("src", url);
          on(element, "click", onClick);
        });
      }
    }

    this.element = element;
  }

  public getSrc() {
    return this.img.src;
  }
}
