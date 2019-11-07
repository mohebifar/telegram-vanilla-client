import { createElement, Component } from "../utils/dom";
import * as styles from "./side-bar.module.scss";
import ContactItem from "./ui/contact-item";

interface Options {}

export default class SideBar implements Component<Options> {
  public readonly inputNode: HTMLElement;
  public readonly placeholder: HTMLElement;
  public readonly element: HTMLElement;

  constructor({  }: Options) {

    this.element = createElement(
      "div",
      { class: styles.container },
      createElement(ContactItem, {
        name: "Mohamad",
        text: "Salam",
        time: "21:30",
        img: "https://randomuser.me/api/portraits/men/32.jpg"
      }),
      createElement(ContactItem, {
        name: "Sakinehe",
        text: "Ho sakinehe",
        time: "21:30",
        img: "https://randomuser.me/api/portraits/men/43.jpg"
      }),
      createElement(ContactItem, {
        name: "Mamate",
        text: "Mamad aqa hastam",
        time: "21:30",
        img: "https://randomuser.me/api/portraits/men/86.jpg"
      })
    );
  }
}
