import { IDialog, Dialog } from "../../models/dialog";
import { IMessage } from "../../models/message";
import { Component, createElement, removeChildren, Element } from "../../utils/dom";
import { FadeTransition } from "../ui/router";
import Tabs from "../ui/tabs";
import DialogList from "./dialog-list";
import * as styles from "./folders.scss";
import Spinner from "../ui/spinner";

interface Options {
  onChatSelect(dialog: IDialog, message: IMessage): any;
}

export default class Folders extends FadeTransition
  implements Component<Options> {
  public readonly element: HTMLElement;

  private mainDialogList: Element<DialogList>;

  constructor({ onChatSelect }: Options) {
    super();
    // this.onChatSelect = onChatSelect;
    this.element = createElement(
      "div",
      { class: styles.container },
      createElement(Spinner, { size: "40px", color: "blue" })
    );

    Dialog.fetchFolders().then(([folders, dialogsLists]) => {
      this.mainDialogList = createElement(DialogList, { onChatSelect });
      removeChildren(this.element);

      if (folders.length === 0) {
        this.element.append(this.mainDialogList);
        return;
      }

      const tabs = [
        {
          title: "All",
          content: this.mainDialogList,
        },
        ...folders.map((folder, i) => {
          const dialogs = dialogsLists[i];

          return {
            title: folder.title,
            content: createElement(DialogList, {
              onChatSelect,
              dialogs,
              folderId: folder.id,
            }),
          };
        }),
      ];

      const tabsContainer = createElement(Tabs, {
        tabs,
      });

      this.element.append(tabsContainer);
    });
  }

  public setActiveDialog(newDialog: IDialog) {
    this.mainDialogList && this.mainDialogList.instance.setActiveDialog(newDialog);
  }
}
