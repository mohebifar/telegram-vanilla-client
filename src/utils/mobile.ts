import { MEDIA_XS } from "./constants";

export function isMobile() {
  return window.innerWidth < MEDIA_XS;
}
