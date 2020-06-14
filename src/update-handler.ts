import { BigInteger as JBigInt } from "big-integer";
import {
  UpdateDeleteChannelMessages,
  UpdateDeleteMessages,
  UpdateNewChannelMessage,
  UpdateNewMessage,
  UpdateReadChannelInbox,
  UpdateReadHistoryInbox,
  UpdateShortChatMessage,
  UpdateShortMessage,
  UpdateShortSentMessage,
  UpdateUserStatus,
  UpdateChatUserTyping,
  UpdateUserTyping,
  UpdateReadChannelOutbox,
  UpdateReadHistoryOutbox,
  UpdateMessagePoll,
} from "./core/tl/TLObjects";
import { extractIdFromPeer } from "./core/tl/utils";
import { IMessage, Message } from "./models/message";
import { Peer } from "./models/peer";
import { AllUpdateTypes, DialogMessageTypes } from "./utils/useful-types";
import { Dialog, IDialog } from "./models/dialog";

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
    case "UpdateReadHistoryOutbox":
    case "UpdateReadChannelOutbox":
      handleUpdateReadOutbox(update);
      break;
    case "UpdateUserStatus":
      handleUpdateUserStatus(update);
      break;
    case "UpdateDeleteMessages":
      handleUpdateDeleteMessages(update, 0);
      break;
    case "UpdateDeleteChannelMessages":
      handleUpdateDeleteMessages(update, update.channelId);
      break;
    case "UpdateUserTyping":
    case "UpdateChatUserTyping":
      handleUpdateTyping(update);
      break;
    case "UpdateMessagePoll":
      handleUpdateMessagePoll(update);
      break;
    default:
      console.debug("Unsupported update", update);
  }
}

async function handleUpdateMessagePoll(update: UpdateMessagePoll) {
  const message = Message.pollToMessage.get(update.pollId) as any;
  if (!message) {
    return;
  }

  message.media = {
    ...message._proxy.media,
    poll: {
      ...message.poll,
      ...update.poll,
    },
    results: {
      ...message.results,
      ...update.results,
    },
  };

  message.save();
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

    if (
      "media" in transientMessage.message &&
      transientMessage.message.media.$t === "TransientMedia" &&
      "media" in messageObject
    ) {
      message.tg.fileStorage.assignUploadedFile(
        messageObject.media,
        transientMessage.message.media.fileId
      );
    }

    message.assignValues(fieldsToUpdate);
    if (message.$t === "Message") {
      const self = await Peer.getSelf();
      message.fromId = self.user && (self.user as any).id;
    }

    message.justSent = false;
    message.save();
    requestAnimationFrame(() => {
      Message.events.emit("synced", {
        clientId: transientMessage.randomId,
        message,
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
  if (message.$t === "Message") {
    dialog.clearTypingTimeout(message.fromId);
  }
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

async function handleUpdateReadOutbox(
  update: UpdateReadHistoryOutbox | UpdateReadChannelOutbox
) {
  const peer = await Peer.get(
    update.$t === "UpdateReadChannelOutbox"
      ? { type: "Channel", id: update.channelId }
      : extractIdFromPeer(update.peer)
  );
  const dialog = await peer.getDialog();
  if (dialog) {
    const prevMaxId = dialog.readOutboxMaxId;
    dialog.readOutboxMaxId = update.maxId;
    dialog.save();

    Dialog.events.emit("seen", { dialog, maxId: update.maxId, prevMaxId });
  }
}

async function handleUpdateUserStatus(update: UpdateUserStatus) {
  const peer = await Peer.get({ type: "User", id: update.userId });
  if (peer && peer.$t === "User") {
    peer.status = update.status;
    peer.save();
  }
}

async function handleUpdateDeleteMessages(
  update: UpdateDeleteMessages | UpdateDeleteChannelMessages,
  channelId: number
) {
  for (const id of update.messages) {
    const model = await Message.get({ id, channelId });
    if (model) {
      model.destroy();
    }
  }
}

async function handleUpdateTyping(
  update: UpdateUserTyping | UpdateChatUserTyping
) {
  let dialog: IDialog;
  if (update.$t === "UpdateUserTyping") {
    dialog = await Dialog.get({
      peerId: update.userId,
      peerType: "User",
    });
  } else {
    dialog = await Dialog.get({
      peerId: update.chatId,
      peerType: "Chat",
    });
    if (!dialog) {
      dialog = await Dialog.get({
        peerId: update.chatId,
        peerType: "Channel",
      });
    }
  }

  if (dialog) {
    dialog.setTyping(update.userId, update.action);
  }
}
