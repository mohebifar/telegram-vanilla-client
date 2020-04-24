import { IPeer } from "../../models/peer";
import { Component, createElement, removeChildren, on } from "../../utils/dom";
import Avatar from "./avatar";
import * as styles from "./dialog-item.scss";
import { getChatSubdueText } from "../../utils/chat";

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

    this.update();

    this.peer.loadFull().then(() => {
      this.update();
    });
  }

  public async update() {
    removeChildren(this.element);
    this.avatar = createElement(Avatar, {
      peer: this.peer
    });
    const title = this.peer.displayName;
    const text = getChatSubdueText(this.peer);
    this.title = createElement("div", { dir: "auto" }, title);
    this.text = createElement("span", { dir: "auto" }, text);

    const textWrapper = createElement(
      "div",
      { class: styles.text },
      this.title,
      createElement("div", this.text)
    );

    on(this.element, "click", () => this.onClick(this.peer));
    this.element.append(this.avatar, textWrapper);
  }
}
