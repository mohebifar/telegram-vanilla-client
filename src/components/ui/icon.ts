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
  Eye2 = "eye2"
}

interface Options {
  icon: Icons;
  color?: "white" | "blue" | "black" | "grey" | "grey-light";
  [s: string]: any;
}

export default class Icon implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ icon, color = "black", ...rest }: Options) {
    this.element = createElement("img", {
      src: `/assets/icons/${icon}.svg`,
      class: `ic ic-${color} ${rest["class"] || ""}`
    });
  }
}
