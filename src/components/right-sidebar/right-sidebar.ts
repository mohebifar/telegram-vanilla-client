import { IMessage } from "../../models/message";
import { IPeer } from "../../models/peer";
import { Component, createElement, removeClass, addClass, on } from "../../utils/dom";
import Router from "../ui/router";
import MessageSearch from "./message-search";
import ProfileDetails from "./profile-details";
import * as styles from "./right-sidebar.scss";

interface Options {
  onMessageSelect(peer: IPeer, message: IMessage): any;
}

export default class RightSideBar implements Component<Options> {
  public readonly element: HTMLElement;
  private peer: IPeer;
  private router: Router;

  constructor({ onMessageSelect }: Options) {
    const routerElement = createElement(Router, {
      routes: [
        {
          name: "profile-details",
          render: ({ peer }: { peer: IPeer }) =>
            createElement(ProfileDetails, {
              peer,
              router: this.router,
              back: () => this.back(),
            }),
        },
        {
          name: "message-search",
          render: ({ peer }: { peer: IPeer }) =>
            createElement(MessageSearch, {
              onMessageSelect: (_, message) => {
                onMessageSelect(peer, message);
              },
              peer,
              back: () => this.back(),
            }),
        },
      ],
    });

    this.router = routerElement.instance;

    this.element = createElement(
      "div",
      { class: styles.root + " hidden" },
      routerElement
    );
  }

  public async back() {
    if (!(await this.router.back())) {
      this.close();
    }
  }

  public setPeer(peer: IPeer) {
    if (this.peer !== peer) {
      this.peer = peer;
      this.router.replace("profile-details", { peer });
    }
  }

  public search(peer: IPeer) {
    this.router[this.peer === peer ? "push" : "replace"]("message-search", {
      peer,
    });
  }

  public show() {
    removeClass(this.element, "hidden");
    addClass(this.element, "visible");
  }

  public isVisible() {
    return this.element.classList.contains("visible");
  }

  public close() {
    on(this.element, 
      "transitionend",
      () => {
        this.peer = null;
        this.element.style.transform = "";
        addClass(this.element, "hidden");
        this.router.flush();
      },
      {
        once: true,
      }
    );
    removeClass(this.element, "visible");
  }
}
