import { MTProtoSender } from "./mtproto/MTProtoSender";
import {
  InvokeWithLayerRequest,
  Config,
  CdnConfig,
  TLObjectTypes,
  auth_SentCode,
  DcOption,
  account_Password,
  auth_ExportedAuthorization,
  Updates,
  UpdatesCombined,
  UpdateShort,
  Authorization
  // auth_Authorization
} from "./tl/TLObjects";
import { AuthKey } from "./crypto/AuthKey";
import { MTSessionManager, MTSession } from "./mtproto/MTSessionManager";
import { RPCError, FloodWaitError } from "./mtproto/errors";
import { sleep } from "../utils/utils";
import { addKey } from "./crypto/RSA";
import { computeCheck } from "./extensions/Password";
import { FileStorage } from "./FileStorage";
import { EntityCache } from "./EntityCache";

const LAYER = 105;

const FILE_MIGRATE_PATTERN = /FILE_MIGRATE_(\d+)/;
const PHONE_MIGRATE_PATTERN = /PHONE_MIGRATE_(\d+)/;
const FLOOD_WAIT_PATTERN = /(FLOOD_TEST_PHONE_WAIT_|FLOOD_WAIT_)(\d+)/;

export class TelegramClient {
  private deviceModel: string = "Darwin";
  private systemVersion: string = "18.7.0";
  private appVersion: string = "1.10.8";
  private langCode = "en";
  private systemLangCode = "en";
  private phoneCodeHash: { [k: string]: string } = {};
  private config: Config;
  private cdnConfig: CdnConfig;
  private requestRetries = 5;
  private useIPv6 = false;
  private phoneNumber = "";
  private floodSleepLimit = 6000;
  private floodWaitedRequests = {};
  private authorized = false;
  private borrowedSenders = new Map<
    number,
    MTProtoSender | Promise<MTProtoSender>
  >();
  public fileStorage = new FileStorage(this);
  public entityCache = new EntityCache(this);

  // private config: any; // GetConfigRequest

  private initWith = (x: TLObjectTypes): InvokeWithLayerRequest => {
    return {
      $t: "InvokeWithLayerRequest",
      layer: LAYER,
      query: {
        $t: "InitConnectionRequest",
        apiId: this.apiId,
        deviceModel: this.deviceModel || "Unknown",
        systemVersion: this.systemVersion || "1.0",
        appVersion: this.appVersion || "1.0",
        langCode: this.langCode,
        langPack: "", // "langPacks are for official apps only"
        systemLangCode: this.systemLangCode,
        query: x as any,
        proxy: null // no proxies yet.
      }
    };
  };

  private sender: MTProtoSender;

  constructor(
    private apiId: number,
    private apiHash: string,
    public sessionManager: MTSessionManager,
    public session: MTSession,
    private updateCallback?: (
      update: Updates["updates"][0],
      short?: boolean
    ) => void
  ) {
    console.log("session", session);
    this.sender = new MTProtoSender(session, {
      // delay: this._retryDelay,
      autoReconnectCallback: () => {},
      authKeyCallback: this.authKeyCallback.bind(this),
      updateCallback: this.handleUpdate.bind(this)
    });
  }

  public async connect() {
    await this.sender.connect();

    await this.sender.send(
      this.initWith({
        $t: "help_GetConfigRequest"
      } as any)
    );
  }

  // endregion
  public async isUserAuthorized() {
    if (!this.authorized) {
      try {
        await this.invoke({ $t: "updates_GetStateRequest" });
        this.authorized = true;
      } catch (e) {
        this.authorized = false;
      }
    }

    return this.authorized;
  }

  private disconnect() {
    if (this.sender) {
      return this.sender.disconnect();
    }
  }

  public async sendCodeRequest(phoneNumber: string, forceSMS = false) {
    let result: auth_SentCode;
    let phoneCodeHash = this.phoneCodeHash[phoneNumber];

    if (!phoneCodeHash) {
      try {
        result = (await this.invoke({
          $t: "auth_SendCodeRequest",
          apiHash: this.apiHash,
          phoneNumber,
          apiId: this.apiId,
          settings: {
            $t: "CodeSettings"
          }
        })) as auth_SentCode;
      } catch (e) {
        if (e instanceof RPCError && e.message === "AUTH_RESTART") {
          result = await this.sendCodeRequest(phoneNumber, forceSMS);
          return result;
        }

        throw e;
      }

      // If we already sent a SMS, do not resend the code (hash may be empty)
      if (result && result.type.$t === "auth_SentCodeTypeSms") {
        forceSMS = false;
      }

      if (result.phoneCodeHash) {
        this.phoneCodeHash[phoneNumber] = phoneCodeHash = result.phoneCodeHash;
      }
    } else {
      forceSMS = true;
    }

    this.phoneNumber = phoneNumber;

    if (forceSMS) {
      result = (await this.invoke({
        $t: "auth_ResendCodeRequest",
        phoneNumber,
        phoneCodeHash
      })) as auth_SentCode;

      this.phoneCodeHash[phoneNumber] = result.phoneCodeHash;
    }

    return result;
  }

  public async signInWithCode(phoneCode: string) {
    const phoneCodeHash = this.phoneCodeHash[this.phoneNumber];

    return (await this.invoke({
      $t: "auth_SignInRequest",
      phoneNumber: this.phoneNumber,
      phoneCodeHash: phoneCodeHash,
      phoneCode
    })) as Authorization;
  }

