import { createElement, Component, removeClass } from "../../utils/dom";
import { getChatLetters } from "../../utils/chat";
import { EMPTY_IMG } from "../../utils/images";
import * as styles from "./avatar.scss";
import { IPeer } from "../../models/peer";
import Icon, { Icons } from "./icon";

interface Options {
  peer: IPeer;
  size?: "md" | "sm" | "xs" | "l" | "xxs";
  class?: string;
  isDialog?: boolean;
}

export default class Avatar implements Component<Options> {
  public element: HTMLElement;
  private avatar: HTMLElement;
  private peer: Options["peer"];
  private size: Options["size"];
  private className: Options["class"];
  private isDialog: Options["isDialog"];

  constructor({ peer, size, class: className, isDialog }: Options) {
    this.peer = peer;
    this.size = size;
    this.isDialog = isDialog;
    this.className = className || "";

    this.register();
  }

  private async getInfo() {
    let img: string;

    switch (this.peer.$t) {
      case "User":
      case "Channel":
      case "Chat":
        if (this.isSavedMessages()) {
          break;
        }
        this.peer.tg.fileStorage
          .downloadProfilePhoto(this.peer.fields as any)
          .then((url) => {
            if (!url) {
              return;
            }

            img = url;
            if (this.avatar) {
              removeClass(this.avatar, "hidden");
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
    const placeholder = createElement("div", {
      class:
        styles.placeholder +
        " " +
        styles[`placeholder_${(Math.abs(this.peer.id) % 8) + 1}`],
    });
    this.element = createElement("div", {
      class:
        styles.avatar +
        " " +
        this.className +
        (this.size ? " " + styles[this.size] : ""),
    });

    const { img, name } = await this.getInfo();

    if (this.isSavedMessages()) {
      this.avatar = createElement(Icon, {
        icon: Icons.SavedMessages,
        color: "white",
      });
      this.element.classList.add(styles.self);
    } else {
      placeholder.append(getChatLetters(name));

      this.avatar = createElement("img", {
        src: img || EMPTY_IMG,
        alt: name,
        class: "hidden",
      });
    }

    this.element.appendChild(placeholder);
    this.element.appendChild(this.avatar);
  }

  private isSavedMessages() {
    return this.peer.$t === "User" && this.isDialog && this.peer.isSelf;
  }
}
