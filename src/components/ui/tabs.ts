import { Component, createElement } from "../../utils/dom";
import * as styles from "./tabs.scss";
import { startAnimation } from "../../utils/easing";

export interface Tab {
  title: string;
  content?: HTMLElement;
}

interface Options {
  tabs: Tab[];
  onTabChange?(index: number): void;
}

export default class EmojiPanel implements Component<Options> {
  public readonly element: HTMLElement;
  private panels: HTMLElement[];
  private contentWrapper: HTMLElement;
  private tabs: Options["tabs"];
  private onTabChange?: Options["onTabChange"];
  private currentTab: number;

  constructor({ tabs, onTabChange }: Options) {
    this.tabs = tabs;
    this.onTabChange = onTabChange;

    this.panels = tabs.map((tab, i) => {
      const element = createElement(
        "button",
        { class: styles.tab, type: "button" },
        tab.title
      );
      element.addEventListener("click", () => {
        this.setTab(i);
      });
      return element;
    });

    const header = createElement("div", { class: styles.tabs }, ...this.panels);
    this.contentWrapper = createElement("div", {
      class: styles.contentWrapper
    });
    const element = createElement(
      "div",
      { class: styles.root },
      header,
      this.contentWrapper
    );

    this.setTab(0);
    this.element = element;
  }

  public setTab(index: number) {
    const tab = this.tabs[index];

    this.panels.forEach(panel => panel.classList.remove(styles.active));
    this.panels[index].classList.add(styles.active);

    const content = createElement(
      "div",
      { class: styles.content },
      tab.content
    );
    const oldContent = this.contentWrapper.firstChild as HTMLElement;
    const { width } = this.contentWrapper.getBoundingClientRect();
    this.contentWrapper.append(content);

    if (oldContent) {
      content.style.transform = `translateX(${width}px)`;
      const direction = this.currentTab > index ? 1 : -1;

      startAnimation(
        {
          o: { from: 0, to: width * direction },
          n: { from: -width * direction, to: 0 }
        },
        v => {
          oldContent.style.transform = `translateX(${v.o}px)`;
          content.style.transform = `translateX(${v.n}px)`;
        },
        () => {
          oldContent.remove();
        }
      );
    }

    this.currentTab = index;
    if (this.onTabChange) {
      this.onTabChange(index);
    }
  }
}
