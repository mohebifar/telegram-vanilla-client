import { Component, createElement, on, removeClass, Element } from "../../utils/dom";
import * as styles from "./tabs.scss";
import { startAnimation } from "../../utils/easing";

export interface Tab {
  title: string | Element<any>;
  content?: HTMLElement;
}

interface Options {
  class?: string;
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

  constructor({ tabs, onTabChange, class: className }: Options) {
    this.tabs = tabs;
    this.onTabChange = onTabChange;

    this.panels = tabs.map((tab, i) => {
      const element = createElement(
        "button",
        { class: styles.tab + ' ' + (typeof tab.title === 'string' ? styles.text : ''), type: "button" },
        tab.title
      );
      on(element, "click", () => {
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
      { class: `${styles.root} ${className || ''}` },
      header,
      this.contentWrapper
    );

    this.setTab(0);
    this.element = element;
  }

  public setTab(index: number) {
    if (this.currentTab === index) {
      return;
    }

    const tab = this.tabs[index];

    this.panels.forEach(panel => removeClass(panel, styles.active));
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
      content.style.transform = `translate3d(${width}px, 0, 0)`;
      const direction = this.currentTab > index ? 1 : -1;

      startAnimation(
        {
          o: { from: 0, to: width * direction },
          n: { from: -width * direction, to: 0 }
        },
        v => {
          oldContent.style.transform = `translate3d(${v.o}px, 0, 0)`;
          content.style.transform = `translate3d(${v.n}px, 0, 0)`;
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

  get tab() {
    return this.currentTab;
  }
}
