import { Message as TLMessage } from "../../core/tl/TLObjects";
import { extractIdFromPeer } from "../../core/tl/utils";
import { Dialog, IDialog } from "../../models/dialog";
import { IMessage, Message } from "../../models/message";
import { IPeer, Peer, SimplifiedMessageRequest } from "../../models/peer";
import {
  Component,
  createElement,
  Element,
  getNthChild,
  removeChildren
} from "../../utils/dom";
import { debounce, throttle } from "../../utils/utils";
import Avatar from "../ui/avatar";
import Bubble from "./bubble";
import * as styles from "./chat.scss";
import RightSidebar from "../right-sidebar/right-sidebar";
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
  private topBar: Element<TopBar>;
  private rightSidebar: Element<RightSidebar>;
  private dialog?: IDialog;
  private peer?: IPeer;
  private lockLoad = false;
  private noMoreTop = false;
  private noMoreBottom = false;
  private idToElementMap = new Map<number, Element<Bubble>>();
  private intersectionObserver: IntersectionObserver;

  constructor({}: Options) {
    this.chatContainer = createElement("div", { class: styles.chatContainer });
    this.scrollView = createElement(
      "div",
      { class: styles.wrapper },
      this.chatContainer
    );
    this.topBarContainer = createElement("div");
    this.sendMessageForm = createElement(SendMessageForm, {
      callback: this.handleSendMessage,
      startTyping: this.startTyping
    });

    const chatSection = createElement(
      "div",
      { class: styles.container },
      this.topBarContainer,
      this.scrollView,
      this.sendMessageForm
    );

    this.rightSidebar = createElement(RightSidebar);

    this.element = createElement(
      "div",
      { class: styles.root },
      chatSection,
      this.rightSidebar
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
        this.topBar = createElement(TopBar, {
          dialog,
          peer: this.peer,
          onProfileClick: () => {
            this.rightSidebar.instance.setPeer(this.peer);
            this.rightSidebar.instance.show();
          }
        });
        removeChildren(this.topBarContainer);
        this.topBarContainer.append(this.topBar);
      }

      this.idToElementMap.clear();
      removeChildren(this.chatContainer);

      this.dialog = dialog;

      const shouldSeeSendMessageForm =
        this.peer.$t !== "Channel" || !this.peer.broadcast || this.peer.creator;

      if (shouldSeeSendMessageForm) {
        requestAnimationFrame(() => {
          this.sendMessageForm.instance.focus();
        });
      }

      const whatToDoWithInvisibilityOfSendFormHidden = shouldSeeSendMessageForm
        ? "remove"
        : "add";

      this.sendMessageForm.classList[whatToDoWithInvisibilityOfSendFormHidden](
        "hidden"
      );

      this.noMoreTop = this.noMoreBottom = false;
      try {
        await this.loadChat(
          offsetMessage ? { offsetMessage } : { unreadCount }
        );
      } finally {
        this.lockLoad = false;
      }

      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
      }
      this.intersectionObserver = new IntersectionObserver(
        debounce(entries => {
          const elements = new Map(
            entries
              .filter(entry => entry.isIntersecting)
              .map(entry => [
                parseInt(entry.target.getAttribute("data-id")),
                entry.target as Element<Bubble>
              ])
          );
          const maxId = Math.max(...elements.keys());
          if (maxId && maxId > this.dialog.readInboxMaxId) {
            const bubble = elements.get(maxId);
            bubble.instance.message.markAsRead();

            for (const element of elements.values()) {
              this.intersectionObserver.unobserve(element);
            }
          }
        }, 500)
      );
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
      const isAtTop = this.isAtTop(200);
      const isAtBottom = this.isAtBottom(200);
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
            })
            .catch(() => {
              this.lockLoad = false;
            });
        }
      }
    });

    setInterval(() => {
      if (this.topBar) {
        this.topBar.instance.update();
      }
    }, 60000);

    Dialog.events.on(
      "seen",
      async ({
        dialog,
        maxId,
        prevMaxId
      }: {
        dialog: IDialog;
        maxId: number;
        prevMaxId: number;
      }) => {
        if (dialog === this.dialog) {
          console.log({
            maxId,
            prevMaxId
          });
          // Mark messages as seen
          for (
            let bubbleWrapper = this.chatContainer.lastChild as Node;
            bubbleWrapper !== null;
            bubbleWrapper = bubbleWrapper.previousSibling
          ) {
            const lastBubbleHolder = getNthChild(bubbleWrapper, "last");

            for (
              let bubble = lastBubbleHolder.lastChild as Element<Bubble>;
              bubble !== null;
              bubble = bubble.previousSibling as Element<Bubble>
            ) {
              const message = bubble.instance.message;

              if (message.$t !== "Message" || !message.out) {
                continue;
              }

              if (message.id <= prevMaxId) {
                return;
              }

              if (message.id <= maxId) {
                bubble.instance.updateInner();
              }
            }
          }
        }
      }
    );

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
          // this.lockLoad ||
          this.idToElementMap.has(message.id)
        ) {
          return;
        }

        const peerId = extractIdFromPeer(message.toId);
        if (
          !message.out &&
          peerId.type === "User" &&
          this.peer.type === "User"
        ) {
          peerId.id = message.fromId;
        }

        if (peerId.id !== this.peer.id || peerId.type !== this.peer.type) {
          return;
        }

        const lastBubbleWrapper = getNthChild(this.chatContainer, "last");
        const lastBubbleHolder = getNthChild(lastBubbleWrapper, "last");
        const lastBubble = getNthChild(lastBubbleHolder, "last") as Element<
          Bubble
        >;

        const lastRenderedMessage = lastBubble.instance.message;
        const wasAtBottom = this.isAtBottom();

        if (message.id > lastRenderedMessage.id) {
          const element = await this.addMessage(message);

          if (wasAtBottom) {
            message.markAsRead();
            this.scrollToEnd();
          } else if (this.intersectionObserver && element) {
            this.intersectionObserver.observe(element);
          }
        }
      }
    );

    Message.events.on(
      "updated",
      async ({ object: message }: { object: IMessage }) => {
        const element = this.idToElementMap.get(message.id);

        if (element) {
          element.instance.update();
        }
      }
    );

    Message.events.on(
      "destroyed",
      ({ object: message }: { object: IMessage }) => {
        const element = this.idToElementMap.get(message.id);

        if (element) {
          element.remove();
          this.idToElementMap.delete(message.id);
        }
      }
    );
  }

  private async loadChat({
    offsetMessage,
    unreadCount = 0
  }: { offsetMessage?: number; unreadCount?: number } = {}) {
    const peer = this.peer;
    const jumpCount = unreadCount ? unreadCount - LIMIT + BACK_LIMIT : 0;
    const messages = await peer.fetchHistory(
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
    if (peer !== this.peer) {
      return;
    }

    if (unreadCount === 0) {
      this.noMoreBottom = true;
    }

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
    const [model, promise] = this.peer.sendMessage(message);

    this.handleNewMessage(model);
    return promise;
  };

  private startTyping = throttle(
    () => {
      this.dialog.startTyping();
    },
    4500,
    true
  );

  private async addMessage(
    message: IMessage,
    prepend = false
  ): Promise<Element<Bubble> | void> {
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

      // Messages can be forwarded by nobody!
      if (!peer) {
        const fwdType = message.fwdFrom.fromId ? "User" : "Channel";

        peer = await Peer.get({
          id:
            fwdType === "User"
              ? message.fwdFrom.fromId
              : message.fwdFrom.channelId,
          type: fwdType
        });
      }
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

    try {
      const messageElement = createElement(Bubble, {
        onReplyClick: this.handleReplyClick,
        message,
        peer,
        dialog: this.dialog
      });
      this.idToElementMap.set(message.id, messageElement);
      lastBubbleHolder[insertFn](messageElement);
      return messageElement;
    } catch (err) {
      console.log("failed to show a message", message, err);
    }
  }

  private handleNewMessage = (message: IMessage) => {
    if (
      message &&
      this.noMoreBottom &&
      (message.$t !== "Message" ||
        !message.media ||
        !["InputMediaUploadedPhoto", "InputMediaUploadedDocument"].includes(
          message.media.$t
        ))
    ) {
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

export function messageToHTML(message: TLMessage) {
  let currentOffset = 0;
  const rawMessage = message.message;
  let html = "";

  if (message.entities) {
    message.entities.forEach(entity => {
      const entityText = rawMessage.substr(entity.offset, entity.length);
      const textToHere = rawMessage.substring(currentOffset, entity.offset);
      html += textToHere;
      switch (entity.$t) {
        case "MessageEntityTextUrl":
          html += `<a href="${entity.url}" target="_blank">${entityText}</a>`;
          break;
        case "MessageEntityBlockquote":
          html += `<blockquote">${entityText}</blockquote>`;
          break;
        case "MessageEntityBold":
          html += `<strong>${entityText}</strong>`;
          break;
        case "MessageEntityItalic":
          html += `<em>${entityText}</em>`;
          break;
        case "MessageEntityMention":
          html += `<a href="#mention">${entityText}</a>`;
          break;
        case "MessageEntityMentionName":
          html += `<a href="#">${entityText}</a>`;
          break;
        case "MessageEntityUrl":
          html += `<a href="${entityText}" target="_blank">${entityText}</a>`;
          break;
        case "MessageEntityUnderline":
          html += `<u>${entityText}</u>`;
          break;
        default:
          html += entityText;
      }

      currentOffset = entity.offset + entity.length;
    });
  }

  html += rawMessage.substring(currentOffset);

  return messageToParagraphs(html);
}
