import { IDialog } from "../../models/dialog";
import { IMessage } from "../../models/message";
import { Component, createElement, Element } from "../../utils/dom";
import { makeContextMenu } from "../ui/context-menu";
import { Icons, IconSprite } from "../ui/icon";
import IconButton from "../ui/icon-button";
import Router from "../ui/router";
import SearchInput from "../ui/search-input";
import GlobalSearch from "./global-search";
import * as styles from "./left-sidebar.scss";
import Folders from "./folders";

interface Options {
  onChatSelect(dialog: IDialog, message?: IMessage): any;
}

export default class LeftSideBar implements Component<Options> {
  public readonly element: HTMLElement;

  private readonly dialogList: Element<Folders>;
  private search: Element<SearchInput>;
  private globalSearch: Element<GlobalSearch>;
  private iconButton: Element<IconButton>;
  private router: Router;

  constructor({ onChatSelect }: Options) {
    this.search = createElement(SearchInput, {
      onFocus: () => {
        if (this.router.currentRouteName !== "global-search") {
          this.router.push("global-search");
        }
      },
      onInput: event => {
        const searchValue = event.target.value.trim();
        this.globalSearch.instance.search(searchValue);
      }
    });
    this.iconButton = createElement(IconButton, {
      icon: IconSprite.MenuClose,
      onClick: () => {
        const { currentRouteName } = this.router;
        if (currentRouteName !== "dialog-list") {
          this.router.back();
        } else {
          makeContextMenu({ x: 16, y: 60 }, [
            {
              icon: Icons.NewGroup,
              title: "New Group"
            },
            {
              icon: Icons.NewPrivate,
              title: "Contacts"
            },
            {
              icon: Icons.Archive,
              title: "Archived"
            },
            {
              icon: Icons.SavedMessages,
              title: "Saved"
            },
            {
              icon: Icons.Settings,
              title: "Settings"
            },
            {
              icon: Icons.Help,
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
      ],
      onRouteChange: (routeName: string) => {
        this.iconButton.instance.setSprite(
          routeName === "dialog-list" ? "start" : "end"
        );
      }
    });
    this.router = routerElement.instance;

    this.dialogList = createElement(Folders, { onChatSelect });
    this.globalSearch = createElement(GlobalSearch, {
      onChatSelect,
      router: this.router
    });

    this.router.push("dialog-list");

    this.element = createElement(
      "div",
      { class: styles.container },
      topMenu,
      routerElement
    );
  }

  public setActiveDialog(dialog: IDialog) {
    this.dialogList.instance.setActiveDialog(dialog);
  }
}
