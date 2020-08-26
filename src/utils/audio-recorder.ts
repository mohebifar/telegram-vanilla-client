export const MediaRecorder: typeof window.MediaRecorder =
  window.MediaRecorder || (window["webkitMediaRecorder"] as any);
export const AudioContext: typeof window.AudioContext =
  window.AudioContext || (window["webkitAudioContext"] as any);

export class AudioRecorder {
  private recorder: MediaRecorder;
  private startTime: number;

  constructor(stream: MediaStream) {
    const options = { mimeType: "audio/ogg" };
    
    const native = this.supportsNativeRecorder();
    if (native) {
      this.recorder = new MediaRecorder(stream, options);
      this.recorder.start();
      this.startTime = Date.now();
    } else {
      // @ts-ignore
      import(/* webpackChunkName: "opus" */ "./audio-recorder-polyfill").then(
        ({ default: factory }) => {
          this.recorder = factory(stream);
          this.recorder.start();
          this.startTime = Date.now();
        }
      );
    }
  }

  private supportsNativeRecorder() {
    return MediaRecorder && MediaRecorder.isTypeSupported("audio/ogg");
  }

  public stop(): Promise<[Blob, number]> | undefined {
    const duration = Date.now() - this.startTime;

    return new Promise((resolve) => {
      this.recorder.ondataavailable = (event) => {
        resolve([event.data, duration]);
      };
      this.recorder.stop();
    });
  }
}

export function scaleWaveform(waveform: number[] | Uint8Array, length = 48) {
  let compression = waveform.length / length;
  let result = new Uint8Array(length);

  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    const value = result[index++];
    const nextValue = waveform[Math.round(inputIndex)];
    result[index] = value === 0 ? nextValue : (value + nextValue) / 2;
    inputIndex += compression;
  }

  return result;
}