  public async signInWithPassword(password: string) {
    const pwd = (await this.invoke({
      $t: "account_GetPasswordRequest"
    })) as account_Password;

    return (await this.invoke({
      $t: "auth_CheckPasswordRequest",
      password: await computeCheck(pwd, password)
    })) as Authorization;
  }

  public signUp(firstName: string, lastName: string): Promise<Authorization> {
    const phoneCodeHash = this.phoneCodeHash[this.phoneNumber];

    return this.invoke({
      $t: "auth_SignUpRequest",
      phoneNumber: this.phoneNumber,
      phoneCodeHash,
      firstName,
      lastName
    }) as any;
  }

  public async invoke(request: TLObjectTypes) {
    let attempt = 0;
    let error: Error;
    console.debug("=> Outgoing", request);

    if (request.constructorId in this.floodWaitedRequests) {
      const due = this.floodWaitedRequests[request.constructorId];
      const diff = Math.round(due - new Date().getTime() / 1000);
      if (diff <= 3) {
        delete this.floodWaitedRequests[request.constructorId];
      } else if (diff <= this.floodSleepLimit) {
        console.info(`Sleeping early for ${diff}s on flood wait`);
        await sleep(diff);
        delete this.floodWaitedRequests[request.constructorId];
      } else {
        throw new FloodWaitError(diff);
      }
    }

    for (attempt = 0; attempt < this.requestRetries; attempt++) {
      try {
        const result = await this.sender.send(request);

        return result;
      } catch (e) {
        if (e instanceof RPCError) {
          if (PHONE_MIGRATE_PATTERN.test(e.message)) {
            const matches = e.message.match(PHONE_MIGRATE_PATTERN);
            const dcId = Number(matches[1]);

            await this.switchDC(dcId);
            continue;
          } else if (FILE_MIGRATE_PATTERN.test(e.message)) {
            const matches = e.message.match(FILE_MIGRATE_PATTERN);
            const dcId = Number(matches[1]);
            await sleep(1000);

            // TODO: must resend the request to the new dc
            await this.borrowSender(dcId);
          } else if (FLOOD_WAIT_PATTERN.test(e.message)) {
            const matches = e.message.match(FLOOD_WAIT_PATTERN);
            const seconds = Number(matches[2]);
            if (seconds > 5) {
              error = e;
              break;
            }
            this.floodWaitedRequests[request.constructorId] =
              new Date().getTime() / 1000 + seconds;
            if (seconds <= this.floodSleepLimit) {
              console.info(`Sleeping for ${seconds}s on flood wait`);
              await sleep(seconds * 1000);
            } else {
              throw e;
            }
            continue;
          } else if (e.message === "") {
          }
          // Hanlde other RPCErrors
        }

        error = e;
      }
    }

    throw error;
  }

  private async switchDC(newDc: number) {
    console.info(`Reconnecting to new data center ${newDc}`);

    await sleep(1000);

    const dc = await this.findDC(newDc);
    if (dc === null) {
      return;
    }

    this.session = await this.sessionManager.getSessionByDc(newDc);
    await this.sessionManager.setDefaultDc(newDc);

    this.disconnect();
    await sleep(500);
    await this.connect();
  }

  public async borrowSender(dcId: number) {
    if (!this.borrowedSenders.has(dcId)) {
      const promise = this.createBorrowedSender(dcId);
      this.borrowedSenders.set(dcId, promise);
      const sender = await promise;
      this.borrowedSenders.set(dcId, sender);
    }

    return await this.borrowedSenders.get(dcId);
  }

  private async createBorrowedSender(dcId: number) {
    console.log('borrowing', dcId)
    const dc = await this.findDC(dcId);

    const auth = (await this.invoke({
      $t: "auth_ExportAuthorizationRequest",
      dcId
    })) as auth_ExportedAuthorization;

    const session = await this.sessionManager.getSessionByDc(dc.id);

    const sender = new MTProtoSender(session);
    await sender.connect();

    await sender.send(
      this.initWith({
        $t: "auth_ImportAuthorizationRequest",
        id: auth.id,
        bytes: auth.bytes
      })
    );

    session.save();

    return sender;
  }

  private async findDC(dcId: number, cdn = false): Promise<DcOption | null> {
    if (!this.config) {
      this.config = (await this.invoke({
        $t: "help_GetConfigRequest"
      })) as Config;
    }

    if (cdn && !this.cdnConfig) {
      this.cdnConfig = (await this.invoke({
        $t: "help_GetCdnConfigRequest"
      })) as CdnConfig;
      for (const pk of this.cdnConfig.publicKeys) {
        await addKey(pk.publicKey);
      }
    }

    for (const dc of this.config.dcOptions) {
      if (
        dc.id === dcId &&
        Boolean(dc.ipv6) === this.useIPv6 &&
        Boolean(dc.cdn) === cdn
      ) {
        return dc;
      }
    }

    return null;
  }

  private handleUpdate(update: Updates | UpdatesCombined | UpdateShort) {
    if (!this.updateCallback) {
      return;
    }
    if (update.$t === "Updates" || update.$t === "UpdatesCombined") {
      for (const individualUpdate of update.updates) {
        this.updateCallback(individualUpdate);
      }
    } else if (update.$t === "UpdateShort") {
      this.updateCallback(update.update, true);
    } else {
      this.updateCallback(update);
    }
  }

  private async authKeyCallback(authKey: AuthKey) {
    this.session.authKey = authKey;
    this.session.save();
  }
}
