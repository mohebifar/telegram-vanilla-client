import { Message, messages_MessagesSlice } from "../core/tl/TLObjects";
import { TelegramDatabase } from "../utils/db";
import { Model, ModelDecorator, ModelKey, ModelWithProxy } from "./model";
import { IPeer, Peer } from "./peer";
import { getInputPeer } from "../core/tl/utils";

interface ExtraMethods {
  setNext(next: ISharedMedia): void;
  setPrev(prev: ISharedMedia): void;
  setPeer(peer: IPeer): void;
  getNext(): Promise<ISharedMedia>;
  getPrev(): Promise<ISharedMedia>;
}

export type ISharedMedia = ModelWithProxy<"sharedMedia"> & ExtraMethods;

@ModelDecorator({
  tableName: "sharedMedia",
  primaryKey: ["id", "peerType", "peerId"]
})
export class SharedMedia extends Model<"sharedMedia"> implements ExtraMethods {
  static get: (
    id: ModelKey<"sharedMedia">
  ) => Promise<undefined | ISharedMedia>;
  static bulkGet: (
    id: ModelKey<"sharedMedia">[]
  ) => Promise<(undefined | ISharedMedia)[]>;
  static table: TelegramDatabase["sharedMedia"];
  static fromObject: (object: any) => ISharedMedia;
  private next?: ISharedMedia;
  private prev?: ISharedMedia;
  private peer?: IPeer;

  protected prepareValues(message: Message) {
    return message;
  }

  static async fetch(
    peer: IPeer,
    {
      offsetId,
      addOffset = -10,
      limit = 20,
      maxId = 0,
      minId = 0
    }: {
      offsetId: number;
      addOffset?: number;
      limit?: number;
      minId?: number;
      maxId?: number;
    }
  ) {
    const response = (await this.tg.invoke({
      $t: "messages_SearchRequest",
      addOffset,
      filter: {
        $t: "InputMessagesFilterPhotoVideo"
      },
      peer: getInputPeer(peer),
      maxId,
      minId,
      hash: 0,
      maxDate: 0,
      minDate: 0,
      offsetId,
      limit,
      q: ""
    })) as messages_MessagesSlice;
    console.log("requested", offsetId, addOffset, response);

    for (const peer of [...response.users, ...response.chats]) {
      Peer.fromObject(peer).save();
    }

    const result: ISharedMedia[] = [];
    let lastModel: ISharedMedia;
    for (const message of response.messages) {
      if (message.$t !== "Message") {
        continue;
      }

      const model = SharedMedia.fromObject({
        ...message,
        peerType: peer.type,
        peerId: peer.id
      });
      model.setPeer(peer);
      model.save();
      if (lastModel) {
        model.setNext(lastModel);
        lastModel.setPrev(model);
      }
      lastModel = model;
      result.push(model);
    }

    return result;
  }

  public async getNext() {
    if (this.next) {
      return this.next;
    }

    const result = await SharedMedia.fetch(this.peer, {
      offsetId: this._proxy.id,
      minId: this._proxy.id,
      addOffset: -20
    });
    const next = result[result.length - 1];
    if (next) {
      next.setPrev(this._proxy);
      this.setNext(next);
    }
    return next;
  }

  public async getPrev() {
    if (this.prev) {
      return this.prev;
    }
    const result = await SharedMedia.fetch(this.peer, {
      offsetId: this._proxy.id,
      maxId: this._proxy.id,
      addOffset: 0
    });
    const prev = result[0];
    if (prev) {
      prev.setNext(this._proxy);
      this.setPrev(prev);
    }
    return prev;
  }

  public async getPeer() {
    return this.peer;
  }

  public setPeer(peer: IPeer) {
    this.peer = peer;
  }

  public setNext(next: ISharedMedia) {
    this.next = next;
  }

  public setPrev(prev: ISharedMedia) {
    this.prev = prev;
  }
}
