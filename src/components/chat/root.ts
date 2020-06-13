import { createElement, Component, Element } from "../../utils/dom";
import * as styles from "./root.scss";
import LeftSideBar from "../left-sidebar/left-sidebar";
import Chat from "./chat";
import { IDialog } from "../../models/dialog";
import { IMessage } from "../../models/message";
import { setRouteInfo, registerRouter } from "../../utils/history";

export enum Route {
  DialogList = "dl",
  Chat = "c",
  Profile = "p",
}

export default class Root implements Component {
  public readonly element: HTMLElement;
  private chat: Element<Chat>;
  private sideBar: Element<LeftSideBar>;

  constructor() {
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
    registerRouter({
      onChange: ({ dialog, rsb }) => {
        if (rsb) {
          this.setRoute(rsb ? Route.Profile : Route.Chat);
        } else if (dialog) {
          this.onChatSelect(dialog);
        } else {
          this.setRoute(Route.DialogList);
        }
      },
    });
  }

  private onChatSelect = async (dialog: IDialog, message?: IMessage) => {
    this.chat.instance.setActiveDialog(dialog, message && message.id);
    this.sideBar.instance.setActiveDialog(dialog);
    this.setRoute(Route.Chat);
    setRouteInfo({
      dialog,
    });
  };

  private setRoute = (route: Route) => {
    if (route === Route.DialogList) {
      setRouteInfo({ dialog: null });
    } else if (route === Route.Profile) {
      setRouteInfo({ rsb: false });
    }

    this.element.setAttribute("data-route", route);
  };
}
