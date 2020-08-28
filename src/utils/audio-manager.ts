import mitt, { Emitter } from "mitt";
import { IMessage } from "../models/message";
import { ISharedMedia } from "../models/shared-media";
import { TransientMedia } from "./useful-types";
import {
  InputMediaUploadedDocument,
  DocumentAttributeAudio,
  MessageMediaDocument,
  Document,
  Message,
} from "../core/tl/TLObjects";

interface SrcEvent {
  message: Message;
  title?: string;
  subtitle?: string;
  removed?: boolean;
}

class AudioManager {
  public audio: HTMLAudioElement;
  public events: Emitter;
  public message: IMessage | ISharedMedia;

  constructor() {
    this.audio = new Audio();
    this.events = mitt();
  }

  get src() {
    return this.audio.src;
  }

  set src(newSource: string) {
    this.audio.src = newSource;
  }

  public async setSrc(message?: IMessage | ISharedMedia, newSource?: string) {
    this.message = message;
    this.src = newSource;

    if (!message) {
      return this.events.emit("src", {
        message,
        removed: true
      } as SrcEvent);
    }

    if (message.$t === "Message") {
      const media = message.media as MessageMediaDocument | TransientMedia;
      const audioAttribute = (media.$t === "TransientMedia"
        ? (media.inputMedia as InputMediaUploadedDocument)
        : (media.document as Document)
      ).attributes.find(
        (t) => t.$t === "DocumentAttributeAudio"
      ) as DocumentAttributeAudio;

      const title =// audioAttribute.voice ?
       (await message.getSender()).displayName
        //: audioAttribute.title;
      const subtitle = audioAttribute.voice ? "Voice message" : '';

      this.events.emit("src", {
        message,
        title,
        subtitle,
      } as SrcEvent);
    }
  }
}

const audioManager = new AudioManager();

export default audioManager;
