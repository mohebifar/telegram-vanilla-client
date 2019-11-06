import { createElement, Component } from "../../utils/dom";
import styles from "./icon.scss";

export enum Icons {
  Spinner = "/assets/spinner.svg"
}

interface Options {
  icon: Icons;
  color?: string;
  [s: string]: any;
}

export default class Icon implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ icon, color = "black", ...rest }: Options) {
    this.element = createElement("img", {
      src: icon,
      class: `ic ${styles[`ic-${color}`]} ${rest["class"] || ""}`
    });
  }
}
