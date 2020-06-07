import { Component, createElement, on, off, Element } from "../../utils/dom";
import {
  AudioRecorder,
  AudioContext,
  scaleWaveform,
} from "../../utils/audio-recorder";
import Icon, { Icons } from "../ui/icon";

interface Options {
  onClick?(): any;
  onStart(): void;
  onEnd(data: Blob, duration: number, waveform: Uint8Array): void;
  onClear(): void;
}

export default class RecordButton implements Component<Options> {
  public element: HTMLElement;
  private stream: MediaStream;
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private processor: ScriptProcessorNode;
  private microphone: MediaStreamAudioSourceNode;
  private recorder: AudioRecorder;
  private onEnd: Options["onEnd"];
  private onStart: Options["onStart"];
  private onClear: Options["onClear"];
  private icon: Element<Icon>;
  private state: "send" | "mic" = "mic";
  private waveform: number[] = [];
  private waitForRecord: Promise<void>;

  constructor({ onEnd, onStart, onClear }: Options) {
    this.onEnd = onEnd;
    this.onStart = onStart;
    this.onClear = onClear;
    this.icon = createElement(Icon, {
      icon: Icons.Microphone2,
      color: "grey",
    });
    this.element = createElement("button", this.icon);

    const handleTouchStart = () => {
      if (this.state !== "mic") {
        return;
      }

      const startTime = Date.now();

      const handleTouchEnd = () => {
        this.stop(Date.now() - startTime < 400);
        off(document, ["mouseup", "touchend"], handleTouchEnd);
      };

      on(document, ["mouseup", "touchend"], handleTouchEnd);

      this.waitForRecord = this.record();
    };

    on(this.element, ["mousedown", "touchstart"], handleTouchStart);
    on(this.element, "touchcancel", () => {
      this.stop(true);
    });
    on(this.element, "contextmenu", (event) => {
      event.preventDefault();
    });
  }

  public setState(state: "send" | "mic") {
    this.icon.instance.setColor(state === "send" ? "blue" : "grey");
    this.icon.instance.setIcon(
      state === "send" ? Icons.Send : Icons.Microphone2
    );
  }

  private record = async () => {
    try {
      navigator.mediaDevices.enumerateDevices;
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

    } catch (error) {
      console.log("error", error);
      this.onClear();
      return;
    }

    const sampleRate = 64000;
    this.audioContext = new AudioContext({
      sampleRate,
    });
    this.analyser = this.audioContext.createAnalyser();
    this.microphone = this.audioContext.createMediaStreamSource(this.stream);
    this.processor = this.audioContext.createScriptProcessor(2048, 1, 1);

    this.analyser.smoothingTimeConstant = 0.8;
    this.analyser.fftSize = 1024;

    this.microphone.connect(this.analyser);
    this.analyser.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
    this.processor.addEventListener("audioprocess", () => {
      const array = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(array);

      const maxDecible = Math.max(...array);
      this.waveform.push(maxDecible);
      this.element.style.boxShadow = this.getBoxShadow(maxDecible);
    });

    this.recorder = new AudioRecorder(this.stream, this.processor, {
      sampleRate,
    });

    this.onStart();
  };

  private stop = async (skip = false) => {
    try {
      await this.waitForRecord;
      if (this.stream) {
        this.stream.getTracks().forEach((track) => {
          track.stop();
        });
        this.processor.disconnect();
        this.analyser.disconnect();
        this.microphone.disconnect();
        const result = await this.recorder.stop();
        if (result && !skip) {
          const [data, duration] = result;
          if (duration > 200) {
            const waveform = scaleWaveform(this.waveform, 63);
            this.onEnd(data, Math.round(duration / 1000), waveform);
            return;
          }
        }
      }
    } finally {
      this.element.style.boxShadow = this.getBoxShadow(0);
    }

    this.onClear();
  };

  private getBoxShadow(decible: number) {
    return `0 0 0 ${Math.floor(decible / 4)}px rgba(0, 0, 0, 0.05)`;
  }
}
