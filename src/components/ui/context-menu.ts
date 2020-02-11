import { createElement, Component } from "../../utils/dom";
import * as styles from "./context-menu.scss";
import Icon, { Icons } from "./icon";

export type MenuItem = {
  icon: Icons;
  title: string;
  onClick?(close: () => void): void;
  variant?: "red" | "grey";
  tag?: "button" | "label";
  [k: string]: any;
};

export interface Options {
  items: MenuItem[];
  clickActivator?: boolean;
  [s: string]: any;
}

export class ContextMenu implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ items, clickActivator = true, ...rest }: Options) {
    const itemElements = items.map(
      ({ tag = "button", icon, title, onClick, variant = "grey", ...rest }) => {
        const element = createElement(
          tag,
          {
            class: styles.item + " " + (variant ? styles[variant] : ""),
            ...(tag === "button" ? { type: "button" } : {}),
            ...rest
          },
          createElement(Icon, { icon: icon, color: variant }),
          createElement("div", { class: styles.title }, title)
        );

        element.addEventListener("click", () => {
          if (onClick) {
            onClick(() => this.element.remove());
          }
        });

        return element;
      }
    );
    const element = createElement(
      "div",
      { class: styles.container + " " + (rest.class || "") },
      ...itemElements
    );
    this.element = element;

    if (clickActivator) {
      const listener = (event: Event) => {
        const target = event.target as HTMLElement;
        if (!target.closest("." + styles.container)) {
          this.element.remove();
        } else {
          document.body.addEventListener("mousedown", listener, {
            once: true,
            capture: true
          });
        }
      };

      document.body.addEventListener("mousedown", listener, {
        once: true,
        capture: true
      });
    }
  }
}

export function makeContextMenu(
  { x, y }: { x: number; y: number },
  items: Options["items"]
) {
  const menu = createElement(ContextMenu, { items });
  menu.style.top = y + "px";
  menu.style.left = x + "px";
  requestAnimationFrame(() => {
    const rect = menu.getBoundingClientRect() as DOMRect;

    const isCloseToLeft =
      Math.abs(x - window.innerWidth) < window.innerWidth / 2;
    const isCloseToTop =
      Math.abs(y - window.innerHeight) < window.innerHeight / 2;

    if (isCloseToLeft) {
      menu.style.left = x - rect.width + "px";
    }
    if (isCloseToTop) {
      menu.style.top = y - rect.height + "px";
    }
  });

  document.body.append(menu);
}
