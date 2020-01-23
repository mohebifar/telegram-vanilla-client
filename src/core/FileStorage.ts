import {
  photos_UpdateProfilePhotoRequest,
  upload_GetFileRequest,
  upload_File,
  messages_ChatFull,
  User,
  Channel,
  Chat,
  MessageMediaPhoto,
  Document,
  PhotoCachedSize,
  PhotoSizeEmpty,
  PhotoSize,
  PhotoStrippedSize,
  TLObjectTypes,
  Message,
  Photo,
  WebDocument,
  WebDocumentNoProxy,
  ChatFull,
  UserProfilePhoto,
  ChatPhoto,
  FileLocationToBeDeprecated,
  InputPeerPhotoFileLocation,
  UserProfilePhotoEmpty,
  ChatPhotoEmpty
} from "./tl/TLObjects";
import { TelegramClient } from "./TelegramClient";
import { concatBuffers } from "../utils/binary";
import { strippedPhotoToJpg } from "../utils/utils";
import { inflate } from "pako";

type PhotoSizesTypes =
  | PhotoSizeEmpty
  | PhotoSize
  | PhotoCachedSize
  | PhotoStrippedSize;

const CACHE_KEY_FILE = "FILE";
const CACHE_KEY_PHOTO = "PHOTO";
const CACHE_KEY_PROFILE = "PROFILE";
const CACHE_KEY_DOCUMENT = "DOCUMENT";
const MAX_RETRIES_PER_FILE = 5;

type CacheKey =
  | typeof CACHE_KEY_PROFILE
  | typeof CACHE_KEY_PHOTO
  | typeof CACHE_KEY_FILE
  | typeof CACHE_KEY_DOCUMENT;

export class FileStorage {
  private cache: Record<CacheKey, Cache>;
  private downloadQueue: {
    [dcId: number]: Array<Promise<any> | undefined>;
  } = {};

  constructor(private client: TelegramClient) {
    this.setupCache();
  }

  public async download(
    location: upload_GetFileRequest["location"],
    {
      dcId,
      fileSize,
      cacheKey = null,
      shouldInflate = false
    }: {
      dcId: number;
      fileSize?: number;
      cacheKey?: CacheKey;
      shouldInflate?: boolean;
    }
  ) {
    const key = this.generateKey(location);
    const cache = cacheKey && this.cache && this.cache[cacheKey];

    if (cache) {
      const match = await cache.match(key);
      if (match) {
        const url = URL.createObjectURL(await match.blob());
        console.debug("Cache hit", cacheKey, url);
        return url;
      }
    }

    const [promise, finish] = this.addToQueue(dcId);

    // Wait for other files to be downloaded
    await promise;

    const partSizeKb = getPartSize(fileSize || 64);
    const partSize = partSizeKb * 1024;
    const bytesArray = [];

    let offset = 0;
    let retries = 0;
    let file: upload_File;

    do {
      try {
        let send = this.client.invoke.bind(this.client);
        if (dcId !== this.client.session.dcId) {
          const sender = await this.client.borrowSender(dcId);
          send = sender.send.bind(sender);
        }

        file = await send({
          $t: "upload_GetFileRequest",
          limit: partSize,
          offset,
          location
        });
        bytesArray.push(file.bytes);
        offset += partSize;
      } catch {
        if (++retries > MAX_RETRIES_PER_FILE) {
          console.debug(`Retried downloading ${retries} times.`);
          finish();
          throw new Error(
            `Failed to download file after ${MAX_RETRIES_PER_FILE} tries.`
          );
        }
      }
    } while (
      (file && file.bytes.length !== 0) ||
      (fileSize && bytesArray.length * partSize < fileSize)
    );

    finish();

    const bytes = shouldInflate
      ? inflate(concatBuffers(bytesArray))
      : concatBuffers(bytesArray);

    const [blob, url] = this.generateBlobUrl(bytes, getContentType(file.type));

    if (cache) {
      cache.put(key, new Response(blob));
    }

    return url;
  }

