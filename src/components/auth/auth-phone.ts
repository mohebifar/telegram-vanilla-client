import { createElement, Component, Element, on } from "../../utils/dom";
import Input from "../ui/input";
import Button from "../ui/button";
import CountryPicker from "../ui/country-picker";
import countries from "../../data/countries";
import { makeModal } from "../ui/modal";
import Checkbox from "../ui/checkbox";

interface Options {
  callback: (countryCode: string, phoneNumber: string) => any;
}

const countriesSortedByDialCode = [...countries].sort((a, b) =>
  a.d.length > b.d.length ? 1 : -1
);

type Country = typeof countries[number];

export default class AuthPhone implements Component<Options> {
  public element: HTMLElement;
  private btn: Element<Button>;
  private phoneNumberInput: Element<Input>;
  private countryInput: Element<CountryPicker>;
  private callback: Options["callback"];
  private countryCode: string;
  private phoneNumber: string;

  constructor({ callback }: Options) {
    this.callback = callback;

    const logo = createElement("img", {
      src: "/assets/logo.svg",
      alt: "Telegram",
    });
    const h1 = createElement("h1", "Sign in to Telegram");
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
    this.countryInput = createElement(CountryPicker, {
      placeholder: "Country",
      onChange: this.handleCountryCodeChange,
    });

    this.phoneNumberInput = createElement(Input, {
      placeholder: "Phone number",
      type: "tel",
      autocomplete: "off",
      onInput: this.handlePhoneNumberChange,
    });

    this.btn = createElement(Button, {
      caption: "NEXT",
    });

    const rememberMe = createElement(
      "label",
      {
        style: {
          display: "flex",
          alignItems: "center",
          textAlign: "left",
          marginBottom: "1em",
        },
      },
      createElement(Checkbox),
      createElement("div", { style: { marginLeft: "0.5em" } }, "Remember me")
    );

    const signInForm = createElement(
      "form",
      undefined,
      logo,
      h1,
      h4,
      this.countryInput,
      this.phoneNumberInput,
      rememberMe,
      this.btn
    );

    on(signInForm, "submit", (event) => {
      event.preventDefault();
      this.handleSubmit();
    });

    this.element = createElement("div", { class: "sign-in" }, signInForm);
  }

  private handleCountryCodeChange = (country: Country) => {
    this.countryCode = country.d;
    this.phoneNumber = "";

    if (this.countryCode) {
      this.phoneNumberInput.instance.value = country.d;
    }
  };

  private handlePhoneNumberChange = () => {
    const rawValue = this.phoneNumberInput.instance.value.replace(/^\+/, "");
    const value = "+" + rawValue;

    const countryDetermined = countriesSortedByDialCode.find(({ d }) =>
      value.startsWith(d)
    );

    this.countryCode = countryDetermined ? countryDetermined.d : undefined;
    this.phoneNumber = rawValue.replace(/[\s\-\(\)]/g, "");
    if (this.countryCode) {
      this.phoneNumber = rawValue
        .replace(/[\s\-\(\)]/g, "")
        .replace(new RegExp(`^\\+?${this.countryCode.replace("+", "")}`), "");
    }
    this.countryInput.instance.value = countryDetermined;
  };

  private handleSubmit = async () => {
    if (!this.countryCode) {
      return this.countryInput.instance.setError(true);
    }
    if (!this.phoneNumber) {
      return this.phoneNumberInput.instance.setError(true);
    }

    const btn = this.btn.instance;
    btn.showSpinner();
    btn.disable();

    try {
      await this.callback(this.countryCode, this.phoneNumber);
    } catch (error) {
      console.log(error);
      const message =
        (error && error.message) || "An unexpected error happened";
      makeModal("Error in phone number input", message);
    } finally {
      btn.hideSpinner();
      btn.enable();
    }
  };
}
