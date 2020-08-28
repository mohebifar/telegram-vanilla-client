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
import { Message } from "../../models/message";
import { Message as OriginalMessage } from "../../core/tl/TLObjects";
import AudioControls from "./audio-controls";

interface Options {
  onProfileClick: () => any;
  onSearchClick: () => any;
  onBackClick: () => any;
  onMessageSelect: (messageId: number, dialog?: IDialog) => any;
}

export default class TopBar implements Component<Options> {
  public readonly element: HTMLElement;
  private displayNameContainer: HTMLElement;
  private subdueText: HTMLElement;
  private extras: HTMLElement;
  private avatarHolder: HTMLElement;
  private pinnedMessage: HTMLElement;
  private currentPinnedMessage: number;
  private onMessageSelect: Options["onMessageSelect"];
  private peer: IPeer;

  constructor({
    onProfileClick,
    onSearchClick,
    onMessageSelect,
    onBackClick,
  }: Options) {
    this.onMessageSelect = onMessageSelect;

    this.displayNameContainer = createElement("div", { class: styles.title });

    this.subdueText = createElement("div", { class: styles.subdue });

    this.pinnedMessage = createElement("div", { class: styles.pinned });
    const audioControls = createElement(AudioControls, { onMessageSelect });

    this.extras = createElement(
      "div",
      { class: styles.extras },
      audioControls,
      this.pinnedMessage
    );

    const backButton = createElement(IconButton, {
      icon: Icons.Back,
      onClick: onBackClick,
    });
    this.avatarHolder = createElement("div");

    const profile = createElement(
      "div",
      { class: "pointer " + styles.profileHolder },
      this.avatarHolder,
      createElement(
        "div",
        { class: styles.meta },
        this.displayNameContainer,
        this.subdueText
      ),
      this.extras
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
      { class: styles.container + " hidden" },
      backButton,
      profile,
      buttonsHolder
    );

    Peer.events.on("saved", async ({ object }: { object: any }) => {
      if (object === this.peer) {
        this.update();
      }
    });
  }

  public setPeer(peer: IPeer) {
    this.peer = peer;
    this.peer.loadFull().then(() => {
      this.update();
    });
    removeChildren(this.avatarHolder);
    this.avatarHolder.append(
      createElement(Avatar, { peer, size: "sm", isDialog: true })
    );

    this.update();
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
      this.pinnedMessage.classList.add("hidden");
      this.pinnedMessage.innerHTML = "";
    } else if (this.currentPinnedMessage !== pinnedMessageId) {
      removeChildren(this.pinnedMessage);

      Message.bulkFetch([pinnedMessageId], this.peer).then(([message]) => {
        if (message) {
          const text = escapeHTML(
            (message as OriginalMessage).message
              .substr(0, 50)
              .replace(/[\r\n]/g, " ")
          );
          const element = createElement("div", text);
          on(element, "click", (event) => {
            event.stopPropagation();
            this.onMessageSelect(message.id);
          });

          this.pinnedMessage.classList.remove("hidden");
          this.pinnedMessage.append(element);
        }
      });
    }
    this.currentPinnedMessage = pinnedMessageId;

    this.element.classList.remove("hidden");
    this.subdueText.innerHTML = subdue;
  }
}
