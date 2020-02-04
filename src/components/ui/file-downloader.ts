import {
  Document,
  MessageMediaDocument,
  DocumentAttributeFilename
} from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement } from "../../utils/dom";
import * as styles from "../chat/chat.scss";
import FileIcon from "./file-icon";
import { parseFileSize } from "../../utils/chat";

export interface Options {
  media: MessageMediaDocument;
  tg: TelegramClientProxy;
}

const saveData = (function() {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";

  return function(url: string, fileName: string) {
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();

export default class FileDownloader implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media, tg }: Options) {
    const fileNameAttribute = (media.document as Document).attributes.find(
      t => t.$t === "DocumentAttributeFilename"
    ) as DocumentAttributeFilename;
    if (!fileNameAttribute) {
      this.element = createElement("div", "Unsupported file");
      return;
    }

    const { fileName } = fileNameAttribute;

    const extensionMatch = fileName.match(/\.([\w\d]+)$/);
    const extension = extensionMatch
      ? extensionMatch[1]
      : fileName.substr(fileName.length - 3);
    const fileNameToRender =
      fileName.length > 20
        ? `${fileName.substr(0, 20)}… .${extension}`
        : fileName;
    const fileIcon = createElement(FileIcon, { extension });
    const iconWrapper = createElement(
      "div",
      { class: styles.documentType },
      fileIcon
    );

    fileIcon.instance.showEmpty();
    iconWrapper.addEventListener("click", downloadListener);

    let shouldContinue = true;

    function stopListener() {
      iconWrapper.removeEventListener("click", stopListener);
      iconWrapper.addEventListener("click", downloadListener);
      fileIcon.instance.showEmpty();

      shouldContinue = false;
    }

    function callback(progress: number) {
      if (shouldContinue && fileIcon) {
        fileIcon.instance.showProgress(progress);
      }

      return shouldContinue;
    }

    function downloadListener() {
      iconWrapper.removeEventListener("click", downloadListener);
      iconWrapper.addEventListener("click", stopListener);
      fileIcon.instance.showProgress(0);

      tg.fileStorage.downloadMedia(media, undefined, callback).then(file => {
        if (file && iconWrapper) {
          fileIcon.instance.showDocument();
          iconWrapper.removeEventListener("click", stopListener);
          iconWrapper.removeEventListener("click", downloadListener);
          iconWrapper.addEventListener("click", () => {
            saveData(file, fileName);
          });
        }

        shouldContinue = true;
      });
    }

    const element = createElement(
      "div",
      { class: styles.documentWrapper + " fileDownload" },
      iconWrapper,
      createElement(
        "div",
        { class: styles.documentContent },
        createElement("div", { class: styles.title }, fileNameToRender),
        createElement("div", parseFileSize((media.document as Document).size))
      )
    );

    this.element = element;
  }
}
