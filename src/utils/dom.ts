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

export function createElement<P extends {}, C extends ComponentClass<P>>(
  component: C,
  attrs?: OptionsType<C> | undefined,
  ...children: (Node | string)[]
): Element<C[keyof C]>;

export function createElement<P extends {}>(
  component: string,
  attrs?: P | undefined,
  ...children: (Node | string)[]
): Element<undefined>;

export function createElement<P extends {}>(
  type: ComponentClass<P> | string,
  attrs: P | undefined = undefined,
  ...children: (Node | string)[]
) {
  const factory =
    typeof type === "string"
      ? createElementFromTag
      : createElementFromComponent;

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
    element.setAttribute(key, value);
  });
  element.append(...children);

  return element;
}
