import {
  Document,
  MessageMediaDocument,
  PhotoCachedSize
} from "../../core/tl/TLObjects";
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
      class: styles.attachment
    });

    const fallbackImage = createElement("img", { src: EMPTY_IMG });
    const element = createElement("div", sticker, fallbackImage);

    (async () => {
      const cachedSize = (media.document as Document).thumbs.find(
        ({ $t }) => $t === "PhotoCachedSize"
      ) as PhotoCachedSize;

      if (cachedSize) {
        const fallback = await tg.fileStorage.downloadMedia(media, cachedSize);
        fallbackImage.setAttribute("src", fallback);
      }

      tg.fileStorage.downloadMedia(media).then(url => {
        sticker.instance.updateConfig({
          path: url,
          loop: true,
          autoplay: true
        });
      });
    })();

    this.element = element;
  }
}
