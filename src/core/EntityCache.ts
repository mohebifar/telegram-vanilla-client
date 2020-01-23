import { TLObjectTypes, messages_Chats, InputPeerChat } from "./tl/TLObjects";
import { TelegramClient } from "./TelegramClient";
import { getPeer, getInputPeer } from "./tl/utils";

export class EntityCache {
  constructor(private client: TelegramClient) {}

  public async getInputEntity(entity: TLObjectTypes) {
    const peer = getPeer(entity);

    if (peer.$t === "PeerUser") {
      const users = await this.client.invoke({
        $t: "users_GetUsersRequest",
        id: [
          {
            $t: "InputUser",
            userId: peer.userId,
            accessHash: BigInt(0)
          }
        ]
      });
      if (users && !(users[0].$t === "UserEmpty")) {
        return getInputPeer(users[0]);
      }
    } else if (peer.$t === "PeerChat") {
      return {
        $t: "InputPeerChat",
        chatId: peer.chatId
      } as InputPeerChat;
    } else if (peer.$t === "PeerChannel") {
      try {
        const channels = (await this.client.invoke({
          $t: "channels_GetChannelsRequest",
          id: [
            {
              $t: "InputChannel",
              channelId: peer.channelId,
              accessHash: BigInt(0)
            }
          ]
        })) as messages_Chats;

        return getInputPeer(channels.chats[0]);
      } catch (e) {
        console.error(e);
      }
    }
    throw new Error("Could not find the input entity");
  }
}
