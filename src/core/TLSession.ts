import { AuthKey } from "./crypto/AuthKey";
import { DcOption } from "./tl/TLObjects";

const CACHE_KEY = "TLSESSION";

const dcToURL = [
  "",
  "pluto.web.telegram.org",
  "venus.web.telegram.org",
  "aurora.web.telegram.org",
  "vesta.web.telegram.org",
  "flora.web.telegram.org"
];
export class TLSession {
  private _authKey: AuthKey;
  public port = 443;
  public host = "149.154.167.51";
  public dcId = 4;

  constructor(private isDefault = false) {
    this._authKey = new AuthKey();
  }

  get authKey() {
    return this._authKey;
  }

  set authKey(value) {
    if (value) {
      this._authKey = value;
    } else {
      this._authKey = new AuthKey();
    }
  }

  get url() {
    const scheme = this.port === 443 ? "wss" : "ws";

    return `${scheme}://${dcToURL[this.dcId]}/apiws`;
  }

  get cacheKey() {
    let key = `${CACHE_KEY}`;
    if (!this.isDefault) {
      key += `_${this.dcId}`;
    }

    return key;
  }

  public setDC(dcId: number, host: string, port: number) {
    this.dcId = dcId | 0;
    this.host = host;
    this.port = port;
  }

  toJSON() {
    return {
      authKey: this._authKey,
      host: this.host,
      port: this.port,
      dcId: this.dcId
    };
  }

  public save() {
    localStorage.setItem(this.cacheKey, JSON.stringify(this));
  }

  static setFromCache(session: TLSession, cachedData: string) {
    const { authKey, host, port, dcId } = JSON.parse(cachedData);

    session.authKey = new AuthKey();
    if (authKey) {
      session.authKey.setKey(new Uint8Array(authKey));
    }

    session.host = host;
    session.port = port;
    session.dcId = dcId;
  }

  static loadSession() {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const session = new TLSession(true);

    if (cachedData) {
      TLSession.setFromCache(session, cachedData);
    }

    return session;
  }

  static fromDc(dc: DcOption) {
    // TODO: duplicate code as cacheKey
    const key = `${CACHE_KEY}_${dc.id}`;
    const cachedData = localStorage.getItem(key);

    const session = new TLSession(false);

    if (cachedData) {
      TLSession.setFromCache(session, cachedData);
    } else {
      session.host = dc.ipAddress;
      session.dcId = dc.id;
      session.port = dc.port;
    }

    return session;
  }
}
