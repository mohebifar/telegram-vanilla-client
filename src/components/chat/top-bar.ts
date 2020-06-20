import { IDialog } from "../../models/dialog";
import { IPeer, Peer } from "../../models/peer";
import { getChatSubdueText, escapeHTML } from "../../utils/chat";
import { Component, createElement, on, removeChildren } from "../../utils/dom";
import Avatar from "../ui/avatar";
import * as styles from "./top-bar.scss";
import IconButton from "../ui/icon-button";
import { Icons } from "../ui/icon";
import { makeContextMenu } from "../ui/context-menu";
import { replaceEmoji } from "../../utils/emojis";
import { Message, IMessage } from "../../models/message";
import { Message as OriginalMessage } from "../../core/tl/TLObjects";

interface Options {
  dialog: IDialog;
  peer: IPeer;
  onProfileClick: () => any;
  onSearchClick: () => any;
  onBackClick: () => any;
  onMessageSelect: (message: IMessage) => any;
}

export default class TopBar implements Component<Options> {
  public readonly element: HTMLElement;
  private displayNameContainer: HTMLElement;
  private subdueText: HTMLElement;
  private pinnedMessage: HTMLElement;
  private currentPinnedMessage: number;
  private onMessageSelect: Options['onMessageSelect'];
  // private dialog: IDialog;
  private peer: IPeer;

  constructor({ peer, onProfileClick, onSearchClick, onMessageSelect, onBackClick }: Options) {
    // this.dialog = dialog;
    this.peer = peer;
    this.onMessageSelect = onMessageSelect;

    this.displayNameContainer = createElement("div", { class: styles.title });

    this.subdueText = createElement("div", { class: styles.subdue });

    this.pinnedMessage = createElement("div", { class: styles.pinned });

    const backButton = createElement(IconButton, {
      icon: Icons.Back,
      onClick: onBackClick,
    });

    const profile = createElement(
      "div",
      { class: "pointer " + styles.profileHolder },
      createElement(Avatar, { peer, size: "sm", isDialog: true }),
      createElement(
        "div",
        { class: styles.meta },
        this.displayNameContainer,
        this.subdueText
      ),
      this.pinnedMessage
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
    this.displayNameContainer.innerHTML = replaceEmoji(
      escapeHTML(this.peer.displayPeerName)
    );
    let subdue = getChatSubdueText(this.peer);
    if (subdue === "online") {
      subdue = `<span class="${styles.online}">${subdue}</span>`;
    }

    const pinnedMessageId = this.peer.full && this.peer.full.pinnedMsgId;

    if (!pinnedMessageId) {
      this.pinnedMessage.innerHTML = "";
    } else if (this.currentPinnedMessage !== pinnedMessageId) {
      this.currentPinnedMessage = pinnedMessageId;
      removeChildren(this.pinnedMessage);

      Message.bulkFetch([pinnedMessageId], this.peer).then(([message]) => {
        if (message) {
          const text = escapeHTML(
            (message as OriginalMessage).message
              .substr(0, 50)
              .replace(/[\r\n]/g, " ")
          );
          const element = createElement("div", text);
          on(element, 'click', (event) => {
            event.stopPropagation();
            this.onMessageSelect(message);
          })
          this.pinnedMessage.append(element);
        }
      });
    }
    this.subdueText.innerHTML = subdue;
  }
}
