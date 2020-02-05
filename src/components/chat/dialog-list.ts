import { Dialog, IDialog } from "../../models/dialog";
import { IMessage } from "../../models/message";
import { IPeer, Peer } from "../../models/peer";
import { Component, createElement, Element } from "../../utils/dom";
import DialogItem from "../ui/dialog-item";
import * as dialogItemStyles from "../ui/dialog-item.scss";
import * as styles from "./side-bar.scss";

interface Options {
  onChatSelect(dialog: IDialog, message: IMessage): any;
}

export default class DialogList implements Component<Options> {
  public readonly element: HTMLElement;

  private readonly dialogsContainer: HTMLElement;
  private readonly pinnedDialogsContainer: HTMLElement;
  private sortedDialogs: IDialog[] = [];
  private activeDialog: IDialog;

  private paginating = false;
  private dialogsToElement = new Map<IDialog, Element<DialogItem>>();
  private onChatSelect: Options["onChatSelect"];

  constructor({ onChatSelect }: Options) {
    this.onChatSelect = onChatSelect;
    this.dialogsContainer = createElement("div", { class: styles.dialogsList });
    this.pinnedDialogsContainer = createElement("div", {
      class: `${styles.dialogsList} ${styles.pinned}`
    });
    this.element = createElement(
      "div",
      {
        class: styles.dialogsWrapper
      },
      this.pinnedDialogsContainer,
      this.dialogsContainer
    );

    this.register();
  }

  public setActiveDialog(newDialog: IDialog) {
    const oldElement = this.dialogsToElement.get(this.activeDialog);
    if (oldElement) {
      oldElement.classList.remove(dialogItemStyles.active);
    }

    this.activeDialog = newDialog;
    const newElement = this.dialogsToElement.get(this.activeDialog);
    if (newElement) {
      newElement.classList.add(dialogItemStyles.active);
    }

    this.activeDialog = newDialog;
  }

  private async register() {
    const dialogs = await Dialog.fetch();
    await this.addDialogs(dialogs);
    Dialog.events.on(
      "saved",
      ({ object }: { object: IDialog; gid: string }) => {
        if (this.dialogsToElement.has(object)) {
          const element = this.dialogsToElement.get(object);
          element.instance.update();
          this.rearrangeItems(object);
        }
      }
    );

    this.element.addEventListener("scroll", () => {
      const isAtBottom =
        this.element.scrollTop + this.element.clientHeight >=
        this.element.scrollHeight - 100;

      if (!this.paginating && isAtBottom) {
        this.paginating = true;

        Dialog.fetch(this.getLastDialog())
          .then(dialogs => this.addDialogs(dialogs))
          .then(() => {
            this.paginating = false;
          })
          .catch(() => {
            this.paginating = false;
          });
      }
    });
  }

  private async addDialogs(dialogs: IDialog[]) {
    const peers = await Peer.bulkGet(
      dialogs.map(dialog => ({
        id: dialog.peerId,
        type: dialog.peerType
      }))
    );

    const zipped: [IDialog, IPeer][] = dialogs.map((v, i) => [v, peers[i]]);

    for (const [dialog, peer] of zipped) {
      await this.addDialog(dialog, peer);
    }
  }

  private async addDialog(dialog: IDialog, peer: IPeer) {
    const element = createElement(DialogItem, {
      dialog,
      peer,
      onClick: this.onChatSelect
    });
    await element.instance.register();

    this.dialogsToElement.set(dialog, element);
    this.sortedDialogs.push(dialog);

    if (dialog.pinned) {
      this.pinnedDialogsContainer.append(element);
    } else {
      this.dialogsContainer.append(element);
    }
  }

  private getLastDialog() {
    return this.sortedDialogs[this.sortedDialogs.length - 1];
  }

  private rearrangeItems(updatedDialog: IDialog) {
    if (updatedDialog.pinned) {
      return;
    }

    const referenceIndex = this.sortedDialogs.findIndex(
      dialog =>
        dialog.lastMessageDate < updatedDialog.lastMessageDate && !dialog.pinned
    );
    const index = this.sortedDialogs.indexOf(updatedDialog);
    const referenceDialog = this.sortedDialogs[referenceIndex];

    this.sortedDialogs.splice(index, 1);
    this.sortedDialogs.splice(referenceIndex, 0, updatedDialog);
    const referenceNode = this.dialogsToElement.get(referenceDialog);
    const node = this.dialogsToElement.get(updatedDialog);
    this.dialogsContainer.insertBefore(node, referenceNode);
    console.log("Reposition dialog ", node, referenceNode);
  }
}
