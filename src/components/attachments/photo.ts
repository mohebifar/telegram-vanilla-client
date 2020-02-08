import { MessageMediaPhoto, Photo, PhotoSize } from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { sortPhotoSizes } from "../../utils/chat";
import { Component, createElement } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import { TransientMedia } from "../../utils/useful-types";
import * as styles from "../chat/chat.scss";
import Progress from "../ui/progress";
import { readDataURL, fitImageSize } from "../../utils/upload-file";

export interface Options {
  media: MessageMediaPhoto | TransientMedia;
  tg: TelegramClientProxy;
}

export default class PhotoAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media, tg }: Options) {
    const img = createElement("img", {
      class: " blur",
      src: (media.$t === "TransientMedia" && media.thumbnail) || EMPTY_IMG
    });

    const progress = createElement(Progress);
    const downloadIndicator = createElement(
      "div",
      { class: styles.downloadIndicator },
      progress
    );
    const element = createElement(
      "div",
      { class: styles.attachment },
      img,
      downloadIndicator
    );

    if (media.$t === "MessageMediaPhoto") {
      const sorted = sortPhotoSizes((media.photo as Photo).sizes.slice());
      const size = sorted[0] as PhotoSize;

      if (size) {
        element.style.width = `${size.w}px`;
        element.style.height = `${size.h}px`;
      }

      let downloaded = false;

      tg.fileStorage.downloadMedia(media, 0).then(url => {
        if (!downloaded) {
          img.setAttribute("src", url);
        }
      });

      tg.fileStorage
        .downloadMedia(media, size, t => {
          progress.instance.progress(t);
        })
        .then(url => {
          downloaded = true;
          img.classList.remove("blur");
          img.setAttribute("src", url);
          downloadIndicator.remove();
        });
    } else {
      if (media.subscribe) {
        media.subscribe(t => {
          progress.instance.progress(t || 0);
        });
      }

      const [w, h] = fitImageSize(media.width, media.height, 320, 320);
      element.style.width = `${w}px`;
      element.style.height = `${h}px`;

      if (!media.thumbnail) {
        readDataURL(media.file).then(url => {
          img.setAttribute("src", url);
        });
      }
    }

    this.element = element;
  }
}
