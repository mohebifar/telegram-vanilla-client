import { MTSession, MTSessionManager } from "../mtproto/MTSessionManager";
import { AuthKey } from "../crypto/AuthKey";
import { DBSession, DBConfig } from "../../utils/db";

const dcToURL = [
  "",
  "pluto.web.telegram.org",
  "venus.web.telegram.org",
  "aurora.web.telegram.org",
  "vesta.web.telegram.org",
  "flora.web.telegram.org"
];

const defaultDc = 4;
const handlers = new Map<string, { resolve: Function; reject: Function }>();

addEventListener("message", ({ data }) => {
  if (data.type === "db" && handlers.has(data.requestId)) {
    const { resolve, reject } = handlers.get(data.requestId);
    if (data.error) {
      reject(data.result);
    } else {
      resolve(data.result);
    }
  }
});

function dbProxy(
  table: "configs",
  method: "get",
  ...args: any[]
): Promise<DBConfig>;

function dbProxy(
  table: "sessions",
  method: "get",
  ...args: any[]
): Promise<DBSession>;

function dbProxy(table: "configs", method: "put", ...args: any[]): Promise<any>;

function dbProxy(
  table: "sessions",
  method: "put",
  ...args: any[]
): Promise<any>;

function dbProxy<
  Table extends "configs" | "sessions",
  Method extends "get" | "put"
>(table: Table, method: Method, ...args: any[]) {
  let requestId: string;
  do {
    requestId = Math.random()
      .toString(36)
      .slice(-5);
  } while (handlers.has(requestId));

  return new Promise((resolve, reject) => {
    handlers.set(requestId, { resolve, reject });

    postMessage({
      type: "db",
      table,
      method,
      args,
      requestId
    });
  }) as Promise<any>;
}

export class DBSessionManager implements MTSessionManager {
  public async getDefaultSession() {
    const primaryDc = await dbProxy("configs", "get", "primaryDc");
    if (primaryDc && primaryDc.value) {
      const sessionData = await dbProxy("sessions", "get", primaryDc.value);
      if (sessionData) {
        return this.makeSessionFromData(sessionData);
      }
    }
    return new MTDBSession(defaultDc);
  }

  public async getSessionByDc(dcId: number, port: number = undefined) {
    const sessionData = await dbProxy("sessions", "get", dcId);
    if (sessionData) {
      return this.makeSessionFromData(sessionData);
    }

    return new MTDBSession(dcId, port);
  }

  public setDefaultDc(value: number) {
    return dbProxy("configs", "put", { value, key: "primaryDc" });
  }

  private makeSessionFromData(sessionData: DBSession) {
    const session = new MTDBSession(sessionData.dcId, sessionData.port);
    session.authKey.setKey(new Uint8Array(sessionData.authKey));
    return session;
  }
}

class MTDBSession implements MTSession {
  constructor(
    public dcId: number,
    private port: number = 443,
    public authKey: AuthKey = new AuthKey()
  ) {}

  public get url() {
    const scheme = this.port === 443 ? "wss" : "ws";

    return `${scheme}://${dcToURL[this.dcId]}/apiws`;
  }

  save() {
    if (!this.authKey) {
      return;
    }

    dbProxy("sessions", "put", {
      authKey: this.authKey.toArray(),
      dcId: this.dcId,
      port: this.port
    });
  }
}
