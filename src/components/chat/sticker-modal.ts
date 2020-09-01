import { createElement, on, removeChildren } from "../../utils/dom";
import { fillStickerPreview } from "../../utils/render-sticker";
import { makeModal } from "../ui/modal";
import { StickerSet } from "../../models/sticker-set";
import { InputStickerSetID } from "../../core/tl/TLObjects";

import * as styles from "./sticker-modal.scss";
import Button from "../ui/button";

export function openStickerModal(input: InputStickerSetID) {
  StickerSet.fetch(input).then((result) => {
    const stickerHolder = createElement("div", {
      class: styles.stickersGrid,
    });

    const callbacks: Function[] = [];
    const buttonWrapper = createElement("div", { class: styles.buttonWrapper });

    function updateButton() {
      const installed = result.set.installedDate;
      const button = createElement(Button, {
        caption: installed
          ? "Remove Sticker"
          : `Add ${result.documents.length} stickers`,
        outline: Boolean(installed),
        onClick: () => {
          result[installed ? "uninstall" : "install"]().then(() => {
            updateButton();
          });
        },
      });
      removeChildren(buttonWrapper);
      buttonWrapper.append(button);
    }

    updateButton();

    for (const document of result.documents) {
      if (document.$t !== "Document") {
        continue;
      }

      const preview = createElement("div", {
        class: "pointer",
      });

      fillStickerPreview(StickerSet.tg, document, preview, callbacks);

      stickerHolder.append(preview);

      on(preview, "mouseup", () => {
        // @ts-ignore
        if (window.sendForm) {
          // @ts-ignore
          (window.sendForm as SendMessageForm).handleSendSticker(document);
          StickerSet.use(document);
          modal.close();
        }
      });
    }

    const call = () => {
      const callbacksToCall = callbacks.splice(0, 15);
      if (callbacksToCall.length > 0) {
        callbacksToCall.forEach((cb) => cb());
        requestAnimationFrame(call);
      }
    };

    requestAnimationFrame(call);

    const modal = makeModal(
      result.set.shortName,
      createElement(
        "div",
        { class: styles.stickerModal },
        stickerHolder,
        buttonWrapper
      )
    );
  });
}
