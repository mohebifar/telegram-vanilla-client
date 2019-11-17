import { createElement, Component, Element } from "../../utils/dom";
import * as styles from "./input.scss";

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
  autocomplete?: HTMLInputElement["autocomplete"];
}

export default class Input implements Component<Options> {
  public element: HTMLElement;
  private inputNode: HTMLInputElement;
  private placeholder: HTMLElement;
  private prefix: Element<unknown>;
  private suffix: Element<unknown>;

  constructor({ placeholder, ...rest }: Options) {
    this.inputNode = createElement("input", {
      placeholder,
      ...Object.keys(rest)
        .filter(key => !(key in EventMap))
        .reduce((a, b) => ({ ...a, [b]: rest[b] }), {})
    }) as HTMLInputElement;
    this.placeholder = createElement(
      "div",
      { class: styles.placeholder },
      placeholder
    );
    this.prefix = createElement("div", { class: styles.prefix }, "");
    this.suffix = createElement("div", { class: styles.suffix });

    this.element = createElement(
      "div",
      {
        class: styles.inputWrapper
      },
      this.inputNode,
      this.placeholder,
      this.suffix
    );

    Object.entries(EventMap).forEach(([attrName, eventName]) => {
      if (attrName in rest) {
        this.inputNode.addEventListener(eventName, rest[attrName]);
      }
    });

    this.inputNode.addEventListener("input", () => {
      this.setError(false);
    });
  }

  setError(hasError = true) {
    const fn = hasError ? "add" : "remove";
    this.element.classList[fn](styles.error);
  }

  setType(type: Options["type"]) {
    this.inputNode.setAttribute("type", type);
  }

  focus() {
    this.inputNode.focus();
  }

  isActive() {
    return this.inputNode === document.activeElement;
  }

  get value() {
    return this.inputNode.value;
  }

  set value(value: string) {
    this.inputNode.value = value;
  }

  setPrefix(value: string) {
    const fn = value ? "add" : "remove";

    this.element.classList[fn](styles.hasPrefix);
    this.prefix.innerHTML = value;
  }

  setSuffix(node: HTMLElement) {
    this.suffix.innerHTML = "";
    this.suffix.append(node);
  }
}
