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
  private sideBar: Element<SideBar>;

  constructor({ tgProxy }: Options) {
    this.tgProxy = tgProxy;

    this.chat = createElement(Chat, {});
    this.sideBar = createElement(SideBar, {
      onChatSelect: this.onChatSelect
    });
    this.element = createElement(
      "div",
      { class: styles.container },
      this.sideBar,
      this.chat
    );

    this.register();
  }

  private async register() {}

  private onChatSelect = async (dialog: IDialog) => {
    this.chat.instance.setActiveDialog(dialog);
    this.sideBar.instance.setActiveDialog(dialog);
  };
}
