import { TelegramClient } from "./core/TelegramClient";
import { DBSessionManager } from "./utils/session-manager";
import { Updates } from "./core/tl/TLObjects";
import { ClientProxiedMethods } from "./telegram-worker-proxy";

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
  update: Updates["updates"][0];
};

export type RequestEventData = ConnectRequestEvent | MethodRequestEvent;
export type ResponseEventData =
  | ConnectedEvent
  | MethodResponseEvent
  | UpdateEvent;

export type EventData = RequestEventData | ResponseEventData;

interface MessageEventWithData extends MessageEvent {
  data: RequestEventData;
}

addEventListener("message", ({ data }: MessageEventWithData) => {
  if (data.type === "connect_request") {
    connect(data.apiId, data.apiHash);
  }
});

async function connect(apiId: number, apiHash: string) {
  console.time("Telegram Connect");
  const manager = new DBSessionManager();
  // await db.sessions.put({
  //   dcId: 1,
  //   port: 443,
  //   authKey: [181, 85, 38, 115, 161, 252, 146, 212, 121, 199, 135, 133, 226, 119, 89, 153, 212, 185, 91, 38, 129, 208, 108, 245, 159, 147, 52, 111, 4, 89, 159, 170, 74, 137, 53, 58, 37, 96, 233, 57, 10, 109, 218, 83, 63, 251, 18, 50, 49, 240, 203, 96, 100, 119, 178, 212, 87, 95, 196, 120, 111, 245, 119, 84, 201, 222, 49, 206, 86, 61, 52, 121, 201, 26, 249, 233, 151, 118, 223, 188, 127, 127, 29, 57, 186, 223, 182, 95, 60, 39, 40, 210, 3, 242, 143, 125, 113, 20, 100, 236, 92, 131, 52, 220, 215, 67, 131, 57, 124, 218, 209, 179, 160, 195, 39, 165, 73, 68, 145, 85, 150, 46, 106, 181, 102, 71, 145, 104, 33, 64, 135, 9, 26, 27, 238, 249, 102, 186, 130, 211, 181, 235, 69, 53, 121, 132, 172, 120, 76, 89, 123, 232, 173, 77, 205, 103, 231, 101, 82, 195, 239, 213, 157, 214, 65, 149, 127, 0, 37, 75, 12, 203, 210, 58, 88, 156, 87, 129, 116, 154, 38, 47, 185, 73, 177, 136, 224, 88, 18, 219, 27, 230, 108, 254, 70, 147, 121, 40, 132, 173, 177, 2, 26, 15, 205, 208, 3, 241, 188, 168, 222, 170, 231, 66, 66, 241, 188, 138, 24, 42, 77, 222, 120, 116, 250, 238, 152, 232, 162, 169, 206, 4, 172, 60, 224, 130, 202, 144, 214, 206, 162, 241, 176, 144, 228, 120, 141, 137, 113, 30, 255, 85, 151, 18, 238, 237]
  // });
  // await db.configs.put({
  //   key: 'primaryDc',
  //   value: 1,
  // })
  const session = await manager.getDefaultSession();
  const tg = new TelegramClient(
    apiId,
    apiHash,
    manager,
    session,
    (update, short) => {
      postMessage({
        type: "update",
        short,
        update
      } as UpdateEvent);
    }
  );
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
