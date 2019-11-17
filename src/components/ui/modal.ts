import { createElement, Component } from "../../utils/dom";
import * as styles from "./modal.scss";

interface Options {
  title?: string;
  text: string;
  id?: string;
}

export default class Modal implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ title, text, id }: Options) {
    const titleElement = createElement("h3", title);
    const textElement = createElement("span", text);
    const modal = createElement(
      "div",
      { class: styles.modal },
      titleElement,
      textElement
    );

    this.element = createElement("div", { class: styles.overlay, id }, modal);

    this.element.addEventListener("click", () => {
      this.element.remove();
    });

    modal.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
    });
  }
}

export function makeModal(title: string, text: string) {
  const id = "singleModal";
  const currentModal = document.getElementById(id);
  if (currentModal) {
    currentModal.remove();
  }
  const modal = new Modal({ title, text, id });
  document.body.append(modal.element);
}
