import { AnimationItem, AnimationConfigWithPath } from "lottie-web";
import { createElement, Component } from "../../utils/dom";

type AnimationConfig = Omit<AnimationConfigWithPath, "container">;

interface Options {
  [s: string]: any;
  config: AnimationConfig;
  onReady?(animation: AnimationItem): void;
}

export default class Lottie implements Component<Options> {
  public readonly element: HTMLElement;
  public animation: AnimationItem;
  private onReady?: Options["onReady"];

  constructor({ config, onReady, ...rest }: Options) {
    this.element = createElement("div", {
      ...rest,
      class: `lottie ${rest.class}`
    });

    this.onReady = onReady;

    this.loadAnimation({
      ...config,
      container: this.element
    });
  }

  private loadAnimation(config: AnimationConfigWithPath) {
    import(/* webpackChunkName: "lottie" */ "lottie-web").then(
      ({ default: lottie }) => {
        this.animation = lottie.loadAnimation(config);
        const checkViewport = () => {
          if (this.inViewport()) {
            this.animation.play();
          } else {
            this.animation.stop();

            setTimeout(() => {
              console.log("extra check with timeout");
              checkViewport();
            }, 1000);
          }
        };
        this.animation.addEventListener("DOMLoaded", checkViewport);
        this.animation.addEventListener("loopComplete", checkViewport);
        if (this.onReady) {
          this.onReady(this.animation);
        }
      }
    );
  }

  public inViewport() {
    const bounding = this.element.getBoundingClientRect();

    return (
      bounding.top >= 0 &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  public updateConfig(config: AnimationConfig) {
    return this.loadAnimation({
      ...config,
      container: this.element
    });
  }
}
