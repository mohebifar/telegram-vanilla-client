import { createElement, Component, Element } from "../../utils/dom";
import { makeModal } from "../ui/modal";
import Input from "../ui/input";
import Button from "../ui/button";
import Icon, { Icons } from "../ui/icon";

interface Options {
  callback: (firstName: string, lastName: string) => void;
}

export default class AuthSignUp implements Component<Options> {
  public element: HTMLElement;
  private btn: Element<Button>;
  private firstNameInput: Element<Input>;
  private lastNameInput: Element<Input>;
  private callback: Options["callback"];
  private profilePhotoPicker: HTMLElement;

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
      autocomplete: "given-name"
    });
    this.lastNameInput = createElement(Input, {
      placeholder: "Last Name (optional)",
      type: "text",
      autocomplete: "family-name"
    });
    this.profilePhotoPicker = createElement(
      "div",
      {
        class: "profile-photo-picker"
      },
      createElement(Icon, {
        icon: Icons.CameraAdd,
        color: "white"
      })
    );

    this.btn = createElement(Button, {
      caption: "START MESSAGING"
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

    signUpForm.addEventListener("submit", event => {
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
      await this.callback(firstName, lastName);
    } catch (error) {
      makeModal("An error occured", error.message);
    } finally {
      btn.hideSpinner();
      btn.enable();
    }
  };
}
