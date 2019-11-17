// import VirtualizedList from "virtualized-list";
import dayjs from "dayjs";
import { createElement, Component } from "../../utils/dom";
import store from "../../utils/store";
import * as styles from "./chat.scss";
import { DialogMessageTypes } from "../../models/dialog";
import { messageToHTML } from "./chat";
import { PhotoSize } from "../../core/tl/TLObjects";
import { EMPTY_IMG } from "../../utils/images";

interface Options {
  message: DialogMessageTypes;
}

export default class Bubble implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly dialogs: HTMLElement;
  public readonly pinnedDialogs: HTMLElement;
  private img: HTMLElement;
  private message: DialogMessageTypes;
  private messageText: HTMLElement;

  constructor({ message }: Options) {
    this.message = message;
    console.log("message", message);

    const { text, time } = this.getInfo();

    this.messageText = createElement("span");
    this.messageText.innerHTML = text;

    const messageWrapper = createElement(
      "div",
      {
        class: styles.message,
        dir: "auto"
      },
      this.messageText,
      createElement(
        "span",
        { class: styles.time },
        createElement("div", { class: styles.inner }, time)
      )
    );

    this.element = createElement("div", {
      class: `${styles.bubble} ${styles.in}`
    });

    const attachment = this.getAttachments();

    if (attachment) {
      this.element.append(attachment);
    }

    this.element.append(messageWrapper);
  }

  private getAttachments() {
    if (this.message.$t === "Message" && this.message.media) {
      const { media } = this.message;
      if (media.$t === "MessageMediaPhoto" && media.photo.$t === "Photo") {
        this.img = createElement("img", {
          class: styles.attachment,
          src: EMPTY_IMG
        });
        const size = media.photo.sizes.find(
          size => size.$t === "PhotoSize" || size.$t === "PhotoCachedSize"
        ) as PhotoSize;

        if (size) {
          // TODO: Figure out a better way to handle this
          const photoWidth = 400;
          const aspectRatio = size.h / size.w;
          this.img.style.height = `${aspectRatio * photoWidth}px`;
          this.img.style.width = `${photoWidth}px`;
        }

        store.fileStorage.downloadMediaPhoto(media.photo).then(url => {
          this.img.setAttribute("src", url);
        });
        return this.img;
      }

      return createElement(
        "div",
        { class: styles.message },
        "[Unsupported media]"
      );
    }

    return undefined;
  }

  private getInfo() {
    switch (this.message.$t) {
      case "Message":
      case "UpdateShortMessage":
        return {
          text: messageToHTML(this.message.message),
          time: dayjs(this.message.date * 1000).format("HH:mm")
        };
      case "MessageEmpty":
        return {
          text: "",
          time: ""
        };
    }
  }
}
