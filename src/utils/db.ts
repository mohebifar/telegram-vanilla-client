import Dexie from "dexie";
import {
  ChannelFull,
  ChatFull,
  Dialog as TLDialog,
  Message as TLMessage,
  messages_StickerSet,
  UserFull
} from "../core/tl/TLObjects";
import {
  AllDialogPeerTypes,
  DialogMessageTypes,
  MediaWithTransient
} from "./useful-types";

export interface DBConfig {
  key: string;
  value: any;
}

export interface DBSession {
  dcId: number;
  port: number;
  authKey: number[];
}

export type DBMessage = (
  | DialogMessageTypes
  | (Omit<TLMessage, "media"> & { media?: MediaWithTransient })
) & {
  channelId: number;
};

export type DBSharedMedia = TLMessage & {
  channelId?: number;
  peerType: DBPeer["type"];
  peerId: number;
};

export interface DBDialog extends Omit<TLDialog, "$t" | "peer"> {
  lastMessageDate: number;
  peerType: DBPeer["type"];
  peerId: number;
}

export interface DBPeerChat {
  type: "Chat";
  full?: ChatFull;
}

export interface DBPeerChannel {
  type: "Channel";
  full?: ChannelFull;
}

export interface DBPeerUser {
  type: "User";
  full?: UserFull;
}

export interface DBStickerSet
  extends Omit<messages_StickerSet, "documents" | "packs"> {
  documents?: messages_StickerSet["documents"];
  packs?: messages_StickerSet["packs"];
}

export type DBPeer = AllDialogPeerTypes &
  (DBPeerChat | DBPeerChannel | DBPeerUser);

export interface TelegramDatabaseTables {
  configs: Dexie.Table<DBConfig, string>;
  sessions: Dexie.Table<DBSession, number>;
  messages: Dexie.Table<
    DBMessage,
    {
      channelId: DBMessage["channelId"];
      id: number;
    }
  >;
  sharedMedia: Dexie.Table<
    DBSharedMedia,
    {
      peerType: DBPeer["type"];
      peerId: DBPeer["id"];
      id: number;
    }
  >;
  dialogs: Dexie.Table<
    DBDialog,
    {
      peerType: DBPeer["type"];
      peerId: number;
    }
  >;
  peers: Dexie.Table<
    DBPeer,
    {
      type: DBPeer["type"];
      id: number;
    }
  >;
  stickerSet: Dexie.Table<DBStickerSet, number>;
}

export class TelegramDatabase extends Dexie implements TelegramDatabaseTables {
  static _singleton: TelegramDatabase;
  public sessions: TelegramDatabaseTables["sessions"];
  public configs: TelegramDatabaseTables["configs"];
  public dialogs: TelegramDatabaseTables["dialogs"];
  public messages: TelegramDatabaseTables["messages"];
  public sharedMedia: TelegramDatabaseTables["sharedMedia"];
  public peers: TelegramDatabaseTables["peers"];
  public stickerSet: TelegramDatabaseTables["stickerSet"];

  static get singleton() {
    TelegramDatabase._singleton =
      TelegramDatabase._singleton || new TelegramDatabase();
    return TelegramDatabase._singleton;
  }

  constructor() {
    super("Telegram");
    this.version(1).stores({
      sessions: "&dcId",
      configs: "&key, value",
      messages: "[id+channelId], date, $t",
      sharedMedia: "[id+peerType+peerId]",
      peers: "[id+type]",
      dialogs: "[peerType+peerId], lastMessageDate",
      stickerSet: "set.id, set.installedDate"
    });

    this.sessions = this.table("sessions");
    this.configs = this.table("configs");
    this.messages = this.table("messages");
    this.sharedMedia = this.table("sharedMedia");
    this.dialogs = this.table("dialogs");
    this.peers = this.table("peers");
    this.stickerSet = this.table("stickerSet");
  }
}

export default TelegramDatabase.singleton;
