import {
  Chat,
  ChatEmpty,
  ChatForbidden,
  Channel,
  ChannelForbidden,
  UserEmpty,
  User,
  Message,
  MessageEmpty,
  Updates,
  UpdateShort as TLUpdateShort,
  UpdateShortMessage,
  MessageService,
  UpdateShortChatMessage
} from "../core/tl/TLObjects";

export type AllChatTypes =
  | Chat
  | ChatEmpty
  | ChatForbidden
  | Channel
  | ChannelForbidden;

export type AllUserTypes = User | UserEmpty;

export type AllDialogPeerTypes = AllChatTypes | AllUserTypes;

export type DialogMessageTypes = Message | MessageEmpty | MessageService;

export type Update = Updates["updates"][0];
export type UpdateShort =
  | TLUpdateShort["update"]
  | UpdateShortMessage
  | UpdateShortChatMessage;

export type AllUpdateTypes = UpdateShort | Update;
