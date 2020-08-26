import { Component, createElement, on, off, Element } from "../../utils/dom";
import {
  AudioRecorder,
  AudioContext,
  scaleWaveform,
} from "../../utils/audio-recorder";
import Icon, { Icons } from "../ui/icon";
import SoundMeter from "../../utils/sound-meter";

interface Options {
  onClick?(): any;
  onStart(): void;
  onEnd(data: Blob, duration: number, waveform: Uint8Array): void;
  onClear(): void;
}

export default class RecordButton implements Component<Options> {
  public element: HTMLElement;
  private stream: MediaStream;
  private recorder: AudioRecorder;
  private onEnd: Options["onEnd"];
  private onStart: Options["onStart"];
  private onClear: Options["onClear"];
  private icon: Element<Icon>;
  private state: "send" | "mic" = "mic";
  private waveform: number[] = [];
  private waitForRecord?: Promise<void>;
  private soundMeter: SoundMeter;
  private intervalBoxShadow = 0;
  private intervalWaveform = 0;

  constructor({ onEnd, onStart, onClear }: Options) {
    this.onEnd = onEnd;
    this.onStart = onStart;
    this.onClear = onClear;
    this.icon = createElement(Icon, {
      icon: Icons.Microphone2,
      color: "grey",
    });
    this.element = createElement("button", this.icon);

    let timeout: number;
    let touching = false;

    const handleTouchStart = async () => {
      if (this.state !== "mic") {
        return;
      }

      touching = true;
      const hasPermission = await this.requestPermission();

      if (!hasPermission || !touching) {
        return;
      }

      timeout = setTimeout(() => {
        const startTime = Date.now();

        const handleTouchEnd = () => {
          this.stop(Date.now() - startTime < 400);
          off(document, ["mouseup", "touchend"], handleTouchEnd);
        };

        on(document, ["mouseup", "touchend"], handleTouchEnd);

        this.waitForRecord = this.record();
      });
    };

    on(this.element, ["mouseup", "touchend"], () => {
      touching = false;
      clearTimeout(timeout);
    });

    on(this.element, ["mousedown", "touchstart"], handleTouchStart);
    on(this.element, "touchcancel", () => {
      this.stop(true);
    });
    on(this.element, "contextmenu", (event) => {
      event.preventDefault();
    });
  }

  public setState(state: "send" | "mic") {
    this.state = state;
    this.icon.instance.setColor(state === "send" ? "blue" : "grey");
    this.icon.instance.setIcon(
      state === "send" ? Icons.Send : Icons.Microphone2
    );
  }

  private requestPermission() {
    return Promise.race([
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      }),
      new Promise((resolve) => setTimeout(() => resolve(false), 2000)),
    ]).then((resolved) => Boolean(resolved));
  }

  private record = async () => {
    try {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (error) {
      console.log("error", error);
      this.onClear();
      return;
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    this.recorder = new AudioRecorder(this.stream);
    const context = new AudioContext();
    this.soundMeter = new SoundMeter(context);
    this.soundMeter.connectToSource(this.stream, (e) => {
      if (e) {
        alert(e);
        return;
      }

      this.intervalBoxShadow = setInterval(() => {
        this.element.style.boxShadow = this.getBoxShadow(
          this.soundMeter.instant
        );
      }, 100);

      this.intervalWaveform = setInterval(() => {
        this.waveform.push(Math.min(255, this.soundMeter.instant * 6000));
      }, 50);
    });

    this.onStart();
  };

  private stop = async (skip = false) => {
    let canSend = false;
    if (this.soundMeter) {
      clearInterval(this.intervalBoxShadow);
      clearInterval(this.intervalWaveform);
      this.soundMeter.stop();
    }
    try {
      if (this.waitForRecord) {
        await this.waitForRecord;
        if (this.stream) {
          this.stream.getTracks().forEach((track) => {
            track.stop();
          });

          const result = await this.recorder.stop();
          if (result && !skip) {
            const [data, duration] = result;
            if (duration > 200) {
              const waveform = scaleWaveform(this.waveform, 63);
              this.onEnd(data, Math.round(duration / 1000), waveform);
              canSend = true;
            }
          }
        }
      }
    } catch (err) {
      console.log("err", err);
    }

    this.waitForRecord = undefined;
    this.element.style.boxShadow = this.getBoxShadow(0);

    setTimeout(() => {
      this.element.style.boxShadow = this.getBoxShadow(0);
    }, 400);

    if (!canSend) {
      this.onClear();
    }
  };

  private getBoxShadow(decible: number) {
    return `0 0 0 ${Math.floor(decible * 400)}px rgba(0, 0, 0, 0.05)`;
  }
}
