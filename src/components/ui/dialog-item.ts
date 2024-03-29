import { IDialog } from "../../models/dialog";
import { IMessage } from "../../models/message";
import { IPeer } from "../../models/peer";
import {
  getDialogDisplayDate,
  getIsTypingText,
  shortenCount,
  escapeHTML,
} from "../../utils/chat";
import { Component, createElement, removeChildren, on } from "../../utils/dom";
import Avatar from "./avatar";
import Icon, { Icons } from "./icon";
import { replaceEmoji } from "../../utils/emojis";

import * as styles from "./dialog-item.scss";
import { makeContextMenu } from "./context-menu";

interface Options {
  scope?: "search";
  dialog?: IDialog;
  message?: IMessage;
  highlightText?: string;
  peer: IPeer;
  onClick: (peer: IPeer, message: IMessage) => any;
}

export default class DialogItem implements Component<Options> {
  public element: HTMLElement;
  public dialog?: Options["dialog"];

  private avatar: HTMLElement;
  private text: HTMLElement;
  private title: HTMLElement;
  private date: HTMLElement;
  private dateWrapper: HTMLElement;
  private unreadCount: HTMLElement;
  private message: Options["message"];
  private peer: Options["peer"];
  private onClick: Options["onClick"];
  private scope?: Options["scope"];
  private highlightText?: Options["highlightText"];
  private removeLongPress: Function;

  constructor(options: Options) {
    const wrapper = createElement("div", {
      class: styles.container + " ripple",
    });

    this.element = wrapper;
    this.peer = options.peer;
    this.dialog = options.dialog;
    this.message = options.message;
    this.onClick = options.onClick;
    this.scope = options.scope;
    this.highlightText = options.highlightText;

    // this.register(options);
  }

  public async register() {
    this.avatar = createElement(Avatar, {
      // chatId: chatId
      peer: this.peer,
      isDialog: this.scope !== "search",
    });

    this.unreadCount = createElement("div");

    this.title = createElement("div", { dir: "auto" });
    this.text = createElement("span", { dir: "auto" });
    this.date = createElement("span");
    this.dateWrapper = createElement("div");

    const dateWrapper = createElement(
      "div",
      { class: styles.dateWrapper },
      this.dateWrapper,
      this.date
    );

    const textWrapper = createElement(
      "div",
      { class: styles.text },
      this.title,
      createElement("div", this.text)
    );

    const meta = createElement(
      "div",
      { class: styles.meta },
      dateWrapper,
      this.unreadCount
    );

    on(this.element, "click", () => this.onClick(this.peer, this.message));
    this.element.appendChild(this.avatar);
    this.element.appendChild(textWrapper);
    this.element.appendChild(meta);

    this.removeLongPress = on(
      this.element,
      "longpress",
      (e: TouchEvent | MouseEvent) => {
        e.preventDefault();
        const clientInfo = "touches" in e ? e.touches[0] : e;
        const { clientX, clientY } = clientInfo;

        this.handleContextMenu(clientX, clientY);
      }
    );

    return this.update();
  }

  public unmount() {
    this.removeLongPress();
  }

  public async update() {
    const { text, title, date, unread, silent, draft } = await this.getInfo();

    let textContent = escapeHTML(text);
    if (this.highlightText) {
      const lowerCaseContent = textContent.toLowerCase();
      let offset = 0;
      textContent = escapeHTML(this.highlightText)
        .split(" ")
        .reduce((str, word) => {
          const index = lowerCaseContent.indexOf(word.toLowerCase());
          if (index === -1) {
            return str;
          }
          const originalWord = str.substr(offset + index, word.length);
          const replacement = `<span class="${styles.highlight}">${originalWord}</span>`;

          offset += replacement.length - originalWord.length;

          return str.replace(originalWord, replacement);
        }, textContent);
    } else if (draft && draft.$t === "DraftMessage") {
      textContent = `<span class="red">Draft: </span>${escapeHTML(
        draft.message
      )}`;
    }

    textContent = replaceEmoji(textContent);

    this.text.innerHTML = textContent;
    this.title.innerHTML = replaceEmoji(escapeHTML(title));
    this.date.innerText = date;
    removeChildren(this.unreadCount);
    this.unreadCount.append(unread || "");
    const isOnline =
      "status" in this.peer && this.peer.status.$t === "UserStatusOnline";
    this.avatar.classList[isOnline ? "add" : "remove"]("online");

    const unreadClassList = [];
    if (!unread && !this.dialog.unreadMark) {
      unreadClassList.push("invisible");
    }
    if (silent) {
      unreadClassList.push(styles.silent);
    }
    if (typeof unread !== "string") {
      unreadClassList.push(styles.unreadIcon);
    }
    removeChildren(this.dateWrapper);
    if (
      this.dialog &&
      this.dialog.readOutboxMaxId > 0 &&
      this.dialog.readInboxMaxId !== this.dialog.readOutboxMaxId &&
      this.dialog.readInboxMaxId !== this.dialog.topMessage &&
      this.dialog.unreadCount === 0
    ) {
      if (this.dialog.readOutboxMaxId === this.dialog.topMessage) {
        this.dateWrapper.append(
          createElement(Icon, {
            icon: Icons.Checks,
            color: "green",
          })
        );
      } else if (this.dialog.readOutboxMaxId < this.dialog.topMessage) {
        this.dateWrapper.append(
          createElement(Icon, {
            icon: Icons.Check,
            color: "green",
          })
        );
      }
    }
    this.unreadCount.className = unreadClassList.join(" ");
  }

  private async getInfo() {
    const title =
      this.scope !== "search"
        ? this.peer.displayPeerName
        : this.peer.displayName;

        if (this.dialog.unreadMark) {
          console.log(this.dialog);
        }

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
        title,
        date,
        text: (text && text.slice(0, 50)) || "",
        silent: this.dialog.slient,
        draft: this.dialog.draft,
      };
    } else {
      const text: string = (this.message as any).message || "";

      return {
        unread: undefined,
        title,
        date: getDialogDisplayDate(this.message.date),
        text: (text && text.slice(0, 50)) || "",
        silent: false,
      };
    }
  }

  private handleContextMenu(x: number, y: number) {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }

    makeContextMenu(
      { x, y },
      [
        {
          icon: Icons.Unread,
          title: "Mark as unread",
          hidden: this.dialog.unreadCount > 0 || this.dialog.unreadMark,
          onClick: async (close) => {
            close();
            this.dialog.markAsUnread();
          },
        },
        {
          icon: this.dialog.pinned ? Icons.Unpin : Icons.Pin,
          title: this.dialog.pinned ? "Unpin" : "Pin",
          onClick: (close) => {
            close();
            this.dialog.togglePin(!this.dialog.pinned).then(() => {
              this.update();
            });
          },
        },
        {
          icon: Icons.Mute,
          title: "Mute",
        },
        {
          icon: Icons.Archive,
          title: "Archive",
        },
        {
          icon: Icons.Delete,
          title: "Delete",
          variant: "red",
        },
      ],
      {
        onClose: () => {},
      }
    );
  }
}
