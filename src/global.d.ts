declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.wasm" {
  const content: any;
  export = content;
}

declare class OpusMediaRecorder extends MediaRecorder {
  constructor(
    stream: MediaStream,
    options?: MediaRecorderOptions,
    workerOptions?: any
  );
}

declare module "opus-media-recorder" {
  export = OpusMediaRecorder;
}

declare var TG_API_ID: number;
declare var TG_API_HASH: string;
