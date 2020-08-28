import { Document, MessageMediaDocument } from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import Lottie from "../ui/lottie";

import * as styles from "../chat/chat.scss";

export interface Options {
  media: MessageMediaDocument;
  tg: TelegramClientProxy;
}

export default class AnimatedSticker implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media, tg }: Options) {
    const sticker = createElement(Lottie, {
      class: styles.attachment,
    });

    const fallbackImage = createElement("img", {
      src: EMPTY_IMG,
    }) as HTMLImageElement;

    const element = createElement("div", sticker, fallbackImage);

    this.element = element;

    const document = media.document as Document;
    const cachedSize = document.thumbs.find(
      ({ $t }) => $t !== "PhotoSizeEmpty"
    );

    if (cachedSize) {
      tg.fileStorage.downloadMedia(media, 0).then((fallback) => {
        fallbackImage.src = fallback;
      });
    }

    tg.fileStorage.downloadMedia(media).then((url) => {
      sticker.instance.updateConfig({
        path: url,
        loop: true,
        autoplay: true,
      });
    });
  }
}
