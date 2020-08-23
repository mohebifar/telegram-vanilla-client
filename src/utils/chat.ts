import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  DocumentAttributeAudio,
  DocumentAttributeFilename,
  DocumentAttributeSticker,
  MessageService,
  PhotoCachedSize,
  PhotoSize,
  PhotoSizeEmpty,
  PhotoStrippedSize,
  User,
  Message,
} from "../core/tl/TLObjects";
import { Peer, IPeer } from "../models/peer";
import { TelegramClientProxy } from "../telegram-worker-proxy";
import { DBPeer } from "./db";
import {
  DialogMessageTypes,
  MediaWithTransient,
  TypingState,
} from "./useful-types";
import { toListSentence } from "./utils";
import { replaceEmoji } from "./emojis";

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
      let text = "";
      let mediaType: string;

      if (message.media && message.media.$t !== "MessageMediaEmpty") {
        [text, mediaType] = getMessageMediaType(message.media);
      }

      if (message.message) {
        return (
          text + escapeHTML(message.message.replace(/[\r\n]/, " ").slice(0, 70))
        );
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
  let peer: IPeer = {} as any;
  if (id) {
    peer = await Peer.get({
      id,
      type: "User",
    });
  }
  switch (message.action.$t) {
    case "MessageActionChatEditTitle":
      return `${peer.displayName} renamed the group to ${message.action.title}`;
    case "MessageActionChannelCreate":
      return `${message.action.title}`;
    case "MessageActionChatAddUser":
      const users = await Promise.all(
        message.action.users.map((id) => Peer.get({ id, type: "User" }))
      );
      const names = users.map(({ displayName }) => displayName).join(", ");
      return `${peer.displayName} invited ${names}`;
    case "MessageActionChatCreate":
      return `${peer.displayName} created the group "${message.action.title}"`;
    case "MessageActionChatDeleteUser":
      const deletedUser = await Peer.get({
        id: message.action.userId,
        type: "User",
      });
      return `${peer.displayName} removed "${deletedUser.displayName}"`;
    case "MessageActionPinMessage":
      return "A message was pinned";
    case "MessageActionContactSignUp":
      return `${peer.displayName} joined Telegram!`;
    case "MessageActionPhoneCall":
      return "Phone call";
    case "MessageActionChatJoinedByLink":
      return `${peer.displayName} joined by link`;
  }
  console.log("Unsupported service messsage", message);

  return "Service Message";
}

