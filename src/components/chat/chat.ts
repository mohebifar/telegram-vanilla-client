import { extractIdFromPeer } from "../../core/tl/utils";
import { IDialog } from "../../models/dialog";
import { IMessage, Message } from "../../models/message";
import { IPeer, Peer, SimplifiedMessageRequest } from "../../models/peer";
import {
  Component,
  createElement,
  Element,
  getNthChild,
  removeChildren
} from "../../utils/dom";
import Avatar from "../ui/avatar";
import Bubble from "./bubble";
import * as styles from "./chat.scss";
import SendMessageForm from "./send-message";
import TopBar from "./top-bar";

interface Options {}

type BubbleType = "in" | "out" | "service";

const LIMIT = 25;
const BACK_LIMIT = 4;

export default class Chat implements Component<Options> {
  public readonly element: HTMLElement;
  public readonly dialogs: HTMLElement;
  private scrollView: HTMLElement;
  private chatContainer: HTMLElement;
  private topBarContainer: HTMLElement;
  private sendMessageForm: Element<SendMessageForm>;
  private dialog?: IDialog;
  private peer?: IPeer;
  private lockLoad = false;
  private noMoreTop = false;
  private noMoreBottom = false;
  private idToElementMap = new Map<number, Element<Bubble>>();

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

  public async setActiveDialog(dialog: IDialog, offsetMessage?: number) {
    if (
      (dialog === this.dialog && !offsetMessage) ||
      typeof dialog === "undefined"
    ) {
      return;
    }

    let unreadCount: number;
    if (!offsetMessage) {
      unreadCount = dialog.unreadCount;
    }

    if (dialog === this.dialog && this.idToElementMap.has(offsetMessage)) {
      this.idToElementMap.get(offsetMessage).scrollIntoView({
        behavior: "smooth"
      });
    } else {
      this.lockLoad = true;
      this.peer = await dialog.getPeer();
      if (dialog !== this.dialog) {
        removeChildren(this.topBarContainer);
        this.topBarContainer.append(
          createElement(TopBar, { dialog, peer: this.peer })
        );
      }

      this.idToElementMap.clear();
      removeChildren(this.chatContainer);

      this.dialog = dialog;

      const whatToDoWithInvisibilityOfSendForm =
        this.peer.$t === "Channel" && this.peer.broadcast && !this.peer.creator
          ? "add"
          : "remove";

      this.sendMessageForm.classList[whatToDoWithInvisibilityOfSendForm](
        "hidden"
      );

      this.noMoreTop = this.noMoreBottom = false;
      this.loadChat(offsetMessage ? { offsetMessage } : { unreadCount });
    }
  }

  handleReplyClick = (messageId: number) => {
    this.setActiveDialog(this.dialog, messageId);
  };

  private getFirstOrLastBubble(childPosToLookAt: "first" | "last") {
    const bubbleWrapper = getNthChild(this.chatContainer, childPosToLookAt);
    return getNthChild(
      getNthChild(bubbleWrapper, "last"),
      childPosToLookAt
    ) as Element<Bubble>;
  }

