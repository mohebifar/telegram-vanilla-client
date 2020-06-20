import {
  Document,
  DocumentAttributeAudio,
  MessageMediaDocument,
  InputMediaUploadedDocument,
} from "../../core/tl/TLObjects";
import { Component, createElement, off, on, Element } from "../../utils/dom";
import Waveform from "../ui/waveform";

import * as styles from "../chat/chat.scss";
import { formatDuration } from "../../utils/chat";
import FileIcon from "../ui/file-icon";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Icons } from "../ui/icon";
import { TransientMedia } from "../../utils/useful-types";
import { readDataURL } from "../../utils/upload-file";
import audioManager from "../../utils/audio-manager";

export interface Options {
  media: MessageMediaDocument | TransientMedia;
  tg: TelegramClientProxy;
}

export default class AudioAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media, tg }: Options) {
    const audioAttribute = (media.$t === "TransientMedia"
      ? (media.inputMedia as InputMediaUploadedDocument)
      : (media.document as Document)
    ).attributes.find(
      (t) => t.$t === "DocumentAttributeAudio"
    ) as DocumentAttributeAudio;
    // Just uploaded file

    const fileIcon = createElement(FileIcon, { extension: "ogg" });
    const iconWrapper = createElement(
      "div",
      { class: styles.documentType },
      fileIcon
    );

    const { audio } = audioManager;
    let shouldContinue = true;
    let waveform: Element<Waveform>;
    let seekbar: HTMLInputElement;
    let source: string;
    let currentTime = 0;

    const useWaveform = audioAttribute.voice && audioAttribute.waveform;

    const updateSeekbarColor = (value: number) => {
      const computedStyles = getComputedStyle(seekbar);
      const lower = computedStyles.getPropertyValue("--lower");
      const upper = computedStyles.getPropertyValue("--upper");
      seekbar.style.background = `linear-gradient(to right, ${lower} 0%, ${lower} ${value}%, ${upper} ${value}%, ${upper} 100%)`;
    };

    const updateDuration = (value: number) => {
      duration.innerText = `${formatDuration(
        value * audio.duration || 0.1
      )} / ${formatDuration(audio.duration || 0)}`;
    };

    const moveSeekbar = () => {
      if (audioManager.src !== source) {
        clearPlayState();
        return;
      }

      currentTime = audio.currentTime;
      const progress = audio.currentTime / audio.duration || 0;
      if (useWaveform) {
        waveform.instance.progress(progress);
      } else {
        const value = Math.round(progress * 100);
        updateSeekbarColor(value);
        seekbar.value = "" + value;
      }
      updateDuration(progress);

      if (!audio.paused) {
        requestAnimationFrame(moveSeekbar);
      }
    };

    const onSeek = (time: number) => {
      if (source !== audioManager.src) {
        return;
      }

      if (source) {
        currentTime = time * audio.duration;
        audio.currentTime = currentTime;
      } else if (useWaveform) {
        waveform.instance.progress(0);
      }
    };

    const clearPauseState = () => {
      off(iconWrapper, "click", play);
      on(iconWrapper, "click", pause);
      fileIcon.instance.showAudio(Icons.Pause);
    };

    const clearPlayState = () => {
      off(iconWrapper, "click", pause);
      on(iconWrapper, "click", play);
      fileIcon.instance.showAudio(Icons.Play);
    };

    const handleEnded = () => {
      pause();
      audio.currentTime = currentTime = 0;
    };

    const play = () => {
      audio.pause();
      audioManager.src = source;
      audio.currentTime = currentTime;

      audio.play();
      moveSeekbar();
      clearPauseState();
      on(audio, "ended", handleEnded, { once: true });
    };

    const pause = () => {
      audio.pause();
      clearPlayState();
      off(audio, "ended", handleEnded, { once: true });
    };

    const handleStopDownloadClick = () => {
      off(iconWrapper, "click", handleStopDownloadClick);
      on(iconWrapper, "click", handleDownloadClick);
      fileIcon.instance.showAudio(Icons.Play);

      shouldContinue = false;
    };

    const onDownloadProgress = (progress: number) => {
      if (shouldContinue && fileIcon) {
        fileIcon.instance.showProgress(progress, "c");
        duration.innerText = `${Math.round(progress * 100)}%`;
      }

      return shouldContinue;
    };

    const downloadFinishCallback = (src: string, autoplay = true) => {
      if (src && iconWrapper) {
        source = src;

        if (autoplay) {
          play();
        } else {
          pause();
        }

        off(iconWrapper, "click", handleStopDownloadClick);
        off(iconWrapper, "click", handleDownloadClick);
      }

      duration.innerText = formatDuration(audioAttribute.duration);
      shouldContinue = true;
    };

    const handleDownloadClick = () => {
      if (media.$t === "MessageMediaDocument") {
        off(iconWrapper, "click", handleDownloadClick);
        on(iconWrapper, "click", handleStopDownloadClick);
        fileIcon.instance.showProgress(0, "c");
        tg.fileStorage
          .downloadMedia(media, undefined, onDownloadProgress)
          .then(downloadFinishCallback);
      }
    };

    const title = createElement("div", { class: styles.title });
    const duration = createElement(
      "div",
      formatDuration(audioAttribute.duration)
    );

    if (audioAttribute.voice && audioAttribute.waveform) {
      waveform = createElement(Waveform, {
        waveform:
          audioAttribute.waveform ||
          Array.from({ length: 50 }, () => Math.floor(Math.random() * 200)),
        onSeek,
      });
      waveform.instance.progress(0);
      title.append(waveform);
    } else {
      seekbar = createElement("input", {
        type: "range",
        value: "0",
        class: styles.seekbar,
      }) as HTMLInputElement;
      on(seekbar, "input", () => {
        const value = Number(seekbar.value);
        updateSeekbarColor(value);
        onSeek(value / 100);
        updateDuration(value / 100);
      });
      title.append(seekbar);
    }

    if (media.$t === "MessageMediaDocument") {
      on(iconWrapper, "click", handleDownloadClick);
      fileIcon.instance.showAudio(Icons.Play);
    } else {
      fileIcon.instance.showProgress(media.progress || 0, "c");

      if (media.subscribe) {
        media.subscribe((progress) => {
          if (progress === 1) {
            readDataURL(media.file).then((src) =>
              downloadFinishCallback(src, false)
            );
            fileIcon.instance.showAudio(Icons.Play);
          } else {
            fileIcon.instance.showProgress(progress || 0, "c");
          }
          return shouldContinue;
        });
      }
    }

    const element = createElement(
      "div",
      { class: styles.documentWrapper + " audioPlayer" },
      iconWrapper,
      createElement("div", { class: styles.documentContent }, title, duration)
    );

    this.element = element;
  }
}
