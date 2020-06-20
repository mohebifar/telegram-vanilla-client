import { Document } from "../../core/tl/TLObjects";
import { Gif } from "../../models/gifs";
import {
  Component,
  createElement,
  removeChildren,
  on,
  Element,
} from "../../utils/dom";
import VideoAttachment from "../attachments/video";
import * as panelStyles from "./emoji-panel.scss";
import * as styles from "./gif-picker.scss";
import Router from "./router";
import SearchInput from "./search-input";
import { debounce } from "../../utils/utils";
import { Icons } from "./icon";
import IconButton from "./icon-button";

interface Options {
  onGifSelect(document: Document): any;
}

export default class GifPicker implements Component<Options> {
  public readonly element: Element<Router>;
  public readonly dialogs: HTMLElement;
  public readonly router: Router;
  private currentOffset = 0;
  private limit = 10;
  private gifs: Document[];
  private onGifSelect: Options["onGifSelect"];
  private pickerWrapper: HTMLElement;
  private onBack: () => void;

  private loadPromise = Gif.fetchSaved().then((gifs) => {
    this.gifs = gifs.filter(({ $t }) => $t === "Document") as Document[];
  });

  constructor({ onGifSelect }: Options) {
    this.onGifSelect = onGifSelect;
    this.pickerWrapper = createElement("div", { class: styles.wrapper });

    this.element = createElement(Router, {
      routes: [
        {
          name: "picker",
          render: () => this.pickerWrapper,
        },
        {
          name: "search",
          render: () => {
            return this.getSearchView();
          },
        },
      ],
      onRouteChange: (route) => {
        const panel = this.element.closest("." + panelStyles.container) as HTMLElement;

        if (panel) {
          if (route === "search") {
            panel.setAttribute('data-h-adjust', 'true');
          } else {
            panel.removeAttribute('data-h-adjust');
            panel.style.height = null;
          }
        }
      },
    });

    this.router = this.element.instance;
    this.router.push("picker");

    this.onBack = () => {
      this.router.replace("picker");
    };

    on(this.pickerWrapper, "scroll", () => {
      if (this.isAtBottom()) {
        this.renderPreviews();
      }
    });
  }

  private isAtBottom(threshold = 50, obj = this.pickerWrapper) {
    return (
      Math.abs(obj.scrollTop - (obj.scrollHeight - obj.offsetHeight)) <
      threshold
    );
  }

  private renderPreviews() {
    const gifs = this.gifs.slice(
      this.currentOffset,
      (this.currentOffset += this.limit)
    );

    for (const document of gifs) {
      const preview = this.renderGif(document);
      this.pickerWrapper.append(preview);
    }
  }

  public panelClose() {
    removeChildren(this.pickerWrapper);
  }

  public async panelOpen() {
    this.currentOffset = 0;
    await this.loadPromise;
    this.renderPreviews();
    requestAnimationFrame(() => {
      this.pickerWrapper.scrollTop = 0;
    });
  }

  private renderGif(document: Document) {
    if (document.$t !== "Document") {
      return null;
    }

    const video = createElement(VideoAttachment, {
      document,
      tg: Gif.tg,
      measureSize: (): [number, number] => {
        return [undefined, undefined];
      },
      autoDownload: true,
    });
    const preview = createElement("div", { class: styles.preview }, video);

    on(preview, "mouseup", () => {
      this.onGifSelect(document);
    });

    return preview;
  }

  private getSearchView() {
    const wrapper = createElement("div", { class: styles.wrapper });
    let lockedLoadMore = false;

    on(wrapper, "scroll", () => {
      if (!lockedLoadMore && this.isAtBottom(50, wrapper)) {
        search();
      }
    });

    let offset = "";
    let query = "";

    const search = async () => {
      lockedLoadMore = true;
      try {
        const { documents, nextOffset } = await Gif.search(query, offset);

        if (!offset) {
          removeChildren(wrapper);
        }

        offset = nextOffset;
        for (const document of documents) {
          const preview = this.renderGif(document);
          wrapper.append(preview);
        }
      } finally {
        lockedLoadMore = false;
      }
    };

    search();

    const searchInput = createElement(SearchInput, {
      onInput: debounce(() => {
        query = searchInput.instance.value.trim();
        offset = "";
        search().then(() => {
          wrapper.scrollTop = 0;
        });
      }),
    });

    const heading = createElement(
      "div",
      { class: styles.heading },
      createElement(IconButton, {
        icon: Icons.Back,
        onClick: this.onBack,
      }),
      searchInput
    );

    const container = createElement(
      "div",
      { class: styles.container },
      heading,
      wrapper
    );

    requestAnimationFrame(() => {
      searchInput.instance.focus();
    });

    return container;
  }
}
