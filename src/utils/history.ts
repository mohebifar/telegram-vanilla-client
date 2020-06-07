import { IDialog } from "../models/dialog";

interface RouteInfo {
  dialog: string | null;
  rsb?: boolean;
}

interface RouteInfoInput {
  dialog: IDialog | null;
  rsb: boolean | null;
}

interface RegisterRouterOptions {
  onChange(routeInfo: Partial<RouteInfoInput>): any;
}

const defaultValue: RouteInfo = {
  dialog: null,
};

const dialogs = new Map<string, IDialog>();

export function setRouteInfo(routeInfo: Partial<RouteInfoInput>) {
  const newState = getState(document.URL);

  if (routeInfo.dialog === null && newState.dialog) {
    window.history.back();
    return;
  } else if (routeInfo.dialog) {
    const peerId = routeInfo.dialog.peerId;
    const peerType = routeInfo.dialog.peerType;
    const dialogId = peerType + peerId;
    dialogs.set(dialogId, routeInfo.dialog);
    newState.dialog = dialogId;
  }

  if (routeInfo.rsb !== newState.rsb) {
    newState.rsb = routeInfo.rsb;
  }

  history.pushState(
    null,
    null,
    document.location.pathname + "#" + JSON.stringify(newState)
  );
}

export function registerRouter({ onChange }: RegisterRouterOptions) {
  window.addEventListener("hashchange", (event) => {
    const oldState = getState(event.oldURL);
    const newState = getState(event.newURL);

    if (oldState.dialog !== newState.dialog) {
      const dialog: IDialog | null = dialogs.get(newState.dialog) || null;
      onChange({ dialog });
      return;
    }

    if (oldState.rsb !== newState.rsb) {
      onChange({ rsb: newState.rsb });
    }
  });
}

function getState(url: string) {
  let state = { ...defaultValue };
  try {
    const hash = decodeURIComponent(url.substr(url.indexOf("#") + 1));
    state = JSON.parse(hash);
  } catch {}

  return state;
}
