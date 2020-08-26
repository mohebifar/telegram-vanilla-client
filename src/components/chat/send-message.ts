import autosize from "autosize";
import {
  InputMediaUploadedDocument,
  Document,
  PollAnswer,
} from "../../core/tl/TLObjects";
import { IMessage } from "../../models/message";
import { Peer, SimplifiedMessageRequest, IPeer } from "../../models/peer";
import {
  Component,
  createElement,
  removeChildren,
  removeClass,
  on,
  addClass,
  Element,
  off,
} from "../../utils/dom";
import {
  getVideoMeta,
  makeFileDialog,
  readFile,
  resizeImage,
  readDataURL,
} from "../../utils/upload-file";
import { ContextMenu } from "../ui/context-menu";
import EmojiPanel from "../ui/emoji-panel";
import { Icons } from "../ui/icon";
import IconButton from "../ui/icon-button";
import QuoteBox from "./quote-box";
import * as styles from "./send-message.scss";
import { makeModal } from "../ui/modal";
import Input from "../ui/input";
import FileIcon from "../ui/file-icon";
import { TransientMedia, IsTypingAction } from "../../utils/useful-types";
import { parseFileSize, formatDurationWithMillis } from "../../utils/chat";
import RecordButton from "./record-button";
import { isMobile } from "../../utils/mobile";
import { extractEmojis } from "../../utils/emojis";
import EmojiPicker from "../ui/emoji-picker";
import { StickerSet } from "../../models/sticker-set";
import Checkbox from "../ui/checkbox";

interface Options {
  callback(message: SimplifiedMessageRequest): Promise<IMessage>;
  startTyping(action?: IsTypingAction): void;
  peer?: IPeer;
}

export default class SendMessageForm implements Component<Options> {
  public readonly element: HTMLElement;
  private callback: Options["callback"];
  private inputNode: HTMLTextAreaElement;
  private quoteBox: HTMLElement;
  private replyMessage?: IMessage;
  private recordButton: Element<RecordButton>;
  private deleteVoiceElement: Element<IconButton>;
  private preventMessage = false;
  private attachmentDropdown: Element<ContextMenu>;
  private peer: Options["peer"];

