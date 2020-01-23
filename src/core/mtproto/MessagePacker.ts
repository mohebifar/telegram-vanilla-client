import { RequestState } from "./RequestState";
import { MTProtoState } from "./MTProtoState";
import { pack, concatBuffers } from "../../utils/binary";
import { BinaryWriter } from "../extensions/BinaryWriter";
import {
  MAXIMUM_LENGTH,
  MAXIMUM_SIZE,
  CONSTRUCTOR_ID as MESSAGE_CONTAINER_CONSTRUCTOR_ID
} from "../tl/core/MessageContainer";

const SIZE_OVERHEAD = 12;

interface MessagePack {
  batch: RequestState[];
  data: Uint8Array;
}

export class MessagePacker {
  private ready: Promise<void | boolean>;
  private setReady: (state?: boolean) => void;
  private queue: RequestState[] = [];

  constructor(private state: MTProtoState) {
    this.ready = new Promise(resolve => {
      this.setReady = resolve;
    });
  }

  values() {
    return this.queue;
  }

  append(state: RequestState) {
    this.queue.push(state);
    this.setReady(true);
  }

  prepend(state: RequestState) {
    this.queue.unshift(state);
    this.setReady(true);
  }

  extend(states: RequestState[]) {
    for (const state of states) {
      this.queue.push(state);
    }
    this.setReady(true);
  }

  async get(): Promise<MessagePack> {
    if (!this.queue.length) {
      this.ready = new Promise(resolve => {
        this.setReady = resolve;
      });
      await this.ready;
    }
    let data: Uint8Array;
    const buffer = new BinaryWriter(new Uint8Array(0));

    const batch: RequestState[] = [];
    let size = 0;

    while (this.queue.length && batch.length <= MAXIMUM_LENGTH) {
      const state = this.queue.shift();
      size += state.data.length + SIZE_OVERHEAD;
      if (size <= MAXIMUM_SIZE) {
        let afterId: bigint;
        // if (state.after) {
        //   afterId = state.after.msgId;
        // }
        state.msgId = this.state.writeDataAsMessage(
          buffer,
          state.data,
          state.isRequest,
          afterId
        );

        console.debug(
          `Assigned msgId = ${state.msgId} to ${state.request.$t}`
        );

        buffer.write(state.data);
        batch.push(state);
        continue;
      }
      if (batch.length) {
        this.queue.unshift(state);
        break;
      }
      console.warn(
        `Message payload for ${state.request.$t} is too long ${state.data.length} and cannot be sent`
      );

      // Request Payload is too big
      state.reject();
      size = 0;
      continue;
    }
    if (!batch.length) {
      return null;
    }

    data = concatBuffers([
      pack(MESSAGE_CONTAINER_CONSTRUCTOR_ID, "I", false),
      pack(batch.length, "i", true),
      buffer.getValue()
    ]);

    const containerId = this.state.writeDataAsMessage(buffer, data, false);

    for (const state of batch) {
      state.containerId = containerId;
    }

    data = buffer.getValue();
    return { batch, data };
  }
}
