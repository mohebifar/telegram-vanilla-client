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
      class: "lottie",
      ...rest
    });

    this.onReady = onReady;

    this.loadAnimation({
      ...config,
      container: this.element
    });
  }

  private loadAnimation(config: AnimationConfigWithPath) {
    import(
      /* webpackChunkName: "lottie" */ "lottie-web"
    ).then(({ default: lottie }) => {
      this.animation = lottie.loadAnimation(config);
      if (this.onReady) {
        this.onReady(this.animation);
      }
    });
  }
}
