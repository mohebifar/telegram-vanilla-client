import { StickerSet, IStickerSet } from "../../models/sticker-set";
import {
  Component,
  createElement,
  Element,
  removeChildren,
  on,
} from "../../utils/dom";
import Router from "./router";

import { fillStickerPreview } from "../../utils/render-sticker";
import SearchInput from "./search-input";

import * as styles from "./sticker-search.scss";
import { debounce } from "../../utils/utils";
import IconButton from "./icon-button";
import { Icons } from "./icon";

interface Options {
  onBack(): void;
}

export default class StickerSearch implements Component<Options> {
  public readonly element: Element<Router>;
  private readonly scrollView: HTMLElement;

  constructor({ onBack }: Options) {
    const searchInput = createElement(SearchInput, {
      onInput: debounce(() => {
        const value = searchInput.instance.value.trim();

        StickerSet.search(value).then((result) => {
          if (value !== searchInput.instance.value) {
            return;
          }

          removeChildren(this.scrollView);
          this.renderStickers(result);
        });
      }),
    });

    const heading = createElement(
      "div",
      { class: styles.heading },
      createElement(IconButton, {
        icon: Icons.Back,
        onClick: onBack,
      }),
      searchInput
    );

    this.scrollView = createElement("div", { class: styles.scrollView });

    this.element = createElement(
      "div",
      { class: styles.wrapper },
      heading,
      this.scrollView
    );

    this.displayFeaturedStickers();

    requestAnimationFrame(() => {
      searchInput.instance.focus();
    });
  }

  private displayFeaturedStickers() {
    removeChildren(this.scrollView);
    StickerSet.search().then((stickerSet) => {
      this.renderStickers(stickerSet);
    });
  }

  private renderStickers(sets: IStickerSet[]) {
    for (const stickerSet of sets) {
      let covers = stickerSet.covers;

      if (!covers && stickerSet.documents) {
        covers = stickerSet.documents.slice(0, 5);
      }

      if (!covers) {
        continue;
      }

      const set = stickerSet.set;
      const installed = Boolean(set.installedDate);

      const stickerWrapper = createElement("div");

      const installButton = createElement(
        "button",
        { class: getButtonStyle(installed) },
        getButtonText(installed)
      );

      on(installButton, "click", async () => {
        const installed = Boolean(stickerSet.set.installedDate);
        installButton.setAttribute("disabled", "disabled");
        await stickerSet[installed ? "uninstall" : "install"]();
        installButton.className = getButtonStyle(!installed);
        installButton.innerText = getButtonText(!installed);
        installButton.removeAttribute("disabled");
      });

      const header = createElement(
        "div",
        { class: styles.header },
        createElement(
          "div",
          { class: styles.title },
          createElement("div", set.title),
          createElement("div", `${set.count} stickers`)
        ),
        installButton
      );

      const body = createElement("div", {
        class: `${styles.stickerCover} `,
      });

      for (const sticker of covers) {
        if (sticker.$t === "Document") {
          fillStickerPreview(StickerSet.tg, sticker, body);
        }
      }
      stickerWrapper.append(header, body);
      this.scrollView.append(stickerWrapper);
    }
  }
}

function getButtonStyle(installed: boolean) {
  return `${styles.btn} ${installed ? styles.btnSecondary : ""}`;
}

function getButtonText(installed: boolean) {
  return installed ? "Added" : "Add";
}
