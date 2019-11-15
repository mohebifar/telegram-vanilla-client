import {
  upload_GetFileRequest,
  upload_File,
  User,
  Channel,
  Chat
} from "./tl/TLObjects";
import { TelegramClient } from "./TelegramClient";
import { getInputPeer } from "./tl/utils";

const CACHE_KEY = "TLFILE";

export class FileStorage {
  private cache: Cache;
  private waits: { [dcId: number]: Array<Promise<any> | undefined> } = {};

  constructor(private client: TelegramClient) {
    this.setupCache();
  }

  private async setupCache() {
    this.cache = await caches.open(CACHE_KEY);
  }

  private generateKey(volumeId: bigint, localId: number) {
    return `${localId},${volumeId}`;
  }

  public async download(request: upload_GetFileRequest, dcId: number) {
    const key = this.generateKey(
      (request.location as any).volumeId,
      (request.location as any).localId
    );

    if (!this.waits[dcId]) {
      this.waits[dcId] = [];
    }

    if (this.cache) {
      const match = await this.cache.match(key);
      if (match) {
        return URL.createObjectURL(await match.blob());
      }
    }

    let r: () => void;

    const wait = this.waits[dcId];

    const promise = new Promise(resolve => {
      r = resolve;
    });

    let file;

    try {
      wait.push(promise);

      await Promise.all(wait.filter(pro => pro !== promise));

      let send = this.client.invoke.bind(this.client);
      if (dcId !== this.client.session.dcId) {
        const sender = await this.client.borrowSender(dcId);
        send = sender.send.bind(sender);
      }

      console.log("download request", dcId);
      file = (await send(request)) as upload_File;
      console.log("download response", dcId, file);

      r();
    } finally {
      wait.splice(wait.indexOf(promise), 1);
      console.log("there are", wait.length, "waits after cleanup", dcId);
    }

    const blob = new Blob([file.bytes], {
      type: getContentType(file.type)
    });

    if (this.cache) {
      this.cache.put(key, new Response(blob));
      console.log("saved to localstorage", key);
    }

    const dataUri = URL.createObjectURL(blob);

    return dataUri;
  }

  public async getProfilePhoto(
    entity: User | Channel | Chat
  ): Promise<string | undefined> {
    if (
      !entity.photo ||
      (entity.photo.$t !== "UserProfilePhoto" &&
        entity.photo.$t !== "ChatPhoto")
    ) {
      return undefined;
    }

    const peer = getInputPeer(entity);

    return this.download(
      {
        $t: "upload_GetFileRequest",
        limit: 32768,
        offset: 0,
        location: {
          $t: "InputPeerPhotoFileLocation",
          localId: entity.photo.photoSmall.localId,
          volumeId: entity.photo.photoSmall.volumeId,
          peer
        }
      },
      entity.photo.dcId
    );
  }
}

function getContentType(type: upload_File["type"]) {
  switch (type.$t) {
    case "storage_FileJpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}
