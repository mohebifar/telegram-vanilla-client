import { BigInteger as JBigInt } from "big-integer";
import { MessageContainer } from "./tl/core/MessageContainer";
import { RPCResult } from "./tl/core/RPCResult";
import {
  TLObjectTypes,
  UpdateBotCallbackQuery,
  UpdateBotInlineQuery,
  UpdateBotInlineSend,
  UpdateBotPrecheckoutQuery,
  UpdateBotShippingQuery,
  UpdateBotWebhookJSON,
  UpdateBotWebhookJSONQuery,
  UpdateChannel,
  UpdateChannelAvailableMessages,
  UpdateChannelMessageViews,
  UpdateChannelPinnedMessage,
  UpdateChannelReadMessagesContents,
  UpdateChannelTooLong,
  UpdateChannelWebPage,
  UpdateChatDefaultBannedRights,
  UpdateChatParticipantAdd,
  UpdateChatParticipantAdmin,
  UpdateChatParticipantDelete,
  UpdateChatParticipants,
  UpdateChatPinnedMessage,
  UpdateChatUserTyping,
  UpdateConfig,
  UpdateContactsReset,
  UpdateDcOptions,
  UpdateDeleteChannelMessages,
  UpdateDeleteMessages,
  UpdateDeleteScheduledMessages,
  UpdateDialogPinned,
  UpdateDialogUnreadMark,
  UpdateDraftMessage,
  UpdateEditChannelMessage,
  UpdateEditMessage,
  UpdateEncryptedChatTyping,
  UpdateEncryptedMessagesRead,
  UpdateEncryption,
  UpdateFavedStickers,
  UpdateFolderPeers,
  UpdateInlineBotCallbackQuery,
  UpdateLangPack,
  UpdateLangPackTooLong,
  UpdateMessageID,
  UpdateMessagePoll,
  UpdateNewChannelMessage,
  UpdateNewEncryptedMessage,
  UpdateNewMessage,
  UpdateNewScheduledMessage,
  UpdateNewStickerSet,
  UpdateNotifySettings,
  UpdatePeerLocated,
  UpdatePeerSettings,
  UpdatePhoneCall,
  UpdatePinnedDialogs,
  UpdatePrivacy,
  UpdatePtsChanged,
  UpdateReadChannelInbox,
  UpdateReadChannelOutbox,
  UpdateReadFeaturedStickers,
  UpdateReadHistoryInbox,
  UpdateReadHistoryOutbox,
  UpdateReadMessagesContents,
  UpdateRecentStickers,
  UpdateSavedGifs,
  UpdateServiceNotification,
  UpdateShortChatMessage,
  UpdateShortMessage,
  UpdateShortSentMessage,
  UpdateStickerSets,
  UpdateStickerSetsOrder,
  UpdateTheme,
  UpdateUserBlocked,
  UpdateUserName,
  UpdateUserPhone,
  UpdateUserPhoto,
  UpdateUserPinnedMessage,
  UpdateUserStatus,
  UpdateUserTyping,
  UpdateWebPage
} from "./tl/TLObjects";

export type TLObject = RPCResult | MessageContainer | TLObjectTypes;

export interface TLMessage<T = TLObject> {
  msgId: JBigInt;
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
