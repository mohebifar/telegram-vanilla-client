import { createElement, Component, Element } from "../../utils/dom";
import AuthPhone from "./auth-phone";
import AuthPassword from "./auth-password";
import AuthCode from "./auth-code";
import AuthSignUp from "./auth-signup";
import { Authorization, help_TermsOfService } from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";

interface Options {
  tgProxy: TelegramClientProxy;
  connectionPromise: Promise<void>;
  finishCallback(auth: Authorization): any;
}

export default class AuthRoot implements Component<Options> {
  public element: HTMLElement;
  private authPhone: Element<AuthPhone>;
  private authPassword: Element<AuthPassword>;
  private authCode: Element<AuthCode>;
  private authSignUp: Element<AuthSignUp>;
  private tgProxy: TelegramClientProxy;
  private connectionPromise: Options["connectionPromise"];
  private finishCallback: Options["finishCallback"];
  private termsOfService: help_TermsOfService;

  constructor({ tgProxy, finishCallback, connectionPromise }) {
    this.finishCallback = finishCallback;
    this.connectionPromise = connectionPromise;
    this.tgProxy = tgProxy;
    this.element = createElement("div");

    this.authPhone = createElement(AuthPhone, {
      callback: this.handleSendCode,
    });

    this.element.append(this.authPhone);
  }

  private handleSendCode = async (countryCode: string, phoneNumber: string) => {
    await this.connectionPromise;
    await this.tgProxy.sendCodeRequest(countryCode + phoneNumber);

    this.authCode = createElement(AuthCode, {
      callback: this.handleSignInWithCode,
      phoneNumber: phoneNumber,
      countryCode: countryCode,
    });
    this.authPhone.remove();

    this.element.append(this.authCode);
  };

  private handleSignInWithCode = async (code: string) => {
    let authorization: Authorization;
    try {
      const result = await this.tgProxy.signInWithCode(code);
      if (result.$t === "auth_AuthorizationSignUpRequired") {
        this.termsOfService = result.termsOfService;
        return this.showSignUpForm();
      }

      authorization = result;
    } catch (error) {
      if (
        error.message === "PHONE_PASSWORD_PROTECTED" ||
        error.message === "SESSION_PASSWORD_NEEDED"
      ) {
        this.authPassword = createElement(AuthPassword, {
          callback: this.handleSignInWithPassword,
        });

        this.authCode.remove();
        this.element.append(this.authPassword);
        return;
      } else if (error.message === "PHONE_NUMBER_UNOCCUPIED") {
        this.showSignUpForm();
        return;
      }

      throw error;
    }

    this.handleAuthFinish(authorization);
  };

  private showSignUpForm() {
    this.authSignUp = createElement(AuthSignUp, {
      callback: this.handleSignUp,
    });

    this.authCode.remove();
    this.element.append(this.authSignUp);
  }

  private handleSignInWithPassword = async (password: string) => {
    const authorization = await this.tgProxy.signInWithPassword(password);
    this.handleAuthFinish(authorization);
  };

  private handleSignUp = async (
    firstName: string,
    lastName?: string,
    profilePhoto?: ArrayBuffer
  ) => {
    const authorization = await this.tgProxy.signUp(firstName, lastName || "");
    if (this.termsOfService) {
      await this.tgProxy.invoke({
        $t: "help_AcceptTermsOfServiceRequest",
        id: this.termsOfService.id,
      });
    }
    if (profilePhoto) {
      const file = await this.tgProxy.fileStorage.upload(profilePhoto);
      await this.tgProxy.invoke({
        $t: "photos_UploadProfilePhotoRequest",
        file,
      });
    }
    this.handleAuthFinish(authorization);
  };

  private handleAuthFinish(authorization: Authorization) {
    this.element.remove();
    this.finishCallback(authorization);
  }
}
