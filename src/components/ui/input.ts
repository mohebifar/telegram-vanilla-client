import {
  createElement,
  Component,
  Element,
  removeChildren,
  on
} from "../../utils/dom";
import autosize from "autosize";
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
  tag?: "input" | "textarea";
  wrapperClass?: string;
}

export default class Input implements Component<Options> {
  public element: HTMLElement;
  private inputNode: HTMLInputElement;
  private placeholder: HTMLElement;
  private prefix: Element<unknown>;
  private suffix: Element<unknown>;

  constructor({
    placeholder,
    tag = "input",
    wrapperClass = "",
    ...rest
  }: Options) {
    this.inputNode = createElement(tag, {
      placeholder,
      ...Object.keys(rest)
        .filter(key => !(key in EventMap))
        .reduce((a, b) => ({ ...a, [b]: rest[b] }), {})
    }) as HTMLInputElement;
    if (tag === "textarea") {
      autosize(this.inputNode);
    }
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
        class: styles.inputWrapper + " " + wrapperClass
      },
      this.inputNode,
      this.placeholder,
      this.suffix
    );

    Object.entries(EventMap).forEach(([attrName, eventName]) => {
      if (attrName in rest) {
        on(this.inputNode, eventName, rest[attrName]);
      }
    });

    on(this.inputNode, "input", () => {
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
    removeChildren(this.suffix);
    this.suffix.append(node);
  }
}
