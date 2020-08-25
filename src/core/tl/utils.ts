import { AllDialogPeerTypes, InputPeerTypes } from "../../utils/useful-types";
import {
  PeerChannel,
  PeerChat,
  PeerUser,
  InputPeerChannel,
  InputPeerChat,
  InputPeerUser,
} from "./TLObjects";
import { TLObjectTypes } from "./types";

function _raiseCastFail(entity: TLObjectTypes, target: string) {
  throw new Error(`Cannot cast ${entity.$t} to any kind of ${target}`);
}

export function getInputPeer(
  entity: TLObjectTypes,
  allowSelf = true,
  checkHash = true
  // @ts-ignore
): InputPeerTypes {
  if (!entity) {
    return undefined;
  }

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
        accessHash: entity.accessHash,
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
      chatId: entity.id,
    };
  }
  if (entity.$t === "Channel") {
    if ((entity.accessHash !== undefined && !entity.min) || checkHash) {
      return {
        $t: "InputPeerChannel",
        channelId: entity.id,
        accessHash: entity.accessHash,
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
      accessHash: entity.accessHash,
    };
  }

  if (entity.$t === "InputUser") {
    return {
      $t: "InputPeerUser",
      userId: entity.userId,
      accessHash: entity.accessHash,
    };
  }
  if (entity.$t === "InputChannel") {
    return {
      $t: "InputPeerChannel",
      channelId: entity.channelId,
      accessHash: entity.accessHash,
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
): PeerUser | PeerChat | PeerChannel {
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
    // peer.$t === "InputNotifyPeer" ||
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

export function simplifyPeerType(
  type:
    | AllDialogPeerTypes["$t"]
    | "PeerChat"
    | "PeerUser"
    | "PeerChannel"
    | "InputPeerUser"
    | "InputPeerChat"
    | "InputPeerChannel"
): "Chat" | "Channel" | "User" {
  if (
    type === "Chat" ||
    type === "ChatEmpty" ||
    type === "ChatForbidden" ||
    type === "InputPeerChat" ||
    type === "PeerChat"
  ) {
    return "Chat";
  }
  if (
    type === "Channel" ||
    type === "ChannelForbidden" ||
    type === "InputPeerChannel" ||
    type === "PeerChannel"
  ) {
    return "Channel";
  }
  return "User";
}

export function extractIdFromPeer(
  peer:
    | PeerChannel
    | PeerChat
    | PeerUser
    | InputPeerChat
    | InputPeerChannel
    | InputPeerUser
) {
  let idKey: string;
  switch (peer.$t) {
    case "InputPeerChannel":
    case "PeerChannel":
      idKey = "channelId";
      break;
    case "InputPeerChat":
    case "PeerChat":
      idKey = "chatId";
      break;
    case "InputPeerUser":
    case "PeerUser":
      idKey = "userId";
      break;
  }

  return {
    id: peer[idKey],
    type: simplifyPeerType(peer.$t),
  };
}
