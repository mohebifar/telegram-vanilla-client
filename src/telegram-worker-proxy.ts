import { FileStorage } from "./core/FileStorage";
import { TelegramClient } from "./core/TelegramClient";
import { AllUpdateTypes } from "./utils/useful-types";
import db from "./utils/db";
import { detectWebpSupport } from "webp-hero/dist/detect-webp-support";
import { decodeWebp } from "./utils/polyfill";

const clientProxiedMethods = <const>[
  "isUserAuthorized",
  "sendCodeRequest",
  "signInWithCode",
  "signInWithPassword",
  "signUp",
  "invoke",
];

const fileStorageProxiedMethods = <const>[
  "download",
  "downloadProfilePhoto",
  "downloadMedia",
  "downloadDocument",
  "upload",
  "documentIsCached",
  "assignUploadedFile",
];

export type ClientProxiedMethods = typeof clientProxiedMethods[number];
export type FileStorageProxiedMethods = typeof fileStorageProxiedMethods[number];

export interface FileStorageProxy
  extends Pick<FileStorage, FileStorageProxiedMethods> {}

export interface TelegramClientProxy
  extends Pick<TelegramClient, ClientProxiedMethods> {
  fileStorage: FileStorageProxy;
}

export async function makeProxy(
  apiId: number,
  apiHash: string,
  updateCallback: (update: AllUpdateTypes) => void
): Promise<[TelegramClientProxy, boolean, Promise<void>]> {
  const tgWorker = new Worker("./telegram.worker.ts", {
    type: "module",
  });
  const handlers = new Map<string, { resolve: Function; reject: Function }>();
  const callbacks = new Map<string, Function>();

  tgWorker.addEventListener("message", ({ data }: MessageEvent) => {
    if (data.type === "method" && handlers.has(data.requestId)) {
      const { resolve, reject } = handlers.get(data.requestId);

      if (data.error) {
        if (data.result.message) {
          const error = new Error(data.result.message);
          (error as any).code = data.result.code;
          reject(error);
        } else {
          reject(data.result);
        }
      } else {
        resolve(data.result);
      }
    } else if (data.type === "db") {
      db[data.table]
        [data.method](...data.args)
        .then((result: any) => {
          tgWorker.postMessage({
            type: "db",
            requestId: data.requestId,
            error: false,
            result,
          });
        })
        .catch((result: any) => {
          tgWorker.postMessage({
            type: "db",
            requestId: data.requestId,
            error: true,
            result,
          });
        });
    } else if (data.type === "callback") {
      const callback = callbacks.get(data.r);
      if (callback) {
        tgWorker.postMessage({
          type: "callback_return",
          r: data.r,
          return: callback(...data.result),
        });
      }
    } else if (data.type === "webp_request") {
      if (data.method === "detect") {
        detectWebpSupport().then((result) => {
          tgWorker.postMessage({
            type: "webp_response",
            requestId: data.requestId,
            return: result,
          });
        });
      } else if (data.method === "decode") {
        decodeWebp(data.args[0]).then((result) => {
          tgWorker.postMessage({
            type: "webp_response",
            requestId: data.requestId,
            return: result,
          });
        });
      }
    }
  });

  function proxyMethod(
    method: ClientProxiedMethods,
    args: any[],
    object: "client" | "fileStorage" = "client"
  ): Promise<any> {
    let requestId: string;
    do {
      requestId = Math.random()
        .toString(36)
        .slice(-5);
    } while (handlers.has(requestId));
    const callbackIds: string[] = [];

    return new Promise((resolve, reject) => {
      handlers.set(requestId, { resolve, reject });
      const newArgs = args.map((arg, i) => {
        if (typeof arg === "function") {
          const r = requestId + "_" + i;
          callbackIds.push(r);
          callbacks.set(r, arg);
          return { __: "c", r };
        }
        return arg;
      });

      tgWorker.postMessage({
        type: "method_request",
        requestId: requestId,
        args: newArgs,
        method,
        object,
      });
    })
      .then((result) => {
        callbackIds.forEach((id) => callbacks.delete(id));
        return result;
      })
      .catch((result) => {
        callbackIds.forEach((id) => callbacks.delete(id));
        throw result;
      });
  }

  const result: TelegramClientProxy = {
    ...makeMethodProxy<TelegramClient, ClientProxiedMethods>(
      clientProxiedMethods as any,
      proxyMethod,
      "client"
    ),
    fileStorage: makeMethodProxy<FileStorage, FileStorageProxiedMethods>(
      fileStorageProxiedMethods as any,
      proxyMethod,
      "fileStorage"
    ),
  };

  const count = await db.sessions.count();

  const connectPromise = new Promise<void>((resolve) => {
    tgWorker.addEventListener("message", ({ data }) => {
      if (data.type === "connected") {
        resolve();
      } else if (data.type === "update") {
        updateCallback(data.update);
      }
    });

    tgWorker.postMessage({
      type: "connect_request",
      apiId,
      apiHash,
    });
  });

  return [result, count === 0, connectPromise];
}

function makeMethodProxy<O extends Object, K extends keyof O>(
  methods: K[],
  methodProxy: Function,
  object: string
): Pick<O, K> {
  const result = {} as Pick<O, K>;
  for (const method of methods) {
    // @ts-ignore
    result[method] = (...args: any[]) => {
      return methodProxy(method, args, object);
    };
  }

  return result;
}
