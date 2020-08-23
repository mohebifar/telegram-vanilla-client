import {
  DocumentAttributeVideo,
  MessageMediaDocument,
} from "../core/tl/TLObjects";

export function canStream(document: MessageMediaDocument["document"]) {
  if (document.$t !== "Document") {
    return false;
  }
  const videoAttribute = document.attributes.find(
    ({ $t }) => $t === "DocumentAttributeVideo"
  ) as DocumentAttributeVideo;
  return videoAttribute && videoAttribute.supportsStreaming;
}
