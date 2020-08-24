import { ISharedMedia } from "../../models/shared-media";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement, Element } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import Icon, { Icons } from "./icon";
import * as styles from "./media-lightbox.scss";
import Progress from "./progress";
import { Document } from "../../core/tl/TLObjects";
import { canStream } from "../../utils/video";

export interface Options {
  tg: TelegramClientProxy;
}

export class MediaPlayer implements Component<Options> {
  public readonly element: HTMLElement;

  public image: HTMLImageElement;
  public nextButton: HTMLElement;
  public prevButton: HTMLElement;
  public footer: HTMLElement;
  private progress: Element<Progress>;
  private downloadIndicator: HTMLElement;
  private aborted = false;
  private tg: Options["tg"];
  private imageSet = -1;
  private video?: HTMLVideoElement;

  public mediaWrapper: HTMLElement;

  constructor({ tg }: Options) {
    this.tg = tg;
    this.image = createElement("img", { src: EMPTY_IMG }) as HTMLImageElement;
    this.footer = createElement("div", { class: styles.footer });
    this.nextButton = createElement(
      "button",
      { class: styles.navButton + " " + styles.next + " hidden" },
      createElement(Icon, { icon: Icons.Down, color: "white" })
    );
    this.prevButton = createElement(
      "button",
      { class: styles.navButton + " " + styles.prev + " hidden" },
      createElement(Icon, { icon: Icons.Down, color: "white" })
    );

    this.mediaWrapper = createElement(
      "div",
      { class: styles.mediaWrapper },
      this.image,
      this.nextButton,
      this.prevButton
    );

    this.element = createElement(
      "div",
      { class: styles.mediaAbsoluteContainer },
      this.mediaWrapper,
      this.footer
    );

    this.progress = createElement(Progress);
    this.downloadIndicator = createElement(
      "div",
      { class: "downloadIndicator" },
      this.progress
    );

    this.mediaWrapper.append(this.downloadIndicator);
  }

  public setSrc(url: string, size = 2) {
    this.image.src = url;
    if (this.video) {
      this.video.setAttribute("poster", url);
    }
    this.imageSet = size;
  }

  public abort() {
    this.aborted = true;
  }

  public async updateMedia(sharedMedia: ISharedMedia) {
    const { media } = sharedMedia;
    [0, 1].forEach((size) => {
      this.tg.fileStorage.downloadMedia(media, size).then((url) => {
        if (!this.aborted && this.imageSet < size) {
          this.setSrc(url);
          this.image.className = size === 0 ? "blur" : "";
        }
      });
    });

    const isPhoto = media.$t === "MessageMediaPhoto";
    const shouldStream =
      media.$t === "MessageMediaDocument" &&
      (await canStream(media.document)) &&
      !(await this.tg.fileStorage.documentIsCached(media.document as any));

    const createVideo = (src?: string) => {
      const video = createElement(
        "video",
        {
          controls: "controls",
          autoplay: "autoplay",
          playsinline: "playsinline",
        },
        createElement("source", {
          src,
        })
      ) as HTMLVideoElement;
      this.image.remove();
      this.mediaWrapper.prepend(video);

      video.setAttribute("poster", this.image.src);

      if (this.downloadIndicator) {
        this.downloadIndicator.remove();
      }

      return video;
    };

    if (shouldStream) {
      const document = (media as any).document as Document;
      const id = [
        document.id,
        document.dcId,
        document.accessHash,
        document.fileReference.join(","),
      ].join("_");

      this.video = createVideo(
        `/streaming/file?id=${id}&size=${document.size}&mime_type=video/mp4`
      );
      return;
    }

    this.tg.fileStorage
      .downloadMedia(media, undefined, (t) => {
        if (this.aborted) {
          return false;
        }

        if (this.progress) {
          this.progress.instance.progress(t);
        }

        return true;
      })
      .then((url) => {
        if (this.aborted) {
          return;
        }

        if (this.downloadIndicator) {
          this.downloadIndicator.remove();
        }

        if (isPhoto) {
          this.image.className = "";
          this.setSrc(url);
        } else {
          this.video = createVideo(url);
        }
      });
  }
}
