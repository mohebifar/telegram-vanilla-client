import AuthRoot from "./components/auth/auth-root";
import Root from "./components/chat/root";
import { Authorization } from "./core/tl/TLObjects";
import { Model } from "./models/model";
import "./styles.global.scss";
import { makeProxy } from "./telegram-worker-proxy";
import { handleUpdate } from "./update-handler";
import { createElement } from "./utils/dom";
import { startRipple } from "./utils/ripple";

async function start() {
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
    setupRoot(tgProxy);
  } else {
    setupSignInForm(tgProxy, connectionPromise);
  }
}

function setupRoot(tgProxy: any) {
  const element = createElement(Root, { tgProxy });
  startRipple();
  document.body.append(element);
}

function setupSignInForm(tgProxy: any, connectionPromise: Promise<void>) {
  const element = createElement(AuthRoot, {
    tgProxy,
    connectionPromise,
    finishCallback: (_authorization: Authorization) => {
      // TODO: idk why this crashes. It's not needed atm
      // store.me = authorization;
      setupRoot(tgProxy);
    }
  });
  document.body.append(element);
}

try {
  start();
} catch(err) {
  console.error(err);
}
