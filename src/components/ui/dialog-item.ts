import { createElement, Component } from "../../utils/dom";
import { shortenCount } from "../../utils/chat";
import * as styles from "./dialog-item.scss";
import store from "../../utils/store";
import { PresentationalDialog } from "../../models/dialog";
import Avatar from "./avatar";

interface Options {
  chatId: number;
  onClick: (chatId: number) => any;
}

export default class Dialog implements Component<Options> {
  public readonly element: HTMLElement;
  private readonly avatar: Element;
  private readonly text: Element;
  private readonly title: Element;
  private readonly date: Element;
  private readonly unreadCount: Element;
  private chatId: Options["chatId"];

  constructor({ chatId, onClick }: Options) {
    this.chatId = chatId;

    const info = this.getInfo();

    this.avatar = createElement(Avatar, {
      chatId: chatId
    });

    const classList = [];
    if (!info.unread) {
      classList.push("invisible");
    }
    if (info.silent) {
      classList.push(styles.silent);
    }

    this.unreadCount = createElement(
      "div",
      { class: classList.join(" ") },
      info.unread
    );

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

    const wrapper = createElement(
      "div",
      { class: styles.container + " ripple" },
      this.avatar,
      textWrapper,
      meta
    );

    wrapper.addEventListener("click", () => onClick(chatId));

    this.element = wrapper;
    this.register();
  }

  private getInfo() {
    const model = PresentationalDialog.findById(this.chatId);
    const { peer, displayName, displayDate, dialog, text, silent } = model;

    return {
      unread: shortenCount(dialog.$t === "Dialog" ? dialog.unreadCount : 0),
      title: displayName,
      date: displayDate,
      text: text.slice(0, 50),
      silent,
      peer
    };
  }

  private update = () => {
    const { text, title, date, unread } = this.getInfo();
    this.text.innerHTML = text;
    this.title.innerHTML = title;
    this.date.innerHTML = date;
    this.unreadCount.innerHTML = unread;
  };

  register() {
    const dialog = PresentationalDialog.findById(this.chatId);
    dialog.events.on("update", this.update);
    store.sub("selected_dialog", id => {
      const fn = id === this.chatId ? "add" : "remove";
      this.element.classList[fn](styles.active);
    });
  }
}
