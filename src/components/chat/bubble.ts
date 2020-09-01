import {
  MessageMediaDocument,
  MessageMediaPhoto,
  MessageMediaWebPage,
  MessageMediaContact,
  DocumentAttributeVideo,
  MessageMediaPoll,
  DocumentAttributeSticker,
  Document,
} from "../../core/tl/TLObjects";
import { IDialog } from "../../models/dialog";
import { IMessage, Message } from "../../models/message";
import { IPeer } from "../../models/peer";
import { messageToHTML } from "../../utils/chat";
import {
  Component,
  createElement,
  Element,
  removeChildren,
  on,
  addClass,
  removeClass,
  iterateChildNodes,
  remove,
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
import ContactAttachment from "../attachments/contact";
import { isAllEmoji } from "../../utils/emojis";
import PollAttachment from "../attachments/poll";
import Spinner from "../ui/spinner";
import { makeModal } from "../ui/modal";
import Button from "../ui/button";
import { openStickerModal } from "./sticker-modal";

type AttachmentElement = Element<
  | AnimatedStickerAttachment
  | HTMLImageElement
  | PhotoAttachment
  | VideoAttachment
  | FileAttachment
  | AudioAttachment
  | WebAttachment
  | ContactAttachment
  | PollAttachment
>;

interface Options {
  message: IMessage;
  dialog: IDialog;
  peer: IPeer;
  onReplyClick(messageId?: number): void;
  onReply(replyMessage?: IMessage): void;
  isTransient?: boolean;
  parentBubble?: Bubble;
}

export default class Bubble implements Component<Options> {
  public readonly element: HTMLElement;
  private inner: HTMLElement;
  private attachmentWrapper: HTMLElement;
  public albumWrapper?: HTMLElement;
  private attachment: [AttachmentElement, string];
  public messageText: HTMLElement;
  private time: HTMLElement;
  private sentIndicator?: Element<Icon>;
  private onReplyClick: Options["onReplyClick"];
  private onReply: Options["onReply"];
  public message: IMessage;
  public dialog: IDialog;
  public peer: IPeer;
  private parentBubble?: Bubble;
  private isForwarded: boolean;
  private groupId?: string;
  private removeLongPress: Function;

  constructor({
    message,
    dialog,
    onReply,
    peer,
    onReplyClick,
    parentBubble,
  }: Options) {
    this.message = message;
    this.dialog = dialog;
    this.peer = peer;
    this.onReplyClick = onReplyClick;
    this.onReply = onReply;
    this.parentBubble = parentBubble;

    if (message.$t === "MessageService") {
      this.element = createElement(ServiceBubble, { message });
      return;
    }

    this.groupId = message.$t === "Message" && message.groupedId;
    this.isForwarded = Boolean(
      this.message.$t === "Message" && this.message.fwdFrom
    );
    const replyToId = message.$t === "Message" && message.replyToMsgId;

    this.inner = createElement("div", { class: styles.inner }, this.time);
    this.attachmentWrapper = createElement("div", {
      class: styles.attachmentWrapper,
    });

    if (!parentBubble) {
      this.messageText = createElement("span", { dir: "auto" });
      (this.attachmentWrapper as any).instance = this;
      const messageWrapper = createElement(
        "div",
        { class: styles.message },
        this.messageText,
        createElement("span", { class: styles.time, dir: "auto" }, this.inner)
      );

      const attachmentWrapperOrAlbum = this.groupId
        ? (this.albumWrapper = createElement(
            "div",
            { class: styles.album },
            this.attachmentWrapper
          ))
        : this.attachmentWrapper;

      this.element = createElement(
        "div",
        { "data-id": message.id, "data-date": message.date.format("YY-M-D") },
        attachmentWrapperOrAlbum,
        messageWrapper
      );

      if (replyToId) {
        this.element.prepend(this.getReplyElement(replyToId));
      }

      if (this.isForwarded) {
        this.message.getPeerForwardedFrom().then((displayName) => {
          if (displayName) {
            this.element.prepend(
              createElement("div", { class: styles.fromName }, displayName)
            );
          }
        });
      }
    } else {
      this.element = this.attachmentWrapper;
    }

    this.removeLongPress = on(
      this.element,
      "longpress",
      (e: TouchEvent | MouseEvent) => {
        e.preventDefault();
        const clientInfo = "touches" in e ? e.touches[0] : e;
        const { clientX, clientY } = clientInfo;

        this.handleContextMenu(clientX, clientY);
      }
    );

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

  public unmount() {
    if (this.removeLongPress) {
      this.removeLongPress();
    }

    if (this.groupId && this.albumWrapper) {
      const childrenToRemove: HTMLElement[] = [];

      for (const child of iterateChildNodes(this.albumWrapper)) {
        if (child !== this.attachmentWrapper) {
          childrenToRemove.push(child);
        }
      }

      childrenToRemove.forEach(remove);
    }

    delete this.onReplyClick;
    delete this.onReply;
    delete this.parentBubble;
    delete this.attachmentWrapper;
    delete this.attachment;
    delete this.albumWrapper;
  }

  public update() {
    const attachmentArray =
      this.attachment && this.attachment[1] !== "poll" && this.attachment[1] !== "loading"
        ? this.attachment
        : this.getAttachments();
    const hasChanged = this.attachment !== attachmentArray;
    this.attachment = attachmentArray;
    const [attachment, attachmentType] = attachmentArray;
    const { text, time } = this.getInfo();

    if (this.messageText) {
      this.messageText.innerHTML = text;
    } else if (this.parentBubble && text) {
      removeClass(this.parentBubble.element, styles.imageOnly, styles.emptyText);
      this.parentBubble.messageText.innerHTML = text;
    }

    const isAnimatedSticker = attachmentType == "animated-sticker";
    const isSticker = attachmentType === "sticker" || isAnimatedSticker;
    let bubbleClassName = styles.bubble;

    if (attachment) {
      if (!hasChanged) {
        console.log("Attachment type is the same");
      } else {
        removeChildren(this.attachmentWrapper);
        this.attachmentWrapper.append(attachment);
      }

      if (attachmentType === "web") {
        this.element.append(this.attachmentWrapper);
      }

      // If forwarded, because of the extra line on the left, there is no need to fix the width
      if (attachment.style.width && !this.isForwarded) {
        this.element.style.width = attachment.style.width;
      }
    }

    if (this.parentBubble) {
      return;
    }

    if (this.groupId) {
      this.element.setAttribute("data-group", this.groupId);
    }

    if (isSticker) {
      bubbleClassName = styles.sticker;
    } else if (text === "") {
      bubbleClassName += " " + styles.emptyText;

      if (["photo", "video", "video-round"].includes(attachmentType)) {
        bubbleClassName += " " + styles.imageOnly;
      }

      if (attachmentType === "video-round") {
        bubbleClassName += " " + styles.roundBubble;
      }
    } else if (isAllEmoji(text) && !attachment) {
      bubbleClassName = styles.allEmoji;
    }

    if (this.isForwarded) {
      bubbleClassName += " " + styles.isForward;
    }

    if (this.message.$t === "Message" && this.message.replyToMsgId) {
      bubbleClassName += " " + styles.hasReply;
    }

    if (attachmentType === "poll") {
      bubbleClassName += " " + styles.noOverflow;
    }

    if (isAnimatedSticker) {
      bubbleClassName += " " + styles.animated;
    }

    this.element.className = bubbleClassName;

    this.updateInner(time);
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
        class: styles.sentIndicator,
      });

      this.inner.append(this.sentIndicator);
    }
  }

  private isSticker() {
    return this.element.classList.contains(styles.sticker);
  }

  private getAttachments(): [
    AttachmentElement | undefined,
    string | undefined
  ] {
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
          if (
            attributes.some((attr) => attr.$t === "DocumentAttributeSticker")
          ) {
            if (media.document.mimeType === "application/x-tgsticker") {
              return this.getAnimatedSticker(media);
            } else {
              return this.getImageSticker(media);
            }
          } else if (
            attributes.some((attr) => attr.$t === "DocumentAttributeVideo")
          ) {
            return this.getVideoAttachment(media);
          } else if (
            attributes.some((attr) => attr.$t === "DocumentAttributeAudio")
          ) {
            return this.getAudioAttachment(media);
          } else {
            return this.getFileAttachment(media);
          }
        }
      } else if (media.$t === "MessageMediaWebPage") {
        return this.getWebAttachment(media);
      } else if (media.$t === "MessageMediaContact") {
        return this.getContactAttachment(media);
      } else if (media.$t === "TransientMedia") {
        if (media.type === "media") {
          return this.getPhotoAttachment(media);
        } else if (media.type === "voice") {
          return this.getAudioAttachment(media);
        } else {
          return this.getFileAttachment(media);
        }
      } else if (media.$t === "MessageMediaPoll") {
        return this.getPollAttachment(media);
      } else if ((media.$t as any) === "InputMediaPoll") {
        return [
          createElement(
            "div",
            { style: { textAlign: "center", padding: "2em" } },
            createElement(Spinner, { color: "blue", size: "2em" })
          ),
          "loading",
        ];
      }

      console.log("Unsupported media", media);

      return [
        createElement("div", { class: styles.message }, "[Unsupported media]"),
        "unknown",
      ];
    }

    return [undefined, undefined];
  }

  private getAnimatedSticker(
    media: MessageMediaDocument
  ): [Element<AnimatedStickerAttachment>, "animated-sticker"] {
    return [
      createElement(AnimatedStickerAttachment, { media, tg: this.message.tg }),
      "animated-sticker",
    ];
  }

  private getImageSticker(
    media: MessageMediaDocument
  ): [Element<HTMLImageElement>, "sticker"] {
    const sticker = createElement("img", {
      class: styles.attachment + ' pointer',
      src: EMPTY_IMG,
    });

    const attribute = (media.document as Document).attributes.find(
      ({ $t }) => $t == "DocumentAttributeSticker"
    ) as DocumentAttributeSticker;

    if (attribute.stickerset.$t === "InputStickerSetID") {
      on(sticker, "click", () => {
        openStickerModal(attribute.stickerset as any);
      });
    }

    this.message.tg.fileStorage.downloadMedia(media).then((url) => {
      sticker.setAttribute("src", url);
    });
    return [sticker, "sticker"];
  }

  private getPhotoAttachment(
    media: MessageMediaPhoto | TransientMedia
  ): [Element<PhotoAttachment>, "photo"] {
    const onClick = () => {
      const source = (this.message as any).groupedId
        ? element
        : (element.querySelector("img.ogmedia") as any);

      this.dialog.getPeer().then((peer) => {
        mediaLightBox({
          initialPhoto: element.instance.getSrc(),
          peer,
          message: this.message,
          source,
          tg: this.message.tg,
        });
      });
    };

    const element = createElement(PhotoAttachment, {
      tg: this.message.tg,
      media,
      onClick,
    });

    return [element, "photo"];
  }

  private getContactAttachment(
    media: MessageMediaContact
  ): [Element<ContactAttachment>, "contact"] {
    const element = createElement(ContactAttachment, {
      tg: this.message.tg,
      media,
    });

    return [element, "contact"];
  }

  private getVideoAttachment(
    media: MessageMediaDocument
  ): [Element<VideoAttachment>, "video" | "video-round"] {
    let type: "video" | "video-round" = "video";

    if (media.document.$t === "Document") {
      const videoAttribute = media.document.attributes.find(
        (attribute) => attribute.$t === "DocumentAttributeVideo"
      ) as DocumentAttributeVideo;
      if (videoAttribute.roundMessage) {
        type = "video-round";
      }
    }

    const onClick = (initialPhoto: string) => {
      this.dialog.getPeer().then((peer) => {
        mediaLightBox({
          initialPhoto,
          peer,
          message: this.message,
          source: element,
          tg: this.message.tg,
        });
      });
    };

    const element = createElement(VideoAttachment, {
      tg: this.message.tg,
      media,
      onClick,
    });
    return [element, type];
  }

  private getFileAttachment(
    media: MessageMediaDocument | TransientMedia
  ): [Element<FileAttachment>, "file"] {
    return [
      createElement(FileAttachment, { media, tg: this.message.tg }),
      "file",
    ];
  }

  private getPollAttachment(
    media: MessageMediaPoll
  ): [Element<PollAttachment>, "poll"] {
    return [
      createElement(PollAttachment, { media, message: this.message }),
      "poll",
    ];
  }

  private getAudioAttachment(
    media: MessageMediaDocument | TransientMedia
  ): [Element<AudioAttachment>, "audio"] {
    return [
      createElement(AudioAttachment, {
        media,
        message: this.message,
        tg: this.message.tg,
      }),
      "audio",
    ];
  }

  private getWebAttachment(
    media: MessageMediaWebPage
  ): [Element<WebAttachment>, "web"] {
    return [
      createElement(WebAttachment, { media, tg: this.message.tg }),
      "web",
    ];
  }

  private getReplyElement(replyMsgId: number) {
    const element = createElement("div");

    Message.get({
      id: replyMsgId,
      channelId: Number(
        this.dialog.peerType === "Channel" && this.dialog.peerId
      ),
    }).then((message) => {
      if (message && message.$t === "Message") {
        element.append(
          createElement(QuoteBox, {
            message,
            onClick: () => this.onReplyClick(message.id),
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
          text: messageToHTML(this.message as any),
          time: this.message.date.format("HH:mm"),
        };
      default:
        // MessageEmpty and MessageService not supported by bubble
        return {
          text: "",
          time: "",
        };
    }
  }

  private handleContextMenu(x: number, y: number) {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }

    addClass(this.element, styles.active);

    makeContextMenu(
      { x, y },
      [
        ...(this.peer.canSendMessage()
          ? [
              {
                icon: Icons.Reply,
                title: "Reply",
                onClick: (close) => {
                  close();
                  this.onReply(this.message);
                },
              },
            ]
          : []),
        ...(this.isSticker()
          ? []
          : [
              {
                icon: Icons.Copy,
                title: "Copy",
                onClick: (close) => {
                  close();
                  this.copyToClipboard();
                },
              },
            ]),
        {
          icon: Icons.Forward,
          title: "Forward",
        },
        {
          icon: Icons.Pin,
          title: "Pin",
        },
        {
          icon: Icons.Delete,
          title: "Delete",
          variant: "red",
          onClick: (close) => {
            close();
            this.handleDelete();
          },
        },
      ],
      {
        onClose: () => {
          removeClass(this.element, styles.active);
        },
      }
    );
  }

  private handleDelete() {
    this.dialog.getPeer().then((peer) => {
      if (peer.isChannel()) {
        return this.message.delete();
      }

      const content = createElement(
        "div",
        { style: { marginTop: "-20px" } },
        createElement("p", "Are you sure you want to delete message?"),
        createElement(
          "div",
          { class: styles.deleteButtonsWrapper },
          createElement(Button, {
            caption:
              "DELETE FOR " +
              (peer.isGroupChat()
                ? "ALL PARTICIPANTS"
                : "ME AND " + peer.displayName.toUpperCase()),
            variant: "danger",
            outline: true,
            onClick: () => {
              this.message.delete(true);
              modal.close();
            },
          }),
          createElement(Button, {
            caption: "DELETE JUST FOR ME",
            variant: "danger",
            outline: true,
            onClick: () => {
              this.message.delete();
              modal.close();
            },
          }),
          createElement(Button, {
            caption: "CANCEL",
            outline: true,
            onClick: () => {
              modal.close();
            },
          })
        )
      );
      const modal = makeModal("Delete Message?", content);
    });
  }

  private copyToClipboard() {
    if (this.message.$t === "Message") {
      navigator.clipboard.writeText(this.message.message);
    }
  }
}
