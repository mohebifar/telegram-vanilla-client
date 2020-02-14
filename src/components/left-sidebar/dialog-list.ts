import { Dialog, IDialog } from "../../models/dialog";
import { IMessage } from "../../models/message";
import { IPeer, Peer } from "../../models/peer";
import {
  Component,
  createElement,
  Element,
  getNthChild
} from "../../utils/dom";
import DialogItem from "../ui/dialog-item";
import * as dialogItemStyles from "../ui/dialog-item.scss";
import { FadeTransition } from "../ui/router";
import * as styles from "./left-sidebar.scss";

interface Options {
  onChatSelect(dialog: IDialog, message: IMessage): any;
}

export default class DialogList extends FadeTransition
  implements Component<Options> {
  public readonly element: HTMLElement;

  private readonly dialogsContainer: HTMLElement;
  private readonly pinnedDialogsContainer: HTMLElement;
  private activeDialog: IDialog;

  private paginating = false;
  private dialogsToElement = new Map<IDialog, Element<DialogItem>>();
  private onChatSelect: Options["onChatSelect"];

  constructor({ onChatSelect }: Options) {
    super();
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
        }
        this.rearrangeItems(object);
      }
    );

    Dialog.events.on("typing", ({ dialog }: { dialog: IDialog }) => {
      if (this.dialogsToElement.has(dialog)) {
        const element = this.dialogsToElement.get(dialog);
        element.instance.update();
      }
    });

    this.element.addEventListener("scroll", () => {
      const isAtBottom =
        this.element.scrollTop + this.element.clientHeight >=
        this.element.scrollHeight - 200;

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

  private onPeerSelect = async (peer: IPeer, message?: IMessage) => {
    const dialog = await peer.getDialog();
    this.onChatSelect(dialog, message);
  };

  private async addDialog(dialog: IDialog, peer: IPeer) {
    const element = createElement(DialogItem, {
      dialog,
      peer,
      onClick: this.onPeerSelect
    });
    await element.instance.register();

    if (this.dialogsToElement.has(dialog)) {
      return;
    }

    this.dialogsToElement.set(dialog, element);

    if (dialog.pinned) {
      this.pinnedDialogsContainer.append(element);
    } else {
      this.dialogsContainer.append(element);
    }
  }

  private getLastDialog() {
    const lastDialogElement = getNthChild(
      this.dialogsContainer,
      "last"
    ) as Element<DialogItem>;

    return lastDialogElement.instance.dialog;
  }

  private async rearrangeItems(updatedDialog: IDialog) {
    if (updatedDialog.pinned) {
      return;
    }
    let updatedElement: Element<DialogItem>;

    if (!this.dialogsToElement.has(updatedDialog)) {
      const peer = await updatedDialog.getPeer();
      await this.addDialog(updatedDialog, peer);
    }

    updatedElement = this.dialogsToElement.get(updatedDialog);

    let element: Element<DialogItem>;
    for (
      element = this.dialogsContainer.firstChild as Element<DialogItem>;
      element != null &&
      updatedDialog.lastMessageDate <= element.instance.dialog.lastMessageDate;
      element = element.nextSibling as Element<DialogItem>
    );

    if (element) {
      this.dialogsContainer.insertBefore(updatedElement, element);
    }
  }
}
