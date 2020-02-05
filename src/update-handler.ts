import { BigInteger as JBigInt } from "big-integer";
import {
  UpdateNewChannelMessage,
  UpdateNewMessage,
  UpdateReadHistoryInbox,
  UpdateShortChatMessage,
  UpdateShortMessage,
  UpdateShortSentMessage,
  UpdateUserStatus,
  UpdateReadChannelInbox
} from "./core/tl/TLObjects";
import { extractIdFromPeer } from "./core/tl/utils";
import { IMessage, Message } from "./models/message";
import { Peer } from "./models/peer";
import { AllUpdateTypes, DialogMessageTypes } from "./utils/useful-types";

interface TransientMessageData {
  randomId: JBigInt;
  message: IMessage;
}

interface Extras {
  transientMessage?: TransientMessageData;
}

/*
 * This function handles all incoming updates that are not direct result of user interaction
 */
export function handleUpdate(update: AllUpdateTypes, extras: Extras = {}) {
  switch (update.$t) {
    case "UpdateNewMessage":
    case "UpdateShortMessage":
    case "UpdateShortSentMessage":
    case "UpdateShortChatMessage":
    case "UpdateNewChannelMessage":
      handleNewMessageUpdate(update, extras.transientMessage);
      break;
    case "Updates":
      for (const individualUpdate of update.updates) {
        handleUpdate(individualUpdate, extras);
      }
      break;
    case "UpdateShort":
      handleUpdate(update.update);
      break;
    case "UpdateReadHistoryInbox":
    case "UpdateReadChannelInbox":
      handleUpdateReadInbox(update);
      break;
    case "UpdateUserStatus":
      handleUpdateUserStatus(update);
      break;
    default:
      console.debug("Unsupported update", update);
  }
}

async function handleNewMessageUpdate(
  update:
    | UpdateShortMessage
    | UpdateNewMessage
    | UpdateNewChannelMessage
    | UpdateShortChatMessage
    | UpdateShortSentMessage,
  transientMessage?: TransientMessageData
) {
  let messageObject:
    | DialogMessageTypes
    | UpdateShortMessage
    | UpdateShortSentMessage
    | UpdateShortChatMessage;

  if (
    update.$t === "UpdateNewChannelMessage" ||
    update.$t === "UpdateNewMessage"
  ) {
    messageObject = update.message;
  } else {
    messageObject = update;
  }

  const message = transientMessage
    ? transientMessage.message
    : Message.fromObject(messageObject);

  const peer = await message.getPeer();
  if (!peer) {
    return undefined;
  }

  if (transientMessage) {
    const {
      $t,
      constructorId,
      subclassOfId,
      out,
      ...fieldsToUpdate
    } = messageObject as any;

    message.assignValues(fieldsToUpdate);
    message.justSent = false;
    message.save();
    requestAnimationFrame(() => {
      Message.events.emit("synced", {
        clientId: transientMessage.randomId,
        message
      });
    });
  } else {
    message.save();
  }

  const dialog = await peer.getDialog();
  if (!dialog) {
    return undefined;
  }

  if (!("out" in message) || !message.out) {
    dialog.unreadCount += 1;
  }

  dialog.lastMessageDate = message.date.unix();
  dialog.topMessage = message.id;
  dialog.save();
}

async function handleUpdateReadInbox(
  update: UpdateReadHistoryInbox | UpdateReadChannelInbox
) {
  const peer = await Peer.get(
    update.$t === "UpdateReadChannelInbox"
      ? { type: "Channel", id: update.channelId }
      : extractIdFromPeer(update.peer)
  );
  const dialog = await peer.getDialog();
  if (dialog) {
    dialog.unreadCount = update.stillUnreadCount;
    dialog.readInboxMaxId = update.maxId;
    dialog.save();
  }
}

async function handleUpdateUserStatus(update: UpdateUserStatus) {
  const peer = await Peer.get({ type: "User", id: update.userId });
  if (peer && peer.$t === "User") {
    peer.status = update.status;
    peer.save();
  }
}
