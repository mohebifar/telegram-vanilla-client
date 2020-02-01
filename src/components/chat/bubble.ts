import { PhotoSize } from "../../core/tl/TLObjects";
import { IMessage, Message } from "../../models/message";
import { IPeer, Peer } from "../../models/peer";
import { Component, createElement, Element } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import Icon, { Icons } from "../ui/icon";
import Lottie from "../ui/lottie";
import { messageToHTML } from "./chat";
import * as styles from "./chat.scss";
import ServiceBubble from "./service-bubble";

interface Options {
  message: IMessage;
  peer: IPeer;
  isTransient?: boolean;
}

export default class Bubble implements Component<Options> {
  public readonly element: HTMLElement;
  private img: HTMLElement;
  private inner: HTMLElement;
  private attachment: HTMLElement;
  private messageText: HTMLElement;
  private time: HTMLElement;
  private sentIndicator?: Element<Icon>;
  public message: IMessage;
  public peer: IPeer;

  constructor({ message, peer }: Options) {
    this.message = message;
    this.peer = peer;

    if (message.$t === "MessageService") {
      this.element = createElement(ServiceBubble, { message });
      return;
    }

    this.messageText = createElement("span", { dir: "auto" });
    this.inner = createElement("div", { class: styles.inner }, this.time);
    this.attachment = createElement("div");

    const messageWrapper = createElement(
      "div",
      { class: styles.message },
      this.messageText,
      createElement("span", { class: styles.time, dir: "auto" }, this.inner)
    );

    if (message.$t === "Message" && message.replyToMsgId) {
      this.element = createElement(
        "div",
        {},
        this.getReplyElement(message.replyToMsgId),
        this.attachment,
        messageWrapper
      );
    } else {
      this.element = createElement("div", {}, this.attachment, messageWrapper);
    }

    if (message.justSent) {
      const listener = ({ message }) => {
        if (message === this.message) {
          this.update();
          Message.events.off("synced", listener);
        }
      };

      Message.events.on("synced", listener);
    }

    this.update();
  }

  private update() {
    const [attachment, attachmentType] = this.getAttachments();
    const { text, time } = this.getInfo();
    this.messageText.innerHTML = text;

    const isAnimatedSticker = attachmentType == "animated-sticker";
    const isSticker = attachmentType === "sticker" || isAnimatedSticker;
    let baseClassName = styles.bubble;
    if (isSticker) {
      baseClassName = styles.sticker;
    } else if (attachmentType === "photo" && text === "") {
      baseClassName += " " + styles.imageOnly;
    }
    let bubbleClassName = isSticker ? styles.sticker : baseClassName;

    if (isAnimatedSticker) {
      bubbleClassName += " " + styles.animated;
    }

    this.inner.innerHTML = "";

    if (this.time) {
      this.time.remove();
    }

    this.time = createElement("span", {}, time);

    if (this.sentIndicator) {
      this.sentIndicator.remove();
    }

    this.inner.append(this.time);

    if (this.message.$t === "Message" && this.message.out) {
      this.sentIndicator = createElement(Icon, {
        icon: this.message.mediaUnread ? Icons.Check : Icons.Checks,
        color: isSticker ? "white" : "green",
        class: styles.sentIndicator
      });

      this.inner.append(this.sentIndicator);
    }

    if (attachment) {
      this.attachment.innerHTML = "";
      this.attachment.append(attachment);
    }

    this.element.className = bubbleClassName;
  }

  private getAttachments(): [HTMLElement | undefined, string | undefined] {
    if (
      this.message.$t === "Message" &&
      this.message.media &&
      this.message.media.$t !== "MessageMediaEmpty"
    ) {
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
                class: styles.attachment
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

      console.log(this.message.media, "Unsupported media");
      return [
        createElement("div", { class: styles.message }, "[Unsupported media]"),
        "unknown"
      ];
    }

    return [undefined, undefined];
  }

  private getReplyElement(replyMsgId: number) {
    const title = createElement("div", { class: styles.replyContentTitle }, "");
    const tile = createElement("div");
    const text = createElement("div", { class: styles.replyContentText }, "");
    Message.get(replyMsgId).then(message => {
      if (message.$t === "Message") {
        let content = message.message;
        if (message.media && message.media.$t === "MessageMediaPhoto") {
          if (content === "") {
            content = "Photo";
          }

          this.peer.tg.fileStorage
            .downloadMedia(message.media, 0)
            .then(photo => {
              tile.className = styles.replyTile;
              tile.append(createElement("img", { src: photo }));
            });
        }

        text.innerHTML = content;
        Peer.get({ type: "User", id: message.fromId }).then(peer => {
          title.innerHTML = peer.displayName;
        });
      }
    });
    return createElement(
      "div",
      { class: styles.reply },
      createElement(
        "div",
        { class: styles.replyWrapper },
        createElement("div", { class: styles.replyBorder }),
        tile,
        createElement("div", { class: styles.replyContent }, title, text)
      )
    );
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
      default:
        // TODO: Support message service
        return {
          text: "",
          time: ""
        };
    }
  }
}
