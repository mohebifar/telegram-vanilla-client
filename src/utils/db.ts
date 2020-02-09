import Dexie from "dexie";
import {
  AllDialogPeerTypes,
  DialogMessageTypes,
  MediaWithTransient
} from "./useful-types";
import {
  Dialog as TLDialog,
  ChatFull,
  ChannelFull,
  UserFull,
  Message as TLMessage
} from "../core/tl/TLObjects";

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
  isChannel: number;
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

export type DBPeer = AllDialogPeerTypes &
  (DBPeerChat | DBPeerChannel | DBPeerUser);

export interface TelegramDatabaseTables {
  configs: Dexie.Table<DBConfig, string>;
  sessions: Dexie.Table<DBSession, number>;
  messages: Dexie.Table<
    DBMessage,
    {
      isChannel: DBMessage["isChannel"];
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
}

export class TelegramDatabase extends Dexie implements TelegramDatabaseTables {
  static _singleton: TelegramDatabase;
  public sessions: TelegramDatabaseTables["sessions"];
  public configs: TelegramDatabaseTables["configs"];
  public dialogs: TelegramDatabaseTables["dialogs"];
  public messages: TelegramDatabaseTables["messages"];
  public sharedMedia: TelegramDatabaseTables["sharedMedia"];
  public peers: TelegramDatabaseTables["peers"];

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
      messages: "[id+isChannel], date, $t",
      sharedMedia: "[id+peerType+peerId]",
      peers: "[id+type]",
      dialogs: "[peerType+peerId], lastMessageDate"
    });

    this.sessions = this.table("sessions");
    this.configs = this.table("configs");
    this.messages = this.table("messages");
    this.sharedMedia = this.table("sharedMedia");
    this.dialogs = this.table("dialogs");
    this.peers = this.table("peers");
  }
}

export default TelegramDatabase.singleton;
