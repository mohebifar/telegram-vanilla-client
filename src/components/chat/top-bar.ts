import { createElement, Component } from "../../utils/dom";
import * as styles from "./top-bar.scss";
import Avatar from "../ui/avatar";
import { PresentationalDialog } from "../../models/dialog";
import { getLastSeenTime } from "../../utils/chat";

interface Options {
  chatId: number;
}

export default class TopBar implements Component<Options> {
  public readonly element: HTMLElement;
  private chatId: number;

  constructor({ chatId }: Options) {
    this.chatId = chatId;

    const model = PresentationalDialog.findById(chatId);
    this.element = createElement(
      "div",
      { class: styles.container },
      createElement(
        "div",
        createElement(Avatar, {
          chatId: chatId
        }),

        createElement(
          "div",
          { class: styles.meta },
          createElement("div", { class: styles.title }, model.displayName),
          createElement("div", { class: styles.subdue }, this.getSubdueText())
        )
      )
    );
  }

  private getSubdueText() {
    const model = PresentationalDialog.findById(this.chatId);
    console.log(model);

    switch (model.peer.$t) {
      case "User":
        return getLastSeenTime(model.peer.status);
      case "UserEmpty":
        return "Last seen a long time ago";
      case "Channel":
      case "ChannelForbidden":
        return "Channel";
      case "Chat":
        return `${model.peer.participantsCount} members`;
      case "ChatForbidden":
        return "Deleted group";
      case "ChatEmpty":
        return "Deleted Group";
      default:
        return "Channe";
    }
  }
}
