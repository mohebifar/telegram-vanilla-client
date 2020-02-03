import { FileStorage } from "./core/FileStorage";
import { TelegramClient } from "./core/TelegramClient";
import { AllUpdateTypes } from "./utils/useful-types";
import db from "./utils/db";

const clientProxiedMethods = <const>[
  "isUserAuthorized",
  "sendCodeRequest",
  "signInWithCode",
  "signInWithPassword",
  "signUp",
  "invoke"
];

const fileStorageProxiedMethods = <const>[
  "download",
  "downloadProfilePhoto",
  "downloadMedia",
  "downloadDocument",
  "upload"
];

export type ClientProxiedMethods = typeof clientProxiedMethods[number];
export type FileStorageProxiedMethods = typeof fileStorageProxiedMethods[number];

export interface FileStorageProxy
  extends Pick<FileStorage, FileStorageProxiedMethods> {}

export interface TelegramClientProxy
  extends Pick<TelegramClient, ClientProxiedMethods> {
  fileStorage: FileStorageProxy;
}

export interface DBMethodProxy {}

export async function makeProxy(
  apiId: number,
  apiHash: string,
  updateCallback: (update: AllUpdateTypes) => void
): Promise<TelegramClientProxy> {
  const tgWorker = new Worker("./telegram.worker.ts", {
    type: "module"
  });
  const handlers = new Map<string, { resolve: Function; reject: Function }>();
  const callbacks = new Map<string, Function>();

  tgWorker.addEventListener("message", ({ data }: MessageEvent) => {
    if (data.type === "method" && handlers.has(data.requestId)) {
      const { resolve, reject } = handlers.get(data.requestId);

      if (data.error) {
        reject(data.result);
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
            result
          });
        })
        .catch((result: any) => {
          tgWorker.postMessage({
            type: "db",
            requestId: data.requestId,
            error: true,
            result
          });
        });
    } else if (data.type === "callback") {
      const callback = callbacks.get(data.r);
      if (callback) {
        tgWorker.postMessage({
          type: "callback_return",
          r: data.r,
          return: callback(data.result)
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
        object
      });
    })
      .then(result => {
        callbackIds.forEach(id => callbacks.delete(id));
        return result;
      })
      .catch(result => {
        callbackIds.forEach(id => callbacks.delete(id));
        throw result;
      });
  }

  return new Promise(resolve => {
    tgWorker.addEventListener("message", ({ data }) => {
      if (data.type === "connected") {
        document.getElementById("initial-loading").remove();

        resolve({
          ...makeMethodProxy<TelegramClient, ClientProxiedMethods>(
            clientProxiedMethods as any,
            proxyMethod,
            "client"
          ),
          fileStorage: makeMethodProxy<FileStorage, FileStorageProxiedMethods>(
            fileStorageProxiedMethods as any,
            proxyMethod,
            "fileStorage"
          )
        });
      } else if (data.type === "update") {
        updateCallback(data.update);
      }
    });

    tgWorker.postMessage({
      type: "connect_request",
      apiId,
      apiHash
    });
  });
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
