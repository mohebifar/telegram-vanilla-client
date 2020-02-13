import { getInputPeer } from "../../core/tl/utils";
import { Dialog, IDialog } from "../../models/dialog";
import { IMessage, Message } from "../../models/message";
import { IPeer } from "../../models/peer";
import { Component, createElement, removeChildren } from "../../utils/dom";
import { debounce } from "../../utils/utils";
import DialogItem from "../ui/dialog-item";
import { DefaultTransition } from "../ui/router";
import * as styles from "./global-search.scss";

interface Options {
  onChatSelect(dialog: IDialog, message: IMessage): any;
}

export default class GlobalSearch extends DefaultTransition
  implements Component<Options> {
  public readonly element: HTMLElement;
  private readonly dialogsContainer: HTMLElement;
  private onChatSelect: Options["onChatSelect"];

  constructor({ onChatSelect }: Options) {
    super();
    this.onChatSelect = onChatSelect;

    this.dialogsContainer = createElement("div");
    const element = createElement(
      "div",
      { class: styles.container },
      this.dialogsContainer
    );

    this.element = element;
  }

  public search = debounce(async (q: string) => {
    removeChildren(this.dialogsContainer);
    const messages = await Message.globalSearch(q);
    for (const message of messages) {
      const peer = await message.getPeer();
      this.addDialog(message, peer);
    }
  }, 500);

  private handleChatSelect = async (_: any, message: IMessage, peer: IPeer) => {
    let dialog = await peer.getDialog();
    if (!dialog) {
      const fetchedDialogs = await Dialog.fetchByPeer([getInputPeer(peer)]);
      if (fetchedDialogs.length === 0) {
        return;
      }
      dialog = fetchedDialogs[0];
    }

    this.onChatSelect(dialog, message);
  };

  private async addDialog(message: IMessage, peer: IPeer) {
    const element = createElement(DialogItem, {
      message,
      peer,
      onClick: this.handleChatSelect
    });
    await element.instance.register();

    this.dialogsContainer.append(element);
  }
}
