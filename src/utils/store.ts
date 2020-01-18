import mitt, { Emitter } from "mitt";
import { TelegramClient } from "../core/TelegramClient";
import {
  messages_Dialogs,
  messages_Messages,
  messages_GetDialogsRequest,
  Dialog,
  DialogFolder,
  Message,
  Authorization,
  messages_DialogsSlice,
  messages_SendMessageRequest,
  UpdateShortMessage
} from "../core/tl/TLObjects";
import { getPeerId, getInputPeer } from "../core/tl/utils";
import {
  DialogPeerTypes,
  PresentationalDialog,
  DialogMessageTypes
} from "../models/dialog";
import { UpdateTypes } from "../core/types";

let singleton: Store;

export type SimplifiedMessageRequest = Omit<
  messages_SendMessageRequest,
  "peer" | "randomId" | "$t"
> &
  Pick<Partial<messages_SendMessageRequest>, "peer" | "randomId">;

export type SimplifiedMessageRequestWithPeer = Omit<
  messages_SendMessageRequest,
  "randomId" | "$t"
>;

type Events =
  | "fetched_chats"
  | "fetched_more_chats"
  | "fetched_history"
  | "selected_dialog"
  | "message_sent_"
  | string;

type Callback<T> = (arg: T) => void;

const AUTH_CACHE_KEY = "TL_AUTH";

class Store {
  private mitt: Emitter;
  public entities = new Map<number, DialogPeerTypes>();
  public messages = new Map<number, DialogMessageTypes>();
  public history = new Map<number, number[]>(); // peer_id => message_id[]
  public peers = new Map<number, DialogPeerTypes>();
  public dialogs = new Map<number, Dialog>();
  private transientIds = new Set<number>();
  public lastDialog?: Dialog;
  public sortedDialogs: number[] = [];
  public client: TelegramClient;

  // @ts-ignore
  private serverTimeOffset = 0;

  constructor(private _me?: Authorization) {
    this.mitt = mitt();
  }

  static get singleton() {
    const me = localStorage.getItem(AUTH_CACHE_KEY);
    const object = singleton || new Store(me ? JSON.parse(me) : undefined);
    return object;
  }

