import { IDialog } from "../../models/dialog";
import { IMessage } from "../../models/message";
import { Component, createElement, Element } from "../../utils/dom";
import { Icons } from "../ui/icon";
import IconButton from "../ui/icon-button";
import SearchInput from "../ui/search-input";
import DialogList from "./dialog-list";
import GlobalSearch from "./global-search";
import * as styles from "./side-bar.scss";

interface Options {
  onChatSelect(dialog: IDialog, message: IMessage): any;
}

export default class SideBar implements Component<Options> {
  public readonly element: HTMLElement;

  private readonly dialogList: Element<DialogList>;
  private search: Element<SearchInput>;
  private globalSearch: Element<GlobalSearch>;
  private iconButton: Element<IconButton>;

  constructor({ onChatSelect }: Options) {
    this.search = createElement(SearchInput, {
      onFocus: () => {
        this.globalSearch.instance.setVisibility(true);
      },
      onBlur: event => {
        const searchValue = event.target.value.trim();
        if (searchValue === "") {
          this.globalSearch.instance.setVisibility(false);
        }
      },
      onInput: event => {
        const searchValue = event.target.value.trim();
        if (searchValue !== "") {
          this.globalSearch.instance.search(event.target.value);
        }
      }
    });
    this.iconButton = createElement(IconButton, {
      icon: Icons.Menu
    });
    const topMenu = createElement(
      "div",
      { class: styles.topMenu },
      this.iconButton,
      this.search
    );
    this.dialogList = createElement(DialogList, { onChatSelect });
    this.globalSearch = createElement(GlobalSearch, { onChatSelect });

    this.element = createElement(
      "div",
      { class: styles.container },
      topMenu,
      this.dialogList,
      this.globalSearch
    );
  }

  public setActiveDialog(dialog: IDialog) {
    this.dialogList.instance.setActiveDialog(dialog);
  }
}
