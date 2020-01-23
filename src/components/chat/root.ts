import { createElement, Component, Element } from "../../utils/dom";
import * as styles from "./root.scss";
import SideBar from "./side-bar";
import store from "../../utils/store";
import Chat from "./chat";
import { PresentationalDialog } from "../../models/dialog";
import { TelegramClientProxy } from "../../telegram-worker-proxy";

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

  private async register() {
    store.proxy = this.tgProxy;

    store.fetchDialogs();
  }

  private onChatSelect = async (chatId: number) => {
    store.pub("selected_dialog", chatId);
    const model = PresentationalDialog.findById(chatId);
    this.chat.instance.setChat(chatId);
    store.fetchHistory(chatId, model.peer);
  };
}
