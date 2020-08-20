import { BigInteger as JBigInt } from "big-integer";
import { concatBuffers, pack } from "../binary";
import {
  CONSTRUCTOR_ID as MESSAGE_CONTAINER_CONSTRUCTOR_ID,
  MAXIMUM_LENGTH,
  MAXIMUM_SIZE,
} from "../tl/core/MessageContainer";
import { MTProtoState } from "./MTProtoState";
import { RequestState } from "./RequestState";

const SIZE_OVERHEAD = 12;

interface MessagePack {
  batch: RequestState[];
  data: Uint8Array;
}

export class MessagePacker {
  private ready: Promise<void | boolean>;
  private setReady: (state?: boolean) => void;
  private queue: RequestState[] = [];
  private timer = 0;

  constructor(private state: MTProtoState) {
    this.ready = new Promise((resolve) => {
      this.setReady = resolve;
    });
  }

  values() {
    return this.queue;
  }

  private endWait() {
    if (this.timer) {
      return;
    }

    this.timer = setTimeout(() => {
      this.timer = 0;
      this.setReady(true);
    }, 1);
  }

  append(state: RequestState) {
    this.queue.push(state);
    this.endWait();
  }

  prepend(state: RequestState) {
    this.queue.unshift(state);
    this.endWait();
  }

  extend(states: RequestState[]) {
    for (const state of states) {
      this.queue.push(state);
    }
    this.endWait();
  }

  async get(): Promise<MessagePack> {
    if (!this.queue.length) {
      this.ready = new Promise((resolve) => {
        this.setReady = resolve;
      });
      await this.ready;
    }
    let buffer = new Uint8Array(0);

    const batch: RequestState[] = [];
    let size = 0;

    while (this.queue.length && batch.length <= MAXIMUM_LENGTH) {
      const state = this.queue.shift();
      size += state.data.length + SIZE_OVERHEAD;
      if (size <= MAXIMUM_SIZE) {
        let afterId: JBigInt;
        // if (state.after) {
        //   afterId = state.after.msgId;
        // }
        const [message, msgId] = this.state.writeDataAsMessage(
          state.data,
          state.isRequest,
          afterId
        );

        console.debug(`Assigned msgId = ${state.msgId} to ${state.request.$t}`);

        state.msgId = msgId;
        buffer = concatBuffers([buffer, message]);
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
    } else if (batch.length === 1) {
      return { batch, data: buffer };
    } else {
      const containerData = concatBuffers([
        pack(MESSAGE_CONTAINER_CONSTRUCTOR_ID, "I"),
        pack(batch.length, "i", true),
        buffer,
      ]);

      const [data, containerId] = this.state.writeDataAsMessage(
        containerData,
        false
      );

      for (const state of batch) {
        state.containerId = containerId;
      }

      return { batch, data };
    }
  }
}
