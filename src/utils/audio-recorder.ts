export const MediaRecorder: typeof window.MediaRecorder =
  window.MediaRecorder || (window["webkitMediaRecorder"] as any);
export const AudioContext: typeof window.AudioContext =
  window.AudioContext || (window["webkitAudioContext"] as any);

export class AudioRecorder {
  private recorder: MediaRecorder;
  private encoder: any;
  private startTime: number;

  constructor(
    stream: MediaStream,
    processor: ScriptProcessorNode,
    { sampleRate = 64000 }: { sampleRate: number }
  ) {
    if (this.supportsNativeRecorder()) {
      this.recorder = new MediaRecorder(stream, {
        mimeType: "audio/ogg",
        bitsPerSecond: sampleRate,
      });
      this.recorder.start();
      this.startTime = Date.now();
    } else {
      // @ts-ignore
      import(/* webpackChunkName: "vorbis" */ "vorbis-encoder-js").then(
        ({ encoder: Encoder }) => {
          this.encoder = new Encoder(sampleRate, 1, 0);
          this.startTime = Date.now();
          processor.addEventListener("audioprocess", (event) => {
            try {
              this.encoder.encode([event.inputBuffer.getChannelData(0)]);
            } catch (err) {
              console.error("Failed to encode an ogg chunk", err);
            }
          });
        }
      );
    }
  }

  private supportsNativeRecorder() {
    return MediaRecorder && MediaRecorder.isTypeSupported("audio/ogg");
  }

  public stop(): Promise<[Blob, number]> | undefined {
    const duration = Date.now() - this.startTime;

    if (this.supportsNativeRecorder()) {
      return new Promise((resolve) => {
        this.recorder.ondataavailable = (event) => {
          resolve([event.data, duration]);
        };
        this.recorder.stop();
      });
    }

    if (this.encoder) {
      return [this.encoder.finish(), duration] as any;
    }

    return undefined;
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
