import dayjs from "dayjs";
import {
  Document,
  DocumentAttributeVideo,
  Message as TLMessage,
  MessageMediaDocument,
  MessageMediaPhoto,
  Photo,
  PhotoSize,
  DocumentAttributeFilename,
} from "../../core/tl/TLObjects";
import { Message, IMessage } from "../../models/message";
import { IPeer } from "../../models/peer";
import { ISharedMedia, SharedMedia } from "../../models/shared-media";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { sortPhotoSizes } from "../../utils/chat";
import {
  Component,
  createElement,
  Element,
  getNthChild,
  off,
  on,
  removeClass,
} from "../../utils/dom";
import { startAnimation } from "../../utils/easing";
import { EMPTY_IMG } from "../../utils/images";
import { fitImageSize, saveData } from "../../utils/upload-file";
import Avatar from "./avatar";
import Icon, { Icons } from "./icon";
import IconButton from "./icon-button";
import * as styles from "./media-lightbox.scss";
import Progress from "./progress";
import { throttle } from "../../utils/utils";

const sortRef = ["x", "y", "m", "s"];

export interface Options {
  tg: TelegramClientProxy;
}

export class LightBox implements Component<Options> {
  public readonly element: HTMLElement;

  private image: HTMLImageElement;
  private media: ISharedMedia;
  private peer: IPeer;
  private mediaContainer: HTMLElement;
  private nextButton: HTMLElement;
  private prevButton: HTMLElement;
  private sender: HTMLElement;
  private footer: HTMLElement;
  private tg: TelegramClientProxy;
  private container: HTMLElement;
  private closed = false;

  public mediaWrapper: HTMLElement;

  constructor({ tg }: Options) {
    this.tg = tg;

    on(document.body, "click", this.handleContainerClick, true);
    on(document, "keyup", this.handleKeyboard);

    this.sender = createElement("div");
    const buttons = createElement(
      "div",
      createElement(IconButton, { icon: Icons.Delete, variant: "dark" }),
      createElement(IconButton, { icon: Icons.Forward, variant: "dark" }),
      createElement(IconButton, {
        icon: Icons.Download,
        variant: "dark",
        onClick: () => {
          tg.fileStorage.downloadMedia(this.media.media).then((file) => {
            const date = dayjs.unix(this.media.date);
            const formattedDate = date.format("YYYY-MM-DD-HHmmss");

            let fileName = `photo-${formattedDate}.jpg`;

            if (this.media.media.$t === "MessageMediaDocument") {
              const fileNameAttribute = (this.media.media
                .document as Document).attributes.find(
                (t) => t.$t === "DocumentAttributeFilename"
              ) as DocumentAttributeFilename;
              if (fileNameAttribute) {
                fileName = fileNameAttribute.fileName;
              }
            }

            saveData(file, fileName);
          });
        },
      }),
      createElement(IconButton, {
        icon: Icons.Close,
        variant: "dark",
        onClick: () => this.close(),
      })
    );
    const header = createElement(
      "div",
      { class: styles.header },
      this.sender,
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
        off(this.element, "keydown", hotkeys);
        this.close();
      }
    };

