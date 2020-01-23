import "./styles.global.scss";
import { createElement } from "./utils/dom";
import Root from "./components/chat/root";
import AuthRoot from "./components/auth/auth-root";
import { Authorization } from "./core/tl/TLObjects";
import { makeProxy } from "./telegram-worker-proxy";

async function start() {
  const apiId = process.env.API_ID;
  const apiHash = process.env.API_HASH;
  const tgProxy = await makeProxy(apiId, apiHash, update => {
    console.log(update, "update");
  });
  const isUserAuthorized = await tgProxy.isUserAuthorized();

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