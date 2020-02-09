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
    element.setAttribute(key, value);
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
