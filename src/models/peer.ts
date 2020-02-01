import {
  channels_GetFullChannelRequest,
  messages_ChatFull,
  messages_DialogsSlice,
  messages_GetFullChatRequest,
  messages_SendMediaRequest,
  messages_SendMessageRequest,
  users_GetFullUserRequest
} from "../core/tl/TLObjects";
import { getInputPeer, getPeer, simplifyPeerType } from "../core/tl/utils";
import { handleUpdate } from "../update-handler";
import { getDialogDisplayName } from "../utils/chat";
import { DBPeer, TelegramDatabase } from "../utils/db";
import { Dialog, IDialog } from "./dialog";
import { IMessage, Message } from "./message";
import { Model, ModelDecorator, ModelKey, ModelWithProxy } from "./model";
import { AllUpdateTypes } from "../utils/useful-types";

interface ExtraMethods {
  displayName: string;
  fetchHistory(offsetId?: number, offsetDate?: number): Promise<IMessage[]>;
  sendMessage(message: SimplifiedMessageRequest): [IMessage, Promise<any>];
  getDialog(): Promise<IDialog | undefined>;
  loadFull(): Promise<void>;
}

export type IPeer = ModelWithProxy<"peers"> & ExtraMethods;

export type SimplifiedMessageRequest = (
  | Omit<
      messages_SendMessageRequest,
      "peer" | "randomId" | "constructorId" | "subclassOfId"
    >
  | Omit<
      messages_SendMediaRequest,
      "peer" | "randomId" | "constructorId" | "subclassOfId"
    >
) & {
  peer?: messages_SendMessageRequest["peer"];
  randomId?: messages_SendMessageRequest["randomId"];
};

let transientIds = new Set<number>();

function generateTransientId() {
  let randomId: number;
  do {
    randomId = Math.floor(Math.random() * 999999);
  } while (transientIds.has(randomId));
  transientIds.add(randomId);
  return randomId;
}

@ModelDecorator({
  tableName: "peers",
  primaryKey: ["id", "type"]
})
export class Peer extends Model<"peers"> implements ExtraMethods {
  static get: (id: ModelKey<"peers">) => Promise<undefined | IPeer>;
  static bulkGet: (id: ModelKey<"peers">[]) => Promise<(undefined | IPeer)[]>;
  static fromObject: (object: any) => IPeer;
  static table: TelegramDatabase["peers"];

  protected prepareValues(object: DBPeer) {
    return {
      ...object,
      type: simplifyPeerType(object.$t)
    };
  }

  get displayName() {
    return getDialogDisplayName(this.fields);
  }

  public async fetchHistory(offsetId = 0, offsetDate = 0) {
    const limit = 20;

    const history = (await this.tg.invoke({
      $t: "messages_GetHistoryRequest",
      offsetId,
      offsetDate,
      addOffset: 0,
      limit,
      peer: getInputPeer(this.fields),
      hash: 0,
      maxId: 0,
      minId: 0
    })) as messages_DialogsSlice;

    for (const user of history.users) {
      if (user.$t === "User") {
        Peer.fromObject(user).save();
      }
    }

    const extraMessagesToFetch: number[] = [];
    const messages: IMessage[] = [];

    for (const message of history.messages) {
      const messageObject = Message.fromObject(message);
      if (message.$t === "Message" && message.replyToMsgId) {
        extraMessagesToFetch.push(message.replyToMsgId);
      }
      messageObject.save();
      messages.push(messageObject);
    }

    await Message.bulkFetch(
      extraMessagesToFetch,
      this._proxy.$t === "Channel" ? this._proxy : undefined
    );

    return messages;
  }

  public getDialog() {
    return Dialog.get({
      peerId: this._proxy.id,
      peerType: this._proxy.type
    });
  }

  public sendMessage(
    message: SimplifiedMessageRequest
  ): [IMessage, Promise<any>] {
    const randomId = generateTransientId() as any;
    const messageModel = Message.fromObject({
      ...message,
      $t: "Message",
      date: Date.now() / 1000,
      id: randomId,
      toId: getPeer(this.fields),
      out: true
    });
    messageModel.justSent = true;
    messageModel.saveInMemory();

    const promise = this.tg
      .invoke({
        ...message,
        randomId,
        peer: getInputPeer(this.fields)
      })
      .then((updates: AllUpdateTypes) => {
        transientIds.delete(randomId);

        return handleUpdate(updates, {
          transientMessage: {
            randomId,
            message: messageModel
          }
        });
      });

    return [messageModel, promise];
  }

  public async loadFull() {
    if (this._proxy.full) {
      return;
    }

    const inputPeer = getInputPeer(this._proxy);
    let input:
      | messages_GetFullChatRequest
      | channels_GetFullChannelRequest
      | users_GetFullUserRequest;

    switch (this._proxy.$t) {
      case "Channel":
        input = {
          $t: "channels_GetFullChannelRequest",
          channel: inputPeer as any
        };
        break;
      case "User":
        input = {
          $t: "users_GetFullUserRequest",
          id: inputPeer as any
        };
        break;
      case "Chat":
        input = {
          $t: "messages_GetFullChatRequest",
          chatId: this._proxy.id
        };
        break;
    }

    const chatFull = (await this.tg.invoke(input)) as messages_ChatFull;
    this._proxy.full = chatFull.fullChat;

    // TODO: Load all entities
    // for (const user of chatFull.users) {
    // }

    this.save();
  }
}
