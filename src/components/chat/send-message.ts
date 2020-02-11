import autosize from "autosize";
import {
  InputMediaUploadedDocument,
  InputMediaUploadedPhoto
} from "../../core/tl/TLObjects";
import { IMessage } from "../../models/message";
import { Peer, SimplifiedMessageRequest } from "../../models/peer";
import { Component, createElement, removeChildren } from "../../utils/dom";
import {
  getVideoMeta,
  makeFileDialog,
  readFile,
  resizeImage
} from "../../utils/upload-file";
import { ContextMenu } from "../ui/context-menu";
import EmojiPanel from "../ui/emoji-panel";
import { Icons } from "../ui/icon";
import IconButton from "../ui/icon-button";
import QuoteBox from "./quote-box";
import * as styles from "./send-message.scss";

interface Options {
  callback(message: SimplifiedMessageRequest): Promise<IMessage>;
  startTyping(): void;
}

export default class SendMessageForm implements Component<Options> {
  public readonly element: HTMLElement;
  private callback: Options["callback"];
  private inputNode: HTMLTextAreaElement;
  private quoteBox: HTMLElement;
  private replyMessage?: IMessage;

  constructor({ callback, startTyping }: Options) {
    this.callback = callback;
    this.inputNode = createElement("textarea", {
      rows: "1",
      class: styles.messageInput,
      placeholder: "Message",
      dir: "auto"
    }) as HTMLTextAreaElement;
    autosize(this.inputNode);

    const [attachmentDropdown, attachmentActivator] = this.createAttachment();
    const [emojiPicker, emojiActivator] = this.createEmojiPanel();

    this.quoteBox = createElement("div", { class: styles.quoteRow });
    const inputRow = createElement(
      "div",
      { class: styles.inputRow },
      emojiActivator,
      this.inputNode,
      attachmentActivator,
      attachmentDropdown,
      emojiPicker
    );

    this.element = createElement(
      "form",
      { class: `hidden ${styles.container}`, action: "#" },
      createElement(
        "div",
        { class: styles.inputArea },
        this.quoteBox,
        inputRow
      ),
      createElement(IconButton, { icon: Icons.Send, color: "white" })
    );

    this.inputNode.addEventListener("input", () => {
      if (this.inputNode.value !== "") {
        startTyping();
      }
    });

    this.inputNode.addEventListener("keypress", e => {
      if (e.which == 13 && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    this.element.addEventListener("submit", this.handleSubmit);
  }

  public focus() {
    this.inputNode.focus();
  }

  public async setReply(message: IMessage) {
    this.replyMessage = message;
    removeChildren(this.quoteBox);

    this.quoteBox.append(
      createElement(IconButton, {
        icon: Icons.Close,
        color: "grey",
        onClick: () => {
          this.clearReply();
        }
      }),
      createElement(QuoteBox, {
        message
      })
    );
    this.focus();
  }

  private async clearReply() {
    this.replyMessage = undefined;
    removeChildren(this.quoteBox);
  }

  private handleSubmit = (event?: Event) => {
    const value = this.inputNode.value.trim();
    if (event) {
      event.preventDefault();
    }
    if (value === "") {
      return;
    }
    this.inputNode.value = "";
    autosize.update(this.inputNode);

    this.callback({
      $t: "messages_SendMessageRequest",
      message: value,
      ...(this.replyMessage ? { replyToMsgId: this.replyMessage.id } : {})
    });
    this.clearReply();
  };

  private createAttachment() {
    let timeout: number;

    const uploadFactory = (type: "media" | "document") => async (
      files: File[]
    ) => {
      const transientModels: IMessage[] = [];
      const buffers: ArrayBuffer[] = [];
      const message = this.inputNode.value;
      const subscriptions = new Map<File, (progress: number) => any>();
      this.inputNode.value = "";

      for (const file of files) {
        const isPhoto = type === "media" && file.type.startsWith("image/");
        const isVideo = type === "media" && file.type.startsWith("video/");

        let buffer = await readFile(file);
        let width: number;
        let height: number;
        let thumbnail: string;

        if (isPhoto) {
          [buffer, width, height] = await resizeImage(buffer, file.type);
        }
        if (isVideo) {
          try {
            [thumbnail, width, height] = await getVideoMeta(buffer);
            console.log("tt", thumbnail);
          } catch {}
        }

        const transient = await this.callback({
          $t: "messages_SendMediaRequest",
          media: {
            $t: "TransientMedia",
            type,
            file,
            width,
            height,
            thumbnail,
            subscribe: fn => subscriptions.set(file, fn)
          },
          message
        });
        buffers.push(buffer);
        transientModels.push(transient);
      }

      for (const index in files) {
        const file = files[index];
        const transientModel = transientModels[index];
        const buffer = buffers[index];

        const uploadedFile = await Peer.tg.fileStorage.upload(
          buffer,
          progress => {
            const subscription = subscriptions.get(file);
            if (subscription) {
              subscription(progress);
            }
          }
        );

        const media: InputMediaUploadedPhoto | InputMediaUploadedDocument =
          type === "media" && file.type.startsWith("image/")
            ? {
                $t: "InputMediaUploadedPhoto",
                file: uploadedFile
              }
            : {
                $t: "InputMediaUploadedDocument",
                file: uploadedFile,
                mimeType: file.type,
                attributes: [
                  {
                    $t: "DocumentAttributeFilename",
                    fileName: file.name
                  }
                ]
              };

        await this.callback({
          $t: "messages_SendMediaRequest",
          media,
          message
        });

        transientModel.destroy();
      }
    };

    const imageDialog = makeFileDialog(
      "image/*,video/*",
      true,
      uploadFactory("media")
    );
    const fileDialog = makeFileDialog("*", true, uploadFactory("document"));

    const attachmentDropdown = createElement(ContextMenu, {
      class: "hidden " + styles.attachmentMenu,
      clickActivator: false,
      items: [
        {
          title: "Photo or Video",
          icon: Icons.Photo,
          tag: "label",
          for: imageDialog
        },
        {
          title: "Document",
          icon: Icons.Document,
          tag: "label",
          for: fileDialog
        },
        {
          title: "Poll",
          icon: Icons.Poll,
          onClick() {
            console.log("poll");
          }
        }
      ]
    });

    const clear = () => clearTimeout(timeout);
    const hide = () => {
      clear();
      attachmentDropdown.classList.add("hidden");
    };
    const show = () => {
      clear();
      attachmentDropdown.classList.remove("hidden");
      hideWithTimeout();
    };
    const hideWithTimeout = () => {
      clear();
      timeout = setTimeout(() => {
        attachmentDropdown.classList.add("hidden");
      }, 1000);
    };

    attachmentDropdown.addEventListener("mouseenter", clear);
    attachmentDropdown.addEventListener("mouseleave", hide);

    const attachmentActivator = createElement(IconButton, {
      icon: Icons.Attach,
      type: "button",
      onHover() {
        show();
      }
    });

    return [attachmentDropdown, attachmentActivator];
  }

  private createEmojiPanel() {
    const emojiPicker = createElement(EmojiPanel, {
      onEmojiSelect: emoji => {
        const target = this.inputNode;
        if (target.setRangeText) {
          const start = target.selectionStart;
          target.setRangeText(emoji);
          target.focus();
          target.selectionStart = target.selectionEnd = start + emoji.length;
        } else {
          target.focus();
          document.execCommand("insertText", false, emoji);
        }
      },
      onStickerSelect: document => {
        console.log(document);
        this.callback({
          $t: "messages_SendMediaRequest",
          media: {
            $t: "InputMediaDocument",
            id: {
              $t: "InputDocument",
              accessHash: document.accessHash,
              fileReference: document.fileReference,
              id: document.id
            }
          },
          actualMedia: {
            $t: "MessageMediaDocument",
            document
          },
          message: ""
        });
      }
    });

    const emojiActivator = createElement(IconButton, {
      icon: Icons.Smile,
      type: "button",
      onHover: event => {
        event.stopPropagation();
        emojiPicker.instance.setVisibility(true);
      },
      onHoverOut: () => {
        emojiPicker.instance.deferHide();
      }
    });

    return [emojiPicker, emojiActivator];
  }
}
