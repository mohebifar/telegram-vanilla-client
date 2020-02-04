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

  public showProgress(progress = 0, type: "r" | "c" = "r") {
    if (!this.progressElement) {
      const svg = type === "r" ? this.rectangularSVG() : this.roundSVG();
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
    const svg = this.rectangularSVG();

    removeChildren(this.element);

    const download = this.createIcon(Icons.Download);
    this.element.append(svg, download);
  }

  public showDocument() {
    this.destroyProgress();

    const file = document.createElementNS(NS, "path");
    file.setAttributeNS(null, "d", D_LARGE);
    file.setAttribute("fill", this.color);

    const fold = document.createElementNS(NS, "path");
    fold.setAttributeNS(null, "d", D_FOLD);
    fold.setAttribute("fill", "#000000");
    fold.setAttribute("fill-opacity", "0.3");

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
    svg.append(file, fold, text);

    removeChildren(this.element);
    this.element.append(svg);
  }

  public showAudio(icon: Icons) {
    this.destroyProgress();

    removeChildren(this.element);

    const svg = this.roundSVG();
    const download = this.createIcon(icon);
    this.element.append(svg, download);
  }

  private destroyProgress() {
    if (this.progressElement) {
      this.progressElement.remove();
      this.progressElement = undefined;
    }
  }

  private roundSVG() {
    const svg = this.createSVG();
    const circle = document.createElementNS(NS, "circle");

    circle.setAttribute("class", "audioCircle");
    circle.setAttribute("cx", "48");
    circle.setAttribute("cy", "48");
    circle.setAttribute("r", "48");
    svg.append(circle);

    return svg;
  }

  private rectangularSVG() {
    const svg = this.createSVG();
    const path = document.createElementNS(NS, "path");

    path.setAttributeNS(null, "d", D_EMPTY);
    path.setAttribute("fill", this.color);
    svg.append(path);

    return svg;
  }

  private createSVG() {
    const svg = document.createElementNS(NS, "svg");

    svg.setAttribute("xmlns", NS);
    svg.setAttributeNS(null, "viewBox", "0 0 96 96");
    svg.setAttributeNS(null, "fill", "none");

    return svg;
  }

  private createIcon(icon: Icons) {
    return createElement(Icon, {
      class: styles.inner,
      color: "white",
      icon
    });
  }
}