  set me(me: Authorization) {
    this._me = me;
    localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(me));
  }

  get me() {
    return this._me;
  }

  sub(event: "selected_dialog", callback: Callback<number>): void;

  sub(event: "fetched_chats", callback: Callback<undefined>): void;

  sub(event: "fetched_more_chats", callback: Callback<number>): void;

  sub(
    event: "fetched_history",
    callback: Callback<{ chatId: number; messageIds: number[] }>
  ): void;

  sub(event: string, callback: Callback<any>) {
    this.mitt.on(event as any, callback);
  }

  unsub(event: Events, callback: Callback<any>) {
    this.mitt.off(event as any, callback);
  }

  pub(event: Events, data?: any) {
    switch (event) {
      default:
        this.mitt.emit(event, data);
    }
  }

  get fileStorage() {
    return this.client.fileStorage;
  }

  public fetchMoreDialogs() {
    return this.fetchDialogs(false);
  }

  public handleUpdate(update: UpdateTypes, _short = false) {
    console.debug("Update received", update);

    switch (update.$t) {
      case "UpdateNewMessage":
      case "UpdateShortMessage":
        // All incoming message updates
        let id: number;
        let message: DialogMessageTypes;

        if (
          update.$t === "UpdateNewMessage" &&
          update.message.$t === "Message"
        ) {
          id = update.message.fromId;
          message = update.message;
        } else if (update.$t === "UpdateShortMessage") {
          id = update.userId;
          message = update;
        }

        if (message) {
          this.handleIncomingMessage(id, message);
        }

        break;
    }
  }

  private handleIncomingMessage(peerId: number, message: DialogMessageTypes) {
    const dialog = this.dialogs.get(peerId);

    dialog.topMessage = message.id;
    this.setMessage(message.id, message);
    const model = PresentationalDialog.findById(peerId);
    dialog.unreadCount++;
    model.message = message;
    model.events.emit("update");
    model.events.emit("message", message);
  }

  public async fetchMessages(ids: number[]) {
    const messages = (await this.client.invoke({
      $t: "messages_GetMessagesRequest",
      id: ids.map(id => ({
        $t: "InputMessageID",
        id
      }))
    })) as messages_Messages;

    for (const chat of messages.chats) {
      this.setPeer(chat.id, chat);
    }

    for (const user of messages.users) {
      if (user.$t === "User" || user.$t === "UserEmpty") {
        this.setPeer(user.id, user);
      }
    }

    for (const message of messages.messages) {
      if (message.$t === "Message") {
        this.setMessage(message.id, message);
      }
    }
  }

  public async fetchDialogs(initial = true) {
    let offsetDate = 0;
    let offsetId = 0;
    let offsetPeer: messages_GetDialogsRequest["offsetPeer"] = {
      $t: "InputPeerEmpty"
    };

    if (!initial) {
      let lastMessage: Message;
      let lastPeer: DialogPeerTypes;

      if (this.sortedDialogs.length !== 0) {
        for (let i = this.sortedDialogs.length; i >= 0; i--) {
          const id = this.sortedDialogs[i];
          const dialog = this.dialogs.get(id);
          if (!dialog) {
            continue;
          }
          const message = this.messages.get(dialog.topMessage);
          const peerId = getPeerId(dialog.peer);
          const peer = this.peers.get(peerId);
          if (message && message.$t === "Message" && peer) {
            lastMessage = message;
            lastPeer = peer;
            break;
          }
        }
      }

      if (lastMessage && lastPeer) {
        offsetId = lastMessage.id;
        offsetDate = lastMessage.date;
        offsetPeer = getInputPeer(lastPeer);
      } else {
        initial = true;
      }
    }

    const dialogs = (await this.client.invoke({
      $t: "messages_GetDialogsRequest",
      offsetDate,
      offsetId,
      offsetPeer,
      hash: 0,
      limit: 30
    })) as messages_Dialogs;

    for (const chat of dialogs.chats) {
      this.setPeer(chat.id, chat);
    }

    for (const user of dialogs.users) {
      if (user.$t === "User" || user.$t === "UserEmpty") {
        this.setPeer(user.id, user);
      }
    }

    for (const message of dialogs.messages) {
      if (message.$t === "Message" || message.$t === "MessageEmpty") {
        this.setMessage(message.id, message);
      }
      // TODO: handle MessageService
    }

    const newOffset = this.sortedDialogs.length;
    const messagesToFetch = [];
    const messageIds = [...this.messages.keys()];

    for (const dialog of dialogs.dialogs) {
      if (dialog.$t === "Dialog") {
        const peerId = getPeerId(dialog.peer);
        this.dialogs.set(peerId, dialog);

        if (!messageIds.includes(dialog.topMessage)) {
          messagesToFetch.push(dialog.topMessage);
        }

        if (!this.sortedDialogs.includes(peerId)) {
          this.sortedDialogs.push(peerId);
        }
      }
    }

    if (messagesToFetch.length > 0) {
      await this.fetchMessages(messagesToFetch);
    }

    if (initial) {
      this.pub("fetched_chats");
    } else {
      this.pub("fetched_more_chats", newOffset);
    }
  }

  public getDialog(id: number) {
    return this.dialogs.get(id);
  }

  public getMessage(id: number) {
    return this.messages.get(id);
  }

  public sendMessage(
    chatId: number,
    message: SimplifiedMessageRequestWithPeer
  ) {
    const randomId = Math.ceil(Math.random() * 64000);
    this.transientIds.add(randomId);
    const transientMessage = ({
      $t: "Message",
      date: Date.now(),
      id: randomId,
      ...message
    } as never) as Message;
    this.setMessage(transientMessage.id, transientMessage);
    const history = this.getHistory(chatId);
    history.push(randomId);

    this.client
      .invoke({
        $t: "messages_SendMessageRequest",
        ...message,
        randomId: BigInt(randomId)
      })
      .then(update => {
        if (update.$t === "UpdateShortSentMessage") {
          update.out = false;
          this.transientIds.delete(randomId);
          const history = this.getHistory(chatId);
          const castedMessage = {
            ...message,
            ...update,
            out: true,
            $t: "UpdateShortMessage"
          } as never;

          this.setMessage(update.id, castedMessage as UpdateShortMessage);
          this.history.set(
            chatId,
            history.map(id => (id === randomId ? update.id : id))
          );
          this.pub(`message_sent_${randomId}`, update.id);
        }
      });

    return randomId;
  }

  public fetchMoreHistory(chatId: number, peer: DialogPeerTypes) {
    const history = this.getHistory(chatId);
    const msgId = history.find(id => {
      const msg = this.getMessage(id);
      return msg && msg.$t !== "MessageEmpty";
    });

    const offsetDate = msgId ? (this.getMessage(msgId) as Message).date : 0;

    return this.fetchHistory(chatId, peer, msgId, offsetDate);
  }

  public async fetchHistory(
    chatId: number,
    peer: DialogPeerTypes,
    offsetId = 0,
    offsetDate = 0
  ) {
    const limit = 20;
    const prefetchHistory = this.getHistory(chatId);
    if (offsetId === 0 && prefetchHistory.length > 0) {
      return this.pub("fetched_history", {
        chatId,
        messageIds: prefetchHistory.slice(-limit)
      });
    }

    const history = (await this.client.invoke({
      $t: "messages_GetHistoryRequest",
      offsetId,
      offsetDate,
      addOffset: 0,
      limit,
      peer: getInputPeer(peer),
      hash: 0,
      maxId: 0,
      minId: 0
    })) as messages_DialogsSlice;

    for (const user of history.users) {
      if (user.$t === "User") {
        const userId = getPeerId(user);
        this.setPeer(userId, user);
      }
    }

    const currentHistory = this.getHistory(chatId);
    const messageIds = [];
    for (const message of history.messages) {
      if (message.$t === "MessageService") {
        // No support for service msgs atm
        continue;
      }

      this.setMessage(message.id, message);

      if (!currentHistory.includes(message.id)) {
        messageIds.unshift(message.id);
      }
    }

    this.history.set(chatId, [...messageIds, ...currentHistory]);

    this.pub("fetched_history", { chatId, messageIds });
  }

  public getHistory(chatId: number) {
    return this.history.get(chatId) || [];
  }

  public getDialogPeerIdKey(dialog: Dialog | DialogFolder) {
    switch (dialog.peer.$t) {
      case "PeerChannel":
        return "channelId";
      case "PeerChat":
        return "chatId";
      case "PeerUser":
        return "userId";
    }
  }

  public addMessage(message: DialogMessageTypes) {
    if (message.$t !== "MessageEmpty") {
    }
  }

  public setServerTime(serverTime: number) {
    this.serverTimeOffset = serverTime - Date.now();
  }

  private setPeer(peerId: number, peer: DialogPeerTypes) {
    this.peers.set(peerId, peer);
  }

  private setMessage(messageId: number, message: DialogMessageTypes) {
    this.messages.set(messageId, message);
  }
}

export default Store.singleton;
