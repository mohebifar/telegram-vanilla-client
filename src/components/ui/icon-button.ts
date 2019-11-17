import { createElement, Component } from "../../utils/dom";
import * as styles from "./icon-button.scss";
import Icon, { Icons } from "./icon";

interface Options {
  icon: Icons;
  onClick?(): void;
}

enum EventMap {
  onClick = "click"
}

export default class IconButton implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ icon, ...rest }: Options) {
    this.element = createElement(
      "button",
      { class: styles.btn },
      createElement(Icon, {
        icon,
        color: "grey"
      })
    );

    Object.entries(EventMap).forEach(([attrName, eventName]) => {
      if (attrName in rest) {
        this.element.addEventListener(eventName, rest[attrName]);
      }
    });
  }
}
