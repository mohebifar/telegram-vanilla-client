import { createElement, Component, Element } from "../../utils/dom";
import * as styles from "./root.scss";
import SideBar from "./side-bar";
import Chat from "./chat";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { IDialog } from "../../models/dialog";

interface Options {
  tgProxy: TelegramClientProxy;
}

export default class Root implements Component<Options> {
  public readonly element: HTMLElement;
  public tgProxy: TelegramClientProxy;
  private chat: Element<Chat>;

  constructor({ tgProxy }: Options) {
    this.tgProxy = tgProxy;

    this.chat = createElement(Chat, {});
    this.element = createElement(
      "div",
      { class: styles.container },
      createElement(SideBar, {
        onChatSelect: this.onChatSelect
      }),
      this.chat
    );

    this.register();
  }

  private async register() {}

  private onChatSelect = async (dialog: IDialog) => {
    this.chat.instance.setChat(dialog);
  };
}
