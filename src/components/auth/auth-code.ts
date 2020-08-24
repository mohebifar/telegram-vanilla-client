import { createElement, Component, Element, on } from "../../utils/dom";
import Input from "../ui/input";
import Button from "../ui/button";
import { formatPhoneNumber } from "../../utils/utils";
import { makeModal } from "../ui/modal";
import MonkeyTrakcing from "../monkey/monkey-tracking";

interface Options {
  phoneNumber: string;
  countryCode: string;
  callback: (code: string) => void;
}

export default class AuthCode implements Component<Options> {
  public element: HTMLElement;
  private btn: Element<Button>;
  private monkey: Element<MonkeyTrakcing>;
  private codeInput: Element<Input>;
  private callback: Options["callback"];

  constructor({ phoneNumber, countryCode, callback }: Options) {
    this.callback = callback;

    const formattedPhoneNumber = `${countryCode} ${formatPhoneNumber(
      phoneNumber
    )}`;
    const h1 = createElement("h1", formattedPhoneNumber);
    const h4 = createElement(
      "h4",
      "We have sent you an SMS",
      createElement("br"),
      "with the code."
    );
    this.codeInput = createElement(Input, {
      placeholder: "Code",
      type: "text",
      autocomplete: "off",
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
    this.monkey = createElement(MonkeyTrakcing);

    this.btn = createElement(Button, {
      caption: "NEXT"
    });
    const signInForm = createElement(
      "form",
      undefined,
      this.monkey,
      h1,
      h4,
      this.codeInput,
      this.btn
    );

    on(signInForm, "submit", event => {
      event.preventDefault();
      this.handleSubmit();
    });

    this.element = createElement("div", { class: "sign-in" }, signInForm);

    setTimeout(() => {
      requestAnimationFrame(() => {
        this.codeInput.instance.focus();
      });
    }, 300);
  }

  private handleSubmit = async () => {
    const { instance: btn } = this.btn;
    const value = this.codeInput.instance.value.trim();
    if (!value) {
      this.codeInput.instance.setError(true);
      return;
    }

    btn.showSpinner();
    btn.disable();
    this.monkey.instance.blur();

    try {
      await this.callback(value);
    } catch (error) {
      if (error.message === "PHONE_CODE_INVALID") {
        this.codeInput.instance.setError(true);
      } else {
        makeModal("An error occured", error.message);
      }
    } finally {
      btn.hideSpinner();
      btn.enable();
    }
  };
}
