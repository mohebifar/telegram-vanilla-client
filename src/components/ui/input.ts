import { createElement, Component } from "../../utils/dom";
import * as styles from "./input.module.scss";

enum EventMap {
  onClick = "click",
  onBlur = "blur",
  onFocus = "focus",
  onChange = "change",
  onInput = "input"
}

type EventAttributes = keyof typeof EventMap;

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

interface Options
  extends PartialRecord<EventAttributes, (this: HTMLElement, ev: any) => void> {
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

    Object.entries(EventMap).forEach(([attrName, eventName]) => {
      if (attrName in rest) {
        this.inputNode.addEventListener(eventName, rest[attrName]);
      }
    });
  }
}
