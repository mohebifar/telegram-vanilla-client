import { Component, createElement, Element } from "../../utils/dom";
import { startAnimation } from "../../utils/easing";

interface Transition {
  in(node: HTMLElement, cb: () => any): void;
  out(node: HTMLElement, cb: () => any): void;
}

type ElementWithRouteTransition = Element<Transition>;

interface Route {
  render: (params?: any) => ElementWithRouteTransition;
  name: string;
  keep?: boolean;
}

interface Options {
  routes: Route[];
  onRouteChange?: (route: string) => void;
}

export default class Router implements Component<Options> {
  public readonly element: HTMLElement;
  private routes: Route[];
  private onRouteChange: Options["onRouteChange"];
  private nameMap = new Map<ElementWithRouteTransition, string>();
  private stack: ElementWithRouteTransition[] = [];

  constructor({ routes, onRouteChange }: Options) {
    this.routes = routes;
    this.onRouteChange = onRouteChange;
    this.element = createElement("div", { class: "router" });
  }

  public get currentRouteName() {
    return this.top && this.nameMap.get(this.top);
  }

  public async push(routeName: string, params?: any) {
    const route = this.findRoute(routeName);
    const rendered = route.render(params);
    const wrapped = this.wrap(rendered);

    const previous = this.top;

    this.element.append(wrapped);
    this.nameMap.set(rendered, routeName);
    this.stack.push(rendered);

    if (this.onRouteChange) {
      this.onRouteChange(this.currentRouteName);
    }

    if (previous) {
      await this.transition(previous, rendered);
      previous.parentElement.remove();
    }
  }

  public async back() {
    if (this.stack.length === 1) {
      return;
    }
    const toRemove = this.stack.pop();
    const toView = this.top;
    const wrapped = this.wrap(toView);

    this.element.prepend(wrapped);

    if (this.onRouteChange) {
      this.onRouteChange(this.currentRouteName);
    }

    await this.transition(toRemove, toView);
    toRemove.parentElement.remove();
  }

  private transition(
    from: ElementWithRouteTransition,
    to: ElementWithRouteTransition
  ) {
    return Promise.all([
      new Promise(resolve => {
        to.instance.in(to.parentElement, resolve);
      }),
      new Promise(resolve => {
        from.instance.out(from.parentElement, resolve);
      })
    ]);
  }

  private wrap(node: ElementWithRouteTransition) {
    return createElement("div", { class: "route" }, node);
  }

  private findRoute(routeName: string) {
    return this.routes.find(({ name }) => name === routeName);
  }

  private get top() {
    return this.stack[this.stack.length - 1];
  }
}

export abstract class FadeTransition implements Transition {
  public readonly element: HTMLElement;

  private transition(node: HTMLElement, v: { o: number }) {
    node.style.opacity = v.o + "";
  }

  in(node: HTMLElement, cb: () => any) {
    startAnimation(
      {
        o: { from: 0, to: 1 }
      },
      v => this.transition(node, v),
      cb
    );
  }

  out(node: HTMLElement, cb: () => any) {
    startAnimation(
      {
        o: { from: 1, to: 0 }
      },
      v => this.transition(node, v),
      cb
    );
  }
}

export abstract class DefaultTransition implements Transition {
  public readonly element: HTMLElement;

  private transition(node: HTMLElement, v: { s: number; o: number }) {
    node.style.transform = `scale(${v.s})`;
    node.style.opacity = v.o + "";
  }

  in(node: HTMLElement, cb: () => any) {
    startAnimation(
      {
        s: { from: 1.1, to: 1 },
        o: { from: 0, to: 1 }
      },
      v => this.transition(node, v),
      cb
    );
  }

  out(node: HTMLElement, cb: () => any) {
    startAnimation(
      {
        s: { from: 1, to: 1.1 },
        o: { from: 1, to: 0 }
      },
      v => this.transition(node, v),
      cb
    );
  }
}
