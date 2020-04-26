import { Component, on } from "../../utils/dom";

const NS = "http://www.w3.org/2000/svg";

const WIDTH = 240;
const HEIGHT = 25;

export interface Options {
  class?: string;
  waveform: number[] | Uint8Array;
  onSeek(time: number): void;
}

let i = 0;

export default class Waveform implements Component<Options> {
  public readonly element: any;
  private stop1: SVGStopElement;
  private stop2: SVGStopElement;

  constructor(options: Options) {
    const svg = document.createElementNS(NS, "svg");
    i++;

    const gradientId = "g" + i;
    const maskId = "m" + i;
    svg.setAttribute("class", "waveform");
    svg.setAttribute("xmlns", NS);
    svg.setAttributeNS(null, "viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
    const defs = document.createElementNS(NS, "defs");
    const mask = document.createElementNS(NS, "mask");
    const gradient = document.createElementNS(NS, "linearGradient");

    mask.setAttribute("id", maskId);

    [
      ["id", gradientId],
      ["class", "gradient"],
      ["x1", "0"],
      ["x2", "1"],
      ["y1", "0"],
      ["y2", "0"]
    ].forEach(([k, v]) => gradient.setAttribute(k, v));

    const stop1 = document.createElementNS(NS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "var(--color1)");

    this.stop1 = document.createElementNS(NS, "stop");
    this.stop1.setAttribute("offset", "50%");
    this.stop1.setAttribute("stop-color", "var(--color1)");

    this.stop2 = document.createElementNS(NS, "stop");
    this.stop2.setAttribute("offset", "50%");
    this.stop2.setAttribute("stop-color", "var(--color2)");

    const stop4 = document.createElementNS(NS, "stop");
    stop4.setAttribute("offset", "100%");
    stop4.setAttribute("stop-color", "var(--color2)");
    stop4.setAttribute("stop-opacity", "1");

    gradient.append(stop1, this.stop1, this.stop2, stop4);

    const waveform = scale(options.waveform, 48).reverse();

    waveform.forEach((value: number, index: number) => {
      const barHeight = Math.max((HEIGHT * value) / 255, 4);
      const rect = document.createElementNS(NS, "rect");
      [
        ["x", index * 5],
        ["rx", "1"],
        ["y", HEIGHT - barHeight],
        ["width", "3"],
        ["height", barHeight],
        ["fill", "white"]
      ].forEach(([k, v]) => rect.setAttribute(k + "", v + ""));
      mask.append(rect);
    });

    const rect = document.createElementNS(NS, "rect");
    [
      ["width", WIDTH],
      ["height", HEIGHT],
      ["mask", `url('#${maskId}')`],
      ["fill", `url('#${gradientId}')`]
    ].forEach(([k, v]) => rect.setAttribute(k + "", v + ""));

    defs.append(mask, gradient);

    svg.append(defs, rect);

    on(svg, "mousedown", e => {
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const position = x / rect.width;
      this.progress(position);
      options.onSeek(position);
    });

    this.element = svg;
  }

  public progress(position: number) {
    const percent = Number(position * 100).toFixed(2) + "%";
    [this.stop1, this.stop2].forEach(element =>
      element.setAttribute("offset", percent)
    );
  }
}

function scale(waveform: number[] | Uint8Array, length = 48) {
  let compression = waveform.length / length;
  let result = new Uint8Array(length);

  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    const value = result[index++];
    const nextValue = waveform[Math.round(inputIndex)];
    result[index] =
      value === 0 ? nextValue : (value + nextValue) / 2;
    inputIndex += compression;
  }

  return result;
}
