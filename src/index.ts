import "./styles.global.scss";
import { createElement } from "./utils/dom";
import Root from "./components/chat/root";
import AuthRoot from "./components/auth/auth-root";
import { Authorization } from "./core/tl/TLObjects";
import { makeProxy } from "./telegram-worker-proxy";
import { Model } from "./models/model";

async function start() {
  const apiId = process.env.API_ID;
  const apiHash = process.env.API_HASH;
  const tgProxy = await makeProxy(apiId, apiHash, update => {
    console.debug("incoming update", update);
  });
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
