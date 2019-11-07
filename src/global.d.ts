declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.wasm" {
  const content: any;
  export = content;
}
