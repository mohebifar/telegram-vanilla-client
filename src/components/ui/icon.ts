import { createElement, Component } from "../../utils/dom";
import "./icon.global.scss";

export enum Icons {
  Spinner = "spinner",
  Up = "up",
  Down = "down",
  CameraAdd = "camera_add",
  Search = "search",
  Menu = "menu",
  Eye1 = "eye1",
  Eye2 = "eye2",
  Send = "send",
  PinnedChat = "pinned_chat",
  Check = "check",
  Checks = "2checks",
  Download = "download",
  Close = "close",
  Play = "play",
  Pause = "pause",
  Smile = "smile",
  Animals = "animals",
  Eats = "eats",
  Car = "car",
  Sport = "sport",
  Lamp = "lamp",
  Flag = "flag"
}

export interface Options {
  icon: Icons;
  color?: "white" | "blue" | "black" | "grey" | "grey-light" | "green";
  [s: string]: any;
}

export default class Icon implements Component<Options> {
  public readonly element: HTMLElement;
  private color: Options["color"];

  constructor({ icon, color = "black", ...rest }: Options) {
    this.color = color;
    this.element = createElement("img", {
      src: `/assets/icons/${icon}.svg`,
      class: `ic ic-${color} ic-${icon} ${rest["class"] || ""}`
    });
  }

  public setColor(color: Options["color"]) {
    const { classList } = this.element;
    classList.remove("ic-" + this.color);
    classList.add("ic-" + color);
    this.color = color;
  }
}
