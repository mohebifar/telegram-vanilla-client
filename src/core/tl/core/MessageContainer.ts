import { BinaryReader } from "../../extensions/BinaryReader";
import { TLMessage } from "../../types";

export interface MessageContainer {
  messages: TLMessage[];
  $t: "MessageContainer";
}

export const CONSTRUCTOR_ID = 0x73f1f8dc;

// Maximum size in bytes for the inner payload of the container.
// Telegram will close the connection if the payload is bigger.
// The overhead of the container itself is subtracted.
export const MAXIMUM_SIZE = 1044456 - 8;

// Maximum amount of messages that can't be sent inside a single
// container, inclusive. Beyond this limit Telegram will respond
// with BAD_MESSAGE 64 (invalid container).
//
// This limit is not 100% accurate and may in some cases be higher.
// However, sending up to 100 requests at once in a single container
// is a reasonable conservative value, since it could also depend on
// other factors like size per request, but we cannot know this.
export const MAXIMUM_LENGTH = 100;

export function messageContainerReader(
  _,
  reader: BinaryReader
): MessageContainer {
  const messages: TLMessage[] = [];
  const length = reader.readInt();
  for (let x = 0; x < length; x++) {
    const msgId = reader.readLong();
    const seqNo = reader.readInt();
    const length = reader.readInt();
    const before = reader.getPosition();
    const obj = reader.tgReadObject() as any;
    reader.setPosition(before + length);
    const tlMessage = { msgId, seqNo, obj };
    messages.push(tlMessage);
  }

  return {
    $t: "MessageContainer",
    messages
  };
}
