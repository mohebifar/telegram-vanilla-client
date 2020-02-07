import {
  AnimationItem,
  AnimationConfigWithPath
} from "lottie-web/build/player/lottie_light";
import { createElement, Component } from "../../utils/dom";

type AnimationConfig = Omit<AnimationConfigWithPath, "container">;

interface Options {
  [s: string]: any;
  config?: AnimationConfig;
  onReady?(animation: AnimationItem): void;
}

export default class Lottie implements Component<Options> {
  public readonly element: HTMLElement;
  public animation: AnimationItem;
  private onReady?: Options["onReady"];
  private isVisible = true;

  constructor({ config, onReady, ...rest }: Options) {
    this.element = createElement("div", {
      ...rest,
      class: `lottie ${rest.class}`,
      "data-bm-renderer": "svg"
    });

    this.onReady = onReady;

    if (config) {
      this.loadAnimation({
        ...config,
        renderer: "svg",
        container: this.element
      });
    }
  }

  private loadAnimation(config: AnimationConfigWithPath) {
    import(
      /* webpackChunkName: "lottie" */ "lottie-web/build/player/lottie_light"
    ).then(({ default: lottie }) => {
      this.animation = lottie.loadAnimation(config);
      let options = {
        root: document.body,
        rootMargin: "0px",
        threshold: 0
      };

      let observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (entry) {
          if (entry.isIntersecting) {
            if (!this.isVisible) {
              this.loadAnimation(config);
              this.isVisible = true;
            }
          } else {
            this.isVisible = false;
            this.animation.destroy();
          }
        }
      }, options);
      observer.observe(this.element);

      if (this.onReady) {
        this.onReady(this.animation);
      }
    });
  }

  public updateConfig(config: AnimationConfig) {
    return this.loadAnimation({
      ...config,
      container: this.element
    });
  }
}
