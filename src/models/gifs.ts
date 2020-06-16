import {
  messages_SavedGifs,
  messages_SavedGifsNotModified,
  InputUser,
  contacts_ResolvedPeer,
  messages_BotResults,
} from "../core/tl/TLObjects";
import db from "../utils/db";
import { Model } from "./model";
import { getInputPeer } from "../core/tl/utils";

const SAVED_GIFS_CONFIG_KEY = "savedGifs";

let gifBotUser: InputUser;

export class Gif extends Model<any> {
  static async fetchSaved() {
    const gifs = await db.configs.get(SAVED_GIFS_CONFIG_KEY);
    // const hash = 0;
    const value = gifs && (gifs.value as messages_SavedGifs);

    // const hash = (value && value.hash) || 0;
    const response = (await this.tg.invoke({
      $t: "messages_GetSavedGifsRequest",
      hash: 0,
    })) as messages_SavedGifs | messages_SavedGifsNotModified;

    if (response.$t === "messages_SavedGifsNotModified") {
      return value.gifs;
    }

    db.configs.put({
      value: response,
      key: SAVED_GIFS_CONFIG_KEY,
    });

    return response.gifs;
  }

  static async search(query: string, offset = "") {
    if (!gifBotUser) {
      const { users } = (await this.tg.invoke({
        $t: "contacts_ResolveUsernameRequest",
        username: "gif",
      })) as contacts_ResolvedPeer;
      if (users.length > 0 && users[0].$t === "User") {
        gifBotUser = getInputPeer(users[0]) as any;
      }
    }

    const botResults = (await this.tg.invoke({
      $t: "messages_GetInlineBotResultsRequest",
      query,
      offset: offset,
      bot: gifBotUser,
      peer: { $t: "InputPeerEmpty" },
    })) as messages_BotResults;

    const documents = botResults.results
      .map((result) => {
        return (
          result.$t === "BotInlineMediaResult" &&
          result.document &&
          result.document.$t === "Document" &&
          result.document
        );
      })
      .filter(Boolean);

    return { nextOffset: botResults.nextOffset, documents };
  }
}