  constructor({ callback, startTyping }: Options) {
    this.callback = callback;
    this.inputNode = createElement("textarea", {
      rows: "1",
      class: styles.messageInput,
      placeholder: "Message",
      dir: "auto",
    }) as HTMLTextAreaElement;
    autosize(this.inputNode);

    const voiceUploader = this.uploadFactory("voice", (_type, requests) => {
      return new Promise((resolve, reject) => {
        const end = () => {
          addClass(this.deleteVoiceElement, "hidden");
          addClass(timer, "hidden");
          removeClass(attachmentActivator, "hidden");
          this.recordButton.instance.setState("mic");
          this.preventMessage = false;
        };
        const sendMessage = () => {
          off(this.deleteVoiceElement, "click", trashClick);
          off(this.inputNode, "keyup", keyUp);
          off(this.element, "submit", sendMessage);
          requests[0].message = this.inputNode.value;
          this.inputNode.value = "";
          autosize.update(this.inputNode);
          end();
          resolve(requests);
        };
        const keyUp = (event: KeyboardEvent) => {
          if (event.keyCode === 13 && !event.shiftKey) {
            sendMessage();
          }
        };
        const trashClick = () => {
          end();
          reject();
        };
        on(this.deleteVoiceElement, "click", trashClick);
        on(this.inputNode, "keyup", keyUp);
        on(this.element, "submit", sendMessage);
        this.preventMessage = true;
      });
    });

    const [attachmentDropdown, attachmentActivator] = this.createAttachment();
    const [emojiPicker, emojiActivator] = this.createEmojiPanel();
    const timer = createElement("div", { class: `${styles.timer} hidden` });

    this.attachmentDropdown = attachmentDropdown;

    const inputRow = createElement(
      "div",
      { class: styles.inputRow },
      emojiActivator,
      this.inputNode,
      timer,
      attachmentActivator,
      attachmentDropdown
    );

    let recording = false;
    let sendingInterval = 0;

    this.recordButton = createElement(RecordButton, {
      onClear: () => {
        addClass(this.deleteVoiceElement, "hidden");
        addClass(timer, "hidden");
        removeClass(attachmentActivator, "hidden");
        this.recordButton.instance.setState(
          this.inputNode.value === "" ? "mic" : "send"
        );
        recording = false;
      },
      onEnd: (blob, duration, waveform) => {
        this.preventMessage = true;
        recording = false;
        this.deleteVoiceElement.classList.remove("hidden");
        this.recordButton.instance.setState("send");
        clearInterval(sendingInterval);
        voiceUploader([new File([blob], "voice.ogg", { type: "audio/ogg" })], {
          attributes: [
            {
              $t: "DocumentAttributeAudio",
              voice: true,
              duration,
              waveform,
            },
          ],
          mimeType: "audio/ogg",
        });
      },
      onStart: () => {
        recording = true;
        const sendAudioTyping = () =>
          startTyping({ $t: "SendMessageRecordAudioAction" });
        sendAudioTyping();
        sendingInterval = setInterval(sendAudioTyping, 4000);
        addClass(attachmentActivator, "hidden");
        timer.classList.remove("hidden");
        let startTime: number;

        const updateTimer = (now: number) => {
          const elapsed = now - startTime;
          timer.innerText = formatDurationWithMillis(elapsed);

          if (recording) {
            requestAnimationFrame(updateTimer);
          }
        };

        requestAnimationFrame((now: number) => {
          startTime = now;
          updateTimer(now);
        });
      },
    });

    this.deleteVoiceElement = createElement(IconButton, {
      icon: Icons.Delete,
      color: "red",
    });
    this.deleteVoiceElement.className = "hidden";

    this.quoteBox = createElement("div", { class: styles.quoteRow });

    this.element = createElement(
      "form",
      { class: `hidden ${styles.container}`, action: "#" },
      emojiPicker,
      createElement(
        "div",
        { class: styles.inputArea },
        this.quoteBox,
        inputRow
      ),
      this.deleteVoiceElement,
      this.recordButton
    );

    on(this.inputNode, "input", () => {
      if (this.inputNode.value !== "") {
        startTyping();
        this.recordButton.instance.setState("send");
      } else {
        this.recordButton.instance.setState("mic");
      }
    });

    on(this.inputNode, "keypress", (e) => {
      if (e.which == 13 && !e.shiftKey && !isMobile()) {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    on(this.element, "submit", this.handleSubmit);
  }

  public setPeer(peer: IPeer) {
    this.peer = peer;
    const canSendPoll = peer.canSendPoll();
    (canSendPoll ? removeClass : addClass)(
      this.attachmentDropdown.querySelector("button") as HTMLElement,
      "hidden"
    );
  }

  public focus() {
    this.inputNode.focus();
  }

  public async setReply(message: IMessage) {
    this.replyMessage = message;
    removeChildren(this.quoteBox);

    this.quoteBox.append(
      createElement(IconButton, {
        icon: Icons.Close,
        color: "grey",
        onClick: () => {
          this.clearReply();
        },
      }),
      createElement(QuoteBox, {
        message,
      })
    );
    this.focus();
  }

  private async clearReply() {
    this.replyMessage = undefined;
    removeChildren(this.quoteBox);
  }

  private handleSubmit = (event?: Event) => {
    if (event) {
      event.preventDefault();
    }
    if (this.preventMessage) {
      return;
    }

    const value = this.inputNode.value.trim();
    if (value === "") {
      return;
    }
    autosize.update(this.inputNode);
    this.sendMessage({
      $t: "messages_SendMessageRequest",
      message: value,
    });
  };

  private showFilesModal = (
    type: "media" | "document" | "voice",
    requests: SimplifiedMessageRequest[]
  ): Promise<SimplifiedMessageRequest[]> => {
    return new Promise(async (resolve, reject) => {
      const element = createElement("div");
      for (const index in requests) {
        const request = requests[index];

        const media: TransientMedia = (request as any).media;

        if (type === "media") {
          let src = media.thumbnail;
          if (!src) {
            src = await readDataURL(media.file);
          }

          element.append(
            createElement(
              "div",
              { class: styles.mediaItem },
              createElement("img", { src })
            )
          );
        } else {
          const fileName = media.file.name;
          const extensionMatch = fileName.match(/\.([\w\d]+)$/);
          const extension = extensionMatch
            ? extensionMatch[1]
            : fileName.substr(fileName.length - 3);

          const fileIcon = createElement(FileIcon, { extension });
          fileIcon.instance.showDocument();
          element.append(
            createElement(
              "div",
              { class: styles.fileItem },
              fileIcon,
              createElement(
                "div",
                createElement("div", fileName),
                createElement("div", parseFileSize(media.file.size))
              )
            )
          );
        }
      }

      const captionInput = createElement(Input, {
        tag: "textarea",
        wrapperClass: styles.captionInput,
        placeholder: "Add a caption...",
      });
      on(captionInput, "keypress", (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
          e.preventDefault();
          submit(() => modal.close());
        }
      });
      captionInput.instance.value = this.inputNode.value;
      this.inputNode.value = "";
      autosize.update(this.inputNode);

      const submit = (cb: Function) => {
        const caption = captionInput.instance.value.trim();
        if (requests.length === 1) {
          requests[0].message = caption;
        } else if (caption) {
          this.sendMessage({
            $t: "messages_SendMessageRequest",
            message: caption,
          });
        }

        resolve(requests);
        cb();
      };

      const modal = makeModal(
        `Send ${requests.length} files`,
        createElement("div", element, captionInput),
        {
          caption: "Send",
          onClick: () => submit(() => modal.close()),
        },
        () => {
          reject();
          this.inputNode.value = captionInput.instance.value;
          this.focus();
        }
      );

      requestAnimationFrame(() => captionInput.instance.focus());
    });
  };

  private uploadFactory(
    type: "media" | "document" | "voice",
    confirmation = this.showFilesModal
  ) {
    return async (
      files: File[],
      rest: Partial<InputMediaUploadedDocument> = {}
    ) => {
      if (files.length === 0) {
        return;
      }

      const requests: SimplifiedMessageRequest[] = [];
      const buffers: ArrayBuffer[] = [];
      const subscriptions = new Map<File, (progress: number) => any>();

      for (const file of files) {
        const isPhoto = type === "media" && file.type.startsWith("image/");
        const isVideo = type === "media" && file.type.startsWith("video/");

        let buffer = await readFile(file);
        let width: number;
        let height: number;
        let thumbnail: string;

        if (isPhoto) {
          [buffer, width, height] = await resizeImage(buffer, file.type);
        }
        if (isVideo) {
          try {
            [thumbnail, width, height] = await getVideoMeta(buffer);
          } catch {}
        }

        buffers.push(buffer);

        requests.push({
          $t: "messages_SendMediaRequest",
          media: {
            $t: "TransientMedia",
            type,
            file,
            width,
            height,
            thumbnail,
            fileId: "unassigned",
            subscribe: (fn) => subscriptions.set(file, fn),
            inputMedia:
              type === "media" && file.type.startsWith("image/")
                ? {
                    $t: "InputMediaUploadedPhoto",
                  }
                : {
                    $t: "InputMediaUploadedDocument",
                    mimeType: file.type,
                    attributes: [
                      {
                        $t: "DocumentAttributeFilename",
                        fileName: file.name,
                      },
                    ],
                    ...rest,
                  },
          },
          message: "",
        });
      }

      let normalizedRequests: SimplifiedMessageRequest[];

      try {
        normalizedRequests = await confirmation(type, requests);
      } catch {
        return;
      }

      const transientModels: IMessage[] = [];

      for (const request of normalizedRequests) {
        const transientModel = await this.sendMessage(request);
        transientModels.push(transientModel);
      }

      for (const index in files) {
        const file = files[index];
        const buffer = buffers[index];
        const transientModel = transientModels[index];

        const uploadedFile = await Peer.tg.fileStorage.upload(
          buffer,
          (progress) => {
            const subscription = subscriptions.get(file);
            if (subscription) {
              subscription(progress);
            }
          }
        );

        if (
          transientModel.$t !== "Message" ||
          transientModel.media.$t !== "TransientMedia"
        ) {
          return;
        }

        transientModel.media.fileId = uploadedFile.id;

        await this.sendMessage({
          $t: "messages_SendMediaRequest",
          media: {
            ...transientModel.media.inputMedia,
            file: {
              ...uploadedFile,
              name: file.name,
            },
          } as any,
          replyToMsgId:
            transientModel.$t === "Message"
              ? transientModel.replyToMsgId
              : undefined,
          message:
            transientModel.$t === "Message" ? transientModel.message : "",
          transientModel,
        });

        // transientModel.destroy();
      }
    };
  }

  private createAttachment(): [Element<ContextMenu>, Element<IconButton>] {
    let timeout: number;

    const imageDialog = makeFileDialog(
      "image/*,video/*",
      true,
      this.uploadFactory("media")
    );
    const fileDialog = makeFileDialog(
      "*",
      true,
      this.uploadFactory("document")
    );

    const attachmentDropdown = createElement(ContextMenu, {
      class: "hidden " + styles.attachmentMenu,
      clickActivator: false,
      items: [
        {
          title: "Photo or Video",
          icon: Icons.Photo,
          tag: "label",
          for: imageDialog,
        },
        {
          title: "Document",
          icon: Icons.Document,
          tag: "label",
          for: fileDialog,
        },
        {
          title: "Poll",
          icon: Icons.Poll,
          onClick: () => {
            this.createPoll();
          },
        },
      ],
    });

    const clear = () => clearTimeout(timeout);
    const hide = (doClear: any) => {
      doClear !== false && clear();

      removeClass(attachmentDropdown, "visible");

      on(
        attachmentDropdown,
        "transitionend",
        () => {
          addClass(attachmentDropdown, "hidden");
        },
        { once: true }
      );
    };
    const show = () => {
      clear();
      addClass(attachmentDropdown, "visible");
      removeClass(attachmentDropdown, "hidden");
    };
    const hideWithTimeout = () => {
      clear();
      timeout = setTimeout(() => {
        hide(false);
      }, 1000);
    };

    on(attachmentDropdown, "mouseenter", clear);
    on(attachmentDropdown, "mouseleave", hide);

    const attachmentActivator = createElement(IconButton, {
      icon: Icons.Attach,
      type: "button",
      onHover() {
        show();
      },
      onHoverOut() {
        hideWithTimeout();
      },
    });

    return [attachmentDropdown, attachmentActivator];
  }

  private createPoll() {
    if (!this.peer.canSendPoll()) {
      return;
    }

    const answersWrapper = createElement("div", {
      style: { overflowX: "auto", maxHeight: "30vh", paddingTop: '1.5em', marginTop: '-1.5em' },
    });

    const question = createElement(Input, {
      placeholder: "Ask a Question",
      type: "text",
    });

    const anonymous = createElement(
      "label",
      { class: styles.checkboxWrapper },
      createElement(Checkbox),
      createElement("div", "Anonymous Voting")
    );

    const multipleAnswers = createElement(
      "label",
      { class: styles.checkboxWrapper },
      createElement(Checkbox),
      createElement("div", "Multiple Answers")
    );

    const quizMode = createElement(
      "label",
      { class: styles.checkboxWrapper },
      createElement(Checkbox),
      createElement("div", "Quiz Mode")
    );

    const element = createElement(
      "div",
      question,
      createElement("hr"),
      answersWrapper,
      createElement("hr"),
      anonymous,
      multipleAnswers,
      quizMode
    );

    const newOption = () => {
      const input = createElement(Input, {
        placeholder: "option",
        type: "text",
        onInput: () => {
          addOptionIfNeeded();
        },
      });
      answersWrapper.append(input);
    };

    const update = () => {
      let index = 1;
      const canDelete = answersWrapper.childNodes.length > 2;
      for (
        let input = answersWrapper.firstChild as Element<Input>;
        input !== null;
        input = input.nextSibling as Element<Input>
      ) {
        const isLast = !input.nextSibling;

        input.instance.setPlaceholder(
          isLast ? "Add option" : `Option ${index++}`
        );

        input.instance.setSuffix(
          canDelete && !isLast
            ? createElement(IconButton, {
                icon: Icons.Close,
                onClick: () => {
                  input.remove();
                  update();
                },
              })
            : undefined
        );
      }
    };

    const addOptionIfNeeded = () => {
      const lastInput = answersWrapper.children.item(
        answersWrapper.children.length - 1
      ) as Element<Input>;

      if (lastInput.instance.value) {
        newOption();
        update();
      }
    };

    ["", "", ""].forEach(newOption);

    update();

    const modal = makeModal("New Poll", element, {
      caption: "CREATE",
      onClick: () => {
        const questionText = question.instance.value.trim();

        const inputs: string[] = [];
        for (
          let input = answersWrapper.firstChild as Element<Input>;
          input !== null;
          input = input.nextSibling as Element<Input>
        ) {
          const value = input.instance.value.trim();
          if (input.nextSibling && value) {
            inputs.push(value);
          }
        }
        const pollAnswers: PollAnswer[] = inputs.map(
          (answer, i): PollAnswer => ({
            $t: "PollAnswer",
            option: new Uint8Array([39, i + 50]),
            text: answer,
          })
        );

        if (!questionText || pollAnswers.length < 2) {
          return;
        }

        this.sendMessage(
          {
            $t: "messages_SendMediaRequest",
            media: {
              $t: "InputMediaPoll",
              poll: {
                $t: "Poll",
                question: questionText,
                answers: pollAnswers,
                id: "1231111",
              },
            },
            message: "",
          },
          false
        );
        modal.close();
      },
    });
  }

  private handleSendDocument(document: Document) {
    this.sendMessage(
      {
        $t: "messages_SendMediaRequest",
        media: {
          $t: "InputMediaDocument",
          id: {
            $t: "InputDocument",
            accessHash: document.accessHash,
            fileReference: document.fileReference,
            id: document.id,
          },
        },
        actualMedia: {
          $t: "MessageMediaDocument",
          document,
        },
        message: "",
      },
      false
    );
  }

  private handleSendSticker(document: Document) {
    StickerSet.use(document);
    this.handleSendDocument(document);
  }

  private createEmojiPanel(): [Element<EmojiPanel>, Element<IconButton>] {
    const emojiActivator = createElement(IconButton, {
      icon: Icons.Smile,
      type: "button",
      onHover: (event) => {
        if (!isMobile()) {
          event.stopPropagation();
          emojiPicker.instance.setVisibility(true);
        }
      },
      onClick: () => {
        if (!emojiPicker.instance.visible && isMobile()) {
          emojiPicker.instance.setVisibility(true);
        }
      },
      onHoverOut: () => {
        if (!isMobile()) {
          emojiPicker.instance.deferHide();
        }
      },
    });

    const emojiPicker = createElement(EmojiPanel, {
      activator: emojiActivator,
      onEmojiSelect: (emoji) => {
        const target = this.inputNode;
        if (target.setRangeText) {
          const start = target.selectionStart;
          target.setRangeText(emoji);
          target.selectionStart = target.selectionEnd = start + emoji.length;
        } else {
          document.execCommand("insertText", false, emoji);
        }
        this.focus();
      },
      onStickerSelect: this.handleSendSticker.bind(this),
      onGifSelect: this.handleSendDocument.bind(this),
    });

    return [emojiPicker, emojiActivator];
  }

  private sendMessage(message: SimplifiedMessageRequest, clear = true) {
    const result = this.callback({
      ...message,
      ...(this.replyMessage ? { replyToMsgId: this.replyMessage.id } : {}),
    });
    this.clearReply();
    const emojis = extractEmojis(message.message);
    if (emojis.length > 0) {
      EmojiPicker.useEmojis(emojis);
    }

    if (clear) {
      this.inputNode.value = "";
      this.recordButton.instance.setState("mic");
      autosize.update(this.inputNode);
      this.focus();
    }
    return result;
  }
}
