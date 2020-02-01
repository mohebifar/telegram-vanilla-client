import { IMessage } from "../../models/message";
import { getServiceMessage } from "../../utils/chat";
import { Component, createElement } from "../../utils/dom";
import * as styles from "./chat.scss";

interface Options {
  message: IMessage;
}

export default class ServiceBubble implements Component<Options> {
  public element: HTMLElement;
  public message: IMessage;

  constructor({ message }: Options) {
    this.message = message;

    if (message.$t !== "MessageService") {
      this.element = undefined;
      return;
    }

    this.element = createElement("div", { class: styles.serviceMsg });
    this.getText().then(text => {
      this.element.append(text);
    });
  }

  private async getText() {
    const message = this.message;
    if (message.$t !== "MessageService") {
      return "";
    }

    return getServiceMessage(message);
  }
}
