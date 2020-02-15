import {
  messages_SavedGifs,
  messages_SavedGifsNotModified
} from "../core/tl/TLObjects";
import db from "../utils/db";
import { Model } from "./model";

const SAVED_GIFS_CONFIG_KEY = "savedGifs";

export class Gif extends Model<any> {
  static async fetchSaved() {
    const gifs = await db.configs.get(SAVED_GIFS_CONFIG_KEY);
    // const hash = 0;
    const value = gifs && (gifs.value as messages_SavedGifs);

    // const hash = (value && value.hash) || 0;
    const response = (await this.tg.invoke({
      $t: "messages_GetSavedGifsRequest",
      hash: 0
    })) as messages_SavedGifs | messages_SavedGifsNotModified;

    if (response.$t === "messages_SavedGifsNotModified") {
      return value.gifs;
    }

    db.configs.put({
      value: response,
      key: SAVED_GIFS_CONFIG_KEY
    });

    return response.gifs;
  }
}
