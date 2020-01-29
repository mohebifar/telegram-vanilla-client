import {
  UpdateNewChannelMessage,
  UpdateNewMessage,
  UpdateShortMessage,
  UpdateShortChatMessage
} from "./core/tl/TLObjects";
import { Message } from "./models/message";
import { AllUpdateTypes, DialogMessageTypes } from "./utils/useful-types";

/*
 * This function handles all incoming updates that are not direct result of user interaction
 */
export function handleUpdate(update: AllUpdateTypes) {
  switch (update.$t) {
    case "UpdateNewMessage":
    case "UpdateShortMessage":
    case "UpdateShortChatMessage":
    case "UpdateNewChannelMessage":
      handleNewMessageUpdate(update);
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
) {
  let messageObject:
    | DialogMessageTypes
    | UpdateShortMessage
    | UpdateShortChatMessage;

  if (
    update.$t === "UpdateNewChannelMessage" ||
    update.$t === "UpdateNewMessage"
  ) {
    messageObject = update.message;
  } else {
    messageObject = update;
  }

  const message = Message.fromObject(messageObject);

  const peer = await message.getPeer();
  if (!peer) {
    return undefined;
  }

  const dialog = await peer.getDialog();
  if (!dialog) {
    return undefined;
  }

  message.save();


  if (!("out" in message) || !message.out) {
    console.log('message', message)
    dialog.unreadCount += 1;
  }

  dialog.lastMessageDate = message.date.unix();
  dialog.topMessage = message.id;
  dialog.save();
}