  public async downloadProfilePhoto(
    entity: User | Channel | Chat | ChatFull | UserProfilePhoto | ChatPhoto,
    downloadBig = false
  ): Promise<string | undefined> {
    const thumb = downloadBig ? -1 : 0;
    let photo:
      | photos_UpdateProfilePhotoRequest
      | UserProfilePhoto
      | ChatPhoto
      | UserProfilePhotoEmpty
      | ChatPhotoEmpty;

    if (entity.$t === "UserProfilePhoto" || entity.$t === "ChatPhoto") {
      photo = entity;
    } else {
      if (entity.$t === "ChatFull") {
        if (entity.chatPhoto.$t !== "Photo") {
          return undefined;
        }

        return await this.downloadPhoto(entity.chatPhoto, thumb);
      }

      photo = entity.photo;
    }

    if (
      !photo ||
      (photo.$t !== "UserProfilePhoto" && photo.$t !== "ChatPhoto")
    ) {
      return undefined;
    }

    let dcId: number;
    let which: FileLocationToBeDeprecated;
    let loc: InputPeerPhotoFileLocation;

    dcId = photo.dcId;
    which = downloadBig ? photo.photoBig : photo.photoSmall;
    loc = {
      $t: "InputPeerPhotoFileLocation",
      peer: await this.client.entityCache.getInputEntity(entity),
      localId: which.localId,
      volumeId: which.volumeId,
      big: downloadBig
    };

    try {
      return this.download(loc, { dcId: dcId, cacheKey: CACHE_KEY_PROFILE });
    } catch (e) {
      if (e.message === "LOCATION_INVALID") {
        const ie = await this.client.entityCache.getInputEntity(entity);

        if (ie.$t === "InputPeerChannel") {
          const full = (await this.client.invoke({
            $t: "channels_GetFullChannelRequest",
            channel: ie as any
          })) as messages_ChatFull;

          if (full.fullChat.chatPhoto.$t === "PhotoEmpty") {
            return undefined;
          }

          return await this.downloadPhoto(full.fullChat.chatPhoto, thumb);
        } else {
          return null;
        }
      } else {
        throw e;
      }
    }
  }

  public async downloadMedia(
    message: Message | Message["media"] | WebDocument | WebDocumentNoProxy,
    thumb: PhotoSizesTypes | number = null
  ) {
    let media: TLObjectTypes;

    if (message.$t === "Message") {
      media = message.media;
    } else {
      media = message;
    }

    if (media.$t === "MessageMediaWebPage" && media.webpage.$t === "WebPage") {
      media = media.webpage.document || media.webpage.photo;
    }

    if (media.$t === "MessageMediaPhoto" || media.$t === "Photo") {
      return await this.downloadPhoto(media, thumb);
    } else if (media.$t === "MessageMediaDocument" || media.$t === "Document") {
      const document = media.$t === "Document" ? media : media.document;
      if (document.$t !== "Document") {
        return undefined;
      }
      return await this.downloadDocument(document, thumb, document.dcId);
    } else if (media.$t === "MessageMediaContact" && thumb == null) {
      // return this.downloadContact(media);
    } else if (
      (media.$t === "WebDocument" || media.$t === "WebDocumentNoProxy") &&
      thumb == null
    ) {
      // return await this.downloadWebDocument(media);
    }

    return undefined;
  }

  private async downloadDocument(
    document: Document,
    thumb: PhotoSizesTypes | number,
    dcId?: number
  ) {
    let size: PhotoSizesTypes;

    if (thumb === null || thumb === undefined) {
      size = null;
    } else {
      size = getThumb(document.thumbs, thumb);
      if (size.$t === "PhotoCachedSize" || size.$t === "PhotoStrippedSize") {
        return this.downloadCachedPhotoSize(size);
      }
    }
    const shouldInflate = document.mimeType === "application/x-tgsticker";
    const result = await this.download(
      {
        $t: "InputDocumentFileLocation",
        id: document.id,
        accessHash: document.accessHash,
        fileReference: document.fileReference,
        thumbSize: size ? size.type : ""
      },
      {
        fileSize: size && "size" in size ? size.size : document.size,
        cacheKey: CACHE_KEY_DOCUMENT,
        dcId,
        shouldInflate
      }
    );
    return result;
  }

