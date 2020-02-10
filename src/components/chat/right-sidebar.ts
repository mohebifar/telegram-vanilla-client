import { IPeer } from "../../models/peer";
import { Component, createElement, removeChildren } from "../../utils/dom";
import { startAnimation } from "../../utils/easing";
import SharedMediaPanel from "../righ-sidebar/shared-media";
import Avatar from "../ui/avatar";
import Icon, { Icons } from "../ui/icon";
import IconButton from "../ui/icon-button";
import Tabs from "../ui/tabs";
import * as styles from "./right-sidebar.scss";

interface Options {}

export default class RightSideBar implements Component<Options> {
  public readonly element: HTMLElement;
  private peer: IPeer;

  constructor(_: Options) {
    this.element = createElement("div", {
      class: styles.root + " hidden"
    });
  }

  public async update() {
    removeChildren(this.element);

    const heading = createElement(
      "div",
      { class: styles.heading },
      createElement(IconButton, {
        icon: Icons.Close,
        onClick: () => this.close()
      }),
      createElement("div", { class: styles.title }, "Info"),
      createElement(IconButton, { icon: Icons.Menu })
    );

    const profile = createElement(
      "div",
      { class: styles.profile },
      createElement(Avatar, { peer: this.peer, size: "l" }),
      createElement("div", { class: styles.name }, this.peer.displayName),
      createElement("div", { class: styles.subdue }, "online")
    );

    const profileDetails = createElement("div");

    this.peer.loadFull().then(() => {
      const profileItems = [
        {
          icon: Icons.Info,
          content: this.peer.full ? this.peer.full.about : null,
          title: this.peer.$t === "User" ? "Bio" : "About"
        },
        {
          icon: Icons.Username,
          content: "username" in this.peer ? this.peer.username : null,
          title: "Username"
        },
        {
          icon: Icons.Phone,
          content: this.peer.$t === "User" ? this.peer.phone : null,
          title: "Phone"
        }
      ].filter(({ content }) => content);

      profileItems.forEach(item => {
        profileDetails.append(
          createElement(
            "div",
            { class: styles.profileDetail },
            createElement(Icon, { icon: item.icon, color: "grey" }),
            createElement(
              "div",
              createElement("div", item.content),
              createElement("div", item.title)
            )
          )
        );
      });
    });

    const sharedMedia = createElement(SharedMediaPanel, { peer: this.peer });

    const tabs = createElement(Tabs, {
      tabs: [
        { title: "Media", content: sharedMedia },
        { title: "Docs" },
        { title: "Link" },
        { title: "Audio" }
      ]
    });

    this.element.classList.remove("hidden");
    this.element.append(
      createElement(
        "div",
        { class: styles.container },
        heading,
        profile,
        profileDetails,
        tabs
      )
    );
  }

  public setPeer(peer: IPeer) {
    this.peer = peer;
  }

  public show() {
    this.update();
  }

  public close() {
    startAnimation(
      { w: { from: 25, to: 0 } },
      v => {
        this.element.style.width = v.w + "em";
      },
      () => {
        this.element.style.width = "";
        this.element.classList.add("hidden");
        removeChildren(this.element);
      }
    );
  }
}
