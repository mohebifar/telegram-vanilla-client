import {
  upload_GetFileRequest,
  upload_File,
  User,
  Channel,
  Chat,
  Photo,
  PhotoSize
} from "./tl/TLObjects";
import { TelegramClient } from "./TelegramClient";
import { getInputPeer } from "./tl/utils";
import { concatBuffers } from "../utils/binary";

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

  private generateKey(location: upload_GetFileRequest["location"]) {
    switch (location.$t) {
      case "InputPeerPhotoFileLocation":
        return `${location.localId},${location.volumeId}`;
      case "InputPhotoFileLocation":
        return String(location.id);
      default:
        return location.$t;
    }
  }

  public async download(
    request: upload_GetFileRequest,
    dcId: number,
    limit = 2
  ) {
    const key = this.generateKey(request.location);

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

    let file: upload_File;
    const bytesArray = [];
    wait.push(promise);

    await Promise.all(wait.filter(pro => pro !== promise));

    do {
      try {
        let send = this.client.invoke.bind(this.client);
        if (dcId !== this.client.session.dcId) {
          const sender = await this.client.borrowSender(dcId);
          send = sender.send.bind(sender);
        }

        file = await send(request);
        bytesArray.push(file.bytes);
        request.offset += file.bytes.length;
      } finally {
        wait.splice(wait.indexOf(promise), 1);
      }
    } while (request.offset < limit);

    r();

    const blob = new Blob([concatBuffers(bytesArray)], {
      type: getContentType(file.type)
    });

    if (this.cache) {
      this.cache.put(key, new Response(blob));
    }

    return URL.createObjectURL(blob);
  }

  public async downloadProfilePhoto(
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

  public async downloadMediaPhoto(photo: Photo) {
    // TODO: Not efficient
    const photoSizes = photo.sizes.filter(
      photoSize => photoSize.$t === "PhotoSize"
    ) as PhotoSize[];
    const size = ["x", "m", "s"].find(type =>
      photoSizes.find(size => size.type === type)
    );
    const photoSize =
      photoSizes.find(photoSize => photoSize.type === size) || photoSizes[0];

    if (!photoSize) {
      return undefined;
    }

    return this.download(
      {
        $t: "upload_GetFileRequest",
        limit: 32768,
        offset: 0,
        location: {
          $t: "InputPhotoFileLocation",
          fileReference: photo.fileReference,
          accessHash: photo.accessHash,
          thumbSize: photoSize.type,
          id: photo.id
        }
      },
      photo.dcId,
      photoSize.size
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
