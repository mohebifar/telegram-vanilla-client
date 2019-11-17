// import VirtualizedList from "virtualized-list";
import { createElement, Component } from "../../utils/dom";
import * as styles from "./chat.scss";
import store from "../../utils/store";
import Bubble from "./bubble";
import TopBar from "./top-bar";
import { DialogMessageTypes, PresentationalDialog } from "../../models/dialog";

interface Options {}

type BubbleType = "in" | "out" | "service";

export default class Chat implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly dialogs: HTMLElement;
  public readonly pinnedDialogs: HTMLElement;
  private chatContainer: HTMLElement;
  private topBarContainer: HTMLElement;
  private lastBubbleType?: BubbleType;
  private lastBubbleHolder?: HTMLElement;
  private chatId?: number;

  constructor({}: Options) {
    this.chatContainer = createElement("div", { class: styles.wrapper });
    this.topBarContainer = createElement("div");

    this.element = createElement(
      "div",
      { class: styles.container },
      this.topBarContainer,
      this.chatContainer
    );

    this.register();
  }

  private register() {
    store.sub("fetched_history", ({ chatId }) => {
      if (this.chatId === chatId) {
        const shouldScroll = this.isAtBottom();
        store.getHistory(chatId).forEach(id => {
          const message = store.getMessage(id);
          if (message) {
            this.addMessage(message);
          }
        });

        if (shouldScroll) {
          this.scrollToEnd();
        }
      }
    });
  }

  private isAtBottom() {
    const obj = this.chatContainer;
    return obj.scrollTop === obj.scrollHeight - obj.offsetHeight;
  }

  private scrollToEnd() {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }

  private addMessage(message: DialogMessageTypes) {
    let type: BubbleType;
    switch (message.$t) {
      case "Message":
        type = message.out ? "out" : "in";
        break;
      case "UpdateShortMessage":
        type = "in";
        break;
      default:
        type = "service";
    }

    if (!this.lastBubbleHolder || this.lastBubbleType !== type) {
      this.lastBubbleType = type;
      this.lastBubbleHolder = createElement("div", { class: styles[type] });
      this.chatContainer.append(this.lastBubbleHolder);
    }

    const messageElement = createElement(Bubble, { message });
    this.lastBubbleHolder.append(messageElement);
  }

  private handleNewMessage = (message: DialogMessageTypes) => {
    if (message) {
      const shouldScroll = this.isAtBottom();
      this.addMessage(message);

      if (shouldScroll) {
        this.scrollToEnd();
      }
    }
  };

  public setChat(chatId: number) {
    if (this.chatId) {
      const oldModel = PresentationalDialog.findById(this.chatId);
      oldModel.events.off("message", this.handleNewMessage);
    }
    this.chatId = chatId;
    const model = PresentationalDialog.findById(chatId);
    model.events.on("message", this.handleNewMessage);
    this.chatContainer.innerHTML = "";
    this.topBarContainer.innerHTML = "";

    if (chatId !== undefined) {
      this.topBarContainer.append(createElement(TopBar, { chatId }));
    }
  }
}

export function messageToHTML(message: string) {
  return message
    .split(/[\n\r]/g)
    .map(line => `<p dir="auto">${line}</p>`)
    .join("")
    .replace(/@(\w[0-9a-zA-Z_\.]+)/g, "<a href='#'>@$1</a>");
}
