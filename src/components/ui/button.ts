import { createElement, Component, preload, on } from "../../utils/dom";
import * as styles from "./button.scss";
import { Icons } from "./icon";
import Spinner from "./spinner";

interface Options {
  caption: string;
  size?: "md" | "s";
  variant?: "normal" | "danger";
  outline?: boolean;
  onClick?: Function;
}

enum EventMap {
  onClick = "click",
}

export default class Button implements Component<Options> {
  public readonly element: HTMLElement;
  private spinner?: HTMLElement;

  constructor({
    caption,
    variant = "normal",
    outline = false,
    size = "md",
    ...rest
  }: Options) {
    preload(`/assets/icons/${Icons.Spinner}.svg`);

    this.element = createElement(
      "button",
      {
        class:
          styles.btn +
          " ripple " +
          styles[size] +
          " " +
          (outline ? "" : styles.outline) +
          " " +
          styles[variant],
      },
      caption
    );

    Object.entries(EventMap).forEach(([attrName, eventName]) => {
      if (attrName in rest) {
        on(this.element, eventName, rest[attrName]);
      }
    });
  }

  public showSpinner() {
    this.spinner = createElement(Spinner, {
      size: "1rem",
      color: "white",
    });
    this.element.append(this.spinner);
  }

  public hideSpinner() {
    if (this.spinner) {
      this.spinner.remove();
    }
  }

  public disable() {
    this.setDisabled(true);
  }

  public enable() {
    this.setDisabled(false);
  }

  public setDisabled(disabled = false) {
    if (disabled) {
      this.element.setAttribute("disabled", "disabled");
    } else {
      this.element.removeAttribute("disabled");
    }
  }
}
