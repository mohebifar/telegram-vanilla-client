import { createElement, Component, preload } from "../../utils/dom";
import * as styles from "./button.scss";
import { Icons } from "./icon";
import Spinner from "./spinner";

interface Options {
  caption: string;
  onClick?(): void;
}

enum EventMap {
  onClick = "click"
}

export default class Button implements Component<Options> {
  public readonly element: HTMLElement;
  private spinner?: HTMLElement;

  constructor({ caption, ...rest }: Options) {
    preload(Icons.Spinner);

    this.element = createElement("button", { class: styles.btn }, caption);

    Object.entries(EventMap).forEach(([attrName, eventName]) => {
      if (attrName in rest) {
        this.element.addEventListener(eventName, rest[attrName]);
      }
    });
  }

  public showSpinner() {
    this.spinner = createElement(Spinner, {
      size: "1rem",
      color: "white"
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

  public setDisabled(disabled) {
    this.element.setAttribute("disabled", disabled ? "disabled" : null);
  }
}
