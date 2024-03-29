import {
  channels_GetFullChannelRequest,
  messages_ChatFull,
  messages_DialogsSlice,
  messages_GetFullChatRequest,
  messages_SendMediaRequest,
  messages_SendMessageRequest,
  users_GetFullUserRequest,
  UserFull,
  Message as TLMessage,
  contacts_Found,
  messages_MessagesSlice,
  messages_PeerDialogs,
} from "../core/tl/TLObjects";
import {
  getInputPeer,
  getPeer,
  simplifyPeerType,
  extractIdFromPeer,
} from "../core/tl/utils";
import { handleUpdate } from "../update-handler";
import { getDialogDisplayName } from "../utils/chat";
import { DBPeer, TelegramDatabase } from "../utils/db";
import { AllUpdateTypes, TransientMedia } from "../utils/useful-types";
import { Dialog, IDialog } from "./dialog";
import { IMessage, Message } from "./message";
import { Model, ModelDecorator, ModelKey, ModelWithProxy } from "./model";

interface FetchHistoryInput {
  offsetId?: number;
  offsetDate?: number;
  addOffset?: number;
  limit?: number;
  minId?: number;
  maxId?: number;
}

interface ExtraMethods {
  displayName: string;
  displayPeerName: string;
  fetchHistory(options: FetchHistoryInput): Promise<IMessage[]>;
  sendMessage(
    message: SimplifiedMessageRequest
  ): [IMessage, Promise<any>, boolean];
  getDialog(): Promise<IDialog | undefined>;
  loadFull(): Promise<void>;
  isChannel(): boolean;
  canSendMessage(): boolean;
  canSendPoll(): boolean;
  isGroupChat(): boolean;
  searchMessage(
    q: string,
    options?: {
      offsetId: number;
      addOffset?: number;
      limit?: number;
      minId?: number;
      maxId?: number;
    }
  ): Promise<IMessage[]>;
}

export type IPeer = ModelWithProxy<"peers"> & ExtraMethods;

type SimplifiedSendMessage = Omit<
  messages_SendMessageRequest,
  "peer" | "randomId" | "constructorId" | "subclassOfId"
>;

type SimplifiedSendMedia = Omit<
  messages_SendMediaRequest,
  "peer" | "randomId" | "constructorId" | "subclassOfId" | "media"
> & {
  media: messages_SendMediaRequest["media"] | TransientMedia;
};

export type SimplifiedMessageRequest = (
  | SimplifiedSendMessage
  | SimplifiedSendMedia
) & {
  peer?: messages_SendMessageRequest["peer"];
  randomId?: messages_SendMessageRequest["randomId"];
  actualMedia?: TLMessage["media"];
  transientModel?: IMessage;
};

const SELF_DIALOG_NAME = "Saved Messages";

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
  primaryKey: ["id", "type"],
})
export class Peer extends Model<"peers"> implements ExtraMethods {
  static get: (id: ModelKey<"peers">) => Promise<undefined | IPeer>;
  static bulkGet: (id: ModelKey<"peers">[]) => Promise<(undefined | IPeer)[]>;
  static fromObject: (object: any) => IPeer;
  static table: TelegramDatabase["peers"];
  static self: UserFull;

  protected prepareValues(object: DBPeer) {
    return {
      ...object,
      type: simplifyPeerType(object.$t),
    };
  }

  static async search(q: string) {
    const response = (await this.tg.invoke({
      $t: "contacts_SearchRequest",
      limit: 4,
      q,
    })) as contacts_Found;

    const myResults: IPeer[] = [];
    const result: IPeer[] = [];

    const regex = new RegExp("^" + q, "i");

    if (regex.test(SELF_DIALOG_NAME)) {
      const self = (await this.tg.invoke({
        $t: "messages_GetPeerDialogsRequest",
        peers: [{ $t: "InputDialogPeer", peer: { $t: "InputPeerSelf" } }],
      })) as messages_PeerDialogs;
      const [dialog] = self.dialogs;

      if (dialog && self.users.length > 0) {
        response.users.unshift(self.users[0]);
        response.myResults.unshift(dialog.peer);
      }
    }

    for (const peer of [...response.chats, ...response.users]) {
      Peer.fromObject(peer).save();
    }

    for (const contact of response.myResults) {
      const model = await Peer.get(extractIdFromPeer(contact));
      myResults.push(model);
    }
    for (const contact of response.results) {
      const model = await Peer.get(extractIdFromPeer(contact));
      result.push(model);
    }

    return [myResults, result];
  }

