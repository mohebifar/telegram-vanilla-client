import { TLObjectTypes } from "./types";
import {
  InputPeerUser,
  InputPeerChannel,
  InputPeerEmpty,
  InputPeerChat,
  InputPeerSelf,
  InputPeerUserFromMessage,
  InputPeerChannelFromMessage,
  PeerChannel,
  PeerChat,
  PeerUser
} from "./TLObjects";

type InputPeerTypes =
  | InputPeerSelf
  | InputPeerUser
  | InputPeerChannel
  | InputPeerChannel
  | InputPeerEmpty
  | InputPeerUserFromMessage
  | InputPeerChat
  | InputPeerChannelFromMessage;

function _raiseCastFail(entity, target) {
  throw new Error(`Cannot cast ${entity.$t} to any kind of ${target}`);
}

export function getInputPeer(
  entity: TLObjectTypes,
  allowSelf = true,
  checkHash = true
  // @ts-ignore
): InputPeerTypes {
  if (entity.subclassOfId === 0xc91c90b6) {
    // crc32(b'InputPeer')
    return entity;
  }

  if (entity.$t === "User") {
    if (entity.isSelf && allowSelf) {
      return { $t: "InputPeerSelf" };
    } else if ((entity.accessHash !== undefined && !entity.min) || !checkHash) {
      return {
        $t: "InputPeerUser",
        userId: entity.id,
        accessHash: entity.accessHash
      };
    } else {
      throw new Error("User without access_hash or min info cannot be input");
    }
  }
  if (
    entity.$t === "Chat" ||
    entity.$t === "ChatEmpty" ||
    entity.$t === "ChatForbidden"
  ) {
    return {
      $t: "InputPeerChat",
      chatId: entity.id
    };
  }
  if (entity.$t === "Channel") {
    if ((entity.accessHash !== undefined && !entity.min) || checkHash) {
      return {
        $t: "InputPeerChannel",
        channelId: entity.id,
        accessHash: entity.accessHash
      };
    } else {
      throw new TypeError(
        "Channel without access_hash or min info cannot be input"
      );
    }
  }
  if (entity.$t === "ChannelForbidden") {
    // "channelForbidden are never min", and since their hash is
    // also not optional, we assume that this truly is the case.
    return {
      $t: "InputPeerChannel",
      channelId: entity.id,
      accessHash: entity.accessHash
    };
  }

  if (entity.$t === "InputUser") {
    return {
      $t: "InputPeerUser",
      userId: entity.userId,
      accessHash: entity.accessHash
    };
  }
  if (entity.$t === "InputChannel") {
    return {
      $t: "InputPeerChannel",
      channelId: entity.channelId,
      accessHash: entity.accessHash
    };
  }
  if (entity.$t === "UserEmpty") {
    return { $t: "InputPeerEmpty" };
  }
  if (entity.$t === "UserFull") {
    return getInputPeer(entity.user);
  }

  if (entity.$t === "ChatFull") {
    return { $t: "InputPeerChat", chatId: entity.id };
  }

  if (entity.$t === "PeerChat") {
    return { $t: "InputPeerChat", chatId: entity.chatId };
  }

  _raiseCastFail(entity, "peer");
}

function resolveId(
  markedId: number
): [number, "PeerChannel" | "PeerUser" | "PeerChat"] {
  if (markedId >= 0) {
    return [markedId, "PeerUser"];
  }

  // There have been report of chat IDs being 10000xyz, which means their
  // marked version is -10000xyz, which in turn looks like a channel but
  // it becomes 00xyz (= xyz). Hence, we must assert that there are only
  // two zeroes.
  const matches = markedId.toString().match(/-100([^0]\d*)/);
  if (matches) {
    return [parseInt(matches[1]), "PeerChannel"];
  }
  return [-markedId, "PeerChat"];
}

export function getPeer(
  peer: TLObjectTypes
):
  | PeerUser
  | PeerChat
  | PeerChannel
  | InputPeerSelf
  | InputPeerChat
  | InputPeerChannel
  | InputPeerEmpty
  | InputPeerUser
  | InputPeerUserFromMessage
  | InputPeerChannelFromMessage {
  if (typeof peer === "number") {
    const [id, $t] = resolveId(peer);

    if ($t === "PeerChannel") {
      return { channelId: id, $t };
    } else if ($t === "PeerChat") {
      return { chatId: id, $t };
    } else {
      return { userId: id, $t };
    }
  }

  if (peer.subclassOfId === undefined) {
    throw new Error();
  }
  if (peer.subclassOfId === 0x2d45687) {
    return peer;
  } else if (
    peer.$t === "contacts_ResolvedPeer" ||
    peer.$t === "InputNotifyPeer" ||
    peer.$t === "TopPeer" ||
    peer.$t === "Dialog" ||
    peer.$t === "DialogPeer"
  ) {
    return peer.peer;
  } else if (peer.$t === "ChannelFull") {
    return { $t: "PeerChannel", channelId: peer.id };
  }
  if (peer.subclassOfId === 0x7d7c6f86 || peer.subclassOfId === 0xd9c7fc18) {
    // ChatParticipant, ChannelParticipant
    return { userId: peer.userId, $t: "PeerUser" };
  }

  peer = getInputPeer(peer, false, false);

  if (peer.$t === "InputPeerUser") {
    return { $t: "PeerUser", userId: peer.userId };
  } else if (peer.$t === "InputPeerChat") {
    return { $t: "PeerChat", chatId: peer.chatId };
  } else if (peer.$t === "InputPeerChannel") {
    return { $t: "PeerChannel", channelId: peer.channelId };
  }

  throw new Error("Cannot identify peer");
}

function numberInRange(x: number, a: number, b: number) {
  return a < x && x <= b;
}

export function getPeerId(entity: TLObjectTypes, addMark = true): number {
  // First we assert it's a Peer TLObject, or early return for integers
  if (typeof entity == "number") {
    return addMark ? entity : resolveId(entity)[0];
  }

  // Tell the user to use their client to resolve InputPeerSelf if we got one
  if (entity.$t === "InputPeerSelf") {
    return undefined;
    // throw new Error(peer, "int (you might want to use client.get_peer_id)");
  }

  let peer;

  try {
    peer = getPeer(entity);
  } catch (e) {
    console.log(e);
    _raiseCastFail(entity, "int");
  }
  if (peer.$t === "PeerUser") {
    return peer.userId;
  } else if (peer.$t === "PeerChat") {
    // Check in case the user mixed things up to avoid blowing up
    if (!numberInRange(0, peer.chatId, 0x7fffffff)) {
      peer.chatId = resolveId(peer.chatId)[0];
    }

    return addMark ? -peer.chatId : peer.chatId;
  } else {
    // if (peer instanceof types.PeerChannel)
    // Check in case the user mixed things up to avoid blowing up
    if (!numberInRange(0, peer.channelId, 0x7fffffff)) {
      peer.channelId = resolveId(peer.channelId)[0];
    }
    if (!addMark) {
      return peer.channelId;
    }
    // Concat -100 through math tricks, .to_supergroup() on
    // Madeline IDs will be strictly positive -> log works.
    try {
      return -(
        peer.channelId +
        Math.pow(10, Math.floor(Math.log10(peer.channelId) + 3))
      );
    } catch (e) {
      throw new Error(
        "Cannot get marked ID of a channel unless its ID is strictly positive"
      );
    }
  }
}
