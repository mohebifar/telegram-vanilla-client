import {
  Chat,
  ChatEmpty,
  ChatForbidden,
  Channel,
  ChannelForbidden,
  UserEmpty,
  User,
  MessageService,
  MessageEmpty,
  Message,
  UpdateShort as TLUpdateShort,
  UpdateShortChatMessage,
  UpdateShortSentMessage,
  UpdateShortMessage,
  Updates,
  InputPeerSelf,
  InputPeerUser,
  InputPeerChannel,
  InputPeerEmpty,
  InputPeerUserFromMessage,
  InputPeerChat,
  InputPeerChannelFromMessage,
  messages_GetMessagesRequest
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
  | TLUpdateShort
  | UpdateShortMessage
  | UpdateShortChatMessage
  | UpdateShortSentMessage;

export type AllUpdateTypes = Updates | UpdateShort | Update;

export type InputPeerTypes =
  | InputPeerSelf
  | InputPeerUser
  | InputPeerChannel
  | InputPeerEmpty
  | InputPeerUserFromMessage
  | InputPeerChat
  | InputPeerChannelFromMessage;

export type InputMessageIdTypes = messages_GetMessagesRequest["id"][0];
