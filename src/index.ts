import AuthRoot from "./components/auth/auth-root";
import Root from "./components/chat/root";
import { Authorization } from "./core/tl/TLObjects";
import { Model } from "./models/model";
import "./styles.global.scss";
import { makeProxy } from "./telegram-worker-proxy";
import { handleUpdate } from "./update-handler";
import { createElement } from "./utils/dom";

async function start() {
  const tgProxy = await makeProxy(TG_API_ID, TG_API_HASH, handleUpdate);
  // @ts-ignore
  window.tgProxy = tgProxy;
  const isUserAuthorized = await tgProxy.isUserAuthorized();
  Model.tg = tgProxy;

  if (isUserAuthorized) {
    setupRoot(tgProxy);
  } else {
    setupSignInForm(tgProxy);
  }
}

function setupRoot(tgProxy: any) {
  const element = createElement(Root, { tgProxy });
  document.body.append(element);
}

function setupSignInForm(tgProxy: any) {
  const element = createElement(AuthRoot, {
    tgProxy,
    finishCallback: (_authorization: Authorization) => {
      // TODO: idk why this crashes. It's not needed atm
      // store.me = authorization;
      setupRoot(tgProxy);
    }
  });
  document.body.append(element);
}

start();
