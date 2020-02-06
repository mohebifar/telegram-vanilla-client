import {
  Document,
  DocumentAttributeVideo,
  MessageMediaDocument,
  MessageMediaPhoto,
  Photo,
  PhotoCachedSize,
  PhotoSize,
  MessageMediaWebPage
} from "../../core/tl/TLObjects";
import { IMessage, Message } from "../../models/message";
import { IPeer, Peer } from "../../models/peer";
import { getMessageMediaType, sortPhotoSizes } from "../../utils/chat";
import {
  Component,
  createElement,
  Element,
  removeChildren
} from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import AudioPlayer from "../ui/audio-player";
import FileDownloader from "../ui/file-downloader";
import Icon, { Icons } from "../ui/icon";
import Lottie from "../ui/lottie";
import { messageToHTML } from "./chat";
import * as styles from "./chat.scss";
import ServiceBubble from "./service-bubble";

interface Options {
  message: IMessage;
  peer: IPeer;
  onReplyClick(messageId?: number): void;
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
  private onReplyClick: Options["onReplyClick"];
  public message: IMessage;
  public peer: IPeer;

  constructor({ message, peer, onReplyClick }: Options) {
    this.message = message;
    this.peer = peer;
    this.onReplyClick = onReplyClick;

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

  private update() {
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
      this.sentIndicator = createElement(Icon, {
        icon: this.message.mediaUnread ? Icons.Check : Icons.Checks,
        color: isSticker ? "white" : "green",
        class: styles.sentIndicator
      });

      this.inner.append(this.sentIndicator);
    }

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
    const sticker = createElement(Lottie, {
      class: styles.attachment
    });

    const fallbackImage = createElement("img", { src: EMPTY_IMG });
    const wrapper = createElement("div", sticker, fallbackImage);

    (async () => {
      const cachedSize = (media.document as Document).thumbs.find(
        ({ $t }) => $t === "PhotoCachedSize"
      ) as PhotoCachedSize;

      if (cachedSize) {
        const fallback = await this.message.tg.fileStorage.downloadMedia(
          media,
          cachedSize
        );
        fallbackImage.setAttribute("src", fallback);
      }

      this.message.tg.fileStorage.downloadMedia(media).then(url => {
        sticker.instance.updateConfig({
          path: url,
          loop: true,
          autoplay: true
        });
      });
    })();

    return [wrapper, "animated-sticker"];
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
    this.img = createElement("img", {
      class: styles.attachment,
      src: EMPTY_IMG
    });
    const sorted = sortPhotoSizes((media.photo as Photo).sizes.slice());
    const size = sorted[0] as PhotoSize;

    if (size) {
      this.img.style.height = `${size.h}px`;
      this.img.style.width = `${size.w}px`;
    }

    this.message.tg.fileStorage.downloadMedia(media, size).then(url => {
      this.img.setAttribute("src", url);
    });
    return [this.img, "photo"];
  }

  private getVideoAttachment(
    media: MessageMediaDocument
  ): [HTMLElement | undefined, "video" | undefined] {
    if (media.document.$t !== "Document") {
      return [undefined, undefined];
    }

    const img = createElement("img", {
      src: EMPTY_IMG,
      class: "blur"
    });
    const wrapper = createElement("div", { class: styles.attachment }, img);

    const videoAttributes = media.document.attributes.find(
      ({ $t }) => $t === "DocumentAttributeVideo"
    ) as DocumentAttributeVideo;
    if (videoAttributes) {
      let [width, height] = [videoAttributes.w, videoAttributes.h];
      if (width > 400) {
        [width, height] = [400, Math.floor((height * 400) / width)];
      }

      wrapper.style.width = `${width}px`;
      wrapper.style.height = `${height}px`;
    }

    this.message.tg.fileStorage.downloadMedia(media, 0).then(url => {
      img.setAttribute("src", url);
      img.addEventListener("click", () => {
        this.message.tg.fileStorage.downloadMedia(media).then(src => {
          img.remove();
          const video = createElement("video", { src }) as HTMLVideoElement;
          video.muted = true;
          video.loop = true;
          video.autoplay = true;
          wrapper.append(video);
        });
      });
    });
    return [wrapper, "video"];
  }

  private getFileAttachment(
    media: MessageMediaDocument
  ): [HTMLElement | undefined, "file" | undefined] {
    return [
      createElement(FileDownloader, { media, tg: this.message.tg }),
      "file"
    ];
  }

  private getAudioAttachment(
    media: MessageMediaDocument
  ): [Element<AudioPlayer>, "audio"] {
    return [
      createElement(AudioPlayer, { media, tg: this.message.tg }),
      "audio"
    ];
  }

  private getWebAttachment(media: MessageMediaWebPage): [HTMLElement, "web"] {
    if (media.webpage.$t !== "WebPage") {
      return [undefined, "web"];
    }

    const img = createElement("img", { src: EMPTY_IMG });

    const fs = this.message.tg.fileStorage;
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
      createElement("div", media.webpage.description)
    );
    return [element, "web"];
  }

  private getReplyElement(replyMsgId: number) {
    const title = createElement("div", { class: styles.replyContentTitle }, "");
    const tile = createElement("div");
    const text = createElement("div", { class: styles.replyContentText }, "");
    Message.get(replyMsgId).then(message => {
      if (message.$t === "Message") {
        let content = message.message;

        if (message.media) {
          const [alt, type, srcPromise] = getMessageMediaType(
            message.media,
            true,
            this.message.tg
          );

          if (content === "") {
            content = type;
          }

          if (type === "Sticker") {
            content = alt + content;
          }

          if (srcPromise) {
            srcPromise.then(src => {
              tile.className = styles.replyTile;
              tile.append(createElement("img", { src }));
            });
          }
        }

        text.innerHTML = content;
        Peer.get({ type: "User", id: message.fromId }).then(peer => {
          title.innerHTML = peer.displayName;
        });
      }
    });
    const element = createElement(
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
    element.addEventListener("click", () => {
      this.onReplyClick(replyMsgId);
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
