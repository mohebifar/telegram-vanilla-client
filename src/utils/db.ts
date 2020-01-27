import Dexie from "dexie";
import { AllDialogPeerTypes, DialogMessageTypes } from "./useful-types";
import { Dialog as TLDialog } from "../core/tl/TLObjects";

export interface DBConfig {
  key: string;
  value: any;
}

export interface DBSession {
  dcId: number;
  port: number;
  authKey: number[];
}

export type DBMessage = DialogMessageTypes;

export interface DBDialog extends Omit<TLDialog, "$t" | "peer"> {
  lastMessageDate: number;
  peerType: DBPeer["type"];
  peerId: number;
}

export type DBPeer = AllDialogPeerTypes & {
  type: "Chat" | "Channel" | "User";
};

export interface TelegramDatabaseTables {
  configs: Dexie.Table<DBConfig, string>;
  sessions: Dexie.Table<DBSession, number>;
  messages: Dexie.Table<DBMessage, number>;
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
      messages: "id, date, $t",
      peers: "[id+type]",
      dialogs: "[peerType+peerId], lastMessageDate"
    });

    this.sessions = this.table("sessions");
    this.configs = this.table("configs");
    this.messages = this.table("messages");
    this.dialogs = this.table("dialogs");
    this.peers = this.table("peers");
  }
}

export default TelegramDatabase.singleton;
