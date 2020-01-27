import { TelegramDatabase } from "../utils/db";
import { Model, ModelDecorator, ModelWithProxy, ModelKey } from "./model";
import dayjs from "dayjs";
import {
  UpdateShortChatMessage,
  UpdateShortMessage
} from "../core/tl/TLObjects";
import { DialogMessageTypes } from "../utils/useful-types";

interface ExtraMethods {
  date: dayjs.Dayjs;
  justSent: boolean;
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
          userId: 0
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

  get date() {
    if (this.fields.$t === "MessageEmpty") {
      return dayjs(0);
    }

    return dayjs.unix(this.fields.date);
  }
}
