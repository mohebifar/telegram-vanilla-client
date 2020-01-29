import {
  channels_GetFullChannelRequest,
  messages_DialogsSlice,
  messages_GetFullChatRequest,
  messages_SendMessageRequest,
  UpdateShortSentMessage,
  users_GetFullUserRequest,
  messages_ChatFull
} from "../core/tl/TLObjects";
import { getInputPeer, getPeer, simplifyPeerType } from "../core/tl/utils";
import { getDialogDisplayName } from "../utils/chat";
import { DBPeer, TelegramDatabase } from "../utils/db";
import { Dialog, IDialog } from "./dialog";
import { IMessage, Message } from "./message";
import { Model, ModelDecorator, ModelKey, ModelWithProxy } from "./model";

interface ExtraMethods {
  displayName: string;
  fetchHistory(offsetId?: number, offsetDate?: number): Promise<IMessage[]>;
  sendMessage(
    message: SimplifiedMessageRequest
  ): [IMessage, Promise<IMessage | undefined>];
  getDialog(): Promise<IDialog | undefined>;
  loadFull(): Promise<void>;
}

export type IPeer = ModelWithProxy<"peers"> & ExtraMethods;

export type SimplifiedMessageRequest = Omit<
  messages_SendMessageRequest,
  "peer" | "randomId" | "$t" | "constructorId" | "subclassOfId"
> &
  Pick<Partial<messages_SendMessageRequest>, "peer" | "randomId">;

let transientIds = new Set<number>();

function generateTransientId() {
  let randomId: number;
  do {
    randomId = Math.ceil(Math.random() * 64000);
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

    const messages: IMessage[] = [];

    for (const message of history.messages) {
      if (message.$t === "MessageService") {
        continue;
      }

      const messageObject = Message.fromObject(message);
      messageObject.save();
      messages.push(messageObject);
    }

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
  ): [IMessage, Promise<IMessage | undefined>] {
    const randomId = generateTransientId();
    const messageModel = Message.fromObject({
      $t: "Message",
      date: Date.now() / 1000,
      id: randomId,
      toId: getPeer(this.fields),
      out: true,
      ...message
    });
    messageModel.justSent = true;

    const promise = this.tg
      .invoke({
        $t: "messages_SendMessageRequest",
        ...message,
        randomId: BigInt(randomId),
        peer: getInputPeer(this.fields)
      })
      .then(
        ({
          $t,
          constructorId,
          subclassOfId,
          out,
          ...update
        }: UpdateShortSentMessage) => {
          transientIds.delete(randomId);
          messageModel.assignValues(update);
          messageModel.justSent = false;
          return this.getDialog();
        }
      )
      .then(async dialog => {
        dialog.topMessage = messageModel.id;
        dialog.lastMessageDate = Date.now() / 1000;
        await messageModel.save();
        dialog.save();
        return messageModel;
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
