import { Component } from "../../utils/dom";
import * as styles from "./progress.scss";

const NS = "http://www.w3.org/2000/svg";
const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export interface Options {
  class?: string;
}

export default class Progress implements Component<Options> {
  public readonly element: any;
  private readonly progressValue: SVGCircleElement;

  constructor(options: Options) {
    this.element = document.createElementNS(NS, "svg");

    this.element.setAttribute(
      "class",
      styles.progress + " spinner " + (options.class || "")
    );
    this.element.setAttribute("xmlns", NS);
    this.element.setAttributeNS(null, "viewBox", "0 0 84 84");

    const circle = document.createElementNS(NS, "circle");

    this.progressValue = document.createElementNS(NS, "circle");

    circle.setAttribute("class", styles.meter);
    this.progressValue.setAttribute("class", styles.value);

    [
      ["cx", "42"],
      ["cy", "42"],
      ["r", String(RADIUS)],
      ["stroke-width", "4"]
    ].forEach(([k, v]) => {
      circle.setAttribute(k, v);
      this.progressValue.setAttribute(k, v);
    });

    this.progressValue.style.strokeDasharray = String(CIRCUMFERENCE);

    this.progress(0);
    this.element.append(circle, this.progressValue);
  }

  public progress(progress: number) {
    const dashoffset = CIRCUMFERENCE * (1 - Math.max(progress, 0.02));

    this.progressValue.style.strokeDashoffset = String(dashoffset);
  }
}
