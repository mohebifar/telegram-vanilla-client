import autosize from "autosize";
import { SimplifiedMessageRequest, Peer } from "../../models/peer";
import { Component, createElement } from "../../utils/dom";
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
  private attachmentButton: HTMLButtonElement;
  private filePicker: HTMLInputElement;

  constructor({ callback }: Options) {
    this.callback = callback;
    this.inputNode = createElement("textarea", {
      rows: "1",
      placeholder: "Message"
    }) as HTMLTextAreaElement;
    autosize(this.inputNode);

    this.filePicker = createElement("input", {
      type: "file",
      class: "hidden"
    }) as HTMLInputElement;

    this.attachmentButton = createElement(
      "label",
      { class: "hidden" },
      "Upload",
      this.filePicker
    ) as HTMLButtonElement;

    this.filePicker.addEventListener("change", event => {
      let reader = new FileReader();
      reader.onload = async function(e) {
        const buffer = e.target.result as ArrayBuffer;
        const file = await Peer.tg.fileStorage.upload(buffer);
        console.log("file saved", file);
        callback({
          $t: "messages_SendMediaRequest",
          message: "salam",
          media: {
            $t: "InputMediaUploadedPhoto",
            file
          }
        });
      };
      reader.readAsArrayBuffer((event.target as HTMLInputElement).files[0]);
    });

    this.element = createElement(
      "form",
      { class: `hidden ${styles.container}`, action: "#" },
      createElement(
        "div",
        { class: styles.inputWrapper },
        this.inputNode,
        this.attachmentButton
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
}
