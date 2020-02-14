import { contacts_TopPeers, TopPeer as TLTopPeer } from "../core/tl/TLObjects";
import { extractIdFromPeer } from "../core/tl/utils";
import { TelegramDatabase } from "../utils/db";
import { Model, ModelDecorator, ModelKey, ModelWithProxy } from "./model";
import { Peer } from "./peer";
import { TopPeerCategory } from "../utils/useful-types";

interface ExtraMethods {}

export type ITopPeer = ModelWithProxy<"topPeers"> & ExtraMethods;

@ModelDecorator({
  tableName: "topPeers",
  primaryKey: ["peerType", "peerId"]
})
export class TopPeer extends Model<"topPeers"> implements ExtraMethods {
  static get: (id: ModelKey<"topPeers">) => Promise<undefined | ITopPeer>;
  static bulkGet: (
    id: ModelKey<"topPeers">[]
  ) => Promise<(undefined | ITopPeer)[]>;
  static table: TelegramDatabase["topPeers"];
  static fromObject: (object: any, forceRecreate?: boolean) => ITopPeer;

  protected prepareValues(peer: TLTopPeer & { category: string }) {
    if (peer.peer) {
      const { type, id } = extractIdFromPeer(peer.peer);

      return {
        peerType: type,
        peerId: id,
        rating: peer.rating,
        category: peer.category
      };
    }

    return peer;
  }

  static async fetchAll(
    category: TopPeerCategory = "TopPeerCategoryCorrespondents"
  ) {
    const result: ITopPeer[] = [];
    try {
      const response = (await this.tg.invoke({
        $t: "contacts_GetTopPeersRequest",
        limit: 20,
        hash: 0,
        offset: 0,
        correspondents: true
      })) as contacts_TopPeers;

      for (const peer of [...response.chats, ...response.users]) {
        Peer.fromObject(peer).save();
      }

      for (const peer of response.categories[0].peers) {
        const model = TopPeer.fromObject({ ...peer, category });
        model.save();
        result.push(model);
      }
    } catch {
      const all = await this.table
        .orderBy("rating")
        .reverse()
        .toArray();

      for (const topPeer of all) {
        result.push(TopPeer.fromObject(topPeer, true));
      }
    }

    return result;
  }
}
