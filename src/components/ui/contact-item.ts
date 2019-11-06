import { createElement, Component } from "../../utils/dom";
import styles from "./contact-item.module.scss";

interface Options {
  name: string;
  text: string;
  time: string;
  img: string;
}

export default class ContactItem implements Component<Options> {
  public readonly inputNode: HTMLElement;
  public readonly placeholder: HTMLElement;
  public readonly element: HTMLElement;

  constructor({ name, text, time, img }: Options) {

    const avatar = createElement(
      "div",
      { class: styles.avatar },
      createElement("img", {
        src: img,
        alt: name
      })
    );
    const textWrapper = createElement(
      "div",
      { class: styles.text },
      createElement("div", undefined, name),
      createElement("div", undefined, text)
    );
    const meta = createElement(
      "div",
      { class: styles.meta },
      createElement("div", undefined, time),
      createElement("div", undefined, "1")
    );
    const wrapper = createElement(
      "div",
      { class: styles.container },
      avatar,
      textWrapper,
      meta
    );
    this.element = wrapper;
  }
}
