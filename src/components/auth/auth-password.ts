import {
  createElement,
  Component,
  Element,
  removeChildren
} from "../../utils/dom";
import Input from "../ui/input";
import Button from "../ui/button";
import MonkeyPassword from "../monkey/monkey-password";
import Icon, { Icons } from "../ui/icon";
import { debounce } from "../../utils/utils";

interface Options {
  callback: (password: string) => any;
}

export default class AuthPassword implements Component<Options> {
  public element: HTMLElement;
  private btn: Element<Button>;
  private monkey: Element<MonkeyPassword>;
  private passwordInput: Element<Input>;
  private peekButton: Element<unknown>;
  private callback: Options["callback"];
  private isPeeking = false;

  constructor({ callback }: Options) {
    this.callback = callback;
    const h1 = createElement("h1", "Enter a Password");
    const h4 = createElement(
      "h4",
      "Your account is protected with",
      createElement("br"),
      "an additional password"
    );
    this.passwordInput = createElement(Input, {
      placeholder: "Password",
      type: "password",
      autocomplete: "off",
      onFocus: () => {
        this.monkey.instance.setIsPeeking(this.isPeeking);
      },
      onBlur: debounce(() => {
        if (this.passwordInput.instance.isActive()) {
          return;
        }

        this.monkey.instance.blur();
      })
    });

    this.peekButton = createElement("button", { type: "button" });
    this.peekButton.addEventListener("click", () => {
      const instance = this.passwordInput.instance;
      this.isPeeking = !this.isPeeking;
      this.renderPeekButton();
      instance.setType(this.isPeeking ? "text" : "password");
      instance.focus();

      if (!this.passwordInput.instance.isActive()) {
        this.monkey.instance.setIsPeeking(this.isPeeking);
      }
    });

    this.passwordInput.instance.setSuffix(this.peekButton);
    this.renderPeekButton();

    this.monkey = createElement(MonkeyPassword);

    this.btn = createElement(Button, {
      caption: "NEXT"
    });
    const signInForm = createElement(
      "form",
      undefined,
      this.monkey,
      h1,
      h4,
      this.passwordInput,
      this.btn
    );

    signInForm.addEventListener("submit", event => {
      event.preventDefault();
      this.handleSubmit();
    });

    this.element = createElement("div", { class: "sign-in" }, signInForm);
  }

  renderPeekButton() {
    removeChildren(this.peekButton);
    const icon = this.isPeeking ? Icons.Eye2 : Icons.Eye1;

    this.peekButton.append(createElement(Icon, { icon, color: "grey" }));
  }

  private handleSubmit = async () => {
    const value = this.passwordInput.instance.value;
    if (!value) {
      return this.passwordInput.instance.setError();
    }

    const btn = this.btn.instance;
    btn.showSpinner();
    btn.disable();

    this.monkey.instance.blur();

    try {
      await this.callback(value);
    } catch (error) {
      this.passwordInput.instance.setError(true);
    } finally {
      btn.hideSpinner();
      btn.enable();
    }
  };
}
