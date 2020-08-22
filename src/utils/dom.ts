import { isMobile } from "./mobile";

export interface Element<T> extends HTMLElement {
  instance?: T;
}

export interface Component<P = {}> {
  element: Element<Component<P>>;
}

interface Attributes {
  [s: string]: any;
}

type OptionsType<T> = T extends new (options: infer U) => any ? U : never;

type ComponentType<T> = T extends new (options: any) => infer U ? U : never;

interface ComponentClass<P = {}> {
  new (props?: P): Component<P>;
}

const preloaded = new Set<string>();

export function preload(
  href: string,
  as: "style" | "image" | "script" | "audio" = "image"
) {
  if (preloaded.has(href)) {
    return;
  }
  preloaded.add(href);
  document.head.append(createElement("link", { rel: "preload", href, as }));
}

type Children = Node | Component | string;

export function createElement<
  CC,
  C extends ComponentType<CC>,
  P extends OptionsType<CC>
>(
  component: CC,
  attrs?: OptionsType<CC> | undefined,
  ...children: Children[]
): Element<C>;

export function createElement<P extends {}>(
  component: string,
  attrs?: P | undefined,
  ...children: Children[]
): HTMLElement;

export function createElement<P extends {}, C extends ComponentClass<P>>(
  component: C,
  ...children: Children[]
): Element<C[keyof C]>;

export function createElement<P extends {}>(
  component: string,
  ...children: Children[]
): Element<undefined>;

export function createElement<P extends {}>(
  type: ComponentClass<P> | string,
  ...args: [Children | P | undefined, ...Children[]]
) {
  const factory =
    typeof type === "string"
      ? createElementFromTag
      : createElementFromComponent;

  let children: (Node | string)[];
  let attrs: P | undefined;

  if (
    !(
      args[0] instanceof Node ||
      typeof args[0] === "string" ||
      typeof args[0] === "function"
    )
  ) {
    children = args.slice(1) as any;
    attrs = args[0] as any;
  } else {
    children = args as any;
    attrs = undefined;
  }

  return factory(type as any, attrs, ...children);
}

function createElementFromComponent<P, T extends ComponentClass<P>>(
  component: T,
  attrs: any = {},
  ...children: (Node | string)[]
) {
  const componentInstance = new component(attrs);
  const element = componentInstance.element;
  element.instance = componentInstance;
  element.append(...children);

  return element;
}

function createElementFromTag(
  tag: string,
  attrs: Attributes = {},
  ...children: (Node | string)[]
) {
  const element: Element<undefined> = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "style") {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        element.style[styleKey] = styleValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });
  element.append(...children);

  return element;
}

export function getNthChild<T extends HTMLElement | Node>(
  element: T,
  n: number | "first" | "last"
) {
  let num: number;
  const childNodes = element.childNodes;
  if (n === "first") {
    num = 0;
  } else if (n === "last") {
    num = childNodes.length - 1;
  } else {
    num = n;
  }

  return childNodes.item(num) as HTMLElement;
}

export function removeChildren<T extends HTMLElement | Element<any>>(
  parent: T
) {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
}

export function addClass<T extends HTMLElement | Element<any>>(
  element: T,
  ...tokens: string[]
) {
  element.classList.add(...tokens);
}

export function removeClass<T extends HTMLElement | Element<any>>(
  element: T,
  ...tokens: string[]
) {
  element.classList.remove(...tokens);
}

type AllEventMap = HTMLElementEventMap & SourceBufferEventMap & MediaSourceEventMap;
type AllEventNames = keyof AllEventMap;
type AddintionalEvents = "longpress";
type EventNames<K = AllEventNames> = K extends AllEventNames[]
  ? K[number]
  : K | AddintionalEvents;
type EventType<K> = K extends AllEventNames
  ? AllEventMap[K]
  : K extends AllEventNames[]
  ? AllEventMap[K[number]]
  : Event;

const longPressMap = new Map<Function, [Function, Function]>();

const preventDefault = (event: Event) => event.preventDefault();

export function on<
  K extends AllEventNames,
  T extends EventTarget
>(
  element: T,
  eventType: EventNames<K> | EventNames<K>[],
  listener: (this: HTMLFormElement, ev: EventType<K>) => any,
  options?: boolean | AddEventListenerOptions
) {
  if (eventType === "longpress") {
    if (isMobile()) {
      let timer = 0;
      let pos: [number, number];
      const moveListener = (event: TouchEvent) => {
        const { pageX, pageY } = event.touches.item(0);
        pos = [pageX, pageY];
      };
      const startListener = (event: TouchEvent) => {
        on(element, "touchmove", moveListener);
        timer = setTimeout(() => {
          const { pageX, pageY } = event.touches.item(0);
          if (
            !pos ||
            (Math.abs(pageX - pos[0]) < 10 && Math.abs(pageY - pos[1]) < 10)
          ) {
            listener.bind(element, event)();
          }
          off(element, "touchmove", moveListener);
        }, 700);
      };
      const endListener = () => {
        clearTimeout(timer);
        pos = undefined;
        off(element, "touchmove", moveListener);
      };

      on(element, "touchstart", startListener, options);
      on(element, "touchend", endListener, options);
      on(element, "contextmenu", preventDefault, options);
      longPressMap.set(listener, [startListener, endListener]);
    } else {
      on(element, "contextmenu", listener as any, options);
    }
    return () => off(element, "longpress", listener as any, options);
  }

  if (Array.isArray(eventType)) {
    const cleanUps = eventType.map((event) =>
      on(element, event, listener, options)
    );

    return () => {
      cleanUps.forEach((cleanUp) => cleanUp());
    };
  } else {
    element.addEventListener(eventType, listener, options);
    return () => off(element, eventType, listener, options);
  }
}

export function off<
  K extends AllEventNames,
  T extends EventTarget
>(
  element: T,
  eventType: EventNames<K> | EventNames<K>[],
  listener: (this: HTMLFormElement, ev: EventType<K>) => any,
  options?: boolean | AddEventListenerOptions
) {
  if (eventType === "longpress") {
    if (isMobile()) {
      const events = longPressMap.get(listener);
      if (!events) {
        return;
      }
      const [start, end] = events;
      off(element, "touchstart", start as any, options);
      off(element, "touchend", end as any, options);
      off(element, "contextmenu", preventDefault, options);
    }

    off(element, "contextmenu", listener as any, options);
    return;
  }

  if (Array.isArray(eventType)) {
    eventType.forEach((event) => {
      off(element, event, listener, options);
    });
  } else {
    element.removeEventListener(eventType, listener, options);
  }
}

export function scrollTo(scrollElement: HTMLElement, options: ScrollToOptions) {
  scrollElement.style.overflow = "hidden";
  scrollElement.scrollTo(options);
  setTimeout(() => {
    scrollElement.style.overflow = "";
  }, 10);
}

export function isDescendentOf(from: HTMLElement, to: HTMLElement) {
  let parent = from;

  while ((parent = parent.parentElement)) {
    if (parent === to) {
      return true;
    }
  }

  return false;
}
