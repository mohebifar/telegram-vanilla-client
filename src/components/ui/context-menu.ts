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
  onClose?: Function;
  [s: string]: any;
}

export class ContextMenu implements Component<Options> {
  public readonly element: HTMLElement;
  private onClose: Options["onClose"];

  constructor({ items, clickActivator = true, onClose, ...rest }: Options) {
    this.onClose = onClose;
    const itemElements = items.map(
      ({ tag = "button", icon, title, onClick, variant = "grey", ...rest }) => {
        const element = createElement(
          tag,
          {
            class: styles.item + " " + (variant ? styles[variant] : ""),
            ...(tag === "button" ? { type: "button" } : {}),
            ...rest,
          },
          createElement(Icon, { icon: icon, color: variant }),
          createElement("div", { class: styles.title }, title)
        );

        element.addEventListener("click", () => {
          if (onClick) {
            onClick(() => this.close());
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
          this.close();
        } else {
          document.body.addEventListener("mousedown", listener, {
            once: true,
            capture: true,
          });
        }
      };

      document.body.addEventListener("mousedown", listener, {
        once: true,
        capture: true,
      });
    }
  }

  private close() {
    this.element.remove();
    if (this.onClose) {
      console.log('calling this.onClose', this.onClose)
      this.onClose();
    }
  }
}

export function makeContextMenu(
  { x, y }: { x: number; y: number },
  items: Options["items"],
  options: Pick<Options, "onClose" | "clickActivator"> = {}
) {
  const menu = createElement(ContextMenu, { items, ...options });
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
