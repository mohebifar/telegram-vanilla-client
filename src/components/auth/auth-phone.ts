import { createElement, Component, Element } from "../../utils/dom";
import Input from "../ui/input";
import Button from "../ui/button";

interface Options {}

export default class AuthPhone implements Component<Options> {
  public element: HTMLElement;
  private btn: Element<Button>;

  constructor() {
    const logo = createElement("img", {
      src: "/assets/logo.svg",
      alt: "Telegram"
    });
    const h1 = createElement("h1", undefined, "Sign in to Telegram");
    const h4 = createElement(
      "h4",
      undefined,
      createElement(
        "span",
        undefined,
        "Please confirm your country and",
        createElement("br"),
        "enter your phone number"
      )
    );
    const countryInput = createElement(Input, { placeholder: "Country" });
    const phoneNumberInput = createElement(Input, {
      placeholder: "Phone number",
      type: "tel"
    });

    this.btn = createElement(Button, {
      caption: "NEXT"
    });
    const signInForm = createElement(
      "form",
      undefined,
      logo,
      h1,
      h4,
      countryInput,
      phoneNumberInput,
      this.btn
    );

    signInForm.addEventListener("submit", event => {
      event.preventDefault();
      this.handleSubmit();
    });

    this.element = createElement("div", { class: "sign-in" }, signInForm);
  }

  private handleSubmit = () => {
    const btn = this.btn.instance;
    btn.showSpinner();
    btn.disable();
  };
}
