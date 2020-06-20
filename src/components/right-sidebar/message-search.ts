import { IMessage } from "../../models/message";
import { IPeer } from "../../models/peer";
import { Component, createElement, removeChildren } from "../../utils/dom";
import * as styles from "../left-sidebar/global-search.scss";
import * as sideBarStyles from "../left-sidebar/left-sidebar.scss";
import { SlideTransition } from "../ui/router";
import IconButton from "../ui/icon-button";
import { Icons } from "../ui/icon";
import SearchInput from "../ui/search-input";
import { debounce } from "../../utils/utils";
import DialogItem from "../ui/dialog-item";

interface Options {
  onMessageSelect(peer: IPeer, message: IMessage): any;
  back: Function;
  peer: IPeer;
}

export default class MessageSearch extends SlideTransition
  implements Component<Options> {
  public readonly element: HTMLElement;
  private readonly searchResultView: HTMLElement;
  private onMessageSelect: Options["onMessageSelect"];
  private peer: Options["peer"];

  constructor({ onMessageSelect, peer, back }: Options) {
    super();
    this.peer = peer;
    this.onMessageSelect = onMessageSelect;
    this.searchResultView = createElement("div");

    const searchInput = createElement(SearchInput, {
      onInput: event => {
        const searchValue = event.target.value.trim();
        this.search(searchValue);
      }
    });
    const iconButton = createElement(IconButton, {
      icon: Icons.Close,
      onClick: () => {
        back();
      }
    });
    const topMenu = createElement(
      "div",
      { class: sideBarStyles.topMenu },
      iconButton,
      searchInput
    );

    const element = createElement(
      "div",
      { class: styles.container },
      topMenu,
      this.searchResultView
    );

    this.element = element;

    requestAnimationFrame(() => {
      searchInput.instance.focus();
    });
  }

  private search = debounce(async (q: string) => {
    const isEmpty = q === "";

    if (isEmpty) {
      return;
    }
    removeChildren(this.searchResultView);

    const messages = await this.peer.searchMessage(q);
    for (const message of messages) {
      const peer = await message.getSender();
      const element = await this.makeDialog(message, peer);
      this.searchResultView.append(element);
    }
  }, 400);

  private async makeDialog(message: IMessage, peer: IPeer) {
    const element = createElement(DialogItem, {
      message,
      peer,
      onClick: (peer, message) => {
        this.onMessageSelect(peer, message);
      },
      scope: 'search'
    });
    await element.instance.register();

    return element;
  }
}
