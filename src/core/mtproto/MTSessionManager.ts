import { AuthKey } from "../crypto/AuthKey";

export interface MTSession {
  authKey: AuthKey;
  dcId: number;
  url: string;
  save(): void;
}

export interface MTSessionManager {
  getDefaultSession(): Promise<MTSession>;
  getSessionByDc(dcId: number, port?: number): Promise<MTSession>;
  setDefaultDc(dcId: number): Promise<any>;
  clearAll(): Promise<any>;
}
