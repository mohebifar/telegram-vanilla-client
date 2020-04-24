import { IPeer } from "../../models/peer";
import { ISharedMedia, SharedMedia } from "../../models/shared-media";
import { Component, createElement, on } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import { mediaLightBox } from "../ui/media-lightbox";
import * as styles from "./shared-media.scss";

interface Options {
  peer: IPeer;
}

export default class SharedMediaPanel implements Component<Options> {
  public readonly element: HTMLElement;
  private peer: IPeer;
  private lock = false;
  private last: ISharedMedia;

  constructor({ peer }: Options) {
    this.peer = peer;

    this.element = createElement("div", {
      class: styles.container,
    });

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
      limit: 3 * 8,
    });

    if (sharedMedia.length > 0) {
      let media: ISharedMedia;
      for (media of sharedMedia) {
        this.addMedia(media);
      }
      this.last = media;
      this.lock = false;
    }
  }

  private async addMedia(media: ISharedMedia) {
    let initialPhoto = EMPTY_IMG;
    const img = createElement("img", {
      src: initialPhoto,
    }) as HTMLImageElement;
    const element = createElement("button", { class: styles.tile }, img);
    on(element, "click", () => {
      mediaLightBox({
        source: element,
        peer: this.peer,
        initialPhoto,
        message: media,
        tg: this.peer.tg,
      });
    });

    let loaded = false;
    this.peer.tg.fileStorage.downloadMedia(media.media, 0).then((url) => {
      if (!loaded) {
        initialPhoto = url;
        img.src = url;
      }
    });

    this.peer.tg.fileStorage.downloadMedia(media.media, 1).then((url) => {
      loaded = true;
      initialPhoto = url;
      img.src = url;
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
