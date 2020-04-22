import {
  messages_AllStickers,
  StickerSet as TLStickerSet,
  messages_AllStickersNotModified,
  messages_StickerSet,
} from "../core/tl/TLObjects";
import db, { TelegramDatabase } from "../utils/db";
import { Model, ModelDecorator, ModelKey, ModelWithProxy } from "./model";

interface ExtraMethods {
  loadPack(): Promise<void>;
}

export type IStickerSet = ModelWithProxy<"stickerSet"> & ExtraMethods;

const STICKER_HASH_CONFIG_KEY = "allStickersHash";

@ModelDecorator({
  tableName: "stickerSet",
  primaryKey: ["id"]
})
export class StickerSet extends Model<"stickerSet"> implements ExtraMethods {
  static get: (id: ModelKey<"stickerSet">) => Promise<undefined | IStickerSet>;
  static bulkGet: (
    id: ModelKey<"stickerSet">[]
  ) => Promise<(undefined | IStickerSet)[]>;
  static table: TelegramDatabase["stickerSet"];
  static fromObject: (object: any, forceRecreate?: boolean) => IStickerSet;
  private loadingPromise: Promise<void> | null = null;

  protected prepareValues(stickerSet: TLStickerSet) {
    return stickerSet;
  }

  static async fetchAll() {
    const hashRecord = await db.configs.get(STICKER_HASH_CONFIG_KEY);
    const hash = (hashRecord && hashRecord.value) || 0;

    const response = (await this.tg.invoke({
      $t: "messages_GetAllStickersRequest",
      hash
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
      if (i++ < 2) {
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
    const result: IStickerSet[] = [];
    const all = await this.table
      .orderBy("set.installedDate")
      .reverse()
      .toArray();

    for (const sticker of all) {
      result.push(StickerSet.fromObject(sticker, true));
    }

    return result;
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
            accessHash: this._proxy.set.accessHash
          }
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
}
