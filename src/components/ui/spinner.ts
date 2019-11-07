import { createElement, Component } from "../../utils/dom";
import Icon, { Icons } from "./icon";
import * as styles from "./spinner.scss";

interface Options {
  size: string;
  color: string;
}

export default class Spinner implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ size, color = "black" }: Options) {
    const element = createElement(Icon, {
      color,
      icon: Icons.Spinner,
      class: styles.spinner
    });

    element.style.width = size;
    element.style.height = size;

    this.element = element;
  }
}
