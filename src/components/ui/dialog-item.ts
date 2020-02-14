import { IDialog } from "../../models/dialog";
import { IMessage } from "../../models/message";
import { IPeer } from "../../models/peer";
import {
  getDialogDisplayDate,
  getIsTypingText,
  shortenCount
} from "../../utils/chat";
import { Component, createElement, removeChildren } from "../../utils/dom";
import Avatar from "./avatar";
import * as styles from "./dialog-item.scss";
import Icon, { Icons } from "./icon";

interface Options {
  dialog?: IDialog;
  message?: IMessage;
  peer: IPeer;
  onClick: (peer: IPeer, message: IMessage) => any;
}

export default class DialogItem implements Component<Options> {
  public element: HTMLElement;
  public dialog: Options["dialog"];

  private avatar: HTMLElement;
  private text: HTMLElement;
  private title: HTMLElement;
  private date: HTMLElement;
  private unreadCount: HTMLElement;
  private message: Options["message"];
  private peer: Options["peer"];
  private onClick: Options["onClick"];

  constructor(options: Options) {
    const wrapper = createElement("div", {
      class: styles.container + " ripple"
    });

    this.element = wrapper;
    this.peer = options.peer;
    this.dialog = options.dialog;
    this.message = options.message;
    this.onClick = options.onClick;

    // this.register(options);
  }

  public async register() {
    const info = await this.getInfo();

    this.avatar = createElement(Avatar, {
      // chatId: chatId
      peer: this.peer
    });

    this.unreadCount = createElement("div", info.unread);

    this.title = createElement("div", { dir: "auto" }, info.title);
    this.text = createElement("span", { dir: "auto" }, info.text);
    this.date = createElement("div", info.date);

    const textWrapper = createElement(
      "div",
      { class: styles.text },
      this.title,
      createElement("div", this.text)
    );

    const meta = createElement(
      "div",
      { class: styles.meta },
      this.date,
      this.unreadCount
    );

    this.element.addEventListener("click", () =>
      this.onClick(this.peer, this.message)
    );
    this.element.appendChild(this.avatar);
    this.element.appendChild(textWrapper);
    this.element.appendChild(meta);

    this.update();
  }

  public async update() {
    const { text, title, date, unread, silent } = await this.getInfo();
    this.text.innerHTML = text;
    this.title.innerHTML = title;
    this.date.innerHTML = date;
    removeChildren(this.unreadCount);
    this.unreadCount.append(unread);

    const classList = [];
    if (!unread) {
      classList.push("invisible");
    }
    if (silent) {
      classList.push(styles.silent);
    }
    if (typeof unread !== "string") {
      classList.push(styles.unreadIcon);
    }
    this.unreadCount.className = classList.join(" ");
  }

  private async getInfo() {
    if (this.dialog) {
      const isTypings = this.dialog.getIsTyping();
      const shouldShowPin = this.dialog.unreadCount === 0 && this.dialog.pinned;
      let text = await getIsTypingText(isTypings);

      if (!text) {
        text = await this.dialog.getText();
      }

      const date = await this.dialog.getDisplayDate();
      return {
        unread: shouldShowPin
          ? createElement(Icon, { icon: Icons.PinnedChat, color: "white" })
          : shortenCount(this.dialog.unreadCount || 0),
        title: this.peer.displayName,
        date,
        text: (text && text.slice(0, 50)) || "",
        silent: this.dialog.slient
      };
    } else {
      const text = (this.message as any).message || "";

      return {
        unread: undefined,
        title: this.peer.displayName,
        date: getDialogDisplayDate(this.message.date),
        text: (text && text.slice(0, 50)) || "",
        silent: false
      };
    }
  }
}
