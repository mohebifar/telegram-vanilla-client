import { createElement, Component } from "../../utils/dom";
import * as styles from "./search-input.scss";
import Icon, { Icons } from "./icon";

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
  type?: "tel" | "text" | "password";
  autocomplete?: HTMLInputElement["autocomplete"];
}

export default class SearchInput implements Component<Options> {
  public element: HTMLElement;
  private inputNode: HTMLInputElement;

  constructor({ ...rest }: Options) {
    this.inputNode = createElement("input", {
      placeholder: "Search",
      ...Object.keys(rest)
        .filter(key => !(key in EventMap))
        .reduce((a, b) => ({ ...a, [b]: rest[b] }), {})
    }) as HTMLInputElement;
    this.element = createElement(
      "div",
      {
        class: styles.wrapper
      },
      this.inputNode,
      createElement(Icon, {
        icon: Icons.Search,
        color: "grey"
      })
    );

    Object.entries(EventMap).forEach(([attrName, eventName]) => {
      if (attrName in rest) {
        this.inputNode.addEventListener(eventName, rest[attrName]);
      }
    });
  }

  public focus() {
    this.inputNode.focus();
  }

  get value() {
    return this.inputNode.value;
  }

  set value(value: string) {
    this.inputNode.value = value;
  }
}
