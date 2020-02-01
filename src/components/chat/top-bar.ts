import { IDialog } from "../../models/dialog";
import { IPeer } from "../../models/peer";
import { getLastSeenTime } from "../../utils/chat";
import { Component, createElement } from "../../utils/dom";
import Avatar from "../ui/avatar";
import * as styles from "./top-bar.scss";

interface Options {
  dialog: IDialog;
  peer: IPeer;
}

export default class TopBar implements Component<Options> {
  public readonly element: HTMLElement;
  private displayNameContainer: HTMLElement;
  private subdueText: HTMLElement;
  // private dialog: IDialog;
  private peer: IPeer;

  constructor({ peer }: Options) {
    // this.dialog = dialog;
    this.peer = peer;

    this.displayNameContainer = createElement("div", { class: styles.title });

    this.subdueText = createElement("div", { class: styles.subdue });

    this.element = createElement(
      "div",
      { class: styles.container },
      createElement(
        "div",
        createElement(Avatar, { peer }),
        createElement(
          "div",
          { class: styles.meta },
          this.displayNameContainer,
          this.subdueText
        )
      )
    );

    this.peer.loadFull().then(() => {
      this.update();
    });

    this.update();
  }

  private update() {
    this.displayNameContainer.innerHTML = this.peer.displayName;
    this.subdueText.innerHTML = this.getSubdueText();
  }

  private getSubdueText() {
    console.log("this.peer.full", this.peer.fields);
    if (this.peer.full && this.peer.full.$t === "ChannelFull") {
      return `${this.peer.full.participantsCount} members`;
    }

    switch (this.peer.$t) {
      case "User":
        if (this.peer.status) {
          return getLastSeenTime(this.peer.status);
        }
        return this.peer.firstName;
      case "UserEmpty":
        return "Last seen a long time ago";
      case "Channel":
      case "ChannelForbidden":
        if (this.peer.megagroup) {
          return "&nbsp;";
        }

        return "Channel";
      case "Chat":
        return `${this.peer.participantsCount} members`;
      case "ChatForbidden":
        return "Deleted group";
      case "ChatEmpty":
        return "Deleted Group";
      default:
        return "Channe";
    }
  }
}
