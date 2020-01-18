import { createElement, Component, Element } from "../../utils/dom";
import * as styles from "./side-bar.scss";
import ContactItem from "../ui/dialog-item";
import store from "../../utils/store";
import { PresentationalDialog } from "../../models/dialog";
import SearchInput from "../ui/search-input";
import IconButton from "../ui/icon-button";
import { Icons } from "../ui/icon";

interface Options {
  onChatSelect(chatId: number): any;
}

export default class SideBar implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly dialogs: HTMLElement;
  public readonly pinnedDialogs: HTMLElement;
  private readonly dialogsWrapper: HTMLElement;
  private search: Element<SearchInput>;
  private iconButton: Element<IconButton>;
  private paginating = false;
  private dialogsToElement = new Map<number, Element<ContactItem>>();
  private onChatSelect: Options["onChatSelect"];

  constructor({ onChatSelect }: Options) {
    this.onChatSelect = onChatSelect;
    this.dialogs = createElement("div", { class: styles.dialogsList });
    this.pinnedDialogs = createElement("div", {
      class: `${styles.dialogsList} ${styles.pinned}`
    });
    this.search = createElement(SearchInput, {});
    this.iconButton = createElement(IconButton, {
      icon: Icons.Menu
    });
    const topMenu = createElement(
      "div",
      { class: styles.topMenu },
      this.iconButton,
      this.search
    );
    this.dialogsWrapper = createElement(
      "div",
      {
        class: styles.dialogsWrapper
      },
      this.pinnedDialogs,
      this.dialogs
    );
    this.element = createElement(
      "div",
      { class: styles.container },
      topMenu,
      this.dialogsWrapper
    );

    this.register();
  }

  private register() {
    store.sub("fetched_chats", () => {
      this.addDialogs(store.sortedDialogs);

      this.dialogsWrapper.addEventListener("scroll", () => {
        const isAtBottom =
          this.dialogsWrapper.scrollTop + this.dialogsWrapper.clientHeight >=
          this.dialogsWrapper.scrollHeight - 100;

        if (!this.paginating && isAtBottom) {
          this.paginating = true;
          store.fetchMoreDialogs().then(() => {
            this.paginating = false;
          });
        }
      });
    });

    store.sub("fetched_more_chats", offset => {
      this.addDialogs(store.sortedDialogs.slice(offset));
    });
  }

  private addDialogs(ids: number[]) {
    ids.forEach(id => {
      this.addDialog(id);
    });
  }

  private addDialog(id: number) {
    const element = createElement(ContactItem, {
      chatId: id,
      onClick: this.onChatSelect
    });
    const model = PresentationalDialog.findById(id);
    this.dialogsToElement.set(id, element);

    if (model.dialog.pinned) {
      this.pinnedDialogs.append(element);
    } else {
      this.dialogs.append(element);
    }
  }
}
