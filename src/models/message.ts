import dayjs from "dayjs";
import {
  messages_MessagesSlice,
  UpdateShortChatMessage,
  UpdateShortMessage
} from "../core/tl/TLObjects";
import { extractIdFromPeer, getInputPeer } from "../core/tl/utils";
import { TelegramDatabase } from "../utils/db";
import { DialogMessageTypes, InputMessageIdTypes } from "../utils/useful-types";
import { Model, ModelDecorator, ModelKey, ModelWithProxy } from "./model";
import { IPeer, Peer } from "./peer";

interface ExtraMethods {
  date: dayjs.Dayjs;
  justSent: boolean;
  getPeer(): Promise<IPeer | undefined>;
  bulkFetch(ids: number[]): Promise<IMessage[]>;
}

export type IMessage = ModelWithProxy<"messages"> & ExtraMethods;

@ModelDecorator({
  tableName: "messages",
  primaryKey: ["id"]
})
export class Message extends Model<"messages"> {
  static get: (id: ModelKey<"messages">) => Promise<undefined | IMessage>;
  static bulkGet: (
    id: ModelKey<"messages">[]
  ) => Promise<(undefined | IMessage)[]>;
  static table: TelegramDatabase["messages"];
  static fromObject: (object: any) => IMessage;

  public justSent = false;

  protected prepareValues(
    message: DialogMessageTypes | UpdateShortMessage | UpdateShortChatMessage
  ) {
    let normalizedMessage: DialogMessageTypes;

    if (message.$t === "UpdateShortMessage") {
      normalizedMessage = {
        $t: "Message",
        toId: {
          $t: "PeerUser",
          userId: message.userId
        },
        fromId: message.userId,
        out: message.out,
        date: message.date,
        replyToMsgId: message.replyToMsgId,
        id: message.id,
        message: message.message,
        fwdFrom: message.fwdFrom,
        mentioned: message.mentioned,
        mediaUnread: message.mediaUnread,
        silent: message.silent,
        entities: message.entities
      };
    } else if (message.$t === "UpdateShortChatMessage") {
      normalizedMessage = {
        $t: "Message",
        toId: {
          $t: "PeerChat",
          chatId: message.chatId
        },
        fromId: message.fromId,
        out: message.out,
        date: message.date,
        replyToMsgId: message.replyToMsgId,
        id: message.id,
        message: message.message,
        fwdFrom: message.fwdFrom,
        mentioned: message.mentioned,
        mediaUnread: message.mediaUnread,
        silent: message.silent,
        entities: message.entities
      };
    } else {
      normalizedMessage = message;
    }

    return normalizedMessage;
  }

  public getPeer() {
    if (this.fields.$t === "MessageEmpty") {
      return undefined;
    }

    return Peer.get(extractIdFromPeer(this._proxy.toId));
  }

  public static async bulkFetch(
    ids: (number | InputMessageIdTypes)[],
    channel?: IPeer
  ) {
    const base = channel
      ? { $t: "channels_GetMessagesRequest", channel: getInputPeer(channel) }
      : {
          $t: "messages_GetMessagesRequest"
        };
    const messagesSlice = (await this.tg.invoke({
      ...base,
      id: ids.map(id =>
        typeof id === "number" ? { $t: "InputMessageID", id } : id
      )
    } as any)) as messages_MessagesSlice;

    for (const user of messagesSlice.users) {
      Peer.fromObject(user).save();
    }

    for (const chat of messagesSlice.chats) {
      Peer.fromObject(chat).save();
    }

    const messages = [];
    for (const message of messagesSlice.messages) {
      const model = Message.fromObject(message);
      model.save();
      messages.push(model);
    }

    return messages;
  }

  get date() {
    if (this.fields.$t === "MessageEmpty") {
      return dayjs(0);
    }

    return dayjs.unix(this.fields.date);
  }
}
