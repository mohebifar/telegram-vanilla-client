import "./styles.global.scss";
import { createElement } from "./utils/dom";
// import Input from "./components/ui/input";
// import Button from "./components/ui/button";
// import Sidebar from "./components/side-bar";
import AuthPhone from "./components/auth/auth-phone";

function setupSignInForm() {
  const element = createElement(AuthPhone);
  document.body.append(element);
}

// function setupPasswordForm() {
//   const logo = createElement("img", {
//     src: "/assets/logo.svg",
//     alt: "Telegram"
//   });
//   const h1 = createElement("h1", undefined, "Enter a Password");
//   const h4 = createElement(
//     "h4",
//     undefined,
//     createElement(
//       "span",
//       undefined,
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
//   const h1 = createElement("h1", undefined, "Your name");
//   const h4 = createElement(
//     "h4",
//     undefined,
//     createElement(
//       "span",
//       undefined,
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

// function setupSideBar() {
//   const element = createElement(Sidebar);
//   document.body.append(element);
// }

// setupSideBar();
setupSignInForm();
// setupPasswordForm();
// setupSetupAccountForm();
