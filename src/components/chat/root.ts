import { createElement, Component, Element } from "../../utils/dom";
import * as styles from "./root.scss";
import LeftSideBar from "../left-sidebar/left-sidebar";
import Chat from "./chat";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { IDialog } from "../../models/dialog";
import { IMessage } from "../../models/message";

interface Options {
  tgProxy: TelegramClientProxy;
}

export enum Route {
  DialogList = "dl",
  Chat = "c",
  Profile = "p",
}

export default class Root implements Component<Options> {
  public readonly element: HTMLElement;
  public tgProxy: TelegramClientProxy;
  private chat: Element<Chat>;
  private sideBar: Element<LeftSideBar>;

  constructor({ tgProxy }: Options) {
    this.tgProxy = tgProxy;

    this.chat = createElement(Chat, {
      setRoute: this.setRoute,
    });
    this.sideBar = createElement(LeftSideBar, {
      onChatSelect: this.onChatSelect,
    });
    this.element = createElement(
      "div",
      { class: styles.container },
      this.sideBar,
      this.chat
    );
    const resizeCallback = () => {
      this.element.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener("resize", resizeCallback);
    resizeCallback();
    this.register();
  }

  private async register() {
    this.setRoute(Route.DialogList);
  }

  private onChatSelect = async (dialog: IDialog, message?: IMessage) => {
    this.chat.instance.setActiveDialog(dialog, message && message.id);
    this.sideBar.instance.setActiveDialog(dialog);
    this.setRoute(Route.Chat);
  };

  private setRoute = (route: Route) => {
    this.element.setAttribute("data-route", route);
  };
}
