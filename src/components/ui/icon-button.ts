import { createElement, Component } from "../../utils/dom";
import * as styles from "./icon-button.scss";
import Icon, { Icons, Options as IconOptions } from "./icon";

interface Options {
  icon: Icons;
  color?: IconOptions["color"];
  onClick?(event: Event): void;
  onHover?(event: Event): void;
  onHoverOut?(event: Event): void;
  [s: string]: any;
}

enum EventMap {
  onClick = "click",
  onHover = "mouseenter",
  onHoverOut = "mouseleave"
}

export default class IconButton implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ icon, color, ...rest }: Options) {
    const props = {};
    for (const k in rest) {
      if (!(k in EventMap)) {
        props[k] = rest[k];
      }
    }

    this.element = createElement(
      "button",
      { class: styles.btn, ...props },
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
