import { BigInteger as JBigInt } from "big-integer";
import { inflate } from "pako";
import { MD5 } from "spu-md5";
import { concatBuffers, generateRandomLong, readBufferFromHex } from "./binary";
import { TelegramClient } from "./TelegramClient";
import {
  Channel,
  Chat,
  ChatFull,
  ChatPhoto,
  ChatPhotoEmpty,
  Document,
  FileLocationToBeDeprecated,
  InputDocumentFileLocation,
  InputFile,
  InputPeerPhotoFileLocation,
  Message,
  MessageMediaPhoto,
  messages_ChatFull,
  Photo,
  PhotoCachedSize,
  PhotoSize,
  PhotoSizeEmpty,
  PhotoStrippedSize,
  photos_UpdateProfilePhotoRequest,
  TLObjectTypes,
  upload_File,
  upload_GetFileRequest,
  User,
  UserProfilePhoto,
  UserProfilePhotoEmpty,
  WebDocument,
  WebDocumentNoProxy,
  InputPhotoFileLocation,
} from "./tl/TLObjects";
import { getInputPeer } from "./tl/utils";

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

type ProgressCallback = (progress: number) => any;

export class FileStorage {
  private cache: Record<CacheKey, Cache>;
  private downloadQueue: {
    [dcId: number]: Array<Promise<any> | undefined>;
  } = {};
  private uploadedFiles = new Map<string, Blob | null>();

  constructor(private client: TelegramClient) {
    this.setupCache();
  }

  public async upload(
    buffer: ArrayBuffer,
    onProgress?: ProgressCallback
  ): Promise<InputFile> {
    const bytes = new Uint8Array(buffer);
    let fileId: string;
    do {
      fileId = generateRandomLong().toString();
    } while (this.uploadedFiles.has(fileId.toString()));
    this.uploadedFiles.set(fileId, null);

    const partSize = (getPartSize(bytes.length) / 4) * 1024;
    const numberOfParts = Math.ceil(bytes.length / partSize);
    let filePart = 0;
    let retries = 0;
    while (filePart < numberOfParts && retries < 5) {
      const index = filePart * partSize;
      try {
        await this.client.invoke({
          $t: "upload_SaveFilePartRequest",
          bytes: bytes.slice(index, index + partSize),
          fileId,
          filePart,
        });
        filePart++;
        if (onProgress) {
          onProgress(Math.min((filePart * partSize) / bytes.length, 1));
        }
      } catch {
        retries++;
      }
    }

    this.uploadedFiles.set(fileId, new Blob([buffer]));

    return {
      $t: "InputFile",
      id: fileId,
      parts: numberOfParts,
      name: "test.jpg",
      md5Checksum: MD5.process(bytes).toString(),
    };
  }

  public getUploadedFile(uploadId: JBigInt) {
    return this.uploadedFiles.get(uploadId.toString());
  }

