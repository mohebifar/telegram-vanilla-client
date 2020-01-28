import { PhotoSize } from "../../core/tl/TLObjects";
import { IMessage } from "../../models/message";
import { Component, createElement } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import Icon, { Icons } from "../ui/icon";
import Lottie from "../ui/lottie";
import { messageToHTML } from "./chat";
import * as styles from "./chat.scss";

interface Options {
  message: IMessage;
  isTransient?: boolean;
}

export default class Bubble implements Component<Options> {
  public readonly element: HTMLElement;
  private img: HTMLElement;
  private messageText: HTMLElement;
  private sentIndicator?: HTMLElement;
  public message: IMessage;

  constructor({ message }: Options) {
    this.message = message;

    const { text, time } = this.getInfo();
    const [attachment, attachmentType] = this.getAttachments();

    this.messageText = createElement("span", { dir: "auto" });
    this.messageText.innerHTML = text;

    if (message.$t === "Message" && message.out) {
      this.sentIndicator = createElement(Icon, {
        icon: message.mediaUnread ? Icons.Check : Icons.Checks,
        color:
          attachmentType === "sticker" || attachmentType == "animated-sticker"
            ? "white"
            : "green",
        class: styles.sentIndicator
      });
    }

    const messageWrapper = createElement(
      "div",
      { class: styles.message },
      this.messageText,
      createElement(
        "span",
        { class: styles.time, dir: "auto" },
        createElement(
          "div",
          { class: styles.inner },
          time,
          this.sentIndicator || ""
        )
      )
    );

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

        this.message.tg.fileStorage.downloadMedia(media).then(url => {
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
                config: { path: "" }
              });

              this.message.tg.fileStorage.downloadMedia(media).then(url => {
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

              this.message.tg.fileStorage.downloadMedia(media).then(url => {
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
        return {
          text: messageToHTML(this.message.message),
          time: this.message.date.format("HH:mm")
        };
      case "MessageEmpty":
      case "MessageService":
        // TODO: Support message service
        return {
          text: "",
          time: ""
        };
    }
  }
}
