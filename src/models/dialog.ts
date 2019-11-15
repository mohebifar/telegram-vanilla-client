import mitt, { Emitter } from "mitt";
import dayjs from "dayjs";
import {
  User,
  Chat,
  ChatForbidden,
  Channel,
  ChannelForbidden,
  ChatEmpty,
  UserEmpty,
  Message,
  Dialog,
  MessageEmpty,
  UpdateShortMessage
} from "../core/tl/TLObjects";
import { getPeerId } from "../core/tl/utils";
import {
  getDialogDisplayName,
  getShortLastText,
  getDialogDisplayDate
} from "../utils/chat";
import store from "../utils/store";

export type DialogPeerTypes =
  | User
  | Chat
  | ChatForbidden
  | Channel
  | ChannelForbidden
  | ChatEmpty
  | UserEmpty;

export type DialogMessageTypes = Message | MessageEmpty | UpdateShortMessage;

export class PresentationalDialog {
  public name: string;
  static cache = new Map<number, PresentationalDialog>();
  static order: number[] = [];

  private _dialog: Dialog;
  private _peer: DialogPeerTypes;
  private _message: DialogMessageTypes;
  public displayName = "";
  public displayDate = "";
  public text = "";
  public date: Date;
  public silent = false;
  public events: Emitter;

  constructor(
    dialog: Dialog,
    peer: DialogPeerTypes,
    message: DialogMessageTypes = { $t: "MessageEmpty", id: 0 }
  ) {
    this.dialog = dialog;
    this.peer = peer;
    this.message = message;
    this.events = mitt();
  }

  set dialog(dialog: Dialog) {
    this._dialog = dialog;
    this.handleDialogUpdate();
  }

  get dialog() {
    return this._dialog;
  }

  set message(message: DialogMessageTypes) {
    this._message = message;
    this.handleMessageUpdate();
  }

  get message() {
    return this._message;
  }

  set peer(peer: DialogPeerTypes) {
    this._peer = peer;
    this.handlePeerUpdate();
  }

  get peer() {
    return this._peer;
  }

  private handleMessageUpdate() {
    switch (this._message.$t) {
      case "Message":
        this.date = new Date(this._message.date * 1000);
        break;
      case "MessageEmpty":
        this.date = new Date(
          this.dialog.draft && this.dialog.draft.date * 1000
        );
        break;
    }

    this.text = getShortLastText(this._message);
    this.displayDate = getDialogDisplayDate(this.date);
  }

  private handleDialogUpdate() {
    if (this._dialog.notifySettings.$t === "PeerNotifySettings") {
      this.silent = dayjs(this._dialog.notifySettings.muteUntil * 1000).isAfter(
        new Date()
      );
    }
  }

  private handlePeerUpdate() {
    this.displayName = getDialogDisplayName(this._peer);
  }

  static getInstance(
    dialog: Dialog,
    peer?: DialogPeerTypes,
    message?: DialogMessageTypes
  ) {
    let dialogModel: PresentationalDialog;
    const id = getPeerId(dialog.peer);

    if (PresentationalDialog.cache.has(id)) {
      dialogModel = PresentationalDialog.cache.get(id);
      dialogModel.dialog = dialog;

      if (peer) {
        dialogModel.peer = peer;
      }

      if (message) {
        dialogModel.message = message;
      }
    } else {
      dialogModel = new PresentationalDialog(dialog, peer, message);
      PresentationalDialog.cache.set(id, dialogModel);
    }

    console.debug(dialogModel.displayName, dialogModel);

    return dialogModel;
  }

  static findById(id: number) {
    const dialog = store.getDialog(id);
    const key = store.getDialogPeerIdKey(dialog);
    const peerId = dialog.peer[key];

    let peer: DialogPeerTypes;
    let message: DialogMessageTypes;

    if (store.peers.has(peerId)) {
      peer = store.peers.get(peerId);
    }

    if (store.messages.has(dialog.topMessage)) {
      message = store.messages.get(dialog.topMessage);
    }

    return PresentationalDialog.getInstance(dialog, peer, message);
  }

  static getAllSorted() {
    return store.sortedDialogs.map(id => {
      return PresentationalDialog.findById(id);
    });
  }

  static emitEvent(id: number, event: string, payload?: any) {
    if (PresentationalDialog.cache.has(id)) {
      const dialog = PresentationalDialog.cache.get(id);

      if (event === "update") {
        dialog.handleMessageUpdate();
        dialog.handlePeerUpdate();
        dialog.handleDialogUpdate();
      }

      dialog.events.emit(event, payload);
    }
  }
}
