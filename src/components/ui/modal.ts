import { createElement, Component } from "../../utils/dom";
import * as styles from "./modal.scss";
import { startAnimation } from "../../utils/easing";
import IconButton from "./icon-button";
import { Icons } from "./icon";
import Button from "./button";

interface Options {
  title?: string;
  content: string | HTMLElement;
  id?: string;
  action?: {
    caption: string;
    onClick: Function;
  };
  onClose: Function;
}

export default class Modal implements Component<Options> {
  public readonly element: HTMLElement;
  private onClose: Options["onClose"];

  constructor({ title, content, id, action, onClose }: Options) {
    this.onClose = onClose;
    const titleElement = createElement("h3", title);
    const contentElement = createElement(
      "div",
      { class: styles.content },
      content
    );
    const closeElement = createElement(IconButton, {
      icon: Icons.Close,
      onClick: () => {
        this.close(true);
      }
    });
    const headingElement = createElement(
      "div",
      { class: styles.heading },
      closeElement,
      titleElement,
      createElement(
        "div",
        action
          ? createElement(Button, {
              caption: action.caption,
              size: "s",
              onClick: action.onClick
            })
          : ""
      )
    );
    const modal = createElement(
      "div",
      { class: styles.modal },
      headingElement,
      contentElement
    );

    this.element = createElement("div", { class: styles.container, id }, modal);

    this.element.addEventListener("click", () => {
      this.close(true);
    });

    modal.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  public close(callOnClose = false) {
    startAnimation(
      { o: { from: 1, to: 0 } },
      v => {
        this.element.style.opacity = v.o + "";
      },
      () => {
        this.element.remove();
        if (callOnClose && this.onClose) {
          this.onClose();
        }
      }
    );
  }
}

export function makeModal(
  title: string,
  content: string | HTMLElement,
  action?: Options["action"],
  onClose?: Function
) {
  const id = "singleModal";
  const currentModal = document.getElementById(id);
  if (currentModal) {
    currentModal.remove();
  }
  const modal = new Modal({ title, content, id, action, onClose });
  document.body.append(modal.element);
  return modal;
}