export function getMessageMediaType(
  media: MediaWithTransient,
  includeContent = false,
  tgProxy?: TelegramClientProxy
): [string, string, any] {
  if (media.$t === "MessageMediaDocument") {
    if (media.document.$t === "Document") {
      const sticker = media.document.attributes.find(
        (att) => att.$t === "DocumentAttributeSticker"
      ) as DocumentAttributeSticker;

      if (sticker) {
        let content = null;
        if (includeContent) {
          content =
            includeContent && tgProxy.fileStorage.downloadMedia(media, 0);
        }
        return [sticker.alt + " ", "Sticker", content];
      }

      const video = media.document.attributes.find(
        (att) => att.$t === "DocumentAttributeVideo"
      ) as DocumentAttributeSticker;

      if (video) {
        const isGIF = media.document.attributes.some(
          ({ $t }) => $t === "DocumentAttributeAnimated"
        );

        if (isGIF) {
          return ["📹 ", "GIF", null];
        }

        return ["📹 ", "Video", null];
      }

      const fileAttribute = media.document.attributes.find(
        (t) => t.$t === "DocumentAttributeFilename"
      ) as DocumentAttributeFilename;
      if (fileAttribute) {
        return ["", fileAttribute.fileName, null];
      }

      const audioAttribute = media.document.attributes.find(
        (t) => t.$t === "DocumentAttributeAudio"
      ) as DocumentAttributeAudio;
      if (audioAttribute) {
        return [
          "",
          (audioAttribute.voice && "Voice message") ||
            audioAttribute.title ||
            "Audio",
          null,
        ];
      }
    }
  } else if (media.$t === "MessageMediaPhoto") {
    return [
      "🖼 ",
      "Photo",
      includeContent && tgProxy.fileStorage.downloadMedia(media, 0),
    ];
  } else if (media.$t === "MessageMediaWebPage") {
    return ["", "", undefined];
  } else if (media.$t === "MessageMediaContact") {
    return ["👤 ", "Contact", null];
  } else if (media.$t === "MessageMediaPoll") {
    return ["📊 ", media.poll.question, null];
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

export async function getIsTypingText(isTypings: TypingState[]) {
  if (isTypings.length > 0) {
    const userNames: string[] = [];
    for (const typing of isTypings) {
      const user = await Peer.get({ type: "User", id: typing.userId });
      if (!user || user.$t !== "User") {
        continue;
      }
      userNames.push(user.firstName);
    }

    if (userNames.length > 0) {
      return (
        toListSentence(userNames) +
        " " +
        (userNames.length > 1 ? "are" : "is") +
        " typing..."
      );
    }
  }

  return undefined;
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
      return "online";
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

export function sortPhotoSizes<
  T extends PhotoSize | PhotoCachedSize | PhotoStrippedSize | PhotoSizeEmpty
>(sizes: T[], presetOrder = ["m", "x", "s", "y"]): T[] {
  const arr = sizes.slice();
  const result: T[] = [];
  let i: number;
  let j: number;

  for (i = 0; i < presetOrder.length; i++) {
    while (-1 != (j = arr.findIndex((item) => item.type === presetOrder[i]))) {
      result.push(arr.splice(j, 1)[0]);
    }
  }
  return result.concat(arr);
}

export function parseFileSize(size: number, decimals = 2) {
  let log = Math.log(size);
  log = log < 0 ? 0 : log;

  const i = Math.floor(log / Math.log(1024));
  const units = ["B", "kB", "MB", "GB", "TB"];
  return `${(size / Math.pow(1024, i)).toFixed(decimals)}${units[i]}`;
}

export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
}

export function formatDurationWithMillis(millis: number) {
  const seconds = millis / 1000;
  const s = seconds % 60;
  return formatDuration(seconds) + "," + Math.round(100 * (Math.ceil(s) - s));
}

function messageToParagraphs(message: string) {
  const newLine = /[\n\r]/g;
  const chunks = message.split(newLine);
  if (chunks.length > 1) {
    return chunks.map((line) => `<p dir="auto">${line}</p>`).join("");
  }

  return message;
}

export function escapeHTML(string: string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function messageToHTML(message: Message) {
  let currentOffset = 0;
  let rawMessage = message.message;
  let html = "";

  if (message.entities) {
    message.entities.forEach((entity) => {
      const entityText = replaceEmoji(
        escapeHTML(rawMessage.substr(entity.offset, entity.length))
      );
      const textToHere = rawMessage.substring(currentOffset, entity.offset);
      html += textToHere;
      switch (entity.$t) {
        case "MessageEntityTextUrl":
          html += `<a href="${entity.url}" target="_blank">${entityText}</a>`;
          break;
        case "MessageEntityBlockquote":
          html += `<blockquote">${entityText}</blockquote>`;
          break;
        case "MessageEntityBold":
          html += `<strong>${entityText}</strong>`;
          break;
        case "MessageEntityItalic":
          html += `<em>${entityText}</em>`;
          break;
        case "MessageEntityMention":
          html += `<a href="#mention">${entityText}</a>`;
          break;
        case "MessageEntityMentionName":
          html += `<a href="#">${entityText}</a>`;
          break;
        case "MessageEntityUrl":
          html += `<a href="${entityText}" target="_blank">${entityText}</a>`;
          break;
        case "MessageEntityUnderline":
          html += `<u>${entityText}</u>`;
          break;
        case "MessageEntityPre":
          html += `<pre>${entityText}</pre>`;
          break;
        case "MessageEntityCode":
          html += `<span style="font-family: monospace; background: #00000014;">${entityText}</span>`;
          break;
        default:
          html += entityText;
      }

      currentOffset = entity.offset + entity.length;
    });
  } else {
    rawMessage = replaceEmoji(escapeHTML(rawMessage));
  }

  html += rawMessage.substring(currentOffset);

  return messageToParagraphs(html);
}

export function getChatSubdueText(peer: IPeer) {
  if (peer.full && peer.full.$t === "ChannelFull") {
    return `${Intl.NumberFormat("en-US").format(
      peer.full.participantsCount
    )} members`;
  }

  switch (peer.$t) {
    case "User":
      if (peer.status) {
        return getLastSeenTime(peer.status);
      }
      return peer.firstName;
    case "UserEmpty":
      return "Last seen a long time ago";
    case "Channel":
    case "ChannelForbidden":
      if (peer.megagroup) {
        return "&nbsp;";
      }

      return "Channel";
    case "Chat":
      return `${peer.participantsCount} members`;
    case "ChatForbidden":
      return "Deleted group";
    case "ChatEmpty":
      return "Deleted Group";
    default:
      return "Channel";
  }
}
