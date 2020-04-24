import { MessageEntityTextUrl } from "../../core/tl/TLObjects";
import { IPeer } from "../../models/peer";
import { ISharedMedia, SharedMedia } from "../../models/shared-media";
import { Component, createElement, on } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import * as styles from "./shared-links.scss";

interface Options {
  peer: IPeer;
}

export default class SharedLinks implements Component<Options> {
  public readonly element: HTMLElement;
  private peer: IPeer;
  private lock = false;
  private last: ISharedMedia;

  constructor({ peer }: Options) {
    this.peer = peer;

    this.element = createElement("div", {
      class: styles.container
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
      limit: 10,
      type: "InputMessagesFilterUrl"
    });

    if (sharedMedia.length > 0) {
      let media: ISharedMedia;
      for (media of sharedMedia) {
        this.addLink(media);
      }
      this.last = media;
      this.lock = false;
    }
  }

  private async addLink(media: ISharedMedia) {
    let url = media.message;
    let displayUrl = url;
    let title: string;
    let description: string;

    const schemeRegex = /^https?:\/\//;

    if (
      media.media &&
      media.media.$t === "MessageMediaWebPage" &&
      media.media.webpage &&
      media.media.webpage.$t === "WebPage"
    ) {
      url = media.media.webpage.url;
      displayUrl = media.media.webpage.displayUrl;
      description = media.media.webpage.description;
      return;
    } else if (media.entities) {
      const urlEntity = media.entities.find(
        ({ $t }) => $t === "MessageEntityTextUrl"
      ) as MessageEntityTextUrl;
      if (urlEntity) {
        url = urlEntity.url;
      }
    }

    if (!schemeRegex.test(url)) {
      return;
    }
    displayUrl = url.replace(schemeRegex, "");

    const img = createElement("img", {
      src: EMPTY_IMG
    }) as HTMLImageElement;

    const element = createElement(
      "a",
      { class: styles.item, href: url, target: "_blank" },
      createElement("div", { class: styles.imgWrapper }, img),
      createElement(
        "div",
        title ? createElement("h2", title) : "",
        description
          ? createElement(
              "div",
              { class: styles.description },
              description.slice(0, 200) +
                (description.length > 200 ? "..." : "")
            )
          : "",
        createElement("a", { class: styles.link }, displayUrl)
      )
    );

    if (media.media) {
      this.peer.tg.fileStorage.downloadMedia(media.media, 0).then(url => {
        if (url) {
          img.src = url;
        }
      });
    }

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
