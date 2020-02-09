import { createElement, Component } from "../../utils/dom";
import * as styles from "./icon-button.scss";
import Icon, { Icons, Options as IconOptions } from "./icon";

interface Options {
  icon: Icons;
  color?: IconOptions["color"];
  variant?: "light" | "dark" | "none";
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

  constructor({ icon, color, variant = "light", ...rest }: Options) {
    const props = {};
    for (const k in rest) {
      if (!(k in EventMap)) {
        props[k] = rest[k];
      }
    }

    let extraClass = " ";
    let finalColor = color;
    if (variant === "light") {
      extraClass += styles.light;
    } else if (variant === "dark") {
      extraClass += styles.dark;
      finalColor = finalColor || "white";
    }

    this.element = createElement(
      "button",
      { class: styles.btn + extraClass, ...props },
      createElement(Icon, {
        icon,
        color: finalColor || "grey"
      })
    );

    Object.entries(EventMap).forEach(([attrName, eventName]) => {
      if (attrName in rest) {
        this.element.addEventListener(eventName, rest[attrName]);
      }
    });
  }
}
