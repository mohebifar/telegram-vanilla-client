import { createElement, Component, Element } from "../../utils/dom";
import * as styles from "./country-picker.scss";
import Input from "./input";
import countries from "../../data/countries.json";
import Icon, { Icons } from "./icon";

enum EventMap {
  onClick = "click",
  onBlur = "blur",
  onFocus = "focus",
  onChange = "change",
  onInput = "input"
}

type EventAttributes = keyof typeof EventMap;

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

type Country = typeof countries[number];

interface Options
  extends PartialRecord<EventAttributes, (this: HTMLElement, ev: any) => void> {
  placeholder: string;
  onChange?(country: Country): any;
}

export default class CountryPicker implements Component<Options> {
  public element: HTMLElement;
  private textInput: Element<Input>;
  private dropdown: HTMLElement;
  private countryElements: Element<unknown>[];
  private selected?: Country;
  private onChange?: Options["onChange"];

  constructor({ onChange, placeholder, ...rest }: Options) {
    this.onChange = onChange;
    this.dropdown = createElement("div", { class: styles.dropdown });
    this.textInput = createElement(
      Input,
      {
        placeholder,
        onInput: this.handleInputChange,
        onBlur: () => {
          setTimeout(() => {
            this.hideDropdown();
          }, 100);
        },
        onFocus: () => {
          this.dropdown.classList.add(styles.visible);

          this.textInput.instance.setSuffix(
            createElement(Icon, {
              color: "blue",
              icon: Icons.Up
            })
          );
        },
        ...rest
      },
      this.dropdown
    );

    this.element = createElement(
      "div",
      {
        class: styles.countryPickerWrapper
      },
      this.textInput
    );

    this.hideDropdown();
    this.buildOptions();
  }

  get value() {
    return this.selected;
  }

  setError(hasError = true) {
    this.textInput.instance.setError(hasError);
  }

  private buildOptions() {
    this.countryElements = countries
      .filter(country => country.e)
      .map(country => {
        const { e, n, d } = country;
        const emoji = createElement("div", e);
        const name = createElement("div", n);
        const dialCode = createElement("div", d);
        const item = createElement(
          "div",
          { class: styles.item },
          emoji,
          name,
          dialCode
        ) as HTMLDivElement;

        item.addEventListener("click", () => {
          this.select(country);
          this.dropdown.classList.remove(styles.visible);
        });

        this.dropdown.append(item);
        item.dataset.countryName = n;
        item.dataset.dialCode = d;

        return item;
      });
  }

  private select(country: Country) {
    this.value = country;

    if (this.onChange) {
      this.onChange(country);
    }
  }

  private hideDropdown = () => {
    this.dropdown.classList.remove(styles.visible);

    this.textInput.instance.setSuffix(
      createElement(Icon, {
        color: "black",
        icon: Icons.Down
      })
    );
  };

  private handleInputChange = () => {
    const value = this.textInput.instance.value;
    const searchRegex = new RegExp(`^${value.trim()}`, "i");

    this.countryElements.forEach(element => {
      if (searchRegex.test(element.dataset.countryName)) {
        element.classList.remove("hidden");
      } else {
        element.classList.add("hidden");
      }
    });
  };

  set value(country: Country) {
    this.textInput.instance.value = country ? country.n : "";
    this.selected = country;
    this.setError(false);
  }
}
