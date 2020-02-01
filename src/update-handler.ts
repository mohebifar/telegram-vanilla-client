import { BigInteger as JBigInt } from "big-integer";
import {
  UpdateNewChannelMessage,
  UpdateNewMessage,
  UpdateShortChatMessage,
  UpdateShortMessage,
  UpdateShortSentMessage
} from "./core/tl/TLObjects";
import { IMessage, Message } from "./models/message";
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
