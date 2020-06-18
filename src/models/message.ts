import dayjs from "dayjs";
import {
  Channel,
  InputPeerUser,
  channels_GetMessagesRequest,
  messages_GetMessagesRequest,
  messages_MessagesSlice,
  UpdateShortChatMessage,
  UpdateShortMessage,
} from "../core/tl/TLObjects";
import { extractIdFromPeer, getInputPeer } from "../core/tl/utils";
import { DBMessage, TelegramDatabase } from "../utils/db";
import { DialogMessageTypes, InputMessageIdTypes } from "../utils/useful-types";
import { Model, ModelDecorator, ModelKey, ModelWithProxy } from "./model";
import { IPeer, Peer } from "./peer";

interface ExtraMethods {
  date: dayjs.Dayjs;
  justSent: boolean;
  getPeer(): Promise<IPeer | undefined>;
  bulkFetch(ids: number[]): Promise<IMessage[]>;
  markAsRead(numberOfRead?: number): Promise<boolean>;
  getSender(): Promise<IPeer | undefined>;
  getPeerForwardedFrom(): Promise<string | undefined>;
}

export type IMessage = ModelWithProxy<"messages"> & ExtraMethods;

@ModelDecorator({
  tableName: "messages",
  primaryKey: ["id", "channelId"],
})
export class Message extends Model<"messages"> {
  static get: (id: ModelKey<"messages">) => Promise<undefined | IMessage>;
  static bulkGet: (
    id: ModelKey<"messages">[]
  ) => Promise<(undefined | IMessage)[]>;
  static table: TelegramDatabase["messages"];
  static fromObject: (object: any) => IMessage;
  static pollToMessage = new Map<string, IMessage>();

  public justSent = false;

  protected prepareValues(
    message: DialogMessageTypes | UpdateShortMessage | UpdateShortChatMessage
  ) {
    let normalizedMessage: DBMessage;

    if (
      "media" in message &&
      message.media &&
      message.media.$t === "MessageMediaPoll"
    ) {
      Message.pollToMessage.set(message.media.poll.id, this as any);
    }

    if (
      message.$t === "UpdateShortMessage" ||
      message.$t === "UpdateShortChatMessage"
    ) {
      normalizedMessage = {
        ...(message.$t === "UpdateShortMessage"
          ? {
              toId: {
                $t: "PeerUser",
                userId: message.userId,
              },
              fromId: message.userId,
            }
          : {
              toId: {
                $t: "PeerChat",
                chatId: message.chatId,
              },
              fromId: message.fromId,
            }),
        $t: "Message",
        out: message.out,
        date: message.date,
        replyToMsgId: message.replyToMsgId,
        id: message.id,
        message: message.message,
        fwdFrom: message.fwdFrom,
        mentioned: message.mentioned,
        mediaUnread: message.mediaUnread,
        silent: message.silent,
        entities: message.entities,
      } as any;
    } else {
      normalizedMessage = message as any;
    }

    normalizedMessage.channelId =
      "toId" in normalizedMessage
        ? Number(
            normalizedMessage.toId.$t === "PeerChannel" &&
              normalizedMessage.toId.channelId
          )
        : 0;

    return normalizedMessage;
  }

  public getPeer() {
    if (this.fields.$t === "MessageEmpty") {
      return undefined;
    }

    if (this._proxy.toId.$t === "PeerUser" && !this._proxy.out) {
      return Peer.get({ type: "User", id: this._proxy.fromId });
    }
    return Peer.get(extractIdFromPeer(this._proxy.toId));
  }

  public async markAsRead(numberOfRead = 0) {
    const peer = await this.getPeer();
    const dialog = await peer.getDialog();
    if (dialog) {
      dialog.readInboxMaxId = this._proxy.id;
      dialog.unreadCount = Math.max(
        numberOfRead && dialog.unreadCount - numberOfRead,
        0
      );
      dialog.save();
    }

    const input = peer.isChannel()
      ? {
          $t: "channels_ReadHistoryRequest",
          channel: {
            $t: "InputChannel",
            channelId: peer.id,
            accessHash: (peer as Channel).accessHash,
          },
          maxId: this._proxy.id,
        }
      : {
          $t: "messages_ReadHistoryRequest",
          maxId: this._proxy.id,
          peer: getInputPeer(peer) as InputPeerUser,
        };

    return this.tg.invoke(input as any);
  }

  public static async bulkFetch(
    ids: (number | InputMessageIdTypes)[],
    channel?: IPeer
  ) {
    const inputIds = ids.map((id) =>
      typeof id === "number" ? { $t: "InputMessageID", id } : id
    ) as InputMessageIdTypes[];

    const base = channel
      ? { $t: "channels_GetMessagesRequest", channel: getInputPeer(channel) }
      : { $t: "messages_GetMessagesRequest" };

    const input = {
      ...base,
      id: inputIds,
    } as channels_GetMessagesRequest | messages_GetMessagesRequest;

    const messagesSlice = (await this.tg.invoke(
      input
    )) as messages_MessagesSlice;

    for (const user of messagesSlice.users) {
      Peer.fromObject(user).save();
    }

    for (const chat of messagesSlice.chats) {
      Peer.fromObject(chat).save();
    }

    const messages: IMessage[] = [];
    for (const message of messagesSlice.messages) {
      const model = Message.fromObject(message);
      model.save();
      messages.push(model);
    }

    return messages;
  }

  public static async globalSearch(q: string) {
    let offsetId = 0;

    const response = (await this.tg.invoke({
      $t: "messages_SearchGlobalRequest",
      offsetId,
      offsetPeer: {
        $t: "InputPeerSelf",
      },
      offsetRate: 0,
      limit: 20,
      q,
    })) as messages_MessagesSlice;

    for (const chat of response.chats) {
      Peer.fromObject(chat).save();
    }

    for (const user of response.users) {
      if (user.$t === "User" || user.$t === "UserEmpty") {
        Peer.fromObject(user).save();
      }
    }

    const messages: IMessage[] = [];
    for (const message of response.messages) {
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

  public getSender() {
    if (this._proxy.$t === "Message") {
      if (this._proxy.fromId) {
        return Peer.get({
          id: this._proxy.fromId,
          type: "User",
        });
      } else if (this._proxy.toId.$t === "PeerChannel") {
        return Peer.get({
          id: this._proxy.toId.channelId,
          type: "Channel",
        });
      } else if (!this._proxy.fwdFrom) {
        const fwdType = this._proxy.fwdFrom.fromId ? "User" : "Channel";
        return Peer.get({
          id:
            fwdType === "User"
              ? this._proxy.fwdFrom.fromId
              : this._proxy.fwdFrom.channelId,
          type: fwdType,
        });
      }
    }

    return undefined;
  }

  public async getPeerForwardedFrom() {
    if (this.fields.$t === "Message" && this.fields.fwdFrom) {
      const forward = this.fields.fwdFrom;

      if (forward.fromId) {
        return (await Peer.get({ type: "User", id: forward.fromId }))
          .displayName;
      }

      if (forward.channelId) {
        return (await Peer.get({ type: "Channel", id: forward.channelId }))
          .displayName;
      }
      return forward.fromName;
    }

    return undefined;
  }
}