  public async searchMessage(
    q: string,
    {
      offsetId = 0,
      addOffset = 0,
      limit = 20,
      maxId = 0,
      minId = 0,
    }: {
      offsetId: number;
      addOffset?: number;
      limit?: number;
      minId?: number;
      maxId?: number;
    } = {} as any
  ) {
    const response = (await this.tg.invoke({
      $t: "messages_SearchRequest",
      addOffset,
      filter: {
        $t: "InputMessagesFilterEmpty",
      },
      peer: getInputPeer(this._proxy),
      maxId,
      minId,
      hash: 0,
      maxDate: 0,
      minDate: 0,
      offsetId,
      limit,
      q,
    })) as messages_MessagesSlice;

    for (const peer of [...response.users, ...response.chats]) {
      Peer.fromObject(peer).save();
    }

    const result: IMessage[] = [];
    for (const message of response.messages) {
      if (message.$t !== "Message") {
        continue;
      }

      const model = Message.fromObject(message);
      model.save();
      result.push(model);
    }

    return result;
  }

  static async getSelf() {
    if (!Peer.self) {
      Peer.self = (await this.tg.invoke({
        $t: "users_GetFullUserRequest",
        id: {
          $t: "InputUserSelf",
        },
      })) as UserFull;
    }

    return Peer.self;
  }

  public async fetchHistory({
    offsetId = 0,
    offsetDate = 0,
    addOffset = 0,
    limit = 20,
    minId = 0,
    maxId = 0,
  }: FetchHistoryInput = {}) {
    const history = (await this.tg.invoke({
      $t: "messages_GetHistoryRequest",
      offsetId,
      offsetDate,
      addOffset,
      limit,
      peer: getInputPeer(this.fields),
      hash: 0,
      maxId,
      minId,
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

    if (extraMessagesToFetch.length > 0) {
      await Message.bulkFetch(
        extraMessagesToFetch,
        this.isChannel() ? this._proxy : undefined
      );
    }

    return messages;
  }

  public getDialog() {
    return Dialog.get({
      peerId: this._proxy.id,
      peerType: this._proxy.type,
    });
  }

  public sendMessage({
    actualMedia,
    transientModel,
    ...message
  }: SimplifiedMessageRequest): [IMessage, Promise<any> | undefined, boolean] {
    let shouldCreateBubble = true;
    const randomId = transientModel
      ? transientModel.id
      : generateTransientId();
    const media =
      actualMedia || ("media" in message ? message.media : undefined);

    const messageModel =
      transientModel ||
      Message.fromObject({
        ...message,
        $t: "Message",
        date: Date.now() / 1000,
        id: randomId,
        toId: getPeer(this.fields),
        out: true,
        ...(media ? { media } : {}),
      });
    messageModel.justSent = true;
    messageModel.saveInMemory();

    let promise: Promise<any> | IMessage = messageModel;

    if (
      !("media" in message) ||
      message.media.$t !== "TransientMedia" ||
      transientModel
    ) {
      promise = this.tg
        .invoke({
          ...message,
          randomId,
          peer: getInputPeer(this.fields),
        } as any)
        .then((updates: AllUpdateTypes) => {
          transientIds.delete(randomId);

          return handleUpdate(updates, {
            transientMessage: {
              randomId,
              message: messageModel,
            },
          });
        });

      shouldCreateBubble = !transientModel;
    }

    return [messageModel, promise as Promise<IMessage>, shouldCreateBubble];
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
          channel: inputPeer as any,
        };
        break;
      case "User":
        input = {
          $t: "users_GetFullUserRequest",
          id: inputPeer as any,
        };
        break;
      case "Chat":
        input = {
          $t: "messages_GetFullChatRequest",
          chatId: this._proxy.id,
        };
        break;
    }

    const full = (await this.tg.invoke(input)) as messages_ChatFull | UserFull;
    if (full.$t === "UserFull") {
      this._proxy.full = full;
    } else {
      this._proxy.full = full.fullChat;
    }

    // TODO: Load all entities
    // for (const user of full.users) {
    // }

    this.save();
  }

  public isChat() {
    return this._proxy.$t === "Chat";
  }

  public isChannel() {
    return this._proxy.$t === "Channel";
  }

  public canSendMessage() {
    return (
      this.hasAllRights() ||
      (this._proxy.$t === "Channel" && !this._proxy.broadcast) ||
      this._proxy.$t === "Chat" ||
      (this._proxy.adminRights && this._proxy.adminRights.postMessages)
    );
  }

  public canSendPoll() {
    return (
      this.canSendMessage() &&
      (this._proxy.$t === "Channel" || this._proxy.$t === "Chat")
    );
  }

  public canDeleteMessage() {
    return (
      this.hasAllRights() ||
      (this._proxy.$t === "Channel" && !this._proxy.broadcast) ||
      this._proxy.$t === "Chat" ||
      (this._proxy.adminRights && this._proxy.adminRights.deleteMessages)
    );
  }

  public isGroupChat() {
    return (
      this._proxy.$t === "Chat" ||
      (this._proxy.$t === "Channel" && !this._proxy.broadcast)
    );
  }

  get displayName() {
    return getDialogDisplayName(this.fields);
  }

  get displayPeerName() {
    if (this._proxy.$t === "User" && this._proxy.isSelf) {
      return SELF_DIALOG_NAME;
    }

    return this.displayName;
  }

  private hasAllRights() {
    if (this.isChannel() || this.isChat()) {
      return this._proxy.creator;
    }

    return true;
  }
}
