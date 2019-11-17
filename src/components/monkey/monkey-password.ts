import { createElement, Component } from "../../utils/dom";
import Monkey from "./monkey";
import { debounce } from "../../utils/utils";

interface Options {}

const peekOpenEyesFrame = 15;
const peekEndFrame = 32;
const peekToIdleHandsDownFrame = 0;
const peekToIdleHandsUpFrame = 32;
const closeHandsUpFrame = 60;
const closeHandsDownFrame = 0;

export default class MonkeyPassword extends Monkey
  implements Component<Options> {
  public element: HTMLElement;
  private isPeeking: boolean = false;

  constructor() {
    super(["idle", "closeAndPeek", "close", "peek", "closeAndPeekToIdle"]);

    this.showMonkey("idle");

    this.element = createElement(
      "div",
      { class: "monkey" },
      ...Object.values(this.monkeys)
    );
  }

  async blur() {
    try {
      if (this.isPeeking) {
        this.getAnimation("peek").setCurrentRawFrameValue(peekOpenEyesFrame);
        this.getAnimation("closeAndPeekToIdle").setCurrentRawFrameValue(
          peekToIdleHandsUpFrame
        );
        this.showMonkey("closeAndPeekToIdle");
        await this.goToFrame(peekToIdleHandsDownFrame);
        this.showMonkey("idle");
        this.getAnimation("idle").play();
      } else {
        this.getAnimation("close").setCurrentRawFrameValue(closeHandsUpFrame);
        await this.goToFrame(closeHandsDownFrame);
        this.showMonkey("idle");
        this.getAnimation("idle").play();
      }
    } catch {}
  }

  setIsPeeking = debounce(async (isPeeking: boolean) => {
    if (isPeeking === this.isPeeking && this.currentFile !== "idle") {
      return;
    }

    this.isPeeking = isPeeking;

    try {
      if (isPeeking) {
        if (this.currentFile === "idle") {
          this.getAnimation("closeAndPeekToIdle").setCurrentRawFrameValue(
            peekToIdleHandsDownFrame
          );
          await this.transition("closeAndPeekToIdle");
          this.showMonkey("closeAndPeekToIdle");
          await this.goToFrame(peekToIdleHandsUpFrame);
          this.getAnimation("peek").setCurrentRawFrameValue(peekOpenEyesFrame);
          this.showMonkey("peek");
        } else {
          await this.goToFrame(closeHandsUpFrame);
          this.showMonkey("peek");
          await this.goToFrame(peekOpenEyesFrame);
        }
      } else {
        if (this.currentFile === "peek") {
          await this.goToFrame(peekEndFrame);
          this.getAnimation("close").setCurrentRawFrameValue(closeHandsUpFrame);
          this.showMonkey("close");
        } else if (this.currentFile === "idle") {
          await this.transition("close");
          this.showMonkey("close");
          await this.goToFrame(closeHandsUpFrame);
        }
      }
    } catch {}
  }, 100);
}
