import { createElement, Component } from "../../utils/dom";
import { getChatLetters, shortenCount } from "../../utils/chat";
import * as styles from "./contact-item.scss";
import store from "../../utils/store";
import { EMPTY_IMG } from "../../utils/images";
import { PresentationalDialog } from "../../models/dialog";

interface Options {
  chatId: number;
}

export default class Dialog implements Component<Options> {
  public readonly element: HTMLElement;
  private readonly avatar: Element;
  private readonly text: Element;
  private readonly title: Element;
  private readonly date: Element;
  private readonly unreadCount: Element;
  private chatId: number;

  constructor({ chatId }: Options) {
    this.chatId = chatId;

    const info = this.getInfo();

    this.avatar = createElement("img", {
      src: info.img || EMPTY_IMG,
      alt: info.title,
      class: "hidden"
    });

    const placeholder = createElement(
      "div",
      {
        class:
          styles.placeholder +
          " " +
          styles[`placeholder_${(Math.abs(chatId) % 8) + 1}`]
      },
      getChatLetters(info.title)
    );

    const avatar = createElement(
      "div",
      { class: styles.avatar },
      placeholder,
      this.avatar
    );

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
      { class: styles.container },
      avatar,
      textWrapper,
      meta
    );

    this.element = wrapper;
    this.register();
  }

  private getInfo() {
    const model = PresentationalDialog.findById(this.chatId);
    const { peer, displayName, displayDate, dialog, text, silent } = model;

    let img: string;

    switch (peer.$t) {
      case "User":
      case "Channel":
      case "Chat":
        store.fileStorage.getProfilePhoto(peer).then(url => {
          if (!url) {
            return;
          }

          img = url;
          if (this.avatar) {
            this.avatar.classList.remove("hidden");
            this.avatar.setAttribute("src", url);
          }
        });
      // case "ChannelForbidden":
      // case "ChatForbidden":
      // case "ChatEmpty":
      //   // no image
      //   break;
    }

    return {
      unread: shortenCount(dialog.$t === "Dialog" ? dialog.unreadCount : 0),
      title: displayName,
      date: displayDate,
      text: text.slice(0, 50),
      silent,
      img
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
  }
}
