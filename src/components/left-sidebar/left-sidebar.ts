import { IDialog } from "../../models/dialog";
import { IMessage } from "../../models/message";
import { Component, createElement, Element } from "../../utils/dom";
import { IconSprite, Icons } from "../ui/icon";
import IconButton from "../ui/icon-button";
import SearchInput from "../ui/search-input";
import DialogList from "./dialog-list";
import GlobalSearch from "./global-search";
import * as styles from "./left-sidebar.scss";
import Router from "../ui/router";
import { makeContextMenu } from "../ui/context-menu";

interface Options {
  onChatSelect(dialog: IDialog, message: IMessage): any;
}

export default class LeftSideBar implements Component<Options> {
  public readonly element: HTMLElement;

  private readonly dialogList: Element<DialogList>;
  private search: Element<SearchInput>;
  private globalSearch: Element<GlobalSearch>;
  private iconButton: Element<IconButton>;
  private router: Router;

  constructor({ onChatSelect }: Options) {
    this.search = createElement(SearchInput, {
      onFocus: () => {
        if (this.router.currentRouteName !== "global-search") {
          this.router.push("global-search");
          this.updateIcon();
        }
      },
      onBlur: event => {
        const searchValue = event.target.value.trim();
        if (searchValue === "") {
          this.router.back();
          this.updateIcon(false);
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
      icon: IconSprite.MenuClose,
      onClick: () => {
        const { currentRouteName } = this.router;
        if (currentRouteName !== "dialog-list") {
          this.router.back();
          this.updateIcon(false);
        } else {
          makeContextMenu({ x: 16, y: 70 }, [
            {
              icon: Icons.Animals,
              title: "New Group"
            },
            {
              icon: Icons.Animals,
              title: "Contacts"
            },
            {
              icon: Icons.Animals,
              title: "Archived"
            },
            {
              icon: Icons.Animals,
              title: "Saved"
            },
            {
              icon: Icons.Animals,
              title: "Settings"
            },
            {
              icon: Icons.Animals,
              title: "Help"
            }
          ]);
        }
      }
    });
    const topMenu = createElement(
      "div",
      { class: styles.topMenu },
      this.iconButton,
      this.search
    );
    this.dialogList = createElement(DialogList, { onChatSelect });
    this.globalSearch = createElement(GlobalSearch, { onChatSelect });

    const routerElement = createElement(Router, {
      routes: [
        {
          name: "dialog-list",
          render: () => this.dialogList
        },
        {
          name: "global-search",
          render: () => this.globalSearch
        }
      ]
    });
    this.router = routerElement.instance;
    this.router.push("dialog-list");

    this.element = createElement(
      "div",
      { class: styles.container },
      topMenu,
      routerElement
    );
  }

  private updateIcon(back = true) {
    this.iconButton.instance.setSprite(back ? "end" : "start");
  }

  public setActiveDialog(dialog: IDialog) {
    this.dialogList.instance.setActiveDialog(dialog);
  }
}
