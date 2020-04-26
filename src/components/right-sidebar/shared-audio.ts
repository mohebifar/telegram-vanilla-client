import { IPeer } from "../../models/peer";
import { ISharedMedia, SharedMedia } from "../../models/shared-media";
import { Component, createElement, on, addClass } from "../../utils/dom";
import AudioAttachment from "../attachments/audio-player";
import Spinner from "../ui/spinner";
import * as styles from "./shared-audio.scss";

interface Options {
  peer: IPeer;
}

export default class SharedAudio implements Component<Options> {
  public readonly element: HTMLElement;
  private peer: IPeer;
  private lock = false;
  private last: ISharedMedia;

  constructor({ peer }: Options) {
    this.peer = peer;

    this.element = createElement(
      "div",
      { class: styles.container },
      createElement(Spinner, { size: "40px", color: "blue" })
    );

    on(this.element, "scroll", () => {
      if (this.lock) {
        return;
      }

      if (this.isAtBottom()) {
        this.load();
      }
    });

    this.load();
  }

  private async load() {
    this.lock = true;
    const sharedMedia = await SharedMedia.fetch(this.peer, {
      offsetId: (this.last && this.last.id) || 0,
      addOffset: 0,
      limit: 15,
      type: "InputMessagesFilterMusic"
    });
    addClass(this.element, styles.loaded);

    if (sharedMedia.length > 0) {
      let media: ISharedMedia;
      for (media of sharedMedia) {
        this.addAudio(media);
      }
      this.last = media;
      this.lock = false;
    }
  }

  private async addAudio(media: ISharedMedia) {
    if (media.media.$t !== "MessageMediaDocument") {
      return;
    }
    const element = createElement(AudioAttachment, {
      media: media.media,
      tg: this.peer.tg
    });

    this.element.append(element);
  }

  private isAtBottom(threshold = 50) {
    const obj = this.element;
    return (
      Math.abs(obj.scrollTop - (obj.scrollHeight - obj.offsetHeight)) <
      threshold
    );
  }
}
