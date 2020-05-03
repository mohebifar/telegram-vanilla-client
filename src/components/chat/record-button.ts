import { Component, createElement, on, off, Element } from "../../utils/dom";
import { AudioRecorder, scaleWaveform } from "../../utils/audio-recorder";
import Icon, { Icons } from "../ui/icon";

interface Options {
  onClick?(): any;
  onStart(): void;
  onEnd(data: Blob, duration: number, waveform: Uint8Array): void;
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
  private icon: Element<Icon>;
  private iconName = Icons.Microphone2;
  private waveform: number[] = [];

  constructor({ onEnd, onStart }: Options) {
    this.onEnd = onEnd;
    this.onStart = onStart;
    this.icon = createElement(Icon, {
      icon: this.iconName,
      color: "grey",
    });
    this.element = createElement("button", this.icon);

    on(this.element, "mousedown", (event) => {
      if (this.iconName !== Icons.Microphone2) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      this.record();

      const handleMouseUp = () => {
        this.stop();
        off(document, "mouseup", handleMouseUp);
      };

      on(document, "mouseup", handleMouseUp);
    });
  }

  public setIcon(icon: Icons) {
    this.iconName = icon;
    this.icon.instance.setColor(icon === Icons.Send ? "blue" : "grey");
    this.icon.instance.setIcon(icon);
  }

  private record = async () => {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

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

  private stop = async () => {
    this.stream.getTracks().forEach((track) => {
      track.stop();
    });
    this.processor.disconnect();
    this.analyser.disconnect();
    this.microphone.disconnect();

    const result = await this.recorder.stop();
    if (result) {
      const [data, duration] = result;
      if (duration > 200) {
        const waveform = scaleWaveform(this.waveform, 63);
        this.onEnd(data, Math.round(duration / 1000), waveform);
      }
    }

    this.element.style.boxShadow = this.getBoxShadow(0);
  };

  private getBoxShadow(decible: number) {
    return `0 0 0 ${Math.floor(decible / 4)}px rgba(0, 0, 0, 0.05)`;
  }
}
