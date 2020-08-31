import {
  AnimationConfigWithPath,
  AnimationItem,
  AnimationConfigWithData,
} from "lottie-web/build/player/lottie_light";
import { Component, createElement, Element } from "../../utils/dom";

type AnimationConfig = Omit<AnimationConfigWithPath & AnimationConfigWithData, "container">;

interface Options {
  [s: string]: any;
  config?: AnimationConfig;
  onReady?(animation: AnimationItem): void;
  autoClean?: boolean;
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const { instance } = entry.target as Element<Lottie>;

      if (entry.isIntersecting) {
        instance.loadAnimation();
      } else {
        instance.isVisible = false;

        if (instance.animation) {
          instance.animation.stop();
          instance.animation.destroy();
          delete instance.animation;
        }
      }
    }
  },
  {
    threshold: [0, 0.25, 0.5, 0.75, 1],
  }
);

export default class Lottie implements Component<Options> {
  public readonly element: HTMLElement;
  public animation: AnimationItem;
  private onReady?: Options["onReady"];
  private autoClean?: Options["autoClean"];
  public isVisible = false;
  private config: AnimationConfig;

  constructor({ config, onReady, autoClean = true, ...rest }: Options) {
    this.element = createElement("div", {
      ...rest,
      class: `lottieWrapper ${rest.class || ""}`,
      "data-bm-renderer": "svg",
    });

    this.onReady = onReady;
    this.autoClean = autoClean;

    if (config) {
      this.updateConfig(config);
    }
  }

  public loadAnimation() {
    if (this.isVisible || !this.config) {
      return;
    }
    this.isVisible = true;

    import(
      /* webpackChunkName: "lottie" */ "lottie-web/build/player/lottie_light"
    )
      .then(({ default: lottie }) => {
        this.animation = lottie.loadAnimation({
          ...this.config,
          renderer: "svg",
          container: this.element,
          rendererSettings: {
            progressiveLoad: true,
          },
        });

        if (this.autoClean) {
          observer.observe(this.element);
        }

        if (this.onReady) {
          this.onReady(this.animation);
        }
      })
      .catch(() => {
        this.isVisible = false;
      });
  }

  public updateConfig(config: AnimationConfig, play = true) {
    this.config = config;

    if (play) {
      return this.loadAnimation();
    }
  }
}
