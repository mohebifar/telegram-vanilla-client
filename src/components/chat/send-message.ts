import autosize from "autosize";
import { createElement, Component } from "../../utils/dom";
import * as styles from "./send-message.scss";
import IconButton from "../ui/icon-button";
import { Icons } from "../ui/icon";
import { SimplifiedMessageRequest } from "../../utils/store";

interface Options {
  callback(message: SimplifiedMessageRequest): any;
}

export default class SendMessageForm implements Component<Options> {
  public readonly element: HTMLElement;
  private callback: Options["callback"];
  private inputNode: HTMLTextAreaElement;

  constructor({ callback }: Options) {
    this.callback = callback;
    this.inputNode = createElement("textarea", {
      rows: "1",
      placeholder: "Message"
    }) as HTMLTextAreaElement;
    autosize(this.inputNode);

    this.element = createElement(
      "form",
      { class: `hidden ${styles.container}`, action: "#" },
      createElement("div", { class: styles.inputWrapper }, this.inputNode),
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
      message: value
    });
  };
}
