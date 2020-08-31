import { MessageMediaWebPage, Photo, PhotoSize } from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement } from "../../utils/dom";
import * as styles from "../chat/chat.scss";
import { sortPhotoSizes } from "../../utils/chat";
import { EMPTY_IMG } from "../../utils/images";

export interface Options {
  media: MessageMediaWebPage;
  tg: TelegramClientProxy;
}

export default class WebAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media, tg }: Options) {
    if (media.webpage.$t !== "WebPage") {
      this.element = createElement("div");
      return;
    }

    const element = createElement("a", {
      class: styles.webPageWrapper,
      href: media.webpage.url,
      target: "_blank",
    });

    if (media.webpage.siteName) {
      element.append(
        createElement("div", { class: styles.name }, media.webpage.siteName)
      );
    }

    if (media.webpage.description) {
      element.append(
        createElement("div", { class: styles.text }, media.webpage.description)
      );
    }

    if (media.webpage.photo) {
      const [size] = sortPhotoSizes((media.webpage.photo as Photo).sizes, [
        "m",
        "x",
        "y",
        "i",
      ]) as PhotoSize[];

      const scale = Math.min(size.w, 320) / size.w;
      const photo = createElement("img", {
        src: EMPTY_IMG,
        style: {
          width: `${Math.floor(size.w * scale)}px`,
          height: `${Math.floor(size.h * scale)}px`,
        },
      });

      element.prepend(createElement("div", { class: styles.photo }, photo));

      tg.fileStorage.downloadMedia(media).then((src) => {
        if (src) {
          photo.src = src;
        }
      });
    }

    this.element = element;
  }
}
