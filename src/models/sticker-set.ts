import dayjs from "dayjs";
import {
  messages_AllStickers,
  StickerSet as TLStickerSet,
  messages_AllStickersNotModified,
  messages_StickerSet,
  messages_FoundStickerSets,
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

    if (response.$t === "messages_AllStickersNotModified") {
      return this.getAll();
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

    return result;
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

  static async searchStickerSet(q?: string) {
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

      console.log(localStickers, localFiltered, lowerCaseQ);
      return [...networkResult, ...localFiltered];
    }

    return networkResult;
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

    this._proxy.set.installedDate = undefined;
    this.constructor.table.delete(this._proxy.set.id as never);
    StickerSet.events.emit("uninstalled", this._proxy);
    return result;
  }
}
