import { TelegramClientProxy } from "./telegram-worker-proxy";

export async function handleServiceWorkerMessage(event: MessageEvent) {
  switch (event.data["@type"]) {
    case "getFile": {
      const { fileId, offset, limit } = event.data;
      let [id, dcId, accessHash, reference] = fileId.split("_");
      const fileReference = new Uint8Array(reference.split(",").map(Number));

      // @ts-ignore
      const tg: TelegramClientProxy = window.tgProxy;

      try {
        const get = async (limit: number) => {
          try {
            return await tg.invoke(
              {
                $t: "upload_GetFileRequest",
                limit,
                offset,
                location: {
                  $t: "InputDocumentFileLocation",
                  accessHash,
                  fileReference,
                  id,
                  thumbSize: "",
                },
              },
              Number(dcId) || undefined
            );
          } catch (err) {
            if (err.message.startsWith("FILE_REFERENCE_")) {
              console.log("Need to update file reference");
              // get(limit);
            } else if (err.message.startsWith("LIMIT_")) {
              return get(limit / 2);
            }

            console.error(err, limit);
            throw err;
          }
        };

        const data = await get(limit);
        navigator.serviceWorker.controller.postMessage({
          "@type": "getFileResult",
          fileId,
          offset,
          limit,
          data: data.bytes,
        });
      } catch (error) {
        console.error(error);
        navigator.serviceWorker.controller.postMessage({
          "@type": "getFileError",
          fileId,
          offset,
          limit,
          error,
        });
      }
      break;
    }
  }
}
