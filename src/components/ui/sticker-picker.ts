import { Document } from "../../core/tl/TLObjects";
import { IStickerSet, StickerSet } from "../../models/sticker-set";
import {
  Component,
  createElement,
  removeChildren,
  on,
  Element,
  scrollTo,
  getNthChild,
} from "../../utils/dom";
import { fillStickerPreview } from "../../utils/render-sticker";
import { debounce } from "../../utils/utils";
import StickerSearch from "./sticker-search";
import Router from "./router";
import * as styles from "./sticker-picker.scss";
import * as panelStyles from "./emoji-panel.scss";
import Spinner from "./spinner";
import Icon, { Icons } from "./icon";
import { isMobile } from "../../utils/mobile";

interface Options {
  onStickerSelect(document: Document): any;
}

export default class StickerPicker implements Component<Options> {
  public readonly element: Element<Router>;
  public readonly wrapper: HTMLElement;
  public readonly dialogs: HTMLElement;
  public readonly tabs: HTMLElement;
  public readonly router: Router;
  private onStickerSelect: Options["onStickerSelect"];
  private stickerSets: IStickerSet[];
  private currentOffset = 0;
  private currentPreviewOffset = 0;
  private limit = 2;
  private lockLoadMore = true;
  private renderedTabs = new Map<string, HTMLElement>();
  private renderedStickerAreas = new Map<string, HTMLElement>();
  private recentHolder: HTMLElement;
  private loadPromise = StickerSet.fetchAll().then((stickerSets) => {
    this.stickerSets = stickerSets;
    on(this.wrapper, "scroll", () => {
      if (!this.lockLoadMore && this.isAtEnd()) {
        this.renderStickers();
      }
    });

    on(this.tabs, "scroll", () => {
      if (!this.lockLoadMore && this.isTabsAtEnd()) {
        this.renderTabs();
      }
    });

    StickerSet.events.on("recent_updated", (documents) => {
      if (this.recentHolder) {
        const stickerSet = (this.recentHolder as any).sticker as IStickerSet;
        stickerSet.documents = documents;
        const firstDocument = documents[0];
        let moved = false;

        for (let i = 0; i < this.recentHolder.childNodes.length; i++) {
          const currentPreview = this.recentHolder.childNodes.item(i);
          const { document: currentDocument } = currentPreview as any;
          if (currentDocument === firstDocument) {
            this.recentHolder.prepend(currentPreview);
            moved = true;
            return;
          }
        }

        if (!moved) {
          const lastPreview = getNthChild(this.recentHolder, "last");
          lastPreview.remove();

          const preview = createElement("div", { class: styles.preview });
          fillStickerPreview(StickerSet.tg, firstDocument, preview);

          this.recentHolder.prepend(preview);
        }
      }
    });

    StickerSet.events.on("installed", (sticker) => {
      const stickerTab = this.renderTab(sticker);
      if (stickerTab) {
        this.tabs.insertBefore(stickerTab, getNthChild(this.tabs, 1));
      }

      const [stickerArea, holder] = this.renderSticker(sticker);
      if (stickerArea) {
        this.wrapper.insertBefore(stickerArea, getNthChild(this.wrapper, 1));
        this.observer.observe(holder);
      }
    });

    StickerSet.events.on("uninstalled", (sticker) => {
      const stickerTab = this.renderedTabs.get(sticker.set.id);
      if (stickerTab) {
        this.renderedTabs.delete(sticker.set.id);
        stickerTab.remove();
      }

      const stickerArea = this.renderedStickerAreas.get(sticker.set.id);
      if (stickerArea) {
        this.renderedTabs.delete(sticker.set.id);
        stickerArea.remove();
      }
    });
  });

  constructor({ onStickerSelect }: Options) {
    this.onStickerSelect = onStickerSelect;
    this.tabs = createElement("div", { class: styles.tabs });

    on(this.tabs, "wheel", (e) => {
      this.tabs.scrollLeft += e.deltaY;
    });

    this.wrapper = createElement("div", { class: styles.stickerWrapper });

    const mainStickerPicker = createElement(
      "div",
      { class: styles.container },
      this.wrapper,
      this.tabs
    );

    this.element = createElement(Router, {
      routes: [
        {
          name: "picker",
          render: () => mainStickerPicker,
        },
        {
          name: "search",
          render: () => {
            return this.getSearchView();
          },
        },
      ],
      onRouteChange: (route) => {
        const panel = this.element.closest(
          "." + panelStyles.container
        ) as HTMLElement;

        if (panel && isMobile()) {
          if (route === "search") {
            panel.setAttribute("data-h-adjust", "true");
          } else {
            panel.removeAttribute("data-h-adjust");
            panel.style.height = null;
          }
        }
      },
    });

    this.router = this.element.instance;
    this.router.push("picker");
  }

