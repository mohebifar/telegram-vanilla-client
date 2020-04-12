import { createElement, Component, Element } from "../../utils/dom";
import AuthPhone from "./auth-phone";
import AuthPassword from "./auth-password";
import AuthCode from "./auth-code";
import AuthSignUp from "./auth-signup";
import { Authorization } from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";

interface Options {
  tgProxy: TelegramClientProxy;
  connectionPromise: Promise<void>;
  finishCallback(auth: Authorization): any;
}

export default class AuthRoot implements Component<Options> {
  public element: HTMLElement;
  private authPhone?: Element<AuthPhone>;
  private authPassword: Element<AuthPassword>;
  private authCode: Element<AuthCode>;
  private authSignUp: Element<AuthSignUp>;
  private tgProxy: TelegramClientProxy;
  private connectionPromise: Options["connectionPromise"];
  private finishCallback: Options["finishCallback"];

  constructor({ tgProxy, finishCallback, connectionPromise }) {
    this.finishCallback = finishCallback;
    this.connectionPromise = connectionPromise;
    this.tgProxy = tgProxy;
    this.element = createElement("div");

    this.authPhone = createElement(AuthPhone, {
      callback: this.handleSendCode
    });

    this.element.append(this.authPhone);
  }

  private handleSendCode = async (countryCode: string, phoneNumber: string) => {
    await this.connectionPromise;
    await this.tgProxy.sendCodeRequest(countryCode + phoneNumber);

    this.authCode = createElement(AuthCode, {
      callback: this.handleSignInWithCode,
      phoneNumber: phoneNumber,
      countryCode: countryCode
    });
    this.authPhone.remove();

    this.element.append(this.authCode);
  };

  private handleSignInWithCode = async (code: string) => {
    let authorization: Authorization;
    try {
      authorization = await this.tgProxy.signInWithCode(code);
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

    this.handleAuthFinish(authorization);
  };

  private handleSignInWithPassword = async (password: string) => {
    const authorization = await this.tgProxy.signInWithPassword(password);
    this.handleAuthFinish(authorization);
  };

  private handleSignUp = async (firstName: string, lastName: string) => {
    const authorization = await this.tgProxy.signUp(firstName, lastName);
    this.handleAuthFinish(authorization);
  };

  private handleAuthFinish(authorization: Authorization) {
    this.element.remove();
    this.finishCallback(authorization);
  }
}
