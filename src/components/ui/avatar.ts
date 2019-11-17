import { createElement, Component } from "../../utils/dom";
import { getChatLetters } from "../../utils/chat";
import store from "../../utils/store";
import { EMPTY_IMG } from "../../utils/images";
import { PresentationalDialog } from "../../models/dialog";
import * as styles from "./avatar.scss";

interface Options {
  chatId: number;
}

export default class Avatar implements Component<Options> {
  public readonly element: HTMLElement;
  private readonly avatar: Element;
  private chatId: number;

  constructor({ chatId }: Options) {
    this.chatId = chatId;
    const { img, name } = this.getInfo();

    this.avatar = createElement("img", {
      src: img || EMPTY_IMG,
      alt: name,
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
      getChatLetters(name)
    );

    this.element = createElement(
      "div",
      { class: styles.avatar },
      placeholder,
      this.avatar
    );

    this.register();
  }

  private getInfo() {
    const model = PresentationalDialog.findById(this.chatId);
    let img: string;

    switch (model.peer.$t) {
      case "User":
      case "Channel":
      case "Chat":
        store.fileStorage.downloadProfilePhoto(model.peer).then(url => {
          if (!url) {
            return;
          }

          img = url;
          if (this.avatar) {
            this.avatar.classList.remove("hidden");
            this.avatar.setAttribute("src", url);
          }
        });
        break;
      case "UserEmpty":
      // TODO: Ghost/Deleted account image?
    }

    return { img, name: model.displayName };
  }

  register() {
    // TODO: Subscribe to user updates
  }
}
