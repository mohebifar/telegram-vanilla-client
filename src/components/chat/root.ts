import { createElement, Component } from "../../utils/dom";
import * as styles from "./root.scss";
import SideBar from "./side-bar";
import { TelegramClient } from "../../core/TelegramClient";
import store from "../../utils/store";

interface Options {
  client: TelegramClient;
}

export default class Root implements Component<Options> {
  public readonly element: HTMLElement;
  public client: TelegramClient;

  constructor({ client }: Options) {
    this.element = createElement(
      "div",
      { class: styles.container },
      createElement(SideBar, {})
    );
    this.client = client;

    this.register();
  }

  private async register() {
    store.client = this.client;

    store.getDialogs();
  }
}
