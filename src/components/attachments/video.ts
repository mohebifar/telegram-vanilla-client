import {
  Document,
  DocumentAttributeVideo,
  MessageMediaDocument
} from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement, removeChildren, off, removeClass, on } from "../../utils/dom";
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
    measureSize = (w, h) => fitImageSize(w, h, 320, 320)
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

    const downloadIndicator = createElement(
      "div",
      { class: "downloadIndicator" },
      createElement(Icon, { icon: Icons.Download, color: "white" })
    );
    const img = createElement("img", { src: EMPTY_IMG, class: "blur" });
    const element = createElement(
      "div",
      { class: styles.attachment + " pointer" },
      img,
      downloadIndicator
    );

    let downloaded = false;

    const downloadListener = () => {
      off(element, "click", downloadListener);
      removeChildren(downloadIndicator);
      const progress = createElement(Progress);
      downloadIndicator.append(progress);

      tg.fileStorage
        .downloadDocument(document, undefined, document.dcId, t => {
          progress.instance.progress(t);
        })
        .then(src => {
          progress.remove();
          downloadIndicator.remove();
          downloaded = true;
          img.remove();
          const video = createElement("video", { src }) as HTMLVideoElement;
          video.muted = true;
          video.loop = true;
          video.autoplay = true;
          element.append(video);

          let observer = new IntersectionObserver(
            entries => {
              const entry = entries[0];
              if (entry) {
                if (entry.isIntersecting) {
                  video.play();
                } else {
                  video.pause();
                }
              }
            },
            {
              root: globalDocument.body,
              rootMargin: "0px",
              threshold: 0
            }
          );

          observer.observe(video);

          if (isGIF) {
            removeClass(element, "pointer");
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
      .then(url => {
        if (!downloaded) {
          img.setAttribute("src", url);
        }
      })
      .catch(err => {
        console.log(err, document);
      });

    if (autoDownload) {
      downloadListener();
    }
    tg.fileStorage.documentIsCached(document).then(isCached => {
      isCached && downloadListener();
    });

    this.element = element;
  }
}
