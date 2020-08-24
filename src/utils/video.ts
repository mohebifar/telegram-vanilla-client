import {
  DocumentAttributeVideo,
  MessageMediaDocument,
} from "../core/tl/TLObjects";

const capability = "serviceWorker" in navigator;

const checkSupport = (() => {
  let supports: boolean;

  return async () => {
    if (supports) {
      return supports;
    }

    return fetch("/check/support")
      .then(() => supports = true)
      .catch(() => supports = false);
  };
})();

export async function canStream(document: MessageMediaDocument["document"]) {
  if (!capability || document.$t !== "Document" || !(await checkSupport())) {
    return false;
  }
  const videoAttribute = document.attributes.find(
    ({ $t }) => $t === "DocumentAttributeVideo"
  ) as DocumentAttributeVideo;
  return videoAttribute && videoAttribute.supportsStreaming;
}
