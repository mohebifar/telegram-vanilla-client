import "./styles.global.scss";
import { createElement } from "./utils/dom";
import { TelegramClient } from "./core/TelegramClient";
import store from "./utils/store";
import Root from "./components/chat/root";
import AuthRoot from "./components/auth/auth-root";
import { Authorization } from "./core/tl/TLObjects";

async function start() {
  const apiId = process.env.API_ID;
  const apiHash = process.env.API_HASH;
  console.time("Telegram Connect");
  const tg = new TelegramClient(apiId, apiHash);
  await tg.connect();
  console.timeEnd("Telegram Connect");

  // @ts-ignore
  window.tgc = tg;
  // @ts-ignore
  window.store = store;

  const isAuthorized = await tg.isUserAuthorized();
  document.getElementById("initial-loading").remove();

  if (isAuthorized) {
    setupRoot(tg);
  } else {
    setupSignInForm(tg);
  }
}

function setupRoot(client: TelegramClient) {
  const element = createElement(Root, { client });
  document.body.append(element);
}

function setupSignInForm(client: TelegramClient) {
  const element = createElement(AuthRoot, {
    client,
    finishCallback: (_authorization: Authorization) => {
      // TODO: idk why this crashes. It's not needed atm
      // store.me = authorization;
      setupRoot(client);
    }
  });
  document.body.append(element);
}

start();