  private register() {
    this.scrollView.addEventListener("scroll", () => {
      if (this.lockLoad || this.chatContainer.childNodes.length === 0) {
        return;
      }
      const isAtTop = this.isAtTop();
      const isAtBottom = this.isAtBottom();
      const lastBubble = this.getFirstOrLastBubble(isAtTop ? "first" : "last");

      if ((isAtTop && !this.noMoreTop) || (isAtBottom && !this.noMoreBottom)) {
        this.lockLoad = true;

        const message = lastBubble.instance && lastBubble.instance.message;
        if (message) {
          this.peer
            .fetchHistory(
              isAtTop
                ? {
                    offsetId: message.id,
                    limit: LIMIT,
                    maxId: message.id
                  }
                : {
                    offsetId: message.id,
                    limit: LIMIT,
                    addOffset: -LIMIT,
                    minId: message.id
                  }
            )
            .then(messages => {
              if (messages.length < LIMIT) {
                this[isAtTop ? "noMoreTop" : "noMoreBottom"] = true;

                if (messages.length === 0) {
                  this.lockLoad = false;
                  return null;
                }
              }

              return this.addMessages(messages, { prepend: isAtTop });
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
          this.chatContainer.childNodes.length === 0 ||
          this.lockLoad ||
          this.idToElementMap.has(message.id)
        ) {
          return;
        }

        const peerId = extractIdFromPeer(message.toId);
        if (peerId.id !== this.peer.id || peerId.type !== this.peer.type) {
          return;
        }

        const lastBubbleWrapper = this.chatContainer.childNodes.item(
          this.chatContainer.childNodes.length - 1
        ).childNodes;

        const lastBubbleHolder = lastBubbleWrapper.item(
          lastBubbleWrapper.length - 1
        ).childNodes;

        const lastBubble = lastBubbleHolder.item(
          lastBubbleHolder.length - 1
        ) as Element<Bubble>;

        const lastRenderedMessage = lastBubble.instance.message;
        const wasAtBottom = this.isAtBottom();

        if (message.date.isAfter(lastRenderedMessage.date)) {
          await this.addMessage(message);
        }

        if (wasAtBottom) {
          this.scrollToEnd();
        }
      }
    );
  }

  private async loadChat({
    offsetMessage,
    unreadCount = 0
  }: { offsetMessage?: number; unreadCount?: number } = {}) {
    this.lockLoad = true;
    const jumpCount = unreadCount ? unreadCount - LIMIT + BACK_LIMIT : 0;
    const messages = await this.peer.fetchHistory(
      unreadCount
        ? {
            addOffset: Math.max(0, jumpCount),
            limit: LIMIT
          }
        : {
            offsetId: offsetMessage,
            limit: offsetMessage ? LIMIT * 2 : LIMIT,
            addOffset: offsetMessage ? -LIMIT : 0
          }
    );
    await this.addMessages(messages, {
      messageToScrollTo: offsetMessage,
      jumpToBackLimit: unreadCount
        ? jumpCount < 0
          ? BACK_LIMIT - jumpCount
          : BACK_LIMIT
        : 0,
      unreadCount
    });
  }

  private async addMessages(
    messages: IMessage[],
    {
      messageToScrollTo,
      jumpToBackLimit,
      unreadCount,
      prepend = true
    }: {
      messageToScrollTo?: number;
      jumpToBackLimit?: number;
      unreadCount?: number;
      prepend?: boolean;
    } = {}
  ) {
    const currentScroll = this.scrollView.scrollHeight;

    const sortedMessages = prepend ? messages : messages.reverse();
    for (const message of sortedMessages) {
      await this.addMessage(message, prepend);
    }

    requestAnimationFrame(() => {
      if (jumpToBackLimit) {
        const id =
          sortedMessages[
            Math.max(sortedMessages.length - jumpToBackLimit - 1, 0)
          ].id;
        this.idToElementMap.get(id).scrollIntoView();

        if (unreadCount < LIMIT - BACK_LIMIT) {
          this.noMoreBottom = true;
        }
      } else if (messageToScrollTo) {
        this.idToElementMap.get(messageToScrollTo).scrollIntoView();
      } else if (prepend) {
        const endScroll = this.scrollView.scrollHeight;
        this.scrollView.scrollTop = endScroll - currentScroll;
      }

      let numberOfSeen = 0;
      let recentMessage: IMessage;
      (prepend ? messages.reverse() : messages).forEach(message => {
        if (!(message as any).out && message.id > this.dialog.readInboxMaxId) {
          numberOfSeen++;
          recentMessage = message;
        }
      });

      if (recentMessage) {
        recentMessage.markAsRead(numberOfSeen);
      }

      requestAnimationFrame(() => {
        this.lockLoad = false;
      });
    });
  }

  private isAtBottom(threshold = 50) {
    const obj = this.scrollView;
    return (
      Math.abs(obj.scrollTop - (obj.scrollHeight - obj.offsetHeight)) <
      threshold
    );
  }

  private isAtTop(threshold = 100) {
    return this.scrollView.scrollTop < threshold;
  }

  private scrollToEnd() {
    this.scrollView.scrollTop = this.scrollView.scrollHeight;
  }

  private handleSendMessage = (message: SimplifiedMessageRequest) => {
    const [model] = this.peer.sendMessage(message);

    this.handleNewMessage(model);
  };

  private async addMessage(message: IMessage, prepend = false) {
    this.idToElementMap.set(message.id, null);
    let type: BubbleType;
    switch (message.$t) {
      case "Message":
        type = message.out ? "out" : "in";
        break;
      default:
        type = "service";
    }

    let lastBubbleWrapper = getNthChild(
      this.chatContainer,
      prepend ? "first" : "last"
    );
    let lastBubbleHolder: HTMLElement;

    let peer: IPeer;
    const isGroupChat =
      this.peer.$t === "Chat" ||
      (this.peer.$t === "Channel" && !this.peer.broadcast);

    if (isGroupChat && message.$t === "Message" && !message.out) {
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
      }

      // We don't want to consolidate serivce messages
      if (isGroupChat && lastBubbleType === "in") {
        lastBubblePeer = (getNthChild(
          getNthChild(lastBubbleWrapper, "last"),
          "first"
        ) as Element<Bubble>).instance.peer;
      }
    }

    if (
      !lastBubbleWrapper ||
      lastBubbleType !== type ||
      (isGroupChat && lastBubblePeer && lastBubblePeer.id !== peer.id)
    ) {
      // If sender of the message has changed create a new bubble holder
      lastBubbleHolder = createElement("div");
      lastBubbleWrapper = createElement("div", { class: styles[type] });
      this.chatContainer[insertFn](lastBubbleWrapper);

      // Show avatar as well if it is a group chat and the message is incoming
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
      // If sender of the message is same as the previous one, keep it in the same bubble holder
      lastBubbleHolder = getNthChild(lastBubbleWrapper, "last");
    }

    const messageElement = createElement(Bubble, {
      onReplyClick: this.handleReplyClick,
      message,
      peer
    });
    this.idToElementMap.set(message.id, messageElement);
    lastBubbleHolder[insertFn](messageElement);
  }

  private handleNewMessage = (message: IMessage) => {
    if (message && this.noMoreBottom) {
      const shouldScroll = this.isAtBottom();
      this.addMessage(message, false);

      if (shouldScroll) {
        this.scrollToEnd();
      }
    }
  };
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
