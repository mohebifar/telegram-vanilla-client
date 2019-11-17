import { createElement, Component } from "../../utils/dom";
import Monkey from "./monkey";

interface Options {}

export default class MonkeyTrakcing extends Monkey
  implements Component<Options> {
  public element: HTMLElement;

  constructor() {
    super(["idle", "tracking"]);

    this.showMonkey("idle");

    this.element = createElement(
      "div",
      { class: "monkey" },
      ...Object.values(this.monkeys)
    );
  }

  async focus(x = 0) {
    await this.transition("tracking", 300);
    this.showMonkey("tracking");
    const numberOfFrames = 140;
    const finalFrame = Math.ceil(20 + numberOfFrames * x);
    this.goToFrame(finalFrame, 300);
  }

  async blur(hasValue = false) {
    if (hasValue) {
      await this.goToFrame(179, 500);
    } else {
      await this.transition("idle", 300);
      this.showMonkey("idle");
      this.monkeys[this.currentFile].instance.animation.play();
    }
  }
}
