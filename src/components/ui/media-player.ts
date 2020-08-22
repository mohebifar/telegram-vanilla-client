import { ISharedMedia } from "../../models/shared-media";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement, Element } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import Icon, { Icons } from "./icon";
import * as styles from "./media-lightbox.scss";
import Progress from "./progress";
import { DocumentAttributeVideo } from "../../core/tl/TLObjects";

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
  private imageSet = false;

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

  public setSrc(url: string) {
    this.image.src = url;
    this.imageSet = true;
  }

  public abort() {
    this.aborted = true;
  }

  public updateMedia(sharedMedia: ISharedMedia) {
    const { media } = sharedMedia;

    this.tg.fileStorage.downloadMedia(media, 0).then((url) => {
      if (!this.aborted && !this.imageSet) {
        this.setSrc(url);
        this.image.className = "blur";
      }
    });

    const isPhoto = media.$t === "MessageMediaPhoto";
    const videoAttribute =
      media.$t === "MessageMediaDocument" &&
      media.document.$t === "Document" &&
      (media.document.attributes.find(
        ({ $t }) => $t === "DocumentAttributeVideo"
      ) as DocumentAttributeVideo);
    const canStream = videoAttribute && videoAttribute.supportsStreaming;
    console.debug("Media is streamable: ", canStream);

    const createVideo = (src?: string) => {
      const video = createElement("video", {
        src,
        controls: "controls",
      }) as HTMLVideoElement;
      this.image.remove();
      this.mediaWrapper.prepend(video);

      return video;
    };

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
          createVideo(url);
        }
      });
  }
}
