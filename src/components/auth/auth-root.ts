import { createElement, Component, Element } from "../../utils/dom";
import AuthPhone from "./auth-phone";
import AuthPassword from "./auth-password";
import AuthCode from "./auth-code";
import { TelegramClient } from "../../core/TelegramClient";
import AuthSignUp from "./auth-signup";

interface Options {
  client: TelegramClient;
  finishCallback: Function;
}

export default class AuthRoot implements Component<Options> {
  public element: HTMLElement;
  private authPhone?: Element<AuthPhone>;
  private authPassword: Element<AuthPassword>;
  private authCode: Element<AuthCode>;
  private authSignUp: Element<AuthSignUp>;
  private client: TelegramClient;
  private finishCallback: Options["finishCallback"];

  constructor({ client, finishCallback }) {
    this.finishCallback = finishCallback;
    this.client = client;
    this.element = createElement("div");

    this.authPhone = createElement(AuthPhone, {
      callback: this.handleSendCode
    });

    this.element.append(this.authPhone);
  }

  private handleSendCode = async (countryCode: string, phoneNumber: string) => {
    await this.client.sendCodeRequest(countryCode + phoneNumber);

    this.authCode = createElement(AuthCode, {
      callback: this.handleSignInWithCode,
      phoneNumber: phoneNumber,
      countryCode: countryCode
    });
    this.authPhone.remove();

    this.element.append(this.authCode);
  };

  private handleSignInWithCode = async (code: string) => {
    try {
      await this.client.signInWithCode(code);
    } catch (error) {
      if (
        error.message === "PHONE_PASSWORD_PROTECTED" ||
        error.message === "SESSION_PASSWORD_NEEDED"
      ) {
        this.authPassword = createElement(AuthPassword, {
          callback: this.handleSignInWithPassword
        });

        this.authCode.remove();
        this.element.append(this.authPassword);
        return;
      } else if (error.message === "PHONE_NUMBER_UNOCCUPIED") {
        this.authSignUp = createElement(AuthSignUp, {
          callback: this.handleSignUp
        });

        this.authCode.remove();
        this.element.append(this.authSignUp);
        return;
      }

      throw error;
    }

    this.handleAuthFinish();
  };

  private handleSignInWithPassword = async (password: string) => {
    await this.client.signInWithPassword(password);
    this.handleAuthFinish();
  };

  private handleSignUp = async (firstName: string, lastName: string) => {
    await this.client.signUp(firstName, lastName);
    this.handleAuthFinish();
  };

  private handleAuthFinish() {
    this.element.remove();
    this.finishCallback();
  }
}
