import {
  MessageMediaDocument,
  MessageMediaPhoto,
  MessageMediaWebPage
} from "../../core/tl/TLObjects";
import { IDialog } from "../../models/dialog";
import { IMessage, Message } from "../../models/message";
import { IPeer } from "../../models/peer";
import { messageToHTML } from "../../utils/chat";
import {
  Component,
  createElement,
  Element,
  removeChildren
} from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import { TransientMedia } from "../../utils/useful-types";
import AnimatedStickerAttachment from "../attachments/animated-sticker";
import AudioAttachment from "../attachments/audio-player";
import FileAttachment from "../attachments/file";
import PhotoAttachment from "../attachments/photo";
import VideoAttachment from "../attachments/video";
import WebAttachment from "../attachments/web";
import { makeContextMenu } from "../ui/context-menu";
import Icon, { Icons } from "../ui/icon";
import { mediaLightBox } from "../ui/media-lightbox";
import * as styles from "./chat.scss";
import QuoteBox from "./quote-box";
import ServiceBubble from "./service-bubble";

interface Options {
  message: IMessage;
  dialog: IDialog;
  peer: IPeer;
  onReplyClick(messageId?: number): void;
  onReply(replyMessage?: IMessage): void;
  isTransient?: boolean;
}

export default class Bubble implements Component<Options> {
  public readonly element: HTMLElement;
  private inner: HTMLElement;
  private attachment: HTMLElement;
  private messageText: HTMLElement;
  private time: HTMLElement;
  private sentIndicator?: Element<Icon>;
  private onReplyClick: Options["onReplyClick"];
  private onReply: Options["onReply"];
  public message: IMessage;
  public dialog: IDialog;
  public peer: IPeer;

  constructor({ message, dialog, onReply, peer, onReplyClick }: Options) {
    this.message = message;
    this.dialog = dialog;
    this.peer = peer;
    this.onReplyClick = onReplyClick;
    this.onReply = onReply;

    if (message.$t === "MessageService") {
      this.element = createElement(ServiceBubble, { message });
      return;
    }

    this.messageText = createElement("span", { dir: "auto" });
    this.inner = createElement("div", { class: styles.inner }, this.time);
    this.attachment = createElement("div", { class: styles.attachmentWrapper });

    const messageWrapper = createElement(
      "div",
      { class: styles.message },
      this.messageText,
      createElement("span", { class: styles.time, dir: "auto" }, this.inner)
    );

    this.element = createElement(
      "div",
      { "data-id": message.id },
      this.attachment,
      messageWrapper
    );

    this.element.addEventListener("contextmenu", e => {
      e.preventDefault();

      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }

      makeContextMenu({ x: e.clientX, y: e.clientY }, [
        ...(this.peer.canSendMessage()
          ? [
              {
                icon: Icons.Reply,
                title: "Reply",
                onClick: close => {
                  close();
                  this.onReply(this.message);
                }
              }
            ]
          : []),
        ...(this.isSticker()
          ? []
          : [
              {
                icon: Icons.Copy,
                title: "Copy",
                onClick: close => {
                  close();
                  if (this.message.$t === "Message") {
                    navigator.clipboard.writeText(this.message.message);
                  }
                }
              }
            ]),
        {
          icon: Icons.Forward,
          title: "Forward"
        },
        {
          icon: Icons.Pin,
          title: "Pin"
        },
        {
          icon: Icons.Delete,
          title: "Delete",
          variant: "red"
        }
      ]);
    });