  public async download(
    location: upload_GetFileRequest["location"],
    {
      dcId,
      fileSize,
      cacheKey = null,
      shouldInflate = false,
      onProgress,
    }: {
      dcId: number;
      fileSize?: number;
      cacheKey?: CacheKey;
      shouldInflate?: boolean;
      onProgress?: ProgressCallback;
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

    const partSizeKb = getPartSize(fileSize || 64);
    const partSize = partSizeKb * 1024;
    const bytesArray = [];

    let offset = 0;
    let retries = 0;
    let file: upload_File;

    const sender = await this.client.borrowSender(
      dcId || this.client.session.dcId
    );
    const send = sender.send.bind(sender);

    let aborted = false;
    // Wait for other files to be downloaded
    await promise;

    do {
      try {
        file = await send({
          $t: "upload_GetFileRequest",
          limit: partSize,
          offset,
          location,
        });
        bytesArray.push(file.bytes);
        offset += partSize;

        if (onProgress) {
          const shouldContinue = await onProgress(
            fileSize && offset / fileSize
          );
          if (shouldContinue === false) {
            aborted = true;
            break;
          }
        }
      } catch (err) {
        console.error({
          limit: partSize,
          offset,
          location,
        });

        console.error(err);
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
      // || (!file && !fileSize)
    );

    finish();

    if (aborted) {
      return undefined;
    }

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
      peer: await getInputPeer(entity),
      localId: which.localId,
      volumeId: which.volumeId,
      big: downloadBig,
    };

    try {
      return this.download(loc, { dcId: dcId, cacheKey: CACHE_KEY_PROFILE });
    } catch (e) {
      if (e.message === "LOCATION_INVALID") {
        const ie = await getInputPeer(entity);

        if (ie.$t === "InputPeerChannel") {
          const full = (await this.client.invoke({
            $t: "channels_GetFullChannelRequest",
            channel: ie as any,
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
    thumb: PhotoSizesTypes | number = null,
    onProgress?: ProgressCallback
  ) {
    let media: TLObjectTypes;

    if (message.$t === "Message") {
      media = message.media;
    } else {
      media = message;
    }

    if (media.$t === "MessageMediaWebPage" && media.webpage.$t === "WebPage") {
      media = media.webpage.photo || media.webpage.document;
      if (!media) {
        return undefined;
      }
    }

    if (media.$t === "MessageMediaPhoto" || media.$t === "Photo") {
      return await this.downloadPhoto(media, thumb, onProgress);
    } else if (media.$t === "MessageMediaDocument" || media.$t === "Document") {
      const document = media.$t === "Document" ? media : media.document;
      if (document.$t !== "Document") {
        return undefined;
      }
      return await this.downloadDocument(
        document,
        thumb,
        document.dcId,
        onProgress
      );
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

  public async downloadDocument(
    document: Document,
    thumb?: PhotoSizesTypes | number,
    dcId?: number,
    onProgress?: ProgressCallback
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
      this.getDocumentLocation(document, size),
      {
        fileSize: size && "size" in size ? size.size : document.size,
        cacheKey: CACHE_KEY_DOCUMENT,
        dcId,
        shouldInflate,
        onProgress,
      }
    );
    return result;
  }

  public assignUploadedFile(media: Message["media"], fileId: string) {
    const blob = this.uploadedFiles.get(fileId);
    if (media.$t === "MessageMediaPhoto" && media.photo.$t === "Photo") {
      media.photo.sizes.forEach((size) => {
        if (size.$t === "PhotoSize") {
          this.cache.PHOTO.put(
            this.generateKey(this.getPhotoLocation(media.photo as Photo, size)),
            new Response(blob)
          );
        }
      });
    }

    if (
      media.$t === "MessageMediaDocument" &&
      media.document.$t === "Document"
    ) {
      const sizes = [
        undefined,
        ...((media.document.thumbs &&
          media.document.thumbs.filter((thumb) => thumb.$t === "PhotoSize")) ||
          []),
      ];
      sizes.forEach((size) => {
        this.cache.DOCUMENT.put(
          this.generateKey(this.getDocumentLocation(media.document as Document, size)),
          new Response(blob)
        );
      });
    }
  }

  public async documentIsCached(document: Document, size?: PhotoSizesTypes) {
    const location = this.getDocumentLocation(document, size);
    const key = this.generateKey(location);
    const cache = this.cache && this.cache[CACHE_KEY_DOCUMENT];

    if (cache && (await cache.match(key))) {
      return true;
    }

    return false;
  }

  private downloadPhoto(
    messageMediaPhoto: MessageMediaPhoto | Photo,
    thumb: PhotoSizesTypes | number,
    onProgress?: ProgressCallback
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

    return this.download(this.getPhotoLocation(photo, size), {
      dcId: photo.dcId,
      fileSize: size.size,
      cacheKey: CACHE_KEY_PHOTO,
      onProgress,
    });
  }

  private downloadCachedPhotoSize(size: PhotoStrippedSize | PhotoCachedSize) {
    const bytes =
      size.$t === "PhotoStrippedSize"
        ? strippedPhotoToJpg(size.bytes)
        : size.bytes;
    const [, url] = this.generateBlobUrl(bytes);

    return url;
  }

  private addToQueue(dcId: number): [Promise<any>, () => void] {
    if (!this.downloadQueue[dcId]) {
      this.downloadQueue[dcId] = [];
    }
    let r: () => void;

    const wait = this.downloadQueue[dcId];

    const promise = new Promise((resolve) => {
      r = resolve;
    });
    wait.push(promise);

    return [
      Promise.all(wait.filter((pro) => pro !== promise)),
      () => {
        wait.splice(wait.indexOf(promise), 1);
        r();
      },
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
        return `${location.localId},${location.volumeId.toString()}`;
      case "InputPhotoFileLocation":
      case "InputDocumentFileLocation":
        return `${location.$t}_${location.thumbSize},${location.id.toString()}`;
      default:
        return location.$t;
    }
  }

  private async setupCache() {
    this.cache = {
      [CACHE_KEY_FILE]: await caches.open(CACHE_KEY_FILE),
      [CACHE_KEY_PHOTO]: await caches.open(CACHE_KEY_PHOTO),
      [CACHE_KEY_PROFILE]: await caches.open(CACHE_KEY_PROFILE),
      [CACHE_KEY_DOCUMENT]: await caches.open(CACHE_KEY_DOCUMENT),
    };
  }

  private getDocumentLocation(
    document: Document,
    size?: PhotoSizesTypes
  ): InputDocumentFileLocation {
    return {
      $t: "InputDocumentFileLocation",
      id: document.id,
      accessHash: document.accessHash,
      fileReference: document.fileReference,
      thumbSize: size ? size.type : "",
    };
  }

  private getPhotoLocation(
    photo: Photo,
    size: PhotoSizesTypes
  ): InputPhotoFileLocation {
    return {
      $t: "InputPhotoFileLocation",
      id: photo.id,
      accessHash: photo.accessHash,
      fileReference: photo.fileReference,
      thumbSize: size.type,
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
  if (fileSize <= 128000) {
    // 128KB
    return 64;
  }
  if (fileSize <= 512000) {
    // 512KB
    return 128;
  }
  if (fileSize <= 1e6) {
    // 1MB
    return 256;
  }
  if (fileSize <= 1572864000) {
    // 1500MB
    return 512;
  }

  throw new Error("File size too large");
}

let jpegHeader: Uint8Array;

export function strippedPhotoToJpg(stripped: Uint8Array) {
  if (stripped.length < 3 || stripped[0] !== 1) {
    return stripped;
  }
  jpegHeader =
    jpegHeader ||
    readBufferFromHex(
      "ffd8ffe000104a46494600010100000100010000ffdb004300281c1e231e19282321232d2b28303c64413c37373c7b585d4964918099968f808c8aa0b4e6c3a0aadaad8a8cc8ffcbdaeef5ffffff9bc1fffffffaffe6fdfff8ffdb0043012b2d2d3c353c76414176f8a58ca5f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8ffc00011080000000003012200021101031101ffc4001f0000010501010101010100000000000000000102030405060708090a0bffc400b5100002010303020403050504040000017d01020300041105122131410613516107227114328191a1082342b1c11552d1f02433627282090a161718191a25262728292a3435363738393a434445464748494a535455565758595a636465666768696a737475767778797a838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae1e2e3e4e5e6e7e8e9eaf1f2f3f4f5f6f7f8f9faffc4001f0100030101010101010101010000000000000102030405060708090a0bffc400b51100020102040403040705040400010277000102031104052131061241510761711322328108144291a1b1c109233352f0156272d10a162434e125f11718191a262728292a35363738393a434445464748494a535455565758595a636465666768696a737475767778797a82838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae2e3e4e5e6e7e8e9eaf2f3f4f5f6f7f8f9faffda000c03010002110311003f00"
    );
  const footer = readBufferFromHex("ffd9");
  const header = jpegHeader.slice();
  header[164] = stripped[1];
  header[166] = stripped[2];
  return concatBuffers([header, stripped.slice(3), footer]);
}
