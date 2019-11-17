import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TLObjectTypes } from "../core/tl/types";
import {
  Message,
  MessageEmpty,
  DocumentAttributeSticker,
  UpdateShortMessage,
  User
} from "../core/tl/TLObjects";

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

export function getDialogDisplayName(entity: TLObjectTypes) {
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

export function getShortLastText(
  message: Message | MessageEmpty | UpdateShortMessage
) {
  switch (message.$t) {
    case "Message":
      let text = "";
      let mediaType;

      if (message.media) {
        [text, mediaType] = getMessageMediaType(message.media);
      }

      if (message.message) {
        return text + message.message.slice(0, 70);
      }

      return text + (mediaType || "");

    case "UpdateShortMessage":
      return message.message;
    case "MessageEmpty":
      return "Empty chat";
  }
}

function getMessageMediaType(media: Message["media"]): [string, string] {
  if (media.$t === "MessageMediaDocument") {
    if (media.document.$t === "Document") {
      const sticker = media.document.attributes.find(
        att => att.$t === "DocumentAttributeSticker"
      ) as DocumentAttributeSticker;

      if (sticker) {
        return [sticker.alt, "Sticker"];
      }

      const video = media.document.attributes.find(
        att => att.$t === "DocumentAttributeVideo"
      ) as DocumentAttributeSticker;

      if (video) {
        return ["📹 ", "Video"];
      }
    }
  } else if (media.$t === "MessageMediaPhoto") {
    return ["🖼 ", "Photo"];
  }

  return ["Unsupported media", null];
}

export function getDialogDisplayDate(date: Date) {
  const currentDate = dayjs();
  const messageDate = dayjs(date);

  if (messageDate.isSame(currentDate, "d")) {
    return messageDate.format("HH:mm");
  }

  if (messageDate.isSame(currentDate, "w")) {
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
