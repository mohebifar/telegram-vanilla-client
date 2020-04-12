import { IPeer } from "../../models/peer";
import { getChatSubdueText } from "../../utils/chat";
import { Component, createElement } from "../../utils/dom";
import Avatar from "../ui/avatar";
import Icon, { Icons } from "../ui/icon";
import IconButton from "../ui/icon-button";
import Router, { SlideTransition } from "../ui/router";
import Tabs from "../ui/tabs";
import * as styles from "./right-sidebar.scss";
import SharedMediaPanel from "./shared-media";
import SharedLinks from "./shared-links";
import SharedDocs from "./shared-docs";
import SharedAudio from "./shared-audio";

interface Options {
  router: Router;
  peer: IPeer;
  back: Function;
}

export default class ProfileDetails extends SlideTransition
  implements Component<Options> {
  public readonly element: HTMLElement;

  constructor({ peer, back }: Options) {
    super();

    const heading = createElement(
      "div",
      { class: styles.heading },
      createElement(IconButton, {
        icon: Icons.Close,
        onClick: () => {
          back();
        }
      }),
      createElement("div", { class: styles.title }, "Info"),
      createElement(IconButton, { icon: Icons.Menu })
    );

    const profile = createElement(
      "div",
      { class: styles.profile },
      createElement(Avatar, { peer, size: "l" }),
      createElement("div", { class: styles.name }, peer.displayName),
      createElement("div", { class: styles.subdue }, getChatSubdueText(peer))
    );

    const profileDetails = createElement("div");

    peer.loadFull().then(() => {
      const profileItems = [
        {
          icon: Icons.Info,
          content: peer.full ? peer.full.about : null,
          title: peer.$t === "User" ? "Bio" : "About"
        },
        {
          icon: Icons.Username,
          content: "username" in peer ? peer.username : null,
          title: "Username"
        },
        {
          icon: Icons.Phone,
          content: peer.$t === "User" ? peer.phone : null,
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

    const sharedMedia = createElement(SharedMediaPanel, { peer });
    const sharedLinks = createElement(SharedLinks, { peer });
    const sharedDocs = createElement(SharedDocs, { peer });
    const sharedAudio = createElement(SharedAudio, { peer });

    const tabs = createElement(Tabs, {
      tabs: [
        { title: "Media", content: sharedMedia },
        { title: "Docs", content: sharedDocs },
        { title: "Link", content: sharedLinks },
        { title: "Audio", content: sharedAudio }
      ]
    });

    this.element = createElement(
      "div",
      { class: styles.container },
      heading,
      profile,
      profileDetails,
      tabs
    );
  }
}