  private observer = new IntersectionObserver(
    debounce((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const stickerSet = (entry.target as any).sticker as IStickerSet;
          this.observer.unobserve(entry.target);
          stickerSet
            .loadPack()
            .then(() => {
              this.fillHolder(stickerSet, entry.target as HTMLElement);
            })
            .catch(() => {
              this.observer.observe(entry.target);
            });
        }
      }
    }, 70),
    { root: this.wrapper }
  );

  private tabObserver = new IntersectionObserver(
    debounce((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const stickerSet = (target as any).sticker as IStickerSet;

          this.tabObserver.unobserve(target);

          stickerSet
            .loadPack()
            .then(() => {
              stickerSet.save();

              if (!stickerSet.documents || stickerSet.documents.length === 0) {
                return;
              }

              const [document] = stickerSet.documents;
              if (document.$t !== "Document") {
                return;
              }

              removeChildren(target);

              fillStickerPreview(stickerSet.tg, document, target);
            })
            .catch(() => {
              this.tabObserver.observe(target);
            });
        }
      }
    }, 70),
    { threshold: 0 }
  );

  private isAtEnd(threshold = 50) {
    const obj = this.wrapper;
    return (
      Math.abs(obj.scrollTop - (obj.scrollHeight - obj.offsetHeight)) <
      threshold
    );
  }

  private isTabsAtEnd(threshold = 2) {
    const obj = this.tabs;
    return (
      Math.abs(obj.scrollLeft - obj.scrollWidth + obj.offsetWidth) < threshold
    );
  }

  private renderTabs() {
    this.lockLoadMore = true;
    const stickers = this.stickerSets.slice(
      this.currentPreviewOffset,
      (this.currentPreviewOffset += 20)
    );

    for (const sticker of stickers) {
      const element = this.renderTab(sticker);
      if (element) {
        this.tabs.append(element);
      }
    }

    this.lockLoadMore = false;
  }

  private renderTab(sticker: IStickerSet) {
    if (this.renderedTabs.has(sticker.set.id)) {
      return null;
    }

    const titleElement = createElement("button", {
      title: sticker.set.title,
    });

    on(titleElement, "click", () => {
      const index = this.stickerSets.indexOf(sticker);
      const limit = index - this.currentOffset + 1;
      if (limit > 0) {
        this.renderStickers(limit);
      }

      const holder = this.wrapper.querySelector(
        '[data-index="' + index + '"]'
      ) as HTMLElement;
      const scrollToPosition = holder.offsetTop - 34;

      scrollTo(this.wrapper, {
        top: scrollToPosition,
      });
    });

    if (sticker.set.id === "recent") {
      titleElement.append(
        createElement(Icon, {
          icon: Icons.Recent,
          color: "grey",
          class: styles.recentTab,
        })
      );
    } else if (sticker.documents && sticker.documents.length !== 0) {
      const [document] = sticker.documents;
      if (document.$t !== "Document") {
        return null;
      }

      fillStickerPreview(sticker.tg, document, titleElement);
    } else {
      titleElement.append(
        createElement(Spinner, { size: "1.5em", color: "green" })
      );
      this.tabObserver.observe(titleElement);
    }

    (titleElement as any).sticker = sticker;

    this.renderedTabs.set(sticker.set.id, titleElement);

    return titleElement;
  }

  private renderStickers(limit = this.limit) {
    this.lockLoadMore = true;
    const isFirstLoad = this.currentOffset === 0;
    const stickers = this.stickerSets.slice(
      this.currentOffset,
      (this.currentOffset += limit)
    );

    for (const sticker of stickers) {
      const [stickerArea, holder] = this.renderSticker(sticker);
      if (stickerArea) {
        if (sticker.set.id === "recent") {
          this.recentHolder = holder;
        }

        this.wrapper.append(stickerArea);
        this.observer.observe(holder);
      }
    }

    if (isFirstLoad) {
      this.renderTabs();
    }

    this.lockLoadMore = false;
  }

  private renderSticker(sticker: IStickerSet) {
    if (this.renderedStickerAreas.has(sticker.set.id)) {
      return [null, null];
    }

    const titleElement = createElement(
      "div",
      { class: styles.title },
      sticker.set.title
    );
    const stickerHolder = createElement("div", {
      class: styles.holder,
      "data-index": this.stickerSets.indexOf(sticker),
    });
    const stickerElement = createElement("div", titleElement, stickerHolder);
    (stickerHolder as any).sticker = sticker;

    this.renderedStickerAreas.set(sticker.set.id, stickerElement);

    return [stickerElement, stickerHolder];
  }

  private fillHolder(sticker: IStickerSet, stickerHolder: HTMLElement) {
    const callbacks: Function[] = [];

    for (const document of sticker.documents) {
      if (document.$t !== "Document") {
        continue;
      }

      const preview = createElement("div", { class: styles.preview });

      fillStickerPreview(sticker.tg, document, preview, callbacks);

      stickerHolder.append(preview);

      on(preview, "mouseup", () => {
        this.onStickerSelect(document);
      });
    }

    const call = () => {
      const callbacksToCall = callbacks.splice(0, 5);
      if (callbacksToCall.length > 0) {
        callbacksToCall.forEach((cb) => cb());
        requestAnimationFrame(call);
      }
    };

    requestAnimationFrame(call);
  }

  private getSearchView() {
    return createElement(StickerSearch, {
      onBack: () => {
        this.router.replace("picker");
      },
    });
  }

  public panelClose() {
    this.lockLoadMore = true;
    this.wrapper.scrollTop = 0;
    this.renderedStickerAreas.clear();
    this.renderedTabs.clear();
    removeChildren(this.wrapper);
  }

  public async panelOpen() {
    this.currentOffset = 0;
    await this.loadPromise;
    this.renderStickers();
    requestAnimationFrame(() => {
      this.wrapper.scrollTop = 0;
    });
  }
}
