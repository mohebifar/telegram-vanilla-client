import AuthRoot from "./components/auth/auth-root";
import Root from "./components/chat/root";
import { Authorization } from "./core/tl/TLObjects";
import { Model } from "./models/model";
import "./styles.global.scss";
import { makeProxy, TelegramClientProxy } from "./telegram-worker-proxy";
import { handleUpdate } from "./update-handler";
import { createElement } from "./utils/dom";
import { startRipple } from "./utils/ripple";
import { prepareEmojiMap } from "./utils/emojis";

async function start() {
  await prepareEmojiMap();

  const [tgProxy, deferred, connectionPromise] = await makeProxy(
    TG_API_ID,
    TG_API_HASH,
    handleUpdate
  );

  let isUserAuthorized = false;
  if (!deferred) {
    await connectionPromise;
    isUserAuthorized = await tgProxy.isUserAuthorized();
  }
  document.getElementById("initial-loading").remove();

  // @ts-ignore
  window.tgProxy = tgProxy;
  Model.tg = tgProxy;

  if (isUserAuthorized) {
    setupRoot();
  } else {
    setupSignInForm(tgProxy, connectionPromise);
  }
}

function setupRoot() {
  const element = createElement(Root);
  startRipple();
  document.body.append(element);
}

function setupSignInForm(
  tgProxy: TelegramClientProxy,
  connectionPromise: Promise<void>
) {
  const element = createElement(AuthRoot, {
    tgProxy,
    connectionPromise,
    finishCallback: (_authorization: Authorization) => {
      setupRoot();
    },
  });
  document.body.append(element);
}

try {
  start();
} catch (err) {
  console.error(err);
}
