import {
  Document,
  DocumentAttributeAudio,
  MessageMediaDocument
} from "../../core/tl/TLObjects";
import { Component, createElement, Element, off, on } from "../../utils/dom";
import Waveform from "../ui/waveform";

import * as styles from "../chat/chat.scss";
import { formatDuration } from "../../utils/chat";
import FileIcon from "../ui/file-icon";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Icons } from "../ui/icon";

export interface Options {
  media: MessageMediaDocument;
  tg: TelegramClientProxy;
}

export default class AudioAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media, tg }: Options) {
    const audioAttribute = (media.document as Document).attributes.find(
      t => t.$t === "DocumentAttributeAudio"
    ) as DocumentAttributeAudio;

    const fileIcon = createElement(FileIcon, { extension: "ogg" });
    const iconWrapper = createElement(
      "div",
      { class: styles.documentType },
      fileIcon
    );

    let audio: HTMLAudioElement;
    let shouldContinue = true;

    const onSeek = (time: number) => {
      if (audio) {
        audio.currentTime = time * audio.duration;
      } else {
        waveform.instance.progress(0);
      }
    };

    const play = () => {
      off(iconWrapper, "click", play);
      on(iconWrapper, "click", pause);
      audio.play();
      animateWaveform();
      fileIcon.instance.showAudio(Icons.Pause);
    };

    const pause = () => {
      off(iconWrapper, "click", pause);
      on(iconWrapper, "click", play);
      audio.pause();
      fileIcon.instance.showAudio(Icons.Play);
    };

    const stopListener = () => {
      off(iconWrapper, "click", stopListener);
      on(iconWrapper, "click", downloadListener);
      fileIcon.instance.showAudio(Icons.Play);

      shouldContinue = false;
    };

    const onProgress = (progress: number) => {
      if (shouldContinue && fileIcon) {
        fileIcon.instance.showProgress(progress, "c");
      }

      return shouldContinue;
    };

    const animateWaveform = () => {
      const progress = audio.currentTime / audio.duration;
      waveform.instance.progress(progress);
      if (!audio.paused) {
        requestAnimationFrame(animateWaveform);
      }
    };

    const downloadListener = () => {
      off(iconWrapper, "click", downloadListener);
      on(iconWrapper, "click", stopListener);
      fileIcon.instance.showProgress(0, "c");

      tg.fileStorage.downloadMedia(media, undefined, onProgress).then(src => {
        if (src && iconWrapper) {
          audio = new Audio(src);
          on(audio, "ended", () => {
            pause();
          });
          play();

          off(iconWrapper, "click", stopListener);
          off(iconWrapper, "click", downloadListener);
        }

        shouldContinue = true;
      });
    };

    const waveform = createElement(Waveform as any, {
      waveform:
        audioAttribute.waveform ||
        Array.from({ length: 50 }, () => Math.floor(Math.random() * 200)),
      onSeek
    }) as Element<Waveform>;
    waveform.instance.progress(0);
    on(iconWrapper, "click", downloadListener);
    fileIcon.instance.showAudio(Icons.Play);

    const element = createElement(
      "div",
      { class: styles.documentWrapper + " audioPlayer" },
      iconWrapper,
      createElement(
        "div",
        { class: styles.documentContent },
        createElement("div", { class: styles.title }, waveform),
        createElement("div", formatDuration(audioAttribute.duration))
      )
    );

    this.element = element;
  }
}
