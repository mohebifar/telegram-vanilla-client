import { MessageMediaContact } from "../../core/tl/TLObjects";
import { TelegramClientProxy } from "../../telegram-worker-proxy";
import { Component, createElement } from "../../utils/dom";
import * as styles from "../chat/chat.scss";
import Avatar from "../ui/avatar";
import { Peer } from "../../models/peer";

export interface Options {
  media: MessageMediaContact;
  tg: TelegramClientProxy;
}

export default class ContactAttachment implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ media }: Options) {
    const avatarWrapper = createElement("div", { class: styles.documentType });
    Peer.get({
      type: "User",
      id: media.userId,
    }).then((peer) => {
      avatarWrapper.append(
        createElement(Avatar, {
          peer,
        })
      );
    });
    const element = createElement(
      "div",
      { class: styles.documentWrapper },
      avatarWrapper,
      createElement(
        "div",
        { class: styles.documentContent, style: {marginLeft: '20px'} },
        createElement(
          "div",
          { class: styles.title },
          `${media.firstName} ${media.lastName}`
        ),
        media.phoneNumber
      )
    );

    this.element = element;
  }
}
