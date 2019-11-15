// import VirtualizedList from "virtualized-list";
import { createElement, Component } from "../../utils/dom";
import * as styles from "./side-bar.scss";
import ContactItem from "../ui/contact-item";
import store from "../../utils/store";
import { PresentationalDialog } from "../../models/dialog";

interface Options {}

export default class SideBar implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly dialogs: HTMLElement;
  public readonly pinnedDialogs: HTMLElement;
  private paginating = false;
  private dialogsToElement = new Map<number, Element>();
  // private list: any;

  constructor({}: Options) {
    this.dialogs = createElement("div", { class: styles.dialogsList });
    this.pinnedDialogs = createElement("div", {
      class: `${styles.dialogsList} ${styles.pinned}`
    });
    this.element = createElement(
      "div",
      { class: styles.container },
      this.pinnedDialogs,
      this.dialogs
    );

    // this.list = new VirtualizedList(this.element, {
    //   height: 500, // The height of the container
    //   rowCount: rows.length,
    //   renderRow: index => {
    //     const element = document.createElement("div");
    //     element.innerHTML = rows[index];

    //     return element;
    //   },
    //   rowHeight: 150
    // });
    this.register();
  }

  private register() {
    store.sub("chats_initiated", () => {
      this.addDialogs(store.sortedDialogs);

      this.element.addEventListener("scroll", () => {
        if (
          !this.paginating &&
          this.element.scrollTop + this.element.clientHeight >=
            this.element.scrollHeight
        ) {
          this.paginating = true;
          store.fetchMoreDialogs().then(() => {
            this.paginating = false;
          });
        }
      });
    });

    store.sub("chats_fetched_more", offset => {
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
      chatId: id
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
