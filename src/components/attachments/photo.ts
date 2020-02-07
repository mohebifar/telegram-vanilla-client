import { MessageMediaPhoto, Photo, PhotoSize } from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { sortPhotoSizes } from "../../utils/chat";
import { Component, createElement } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import * as styles from "../chat/chat.scss";

export interface Options {
  media: MessageMediaPhoto;
  tg: TelegramClientProxy;
}

export default class PhotoAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media, tg }: Options) {
    const element = createElement("img", {
      class: styles.attachment,
      src: EMPTY_IMG
    });
    const sorted = sortPhotoSizes((media.photo as Photo).sizes.slice());
    const size = sorted[0] as PhotoSize;

    if (size) {
      element.style.height = `${size.h}px`;
      element.style.width = `${size.w}px`;
    }

    tg.fileStorage.downloadMedia(media, size).then(url => {
      element.setAttribute("src", url);
    });

    this.element = element;
  }
}
