import { createElement, Component, Element, on } from "../../utils/dom";
import { makeModal } from "../ui/modal";
import Input from "../ui/input";
import Button from "../ui/button";
import Icon, { Icons } from "../ui/icon";
import ProfileCrop from "../ui/profile-crop";
import IconButton from "../ui/icon-button";
import { sleep } from "../../utils/utils";
import { makeFileDialog, readImage, readFile } from "../../utils/upload-file";

interface Options {
  callback: (
    firstName: string,
    lastName?: string,
    profileFile?: ArrayBuffer
  ) => Promise<any>;
}

export default class AuthSignUp implements Component<Options> {
  public element: HTMLElement;
  private btn: Element<Button>;
  private firstNameInput: Element<Input>;
  private lastNameInput: Element<Input>;
  private callback: Options["callback"];
  private profilePhotoPicker: HTMLElement;
  private profileFile: ArrayBuffer;

  private cropProfile(image: HTMLImageElement) {
    const cropper = createElement(ProfileCrop, {
      image,
    });

    const modal = makeModal(
      "Drag to Reposition",
      createElement(
        "div",
        {},
        cropper,
        createElement(IconButton, {
          icon: Icons.Check,
          color: "white",
          variant: "primary",
          style: {
            float: "right",
          },
          onClick: async () => {
            modal.close();
            const blob = await cropper.instance.getBlob();
            this.profilePhotoPicker.style.backgroundImage = `url(${URL.createObjectURL(
              blob
            )})`;
            this.profilePhotoPicker.classList.add("selected");
            this.profileFile = await blob.arrayBuffer();
            await sleep(300);
            cropper.instance.unmount();
          },
        })
      )
    );
  }
  constructor({ callback }: Options) {
    this.callback = callback;

    const h1 = createElement("h1", "Your Name");
    const h4 = createElement(
      "h4",
      "Enter your name and",
      createElement("br"),
      "add a profile picture"
    );
    this.firstNameInput = createElement(Input, {
      placeholder: "Name",
      type: "text",
      autocomplete: "given-name",
    });
    this.lastNameInput = createElement(Input, {
      placeholder: "Last Name (optional)",
      type: "text",
      autocomplete: "family-name",
    });
    this.profilePhotoPicker = createElement(
      "label",
      {
        for: makeFileDialog("image/*", false, (file) => {
          readFile(file)
            .then((buffer) => readImage(buffer))
            .then((image) => {
              this.cropProfile(image);
            });
        }),
        class: "profile-photo-picker",
      },
      createElement(Icon, {
        icon: Icons.CameraAdd,
        color: "white",
      })
    );

    on(this.profilePhotoPicker, "click", () => {
      console.log("asdasdkasd");
    });

    this.btn = createElement(Button, {
      caption: "START MESSAGING",
    });
    const signUpForm = createElement(
      "form",
      this.profilePhotoPicker,
      h1,
      h4,
      this.firstNameInput,
      this.lastNameInput,
      this.btn
    );

    on(signUpForm, "submit", (event) => {
      event.preventDefault();
      this.handleSubmit();
    });

    this.element = createElement("div", { class: "sign-in" }, signUpForm);
  }

  private handleSubmit = async () => {
    const { instance: btn } = this.btn;
    const firstName = this.firstNameInput.instance.value.trim();
    if (!firstName) {
      this.firstNameInput.instance.setError(true);
      return;
    }
    const lastName = this.lastNameInput.instance.value.trim();

    btn.showSpinner();
    btn.disable();

    try {
      await this.callback(firstName, lastName, this.profileFile);
    } catch (error) {
      makeModal("An error occured", error.message);
    } finally {
      btn.hideSpinner();
      btn.enable();
    }
  };
}
