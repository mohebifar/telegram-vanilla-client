import mitt, { Emitter } from "mitt";
import { TelegramClient } from "../core/TelegramClient";
import {
  messages_Dialogs,
  messages_Messages,
  messages_PeerDialogs,
  messages_GetDialogsRequest,
  Dialog,
  DialogFolder,
  Message
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
  | "peer_added"
  | "entities_added"
  | "dialog_added"
  | "dialog_updated_x"
  | "chats_initiated"
  | "chats_fetched_more"
  | string;

type Callback<T> = (arg: T) => void;

class Store {
  private mitt: Emitter;
  public entities = new Map<number, DialogPeerTypes>();
  public messages = new Map<number, DialogMessageTypes>();
  public peers = new Map<number, DialogPeerTypes>();
  public dialogs = new Map<number, Dialog>();
  public lastDialog?: Dialog;
  public sortedDialogs: number[] = [];
  public client: TelegramClient;

  // @ts-ignore
  private serverTimeOffset = 0;

  constructor() {
    this.mitt = mitt();
  }

  static get singleton() {
    const object = singleton || new Store();
    return object;
  }

  sub(event: "chats_initiated", callback: Callback<undefined>): void;

  sub(event: "chats_fetched_more", callback: Callback<number>): void;

  sub(event: "dialog_added", callback: Callback<messages_PeerDialogs>): void;

  sub(event: "dialog_updated", callback: Callback<messages_PeerDialogs>): void;

  sub(event: Events, callback: Callback<any>) {
    this.mitt.on(event as any, callback);
  }

  unsub(event: Events, callback: Callback<any>) {
    this.mitt.off(event as any, callback);
  }

  pub(event: Events, data?: any) {
    switch (event) {
      case "entities_added":
        // this.entities.push(data);
        this.handlePeerDialogs(data);
        this.mitt.emit(event, data);
        break;
      case "peer_added":
        // this.entities.push(data);
        this.mitt.emit(event, data);
        break;
      default:
        this.mitt.emit(event, data);
    }
  }

  get fileStorage() {
    return this.client.fileStorage;
  }

  private async handlePeerDialogs(_ids?: number[]) {}

  public fetchMoreDialogs() {
    return this.getDialogs(false);
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
  }

  public async getMessages(ids: number[]) {
    console.log("getting more messages", ids);
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

  public async getDialogs(initial = true) {
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
      await this.getMessages(messagesToFetch);
    }

    if (initial) {
      this.pub("chats_initiated");
    } else {
      this.pub("chats_fetched_more", newOffset);
    }
  }

  public getDialog(id: number) {
    return this.dialogs.get(id);
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

  addEntity(id: number, entities: any) {
    this.entities.set(id, entities);
  }

  public setServerTime(serverTime: number) {
    this.serverTimeOffset = serverTime - Date.now();
  }
}

export default Store.singleton;
