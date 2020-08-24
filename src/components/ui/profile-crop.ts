import { createElement, Component, on } from "../../utils/dom";

import * as styles from "./profile-crop.scss";

interface Options {
  image: HTMLImageElement;
}

const PREVIEW_SIZE = 320;

export default class ProfileCrop implements Component<Options> {
  public readonly element: HTMLElement;
  private imageElement: HTMLImageElement;
  private cropper: HTMLElement;
  private image: HTMLImageElement;
  public unmount: Function;
  public getBlob: () => Promise<Blob>;

  constructor({ image }: Options) {
    this.image = image;
    this.imageElement = createElement("img", {
      src: image.src,
      class: styles.imageWrapper,
      crossorigin: "anonymous",
    });
    const { width, height } = image;
    const ratio = PREVIEW_SIZE / width;
    const size = Math.floor(Math.min(width, height) * 0.9 * ratio);
    this.cropper = createElement("div", {
      class: styles.cropper,
      style: {
        width: `${size}px`,
        height: `${size}px`,
        top: "16px",
        left: "16px",
      },
    });

    const element = createElement(
      "div",
      {
        class: styles.wrapper + " noselect",
        style: {
          width: `${PREVIEW_SIZE}px`,
        },
      },
      this.imageElement,
      this.cropper
    );

    this.element = element;
    this.register();
  }

  private register() {
    const element = this.cropper;
    let isMouseDown = false;

    // initial mouse X and Y for `mousedown`
    let mouseX: number;
    let mouseY: number;

    // element X and Y before and after move
    let elementX: number;
    let elementY: number;

    const updateCoords = () => {
      elementX = parseInt(element.style.left) || 0;
      elementY = parseInt(element.style.top) || 0;

      this.getBlob = this.generateBlob.bind(this, 0.9, elementX, elementY);
    };

    requestAnimationFrame(() => {
      updateCoords();
    });

    on(element, "mousedown", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      isMouseDown = true;
    });

    const cleanUp = on(document, "mouseup", () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      updateCoords();
    });

    this.unmount = () => {
      cleanUp();
    };

    on(element, "mousemove", (event) => {
      if (!isMouseDown) return;
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      const imageRect = this.imageElement.getBoundingClientRect();
      const rect = element.getBoundingClientRect();

      const newX = elementX + deltaX;
      const newY = elementY + deltaY;

      if (newX > 0 && newX < imageRect.width - rect.width) {
        element.style.left = newX + "px";
      }

      if (newY > 0 && newY < imageRect.height - rect.height) {
        element.style.top = newY + "px";
      }
    });
  }

  private generateBlob(ratio: number, sourceX: number, sourceY: number) {
    const canvas = document.createElement("canvas");
    const destSize = 800;

    canvas.width = destSize;
    canvas.height = destSize;

    const scale = this.image.width / this.imageElement.width;
    const srcSize = Math.floor(
      Math.min(this.image.width, this.image.height) * ratio
    );

    console.log({
      "this.image.width": this.image.width,
      "this.imageElement.width": this.imageElement.width,
      ratio,
      srcSize,
    });

    const context = canvas.getContext("2d");
    context.drawImage(
      this.image,
      Math.floor(sourceX * scale),
      Math.floor(sourceY * scale),
      srcSize,
      srcSize,
      0,
      0,
      destSize,
      destSize
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  }
}
