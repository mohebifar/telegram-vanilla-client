import { DialogMessageTypes, PresentationalDialog } from "../../models/dialog";
import { createElement, Component, Element } from "../../utils/dom";
import store, { SimplifiedMessageRequest } from "../../utils/store";
import Bubble from "./bubble";
import TopBar from "./top-bar";
import * as styles from "./chat.scss";
import SendMessageForm from "./send-message";
import { getInputPeer } from "../../core/tl/utils";

interface Options {}

type BubbleType = "in" | "out" | "service";

export default class Chat implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly dialogs: HTMLElement;
  public readonly pinnedDialogs: HTMLElement;
  private scrollView: HTMLElement;
  private chatContainer: HTMLElement;
  private topBarContainer: HTMLElement;
  private sendMessageForm: Element<SendMessageForm>;
  private chatId?: number;
  private paginating = false;

  constructor({}: Options) {
    this.chatContainer = createElement("div", { class: styles.chatContainer });
    this.scrollView = createElement("div", { class: styles.wrapper }, this.chatContainer);
    this.topBarContainer = createElement("div");
    this.sendMessageForm = createElement(SendMessageForm, {
      callback: this.handleSendMessage
    });

    this.element = createElement(
      "div",
      { class: styles.container },
      this.topBarContainer,
      this.scrollView,
      this.sendMessageForm
    );

    this.register();
  }

  private register() {
    this.scrollView.addEventListener("scroll", () => {
      if (!this.paginating && this.scrollView.scrollTop < 10) {
        const dialog = PresentationalDialog.findById(this.chatId);
        this.paginating = true;
        store.fetchMoreHistory(this.chatId, dialog.peer).then(() => {
          this.paginating = false;
        });
      }
    });

    store.sub("fetched_history", ({ chatId, messageIds }) => {
      if (this.chatId === chatId) {
        const shouldScroll = this.isAtBottom();
        const currentScroll = this.scrollView.scrollHeight;
        messageIds.reverse().forEach(id => {
          const message = store.getMessage(id);
          if (message) {
            this.addMessage(message, true);
          }
        });

        if (shouldScroll) {
          this.scrollToEnd();
        } else {
          const endScroll = this.scrollView.scrollHeight;
          this.scrollView.scrollTop = endScroll - currentScroll;
        }
      }
    });
  }

  private isAtBottom() {
    const obj = this.scrollView;
    return obj.scrollTop === obj.scrollHeight - obj.offsetHeight;
  }

  private scrollToEnd() {
    this.scrollView.scrollTop = this.scrollView.scrollHeight;
  }

  private handleSendMessage = (message: SimplifiedMessageRequest) => {
    const dialog = PresentationalDialog.findById(this.chatId);
    const id = store.sendMessage(this.chatId, {
      ...message,
      peer: getInputPeer(dialog.peer)
    });

    this.handleNewMessage({
      $t: "Message",
      ...message,
      id,
      out: true,
      date: Date.now() / 1000
    } as any);
  };

  private addMessage(message: DialogMessageTypes, prepend = false) {
    let type: BubbleType;
    switch (message.$t) {
      case "Message":
      case "UpdateShortMessage":
        type = message.out ? "out" : "in";
        break;
      default:
        type = "service";
    }

    let lastBubbleHolder = this.chatContainer.querySelector(
      prepend ? ":first-child" : ":last-child"
    );

    const insertFn = prepend ? "prepend" : "append";

    let lastBubbleType = null;
    if (lastBubbleHolder) {
      const { classList } = lastBubbleHolder;
      if (classList.contains(styles.in)) {
        lastBubbleType = "in";
      } else if (classList.contains(styles.out)) {
        lastBubbleType = "out";
      } else {
        lastBubbleType = "service";
      }
    }

    if (!lastBubbleHolder || lastBubbleType !== type) {
      lastBubbleHolder = createElement("div", { class: styles[type] });
      this.chatContainer[insertFn](lastBubbleHolder);
    }

    const messageElement = createElement(Bubble, { message });
    lastBubbleHolder[insertFn](messageElement);
  }

  private handleNewMessage = (message: DialogMessageTypes) => {
    if (message) {
      const shouldScroll = this.isAtBottom();
      this.addMessage(message, false);

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
      this.sendMessageForm.classList.remove("hidden");
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
