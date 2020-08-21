import dayjs from "dayjs";
import {
  messages_AllStickers,
  StickerSet as TLStickerSet,
  messages_AllStickersNotModified,
  messages_StickerSet,
  messages_FoundStickerSets,
  Document,
  messages_RecentStickersNotModified,
  messages_RecentStickers,
} from "../core/tl/TLObjects";
import db, { TelegramDatabase } from "../utils/db";
import { Model, ModelDecorator, ModelKey, ModelWithProxy } from "./model";

interface ExtraMethods {
  loadPack(): Promise<void>;
  install(): Promise<any>;
  uninstall(): Promise<any>;
}

export type IStickerSet = ModelWithProxy<"stickerSet"> & ExtraMethods;

const STICKER_HASH_CONFIG_KEY = "allStickersHash";
const RECENT_STICKERS_KEY = "recentStickers";
const RECENT_STICKERS_HASH_CONFIG_KEY = "recentStickersHash";

@ModelDecorator({
  tableName: "stickerSet",
  primaryKey: ["set.id"],
})
export class StickerSet extends Model<"stickerSet"> implements ExtraMethods {
  static get: (id: ModelKey<"stickerSet">) => Promise<undefined | IStickerSet>;
  static bulkGet: (
    id: ModelKey<"stickerSet">[]
  ) => Promise<(undefined | IStickerSet)[]>;
  static table: TelegramDatabase["stickerSet"];
  static fromObject: (object: any, forceRecreate?: boolean) => IStickerSet;
  private loadingPromise: Promise<void> | null = null;
  private static all: IStickerSet[];
  private static recentCache: Document[];

  protected prepareValues(stickerSet: TLStickerSet) {
    return stickerSet;
  }

  static async fetchAll() {
    const hashRecord = await db.configs.get(STICKER_HASH_CONFIG_KEY);
    const hash = (hashRecord && hashRecord.value) || 0;

    const response = (await this.tg.invoke({
      $t: "messages_GetAllStickersRequest",
      hash,
    })) as messages_AllStickers | messages_AllStickersNotModified;

    const recentStickerDocuments = await this.getRecentStickers();

    const recentSet = StickerSet.fromObject({
      $t: "messages_StickerSet",
      set: {
        id: "recent",
        title: "Recent",
      },
      documents: recentStickerDocuments,
    });

    if (response.$t === "messages_AllStickersNotModified") {
      return [recentSet, ...(await this.getAll())];
    }

    try {
      await this.table.clear();
    } catch {}

    const result: IStickerSet[] = [];

    const setsSorted = response.sets.sort(
      (a, b) => b.installedDate - a.installedDate
    );

    let i = 0;

    for (const set of setsSorted) {
      const model = StickerSet.fromObject({ set }, true);
      if (i++ < 8) {
        await model.loadPack();
      }

      model.save();
      result.push(model);
    }

    db.configs.put({
      value: response.hash,
      key: STICKER_HASH_CONFIG_KEY,
    });

    return [recentSet, ...result];
  }

  static async getAll() {
    if (StickerSet.all) {
      return StickerSet.all;
    }

    const result: IStickerSet[] = [];
    const all = await this.table
      .orderBy("set.installedDate")
      .reverse()
      .toArray();

    for (const sticker of all) {
      result.push(StickerSet.fromObject(sticker, true));
    }

    StickerSet.all = result;

    return result;
  }

