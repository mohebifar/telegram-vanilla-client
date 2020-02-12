import { createElement, Component } from "../../utils/dom";
import * as styles from "./chat.scss";
import { IMessage } from "../../models/message";
import { getMessageMediaType, escapeHTML } from "../../utils/chat";

interface Options {
  message: IMessage;
  onClick?(): any;
}

export default class QuoteBox implements Component<Options> {
  public element: HTMLElement;

  constructor({ message, onClick }: Options) {
    const title = createElement("div", { class: styles.replyContentTitle }, "");
    const tile = createElement("div");
    const text = createElement("div", { class: styles.replyContentText }, "");
    const element = createElement(
      "div",
      { class: styles.reply },
      createElement(
        "div",
        { class: styles.replyWrapper },
        createElement("div", { class: styles.replyBorder }),
        tile,
        createElement("div", { class: styles.replyContent }, title, text)
      )
    );

    if (message.$t === "Message") {
      let content = escapeHTML(message.message);

      if (message.media) {
        const [alt, type, srcPromise] = getMessageMediaType(
          message.media,
          true,
          message.tg
        );

        if (content === "") {
          content = type;
        }

        if (type === "Sticker") {
          content = alt + content;
        }

        if (srcPromise) {
          srcPromise.then(src => {
            tile.className = styles.replyTile;
            tile.append(createElement("img", { src }));
          });
        }
      }

      if (onClick) {
        element.addEventListener("click", () => {
          onClick();
        });
      }

      text.innerHTML = content;
      message.getSender().then(peer => {
        if (peer) {
          title.innerHTML = peer.displayName;
        }
      });
    }

    this.element = element;
  }
}
