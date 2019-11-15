import { createElement, Component, Element } from "../../utils/dom";
import Lottie from "../ui/lottie";

import "./monkey.scss";
import { AnimationEventCallback } from "lottie-web";

interface Options {}

type MonkeyIds = "idle" | "tracking";

type Monkeys = {
  [s in MonkeyIds]: Element<Lottie>;
};

type CurrentFrame = {
  [s in MonkeyIds]: number;
};

type FinalEvent = {
  [s in MonkeyIds]?: Function;
};

export default class Monkey implements Component<Options> {
  public element: HTMLElement;
  private monkeys: Monkeys;
  private completeEvent: AnimationEventCallback<any>;
  private finalFrame: CurrentFrame = {
    idle: 0,
    tracking: 0
  };
  private onAnimationDone: FinalEvent = {};

  private currentTransition?: [string, string];

  constructor() {
    this.monkeys = ["idle", "tracking"]
      .map((file): [string, Element<Lottie>] => [
        file,
        createElement(Lottie, {
          config: {
            path: `/assets/monkey/${file}.json`,
            renderer: "svg",
            autoplay: file === "idle"
          },
          onReady: animation => {
            if (file === "tracking") {
              animation.addEventListener("complete", () => {
                this.finalFrame.tracking = undefined;
                this.monkeys.tracking.style.display = "none";
                this.monkeys.idle.style.display = "block";
              });
            }

            animation.addEventListener("enterFrame", ({ currentTime }) => {
              const direction = (animation as any).playDirection;
              const finalFrame = this.finalFrame[file];

              if (
                finalFrame !== undefined && direction === 1
                  ? currentTime >= finalFrame
                  : currentTime <= finalFrame
              ) {
                animation.pause();
                this.finalFrame[file] = undefined;
                const cb = this.onAnimationDone[file];
                this.onAnimationDone[file] = undefined;
                if (cb) cb();
              }
            });
          }
        })
      ])
      .reduce(
        (obj, [file, element]) => ({ ...obj, [file]: element }),
        {} as Monkeys
      );

    this.monkeys.tracking.style.display = "none";

    this.element = createElement(
      "div",
      { class: "monkey" },
      ...Object.values(this.monkeys)
    );
  }

  focus(x = 0) {
    this.transition("idle", "tracking", () => {
      const { animation } = this.monkeys.tracking.instance;
      const numberOfFrames = 140;
      const finalFrame = Math.ceil(20 + numberOfFrames * x);
      const { currentFrame } = animation as any;
      const direction = finalFrame > currentFrame ? 1 : -1;
      const speed = (Math.abs(finalFrame - currentFrame) / numberOfFrames) * 10;
      this.finalFrame.tracking = Math.round(finalFrame);

      animation.setSpeed(speed);
      animation.setDirection(direction);
      animation.play();
    });
  }

  blur() {
    this.transition("tracking", "idle", () => {
      const { animation } = this.monkeys.idle.instance;

      animation.setDirection(1);
      animation.setSpeed(1);
      animation.goToAndPlay(0);
      this.completeEvent = () => {
        animation.goToAndPlay(0);
      };
      animation.addEventListener("complete", this.completeEvent);
    });
  }

  clearEvents() {
    const { animation: trackingAnimation } = this.monkeys.tracking.instance;
    const { animation: idleAnimation } = this.monkeys.idle.instance;
    trackingAnimation.removeEventListener("complete", this.completeEvent);
    idleAnimation.removeEventListener("complete", this.completeEvent);
  }

  protected transition(
    fromId: MonkeyIds,
    toId: MonkeyIds,
    cb?: Function,
    speedMultiplier = 8
  ) {
    const from = this.monkeys[fromId];
    const to = this.monkeys[toId];
    const { animation: fromAnimation } = from.instance;
    const { currentFrame } = fromAnimation as any;
    const totalFrames = fromAnimation.getDuration(true);
    const [currentFrom, currentTo] = this.currentTransition || [];

    const isDoingADifferentTransition =
      currentFrom && currentTo && currentFrom !== fromId && currentTo !== toId;
    const isDoingTheSameTransition =
      currentFrom === fromId && currentTo === toId;

    if (
      !isDoingADifferentTransition &&
      (isDoingTheSameTransition ||
        to.style.display === "block" ||
        currentFrame === 0 ||
        currentFrame === totalFrames)
    ) {
      if (cb) cb();
      from.style.display = "none";
      to.style.display = "block";

      return;
    }

    this.currentTransition = [fromId, toId];
    this.onAnimationDone[currentFrom] = undefined;
    this.finalFrame[currentFrom] = undefined;

    const halfFrames = totalFrames / 2;
    const direction = currentFrame < halfFrames ? -1 : 1;
    this.finalFrame[fromId] = direction === 1 ? totalFrames : 0;

    this.onAnimationDone[fromId] = () => {
      if (cb) cb();
      from.style.display = "none";
      to.style.display = "block";
    };

    const speed =
      ((totalFrames - Math.abs(totalFrames - currentFrame)) / totalFrames) *
      speedMultiplier;

    fromAnimation.setSpeed(speed);
    fromAnimation.setDirection(direction);
    fromAnimation.play();
  }
}
