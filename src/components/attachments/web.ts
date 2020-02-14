import { MessageMediaWebPage } from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement } from "../../utils/dom";
import * as styles from "../chat/chat.scss";

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
      target: "_blank"
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

    tg.fileStorage.downloadMedia(media).then(src => {
      if (!src) {
        return;
      }

      element.prepend(
        createElement(
          "div",
          { class: styles.photo },
          createElement("img", { src })
        )
      );
    });

    this.element = element;
  }
}
