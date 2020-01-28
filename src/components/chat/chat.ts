import { extractIdFromPeer } from "../../core/tl/utils";
import { IDialog } from "../../models/dialog";
import { IMessage, Message } from "../../models/message";
import { IPeer, SimplifiedMessageRequest } from "../../models/peer";
import { Component, createElement, Element } from "../../utils/dom";
import Bubble from "./bubble";
import * as styles from "./chat.scss";
import SendMessageForm from "./send-message";
import TopBar from "./top-bar";

interface Options {}

type BubbleType = "in" | "out" | "service";

export default class Chat implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly dialogs: HTMLElement;
  private scrollView: HTMLElement;
  private chatContainer: HTMLElement;
  private topBarContainer: HTMLElement;
  private sendMessageForm: Element<SendMessageForm>;
  private dialog?: IDialog;
  private peer?: IPeer;
  private paginating = false;

  constructor({}: Options) {
    this.chatContainer = createElement("div", { class: styles.chatContainer });
    this.scrollView = createElement(
      "div",
      { class: styles.wrapper },
      this.chatContainer
    );
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
      if (
        !this.paginating &&
        this.scrollView.scrollTop < 100 &&
        this.chatContainer.childNodes.length > 0
      ) {
        this.paginating = true;
        const firstBubble = this.chatContainer.childNodes
          .item(0)
          .childNodes.item(0) as Element<Bubble>;
        const message = firstBubble.instance && firstBubble.instance.message;
        if (message) {
          this.peer
            .fetchHistory(message.id, message.date.unix())
            .then(messages => this.addMessages(messages))
            .then(() => {
              this.paginating = false;
            });
        }
      }
    });

    Message.events.on(
      "saved",
      async ({ object: message }: { object: IMessage }) => {
        if (
          message.$t === "MessageEmpty" ||
          this.chatContainer.childNodes.length === 0
        ) {
          return;
        }

        const peerId = extractIdFromPeer(message.toId);
        if (peerId.id !== this.peer.id || peerId.type !== this.peer.type) {
          return;
        }

        const lastBubbleHolder = this.chatContainer.childNodes.item(
          this.chatContainer.childNodes.length - 1
        ).childNodes;

        const lastBubble = lastBubbleHolder.item(
          lastBubbleHolder.length - 1
        ) as Element<Bubble>;
        const lastRenderedMessage = lastBubble.instance.message;

        if (message.date.isAfter(lastRenderedMessage.date)) {
          this.addMessage(message);
        }
      }
    );
  }

  private async loadChat() {
    const messages = await this.peer.fetchHistory();
    this.addMessages(messages);
  }

  private addMessages(messages: IMessage[]) {
    const shouldScroll = this.isAtBottom();
    const currentScroll = this.scrollView.scrollHeight;

    messages.forEach(message => {
      this.addMessage(message, true);
    });

    if (shouldScroll) {
      this.scrollToEnd();
    } else {
      const endScroll = this.scrollView.scrollHeight;
      this.scrollView.scrollTop = endScroll - currentScroll;
    }
  }

  private isAtBottom() {
    const obj = this.scrollView;
    return obj.scrollTop === obj.scrollHeight - obj.offsetHeight;
  }

  private scrollToEnd() {
    this.scrollView.scrollTop = this.scrollView.scrollHeight;
  }

  private handleSendMessage = (message: SimplifiedMessageRequest) => {
    const [model] = this.peer.sendMessage(message);

    this.handleNewMessage(model);
  };

  private addMessage(message: IMessage, prepend = false) {
    let type: BubbleType;
    switch (message.$t) {
      case "Message":
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

  private handleNewMessage = (message: IMessage) => {
    if (message) {
      const shouldScroll = this.isAtBottom();
      this.addMessage(message, false);

      if (shouldScroll) {
        this.scrollToEnd();
      }
    }
  };

  public async setChat(dialog: IDialog) {
    if (dialog === this.dialog) {
      return;
    }

    this.dialog = dialog;
    // model.events.on("message", this.handleNewMessage);
    this.peer = await dialog.getPeer();

    this.chatContainer.innerHTML = "";
    this.topBarContainer.innerHTML = "";

    if (dialog !== undefined) {
      this.sendMessageForm.classList.remove("hidden");
      this.topBarContainer.append(
        createElement(TopBar, { dialog, peer: this.peer })
      );
      this.loadChat();
    }
  }
}

function messageToParagraphs(message: string) {
  const newLine = /[\n\r]/g;
  const chunks = message.split(newLine);
  if (chunks.length > 1) {
    return chunks.map(line => `<p dir="auto">${line}</p>`).join("");
  }

  return message;
}

export function messageToHTML(message: string) {
  return messageToParagraphs(message).replace(
    /@(\w[0-9a-zA-Z_\.]+)/g,
    "<a href='#'>@$1</a>"
  );
}
