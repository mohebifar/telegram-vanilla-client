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

type ConnectedEvent = {
  type: "connected";
};

type MethodResponseEvent = {
  type: "method";
  requestId: string;
  result: any;
  error: boolean;
};

type UpdateEvent = {
  type: "update";
  short: boolean;
  update: AllUpdateTypes;
};

export type OutgoingEventData = ConnectRequestEvent | MethodRequestEvent;
export type IncomingEventData =
  | ConnectedEvent
  | MethodResponseEvent
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

  addEventListener("message", async ({ data }: MessageEventWithData) => {
    if (data.type === "method_request") {
      let result: any;
      let hasError = false;
      try {
        if (data.object === "client") {
          result = await (tg[data.method] as any)(...data.args);
        } else if (data.object === "fileStorage") {
          result = await (tg.fileStorage[data.method] as any)(...data.args);
        }
      } catch (error) {
        result = error;
        hasError = true;
      } finally {
        postMessage({
          type: "method",
          requestId: data.requestId,
          result,
          error: hasError
        } as MethodResponseEvent);
      }
    }
  });

  postMessage({ type: "connected" } as ConnectedEvent);
}