    if (message.$t === "Message" && message.replyToMsgId) {
      this.element.prepend(this.getReplyElement(message.replyToMsgId));
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

  public update() {
    const [attachment, attachmentType] = this.getAttachments();
    const { text, time } = this.getInfo();
    this.messageText.innerHTML = text;

    const isAnimatedSticker = attachmentType == "animated-sticker";
    const isSticker = attachmentType === "sticker" || isAnimatedSticker;
    let bubbleClassName = styles.bubble;

    if (isSticker) {
      bubbleClassName = styles.sticker;
    } else if (text === "") {
      bubbleClassName += " " + styles.emptyText;

      if (["photo", "video"].includes(attachmentType)) {
        bubbleClassName += " " + styles.imageOnly;
      }
    }

    if (this.message.$t === "Message" && this.message.replyToMsgId) {
      bubbleClassName += " " + styles.hasReply;
    }

    if (isAnimatedSticker) {
      bubbleClassName += " " + styles.animated;
    }

    this.element.className = bubbleClassName;

    this.updateInner(time);

    if (attachment) {
      removeChildren(this.attachment);
      this.attachment.append(attachment);

      if (attachmentType === "web") {
        this.element.append(this.attachment);
      }

      if (attachment.style.width) {
        this.element.style.width = attachment.style.width;
      }
    }
  }

  public async updateInner(time?: string) {
    if (!time) {
      time = this.getInfo().time;
    }
    removeChildren(this.inner);

    if (this.time) {
      this.time.remove();
    }

    this.time = createElement("span", {}, time);

    if (this.sentIndicator) {
      this.sentIndicator.remove();
    }

    this.inner.append(this.time);

    if (this.message.$t === "Message" && this.message.out) {
      const icon = this.message.justSent
        ? Icons.Recent
        : this.message.id > this.dialog.readOutboxMaxId
        ? Icons.Check
        : Icons.Checks;
      this.sentIndicator = createElement(Icon, {
        icon,
        color: this.isSticker() ? "white" : "green",
        class: styles.sentIndicator
      });

      this.inner.append(this.sentIndicator);
    }
  }

  private isSticker() {
    return this.element.classList.contains(styles.sticker);
  }

  private getAttachments(): [HTMLElement | undefined, string | undefined] {
    if (
      this.message.$t === "Message" &&
      this.message.media &&
      this.message.media.$t !== "MessageMediaEmpty"
    ) {
      const { media } = this.message;
      if (media.$t === "MessageMediaPhoto" && media.photo.$t === "Photo") {
        return this.getPhotoAttachment(media);
      } else if (media.$t === "MessageMediaDocument") {
        if (media.document.$t === "Document") {
          const { attributes } = media.document;
          // Check for sticker
          if (attributes.some(attr => attr.$t === "DocumentAttributeSticker")) {
            if (media.document.mimeType === "application/x-tgsticker") {
              return this.getAnimatedSticker(media);
            } else {
              return this.getImageSticker(media);
            }
          } else if (
            attributes.some(attr => attr.$t === "DocumentAttributeVideo")
          ) {
            return this.getVideoAttachment(media);
          } else if (
            attributes.some(attr => attr.$t === "DocumentAttributeAudio")
          ) {
            return this.getAudioAttachment(media);
          } else {
            return this.getFileAttachment(media);
          }
        }
      } else if (media.$t === "MessageMediaWebPage") {
        return this.getWebAttachment(media);
      } else if (media.$t === "TransientMedia") {
        if (media.type === "media") {
          return this.getTransientPhotoAttachment(media);
        } else {
          return this.getTransientFileAttachment(media);
        }
      }

      console.log("Unsupported media", media);

      return [
        createElement("div", { class: styles.message }, "[Unsupported media]"),
        "unknown"
      ];
    }

    return [undefined, undefined];
  }

  private getAnimatedSticker(
    media: MessageMediaDocument
  ): [HTMLElement, "animated-sticker"] {
    return [
      createElement(AnimatedStickerAttachment, { media, tg: this.message.tg }),
      "animated-sticker"
    ];
  }

  private getImageSticker(
    media: MessageMediaDocument
  ): [HTMLElement, "sticker"] {
    const sticker = createElement("img", {
      class: styles.attachment,
      src: EMPTY_IMG
    });

    this.message.tg.fileStorage.downloadMedia(media).then(url => {
      sticker.setAttribute("src", url);
    });
    return [sticker, "sticker"];
  }

  private getPhotoAttachment(media: MessageMediaPhoto): [HTMLElement, "photo"] {
    const onClick = () => {
      this.dialog.getPeer().then(peer => {
        mediaLightBox({
          initialPhoto: element.instance.getSrc(),
          peer,
          message: this.message,
          source: element,
          tg: this.message.tg
        });
      });
    };

    const element = createElement(PhotoAttachment, {
      tg: this.message.tg,
      media,
      onClick
    });

    return [element, "photo"];
  }

  private getVideoAttachment(
    media: MessageMediaDocument
  ): [HTMLElement | undefined, "video" | undefined] {
    const onClick = (initialPhoto: string) => {
      this.dialog.getPeer().then(peer => {
        mediaLightBox({
          initialPhoto,
          peer,
          message: this.message,
          source: element,
          tg: this.message.tg
        });
      });
    };

    const element = createElement(VideoAttachment, {
      tg: this.message.tg,
      media,
      onClick
    });
    return [element, "video"];
  }

  private getFileAttachment(
    media: MessageMediaDocument
  ): [HTMLElement | undefined, "file" | undefined] {
    return [
      createElement(FileAttachment, { media, tg: this.message.tg }),
      "file"
    ];
  }

  private getTransientFileAttachment(
    media: TransientMedia
  ): [HTMLElement | undefined, "file" | undefined] {
    return [
      createElement(FileAttachment, { media, tg: this.message.tg }),
      "file"
    ];
  }

  private getTransientPhotoAttachment(
    media: TransientMedia
  ): [HTMLElement | undefined, "photo" | undefined] {
    return [
      createElement(PhotoAttachment, { media, tg: this.message.tg }),
      "photo"
    ];
  }

  private getAudioAttachment(
    media: MessageMediaDocument
  ): [Element<AudioAttachment>, "audio"] {
    return [
      createElement(AudioAttachment, { media, tg: this.message.tg }),
      "audio"
    ];
  }

  private getWebAttachment(media: MessageMediaWebPage): [HTMLElement, "web"] {
    return [
      createElement(WebAttachment, { media, tg: this.message.tg }),
      "web"
    ];
  }

  private getReplyElement(replyMsgId: number) {
    const element = createElement("div");

    Message.get({
      id: replyMsgId,
      isChannel: Number(this.dialog.peerType === "Channel")
    }).then(message => {
      if (message && message.$t === "Message") {
        element.append(
          createElement(QuoteBox, {
            message,
            onClick: () => this.onReplyClick(message.id)
          })
        );
      } else {
        element.remove();
      }
    });

    return element;
  }

  private getInfo() {
    switch (this.message.$t) {
      case "Message":
        return {
          text: messageToHTML(this.message),
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
