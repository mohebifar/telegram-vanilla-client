import { IDialog } from "../../models/dialog";
import { IPeer, Peer } from "../../models/peer";
import { getChatSubdueText } from "../../utils/chat";
import { Component, createElement, on } from "../../utils/dom";
import Avatar from "../ui/avatar";
import * as styles from "./top-bar.scss";
import IconButton from "../ui/icon-button";
import { Icons } from "../ui/icon";
import { makeContextMenu } from "../ui/context-menu";

interface Options {
  dialog: IDialog;
  peer: IPeer;
  onProfileClick: () => any;
  onSearchClick: () => any;
  onBackClick: () => any;
}

export default class TopBar implements Component<Options> {
  public readonly element: HTMLElement;
  private displayNameContainer: HTMLElement;
  private subdueText: HTMLElement;
  // private dialog: IDialog;
  private peer: IPeer;

  constructor({ peer, onProfileClick, onSearchClick, onBackClick }: Options) {
    // this.dialog = dialog;
    this.peer = peer;

    this.displayNameContainer = createElement("div", { class: styles.title });

    this.subdueText = createElement("div", { class: styles.subdue });

    const backButton = createElement(IconButton, { icon: Icons.Back, onClick: onBackClick });

    const profile = createElement(
      "div",
      { class: "pointer " + styles.profileHolder },
      createElement(Avatar, { peer, size: "sm" }),
      createElement(
        "div",
        { class: styles.meta },
        this.displayNameContainer,
        this.subdueText
      )
    );

    const buttonsHolder = createElement(
      "div",
      { class: styles.buttons },
      createElement(IconButton, {
        icon: Icons.Search,
        onClick: () => {
          onSearchClick();
        },
      }),
      createElement(IconButton, {
        icon: Icons.More,
        onClick: (event) => {
          const rect = (event.target as HTMLElement).getBoundingClientRect();
          makeContextMenu(
            { x: rect.left + rect.width, y: rect.top + rect.height },
            [
              {
                icon: Icons.Delete,
                variant: "red",
                title: "Delete",
              },
            ]
          );
        },
      })
    );

    on(profile, "click", onProfileClick);

    this.element = createElement(
      "div",
      { class: styles.container },
      backButton,
      profile,
      buttonsHolder
    );

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
    this.displayNameContainer.innerText = this.peer.displayName;
    let subdue = getChatSubdueText(this.peer);
    if (subdue === "online") {
      subdue = `<span class="${styles.online}">${subdue}</span>`;
    }
    this.subdueText.innerHTML = subdue;
  }
}
