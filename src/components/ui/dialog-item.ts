import { createElement, Component } from "../../utils/dom";
import { shortenCount } from "../../utils/chat";
import * as styles from "./dialog-item.scss";
import Avatar from "./avatar";
import Icon, { Icons } from "./icon";
import { IDialog } from "../../models/dialog";
import { IPeer } from "../../models/peer";

interface Options {
  dialog: IDialog;
  peer: IPeer;
  onClick: (dialog: IDialog) => any;
}

export default class DialogItem implements Component<Options> {
  public element: HTMLElement;
  private avatar: Element;
  private text: Element;
  private title: Element;
  private date: Element;
  private unreadCount: Element;
  private dialog: Options["dialog"];
  private peer: Options["peer"];
  private onClick: Options["onClick"];

  constructor(options: Options) {
    const wrapper = createElement("div", {
      class: styles.container + " ripple"
    });

    this.element = wrapper;
    this.peer = options.peer;
    this.dialog = options.dialog;
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

    this.element.addEventListener("click", () => this.onClick(this.dialog));
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
    this.unreadCount.innerHTML = "";
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
    const shouldShowPin = this.dialog.unreadCount === 0 && this.dialog.pinned;
    const text = await this.dialog.getText();
    const date = await this.dialog.getDisplayDate();

    return {
      unread: shouldShowPin
        ? createElement(Icon, { icon: Icons.PinnedChat, color: "white" })
        : shortenCount(this.dialog.unreadCount || 0),
      title: this.peer.displayName,
      date,
      text: text.slice(0, 50),
      silent: this.dialog.slient,
      peer: this.peer
    };
  }
}
