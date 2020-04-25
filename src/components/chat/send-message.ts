import autosize from "autosize";
import {
  InputMediaUploadedDocument,
  InputMediaUploadedPhoto,
  Document,
} from "../../core/tl/TLObjects";
import { IMessage } from "../../models/message";
import { Peer, SimplifiedMessageRequest } from "../../models/peer";
import { Component, createElement, removeChildren, removeClass, on, addClass } from "../../utils/dom";
import {
  getVideoMeta,
  makeFileDialog,
  readFile,
  resizeImage,
  readDataURL,
} from "../../utils/upload-file";
import { ContextMenu } from "../ui/context-menu";
import EmojiPanel from "../ui/emoji-panel";
import { Icons } from "../ui/icon";
import IconButton from "../ui/icon-button";
import QuoteBox from "./quote-box";
import * as styles from "./send-message.scss";
import { makeModal } from "../ui/modal";
import Input from "../ui/input";
import FileIcon from "../ui/file-icon";
import { TransientMedia } from "../../utils/useful-types";
import { parseFileSize } from "../../utils/chat";

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
      dir: "auto",
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

    on(this.inputNode, "input", () => {
      if (this.inputNode.value !== "") {
        startTyping();
      }
    });

    on(this.inputNode, "keypress", (e) => {
      if (e.which == 13 && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    on(this.element, "submit", this.handleSubmit);
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
        },
      }),
      createElement(QuoteBox, {
        message,
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
    autosize.update(this.inputNode);
    this.sendMessage({
      $t: "messages_SendMessageRequest",
      message: value,
    });
  };

  private showFilesModal(
    type: "media" | "document",
    requests: SimplifiedMessageRequest[]
  ): Promise<SimplifiedMessageRequest[]> {
    return new Promise(async (resolve, reject) => {
      const element = createElement("div");
      for (const index in requests) {
        const request = requests[index];

        const media: TransientMedia = (request as any).media;

        if (type === "media") {
          let src = media.thumbnail;
          if (!src) {
            src = await readDataURL(media.file);
          }

          element.append(
            createElement(
              "div",
              { class: styles.mediaItem },
              createElement("img", { src })
            )
          );
        } else {
          const fileName = media.file.name;
          const extensionMatch = fileName.match(/\.([\w\d]+)$/);
          const extension = extensionMatch
            ? extensionMatch[1]
            : fileName.substr(fileName.length - 3);

          const fileIcon = createElement(FileIcon, { extension });
          fileIcon.instance.showDocument();
          element.append(
            createElement(
              "div",
              { class: styles.fileItem },
              fileIcon,
              createElement(
                "div",
                createElement("div", fileName),
                createElement("div", parseFileSize(media.file.size))
              )
            )
          );
        }
      }

      const captionInput = createElement(Input, {
        tag: "textarea",
        wrapperClass: styles.captionInput,
        placeholder: "Add a caption...",
      });
      on(captionInput, "keypress", (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
          e.preventDefault();
          submit();
        }
      });
      captionInput.instance.value = this.inputNode.value;
      this.inputNode.value = "";

      const submit = () => {
        const caption = captionInput.instance.value.trim();
        if (requests.length === 1) {
          requests[0].message = caption;
        } else if (caption) {
          this.sendMessage({
            $t: "messages_SendMessageRequest",
            message: caption,
          });
        }

        resolve(requests);
        modal.close();
      };

      const modal = makeModal(
        `Send ${requests.length} files`,
        createElement("div", element, captionInput),
        {
          caption: "Send",
          onClick: submit,
        },
        () => {
          reject();
          this.inputNode.value = captionInput.instance.value;
          this.inputNode.focus();
        }
      );

      requestAnimationFrame(() => captionInput.instance.focus());
    });
  }

  private createAttachment() {
    let timeout: number;

    const uploadFactory = (type: "media" | "document") => async (
      files: File[]
    ) => {
      if (files.length === 0) {
        return;
      }

      const requests: SimplifiedMessageRequest[] = [];
      const buffers: ArrayBuffer[] = [];
      const subscriptions = new Map<File, (progress: number) => any>();

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
          } catch {}
        }

        buffers.push(buffer);

        requests.push({
          $t: "messages_SendMediaRequest",
          media: {
            $t: "TransientMedia",
            type,
            file,
            width,
            height,
            thumbnail,
            fileId: "unassigned",
            subscribe: (fn) => subscriptions.set(file, fn),
          },
          message: "",
        });
      }

      let normalizedRequests: SimplifiedMessageRequest[];

      try {
        normalizedRequests = await this.showFilesModal(type, requests);
      } catch {
        return;
      }

      const transientModels: IMessage[] = [];

      for (const request of normalizedRequests) {
        const transientModel = await this.sendMessage(request);
        transientModels.push(transientModel);
      }

      for (const index in files) {
        const file = files[index];
        const buffer = buffers[index];
        const transientModel = transientModels[index];

        const uploadedFile = await Peer.tg.fileStorage.upload(
          buffer,
          (progress) => {
            const subscription = subscriptions.get(file);
            if (subscription) {
              subscription(progress);
            }
          }
        );

        if (
          transientModel.$t === "Message" &&
          transientModel.media.$t === "TransientMedia"
        ) {
          transientModel.media.fileId = uploadedFile.id;
        }

        const media: InputMediaUploadedPhoto | InputMediaUploadedDocument =
          type === "media" && file.type.startsWith("image/")
            ? {
                $t: "InputMediaUploadedPhoto",
                file: {
                  ...uploadedFile,
                  name: file.name,
                },
              }
            : {
                $t: "InputMediaUploadedDocument",
                file: {
                  ...uploadedFile,
                  name: file.name,
                },
                mimeType: file.type,
                attributes: [
                  {
                    $t: "DocumentAttributeFilename",
                    fileName: file.name,
                  },
                ],
              };

        await this.sendMessage({
          $t: "messages_SendMediaRequest",
          media,
          replyToMsgId:
            transientModel.$t === "Message"
              ? transientModel.replyToMsgId
              : undefined,
          message:
            transientModel.$t === "Message" ? transientModel.message : "",
          transientModel,
        });

        // transientModel.destroy();
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
          for: imageDialog,
        },
        {
          title: "Document",
          icon: Icons.Document,
          tag: "label",
          for: fileDialog,
        },
        {
          title: "Poll",
          icon: Icons.Poll,
          onClick() {
            console.log("poll");
          },
        },
      ],
    });

    const clear = () => clearTimeout(timeout);
    const hide = (doClear: any) => {
      doClear !== false && clear();
      
      removeClass(attachmentDropdown, "visible");

      on(attachmentDropdown, 
        "transitionend",
        () => {
          addClass(attachmentDropdown, "hidden");
        },
        { once: true }
      );
    };
    const show = () => {
      clear();
      addClass(attachmentDropdown, "visible");
      removeClass(attachmentDropdown, "hidden");
    };
    const hideWithTimeout = () => {
      clear();
      timeout = setTimeout(() => {
        hide(false);
      }, 1000);
    };

    on(attachmentDropdown, "mouseenter", clear);
    on(attachmentDropdown, "mouseleave", hide);

    const attachmentActivator = createElement(IconButton, {
      icon: Icons.Attach,
      type: "button",
      onHover() {
        show();
      },
      onHoverOut() {
        hideWithTimeout();
      },
    });

    return [attachmentDropdown, attachmentActivator];
  }

  private createEmojiPanel() {
    const onDocumentSelect = (document: Document) => {
      this.sendMessage(
        {
          $t: "messages_SendMediaRequest",
          media: {
            $t: "InputMediaDocument",
            id: {
              $t: "InputDocument",
              accessHash: document.accessHash,
              fileReference: document.fileReference,
              id: document.id,
            },
          },
          actualMedia: {
            $t: "MessageMediaDocument",
            document,
          },
          message: "",
        },
        false
      );
    };

    const emojiPicker = createElement(EmojiPanel, {
      onEmojiSelect: (emoji) => {
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
      onStickerSelect: onDocumentSelect,
      onGifSelect: onDocumentSelect,
    });

    const emojiActivator = createElement(IconButton, {
      icon: Icons.Smile,
      type: "button",
      onHover: (event) => {
        event.stopPropagation();
        emojiPicker.instance.setVisibility(true);
      },
      onHoverOut: () => {
        emojiPicker.instance.deferHide();
      },
    });

    return [emojiPicker, emojiActivator];
  }

  private sendMessage(message: SimplifiedMessageRequest, clear = true) {
    const result = this.callback({
      ...message,
      ...(this.replyMessage ? { replyToMsgId: this.replyMessage.id } : {}),
    });
    this.clearReply();
    if (clear) {
      this.inputNode.value = "";
      autosize.update(this.inputNode);
    }
    this.focus();
    return result;
  }
}
