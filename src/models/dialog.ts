import { TelegramDatabase, DBDialog } from "../utils/db";
import { Model, ModelDecorator, ModelWithProxy, ModelKey } from "./model";
import {
  Dialog as TLDialog,
  messages_GetDialogsRequest,
  messages_DialogsSlice
} from "../core/tl/TLObjects";
import { simplifyPeerType, getInputPeer } from "../core/tl/utils";
import { Peer, IPeer } from "./peer";
import { Message, IMessage } from "./message";
import { getShortLastText, getDialogDisplayDate } from "../utils/chat";
import dayjs from "dayjs";

interface ExtraMethods {
  getText(): Promise<string>;
  getDisplayDate(): Promise<string>;
  loadMessage(): Promise<IMessage>;
  getPeer(): Promise<IPeer | undefined>;
  slient: boolean;
}

export type IDialog = ModelWithProxy<"dialogs"> & ExtraMethods;

@ModelDecorator({
  tableName: "dialogs",
  primaryKey: ["peerId", "type"]
})
export class Dialog extends Model<"dialogs"> {
  static get: (id: ModelKey<"dialogs">) => Promise<undefined | IDialog>;
  static bulkGet: (
    id: ModelKey<"dialogs">[]
  ) => Promise<(undefined | IDialog)[]>;
  static table: TelegramDatabase["dialogs"];

  protected prepareValues(
    object: DBDialog | { dialog: TLDialog; lastMessageDate: number }
  ) {
    if ("dialog" in object) {
      const { peer, ...dialog } = object.dialog;

      return {
        ...dialog,
        lastMessageDate: object.lastMessageDate,
        peerType: simplifyPeerType(peer.$t),
        peerId: peer[Dialog.getDialogPeerIdKey(peer)]
      };
    }

    return object;
  }

  static getDialogPeerIdKey(peer: TLDialog["peer"]) {
    switch (peer.$t) {
      case "PeerChannel":
        return "channelId";
      case "PeerChat":
        return "chatId";
      case "PeerUser":
        return "userId";
    }
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
      if (message.$t === "Message" || message.$t === "MessageEmpty") {
        Message.fromObject(message).save();
      } else {
        // TODO: handle MessageService
        console.debug("Unsupported message", message);
      }
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
        const message = Message.getFromMemory(dialog.topMessage) as IMessage;
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
    return Message.get(this._proxy.topMessage);
  }

  public async getText() {
    const message = await this.loadMessage();

    if (!message) {
      return "";
    }

    return getShortLastText(message);
  }

  public async getDisplayDate() {
    return getDialogDisplayDate(this.fields.lastMessageDate);
  }

  public getPeer() {
    return Peer.get({
      type: this._proxy.peerType,
      id: this._proxy.peerId
    });
  }

  get slient() {
    if (this.fields.notifySettings.$t === "PeerNotifySettings") {
      return dayjs(this.fields.notifySettings.muteUntil * 1000).isAfter(
        new Date()
      );
    }

    return false;
  }
}
