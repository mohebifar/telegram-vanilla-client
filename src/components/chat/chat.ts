import { extractIdFromPeer } from "../../core/tl/utils";
import { IDialog } from "../../models/dialog";
import { IMessage, Message } from "../../models/message";
import { IPeer, SimplifiedMessageRequest, Peer } from "../../models/peer";
import { Component, createElement, Element } from "../../utils/dom";
import Bubble from "./bubble";
import * as styles from "./chat.scss";
import SendMessageForm from "./send-message";
import TopBar from "./top-bar";
import Avatar from "../ui/avatar";

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
        const bubbleWrapperChildNodes = this.chatContainer.childNodes.item(0)
          .childNodes;
        const firstBubble = bubbleWrapperChildNodes
          .item(bubbleWrapperChildNodes.length - 1)
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

    Message.events.on("synced", async ({ message }: { message: IMessage }) => {
      if (message.$t === "MessageEmpty") {
        return;
      }

      const peerId = extractIdFromPeer(message.toId);
      if (
        peerId.id === this.peer.id &&
        peerId.type === this.peer.type &&
        this.isAtBottom()
      ) {
        requestAnimationFrame(() => {
          this.scrollToEnd();
        });
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
          const wasAtBottom = this.isAtBottom();
          await this.addMessage(message);

          if (wasAtBottom) {
            this.scrollToEnd();
          }
        }
      }
    );
  }

  private async loadChat() {
    const messages = await this.peer.fetchHistory();
    this.addMessages(messages);
  }

  private async addMessages(messages: IMessage[]) {
    const shouldScroll = this.isAtBottom();
    const currentScroll = this.scrollView.scrollHeight;

    for (const message of messages) {
      await this.addMessage(message, true);
    }

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

  private async addMessage(message: IMessage, prepend = false) {
    let type: BubbleType;
    switch (message.$t) {
      case "Message":
        type = message.out ? "out" : "in";
        break;
      default:
        type = "service";
    }

    const children = this.chatContainer.childNodes;
    let lastBubbleWrapper = children.item(
      prepend ? 0 : children.length - 1
    ) as HTMLElement;
    let lastBubbleHolder: HTMLElement;

    let peer: IPeer;
    const isGroupChat =
      this.peer.$t === "Chat" ||
      (this.peer.$t === "Channel" && !this.peer.broadcast);

    if (isGroupChat && message.$t === "Message") {
      peer = await Peer.get({
        id: message.fromId,
        type: "User"
      });
    } else {
      peer = this.peer;
    }

    const insertFn = prepend ? "prepend" : "append";

    let lastBubbleType = null;
    let lastBubblePeer: IPeer;
    if (lastBubbleWrapper) {
      const { classList } = lastBubbleWrapper;
      if (classList.contains(styles.in)) {
        lastBubbleType = "in";
      } else if (classList.contains(styles.out)) {
        lastBubbleType = "out";
      } else {
        lastBubbleType = "service";
      }

      if (isGroupChat && lastBubbleType === "in") {
        lastBubblePeer = (lastBubbleWrapper.childNodes
          .item(lastBubbleWrapper.childNodes.length - 1)
          .childNodes.item(0) as Element<Bubble>).instance.peer;
      }

      console.log({ a: lastBubbleWrapper.childNodes, peer });
    }

    if (
      !lastBubbleWrapper ||
      lastBubbleType !== type ||
      (isGroupChat && lastBubblePeer && lastBubblePeer.id !== peer.id)
    ) {
      lastBubbleWrapper = createElement("div", { class: styles[type] });
      this.chatContainer[insertFn](lastBubbleWrapper);

      lastBubbleHolder = createElement("div");
      if (isGroupChat && message.$t === "Message" && !message.out) {
        const avatar = createElement(Avatar, {
          peer,
          size: "sm",
          class: styles.avatar
        });

        lastBubbleWrapper.append(avatar, lastBubbleHolder);
      } else {
        lastBubbleWrapper.append(lastBubbleHolder);
      }
    } else {
      lastBubbleHolder = lastBubbleWrapper.childNodes.item(
        lastBubbleWrapper.childNodes.length - 1
      ) as HTMLElement;
    }

    const messageElement = createElement(Bubble, {
      message,
      peer
    });
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

  public async setActiveDialog(dialog: IDialog) {
    if (dialog === this.dialog) {
      return;
    }

    this.dialog = dialog;
    // model.events.on("message", this.handleNewMessage);
    this.peer = await dialog.getPeer();

    this.chatContainer.innerHTML = "";
    this.topBarContainer.innerHTML = "";

    if (dialog !== undefined) {
      const whatToDoWithInvisibilityOfSendForm =
        this.peer.$t === "Channel" && this.peer.broadcast && !this.peer.creator
          ? "add"
          : "remove";

      this.sendMessageForm.classList[whatToDoWithInvisibilityOfSendForm](
        "hidden"
      );
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
