declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.wasm" {
  const content: any;
  export = content;
}

declare var process: {
  env: {
    API_ID: number;
    API_HASH: string;
  };
};
