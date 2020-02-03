import {
  Component,
  createElement,
  Element,
  removeChildren
} from "../../utils/dom";
import * as styles from "./file-icon.scss";
import Icon, { Icons } from "./icon";
import Progress from "./progress";

const NS = "http://www.w3.org/2000/svg";
const D_EMPTY =
  "M83 0c7 0 13 6 13 13v70c0 7-6 13-13 13H13C6 96 0 90 0 83V13C0 6 6 0 13 0h70z";
const D_LARGE =
  "M96 31v56l-1 1v2h-1v1h-1v2h-2v1h-1v1h-2l-1 1H9l-1-1H6v-1H5v-1H4l-1-1v-1H2v-1H1v-2l-1-1V9l1-1V6h1V5h1V4h1V3h1V2h1V1h2l1-1h56l31 31z";
const D_FOLD =
  "M77 31h-2l-1-1h-2l-1-1-1-1h-1l-1-1-1-1-1-1v-1l-1-1v-1l-1-1v-4l-1-1V0l31 31H77z";

export interface Options {
  extension?: string;
}

export default class FileIcon implements Component<Options> {
  public readonly element: HTMLElement;
  private color: string;
  private extension: string;
  private progressElement: Element<Progress>;

  constructor({ extension }: Options) {
    if (["doc"].includes(extension)) {
      this.color = "#50A2E9";
    } else {
      this.color = "#43A047";
    }

    this.extension = extension;

    this.element = createElement("div", { class: styles.wrapper });
  }

  public showProgress(progress = 0) {
    if (!this.progressElement) {
      const svg = this.createSVG();

      const path = document.createElementNS(NS, "path");

      path.setAttributeNS(null, "d", D_EMPTY);
      path.setAttribute("fill", this.color);
      svg.append(path);

      this.progressElement = createElement(Progress, { class: styles.inner });

      const close = createElement(Icon, {
        class: styles.inner,
        icon: Icons.Close,
        color: "white"
      });

      removeChildren(this.element);
      this.element.append(svg, this.progressElement, close);
    }

    this.progressElement.instance.progress(progress);
  }

  public showEmpty() {
    this.destroyProgress();
    const svg = this.createSVG();

    const path = document.createElementNS(NS, "path");

    path.setAttributeNS(null, "d", D_EMPTY);
    path.setAttribute("fill", this.color);
    svg.append(path);

    const download = createElement(Icon, {
      class: styles.inner,
      icon: Icons.Download,
      color: "white"
    });

    removeChildren(this.element);
    this.element.append(svg, download);
  }

  public showDocument() {
    this.destroyProgress();
    const path1 = document.createElementNS(NS, "path");

    path1.setAttributeNS(null, "d", D_LARGE);
    path1.setAttribute("fill", this.color);

    const path2 = document.createElementNS(NS, "path");

    path2.setAttributeNS(null, "d", D_FOLD);
    path2.setAttribute("fill", "#000000");
    path2.setAttribute("fill-opacity", "0.3");

    const text = document.createElementNS(NS, "text");
    text.innerHTML = this.extension;

    [
      ["x", "48"],
      ["y", "60"],
      ["class", "extension"],
      ["dominant-baseline", "middle"],
      ["text-anchor", "middle"]
    ].forEach(([k, v]) => text.setAttribute(k, v));

    const svg = this.createSVG();
    svg.append(path1, path2, text);

    removeChildren(this.element);
    this.element.append(svg);
  }

  private destroyProgress() {
    if (this.progressElement) {
      this.progressElement.remove();
      this.progressElement = undefined;
    }
  }

  private createSVG() {
    const svg = document.createElementNS(NS, "svg");

    svg.setAttribute("xmlns", NS);
    svg.setAttributeNS(null, "viewBox", "0 0 96 96");
    svg.setAttributeNS(null, "fill", "none");

    return svg;
  }
}
