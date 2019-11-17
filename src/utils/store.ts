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
  messages_DialogsSlice
} from "../core/tl/TLObjects";
import { getPeerId, getInputPeer } from "../core/tl/utils";
import {
  DialogPeerTypes,
  PresentationalDialog,
  DialogMessageTypes
} from "../models/dialog";
import { UpdateTypes } from "../core/types";

let singleton: Store;

type Events =
  | "fetched_chats"
  | "fetched_more_chats"
  | "fetched_history"
  | "selected_dialog"
  | string;

type Callback<T> = (arg: T) => void;

class Store {
  private mitt: Emitter;
  public entities = new Map<number, DialogPeerTypes>();
  public messages = new Map<number, DialogMessageTypes>();
  public history = new Map<number, number[]>(); // peer_id => message_id[]
  public peers = new Map<number, DialogPeerTypes>();
  public dialogs = new Map<number, Dialog>();
  public lastDialog?: Dialog;
  public sortedDialogs: number[] = [];
  public client: TelegramClient;
  public me: Authorization;

  // @ts-ignore
  private serverTimeOffset = 0;

  constructor() {
    this.mitt = mitt();
  }

  static get singleton() {
    const object = singleton || new Store();
    return object;
  }

  sub(event: "selected_dialog", callback: Callback<number>): void;

  sub(event: "fetched_chats", callback: Callback<undefined>): void;

  sub(event: "fetched_more_chats", callback: Callback<number>): void;

  sub(event: "fetched_history", callback: Callback<{ chatId: number }>): void;

  sub(event: Events, callback: Callback<any>) {
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
    this.messages.set(message.id, message);
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
      this.peers.set(chat.id, chat);
    }

    for (const user of messages.users) {
      if (user.$t === "User" || user.$t === "UserEmpty") {
        this.peers.set(user.id, user);
      }
    }

    for (const message of messages.messages) {
      if (message.$t === "Message") {
        this.messages.set(message.id, message);
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
      this.peers.set(chat.id, chat);
    }

    for (const user of dialogs.users) {
      if (user.$t === "User" || user.$t === "UserEmpty") {
        this.peers.set(user.id, user);
      }
    }

    for (const message of dialogs.messages) {
      if (message.$t === "Message" || message.$t === "MessageEmpty") {
        this.messages.set(message.id, message);
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

  public async fetchHistory(
    chatId: number,
    peer: DialogPeerTypes,
    offsetId = 0
  ) {
    const history = (await this.client.invoke({
      $t: "messages_GetHistoryRequest",
      offsetId,
      offsetDate: 0,
      addOffset: 0,
      limit: 20,
      peer: getInputPeer(peer),
      hash: 0,
      maxId: 0,
      minId: 0
    })) as messages_DialogsSlice;

    for (const user of history.users) {
      if (user.$t === "User") {
        const userId = getPeerId(user);
        this.peers.set(userId, user);
      }
    }

    const messageIds = [];
    for (const message of history.messages) {
      if (message.$t === "MessageService") {
        // No support for service msgs atm
        continue;
      }

      this.messages.set(message.id, message);
      messageIds.unshift(message.id);
    }

    const currentHistory = this.getHistory(chatId);

    this.history.set(chatId, [...messageIds, currentHistory]);

    this.pub("fetched_history", { chatId });
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
}

export default Store.singleton;
