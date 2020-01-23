import Dexie from "dexie";

export interface Session {
  dcId: number;
  port: number;
  authKey: number[];
}

export interface Config {
  key: string;
  value: any;
}

class TelegramDatabase extends Dexie {
  sessions: Dexie.Table<Session, number>;
  configs: Dexie.Table<Config, string>;

  static _singleton: TelegramDatabase;

  static get singleton() {
    TelegramDatabase._singleton =
      TelegramDatabase._singleton || new TelegramDatabase();
    return TelegramDatabase._singleton;
  }

  constructor() {
    super("Telegram");
    this.version(1).stores({
      sessions: "&dcId, port, authKey",
      configs: "&key, value"
    });

    this.sessions = this.table("sessions");
    this.configs = this.table("configs");
  }
}

export default TelegramDatabase.singleton;
