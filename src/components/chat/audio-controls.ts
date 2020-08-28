import { Component, createElement, on } from "../../utils/dom";
import * as styles from "./audio-controls.scss";
import IconButton from "../ui/icon-button";
import { Icons } from "../ui/icon";
import audioManager from "../../utils/audio-manager";
import { IDialog } from "../../models/dialog";

interface Options {
  onMessageSelect: (messageId: number, dialog?: IDialog) => any;
}

export default class AudioControls implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ onMessageSelect }: Options) {
    // const icon = createElement(Icon, { icon: Icons.Play, color: "blue" });
    const button = createElement(IconButton, {
      icon: Icons.Pause,
      color: "blue",
    });
    const closeButton = createElement(IconButton, {
      icon: Icons.Close,
      color: "black",
    });
    const titleEl = createElement("span");
    const subtitleEl = createElement("span");
    const info = createElement(
      "div",
      { class: "ripple " + styles.info },
      titleEl,
      subtitleEl
    );
    this.element = createElement(
      "div",
      { class: styles.container + ' hidden' },
      button,
      info,
      closeButton
    );
    on(this.element, "click", (e) => {
      e.stopPropagation();
    });

    on(button, "click", async () => {
      await audioManager.audio[audioManager.audio.paused ? "play" : "pause"]();
    });

    on(audioManager.audio, ["pause", "ended", "cancel"], () => {
      button.instance.icon.setIcon(Icons.Play);
    });

    on(audioManager.audio, ["play", "playing"], () => {
      button.instance.icon.setIcon(Icons.Pause);
    });
    on(info, "click", async () => {
      if (!audioManager.message) {
        return;
      }
      const peer = await audioManager.message.getPeer();
      if (!peer) {
        return;
      }
      const dialog = await peer.getDialog();
      if (!dialog) {
        return;
      }

      onMessageSelect(audioManager.message.id, dialog);
    });

    on(closeButton, "click", () => {
      audioManager.audio.pause();
      audioManager.setSrc(undefined);
    });

    audioManager.events.on("src", ({ title, subtitle, removed }) => {
      this.element.classList[removed ? 'add' : 'remove']('hidden');

      titleEl.innerText = title;
      subtitleEl.innerText = subtitle;
    });
  }
}
