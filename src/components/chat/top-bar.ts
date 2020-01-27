import { createElement, Component } from "../../utils/dom";
import * as styles from "./top-bar.scss";
import Avatar from "../ui/avatar";
import { getLastSeenTime } from "../../utils/chat";
import { IDialog } from "../../models/dialog";
import { IPeer } from "../../models/peer";

interface Options {
  dialog: IDialog;
  peer: IPeer;
}

export default class TopBar implements Component<Options> {
  public readonly element: HTMLElement;
  // private dialog: IDialog;
  private peer: IPeer;

  constructor({ peer }: Options) {
    // this.dialog = dialog;
    this.peer = peer;

    this.element = createElement(
      "div",
      { class: styles.container },
      createElement(
        "div",
        createElement(Avatar, { peer }),
        createElement(
          "div",
          { class: styles.meta },
          createElement("div", { class: styles.title }, peer.displayName),
          createElement("div", { class: styles.subdue }, this.getSubdueText())
        )
      )
    );
  }

  private getSubdueText() {
    switch (this.peer.$t) {
      case "User":
        return getLastSeenTime(this.peer.status);
      case "UserEmpty":
        return "Last seen a long time ago";
      case "Channel":
      case "ChannelForbidden":
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
