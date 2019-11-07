import "./styles.global.scss";
import { createElement } from "./utils/dom";
// import Input from "./components/ui/input";
// import Button from "./components/ui/button";
// import Sidebar from "./components/side-bar";
// import AuthPhone from "./components/auth/auth-phone";
import AuthPassword from "./components/auth/auth-password";
import { decryptIGE, encryptIGE } from "./core/crypto";

function setupSignInForm() {
  const element = createElement(AuthPassword);
  document.body.append(element);
}

// fetchAndInstantiateWasm('./program.wasm', {
//   env: {
//     consoleLog (offset, len) {
//       const strBuf = new Uint8Array(mem.buffer, offset, len);
//       console.log(new TextDecoder().decode(strBuf));
//     }
//   }
// })
// .then(m => {
//   mem = m.memory;
//   writeString("Hello Web Assembly", m.getInStrOffset());
//   m.toLowerCase();
// });

const key = [
  0x60,
  0x3d,
  0xeb,
  0x10,
  0x15,
  0xca,
  0x71,
  0xbe,
  0x2b,
  0x73,
  0xae,
  0xf0,
  0x85,
  0x7d,
  0x77,
  0x81,
  0x1f,
  0x35,
  0x2c,
  0x07,
  0x3b,
  0x61,
  0x08,
  0xd7,
  0x2d,
  0x98,
  0x10,
  0xa3,
  0x09,
  0x14,
  0xdf,
  0xf4
];

const iv = [...key, ...key];

const text = new Uint8Array([
  1,
  2,
  3,
  4,
  1,
  2,
  3,
  4,
  1,
  2,
  3,
  4
  // 1,2,3,4,
]);

async function mamad() {
  console.time();
  const e = await encryptIGE(text, key, iv);
  console.log("e", e);
  const d = await decryptIGE(e, key, iv);
  console.log("d", d);
  console.timeEnd();
}

const socket = new WebSocket("ws://vesta.web.telegram.org/apiws", "binary");

// Connection opened
socket.addEventListener("open", function(event) {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", function(event) {
  console.log("Message from server ", event.data);
});
mamad();

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
