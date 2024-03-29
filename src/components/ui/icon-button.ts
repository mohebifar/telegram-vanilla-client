import { createElement, Component, Element, on } from "../../utils/dom";
import * as styles from "./icon-button.scss";
import Icon, { Icons, Options as IconOptions, IconSprite } from "./icon";

interface Options {
  icon: Icons | IconSprite;
  color?: IconOptions["color"];
  variant?: "light" | "dark" | "primary" | "none";
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
  private iconElement: Element<Icon>;
  public icon: Icon;

  constructor({ icon, color, variant = "light", ...rest }: Options) {
    const props = {};
    for (const k in rest) {
      if (!(k in EventMap) && k !== 'class') {
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
    } else if (variant === "primary") {
      extraClass += styles.primary;
      finalColor = finalColor || "white";
    }

    this.iconElement = createElement(Icon, {
      icon,
      color: finalColor || "grey"
    });
    this.icon = this.iconElement.instance;

    this.element = createElement(
      "button",
      { class: styles.btn + ' ripple ' + extraClass + ' ' + rest['class'] || '', ...props },
      this.iconElement
    );

    Object.entries(EventMap).forEach(([attrName, eventName]) => {
      if (attrName in rest) {
        on(this.element, eventName, rest[attrName]);
      }
    });
  }

  public setSprite(state: "start" | "end") {
    this.iconElement.instance.setSprite(state);
  }
}
