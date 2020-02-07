import autosize from "autosize";
import { Peer, SimplifiedMessageRequest } from "../../models/peer";
import { Component, createElement } from "../../utils/dom";
import { makeFileDialog, readFile } from "../../utils/upload-file";
import { ContextMenu } from "../ui/context-menu";
import EmojiPanel from "../ui/emoji-panel";
import { Icons } from "../ui/icon";
import IconButton from "../ui/icon-button";
import * as styles from "./send-message.scss";

interface Options {
  callback(message: SimplifiedMessageRequest): any;
}

export default class SendMessageForm implements Component<Options> {
  public readonly element: HTMLElement;
  private callback: Options["callback"];
  private inputNode: HTMLTextAreaElement;
  // private attachmentButton: HTMLButtonElement;

  constructor({ callback }: Options) {
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

    this.element = createElement(
      "form",
      { class: `hidden ${styles.container}`, action: "#" },
      createElement(
        "div",
        { class: styles.inputWrapper },
        emojiActivator,
        this.inputNode,
        attachmentActivator,
        attachmentDropdown,
        emojiPicker
      ),
      createElement(IconButton, { icon: Icons.Send, color: "white" })
    );

    this.inputNode.addEventListener("keypress", e => {
      if (e.which == 13 && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    this.element.addEventListener("submit", this.handleSubmit);
  }

  private handleSubmit = (event?: Event) => {
    if (event) {
      event.preventDefault();
    }
    const value = this.inputNode.value;
    this.inputNode.value = "";
    autosize.update(this.inputNode);
    this.callback({
      $t: "messages_SendMessageRequest",
      message: value
    });
  };

  private createAttachment() {
    let timeout: number;

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

    const imageDialog = makeFileDialog("image/*", false, async file => {
      const buffer = await readFile(file);
      const uploadedFile = await Peer.tg.fileStorage.upload(buffer);
      this.callback({
        $t: "messages_SendMediaRequest",
        message: this.inputNode.value,
        media: {
          $t: "InputMediaUploadedPhoto",
          file: uploadedFile
        }
      });
    });

    const fileDialog = makeFileDialog("*", true, async files => {
      console.log('file upload');
      for (const file of files) {
        const buffer = await readFile(file);
        const uploadedFile = await Peer.tg.fileStorage.upload(buffer);
        // uploadedFile.
        this.callback({
          $t: "messages_SendMediaRequest",
          message: this.inputNode.value,
          media: {
            $t: "InputMediaUploadedDocument",
            file: uploadedFile,
            mimeType: file.type,
            attributes: [
              {
                $t: "DocumentAttributeFilename",
                fileName: file.name
              }
            ]
          }
        });
      }
    });

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

    attachmentDropdown.addEventListener("mouseenter", () => {
      clear();
    });
    attachmentDropdown.addEventListener("mouseleave", () => {
      hide();
    });

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
          target.setRangeText(emoji);
          target.focus();
        } else {
          target.focus();
          document.execCommand("insertText", false, emoji);
        }
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
