import { IPeer } from "../../models/peer";
import { Component, createElement } from "../../utils/dom";
import Avatar from "./avatar";
import * as styles from "./dialog-item.scss";

interface Options {
  peer: IPeer;
  onClick: (peer: IPeer) => any;
}

export default class ContactItem implements Component<Options> {
  public element: HTMLElement;

  private avatar: HTMLElement;
  private text: HTMLElement;
  private title: HTMLElement;
  private onClick: Options["onClick"];

  private peer: IPeer;

  constructor(options: Options) {
    const wrapper = createElement("div", {
      class: styles.container + " ripple"
    });

    this.element = wrapper;
    this.peer = options.peer;
    this.onClick = options.onClick;

    this.register();
  }

  public async register() {
    this.avatar = createElement(Avatar, {
      peer: this.peer
    });

    const title = this.peer.displayName;
    const text = this.peer.type;
    this.title = createElement("div", { dir: "auto" }, title);
    this.text = createElement("span", { dir: "auto" }, text);

    const textWrapper = createElement(
      "div",
      { class: styles.text },
      this.title,
      createElement("div", this.text)
    );

    this.element.addEventListener("click", () => this.onClick(this.peer));
    this.element.appendChild(this.avatar);
    this.element.appendChild(textWrapper);
  }
}
