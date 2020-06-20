import { createElement, Component } from "../../utils/dom";
import * as styles from "./checkbox.scss";

interface Options {}

let checkboxId = 200;

export default class Checkbox implements Component<Options> {
  private inputNode: HTMLInputElement;
  private labelNode: HTMLElement;
  public element: HTMLElement;
  private checkboxId: string;

  constructor({}: Options) {
    this.checkboxId = `ch_${(checkboxId++).toString(16)}`;
    this.inputNode = createElement("input", {
      type: "checkbox",
      class: "hidden",
      id: this.checkboxId,
    }) as HTMLInputElement;

    this.labelNode = createElement("label", {
      for: this.checkboxId,
    });

    this.element = createElement(
      "div",
      { class: styles.wrapper },
      this.inputNode,
      this.labelNode
    );
  }
}
