import setupShims from "./utils/shims";
import { TelegramClient } from "./core/TelegramClient";
import { ClientProxiedMethods } from "./telegram-worker-proxy";
import { DBSessionManager } from "./core/extensions/SessionManager";
import { AllUpdateTypes } from "./utils/useful-types";

type ConnectRequestEvent = {
  type: "connect_request";
  apiId: number;
  apiHash: string;
};

type MethodRequestEvent = {
  type: "method_request";
  requestId: string;
  object: "client" | "fileStorage";
  method: ClientProxiedMethods;
  args: any[];
};

type CallbackReturnEvent = {
  type: "callback_return";
  r: string;
  return: any;
};

type ConnectedEvent = {
  type: "connected";
};

type MethodResponseEvent = {
  type: "method";
  requestId: string;
  result: any;
  error: boolean;
};

type CallbackResponseEvent = {
  type: "callback";
  r: string;
  args: any[];
};

type UpdateEvent = {
  type: "update";
  short: boolean;
  update: AllUpdateTypes;
};

type WebpRequest = {
  type: "webp_request";
  requestId: number;
  method: "detect" | "decode";
  args: any[];
};

type WebpResponseEvent = {
  type: "webp_response";
  requestId: number;
  return: any;
};

export type OutgoingEventData =
  | ConnectRequestEvent
  | MethodRequestEvent
  | CallbackReturnEvent
  | WebpResponseEvent;
export type IncomingEventData =
  | ConnectedEvent
  | MethodResponseEvent
  | CallbackResponseEvent
  | UpdateEvent
  | WebpRequest;

export type EventData = OutgoingEventData | IncomingEventData;

interface MessageEventWithData extends MessageEvent {
  data: OutgoingEventData;
}

addEventListener("message", ({ data }: MessageEventWithData) => {
  if (data.type === "connect_request") {
    connect(data.apiId, data.apiHash);
  }
});

async function connect(apiId: number, apiHash: string) {
  setupShims();

  console.time("Telegram Connect");
  const manager = new DBSessionManager();

  const session = await manager.getDefaultSession();
  const tg = new TelegramClient(apiId, apiHash, manager, session, (update) => {
    postMessage({
      type: "update",
      update,
    } as UpdateEvent);
  });
  await tg.connect();

  console.timeEnd("Telegram Connect");
  const callbacks = new Map<string, Function>();
  const webpRequests = new Map<number, Function>();

  tg.fileStorage.decodeWebp = webpDecodeMethodFactor(webpRequests);

  addEventListener("message", async ({ data }: MessageEventWithData) => {
    if (data.type === "method_request") {
      let result: any;
      let hasError = false;
      const callbackIds: string[] = [];

      const newArgs = data.args.map((arg) => {
        if (typeof arg === "object" && arg.__ === "c" && arg.r) {
          return (...args: any[]) =>
            new Promise((resolve) => {
              postMessage({
                type: "callback",
                r: arg.r,
                result: args,
              });
              callbacks.set(arg.r, resolve);
              callbackIds.push(arg.r);
            });
        }
        return arg;
      });

      try {
        if (data.object === "client") {
          result = await (tg[data.method] as any)(...newArgs);
        } else if (data.object === "fileStorage") {
          result = await (tg.fileStorage[data.method] as any)(...newArgs);
        }
      } catch (error) {
        const code = (error as any).code;
        result =
          error instanceof Error
            ? { message: error.message, code }
            : String(error);
        hasError = true;
        console.error(error);
      }

      callbackIds.forEach((id) => callbacks.delete(id));
      postMessage({
        type: "method",
        requestId: data.requestId,
        result,
        error: hasError,
      } as MethodResponseEvent);
    } else if (data.type === "callback_return") {
      const resolve = callbacks.get(data.r);
      if (resolve) {
        resolve(data.return);
      }
    } else if (data.type === "webp_response") {
      const resolver = webpRequests.get(data.requestId);
      if (resolver) {
        resolver(data.return);
      }
    }
  });

  postMessage({ type: "connected" } as ConnectedEvent);
}

function webpDecodeMethodFactor(webpRequests: Map<number, Function>) {
  let webpRequestId = 0;
  let supportsWebp: boolean | null = null;
  let detectWebpSupport: Promise<boolean>;

  return async (data: Uint8Array) => {
    if (supportsWebp === null) {
      if (detectWebpSupport) {
        supportsWebp = await detectWebpSupport;
      } else {
        const requestId = webpRequestId++;
        detectWebpSupport = new Promise((resolve) =>
          webpRequests.set(requestId, resolve)
        );
        postMessage({
          type: "webp_request",
          method: "detect",
          requestId,
          args: [],
        } as WebpRequest);
        supportsWebp = await detectWebpSupport;
      }
    }

    if (supportsWebp) {
      return data;
    }

    const requestId = webpRequestId++;
    const decodePromise = new Promise<Uint8Array>((resolve) =>
      webpRequests.set(requestId, resolve)
    );
    postMessage({
      type: "webp_request",
      method: "decode",
      requestId,
      args: [data],
    } as WebpRequest);
    return decodePromise;
  };
}
