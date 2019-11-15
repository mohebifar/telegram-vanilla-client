import "./styles.global.scss";
import { createElement } from "./utils/dom";
// import Input from "./components/ui/input";
// import Button from "./components/ui/button";
// import AuthPhone from "./components/auth/auth-phone";
import AuthPassword from "./components/auth/auth-password";
import { TelegramClient } from "./core/TelegramClient";
import store from "./utils/store";
import Root from "./components/chat/root";

function setupSignInForm() {
  const element = createElement(AuthPassword);
  document.body.append(element);
}

async function start() {
  const apiId = 20059;
  const apiHash = "da25899cf2aa93c0b2b7d592920313f8";
  console.time("Telegram Connect");
  const tg = new TelegramClient(apiId, apiHash);
  await tg.connect();
  console.timeEnd("Telegram Connect");

  // @ts-ignore
  window.tgc = tg;
  // @ts-ignore
  window.store = store;

  const isAuthorized = await tg.isUserAuthorized();

  if (isAuthorized) {
    setupRoot(tg);
  } else {
    setupSignInForm();
  }
}

start();

// function setupPasswordForm() {
//   const logo = createElement("img", {
//     src: "/assets/logo.svg",
//     alt: "Telegram"
//   });
//   const h1 = createElement("h1", "Enter a Password");
//   const h4 = createElement(
//     "h4",
//     createElement(
//       "span",
//       "Your account is protected with",
//       createElement("br"),
//       "an additional password"
//     )
//   );
//   const signInForm = document.getElementById("sign-in-form");
//   const passwordInput = createElement(Input, {
//     placeholder: "Password",
//     type: "password"
//   });
//   const btn = createElement(Button, {
//     caption: "NEXT"
//   });
//   signInForm.append(logo, h1, h4, passwordInput, btn);
// }

// function setupSetupAccountForm() {
//   const logo = createElement("img", {
//     src: "/assets/logo.svg",
//     alt: "Telegram"
//   });
//   const h1 = createElement("h1", "Your name");
//   const h4 = createElement(
//     "h4",
//     createElement(
//       "span",
//       "Enter your name and add",
//       createElement("br"),
//       "a profile picture"
//     )
//   );
//   const signInForm = document.getElementById("sign-in-form");
//   const nameInput = createElement(Input, {
//     placeholder: "Name",
//     type: "text"
//   });
//   const lastNameInput = createElement(Input, {
//     placeholder: "Last Name (optional)",
//     type: "text"
//   });
//   const btn = createElement(Button, {
//     caption: "START MESSAGING"
//   });
//   signInForm.append(logo, h1, h4, nameInput, lastNameInput, btn);
// }

function setupRoot(client: TelegramClient) {
  const element = createElement(Root, { client });
  document.body.append(element);
}

// setupRoot();
// setupPasswordForm();
// setupSetupAccountForm();
