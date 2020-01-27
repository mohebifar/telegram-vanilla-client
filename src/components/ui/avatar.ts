import { createElement, Component } from "../../utils/dom";
import { getChatLetters } from "../../utils/chat";
import { EMPTY_IMG } from "../../utils/images";
import * as styles from "./avatar.scss";
import { IPeer } from "../../models/peer";

interface Options {
  peer: IPeer;
}

export default class Avatar implements Component<Options> {
  public element: HTMLElement;
  private avatar: Element;
  private peer: Options["peer"];

  constructor({ peer }: Options) {
    this.peer = peer;

    this.register();
  }

  private async getInfo() {
    let img: string;

    switch (this.peer.$t) {
      case "User":
      case "Channel":
      case "Chat":
        this.peer.tg.fileStorage
          .downloadProfilePhoto(this.peer.fields as any)
          .then(url => {
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

    return { img, name: this.peer.displayName };
  }

  private async register() {
    this.element = createElement("div", { class: styles.avatar });

    const { img, name } = await this.getInfo();

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
          styles[`placeholder_${(Math.abs(this.peer.id) % 8) + 1}`]
      },
      getChatLetters(name)
    );

    this.element.appendChild(placeholder);
    this.element.appendChild(this.avatar);

    // TODO: Subscribe to user updates
  }
}