  static async search(q?: string) {
    const response = (await this.tg.invoke(
      q
        ? {
            $t: "messages_SearchStickerSetsRequest",
            q,
            hash: 0,
            excludeFeatured: false,
          }
        : {
            $t: "messages_GetFeaturedStickersRequest",
            hash: 0,
          }
    )) as messages_FoundStickerSets;

    const networkResult = response.sets.map((result) =>
      StickerSet.fromObject(
        {
          set: result.set,
          ...("cover" in result ? { cover: result.cover } : {}),
          ...("covers" in result ? { covers: result.covers } : {}),
        },
        true
      )
    );

    if (q) {
      const allNetworkIds = networkResult.map(
        (stickerSet) => stickerSet.set.id
      );
      const lowerCaseQ = q.toLowerCase();
      const localStickers = await this.getAll();
      const localFiltered = localStickers.filter(
        (stickerSet) =>
          stickerSet.set.title.toLowerCase().includes(lowerCaseQ) &&
          !allNetworkIds.includes(stickerSet.set.id)
      );

      return [...networkResult, ...localFiltered];
    }

    return networkResult;
  }

  static async getRecentStickers(): Promise<Document[]> {
    if (this.recentCache) {
      return this.recentCache;
    }

    const hashRecord = await db.configs.get(RECENT_STICKERS_HASH_CONFIG_KEY);
    const hash = (hashRecord && hashRecord.value) || 0;

    const response = (await this.tg.invoke({
      $t: "messages_GetRecentStickersRequest",
      hash,
    })) as messages_RecentStickersNotModified | messages_RecentStickers;

    if (response.$t === "messages_RecentStickersNotModified") {
      const recentStickers = await db.configs.get(RECENT_STICKERS_KEY);
      if (recentStickers && recentStickers.value) {
        return (this.recentCache = recentStickers.value);
      }
    }

    if (response.$t === "messages_RecentStickers") {
      return (this.recentCache = response.stickers.slice(0, 20) as Document[]);
    }

    const stickers = await this.search();

    return (this.recentCache = stickers
      .map((sticker) => {
        if (sticker.covers) {
          return sticker.covers.find(
            (document) => document.$t === "Document"
          ) as Document;
        }

        return sticker.cover as Document;
      })
      .filter(Boolean)).slice(0, 5);
  }

  static async use(document: Document) {
    const recentStickers = await StickerSet.getRecentStickers();
    this.recentCache = [
      document,
      ...recentStickers.filter((item) => item.id !== document.id),
    ].slice(0, 20);
    this.events.emit("recent_updated", this.recentCache);

    db.configs.put({
      value: this.recentCache,
      key: RECENT_STICKERS_KEY,
    });
  }

  public async loadPack() {
    if (this._proxy.documents) {
      return;
    }
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    try {
      this.loadingPromise = (async () => {
        const result = (await this.tg.invoke({
          $t: "messages_GetStickerSetRequest",
          stickerset: {
            $t: "InputStickerSetID",
            id: this._proxy.set.id,
            accessHash: this._proxy.set.accessHash,
          },
        })) as messages_StickerSet;

        this._proxy.documents = result.documents;
        this._proxy.packs = result.packs;
        this.save();
      })();
      await this.loadingPromise;
    } finally {
      this.loadingPromise = null;
    }
  }

  public async install() {
    const result = await this.tg.invoke({
      $t: "messages_InstallStickerSetRequest",
      stickerset: {
        $t: "InputStickerSetID",
        id: this._proxy.set.id,
        accessHash: this._proxy.set.accessHash,
      },
      archived: false,
    });

    StickerSet.all = [this._proxy, ...StickerSet.all];

    this._proxy.set.installedDate = dayjs().unix();
    this.save();
    StickerSet.events.emit("installed", this._proxy);
    return result;
  }

  public async uninstall() {
    const result = this.tg.invoke({
      $t: "messages_UninstallStickerSetRequest",
      stickerset: {
        $t: "InputStickerSetID",
        id: this._proxy.set.id,
        accessHash: this._proxy.set.accessHash,
      },
    });

    StickerSet.all = StickerSet.all.filter(({ set }) => {
      return set.id !== this._proxy.set.id;
    });

    this._proxy.set.installedDate = undefined;
    this.constructor.table.delete(this._proxy.set.id as never);
    StickerSet.events.emit("uninstalled", this._proxy);
    return result;
  }
}
