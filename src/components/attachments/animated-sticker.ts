import {
  Document,
  MessageMediaDocument,
  DocumentAttributeSticker,
} from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement, on } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import Lottie from "../ui/lottie";

import * as styles from "../chat/chat.scss";
import { openStickerModal } from "../chat/sticker-modal";

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

    const attribute = (media.document as Document).attributes.find(
      ({ $t }) => $t == "DocumentAttributeSticker"
    ) as DocumentAttributeSticker;

    const element = createElement(
      "div",
      { class: "pointer" },
      sticker,
      fallbackImage
    );

    if (attribute.stickerset.$t === "InputStickerSetID") {
      on(element, "click", () => {
        openStickerModal(attribute.stickerset as any);
      });
    }

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

    tg.fileStorage
      .downloadMedia(media)
      .then((url) => fetch(url))
      .then((resp) => resp.json())
      .then((animationData) => {
        sticker.instance.updateConfig({
          animationData,
          loop: true,
          autoplay: true,
        });
      });
  }
}
