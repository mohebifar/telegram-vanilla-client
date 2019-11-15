import {
  TLObjectTypes,
  UpdateShortChatMessage,
  UpdateShortMessage,
  UpdateShortSentMessage
} from "./tl/TLObjects";
import { RPCResult } from "./tl/core/RPCResult";
import { MessageContainer } from "./tl/core/MessageContainer";
import {
  UpdateNewMessage,
  UpdateMessageID,
  UpdateDeleteMessages,
  UpdateUserTyping,
  UpdateChatUserTyping,
  UpdateChatParticipants,
  UpdateUserStatus,
  UpdateUserName,
  UpdateUserPhoto,
  UpdateNewEncryptedMessage,
  UpdateEncryptedChatTyping,
  UpdateEncryption,
  UpdateEncryptedMessagesRead,
  UpdateChatParticipantAdd,
  UpdateChatParticipantDelete,
  UpdateDcOptions,
  UpdateUserBlocked,
  UpdateNotifySettings,
  UpdateServiceNotification,
  UpdatePrivacy,
  UpdateUserPhone,
  UpdateReadHistoryInbox,
  UpdateReadHistoryOutbox,
  UpdateWebPage,
  UpdateReadMessagesContents,
  UpdateChannelTooLong,
  UpdateChannel,
  UpdateNewChannelMessage,
  UpdateReadChannelInbox,
  UpdateDeleteChannelMessages,
  UpdateChannelMessageViews,
  UpdateChatParticipantAdmin,
  UpdateNewStickerSet,
  UpdateStickerSetsOrder,
  UpdateStickerSets,
  UpdateSavedGifs,
  UpdateBotInlineQuery,
  UpdateBotInlineSend,
  UpdateEditChannelMessage,
  UpdateChannelPinnedMessage,
  UpdateBotCallbackQuery,
  UpdateEditMessage,
  UpdateInlineBotCallbackQuery,
  UpdateReadChannelOutbox,
  UpdateDraftMessage,
  UpdateReadFeaturedStickers,
  UpdateRecentStickers,
  UpdateConfig,
  UpdatePtsChanged,
  UpdateChannelWebPage,
  UpdateDialogPinned,
  UpdatePinnedDialogs,
  UpdateBotWebhookJSON,
  UpdateBotWebhookJSONQuery,
  UpdateBotShippingQuery,
  UpdateBotPrecheckoutQuery,
  UpdatePhoneCall,
  UpdateLangPackTooLong,
  UpdateLangPack,
  UpdateFavedStickers,
  UpdateChannelReadMessagesContents,
  UpdateContactsReset,
  UpdateChannelAvailableMessages,
  UpdateDialogUnreadMark,
  UpdateUserPinnedMessage,
  UpdateChatPinnedMessage,
  UpdateMessagePoll,
  UpdateChatDefaultBannedRights,
  UpdateFolderPeers,
  UpdatePeerSettings,
  UpdatePeerLocated,
  UpdateNewScheduledMessage,
  UpdateDeleteScheduledMessages,
  UpdateTheme
} from "./tl/TLObjects";

export type TLObject = RPCResult | MessageContainer | TLObjectTypes;

export interface TLMessage<T = TLObject> {
  msgId: bigint;
  seqNo: number;
  obj: T;
}

export type UpdateTypes =
  | UpdateNewMessage
  | UpdateMessageID
  | UpdateDeleteMessages
  | UpdateUserTyping
  | UpdateChatUserTyping
  | UpdateChatParticipants
  | UpdateUserStatus
  | UpdateUserName
  | UpdateUserPhoto
  | UpdateNewEncryptedMessage
  | UpdateEncryptedChatTyping
  | UpdateEncryption
  | UpdateEncryptedMessagesRead
  | UpdateChatParticipantAdd
  | UpdateChatParticipantDelete
  | UpdateDcOptions
  | UpdateUserBlocked
  | UpdateNotifySettings
  | UpdateServiceNotification
  | UpdatePrivacy
  | UpdateUserPhone
  | UpdateReadHistoryInbox
  | UpdateReadHistoryOutbox
  | UpdateWebPage
  | UpdateReadMessagesContents
  | UpdateChannelTooLong
  | UpdateChannel
  | UpdateNewChannelMessage
  | UpdateReadChannelInbox
  | UpdateDeleteChannelMessages
  | UpdateChannelMessageViews
  | UpdateChatParticipantAdmin
  | UpdateNewStickerSet
  | UpdateStickerSetsOrder
  | UpdateStickerSets
  | UpdateSavedGifs
  | UpdateBotInlineQuery
  | UpdateBotInlineSend
  | UpdateEditChannelMessage
  | UpdateChannelPinnedMessage
  | UpdateBotCallbackQuery
  | UpdateEditMessage
  | UpdateInlineBotCallbackQuery
  | UpdateReadChannelOutbox
  | UpdateDraftMessage
  | UpdateReadFeaturedStickers
  | UpdateRecentStickers
  | UpdateConfig
  | UpdatePtsChanged
  | UpdateChannelWebPage
  | UpdateDialogPinned
  | UpdatePinnedDialogs
  | UpdateBotWebhookJSON
  | UpdateBotWebhookJSONQuery
  | UpdateBotShippingQuery
  | UpdateBotPrecheckoutQuery
  | UpdatePhoneCall
  | UpdateLangPackTooLong
  | UpdateLangPack
  | UpdateFavedStickers
  | UpdateChannelReadMessagesContents
  | UpdateContactsReset
  | UpdateChannelAvailableMessages
  | UpdateDialogUnreadMark
  | UpdateUserPinnedMessage
  | UpdateChatPinnedMessage
  | UpdateMessagePoll
  | UpdateChatDefaultBannedRights
  | UpdateFolderPeers
  | UpdatePeerSettings
  | UpdatePeerLocated
  | UpdateNewScheduledMessage
  | UpdateDeleteScheduledMessages
  | UpdateTheme
  | UpdateShortChatMessage
  | UpdateShortSentMessage
  | UpdateShortMessage;
