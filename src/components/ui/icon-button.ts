import { createElement, Component } from "../../utils/dom";
import * as styles from "./icon-button.scss";
import Icon, { Icons, Options as IconOptions } from "./icon";

interface Options {
  icon: Icons;
  color?: IconOptions["color"];
  onClick?(): void;
}

enum EventMap {
  onClick = "click"
}

export default class IconButton implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ icon, color, ...rest }: Options) {
    this.element = createElement(
      "button",
      { class: styles.btn },
      createElement(Icon, {
        icon,
        color: color || "grey"
      })
    );

    Object.entries(EventMap).forEach(([attrName, eventName]) => {
      if (attrName in rest) {
        this.element.addEventListener(eventName, rest[attrName]);
      }
    });
  }
}
