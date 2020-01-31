declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.wasm" {
  const content: any;
  export = content;
}

declare var TG_API_ID: number;
declare var TG_API_HASH: string;
