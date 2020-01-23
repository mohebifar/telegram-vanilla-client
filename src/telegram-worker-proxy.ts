import { TelegramClient } from "./core/TelegramClient";
import { Updates } from "./core/tl/TLObjects";
import { FileStorage } from "./core/FileStorage";

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
  "downloadMedia"
];

export type ClientProxiedMethods = typeof clientProxiedMethods[number];
export type FileStorageProxiedMethods = typeof fileStorageProxiedMethods[number];

interface FileStorageProxy
  extends Pick<FileStorage, FileStorageProxiedMethods> {}

export interface TelegramClientProxy
  extends Pick<TelegramClient, ClientProxiedMethods> {
  fileStorage: FileStorageProxy;
}

export async function makeProxy(
  apiId: number,
  apiHash: string,
  updateCallback: (update: Updates["updates"][0], short: boolean) => void
): Promise<TelegramClientProxy> {
  const tgWorker = new Worker("./telegram.worker.ts", {
    type: "module"
  });
  let requestIds = new Set<string>();

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
    } while (requestIds.has(requestId));
    requestIds.add(requestId);

    return new Promise((resolve, reject) => {
      const listener = ({ data }: MessageEvent) => {
        if (data.type === "method" && data.requestId === requestId) {
          tgWorker.removeEventListener("message", listener);
          requestIds.delete(requestId);

          if (data.error) {
            reject(data.result);
          } else {
            resolve(data.result);
          }
        }
      };

      tgWorker.postMessage({
        type: "method_request",
        requestId: requestId,
        method,
        object,
        args
      });

      tgWorker.addEventListener("message", listener);
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
        updateCallback(data.update, data.short);
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
