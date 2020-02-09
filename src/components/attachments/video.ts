import {
  DocumentAttributeVideo,
  MessageMediaDocument
} from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement, removeChildren } from "../../utils/dom";
import { EMPTY_IMG } from "../../utils/images";
import { fitImageSize } from "../../utils/upload-file";
import * as styles from "../chat/chat.scss";
import Icon, { Icons } from "../ui/icon";
import Progress from "../ui/progress";

export interface Options {
  media: MessageMediaDocument;
  tg: TelegramClientProxy;
  onClick?: (photo: string) => any;
}

export default class VideoAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media, onClick, tg }: Options) {
    if (media.document.$t !== "Document") {
      return;
    }

    const isGIF = media.document.attributes.some(
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
      element.removeEventListener("click", downloadListener);
      removeChildren(downloadIndicator);
      const progress = createElement(Progress);
      downloadIndicator.append(progress);

      tg.fileStorage
        .downloadMedia(media, undefined, t => {
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
          if (!isGIF) {
            element.addEventListener("click", () => {
              const canvas = document.createElement("canvas");
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

    element.addEventListener("click", downloadListener);

    const videoAttributes = media.document.attributes.find(
      ({ $t }) => $t === "DocumentAttributeVideo"
    ) as DocumentAttributeVideo;

    if (videoAttributes) {
      const [width, height] = fitImageSize(
        videoAttributes.w,
        videoAttributes.h,
        320,
        320
      );

      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }

    tg.fileStorage.downloadMedia(media, 0).then(url => {
      if (!downloaded) {
        img.setAttribute("src", url);
      }
    });

    this.element = element;
  }
}
