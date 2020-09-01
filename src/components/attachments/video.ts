import {
  Document,
  DocumentAttributeVideo,
  MessageMediaDocument,
} from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import {
  Component,
  createElement,
  removeClass,
  on,
  Element,
  removeChildren,
} from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import { fitImageSize } from "../../utils/upload-file";
import * as styles from "../chat/chat.scss";
import Icon, { Icons } from "../ui/icon";
import Progress from "../ui/progress";
import { canStream } from "../../utils/video";
import {
  parseFileSize,
  formatDuration,
  sortPhotoSizes,
} from "../../utils/chat";

export interface Options {
  media?: MessageMediaDocument;
  document?: Document;
  tg: TelegramClientProxy;
  autoDownload?: boolean;
  onClick?: (photo: string) => any;
  measureSize?: (w: number, h: number) => [number, number];
}

const globalDocument = document;

export default class VideoAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({
    media,
    document,
    onClick,
    tg,
    autoDownload = false,
    measureSize = (w, h) => fitImageSize(w, h, 320, 320),
  }: Options) {
    if (!document && media.document.$t === "Document") {
      document = media.document;
    }

    if (document.$t !== "Document") {
      return;
    }

    let poster: string;
    let video: HTMLVideoElement;

    const videoAttributes = document.attributes.find(
      ({ $t }) => $t === "DocumentAttributeVideo"
    ) as DocumentAttributeVideo;
    const isGIF = document.attributes.some(
      ({ $t }) => $t === "DocumentAttributeAnimated"
    );
    const autoPlayable = isGIF;

    const metaWrapper = createElement("div", {
      class: styles.attachmentMeta + " d-flex align-center",
    });

    const updateMeta = (() => {
      let info: HTMLElement;
      let downloadButton = createElement(
        "div",
        createElement(Icon, { icon: Icons.CloudDownload, color: "white" })
      );

      const duration = formatDuration(videoAttributes.duration);
      const fileSize = parseFileSize(document.size, 1);

      return (progress?: number) => {
        if (downloading || (downloaded && downloadButton)) {
          downloadButton.remove();
        }

        if (!autoPlayable) {
          if (!downloaded && !downloading) {
            metaWrapper.prepend(downloadButton);
            on(downloadButton, "click", downloadListener);
          }

          if (!info) {
            info = createElement("div");
            metaWrapper.append(info);
          }

          removeChildren(info);

          if (videoAttributes) {
            info.append(createElement("p", duration));
          }

          if (!downloaded) {
            info.append(
              createElement(
                "p",
                typeof progress !== "undefined"
                  ? parseFileSize(progress * document.size, 1) + "/"
                  : "",
                fileSize
              )
            );
          } else {
            metaWrapper.append(
              createElement(Icon, { icon: Icons.Muted, color: "white" })
            );
          }
        }
      };
    })();

    const icon = createElement(Icon, { icon: Icons.Play, color: "white" });
    let shouldContinue = true;

    const downloadIndicator = createElement(
      "div",
      { class: "downloadIndicator" },
      icon
    );
    const img = createElement("img", { src: EMPTY_IMG }) as HTMLImageElement;
    const element = createElement(
      "div",
      { class: styles.attachment + " pointer " + styles.video },
      img,
      downloadIndicator,
      metaWrapper
    );

    let downloaded = false;
    let downloading = false;
    let progress: Element<Progress>;
    let removeClickListener: Function;

    function stopListener() {
      removeClickListener();
      removeClickListener = on(element, "click", downloadListener);
      icon.instance.setIcon(Icons.Play);
      shouldContinue = false;
      downloading = false;
      if (progress) {
        progress.remove();
        progress = undefined;
      }
      updateMeta();
    }

    const openMedia = () => {
      if (!poster) {
        if (video) {
          const canvas = globalDocument.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, canvas.width, canvas.height);
          poster = canvas.toDataURL();
        } else {
          poster = img.src;
        }
      }

      onClick(poster);
    };

    const downloadListener = (e?: Event) => {
      if (e) {
        e.stopPropagation();
      }
      downloading = true;
      removeClickListener();
      progress = createElement(Progress);
      downloadIndicator.append(progress);

      icon.instance.setIcon(Icons.Close);
      removeClickListener = on(element, "click", stopListener);

      updateMeta(0);

      tg.fileStorage
        .downloadDocument(document, undefined, document.dcId, (t) => {
          if (!shouldContinue) {
            shouldContinue = true;
            return false;
          }
          progress.instance.progress(t);
          updateMeta(t);
          return true;
        })
        .then((src) => {
          if (!src) {
            return;
          }
          if (progress) {
            progress.remove();
            progress = undefined;
          }
          removeClickListener();
          downloaded = true;
          updateMeta();

          downloadIndicator.remove();
          img.remove();
          video = createElement(
            "video",
            { playsinline: "playsinline" },
            createElement("source", { src, type: "video/mp4" })
          ) as HTMLVideoElement;

          video.muted = true;
          video.loop = true;
          video.autoplay = true;
          element.append(video);

          const observer = new IntersectionObserver(async (entries) => {
            const entry = entries[0] as any;

            if (entry) {
              await entry.promise;
              if (entry.isIntersecting) {
                entry.promise = video.play();
              } else {
                video.currentTime = 0;
                entry.promise = video.pause();
              }
            }
          });

          observer.observe(video);

          if (progress) {
            progress.remove();
            progress = undefined;
          }

          if (autoPlayable) {
            removeClass(element, "pointer");
          } else {
            removeClickListener = on(element, "click", openMedia);
          }
        });
    };

    canStream(document)
      .then((shouldStream) => {
        removeClickListener = on(
          element,
          "click",
          shouldStream ? openMedia : downloadListener
        );

        if (autoDownload || autoPlayable) {
          return true;
        }

        return tg.fileStorage.documentIsCached(document);
      })
      .then((shouldAutoDownload) => {
        if (shouldAutoDownload) {
          downloadListener();
        }
      });

    updateMeta();

    if (videoAttributes) {
      const [width, height] = measureSize(videoAttributes.w, videoAttributes.h);

      if (width && height) {
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
      }
    }

    tg.fileStorage
      .downloadDocument(
        document,
        document.thumbs && sortPhotoSizes(document.thumbs, ["s", "m"])[0],
        document.dcId
      )
      .then((url) => {
        if (!downloaded) {
          img.src = url;
        }
      })
      .catch((err) => {
        console.log(err, document);
      });

    this.element = element;
  }
}
