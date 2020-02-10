import dayjs from "dayjs";
import {
  MessageMediaPhoto,
  Photo,
  PhotoSize,
  DocumentAttributeVideo,
  Document,
  MessageMediaDocument,
  Message
} from "../../core/tl/TLObjects";
import { IMessage } from "../../models/message";
import { SharedMedia, ISharedMedia } from "../../models/shared-media";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { sortPhotoSizes } from "../../utils/chat";
import {
  Component,
  createElement,
  getNthChild,
  Element
} from "../../utils/dom";
import { startAnimation } from "../../utils/easing";
import { EMPTY_IMG } from "../../utils/images";
import Icon, { Icons } from "./icon";
import IconButton from "./icon-button";
import * as styles from "./media-lightbox.scss";
import { saveData } from "../../utils/upload-file";
import Progress from "./progress";
import { IPeer } from "../../models/peer";

const sortRef = ["x", "y", "m", "s"];

export interface Options {
  tg: TelegramClientProxy;
  onPrevClick: Function;
  onNextClick: Function;
}

export class LightBox implements Component<Options> {
  public readonly element: HTMLElement;

  private image: HTMLImageElement;
  private media: ISharedMedia;
  private mediaContainer: HTMLElement;
  private nextButton: HTMLElement;
  private prevButton: HTMLElement;
  private tg: TelegramClientProxy;
  private closed = false;

  public mediaWrapper: HTMLElement;

  constructor({ tg }: Options) {
    this.tg = tg;

    const sender = createElement("div");
    const buttons = createElement(
      "div",
      createElement(IconButton, { icon: Icons.Delete, variant: "dark" }),
      createElement(IconButton, { icon: Icons.Forward, variant: "dark" }),
      createElement(IconButton, {
        icon: Icons.Download,
        variant: "dark",
        onClick: () => {
          tg.fileStorage.downloadMedia(this.media.media).then(file => {
            const date = dayjs.unix(this.media.date);
            const formattedDate = date.format("YYYY-MM-DD-HHmmss");
            saveData(file, `photo-${formattedDate}.jpg`);
          });
        }
      }),
      createElement(IconButton, {
        icon: Icons.Close,
        variant: "dark",
        onClick: () => this.close()
      })
    );
    const header = createElement(
      "div",
      { class: styles.header },
      sender,
      buttons
    );

    const [newImmediate, mediaWrapper] = this.createMediaWrapper();
    this.mediaWrapper = mediaWrapper;
    this.mediaContainer = createElement(
      "div",
      { class: styles.mediaContainer },
      newImmediate
    );
    this.element = createElement(
      "div",
      { class: styles.container },
      header,
      this.mediaContainer
    );

    const hotkeys = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        this.element.removeEventListener("keydown", hotkeys);
        this.close();
      }
    };

    this.element.addEventListener("keydown", hotkeys);
  }

  public setSrc(src: string) {
    this.image.src = src;
  }

  public close() {
    this.closed = true;
    startAnimation({ o: { from: 1, to: 0 } }, v => {
      this.element.style.opacity = v.o + "";
      if (v.o === 0) {
        this.element.remove();
      }
    });
  }

  public setMedia(sharedMedia: ISharedMedia, flip: 1 | 0 | -1) {
    this.media = sharedMedia;
    const { media } = sharedMedia;

    const size = getSize(media as any);
    let progress: Element<Progress>;
    let downloadIndicator: HTMLElement;

    if (flip !== 0) {
      progress = createElement(Progress);
      const oldWrapper = this.mediaWrapper;
      const oldImmediate = getNthChild(this.mediaContainer, "first");
      const [newImmediate, newWrapper] = this.createMediaWrapper();
      newWrapper.style.width = size.w + "px";
      newWrapper.style.height = size.h + "px";
      newWrapper.append(
        (downloadIndicator = createElement(
          "div",
          { class: "downloadIndicator" },
          progress
        ))
      );

      this.mediaWrapper = newWrapper;
      this.mediaContainer.append(newImmediate);

      this.tg.fileStorage.downloadMedia(media, 0).then(url => {
        if (this.media === sharedMedia) {
          this.setSrc(url);
          this.image.className = "blur";
        }
      });

      const oldTo =
        flip * -1 * (window.innerWidth + parseInt(oldWrapper.style.width) / 2);
      const newFrom = flip * (window.innerWidth - size.w / 2);

      startAnimation(
        {
          old: { from: 0, to: oldTo },
          new: { from: newFrom, to: 0 }
        },
        v => {
          oldImmediate.style.transform = `translateX(${v.old}px)`;
          newImmediate.style.transform = `translateX(${v.new}px)`;
        },
        () => oldImmediate.remove()
      );
    }

    this.tg.fileStorage
      .downloadMedia(media, undefined, t => {
        if (this.media !== sharedMedia) {
          return false;
        }

        if (progress) {
          progress.instance.progress(t);
        }

        return !this.closed;
      })
      .then(url => {
        if (this.media === sharedMedia) {
          if (downloadIndicator) {
            downloadIndicator.remove();
          }

          if (media.$t === "MessageMediaPhoto") {
            this.image.className = "";
            this.setSrc(url);
          } else {
            const video = createElement("video", {
              src: url,
              controls: "controls"
            });
            this.image.remove();
            this.mediaWrapper.prepend(video);
          }
        }
      });

    this.updateButtons();
  }

  private createMediaWrapper() {
    this.image = createElement("img", { src: EMPTY_IMG }) as HTMLImageElement;
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

    const mediaWrapper = createElement(
      "div",
      { class: styles.mediaWrapper },
      this.image,
      this.nextButton,
      this.prevButton
    );

    return [
      createElement(
        "div",
        { class: styles.mediaAbsoluteContainer },
        mediaWrapper
      ),
      mediaWrapper
    ];
  }

  private updateButtons() {
    if (this.media) {
      this.media.getNext().then(media => {
        if (media) {
          this.nextButton.classList.remove("hidden");

          this.nextButton.onclick = async () => {
            this.setMedia(media, -1);
          };
        }
      });

      this.media.getPrev().then(media => {
        if (media) {
          this.prevButton.classList.remove("hidden");

          this.prevButton.onclick = async () => {
            this.setMedia(media, 1);
          };
        }
      });
    }
  }
}

