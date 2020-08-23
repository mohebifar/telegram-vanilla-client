// import "workbox-sw";

declare var self: ServiceWorkerGlobalScope;
// @ts-ignore
self.__WB_MANIFEST;

const STREAM_CHUNK_BIG_LIMIT = 700 * 1024 * 1024;
const STREAM_CHUNK_VIDEO = 256 * 1024;
const STREAM_CHUNK_VIDEO_BIG = 512 * 1024;
const STREAM_CHUNK_AUDIO = 1024 * 1024;

function parseRange(header: string): [number, number] {
  const [, chunks] = header.split("=");
  const ranges = chunks.split(", ");
  const [start, end] = ranges[0].split("-");

  return [+start, +end || 0];
}

function getOffsetLimit(start: number, end: number, chunk: number) {
  end = end > 0 && end < start + chunk - 1 ? end : start + chunk - 1;

  const offset = start;
  const limit = end - start + 1;

  return [offset, limit];
}

function getChunk(mimeType: string, size: number) {
  const isBigFile = size > STREAM_CHUNK_BIG_LIMIT;

  let chunk = isBigFile ? STREAM_CHUNK_VIDEO_BIG : STREAM_CHUNK_VIDEO;
  if (mimeType && mimeType.startsWith("audio")) {
    chunk = STREAM_CHUNK_AUDIO;
  }

  return chunk;
}

async function fetchStreamRequest(url: string, start: number, end: number) {
  const { searchParams } = new URL(url, "https://telegram.org");
  const fileId = searchParams.get("id");
  const size = parseInt(searchParams.get("size"), 10);
  const mimeType = searchParams.get("mime_type") || "video/mp4";

  // Safari workaround
  if (start === 0 && end === 1) {
    return new Response(new Uint8Array(2).buffer, {
      status: 206,
      statusText: "Partial Content",
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes 0-1/${size || "*"}`,
        "Content-Length": "2",
        "Content-Type": mimeType,
      },
    });
  }

  const chunk = getChunk(mimeType, size);
  const [offset, limit] = getOffsetLimit(start, end, chunk);

  try {
    const data = await getBufferFromClientAsync(
      fileId,
      offset,
      limit,
      start,
      end
    );

    const blob = new Blob([data], { type: mimeType });

    const headers = {
      "Accept-Ranges": "bytes",
      "Content-Range": `bytes ${offset}-${offset + blob.size - 1}/${size ||
        "*"}`,
      "Content-Length": `${blob.size}`,
      "Content-Type": mimeType,
    };

    return new Response(blob, {
      status: 206,
      statusText: "Partial Content",
      headers,
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 416,
      statusText: "Range Not Satisfiable",
    });
  }
}

self.addEventListener("fetch", (event) => {
  const [, url, scope] =
    /http[:s]+\/\/.*?(\/(.*?)\/.*$)/.exec(event.request.url) || [];

  switch (scope) {
    case "streaming": {
      const [start, end] = parseRange(event.request.headers.get("Range") || "");

      event.respondWith(fetchStreamRequest(url, start, end));
      break;
    }
  }
});

const queue = new Map<
  String,
  { resolve(buffer: ArrayBuffer): void; reject(error: Error): void }
>();

async function getBufferFromClientAsync(
  fileId: string,
  offset: number,
  limit: number,
  start: number,
  end: number
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const key = `${fileId}_${offset}_${limit}`;
    queue.set(key, { resolve, reject });
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          "@type": "getFile",
          fileId,
          offset,
          limit,
          start,
          end,
        });
      });
    });
  });
}

self.addEventListener("message", async (e) => {
  switch (e.data["@type"]) {
    case "getFileResult": {
      const { fileId, offset, limit, data } = e.data;
      const key = `${fileId}_${offset}_${limit}`;
      const request = queue.get(key);
      if (request) {
        queue.delete(key);

        const { resolve } = request;
        resolve(data);
      }
      break;
    }
    case "getFileError": {
      const { fileId, offset, limit, error } = e.data;
      const key = `${fileId}_${offset}_${limit}`;
      const request = queue.get(key);
      if (request) {
        queue.delete(key);

        const { reject } = request;
        reject(error);
      }
      break;
    }
  }
});

export default null;
