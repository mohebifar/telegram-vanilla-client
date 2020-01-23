import dayjs from "dayjs";
import { createElement, Component } from "../../utils/dom";
import store from "../../utils/store";
import { DialogMessageTypes } from "../../models/dialog";
import { PhotoSize } from "../../core/tl/TLObjects";
import { EMPTY_IMG } from "../../utils/images";

import { messageToHTML } from "./chat";
import * as styles from "./chat.scss";
import Lottie from "../ui/lottie";

interface Options {
  message: DialogMessageTypes;
  isTransient?: boolean;
}

export default class Bubble implements Component<Options> {
  public readonly element: HTMLElement;
  private img: HTMLElement;
  private message: DialogMessageTypes;
  private messageText: HTMLElement;

  constructor({ message, isTransient = false }: Options) {
    this.message = message;

    const { text, time } = this.getInfo();

    this.messageText = createElement("span");
    this.messageText.innerHTML = text;

    const messageWrapper = createElement(
      "div",
      {
        class: styles.message,
        dir: "auto"
      },
      this.messageText,
      createElement(
        "span",
        { class: styles.time },
        createElement("div", { class: styles.inner }, time)
      )
    );

    const [attachment, attachmentType] = this.getAttachments();

    let bubbleClassName: string;
    switch (attachmentType) {
      case "sticker":
        bubbleClassName = styles.sticker;
        break;
      case "animated-sticker":
        bubbleClassName = styles.sticker + " " + styles.animated;
        break;
      default:
        bubbleClassName = styles.bubble;
    }

    this.element = createElement("div", {
      class: bubbleClassName
    });

    if (attachment) {
      this.element.append(attachment);
    }

    if (isTransient) {
      store.sub(`message_sent_${message.id}` as any, _newId => {
        // TODO: Mark message as sent with single tick
      });
    }

    this.element.append(messageWrapper);
  }

  private getAttachments(): [HTMLElement | undefined, string | undefined] {
    if (this.message.$t === "Message" && this.message.media) {
      const { media } = this.message;
      if (media.$t === "MessageMediaPhoto" && media.photo.$t === "Photo") {
        this.img = createElement("img", {
          class: styles.attachment,
          src: EMPTY_IMG
        });
        const size = media.photo.sizes.find(
          size => size.$t === "PhotoSize" || size.$t === "PhotoCachedSize"
        ) as PhotoSize;

        if (size) {
          // TODO: Figure out a better way to handle this
          const photoWidth = 400;
          const aspectRatio = size.h / size.w;
          this.img.style.height = `${aspectRatio * photoWidth}px`;
          this.img.style.width = `${photoWidth}px`;
        }

        store.fileStorage.downloadMedia(media).then(url => {
          this.img.setAttribute("src", url);
        });
        return [this.img, "photo"];
      } else if (media.$t === "MessageMediaDocument") {
        if (media.document.$t === "Document") {
          // Check for sticker
          if (
            media.document.attributes.some(
              attr => attr.$t === "DocumentAttributeSticker"
            )
          ) {
            if (media.document.mimeType === "application/x-tgsticker") {
              // Animated sticker
              const sticker = createElement(Lottie, {
                class: styles.attachment,
                config: {
                  path: ""
                }
              });

              store.fileStorage.downloadMedia(media).then(url => {
                sticker.instance.updateConfig({
                  path: url,
                  loop: true,
                  autoplay: true
                });
              });
              return [sticker, "animated-sticker"];
            } else {
              // Normal sticker
              this.img = createElement("img", {
                class: styles.attachment,
                src: EMPTY_IMG
              });

              store.fileStorage.downloadMedia(media).then(url => {
                this.img.setAttribute("src", url);
              });
              return [this.img, "sticker"];
            }
          }
        }
      }

      return [
        createElement("div", { class: styles.message }, "[Unsupported media]"),
        "unknown"
      ];
    }

    return [undefined, undefined];
  }

  private getInfo() {
    switch (this.message.$t) {
      case "Message":
      case "UpdateShortMessage":
        return {
          text: messageToHTML(this.message.message),
          time: dayjs(this.message.date * 1000).format("HH:mm")
        };
      case "MessageEmpty":
        return {
          text: "",
          time: ""
        };
    }
  }
}
