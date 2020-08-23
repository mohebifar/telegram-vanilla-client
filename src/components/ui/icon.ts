import { createElement, Component, removeClass, addClass } from "../../utils/dom";
import "./icon.global.scss";

export enum Icons {
  Spinner = "spinner",
  Up = "up",
  Down = "down",
  CameraAdd = "camera_add",
  Search = "search",
  Menu = "menu",
  Eye1 = "eye1",
  Eye2 = "eye2",
  Send = "send",
  PinnedChat = "pinned_chat",
  Check = "check",
  Checks = "2checks",
  Download = "download",
  Close = "close",
  Play = "play",
  Pause = "pause",
  Smile = "smile",
  Animals = "animals",
  Eats = "eats",
  Car = "car",
  Sport = "sport",
  Lamp = "lamp",
  Flag = "flag",
  Attach = "attach",
  Photo = "photo",
  Document = "document",
  Poll = "poll",
  Delete = "delete",
  Forward = "forward",
  Info = "info",
  Username = "username",
  Phone = "phone",
  Reply = "reply",
  Copy = "copy",
  Pin = "pin",
  Recent = "recent",
  NewGroup = "newgroup",
  NewPrivate = "newprivate",
  Archive = "archive",
  SavedMessages = "savedmessages",
  Settings = "settings",
  Help = "help",
  More = "more",
  Microphone2 = "microphone2",
  Microphone = "microphone",
  Back = "back",
  Stickers = "stickers",
  Gifs = "gifs",
  Tip = "tip",
  CloudDownload = "clouddownload",
  Muted = "muted",
}

export enum IconSprite {
  MenuClose = "menu_close_sprite"
}

export interface Options {
  icon: Icons | IconSprite;
  color?: "white" | "blue" | "black" | "grey" | "grey-light" | "green" | "red";
  [s: string]: any;
}

export default class Icon implements Component<Options> {
  public readonly element: HTMLElement;
  private color: Options["color"];
  private classes: string;

  constructor({ icon, color = "black", ...rest }: Options) {
    const isSprite = Object.values(IconSprite).includes(icon as any);
    this.color = color;
    this.classes = rest["class"] || "";
    const classes = this.getClassName(icon);
    this.element = isSprite
      ? createElement("div", {
          class: `${classes} ic-sprite ic-start`
        })
      : createElement("img", {
          src: this.getSource(icon),
          class: classes
        });
  }

  public setColor(color: Options["color"]) {
    const { classList } = this.element;
    classList.remove("ic-" + this.color);
    classList.add("ic-" + color);
    this.color = color;
  }

  public setSprite(state: "start" | "end") {
    const opposite = state === "start" ? "end" : "start";
    removeClass(this.element, `ic-sprite-${opposite}`);
    addClass(this.element, `ic-sprite-${state}`);
  }

  public setIcon(icon: Icons) {
    this.element.className = this.getClassName(icon);
    (this.element as HTMLImageElement).src = this.getSource(icon);
  }

  private getSource(icon: Options['icon']) {
    return `/assets/icons/${icon}.svg`;
  }

  private getClassName(icon: Options['icon']) {
    return `ic ic-${this.color} ic-${icon} ${this.classes}`;
  }
}
