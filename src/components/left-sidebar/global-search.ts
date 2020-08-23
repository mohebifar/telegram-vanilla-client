import { Dialog, IDialog } from "../../models/dialog";
import { IMessage, Message } from "../../models/message";
import { IPeer, Peer } from "../../models/peer";
import { TopPeer } from "../../models/top-peer";
import { Component, createElement, removeChildren, on } from "../../utils/dom";
import { debounce } from "../../utils/utils";
import Avatar from "../ui/avatar";
import ContactItem from "../ui/contact-item";
import DialogItem from "../ui/dialog-item";
import Router, { DefaultTransition } from "../ui/router";
import * as styles from "./global-search.scss";

interface Options {
  onChatSelect(dialog: IDialog, message?: IMessage): any;
  router: Router;
}

export default class GlobalSearch extends DefaultTransition
  implements Component<Options> {
  public readonly element: HTMLElement;
  private readonly searchResultView: HTMLElement;
  private readonly defaultView: HTMLElement;
  private onChatSelect: Options["onChatSelect"];
  private router: Options["router"];

  constructor({ onChatSelect, router }: Options) {
    super();
    this.onChatSelect = onChatSelect;
    this.router = router;
    this.searchResultView = createElement("div", { class: "hidden" });
    this.defaultView = createElement("div");

    const element = createElement(
      "div",
      { class: styles.container },
      this.searchResultView,
      this.defaultView
    );

    this.element = element;

    this.register();
  }

  private register() {
    TopPeer.fetchAll().then(async peers => {
      const topPeers = createElement("div", { class: styles.topPeers });
      for (const topPeer of peers.slice(0, 10)) {
        const peer = await Peer.get({
          id: topPeer.peerId,
          type: topPeer.peerType
        });
        const element = createElement(
          "button",
          { class: styles.topPeer },
          createElement(Avatar, { peer, size: "md" }),
          createElement("div", (peer as any).firstName || peer.displayName)
        );
        on(element, "click", () => {
          peer.getDialog().then(dialog => {
            this.onChatSelect(dialog);
            this.router.back();
          });
        });
        topPeers.append(element);
      }

      const topPeersSection = createElement(
        "div",
        { class: styles.section },
        createElement("div", { class: styles.topPeersScroll }, topPeers),
        createElement("h3", "People")
      );

      const recentContactsSection = createElement(
        "div",
        { class: styles.section },
        createElement("div"),
        createElement("h3", "Recent")
      );

      this.defaultView.append(topPeersSection, recentContactsSection);
    });
  }

  public search = debounce(async (q: string) => {
    removeChildren(this.searchResultView);
    const isEmpty = q === "";
    this.defaultView.classList[isEmpty ? "remove" : "add"]("hidden");
    this.searchResultView.classList[isEmpty ? "add" : "remove"]("hidden");

    if (isEmpty) {
      return;
    }

    const contactsContainer = createElement("div");
    const globalContactsContainer = createElement("div");
    const globalSearchContainer = createElement("div");

    this.searchResultView.append(
      createElement(
        "div",
        { class: styles.section },
        contactsContainer,
        createElement("h3", "Contacts and Chats")
      ),
      createElement(
        "div",
        { class: styles.section },
        globalContactsContainer,
        createElement("h3", "Global Search")
      ),
      createElement(
        "div",
        { class: styles.section },
        globalSearchContainer,
        createElement("h3", "Global Search")
      )
    );

    const [messages, [myContacts, globalContacts]] = await Promise.all([
      Message.globalSearch(q),
      Peer.search(q)
    ]);
    for (const message of messages) {
      const peer = await message.getPeer();
      const element = await this.makeDialog(message, peer, q);
      globalSearchContainer.append(element);
    }

    Dialog.bulkGet(
      [...myContacts, ...globalContacts].map(t => ({
        peerType: t.type,
        peerId: t.id
      }))
    );

    for (const contact of myContacts.slice(0, 4)) {
      const element = await this.makeContact(contact);
      contactsContainer.append(element);
    }

    for (const contact of globalContacts.slice(0, 4)) {
      const element = await this.makeContact(contact);
      globalContactsContainer.append(element);
    }
  }, 500);

  private handleChatSelect = async (peer: IPeer, message?: IMessage) => {
    const dialog = await peer.getDialog();

    this.onChatSelect(dialog, message);
  };

  private async makeDialog(message: IMessage, peer: IPeer, highlightText: string) {
    const element = createElement(DialogItem, {
      message,
      peer,
      onClick: this.handleChatSelect,
      scope: 'search',
      highlightText
    });
    await element.instance.register();

    return element;
  }

  private async makeContact(peer: IPeer) {
    const element = createElement(ContactItem, {
      peer,
      onClick: this.handleChatSelect
    });

    return element;
  }
}
