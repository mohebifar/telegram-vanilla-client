import { IMessage } from "../../models/message";
import { IPeer } from "../../models/peer";
import { Component, createElement } from "../../utils/dom";
import { startAnimation } from "../../utils/easing";
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
              back: () => this.back()
            })
        },
        {
          name: "message-search",
          render: ({ peer }: { peer: IPeer }) =>
            createElement(MessageSearch, {
              onMessageSelect: (_, message) => {
                onMessageSelect(peer, message);
              },
              peer,
              back: () => this.back()
            })
        }
      ]
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
      peer
    });
  }

  public show() {
    this.element.classList.remove("hidden");
  }

  public close() {
    startAnimation(
      { w: { from: 25, to: 0 } },
      v => {
        this.element.style.width = v.w + "em";
      },
      () => {
        this.peer = null;
        this.element.style.width = "";
        this.element.classList.add("hidden");
        this.router.flush();
      }
    );
  }
}