    on(this.element, "keydown", hotkeys);
  }

  public setSrc(src: string) {
    this.image.src = src;
  }

  public close() {
    off(document.body, "click", this.handleContainerClick, true);
    off(document, "keyup", this.handleKeyboard);

    this.closed = true;
    startAnimation(
      { o: { from: 1, to: 0 } },
      (v) => {
        this.element.style.opacity = v.o + "";
      },
      () => this.element.remove()
    );
  }

  public setMedia(sharedMedia: ISharedMedia, flip: 1 | 0 | -1) {
    this.media = sharedMedia;
    const { media } = sharedMedia;

    const size = getSize(media as any);
    let progress: Element<Progress>;
    let downloadIndicator: HTMLElement;
    progress = createElement(Progress);
    downloadIndicator = createElement(
      "div",
      { class: "downloadIndicator" },
      progress
    );

    if (flip !== 0) {
      const oldWrapper = this.mediaWrapper;
      const oldImmediate = getNthChild(this.mediaContainer, "first");
      const [newImmediate, newWrapper] = this.createMediaWrapper();

      const [w, h] = getImageSize(size.w, size.h);
      newWrapper.style.width = w + "px";
      newWrapper.style.height = h + "px";

      this.setMessage((sharedMedia as any).message);

      this.mediaWrapper = newWrapper;
      this.mediaContainer.append(newImmediate);

      this.tg.fileStorage.downloadMedia(media, 0).then((url) => {
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
          new: { from: newFrom, to: 0 },
        },
        (v) => {
          oldImmediate.style.transform = `translateX(${v.old}px)`;
          newImmediate.style.transform = `translateX(${v.new}px)`;
        },
        () => oldImmediate.remove()
      );
    }

    this.mediaWrapper.append(downloadIndicator);

    Message.fromObject(sharedMedia)
      .getSender()
      .then((sender) => {
        if (sender !== this.peer) {
          this.setPeer(sender, flip);
        }
      });

    this.tg.fileStorage
      .downloadMedia(media, undefined, (t) => {
        if (this.media !== sharedMedia) {
          return false;
        }

        if (progress) {
          progress.instance.progress(t);
        }

        return !this.closed;
      })
      .then((url) => {
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
              controls: "controls",
            });
            this.image.remove();
            this.mediaWrapper.prepend(video);
          }
        }
      });

    this.updateButtons();
  }

  public setMessage(message?: string) {
    this.footer.innerHTML = message;
  }

  private createMediaWrapper() {
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

    const mediaWrapper = createElement(
      "div",
      { class: styles.mediaWrapper },
      this.image,
      this.nextButton,
      this.prevButton
    );

    this.container = createElement(
      "div",
      { class: styles.mediaAbsoluteContainer },
      mediaWrapper,
      this.footer
    );

    return [this.container, mediaWrapper];
  }

  private updateButtons() {
    if (this.media) {
      this.media.getNext().then((media) => {
        if (media) {
          removeClass(this.nextButton, "hidden");

          this.nextButton.onclick = async () => {
            this.setMedia(media, -1);
          };
        }
      });

      this.media.getPrev().then((media) => {
        if (media) {
          removeClass(this.prevButton, "hidden");

          this.prevButton.onclick = async () => {
            this.setMedia(media, 1);
          };
        }
      });
    }
  }

  private setPeer(peer: IPeer, flip = 1 | -1 | 0) {
    this.peer = peer;
    const currentElement = this.sender.firstChild as HTMLElement;
    const date = dayjs(this.media.date);
    const newElement = createElement(
      "div",
      createElement(Avatar, { peer }),
      createElement(
        "div",
        { class: styles.senderInfo },
        createElement("div", peer.displayName),
        createElement(
          "div",
          date.format("MMM D") + " at " + date.format("hh:mm")
        )
      )
    );

    this.sender.append(newElement);

    if (currentElement) {
      startAnimation(
        {
          o: { from: 1, to: 0 },
          xOld: { from: 0, to: flip * -30 },
          xNew: { from: flip * 30, to: 0 },
        },
        (v) => {
          currentElement.style.opacity = v.o + "";
          newElement.style.opacity = 1 - v.o + "";
          currentElement.style.transform = `translateX(${v.xOld}px)`;
          newElement.style.transform = `translateX(${v.xNew}px)`;
        },
        () => {
          currentElement.remove();
        }
      );
    }
  }

  private handleContainerClick = (event: Event) => {
    if (event.target === this.container) {
      this.close();
    }
  };

  private handleKeyboard = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.close();
    } else if (event.keyCode === 39) {
      this.navigate(true);
    } else if (event.keyCode === 37) {
      this.navigate(false);
    }
  };

  private navigate = throttle((next: boolean) => {
    (next ? this.nextButton : this.prevButton).click();
  }, 400);
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

function getImageSize(w: number, h: number) {
  return fitImageSize(w, h, window.innerWidth * 0.9, window.innerHeight * 0.8);
}

export function mediaLightBox({
  source,
  peer,
  message,
  initialPhoto,
  tg,
}: {
  source: HTMLElement;
  peer: IPeer;
  message: IMessage | ISharedMedia;
  initialPhoto: string;
  tg: TelegramClientProxy;
}) {
  const container = createElement(LightBox, { tg });
  const mediaWrapper = container.instance.mediaWrapper;

  const media = (message as TLMessage).media;
  const size = getSize(media as any);
  container.style.opacity = "0";
  const [w, h] = getImageSize(size.w, size.h);
  mediaWrapper.style.width = w + "px";
  mediaWrapper.style.height = h + "px";
  container.instance.setSrc(initialPhoto);
  container.instance.setMessage((message as TLMessage).message);

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
          to: 0,
        },
        x: {
          from: (rect.x - startingX) / scale,
          to: 0,
        },
        y: {
          from: (rect.y - startingY) / scale,
          to: 0,
        },
        scale: {
          from: scale,
          to: 1,
        },
      },
      (v) => {
        mediaWrapper.style.opacity = "1";
        mediaWrapper.style.transform = `scale(${v.scale}) translate(${v.x}px, ${v.y}px)`;
        mediaWrapper.style.borderRadius = v.bdrs + "px";
      },
      () => {
        const exists = SharedMedia.getFromMemory({
          peerType: peer.type,
          peerId: peer.id,
          id: message.id,
        }) as ISharedMedia;

        if (exists) {
          container.instance.setMedia(exists, 0);
          return;
        }

        SharedMedia.fetch(peer, { offsetId: message.id }).then((media) => {
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
