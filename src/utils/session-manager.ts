import { MTSession, MTSessionManager } from "../core/mtproto/MTSessionManager";
import { AuthKey } from "../core/crypto/AuthKey";
import db, { Session } from "./db";

const dcToURL = [
  "",
  "pluto.web.telegram.org",
  "venus.web.telegram.org",
  "aurora.web.telegram.org",
  "vesta.web.telegram.org",
  "flora.web.telegram.org"
];

const defaultDc = 4;

export class DBSessionManager implements MTSessionManager {
  public async getDefaultSession() {
    const primaryDc = await db.configs.get("primaryDc");
    if (primaryDc && primaryDc.value) {
      const sessionData = await db.sessions.get(primaryDc.value);
      if (sessionData) {
        return this.makeSessionFromData(sessionData);
      }
    }
    return new DBSession(defaultDc);
  }

  public async getSessionByDc(dcId: number, port: number = undefined) {
    const sessionData = await db.sessions.get(dcId);
    if (sessionData) {
      return this.makeSessionFromData(sessionData);
    }

    return new DBSession(dcId, port);
  }

  public setDefaultDc(value: number) {
    return db.configs.put({ value, key: "primaryDc" });
  }

  private makeSessionFromData(sessionData: Session) {
    const session = new DBSession(sessionData.dcId, sessionData.port);
    session.authKey.setKey(new Uint8Array(sessionData.authKey));
    return session;
  }
}

class DBSession implements MTSession {
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
    db.sessions.put({
      authKey: this.authKey.toArray(),
      dcId: this.dcId,
      port: this.port
    });
  }
}
