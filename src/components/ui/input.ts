import { createElement, Component } from "../../utils/dom";
import styles from "./input.module.scss";

interface Options {
  placeholder: string;
  type?: "tel" | "text" | "password";
}

export default class Input implements Component<Options> {
  public element: HTMLElement;
  public readonly inputNode: HTMLElement;
  public readonly placeholder: HTMLElement;

  constructor({ placeholder, ...rest }: Options) {
    this.inputNode = createElement("input", { placeholder, ...rest });
    this.placeholder = createElement(
      "div",
      { class: styles.placeholder },
      placeholder
    );

    this.element = createElement(
      "div",
      {
        class: styles.inputWrapper
      },
      this.inputNode,
      this.placeholder
    );
  }
}