  private downloadPhoto(
    messageMediaPhoto: MessageMediaPhoto | Photo,
    thumb: PhotoSizesTypes | number
  ): Promise<undefined | string> | string | undefined {
    const photo =
      messageMediaPhoto.$t === "MessageMediaPhoto"
        ? messageMediaPhoto.photo
        : messageMediaPhoto;

    if (photo.$t !== "Photo") {
      return undefined;
    }

    const size = getThumb(photo.sizes, thumb);
    if (!size || size.$t === "PhotoSizeEmpty") {
      return undefined;
    }

    if (size.$t === "PhotoCachedSize" || size.$t === "PhotoStrippedSize") {
      return this.downloadCachedPhotoSize(size);
    }

    return this.download(
      {
        $t: "InputPhotoFileLocation",
        id: photo.id,
        accessHash: photo.accessHash,
        fileReference: photo.fileReference,
        thumbSize: size.type
      },
      {
        dcId: photo.dcId,
        fileSize: size.size,
        cacheKey: CACHE_KEY_PHOTO
      }
    );
  }

  private downloadCachedPhotoSize(size: PhotoStrippedSize | PhotoCachedSize) {
    const [, url] = this.generateBlobUrl(
      size.$t === "PhotoStrippedSize"
        ? strippedPhotoToJpg(size.bytes)
        : size.bytes
    );

    return url;
  }

  private addToQueue(dcId: number): [Promise<any>, () => void] {
    if (!this.downloadQueue[dcId]) {
      this.downloadQueue[dcId] = [];
    }
    let r: () => void;

    const wait = this.downloadQueue[dcId];

    const promise = new Promise(resolve => {
      r = resolve;
    });
    wait.push(promise);

    return [
      Promise.all(wait.filter(pro => pro !== promise)),
      () => {
        wait.splice(wait.indexOf(promise), 1);
        r();
      }
    ];
  }

  private generateBlobUrl(
    bytes: Uint8Array,
    type: string = "image/jpeg"
  ): [Blob, string] {
    const blob = new Blob([bytes], { type });

    return [blob, URL.createObjectURL(blob)];
  }

  private generateKey(location: upload_GetFileRequest["location"]) {
    switch (location.$t) {
      case "InputPeerPhotoFileLocation":
        return `${location.localId},${location.volumeId}`;
      case "InputPhotoFileLocation":
      case "InputDocumentFileLocation":
        return `${location.constructorId}_${String(location.id)}`;
      default:
        return location.$t;
    }
  }

  private async setupCache() {
    this.cache = {
      [CACHE_KEY_FILE]: await caches.open(CACHE_KEY_FILE),
      [CACHE_KEY_PHOTO]: await caches.open(CACHE_KEY_PHOTO),
      [CACHE_KEY_PROFILE]: await caches.open(CACHE_KEY_PROFILE),
      [CACHE_KEY_DOCUMENT]: await caches.open(CACHE_KEY_DOCUMENT)
    };
  }
}

function getThumb(thumbs: PhotoSizesTypes[], thumb: PhotoSizesTypes | number) {
  if (thumb === null || thumb === undefined) {
    return thumbs[thumbs.length - 1];
  } else if (typeof thumb === "number") {
    return thumbs[thumb];
  } else if (
    thumb.$t === "PhotoSize" ||
    thumb.$t === "PhotoCachedSize" ||
    thumb.$t === "PhotoStrippedSize"
  ) {
    return thumb;
  } else {
    return null;
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

function getPartSize(fileSize: number) {
  if (fileSize <= 104857600) {
    // 100MB
    return 128;
  }
  if (fileSize <= 786432000) {
    // 750MB
    return 256;
  }
  if (fileSize <= 1572864000) {
    // 1500MB
    return 512;
  }

  throw new Error("File size too large");
}
