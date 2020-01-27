import {
  Chat,
  ChatEmpty,
  ChatForbidden,
  Channel,
  ChannelForbidden,
  UserEmpty,
  User,
  Message,
  MessageEmpty
} from "../core/tl/TLObjects";

export type AllChatTypes =
  | Chat
  | ChatEmpty
  | ChatForbidden
  | Channel
  | ChannelForbidden;

export type AllUserTypes = User | UserEmpty;

export type AllDialogPeerTypes = AllChatTypes | AllUserTypes;

export type DialogMessageTypes = Message | MessageEmpty;
