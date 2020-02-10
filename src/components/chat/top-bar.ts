import { IDialog } from "../../models/dialog";
import { IPeer, Peer } from "../../models/peer";
import { getLastSeenTime } from "../../utils/chat";
import { Component, createElement } from "../../utils/dom";
import Avatar from "../ui/avatar";
import * as styles from "./top-bar.scss";

interface Options {
  dialog: IDialog;
  peer: IPeer;
  onProfileClick: () => any;
}

export default class TopBar implements Component<Options> {
  public readonly element: HTMLElement;
  private displayNameContainer: HTMLElement;
  private subdueText: HTMLElement;
  // private dialog: IDialog;
  private peer: IPeer;

  constructor({ peer, onProfileClick }: Options) {
    // this.dialog = dialog;
    this.peer = peer;

    this.displayNameContainer = createElement("div", { class: styles.title });

    this.subdueText = createElement("div", { class: styles.subdue });

    const profile = createElement(
      "div",
      { class: "pointer" },
      createElement(Avatar, { peer }),
      createElement(
        "div",
        { class: styles.meta },
        this.displayNameContainer,
        this.subdueText
      )
    );

    profile.addEventListener("click", onProfileClick);

    this.element = createElement("div", { class: styles.container }, profile);

    this.peer.loadFull().then(() => {
      this.update();
    });

    this.update();

    Peer.events.on("saved", async ({ object }: { object: any }) => {
      if (object === this.peer) {
        this.update();
      }
    });
  }

  public update() {
    this.displayNameContainer.innerHTML = this.peer.displayName;
    let subdue = this.getSubdueText();
    if (subdue === "online") {
      subdue = `<span class="${styles.online}">${subdue}</span>`;
    }
    this.subdueText.innerHTML = subdue;
  }

  private getSubdueText() {
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
