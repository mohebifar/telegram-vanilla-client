import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  DocumentAttributeSticker,
  Message,
  MessageService,
  User,
  PhotoSize,
  PhotoCachedSize,
  PhotoStrippedSize,
  PhotoSizeEmpty,
  DocumentAttributeFilename
} from "../core/tl/TLObjects";
import { Peer } from "../models/peer";
import { TelegramClientProxy } from "../telegram-worker-proxy";
import { DBPeer } from "./db";
import { DialogMessageTypes } from "./useful-types";

dayjs.extend(relativeTime);

export function getChatLetters(title: string) {
  if (!title) return null;

  const normalizedTitle = title || "Deleted account";
  if (title.length === 0) return null;

  let letters = getLetters(normalizedTitle);
  if (letters && letters.length > 0) {
    return letters;
  }

  return title.charAt(0);
}

export function getLetters(title: string) {
  if (!title) return null;
  if (title.length === 0) return null;

  const split = title.split(" ");
  if (split.length === 1) {
    return getFirstLetter(split[0]);
  }
  if (split.length > 1) {
    return getFirstLetter(split[0]) + getFirstLetter(split[1]);
  }

  return null;
}

export function getFirstLetter(str: string) {
  if (!str) return "";
  for (let i = 0; i < str.length; i++) {
    if (str[i].toUpperCase() !== str[i].toLowerCase()) {
      return str[i];
    } else if (str[i] >= "0" && str[i] <= "9") {
      return str[i];
    }
  }

  return "";
}

export function getDialogDisplayName(entity: DBPeer) {
  switch (entity.$t) {
    case "User":
      return `${entity.firstName || ""} ${entity.lastName || ""}`.trim();
    case "Channel":
    case "Chat":
    case "ChatForbidden":
    case "ChannelForbidden":
      return entity.title;
    case "ChatEmpty":
      return "Deleted group";
    case "UserEmpty":
      return "Deleted account";
    default:
      return "";
  }
}

export async function getMessageSummary(message: DialogMessageTypes) {
  switch (message.$t) {
    case "Message":
      let text = message.out ? "You: " : "";
      let mediaType: string;

      if (message.media && message.media.$t !== "MessageMediaEmpty") {
        [text, mediaType] = getMessageMediaType(message.media);
      }

      if (message.message) {
        return text + message.message.slice(0, 70);
      }

      return text + (mediaType || "");
    case "MessageService":
      return getServiceMessage(message);
    case "MessageEmpty":
      return "Empty chat";
  }
}

export async function getServiceMessage(message: MessageService) {
  const id = message.fromId;
  const peer = await Peer.get({
    id,
    type: "User"
  });
  switch (message.action.$t) {
    case "MessageActionChatEditTitle":
      return `${peer.displayName} renamed the group to ${message.action.title}`;
    case "MessageActionChannelCreate":
      return `${message.action.title}`;
    case "MessageActionChatAddUser":
      const users = await Promise.all(
        message.action.users.map(id => Peer.get({ id, type: "User" }))
      );
      const names = users.map(({ displayName }) => displayName).join(", ");
      return `${peer.displayName} invited ${names}`;
    case "MessageActionChatCreate":
      return `${peer.displayName} created the group "${message.action.title}"`;
    case "MessageActionChatDeleteUser":
      const deletedUser = await Peer.get({
        id: message.action.userId,
        type: "User"
      });
      return `${peer.displayName} removed "${deletedUser.displayName}"`;
    case "MessageActionPinMessage":
      return "A message was pinned";
    case "MessageActionPhoneCall":
      return "Phone call";
  }
  console.log("Unsupported service messsage", message);

  return "Service Message";
}

export function getMessageMediaType(
  media: Message["media"],
  includeContent = false,
  tgProxy?: TelegramClientProxy
): [string, string, any] {
  if (media.$t === "MessageMediaDocument") {
    if (media.document.$t === "Document") {
      const sticker = media.document.attributes.find(
        att => att.$t === "DocumentAttributeSticker"
      ) as DocumentAttributeSticker;

      if (sticker) {
        let content = null;
        if (includeContent) {
          content =
            includeContent && tgProxy.fileStorage.downloadMedia(media, 0);
        }
        return [sticker.alt, "Sticker", content];
      }

      const video = media.document.attributes.find(
        att => att.$t === "DocumentAttributeVideo"
      ) as DocumentAttributeSticker;

      if (video) {
        return ["📹 ", "Video", null];
      }

      const fileAttribute = media.document.attributes.find(
        t => t.$t === "DocumentAttributeFilename"
      ) as DocumentAttributeFilename;
      if (fileAttribute) {
        return ["", fileAttribute.fileName, null];
      }
    }
  } else if (media.$t === "MessageMediaPhoto") {
    return [
      "🖼 ",
      "Photo",
      includeContent && tgProxy.fileStorage.downloadMedia(media, 0)
    ];
  }

  return ["Unsupported media", null, null];
}

export function getDialogDisplayDate(date: Dayjs | Date | number) {
  const currentDate = dayjs();
  const messageDate = typeof date === "number" ? dayjs.unix(date) : dayjs(date);

  if (messageDate.isSame(currentDate, "d")) {
    return messageDate.format("HH:mm");
  }

  if (messageDate.isAfter(currentDate.subtract(7, "d"))) {
    return messageDate.format("ddd");
  }

  if (messageDate.isSame(currentDate, "y")) {
    return messageDate.format("M-D");
  }

  return messageDate.format("YY-M-D");
}

export function shortenCount(count: number) {
  if (count === 0) {
    return undefined;
  }

  if (count > 1000) {
    const normalizedCount = String(Math.floor(count / 100) / 10).replace(
      /\.0$/,
      ""
    );

    return `${normalizedCount}k`;
  }

  return String(count);
}

export function getLastSeenTime(status: User["status"]) {
  switch (status.$t) {
    case "UserStatusOffline":
      return `Last seen ${dayjs(status.wasOnline * 1000).fromNow()}`;
    case "UserStatusOnline":
      return "Online";
    case "UserStatusLastMonth":
      return "Last seen a month ago";
    case "UserStatusLastWeek":
      return "Last seen a week ago";
    case "UserStatusRecently":
      return "Last seen recently";
    case "UserStatusEmpty":
      return "Last seen a long time ago";
  }
}

export function sortPhotoSizes(
  sizes: (PhotoSize | PhotoCachedSize | PhotoStrippedSize | PhotoSizeEmpty)[]
) {
  const presetOrder = ["m", "x", "s", "y"];

  const arr = sizes.slice();
  const result = [];
  let i: number;
  let j: number;

  for (i = 0; i < presetOrder.length; i++) {
    while (-1 != (j = arr.findIndex(item => item.type === presetOrder[i]))) {
      result.push(arr.splice(j, 1)[0]);
    }
  }
  return result.concat(arr);
}

export function parseFileSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const units = ["B", "kB", "MB", "GB", "TB"];
  return `${(size / Math.pow(1024, i)).toFixed(2)}${units[i]}`;
}

export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
}
