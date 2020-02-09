import dayjs from "dayjs";
import {
  Dialog as TLDialog,
  messages_DialogsSlice,
  messages_GetDialogsRequest,
  messages_PeerDialogs
} from "../core/tl/TLObjects";
import { extractIdFromPeer, getInputPeer } from "../core/tl/utils";
import { getDialogDisplayDate, getMessageSummary } from "../utils/chat";
import { DBDialog, TelegramDatabase } from "../utils/db";
import {
  InputPeerTypes,
  IsTypingAction,
  TypingState
} from "../utils/useful-types";
import { IMessage, Message } from "./message";
import { Model, ModelDecorator, ModelKey, ModelWithProxy } from "./model";
import { IPeer, Peer } from "./peer";

interface ExtraMethods {
  getText(): Promise<string>;
  getDisplayDate(): Promise<string>;
  loadMessage(): Promise<IMessage>;
  getPeer(): Promise<IPeer | undefined>;
  setTyping(userId: number, action: IsTypingAction): void;
  startTyping(): void;
  getIsTyping(): TypingState[];
  clearTypingTimeout(userId: number): void;
  slient: boolean;
}

export type IDialog = ModelWithProxy<"dialogs"> & ExtraMethods;

@ModelDecorator({
  tableName: "dialogs",
  primaryKey: ["peerId", "type"]
})
export class Dialog extends Model<"dialogs"> implements ExtraMethods {
  static get: (id: ModelKey<"dialogs">) => Promise<undefined | IDialog>;
  static bulkGet: (
    id: ModelKey<"dialogs">[]
  ) => Promise<(undefined | IDialog)[]>;
  static table: TelegramDatabase["dialogs"];
  private isTypingTimeouts = new Map<number, number>();
  private isTyping: TypingState[] = [];

  protected prepareValues(
    object: DBDialog | { dialog: TLDialog; lastMessageDate: number }
  ) {
    if ("dialog" in object) {
      const { peer, ...dialog } = object.dialog;

      const { type, id } = extractIdFromPeer(peer);

      return {
        ...dialog,
        lastMessageDate: object.lastMessageDate,
        peerType: type,
        peerId: id
      };
    }

    return object;
  }

  static async fetch(offsetDialog?: IDialog): Promise<IDialog[]> {
    let offsetDate = 0;
    let offsetId = 0;
    let offsetPeer: messages_GetDialogsRequest["offsetPeer"] = {
      $t: "InputPeerEmpty"
    };

    if (offsetDialog) {
      const peer = await Peer.get({
        id: offsetDialog.peerId,
        type: offsetDialog.peerType
      });
      const message = await offsetDialog.loadMessage();
      offsetPeer = getInputPeer(peer);
      offsetId = message.id;
      offsetDate = message.date.unix();
    }

    const response = (await this.tg.invoke({
      $t: "messages_GetDialogsRequest",
      offsetDate,
      offsetId,
      offsetPeer,
      hash: 0,
      limit: 50
    })) as messages_DialogsSlice;

    for (const chat of response.chats) {
      Peer.fromObject(chat).save();
    }

    for (const user of response.users) {
      if (user.$t === "User" || user.$t === "UserEmpty") {
        Peer.fromObject(user).save();
      }
    }

    for (const message of response.messages) {
      // if (message.$t === "Message" || message.$t === "MessageEmpty") {
      Message.fromObject(message).save();
      // } else {
      // TODO: handle MessageService
      // console.debug("Unsupported message", message);
      // }
    }

    const dialogs = [];
    const messagesToFetch = [];

    for (const dialog of response.dialogs) {
      if (dialog.$t === "Dialog") {
        if (!Message.isInMemory(dialog.topMessage)) {
          messagesToFetch.push(dialog.topMessage);
        }
      }
    }

    // if (messagesToFetch.length > 0) {
    // console.log("messagesToFetch", messagesToFetch);
    // await this.fetchMessages(messagesToFetch);
    // }

    for (const dialog of response.dialogs) {
      if (dialog.$t === "Dialog") {
        const message = Message.getFromMemory({
          id: dialog.topMessage,
          isChannel: Number(dialog.peer.$t === "PeerChannel")
        }) as IMessage;
        if (!message) {
          continue;
        }
        const object = Dialog.fromObject({
          dialog,
          lastMessageDate: message.date.unix()
        });
        object.save();
        dialogs.push(object);
      }
    }

    return dialogs;
  }

  static async fetchByPeer(inputPeers: InputPeerTypes[]) {
    const peers = inputPeers.filter(({ $t }) => $t !== "InputPeerEmpty") as any;
    const response = (await this.tg.invoke({
      $t: "messages_GetPeerDialogsRequest",
      peers
    })) as messages_PeerDialogs;

    for (const chat of response.chats) {
      Peer.fromObject(chat).save();
    }

    for (const user of response.users) {
      if (user.$t === "User" || user.$t === "UserEmpty") {
        Peer.fromObject(user).save();
      }
    }

    for (const message of response.messages) {
      Message.fromObject(message).save();
    }

    const dialogs: IDialog[] = [];

    for (const dialog of response.dialogs) {
      if (dialog.$t === "Dialog") {
        const message = Message.getFromMemory({
          id: dialog.topMessage,
          isChannel: Number(dialog.peer.$t === "PeerChannel")
        }) as IMessage;
        if (!message) {
          continue;
        }
        const object = Dialog.fromObject({
          dialog,
          lastMessageDate: message.date.unix()
        });
        object.save();
        dialogs.push(object);
      }
    }

    return dialogs;
  }

  public async loadMessage() {
    return Message.get({
      id: this._proxy.topMessage,
      isChannel: Number(this._proxy.peerType === "Channel")
    });
  }

  public async getText() {
    const message = await this.loadMessage();

    if (!message) {
      return "";
    }

    return getMessageSummary(message);
  }

  public async getDisplayDate() {
    return getDialogDisplayDate(this._proxy.lastMessageDate);
  }

  public getPeer() {
    return Peer.get({
      type: this._proxy.peerType,
      id: this._proxy.peerId
    });
  }

  public setTyping(userId: number, action: IsTypingAction) {
    this.clearTypingTimeout(userId);

    this.isTyping.push({
      action,
      userId
    });

    this.broadcastTyping();
    this.isTypingTimeouts.set(
      userId,
      setTimeout(() => {
        this.clearTypingTimeout(userId);
        this.broadcastTyping();
      }, 5000)
    );
  }

  public getIsTyping() {
    return this.isTyping;
  }

  public async startTyping() {
    const peer = await this.getPeer();
    this.tg.invoke({
      $t: "messages_SetTypingRequest",
      peer: getInputPeer(peer),
      action: {
        $t: "SendMessageTypingAction"
      }
    });
  }

  public clearTypingTimeout(userId: number) {
    const timeout = this.isTypingTimeouts.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      this.isTypingTimeouts.delete(userId);
    }

    this.isTyping = this.isTyping.filter(typing => typing.userId !== userId);
  }

  get slient() {
    if (this.fields.notifySettings.$t === "PeerNotifySettings") {
      return dayjs(this.fields.notifySettings.muteUntil * 1000).isAfter(
        new Date()
      );
    }

    return false;
  }

  private broadcastTyping() {
    Dialog.events.emit("typing", {
      dialog: this._proxy
    });
  }
}
