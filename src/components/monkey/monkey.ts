import { createElement, Element } from "../../utils/dom";
import Lottie from "../ui/lottie";

import "./monkey.scss";
import { AnimationItem } from "lottie-web/build/player/lottie_light";

export type MonkeyId =
  | "idle"
  | "tracking"
  | "close"
  | "peek"
  | "closeAndPeek"
  | "closeAndPeekToIdle";

type Monkeys = {
  [s in MonkeyId]: Element<Lottie>;
};

export default class Monkey {
  protected monkeys: Monkeys;
  protected files: MonkeyId[];
  protected currentFile: MonkeyId;
  private animationFrame: number;
  private currentPromiseReject?: Function;

  constructor(files: MonkeyId[]) {
    this.files = files;
    this.monkeys = files
      .map((file): [MonkeyId, Element<Lottie>] => [
        file,
        createElement(Lottie, {
          config: {
            path: `/assets/monkey/${file}.json`,
            renderer: "svg",
            autoplay: file === "idle",
            loop: file === "idle"
          }
        })
      ])
      .reduce(
        (obj, [file, element]) => ({ ...obj, [file]: element }),
        {} as Monkeys
      );
  }

  protected showMonkey(name: MonkeyId) {
    this.files.forEach(file => {
      this.monkeys[file].style.display = "none";
    });

    this.currentFile = name;
    this.monkeys[name].style.display = "block";
  }

  protected getAnimation(
    name: MonkeyId = this.currentFile
  ): AnimationItem | any {
    return this.monkeys[name].instance.animation;
  }

  protected transition(toId: MonkeyId, duration = 400) {
    if (toId === this.currentFile) {
      return undefined;
    }

    const animation = this.getAnimation();
    const totalFrames = animation.getDuration(true);
    let startFrame = (animation as any).currentFrame;
    const endFrame = startFrame > totalFrames / 2 ? totalFrames - 1 : 0;

    return this.goToFrame(endFrame, duration);
  }

  protected goToFrame(endFrame: number, duration = 600) {
    return new Promise((resolve, reject) => {
      let startTime = Date.now();
      let endTime = startTime + duration;
      const animation = this.getAnimation();
      let startFrame = (animation as any).currentFrame;

      const distance = endFrame - startFrame;

      animation.pause();

      const doTransition = () => {
        const currentTime = Math.min(Date.now(), endTime);
        const progress = (currentTime - startTime) / duration;

        const frame = Math.ceil(startFrame + progress * distance);
        (animation as any).setCurrentRawFrameValue(frame);

        if (progress !== 1) {
          this.animationFrame = requestAnimationFrame(doTransition);
        } else {
          resolve();
        }
      };
      if (this.currentPromiseReject) {
        this.currentPromiseReject();
      }
      cancelAnimationFrame(this.animationFrame);
      this.currentPromiseReject = reject;
      this.animationFrame = requestAnimationFrame(doTransition);
    });
  }
}