function getSize(
  media: MessageMediaPhoto | MessageMediaDocument
): { w: number; h: number } {
  if (media.$t === "MessageMediaPhoto") {
    const sizes = sortPhotoSizes((media.photo as Photo).sizes, sortRef);
    return sizes[0] as PhotoSize;
  } else {
    return (media.document as Document).attributes.find(
      ({ $t }) => $t === "DocumentAttributeVideo"
    ) as DocumentAttributeVideo;
  }
}

export function mediaLightBox({
  source,
  peer,
  message,
  initialPhoto,
  tg
}: {
  source: HTMLElement;
  peer: IPeer;
  message: IMessage | ISharedMedia;
  initialPhoto: string;
  tg: TelegramClientProxy;
}) {
  const container = createElement(LightBox, {
    tg,
    onNextClick() {},
    onPrevClick() {}
  });
  const mediaWrapper = container.instance.mediaWrapper;

  const media = (message as Message).media;
  const size = getSize(media as any);
  container.style.opacity = "0";
  mediaWrapper.style.width = size.w + "px";
  mediaWrapper.style.height = size.h + "px";
  container.instance.setSrc(initialPhoto);

  requestAnimationFrame(() => {
    const rectDest = mediaWrapper.getBoundingClientRect() as DOMRect;
    const rect = source.getBoundingClientRect() as DOMRect;
    const scale = rect.width / rectDest.width;
    const coefficient = (1 - scale) / 2;
    const startingX = rectDest.x + coefficient * size.w;
    const startingY = rectDest.y + coefficient * size.h;

    container.style.opacity = "1";
    mediaWrapper.style.opacity = "0";

    startAnimation(
      {
        bdrs: {
          from: 12,
          to: 0
        },
        x: {
          from: (rect.x - startingX) / scale,
          to: 0
        },
        y: {
          from: (rect.y - startingY) / scale,
          to: 0
        },
        scale: {
          from: scale,
          to: 1
        }
      },
      v => {
        mediaWrapper.style.opacity = "1";
        mediaWrapper.style.transform = `scale(${v.scale}) translate(${v.x}px, ${v.y}px)`;
        mediaWrapper.style.borderRadius = v.bdrs + "px";
      },
      () => {
        const exists = SharedMedia.getFromMemory({
          peerType: peer.type,
          peerId: peer.id,
          id: message.id
        }) as ISharedMedia;

        if (exists) {
          container.instance.setMedia(exists, 0);
          return;
        }

        SharedMedia.fetch(peer, { offsetId: message.id }).then(media => {
          container.instance.setMedia(
            media.find(({ id }) => id === message.id),
            0
          );
        });
      }
    );
  });

  document.body.append(container);
}
