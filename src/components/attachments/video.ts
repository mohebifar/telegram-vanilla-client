import {
  Document,
  DocumentAttributeVideo,
  MessageMediaDocument,
} from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import {
  Component,
  createElement,
  off,
  removeClass,
  on,
} from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import { fitImageSize } from "../../utils/upload-file";
import * as styles from "../chat/chat.scss";
import Icon, { Icons } from "../ui/icon";
import Progress from "../ui/progress";

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

    const isGIF = document.attributes.some(
      ({ $t }) => $t === "DocumentAttributeAnimated"
    );
    const icon = createElement(Icon, { icon: Icons.Download, color: "white" });
    let shouldContinue = true;

    const downloadIndicator = createElement(
      "div",
      { class: "downloadIndicator" },
      icon
    );
    const img = createElement("img", { src: EMPTY_IMG, class: "blur" });
    const element = createElement(
      "div",
      { class: styles.attachment + " pointer" },
      img,
      downloadIndicator
    );

    let downloaded = false;

    function stopListener() {
      on(element, "click", downloadListener);
      off(element, "click", stopListener);
      icon.instance.setIcon(Icons.Download);
      shouldContinue = false;
    }

    const downloadListener = () => {
      off(element, "click", downloadListener);
      const progress = createElement(Progress);
      downloadIndicator.append(progress);

      icon.instance.setIcon(Icons.Close);
      on(element, "click", stopListener);

      tg.fileStorage
        .downloadDocument(document, undefined, document.dcId, (t) => {
          if (!shouldContinue) {
            shouldContinue = true;
            return false;
          }
          progress.instance.progress(t);
          return true;
        })
        .then((src) => {
          progress.remove();
          if (!src) {
            return;
          }
          downloadIndicator.remove();
          downloaded = true;
          img.remove();
          const video = createElement(
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

          if (isGIF) {
            removeClass(element, "pointer");
            downloadListener();
          } else {
            on(element, "click", () => {
              const canvas = globalDocument.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              canvas
                .getContext("2d")
                .drawImage(video, 0, 0, canvas.width, canvas.height);
              const initialPhoto = canvas.toDataURL();

              onClick(initialPhoto);
            });
          }
        });
    };

    on(element, "click", downloadListener);

    const videoAttributes = document.attributes.find(
      ({ $t }) => $t === "DocumentAttributeVideo"
    ) as DocumentAttributeVideo;

    if (videoAttributes) {
      const [width, height] = measureSize(videoAttributes.w, videoAttributes.h);

      if (width && height) {
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
      }
    }

    tg.fileStorage
      .downloadDocument(document, 0, document.dcId)
      .then((url) => {
        if (!downloaded) {
          img.setAttribute("src", url);
        }
      })
      .catch((err) => {
        console.log(err, document);
      });

    if (autoDownload) {
      downloadListener();
    }
    tg.fileStorage.documentIsCached(document).then((isCached) => {
      isCached && downloadListener();
    });

    this.element = element;
  }
}
