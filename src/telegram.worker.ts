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

export type OutgoingEventData =
  | ConnectRequestEvent
  | MethodRequestEvent
  | CallbackReturnEvent;
export type IncomingEventData =
  | ConnectedEvent
  | MethodResponseEvent
  | CallbackResponseEvent
  | UpdateEvent;

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
  const tg = new TelegramClient(apiId, apiHash, manager, session, update => {
    postMessage({
      type: "update",
      update
    } as UpdateEvent);
  });
  await tg.connect();

  console.timeEnd("Telegram Connect");
  const callbacks = new Map<string, Function>();

  addEventListener("message", async ({ data }: MessageEventWithData) => {
    if (data.type === "method_request") {
      let result: any;
      let hasError = false;
      const callbackIds: string[] = [];

      const newArgs = data.args.map(arg => {
        if (typeof arg === "object" && arg.__ === "c" && arg.r) {
          return (args: any[]) =>
            new Promise(resolve => {
              postMessage({
                type: "callback",
                r: arg.r,
                result: args
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
        result = error;
        hasError = true;
      } finally {
        callbackIds.forEach(id => callbacks.delete(id));
        postMessage({
          type: "method",
          requestId: data.requestId,
          result,
          error: hasError
        } as MethodResponseEvent);
      }
    } else if (data.type === "callback_return") {
      const resolve = callbacks.get(data.r);
      if (resolve) {
        resolve(data.return);
      }
    }
  });

  postMessage({ type: "connected" } as ConnectedEvent);
}
