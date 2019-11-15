import { createElement, Component, Element } from "../../utils/dom";
import Input from "../ui/input";
import Button from "../ui/button";
import Monkey from "../monkey/monkey";

interface Options {}

export default class AuthPassword implements Component<Options> {
  public element: HTMLElement;
  private btn: Element<Button>;
  private monkey: Element<Monkey>;

  constructor() {
    const h1 = createElement("h1", "Enter a Password");
    const h4 = createElement(
      "h4",
      "Your account is protected with",
      createElement("br"),
      "an additional password"
    );
    const passwordInput = createElement(Input, {
      placeholder: "Password",
      type: "password",
      onFocus: event => {
        this.monkey.instance.focus(Math.min(event.target.value.length / 50, 1));
      },
      onInput: event => {
        this.monkey.instance.focus(Math.min(event.target.value.length / 50, 1));
      },
      onBlur: () => {
        this.monkey.instance.blur();
      }
    });
    this.monkey = createElement(Monkey);

    this.btn = createElement(Button, {
      caption: "NEXT"
    });
    const signInForm = createElement(
      "form",
      undefined,
      this.monkey,
      h1,
      h4,
      passwordInput,
      this.btn
    );

    signInForm.addEventListener("submit", event => {
      event.preventDefault();
      this.handleSubmit();
    });

    this.element = createElement("div", { class: "sign-in" }, signInForm);
  }

  private handleSubmit = () => {
    console.log(this.btn);
    const { instance: btn } = this.btn;
    btn.showSpinner();
    btn.disable();
    this.monkey.instance.focus(25);
  };
}
