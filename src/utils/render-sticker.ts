import { TelegramClientProxy } from "../telegram-worker-proxy";
import { Document } from "../core/tl/TLObjects";
import { createElement, on } from "./dom";
import Lottie from "../components/ui/lottie";
import { EMPTY_IMG } from "./images";

export function fillStickerPreview(
  tg: TelegramClientProxy,
  document: Document,
  container: HTMLElement,
  callbacks?: Function[]
) {
  const animated = document.mimeType === "application/x-tgsticker";
  (container as any).document = document;

  if (animated) {
    const callback = () => {
      tg.fileStorage
        .downloadDocument(document, undefined, document.dcId)
        .then((url) => {
          const lottie = createElement(Lottie, {
            config: {
              path: url,
              loop: true,
              autoplay: false,
            },
          });
          container.append(lottie);

          on(lottie, "mouseenter", () => {
            if (
              lottie.instance.animation &&
              (lottie.instance.animation as any).isPaused
            ) {
              lottie.instance.animation.goToAndPlay(0);
            }
          });

          on(lottie, "mouseleave", () => {
            lottie.instance.animation.stop();
          });
        });
    };

    if (callbacks) {
      callbacks.push(callback);
    } else {
      callback();
    }
  } else {
    const img = createElement("img", {
      src: EMPTY_IMG,
    }) as HTMLImageElement;
    container.append(img);

    tg.fileStorage
      .downloadDocument(document, undefined, document.dcId)
      .then((url) => {
        img.src = url;
      });
  }
}
