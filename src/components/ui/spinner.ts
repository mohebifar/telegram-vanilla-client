import { createElement, Component } from "../../utils/dom";
import Icon, { Icons } from "./icon";

interface Options {
  size: string;
  color: string;
}

export default class Spinner implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ size, color = "black" }: Options) {
    const element = createElement(Icon, {
      color: color as any,
      icon: Icons.Spinner,
      class: 'spinner'
    });

    element.style.width = size;
    element.style.height = size;

    this.element = element;
  }
}
