import { WebpMachine } from "webp-hero";

async function dataUriBufferAsync(dataUrl: string) {
  const response = await fetch(dataUrl);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function decodeWebp(data: Uint8Array) {
  const webpMachine = await getMachine();
  const dataUri = await webpMachine.decode(data);
  return dataUriBufferAsync(dataUri);
}

let machine: WebpMachine;
async function getMachine() {
  if (machine) {
    return machine;
  }
  const { WebpMachine } = await import(
    /* webpackChunkName: "webp" */ "webp-hero"
  );
  machine = new WebpMachine();
  return machine;
}
