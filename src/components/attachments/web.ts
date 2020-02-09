import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import * as styles from "../chat/chat.scss";
import { MessageMediaWebPage } from "../../core/tl/TLObjects";

export interface Options {
  media: MessageMediaWebPage;
  tg: TelegramClientProxy;
}

export default class WebAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media, tg }: Options) {
    if (media.webpage.$t !== "WebPage") {
      return;
    }

    const img = createElement("img", { src: EMPTY_IMG });

    const fs = tg.fileStorage;
    fs.downloadMedia(media).then(src => {
      img.setAttribute("src", src);
    });

    const element = createElement(
      "a",
      {
        class: styles.webPageWrapper,
        href: media.webpage.url,
        target: "_blank"
      },
      createElement("div", { class: styles.photo }, img),
      createElement("div", { class: styles.name }, media.webpage.siteName),
      createElement("div", { class: styles.text }, media.webpage.description)
    );

    this.element = element;
  }
}
