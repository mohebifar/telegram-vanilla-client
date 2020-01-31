import { TLObjectType } from "./types";

export interface ResPQ extends TLObjectType<"ResPQ", 0x05162463, 0x786986b8> {
  serverPublicKeyFingerprints: bigint[];
  pq: Uint8Array;
  serverNonce: bigint;
  nonce: bigint;
}

export interface PQInnerData
  extends TLObjectType<"PQInnerData", 0x83c95aec, 0x41701377> {
  newNonce: bigint;
  serverNonce: bigint;
  nonce: bigint;
  q: Uint8Array;
  p: Uint8Array;
  pq: Uint8Array;
}

export interface PQInnerDataDc
  extends TLObjectType<"PQInnerDataDc", 0xa9f55f95, 0x41701377> {
  dc: number;
  newNonce: bigint;
  serverNonce: bigint;
  nonce: bigint;
  q: Uint8Array;
  p: Uint8Array;
  pq: Uint8Array;
}

export interface PQInnerDataTemp
  extends TLObjectType<"PQInnerDataTemp", 0x3c6a84d4, 0x41701377> {
  expiresIn: number;
  newNonce: bigint;
  serverNonce: bigint;
  nonce: bigint;
  q: Uint8Array;
  p: Uint8Array;
  pq: Uint8Array;
}

export interface PQInnerDataTempDc
  extends TLObjectType<"PQInnerDataTempDc", 0x56fddf88, 0x41701377> {
  expiresIn: number;
  dc: number;
  newNonce: bigint;
  serverNonce: bigint;
  nonce: bigint;
  q: Uint8Array;
  p: Uint8Array;
  pq: Uint8Array;
}

export interface ServerDHParamsFail
  extends TLObjectType<"ServerDHParamsFail", 0x79cb045d, 0xa6188d9e> {
  newNonceHash: bigint;
  serverNonce: bigint;
  nonce: bigint;
}

export interface ServerDHParamsOk
  extends TLObjectType<"ServerDHParamsOk", 0xd0e8075c, 0xa6188d9e> {
  encryptedAnswer: Uint8Array;
  serverNonce: bigint;
  nonce: bigint;
}

export interface ServerDHInnerData
  extends TLObjectType<"ServerDHInnerData", 0xb5890dba, 0xc69a67bc> {
  serverTime: number;
  gA: Uint8Array;
  dhPrime: Uint8Array;
  g: number;
  serverNonce: bigint;
  nonce: bigint;
}

export interface ClientDHInnerData
  extends TLObjectType<"ClientDHInnerData", 0x6643b654, 0xf8eeef6a> {
  gB: Uint8Array;
  retryId: bigint;
  serverNonce: bigint;
  nonce: bigint;
}

export interface DhGenOk
  extends TLObjectType<"DhGenOk", 0x3bcbf734, 0x55dd6cdb> {
  newNonceHash1: bigint;
  serverNonce: bigint;
  nonce: bigint;
}

export interface DhGenRetry
  extends TLObjectType<"DhGenRetry", 0x46dc1fb9, 0x55dd6cdb> {
  newNonceHash2: bigint;
  serverNonce: bigint;
  nonce: bigint;
}

export interface DhGenFail
  extends TLObjectType<"DhGenFail", 0xa69dae02, 0x55dd6cdb> {
  newNonceHash3: bigint;
  serverNonce: bigint;
  nonce: bigint;
}

export interface DestroyAuthKeyOk
  extends TLObjectType<"DestroyAuthKeyOk", 0xf660e1d4, 0x8291e68e> {}

export interface DestroyAuthKeyNone
  extends TLObjectType<"DestroyAuthKeyNone", 0x0a9f2259, 0x8291e68e> {}

export interface DestroyAuthKeyFail
  extends TLObjectType<"DestroyAuthKeyFail", 0xea109b13, 0x8291e68e> {}

export interface ReqPqRequest
  extends TLObjectType<"ReqPqRequest", 0x60469778, 0x786986b8> {
  nonce: bigint;
}

export interface ReqPqMultiRequest
  extends TLObjectType<"ReqPqMultiRequest", 0xbe7e8ef1, 0x786986b8> {
  nonce: bigint;
}

export interface ReqDHParamsRequest
  extends TLObjectType<"ReqDHParamsRequest", 0xd712e4be, 0xa6188d9e> {
  encryptedData: Uint8Array;
  publicKeyFingerprint: bigint;
  q: Uint8Array;
  p: Uint8Array;
  serverNonce: bigint;
  nonce: bigint;
}

export interface SetClientDHParamsRequest
  extends TLObjectType<"SetClientDHParamsRequest", 0xf5045f1f, 0x55dd6cdb> {
  encryptedData: Uint8Array;
  serverNonce: bigint;
  nonce: bigint;
}

export interface DestroyAuthKeyRequest
  extends TLObjectType<"DestroyAuthKeyRequest", 0xd1435160, 0x8291e68e> {}

export interface MsgsAck
  extends TLObjectType<"MsgsAck", 0x62d6b459, 0x827677c4> {
  msgIds: bigint[];
}

export interface BadMsgNotification
  extends TLObjectType<"BadMsgNotification", 0xa7eff811, 0xcebaa157> {
  errorCode: number;
  badMsgSeqno: number;
  badMsgId: bigint;
}

export interface BadServerSalt
  extends TLObjectType<"BadServerSalt", 0xedab447b, 0xcebaa157> {
  newServerSalt: bigint;
  errorCode: number;
  badMsgSeqno: number;
  badMsgId: bigint;
}

export interface MsgsStateReq
  extends TLObjectType<"MsgsStateReq", 0xda69fb52, 0x18f01dd0> {
  msgIds: bigint[];
}

export interface MsgsStateInfo
  extends TLObjectType<"MsgsStateInfo", 0x04deb57d, 0x70a0a64> {
  info: string;
  reqMsgId: bigint;
}

export interface MsgsAllInfo
  extends TLObjectType<"MsgsAllInfo", 0x8cc0d131, 0xfa8fcb54> {
  info: string;
  msgIds: bigint[];
}

export interface MsgDetailedInfo
  extends TLObjectType<"MsgDetailedInfo", 0x276d3ec6, 0x5f32d5ee> {
  status: number;
  bytes: number;
  answerMsgId: bigint;
  msgId: bigint;
}

export interface MsgNewDetailedInfo
  extends TLObjectType<"MsgNewDetailedInfo", 0x809db6df, 0x5f32d5ee> {
  status: number;
  bytes: number;
  answerMsgId: bigint;
}

export interface MsgResendReq
  extends TLObjectType<"MsgResendReq", 0x7d861a08, 0x2024514> {
  msgIds: bigint[];
}

export interface RpcError
  extends TLObjectType<"RpcError", 0x2144ca19, 0x4a17e265> {
  errorMessage: string;
  errorCode: number;
}

export interface RpcAnswerUnknown
  extends TLObjectType<"RpcAnswerUnknown", 0x5e2ad36e, 0x4bca7570> {}

export interface RpcAnswerDroppedRunning
  extends TLObjectType<"RpcAnswerDroppedRunning", 0xcd78e586, 0x4bca7570> {}

export interface RpcAnswerDropped
  extends TLObjectType<"RpcAnswerDropped", 0xa43ad8b7, 0x4bca7570> {
  bytes: number;
  seqNo: number;
  msgId: bigint;
}

export interface FutureSalt
  extends TLObjectType<"FutureSalt", 0x0949d9dc, 0x45e53dcf> {
  salt: bigint;
  validUntil: number;
  validSince: number;
}

export interface FutureSalts
  extends TLObjectType<"FutureSalts", 0xae500895, 0x1090f517> {
  salts: any[];
  now: number;
  reqMsgId: bigint;
}

export interface Pong extends TLObjectType<"Pong", 0x347773c5, 0x816aee71> {
  pingId: bigint;
  msgId: bigint;
}

export interface DestroySessionOk
  extends TLObjectType<"DestroySessionOk", 0xe22045fc, 0xaf0ce7bd> {
  sessionId: bigint;
}

export interface DestroySessionNone
  extends TLObjectType<"DestroySessionNone", 0x62d350c9, 0xaf0ce7bd> {
  sessionId: bigint;
}

export interface NewSessionCreated
  extends TLObjectType<"NewSessionCreated", 0x9ec20908, 0x510d3031> {
  serverSalt: bigint;
  uniqueId: bigint;
  firstMsgId: bigint;
}

export interface HttpWait
  extends TLObjectType<"HttpWait", 0x9299359f, 0x1284aed6> {
  maxWait: number;
  waitAfter: number;
  maxDelay: number;
}

export interface IpPort extends TLObjectType<"IpPort", 0xd433ad73, 0xa2a03726> {
  port: number;
  ipv4: number;
}

export interface IpPortSecret
  extends TLObjectType<"IpPortSecret", 0x37982646, 0xa2a03726> {
  secret: Uint8Array;
  port: number;
  ipv4: number;
}

export interface AccessPointRule
  extends TLObjectType<"AccessPointRule", 0x4679b65f, 0xb1aca0fd> {
  ips: (IpPort | IpPortSecret)[];
  dcId: number;
  phonePrefixRules: string;
}

export interface help_ConfigSimple
  extends TLObjectType<"help_ConfigSimple", 0x5a592a6c, 0x29183ac4> {
  rules: AccessPointRule[];
  expires: number;
  date: number;
}

export interface TlsClientHello
  extends TLObjectType<"TlsClientHello", 0x6c52c484, 0xbef20920> {
  blocks: (
    | TlsBlockString
    | TlsBlockRandom
    | TlsBlockZero
    | TlsBlockDomain
    | TlsBlockGrease
    | TlsBlockScope
  )[];
}

export interface TlsBlockString
  extends TLObjectType<"TlsBlockString", 0x4218a164, 0xf1163490> {
  data: string;
}

export interface TlsBlockRandom
  extends TLObjectType<"TlsBlockRandom", 0x4d4dc41e, 0xf1163490> {
  length: number;
}

export interface TlsBlockZero
  extends TLObjectType<"TlsBlockZero", 0x09333afb, 0xf1163490> {
  length: number;
}

export interface TlsBlockDomain
  extends TLObjectType<"TlsBlockDomain", 0x10e8636f, 0xf1163490> {}

export interface TlsBlockGrease
  extends TLObjectType<"TlsBlockGrease", 0xe675a1c1, 0xf1163490> {
  seed: number;
}

export interface TlsBlockScope
  extends TLObjectType<"TlsBlockScope", 0xe725d44f, 0xf1163490> {
  entries: (
    | TlsBlockString
    | TlsBlockRandom
    | TlsBlockZero
    | TlsBlockDomain
    | TlsBlockGrease
    | TlsBlockScope
  )[];
}

export interface RpcDropAnswerRequest
  extends TLObjectType<"RpcDropAnswerRequest", 0x58e4a740, 0x4bca7570> {
  reqMsgId: bigint;
}

export interface GetFutureSaltsRequest
  extends TLObjectType<"GetFutureSaltsRequest", 0xb921bd04, 0x1090f517> {
  num: number;
}

export interface PingRequest
  extends TLObjectType<"PingRequest", 0x7abe77ec, 0x816aee71> {
  pingId: bigint;
}

export interface PingDelayDisconnectRequest
  extends TLObjectType<"PingDelayDisconnectRequest", 0xf3427b8c, 0x816aee71> {
  disconnectDelay: number;
  pingId: bigint;
}

export interface DestroySessionRequest
  extends TLObjectType<"DestroySessionRequest", 0xe7512126, 0xaf0ce7bd> {
  sessionId: bigint;
}

export interface InputPeerEmpty
  extends TLObjectType<"InputPeerEmpty", 0x7f3b18ea, 0xc91c90b6> {}

export interface InputPeerSelf
  extends TLObjectType<"InputPeerSelf", 0x7da07ec9, 0xc91c90b6> {}

export interface InputPeerChat
  extends TLObjectType<"InputPeerChat", 0x179be863, 0xc91c90b6> {
  chatId: number;
}

export interface InputPeerUser
  extends TLObjectType<"InputPeerUser", 0x7b8e7de6, 0xc91c90b6> {
  accessHash: bigint;
  userId: number;
}

export interface InputPeerChannel
  extends TLObjectType<"InputPeerChannel", 0x20adaef8, 0xc91c90b6> {
  accessHash: bigint;
  channelId: number;
}

export interface InputPeerUserFromMessage
  extends TLObjectType<"InputPeerUserFromMessage", 0x17bae2e6, 0xc91c90b6> {
  userId: number;
  msgId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface InputPeerChannelFromMessage
  extends TLObjectType<"InputPeerChannelFromMessage", 0x9c95f7bb, 0xc91c90b6> {
  channelId: number;
  msgId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface InputUserEmpty
  extends TLObjectType<"InputUserEmpty", 0xb98886cf, 0xe669bf46> {}

export interface InputUserSelf
  extends TLObjectType<"InputUserSelf", 0xf7c1b13f, 0xe669bf46> {}

export interface InputUser
  extends TLObjectType<"InputUser", 0xd8292816, 0xe669bf46> {
  accessHash: bigint;
  userId: number;
}

export interface InputUserFromMessage
  extends TLObjectType<"InputUserFromMessage", 0x2d117597, 0xe669bf46> {
  userId: number;
  msgId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface InputPhoneContact
  extends TLObjectType<"InputPhoneContact", 0xf392b7f4, 0xae696a82> {
  lastName: string;
  firstName: string;
  phone: string;
  clientId: bigint;
}

export interface InputFile
  extends TLObjectType<"InputFile", 0xf52ff27f, 0xe7655f1f> {
  md5Checksum: string;
  name: string;
  parts: number;
  id: bigint;
}

export interface InputFileBig
  extends TLObjectType<"InputFileBig", 0xfa4f0bb5, 0xe7655f1f> {
  name: string;
  parts: number;
  id: bigint;
}

export interface InputMediaEmpty
  extends TLObjectType<"InputMediaEmpty", 0x9664f57f, 0xfaf846f4> {}

export interface InputMediaUploadedPhoto
  extends TLObjectType<"InputMediaUploadedPhoto", 0x1e287d04, 0xfaf846f4> {
  file: InputFile | InputFileBig;
  stickers?: (InputDocumentEmpty | InputDocument)[];
  ttlSeconds?: number;
}

export interface InputMediaPhoto
  extends TLObjectType<"InputMediaPhoto", 0xb3ba0635, 0xfaf846f4> {
  id: InputPhotoEmpty | InputPhoto;
  ttlSeconds?: number;
}

export interface InputMediaGeoPoint
  extends TLObjectType<"InputMediaGeoPoint", 0xf9c44144, 0xfaf846f4> {
  geoPoint: InputGeoPointEmpty | InputGeoPoint;
}

export interface InputMediaContact
  extends TLObjectType<"InputMediaContact", 0xf8ab7dfb, 0xfaf846f4> {
  vcard: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
}

export interface InputMediaUploadedDocument
  extends TLObjectType<"InputMediaUploadedDocument", 0x5b38c6c1, 0xfaf846f4> {
  attributes: (
    | DocumentAttributeImageSize
    | DocumentAttributeAnimated
    | DocumentAttributeSticker
    | DocumentAttributeVideo
    | DocumentAttributeAudio
    | DocumentAttributeFilename
    | DocumentAttributeHasStickers
  )[];
  mimeType: string;
  file: InputFile | InputFileBig;
  nosoundVideo?: boolean;
  thumb?: InputFile | InputFileBig;
  stickers?: (InputDocumentEmpty | InputDocument)[];
  ttlSeconds?: number;
}

export interface InputMediaDocument
  extends TLObjectType<"InputMediaDocument", 0x23ab23d2, 0xfaf846f4> {
  id: InputDocumentEmpty | InputDocument;
  ttlSeconds?: number;
}

export interface InputMediaVenue
  extends TLObjectType<"InputMediaVenue", 0xc13d1c11, 0xfaf846f4> {
  venueType: string;
  venueId: string;
  provider: string;
  address: string;
  title: string;
  geoPoint: InputGeoPointEmpty | InputGeoPoint;
}

export interface InputMediaGifExternal
  extends TLObjectType<"InputMediaGifExternal", 0x4843b0fd, 0xfaf846f4> {
  q: string;
  url: string;
}

export interface InputMediaPhotoExternal
  extends TLObjectType<"InputMediaPhotoExternal", 0xe5bbfe1a, 0xfaf846f4> {
  url: string;
  ttlSeconds?: number;
}

export interface InputMediaDocumentExternal
  extends TLObjectType<"InputMediaDocumentExternal", 0xfb52dc99, 0xfaf846f4> {
  url: string;
  ttlSeconds?: number;
}

export interface InputMediaGame
  extends TLObjectType<"InputMediaGame", 0xd33f43f3, 0xfaf846f4> {
  id: InputGameID | InputGameShortName;
}

export interface InputMediaInvoice
  extends TLObjectType<"InputMediaInvoice", 0xf4e096c3, 0xfaf846f4> {
  startParam: string;
  providerData:
    | DataJSON
    | bots_SendCustomRequestRequest
    | phone_GetCallConfigRequest;
  provider: string;
  payload: Uint8Array;
  invoice: Invoice;
  description: string;
  title: string;
  photo?: InputWebDocument;
}

export interface InputMediaGeoLive
  extends TLObjectType<"InputMediaGeoLive", 0xce4e82fd, 0xfaf846f4> {
  geoPoint: InputGeoPointEmpty | InputGeoPoint;
  stopped?: boolean;
  period?: number;
}

export interface InputMediaPoll
  extends TLObjectType<"InputMediaPoll", 0x06b3765b, 0xfaf846f4> {
  poll: Poll;
}

export interface InputChatPhotoEmpty
  extends TLObjectType<"InputChatPhotoEmpty", 0x1ca48f57, 0xd4eb2d74> {}

export interface InputChatUploadedPhoto
  extends TLObjectType<"InputChatUploadedPhoto", 0x927c55b4, 0xd4eb2d74> {
  file: InputFile | InputFileBig;
}

export interface InputChatPhoto
  extends TLObjectType<"InputChatPhoto", 0x8953ad37, 0xd4eb2d74> {
  id: InputPhotoEmpty | InputPhoto;
}

export interface InputGeoPointEmpty
  extends TLObjectType<"InputGeoPointEmpty", 0xe4c123d6, 0x430d225> {}

export interface InputGeoPoint
  extends TLObjectType<"InputGeoPoint", 0xf3b7acc9, 0x430d225> {
  long: number;
  lat: number;
}

export interface InputPhotoEmpty
  extends TLObjectType<"InputPhotoEmpty", 0x1cd7bf0d, 0x846363e0> {}

export interface InputPhoto
  extends TLObjectType<"InputPhoto", 0x3bb3b94a, 0x846363e0> {
  fileReference: Uint8Array;
  accessHash: bigint;
  id: bigint;
}

export interface InputFileLocation
  extends TLObjectType<"InputFileLocation", 0xdfdaabe1, 0x1523d462> {
  fileReference: Uint8Array;
  secret: bigint;
  localId: number;
  volumeId: bigint;
}

export interface InputEncryptedFileLocation
  extends TLObjectType<"InputEncryptedFileLocation", 0xf5235d55, 0x1523d462> {
  accessHash: bigint;
  id: bigint;
}

export interface InputDocumentFileLocation
  extends TLObjectType<"InputDocumentFileLocation", 0xbad07584, 0x1523d462> {
  thumbSize: string;
  fileReference: Uint8Array;
  accessHash: bigint;
  id: bigint;
}

export interface InputSecureFileLocation
  extends TLObjectType<"InputSecureFileLocation", 0xcbc7ee28, 0x1523d462> {
  accessHash: bigint;
  id: bigint;
}

export interface InputTakeoutFileLocation
  extends TLObjectType<"InputTakeoutFileLocation", 0x29be5899, 0x1523d462> {}

export interface InputPhotoFileLocation
  extends TLObjectType<"InputPhotoFileLocation", 0x40181ffe, 0x1523d462> {
  thumbSize: string;
  fileReference: Uint8Array;
  accessHash: bigint;
  id: bigint;
}

export interface InputPeerPhotoFileLocation
  extends TLObjectType<"InputPeerPhotoFileLocation", 0x27d69997, 0x1523d462> {
  localId: number;
  volumeId: bigint;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  big?: boolean;
}

export interface InputStickerSetThumb
  extends TLObjectType<"InputStickerSetThumb", 0x0dbaeae9, 0x1523d462> {
  localId: number;
  volumeId: bigint;
  stickerset:
    | InputStickerSetEmpty
    | InputStickerSetID
    | InputStickerSetShortName
    | InputStickerSetAnimatedEmoji;
}

export interface PeerUser
  extends TLObjectType<"PeerUser", 0x9db1bc6d, 0x2d45687> {
  userId: number;
}

export interface PeerChat
  extends TLObjectType<"PeerChat", 0xbad0e5bb, 0x2d45687> {
  chatId: number;
}

export interface PeerChannel
  extends TLObjectType<"PeerChannel", 0xbddde532, 0x2d45687> {
  channelId: number;
}

export interface storage_FileUnknown
  extends TLObjectType<"storage_FileUnknown", 0xaa963b05, 0xf3a1e6f3> {}

export interface storage_FilePartial
  extends TLObjectType<"storage_FilePartial", 0x40bc6f52, 0xf3a1e6f3> {}

export interface storage_FileJpeg
  extends TLObjectType<"storage_FileJpeg", 0x007efe0e, 0xf3a1e6f3> {}

export interface storage_FileGif
  extends TLObjectType<"storage_FileGif", 0xcae1aadf, 0xf3a1e6f3> {}

export interface storage_FilePng
  extends TLObjectType<"storage_FilePng", 0x0a4f63c0, 0xf3a1e6f3> {}

export interface storage_FilePdf
  extends TLObjectType<"storage_FilePdf", 0xae1e508d, 0xf3a1e6f3> {}

export interface storage_FileMp3
  extends TLObjectType<"storage_FileMp3", 0x528a0677, 0xf3a1e6f3> {}

export interface storage_FileMov
  extends TLObjectType<"storage_FileMov", 0x4b09ebbc, 0xf3a1e6f3> {}

export interface storage_FileMp4
  extends TLObjectType<"storage_FileMp4", 0xb3cea0e4, 0xf3a1e6f3> {}

export interface storage_FileWebp
  extends TLObjectType<"storage_FileWebp", 0x1081464c, 0xf3a1e6f3> {}

export interface UserEmpty
  extends TLObjectType<"UserEmpty", 0x200250ba, 0x2da17977> {
  id: number;
}

export interface User extends TLObjectType<"User", 0x938458c1, 0x2da17977> {
  id: number;
  isSelf?: boolean;
  contact?: boolean;
  mutualContact?: boolean;
  deleted?: boolean;
  bot?: boolean;
  botChatHistory?: boolean;
  botNochats?: boolean;
  verified?: boolean;
  restricted?: boolean;
  min?: boolean;
  botInlineGeo?: boolean;
  support?: boolean;
  scam?: boolean;
  accessHash?: bigint;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  photo?:
    | UserProfilePhotoEmpty
    | UserProfilePhoto
    | photos_UpdateProfilePhotoRequest;
  status?:
    | UserStatusEmpty
    | UserStatusOnline
    | UserStatusOffline
    | UserStatusRecently
    | UserStatusLastWeek
    | UserStatusLastMonth;
  botInfoVersion?: number;
  restrictionReason?: RestrictionReason[];
  botInlinePlaceholder?: string;
  langCode?: string;
}

export interface UserProfilePhotoEmpty
  extends TLObjectType<"UserProfilePhotoEmpty", 0x4f11bae1, 0xc6338f7d> {}

export interface UserProfilePhoto
  extends TLObjectType<"UserProfilePhoto", 0xecd75d8c, 0xc6338f7d> {
  dcId: number;
  photoBig: FileLocationToBeDeprecated;
  photoSmall: FileLocationToBeDeprecated;
  photoId: bigint;
}

export interface UserStatusEmpty
  extends TLObjectType<"UserStatusEmpty", 0x09d05049, 0x5b0b743e> {}

export interface UserStatusOnline
  extends TLObjectType<"UserStatusOnline", 0xedb93949, 0x5b0b743e> {
  expires: number;
}

export interface UserStatusOffline
  extends TLObjectType<"UserStatusOffline", 0x008c703f, 0x5b0b743e> {
  wasOnline: number;
}

export interface UserStatusRecently
  extends TLObjectType<"UserStatusRecently", 0xe26f42f1, 0x5b0b743e> {}

export interface UserStatusLastWeek
  extends TLObjectType<"UserStatusLastWeek", 0x07bf09fc, 0x5b0b743e> {}

export interface UserStatusLastMonth
  extends TLObjectType<"UserStatusLastMonth", 0x77ebc742, 0x5b0b743e> {}

export interface ChatEmpty
  extends TLObjectType<"ChatEmpty", 0x9ba2d800, 0xc5af5d94> {
  id: number;
}

export interface Chat extends TLObjectType<"Chat", 0x3bda1bde, 0xc5af5d94> {
  version: number;
  date: number;
  participantsCount: number;
  photo: ChatPhotoEmpty | ChatPhoto;
  title: string;
  id: number;
  creator?: boolean;
  kicked?: boolean;
  left?: boolean;
  deactivated?: boolean;
  migratedTo?: InputChannelEmpty | InputChannel | InputChannelFromMessage;
  adminRights?: ChatAdminRights;
  defaultBannedRights?: ChatBannedRights;
}

export interface ChatForbidden
  extends TLObjectType<"ChatForbidden", 0x07328bdb, 0xc5af5d94> {
  title: string;
  id: number;
}

export interface Channel
  extends TLObjectType<"Channel", 0xd31a961e, 0xc5af5d94> {
  version: number;
  date: number;
  photo: ChatPhotoEmpty | ChatPhoto;
  title: string;
  id: number;
  creator?: boolean;
  left?: boolean;
  broadcast?: boolean;
  verified?: boolean;
  megagroup?: boolean;
  restricted?: boolean;
  signatures?: boolean;
  min?: boolean;
  scam?: boolean;
  hasLink?: boolean;
  hasGeo?: boolean;
  slowmodeEnabled?: boolean;
  accessHash?: bigint;
  username?: string;
  restrictionReason?: RestrictionReason[];
  adminRights?: ChatAdminRights;
  bannedRights?: ChatBannedRights;
  defaultBannedRights?: ChatBannedRights;
  participantsCount?: number;
}

export interface ChannelForbidden
  extends TLObjectType<"ChannelForbidden", 0x289da732, 0xc5af5d94> {
  title: string;
  accessHash: bigint;
  id: number;
  broadcast?: boolean;
  megagroup?: boolean;
  untilDate?: number;
}

export interface ChatFull
  extends TLObjectType<"ChatFull", 0x1b7c9db3, 0xd49a2697> {
  exportedInvite:
    | ChatInviteEmpty
    | ChatInviteExported
    | messages_ExportChatInviteRequest;
  notifySettings: PeerNotifySettings | account_GetNotifySettingsRequest;
  participants: ChatParticipantsForbidden | ChatParticipants;
  about: string;
  id: number;
  canSetUsername?: boolean;
  hasScheduled?: boolean;
  chatPhoto?: PhotoEmpty | Photo;
  botInfo?: BotInfo[];
  pinnedMsgId?: number;
  folderId?: number;
}

export interface ChannelFull
  extends TLObjectType<"ChannelFull", 0x2d895c74, 0xd49a2697> {
  pts: number;
  botInfo: BotInfo[];
  exportedInvite:
    | ChatInviteEmpty
    | ChatInviteExported
    | messages_ExportChatInviteRequest;
  notifySettings: PeerNotifySettings | account_GetNotifySettingsRequest;
  chatPhoto: PhotoEmpty | Photo;
  unreadCount: number;
  readOutboxMaxId: number;
  readInboxMaxId: number;
  about: string;
  id: number;
  canViewParticipants?: boolean;
  canSetUsername?: boolean;
  canSetStickers?: boolean;
  hiddenPrehistory?: boolean;
  canViewStats?: boolean;
  canSetLocation?: boolean;
  hasScheduled?: boolean;
  participantsCount?: number;
  adminsCount?: number;
  kickedCount?: number;
  bannedCount?: number;
  onlineCount?: number;
  migratedFromChatId?: number;
  migratedFromMaxId?: number;
  pinnedMsgId?: number;
  stickerset?: StickerSet;
  availableMinId?: number;
  folderId?: number;
  linkedChatId?: number;
  location?: ChannelLocationEmpty | ChannelLocation;
  slowmodeSeconds?: number;
  slowmodeNextSendDate?: number;
}

export interface ChatParticipant
  extends TLObjectType<"ChatParticipant", 0xc8d7493e, 0x7d7c6f86> {
  date: number;
  inviterId: number;
  userId: number;
}

export interface ChatParticipantCreator
  extends TLObjectType<"ChatParticipantCreator", 0xda13538a, 0x7d7c6f86> {
  userId: number;
}

export interface ChatParticipantAdmin
  extends TLObjectType<"ChatParticipantAdmin", 0xe2d6e436, 0x7d7c6f86> {
  date: number;
  inviterId: number;
  userId: number;
}

export interface ChatParticipantsForbidden
  extends TLObjectType<"ChatParticipantsForbidden", 0xfc900c2b, 0x1fa89571> {
  chatId: number;
  selfParticipant?:
    | ChatParticipant
    | ChatParticipantCreator
    | ChatParticipantAdmin;
}

export interface ChatParticipants
  extends TLObjectType<"ChatParticipants", 0x3f460fed, 0x1fa89571> {
  version: number;
  participants: (
    | ChatParticipant
    | ChatParticipantCreator
    | ChatParticipantAdmin
  )[];
  chatId: number;
}

export interface ChatPhotoEmpty
  extends TLObjectType<"ChatPhotoEmpty", 0x37c1011c, 0xac3ec4e5> {}

export interface ChatPhoto
  extends TLObjectType<"ChatPhoto", 0x475cdbd5, 0xac3ec4e5> {
  dcId: number;
  photoBig: FileLocationToBeDeprecated;
  photoSmall: FileLocationToBeDeprecated;
}

export interface MessageEmpty
  extends TLObjectType<"MessageEmpty", 0x83e5de54, 0x790009e3> {
  id: number;
}

export interface Message
  extends TLObjectType<"Message", 0x452c0e65, 0x790009e3> {
  message: string;
  date: number;
  toId: PeerUser | PeerChat | PeerChannel;
  id: number;
  out?: boolean;
  mentioned?: boolean;
  mediaUnread?: boolean;
  silent?: boolean;
  post?: boolean;
  fromScheduled?: boolean;
  legacy?: boolean;
  editHide?: boolean;
  fromId?: number;
  fwdFrom?: MessageFwdHeader;
  viaBotId?: number;
  replyToMsgId?: number;
  media?:
    | MessageMediaEmpty
    | MessageMediaPhoto
    | MessageMediaGeo
    | MessageMediaContact
    | MessageMediaUnsupported
    | MessageMediaDocument
    | MessageMediaWebPage
    | MessageMediaVenue
    | MessageMediaGame
    | MessageMediaInvoice
    | MessageMediaGeoLive
    | MessageMediaPoll
    | messages_GetWebPagePreviewRequest
    | messages_UploadMediaRequest;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  views?: number;
  editDate?: number;
  postAuthor?: string;
  groupedId?: bigint;
  restrictionReason?: RestrictionReason[];
}

export interface MessageService
  extends TLObjectType<"MessageService", 0x9e19a1f6, 0x790009e3> {
  action:
    | MessageActionEmpty
    | MessageActionChatCreate
    | MessageActionChatEditTitle
    | MessageActionChatEditPhoto
    | MessageActionChatDeletePhoto
    | MessageActionChatAddUser
    | MessageActionChatDeleteUser
    | MessageActionChatJoinedByLink
    | MessageActionChannelCreate
    | MessageActionChatMigrateTo
    | MessageActionChannelMigrateFrom
    | MessageActionPinMessage
    | MessageActionHistoryClear
    | MessageActionGameScore
    | MessageActionPaymentSentMe
    | MessageActionPaymentSent
    | MessageActionPhoneCall
    | MessageActionScreenshotTaken
    | MessageActionCustomAction
    | MessageActionBotAllowed
    | MessageActionSecureValuesSentMe
    | MessageActionSecureValuesSent
    | MessageActionContactSignUp;
  date: number;
  toId: PeerUser | PeerChat | PeerChannel;
  id: number;
  out?: boolean;
  mentioned?: boolean;
  mediaUnread?: boolean;
  silent?: boolean;
  post?: boolean;
  legacy?: boolean;
  fromId?: number;
  replyToMsgId?: number;
}

export interface MessageMediaEmpty
  extends TLObjectType<"MessageMediaEmpty", 0x3ded6320, 0x476cbe32> {}

export interface MessageMediaPhoto
  extends TLObjectType<"MessageMediaPhoto", 0x695150d7, 0x476cbe32> {
  photo?: PhotoEmpty | Photo;
  ttlSeconds?: number;
}

export interface MessageMediaGeo
  extends TLObjectType<"MessageMediaGeo", 0x56e0d474, 0x476cbe32> {
  geo: GeoPointEmpty | GeoPoint;
}

export interface MessageMediaContact
  extends TLObjectType<"MessageMediaContact", 0xcbf24940, 0x476cbe32> {
  userId: number;
  vcard: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
}

export interface MessageMediaUnsupported
  extends TLObjectType<"MessageMediaUnsupported", 0x9f84f49e, 0x476cbe32> {}

export interface MessageMediaDocument
  extends TLObjectType<"MessageMediaDocument", 0x9cb070d7, 0x476cbe32> {
  document?:
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest;
  ttlSeconds?: number;
}

export interface MessageMediaWebPage
  extends TLObjectType<"MessageMediaWebPage", 0xa32dd600, 0x476cbe32> {
  webpage:
    | WebPageEmpty
    | WebPagePending
    | WebPage
    | WebPageNotModified
    | messages_GetWebPageRequest;
}

export interface MessageMediaVenue
  extends TLObjectType<"MessageMediaVenue", 0x2ec0533f, 0x476cbe32> {
  venueType: string;
  venueId: string;
  provider: string;
  address: string;
  title: string;
  geo: GeoPointEmpty | GeoPoint;
}

export interface MessageMediaGame
  extends TLObjectType<"MessageMediaGame", 0xfdb19008, 0x476cbe32> {
  game: Game;
}

export interface MessageMediaInvoice
  extends TLObjectType<"MessageMediaInvoice", 0x84551347, 0x476cbe32> {
  startParam: string;
  totalAmount: bigint;
  currency: string;
  description: string;
  title: string;
  shippingAddressRequested?: boolean;
  test?: boolean;
  photo?: WebDocument | WebDocumentNoProxy;
  receiptMsgId?: number;
}

export interface MessageMediaGeoLive
  extends TLObjectType<"MessageMediaGeoLive", 0x7c3c2609, 0x476cbe32> {
  period: number;
  geo: GeoPointEmpty | GeoPoint;
}

export interface MessageMediaPoll
  extends TLObjectType<"MessageMediaPoll", 0x4bd6e798, 0x476cbe32> {
  results: PollResults;
  poll: Poll;
}

export interface MessageActionEmpty
  extends TLObjectType<"MessageActionEmpty", 0xb6aef7b0, 0x8680d126> {}

export interface MessageActionChatCreate
  extends TLObjectType<"MessageActionChatCreate", 0xa6638b9a, 0x8680d126> {
  users: number[];
  title: string;
}

export interface MessageActionChatEditTitle
  extends TLObjectType<"MessageActionChatEditTitle", 0xb5a1ce5a, 0x8680d126> {
  title: string;
}

export interface MessageActionChatEditPhoto
  extends TLObjectType<"MessageActionChatEditPhoto", 0x7fcb13a8, 0x8680d126> {
  photo: PhotoEmpty | Photo;
}

export interface MessageActionChatDeletePhoto
  extends TLObjectType<
    "MessageActionChatDeletePhoto",
    0x95e3fbef,
    0x8680d126
  > {}

export interface MessageActionChatAddUser
  extends TLObjectType<"MessageActionChatAddUser", 0x488a7337, 0x8680d126> {
  users: number[];
}

export interface MessageActionChatDeleteUser
  extends TLObjectType<"MessageActionChatDeleteUser", 0xb2ae9b0c, 0x8680d126> {
  userId: number;
}

export interface MessageActionChatJoinedByLink
  extends TLObjectType<
    "MessageActionChatJoinedByLink",
    0xf89cf5e8,
    0x8680d126
  > {
  inviterId: number;
}

export interface MessageActionChannelCreate
  extends TLObjectType<"MessageActionChannelCreate", 0x95d2ac92, 0x8680d126> {
  title: string;
}

export interface MessageActionChatMigrateTo
  extends TLObjectType<"MessageActionChatMigrateTo", 0x51bdb021, 0x8680d126> {
  channelId: number;
}

export interface MessageActionChannelMigrateFrom
  extends TLObjectType<
    "MessageActionChannelMigrateFrom",
    0xb055eaee,
    0x8680d126
  > {
  chatId: number;
  title: string;
}

export interface MessageActionPinMessage
  extends TLObjectType<"MessageActionPinMessage", 0x94bd38ed, 0x8680d126> {}

export interface MessageActionHistoryClear
  extends TLObjectType<"MessageActionHistoryClear", 0x9fbab604, 0x8680d126> {}

export interface MessageActionGameScore
  extends TLObjectType<"MessageActionGameScore", 0x92a72876, 0x8680d126> {
  score: number;
  gameId: bigint;
}

export interface MessageActionPaymentSentMe
  extends TLObjectType<"MessageActionPaymentSentMe", 0x8f31b327, 0x8680d126> {
  charge: PaymentCharge;
  payload: Uint8Array;
  totalAmount: bigint;
  currency: string;
  info?: PaymentRequestedInfo;
  shippingOptionId?: string;
}

export interface MessageActionPaymentSent
  extends TLObjectType<"MessageActionPaymentSent", 0x40699cd0, 0x8680d126> {
  totalAmount: bigint;
  currency: string;
}

export interface MessageActionPhoneCall
  extends TLObjectType<"MessageActionPhoneCall", 0x80e11a7f, 0x8680d126> {
  callId: bigint;
  video?: boolean;
  reason?:
    | PhoneCallDiscardReasonMissed
    | PhoneCallDiscardReasonDisconnect
    | PhoneCallDiscardReasonHangup
    | PhoneCallDiscardReasonBusy;
  duration?: number;
}

export interface MessageActionScreenshotTaken
  extends TLObjectType<
    "MessageActionScreenshotTaken",
    0x4792929b,
    0x8680d126
  > {}

export interface MessageActionCustomAction
  extends TLObjectType<"MessageActionCustomAction", 0xfae69f56, 0x8680d126> {
  message: string;
}

export interface MessageActionBotAllowed
  extends TLObjectType<"MessageActionBotAllowed", 0xabe9affe, 0x8680d126> {
  domain: string;
}

export interface MessageActionSecureValuesSentMe
  extends TLObjectType<
    "MessageActionSecureValuesSentMe",
    0x1b287353,
    0x8680d126
  > {
  credentials: SecureCredentialsEncrypted;
  values: (SecureValue | account_SaveSecureValueRequest)[];
}

export interface MessageActionSecureValuesSent
  extends TLObjectType<
    "MessageActionSecureValuesSent",
    0xd95c6154,
    0x8680d126
  > {
  types: (
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail
  )[];
}

export interface MessageActionContactSignUp
  extends TLObjectType<"MessageActionContactSignUp", 0xf3f25f76, 0x8680d126> {}

export interface Dialog extends TLObjectType<"Dialog", 0x2c171f72, 0x42cddd54> {
  notifySettings: PeerNotifySettings | account_GetNotifySettingsRequest;
  unreadMentionsCount: number;
  unreadCount: number;
  readOutboxMaxId: number;
  readInboxMaxId: number;
  topMessage: number;
  peer: PeerUser | PeerChat | PeerChannel;
  pinned?: boolean;
  unreadMark?: boolean;
  pts?: number;
  draft?: DraftMessageEmpty | DraftMessage;
  folderId?: number;
}

export interface DialogFolder
  extends TLObjectType<"DialogFolder", 0x71bd134c, 0x42cddd54> {
  unreadUnmutedMessagesCount: number;
  unreadMutedMessagesCount: number;
  unreadUnmutedPeersCount: number;
  unreadMutedPeersCount: number;
  topMessage: number;
  peer: PeerUser | PeerChat | PeerChannel;
  folder: Folder;
  pinned?: boolean;
}

export interface PhotoEmpty
  extends TLObjectType<"PhotoEmpty", 0x2331b22d, 0xd576ab1c> {
  id: bigint;
}

export interface Photo extends TLObjectType<"Photo", 0xd07504a5, 0xd576ab1c> {
  dcId: number;
  sizes: (PhotoSizeEmpty | PhotoSize | PhotoCachedSize | PhotoStrippedSize)[];
  date: number;
  fileReference: Uint8Array;
  accessHash: bigint;
  id: bigint;
  hasStickers?: boolean;
}

export interface PhotoSizeEmpty
  extends TLObjectType<"PhotoSizeEmpty", 0x0e17e23c, 0x17cc29d9> {
  type: string;
}

export interface PhotoSize
  extends TLObjectType<"PhotoSize", 0x77bfb61b, 0x17cc29d9> {
  size: number;
  h: number;
  w: number;
  location: FileLocationToBeDeprecated;
  type: string;
}

export interface PhotoCachedSize
  extends TLObjectType<"PhotoCachedSize", 0xe9a734fa, 0x17cc29d9> {
  bytes: Uint8Array;
  h: number;
  w: number;
  location: FileLocationToBeDeprecated;
  type: string;
}

export interface PhotoStrippedSize
  extends TLObjectType<"PhotoStrippedSize", 0xe0b0bc2e, 0x17cc29d9> {
  bytes: Uint8Array;
  type: string;
}

export interface GeoPointEmpty
  extends TLObjectType<"GeoPointEmpty", 0x1117dd5f, 0xd610e16d> {}

export interface GeoPoint
  extends TLObjectType<"GeoPoint", 0x0296f104, 0xd610e16d> {
  accessHash: bigint;
  lat: number;
  long: number;
}

export interface auth_SentCode
  extends TLObjectType<"auth_SentCode", 0x5e002502, 0x6ce87081> {
  phoneCodeHash: string;
  type:
    | auth_SentCodeTypeApp
    | auth_SentCodeTypeSms
    | auth_SentCodeTypeCall
    | auth_SentCodeTypeFlashCall;
  nextType?: auth_CodeTypeSms | auth_CodeTypeCall | auth_CodeTypeFlashCall;
  timeout?: number;
}

export interface auth_Authorization
  extends TLObjectType<"auth_Authorization", 0xcd050916, 0xb9e04e39> {
  user:
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest;
  tmpSessions?: number;
}

export interface auth_AuthorizationSignUpRequired
  extends TLObjectType<
    "auth_AuthorizationSignUpRequired",
    0x44747e9a,
    0xb9e04e39
  > {
  termsOfService?: help_TermsOfService;
}

export interface auth_ExportedAuthorization
  extends TLObjectType<"auth_ExportedAuthorization", 0xdf969c2d, 0x5fd1ec51> {
  bytes: Uint8Array;
  id: number;
}

export interface InputNotifyPeer
  extends TLObjectType<"InputNotifyPeer", 0xb8bc5b0c, 0x58981615> {
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface InputNotifyUsers
  extends TLObjectType<"InputNotifyUsers", 0x193b4417, 0x58981615> {}

export interface InputNotifyChats
  extends TLObjectType<"InputNotifyChats", 0x4a95e84e, 0x58981615> {}

export interface InputNotifyBroadcasts
  extends TLObjectType<"InputNotifyBroadcasts", 0xb1db7c7e, 0x58981615> {}

export interface InputPeerNotifySettings
  extends TLObjectType<"InputPeerNotifySettings", 0x9c3d198e, 0x90db0b0d> {
  showPreviews?: boolean;
  silent?: boolean;
  muteUntil?: number;
  sound?: string;
}

export interface PeerNotifySettings
  extends TLObjectType<"PeerNotifySettings", 0xaf509d20, 0xcf20c074> {
  showPreviews?: boolean;
  silent?: boolean;
  muteUntil?: number;
  sound?: string;
}

export interface PeerSettings
  extends TLObjectType<"PeerSettings", 0x818426cd, 0xf6a79f84> {
  reportSpam?: boolean;
  addContact?: boolean;
  blockContact?: boolean;
  shareContact?: boolean;
  needContactsException?: boolean;
  reportGeo?: boolean;
}

export interface WallPaper
  extends TLObjectType<"WallPaper", 0xa437c3ed, 0x96a2c98b> {
  document:
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest;
  slug: string;
  accessHash: bigint;
  id: bigint;
  creator?: boolean;
  default?: boolean;
  pattern?: boolean;
  dark?: boolean;
  settings?: WallPaperSettings;
}

export interface InputReportReasonSpam
  extends TLObjectType<"InputReportReasonSpam", 0x58dbcab8, 0x8401bd27> {}

export interface InputReportReasonViolence
  extends TLObjectType<"InputReportReasonViolence", 0x1e22c78d, 0x8401bd27> {}

export interface InputReportReasonPornography
  extends TLObjectType<
    "InputReportReasonPornography",
    0x2e59d922,
    0x8401bd27
  > {}

export interface InputReportReasonChildAbuse
  extends TLObjectType<"InputReportReasonChildAbuse", 0xadf44ee3, 0x8401bd27> {}

export interface InputReportReasonOther
  extends TLObjectType<"InputReportReasonOther", 0xe1746d0a, 0x8401bd27> {
  text: string;
}

export interface InputReportReasonCopyright
  extends TLObjectType<"InputReportReasonCopyright", 0x9b89f93a, 0x8401bd27> {}

export interface InputReportReasonGeoIrrelevant
  extends TLObjectType<
    "InputReportReasonGeoIrrelevant",
    0xdbd4feed,
    0x8401bd27
  > {}

export interface UserFull
  extends TLObjectType<"UserFull", 0xedf17c12, 0x1f4661b9> {
  commonChatsCount: number;
  notifySettings: PeerNotifySettings | account_GetNotifySettingsRequest;
  settings: PeerSettings | messages_GetPeerSettingsRequest;
  user:
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest;
  blocked?: boolean;
  phoneCallsAvailable?: boolean;
  phoneCallsPrivate?: boolean;
  canPinMessage?: boolean;
  hasScheduled?: boolean;
  about?: string;
  profilePhoto?: PhotoEmpty | Photo;
  botInfo?: BotInfo;
  pinnedMsgId?: number;
  folderId?: number;
}

export interface Contact
  extends TLObjectType<"Contact", 0xf911c994, 0x83dfdfa4> {
  mutual: boolean;
  userId: number;
}

export interface ImportedContact
  extends TLObjectType<"ImportedContact", 0xd0028438, 0xb545bbda> {
  clientId: bigint;
  userId: number;
}

export interface ContactBlocked
  extends TLObjectType<"ContactBlocked", 0x561bc879, 0xb12d7ac6> {
  date: number;
  userId: number;
}

export interface ContactStatus
  extends TLObjectType<"ContactStatus", 0xd3680c61, 0x68c0d74c> {
  status:
    | UserStatusEmpty
    | UserStatusOnline
    | UserStatusOffline
    | UserStatusRecently
    | UserStatusLastWeek
    | UserStatusLastMonth;
  userId: number;
}

export interface contacts_ContactsNotModified
  extends TLObjectType<
    "contacts_ContactsNotModified",
    0xb74ba9d2,
    0x38be25f6
  > {}

export interface contacts_Contacts
  extends TLObjectType<"contacts_Contacts", 0xeae87e42, 0x38be25f6> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  savedCount: number;
  contacts: Contact[];
}

export interface contacts_ImportedContacts
  extends TLObjectType<"contacts_ImportedContacts", 0x77d01c3b, 0x8172ad93> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  retryContacts: bigint[];
  popularInvites: PopularContact[];
  imported: ImportedContact[];
}

export interface contacts_Blocked
  extends TLObjectType<"contacts_Blocked", 0x1c138d15, 0xffba4f4f> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  blocked: ContactBlocked[];
}

export interface contacts_BlockedSlice
  extends TLObjectType<"contacts_BlockedSlice", 0x900802a1, 0xffba4f4f> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  blocked: ContactBlocked[];
  count: number;
}

export interface messages_Dialogs
  extends TLObjectType<"messages_Dialogs", 0x15ba6c40, 0xe1b52ee> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  messages: (MessageEmpty | Message | MessageService)[];
  dialogs: (Dialog | DialogFolder)[];
}

export interface messages_DialogsSlice
  extends TLObjectType<"messages_DialogsSlice", 0x71e094f3, 0xe1b52ee> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  messages: (MessageEmpty | Message | MessageService)[];
  dialogs: (Dialog | DialogFolder)[];
  count: number;
}

export interface messages_DialogsNotModified
  extends TLObjectType<"messages_DialogsNotModified", 0xf0e3e596, 0xe1b52ee> {
  count: number;
}

export interface messages_Messages
  extends TLObjectType<"messages_Messages", 0x8c718e87, 0xd4b40b5e> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  messages: (MessageEmpty | Message | MessageService)[];
}

export interface messages_MessagesSlice
  extends TLObjectType<"messages_MessagesSlice", 0xc8edce1e, 0xd4b40b5e> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  messages: (MessageEmpty | Message | MessageService)[];
  count: number;
  inexact?: boolean;
  nextRate?: number;
}

export interface messages_ChannelMessages
  extends TLObjectType<"messages_ChannelMessages", 0x99262e37, 0xd4b40b5e> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  messages: (MessageEmpty | Message | MessageService)[];
  count: number;
  pts: number;
  inexact?: boolean;
}

export interface messages_MessagesNotModified
  extends TLObjectType<"messages_MessagesNotModified", 0x74535f21, 0xd4b40b5e> {
  count: number;
}

export interface messages_Chats
  extends TLObjectType<"messages_Chats", 0x64ff9fd5, 0x99d5cb14> {
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
}

export interface messages_ChatsSlice
  extends TLObjectType<"messages_ChatsSlice", 0x9cd81144, 0x99d5cb14> {
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  count: number;
}

export interface messages_ChatFull
  extends TLObjectType<"messages_ChatFull", 0xe5d7d19c, 0x225a5109> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  fullChat: ChatFull | ChannelFull;
}

export interface messages_AffectedHistory
  extends TLObjectType<"messages_AffectedHistory", 0xb45c69d1, 0x2c49c116> {
  offset: number;
  ptsCount: number;
  pts: number;
}

export interface InputMessagesFilterEmpty
  extends TLObjectType<"InputMessagesFilterEmpty", 0x57e2f66c, 0x8a36ec14> {}

export interface InputMessagesFilterPhotos
  extends TLObjectType<"InputMessagesFilterPhotos", 0x9609a51c, 0x8a36ec14> {}

export interface InputMessagesFilterVideo
  extends TLObjectType<"InputMessagesFilterVideo", 0x9fc00e65, 0x8a36ec14> {}

export interface InputMessagesFilterPhotoVideo
  extends TLObjectType<
    "InputMessagesFilterPhotoVideo",
    0x56e9f0e4,
    0x8a36ec14
  > {}

export interface InputMessagesFilterDocument
  extends TLObjectType<"InputMessagesFilterDocument", 0x9eddf188, 0x8a36ec14> {}

export interface InputMessagesFilterUrl
  extends TLObjectType<"InputMessagesFilterUrl", 0x7ef0dd87, 0x8a36ec14> {}

export interface InputMessagesFilterGif
  extends TLObjectType<"InputMessagesFilterGif", 0xffc86587, 0x8a36ec14> {}

export interface InputMessagesFilterVoice
  extends TLObjectType<"InputMessagesFilterVoice", 0x50f5c392, 0x8a36ec14> {}

export interface InputMessagesFilterMusic
  extends TLObjectType<"InputMessagesFilterMusic", 0x3751b49e, 0x8a36ec14> {}

export interface InputMessagesFilterChatPhotos
  extends TLObjectType<
    "InputMessagesFilterChatPhotos",
    0x3a20ecb8,
    0x8a36ec14
  > {}

export interface InputMessagesFilterPhoneCalls
  extends TLObjectType<
    "InputMessagesFilterPhoneCalls",
    0x80c99768,
    0x8a36ec14
  > {
  missed?: boolean;
}

export interface InputMessagesFilterRoundVoice
  extends TLObjectType<
    "InputMessagesFilterRoundVoice",
    0x7a7c17a4,
    0x8a36ec14
  > {}

export interface InputMessagesFilterRoundVideo
  extends TLObjectType<
    "InputMessagesFilterRoundVideo",
    0xb549da53,
    0x8a36ec14
  > {}

export interface InputMessagesFilterMyMentions
  extends TLObjectType<
    "InputMessagesFilterMyMentions",
    0xc1f8e69a,
    0x8a36ec14
  > {}

export interface InputMessagesFilterGeo
  extends TLObjectType<"InputMessagesFilterGeo", 0xe7026d0d, 0x8a36ec14> {}

export interface InputMessagesFilterContacts
  extends TLObjectType<"InputMessagesFilterContacts", 0xe062db83, 0x8a36ec14> {}

export interface UpdateNewMessage
  extends TLObjectType<"UpdateNewMessage", 0x1f2b0afd, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  message: MessageEmpty | Message | MessageService;
}

export interface UpdateMessageID
  extends TLObjectType<"UpdateMessageID", 0x4e90bfd6, 0x9f89304e> {
  id: number;
  randomId?: bigint;
}

export interface UpdateDeleteMessages
  extends TLObjectType<"UpdateDeleteMessages", 0xa20db0e5, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  messages: number[];
}

export interface UpdateUserTyping
  extends TLObjectType<"UpdateUserTyping", 0x5c486927, 0x9f89304e> {
  action:
    | SendMessageTypingAction
    | SendMessageCancelAction
    | SendMessageRecordVideoAction
    | SendMessageUploadVideoAction
    | SendMessageRecordAudioAction
    | SendMessageUploadAudioAction
    | SendMessageUploadPhotoAction
    | SendMessageUploadDocumentAction
    | SendMessageGeoLocationAction
    | SendMessageChooseContactAction
    | SendMessageGamePlayAction
    | SendMessageRecordRoundAction
    | SendMessageUploadRoundAction;
  userId: number;
}

export interface UpdateChatUserTyping
  extends TLObjectType<"UpdateChatUserTyping", 0x9a65ea1f, 0x9f89304e> {
  action:
    | SendMessageTypingAction
    | SendMessageCancelAction
    | SendMessageRecordVideoAction
    | SendMessageUploadVideoAction
    | SendMessageRecordAudioAction
    | SendMessageUploadAudioAction
    | SendMessageUploadPhotoAction
    | SendMessageUploadDocumentAction
    | SendMessageGeoLocationAction
    | SendMessageChooseContactAction
    | SendMessageGamePlayAction
    | SendMessageRecordRoundAction
    | SendMessageUploadRoundAction;
  userId: number;
  chatId: number;
}

export interface UpdateChatParticipants
  extends TLObjectType<"UpdateChatParticipants", 0x07761198, 0x9f89304e> {
  participants: ChatParticipantsForbidden | ChatParticipants;
}

export interface UpdateUserStatus
  extends TLObjectType<"UpdateUserStatus", 0x1bfbd823, 0x9f89304e> {
  status:
    | UserStatusEmpty
    | UserStatusOnline
    | UserStatusOffline
    | UserStatusRecently
    | UserStatusLastWeek
    | UserStatusLastMonth;
  userId: number;
}

export interface UpdateUserName
  extends TLObjectType<"UpdateUserName", 0xa7332b73, 0x9f89304e> {
  username: string;
  lastName: string;
  firstName: string;
  userId: number;
}

export interface UpdateUserPhoto
  extends TLObjectType<"UpdateUserPhoto", 0x95313b0c, 0x9f89304e> {
  previous: boolean;
  photo:
    | UserProfilePhotoEmpty
    | UserProfilePhoto
    | photos_UpdateProfilePhotoRequest;
  date: number;
  userId: number;
}

export interface UpdateNewEncryptedMessage
  extends TLObjectType<"UpdateNewEncryptedMessage", 0x12bcbd9a, 0x9f89304e> {
  qts: number;
  message: EncryptedMessage | EncryptedMessageService;
}

export interface UpdateEncryptedChatTyping
  extends TLObjectType<"UpdateEncryptedChatTyping", 0x1710f156, 0x9f89304e> {
  chatId: number;
}

export interface UpdateEncryption
  extends TLObjectType<"UpdateEncryption", 0xb4a2e88d, 0x9f89304e> {
  date: number;
  chat:
    | EncryptedChatEmpty
    | EncryptedChatWaiting
    | EncryptedChatRequested
    | EncryptedChat
    | EncryptedChatDiscarded
    | messages_RequestEncryptionRequest
    | messages_AcceptEncryptionRequest;
}

export interface UpdateEncryptedMessagesRead
  extends TLObjectType<"UpdateEncryptedMessagesRead", 0x38fe25b7, 0x9f89304e> {
  date: number;
  maxDate: number;
  chatId: number;
}

export interface UpdateChatParticipantAdd
  extends TLObjectType<"UpdateChatParticipantAdd", 0xea4b0e5c, 0x9f89304e> {
  version: number;
  date: number;
  inviterId: number;
  userId: number;
  chatId: number;
}

export interface UpdateChatParticipantDelete
  extends TLObjectType<"UpdateChatParticipantDelete", 0x6e5f8c22, 0x9f89304e> {
  version: number;
  userId: number;
  chatId: number;
}

export interface UpdateDcOptions
  extends TLObjectType<"UpdateDcOptions", 0x8e5e9873, 0x9f89304e> {
  dcOptions: DcOption[];
}

export interface UpdateUserBlocked
  extends TLObjectType<"UpdateUserBlocked", 0x80ece81a, 0x9f89304e> {
  blocked: boolean;
  userId: number;
}

export interface UpdateNotifySettings
  extends TLObjectType<"UpdateNotifySettings", 0xbec268ef, 0x9f89304e> {
  notifySettings: PeerNotifySettings | account_GetNotifySettingsRequest;
  peer: NotifyPeer | NotifyUsers | NotifyChats | NotifyBroadcasts;
}

export interface UpdateServiceNotification
  extends TLObjectType<"UpdateServiceNotification", 0xebe46819, 0x9f89304e> {
  entities: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  media:
    | MessageMediaEmpty
    | MessageMediaPhoto
    | MessageMediaGeo
    | MessageMediaContact
    | MessageMediaUnsupported
    | MessageMediaDocument
    | MessageMediaWebPage
    | MessageMediaVenue
    | MessageMediaGame
    | MessageMediaInvoice
    | MessageMediaGeoLive
    | MessageMediaPoll
    | messages_GetWebPagePreviewRequest
    | messages_UploadMediaRequest;
  message: string;
  type: string;
  popup?: boolean;
  inboxDate?: number;
}

export interface UpdatePrivacy
  extends TLObjectType<"UpdatePrivacy", 0xee3b272a, 0x9f89304e> {
  rules: (
    | PrivacyValueAllowContacts
    | PrivacyValueAllowAll
    | PrivacyValueAllowUsers
    | PrivacyValueDisallowContacts
    | PrivacyValueDisallowAll
    | PrivacyValueDisallowUsers
    | PrivacyValueAllowChatParticipants
    | PrivacyValueDisallowChatParticipants
  )[];
  key:
    | PrivacyKeyStatusTimestamp
    | PrivacyKeyChatInvite
    | PrivacyKeyPhoneCall
    | PrivacyKeyPhoneP2P
    | PrivacyKeyForwards
    | PrivacyKeyProfilePhoto
    | PrivacyKeyPhoneNumber
    | PrivacyKeyAddedByPhone;
}

export interface UpdateUserPhone
  extends TLObjectType<"UpdateUserPhone", 0x12b9417b, 0x9f89304e> {
  phone: string;
  userId: number;
}

export interface UpdateReadHistoryInbox
  extends TLObjectType<"UpdateReadHistoryInbox", 0x9c974fdf, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  stillUnreadCount: number;
  maxId: number;
  peer: PeerUser | PeerChat | PeerChannel;
  folderId?: number;
}

export interface UpdateReadHistoryOutbox
  extends TLObjectType<"UpdateReadHistoryOutbox", 0x2f2f21bf, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  maxId: number;
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface UpdateWebPage
  extends TLObjectType<"UpdateWebPage", 0x7f891213, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  webpage:
    | WebPageEmpty
    | WebPagePending
    | WebPage
    | WebPageNotModified
    | messages_GetWebPageRequest;
}

export interface UpdateReadMessagesContents
  extends TLObjectType<"UpdateReadMessagesContents", 0x68c13933, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  messages: number[];
}

export interface UpdateChannelTooLong
  extends TLObjectType<"UpdateChannelTooLong", 0xeb0467fb, 0x9f89304e> {
  channelId: number;
  pts?: number;
}

export interface UpdateChannel
  extends TLObjectType<"UpdateChannel", 0xb6d45656, 0x9f89304e> {
  channelId: number;
}

export interface UpdateNewChannelMessage
  extends TLObjectType<"UpdateNewChannelMessage", 0x62ba04d9, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  message: MessageEmpty | Message | MessageService;
}

export interface UpdateReadChannelInbox
  extends TLObjectType<"UpdateReadChannelInbox", 0x330b5424, 0x9f89304e> {
  pts: number;
  stillUnreadCount: number;
  maxId: number;
  channelId: number;
  folderId?: number;
}

export interface UpdateDeleteChannelMessages
  extends TLObjectType<"UpdateDeleteChannelMessages", 0xc37521c9, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  messages: number[];
  channelId: number;
}

export interface UpdateChannelMessageViews
  extends TLObjectType<"UpdateChannelMessageViews", 0x98a12b4b, 0x9f89304e> {
  views: number;
  id: number;
  channelId: number;
}

export interface UpdateChatParticipantAdmin
  extends TLObjectType<"UpdateChatParticipantAdmin", 0xb6901959, 0x9f89304e> {
  version: number;
  isAdmin: boolean;
  userId: number;
  chatId: number;
}

export interface UpdateNewStickerSet
  extends TLObjectType<"UpdateNewStickerSet", 0x688a30aa, 0x9f89304e> {
  stickerset:
    | messages_StickerSet
    | messages_GetStickerSetRequest
    | stickers_CreateStickerSetRequest
    | stickers_RemoveStickerFromSetRequest
    | stickers_ChangeStickerPositionRequest
    | stickers_AddStickerToSetRequest;
}

export interface UpdateStickerSetsOrder
  extends TLObjectType<"UpdateStickerSetsOrder", 0x0bb2d201, 0x9f89304e> {
  order: bigint[];
  masks?: boolean;
}

export interface UpdateStickerSets
  extends TLObjectType<"UpdateStickerSets", 0x43ae3dec, 0x9f89304e> {}

export interface UpdateSavedGifs
  extends TLObjectType<"UpdateSavedGifs", 0x9375341e, 0x9f89304e> {}

export interface UpdateBotInlineQuery
  extends TLObjectType<"UpdateBotInlineQuery", 0x54826690, 0x9f89304e> {
  offset: string;
  query: string;
  userId: number;
  queryId: bigint;
  geo?: GeoPointEmpty | GeoPoint;
}

export interface UpdateBotInlineSend
  extends TLObjectType<"UpdateBotInlineSend", 0x0e48f964, 0x9f89304e> {
  id: string;
  query: string;
  userId: number;
  geo?: GeoPointEmpty | GeoPoint;
  msgId?: InputBotInlineMessageID;
}

export interface UpdateEditChannelMessage
  extends TLObjectType<"UpdateEditChannelMessage", 0x1b3f4df7, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  message: MessageEmpty | Message | MessageService;
}

export interface UpdateChannelPinnedMessage
  extends TLObjectType<"UpdateChannelPinnedMessage", 0x98592475, 0x9f89304e> {
  id: number;
  channelId: number;
}

export interface UpdateBotCallbackQuery
  extends TLObjectType<"UpdateBotCallbackQuery", 0xe73547e1, 0x9f89304e> {
  chatInstance: bigint;
  msgId: number;
  peer: PeerUser | PeerChat | PeerChannel;
  userId: number;
  queryId: bigint;
  data?: Uint8Array;
  gameShortName?: string;
}

export interface UpdateEditMessage
  extends TLObjectType<"UpdateEditMessage", 0xe40370a3, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  message: MessageEmpty | Message | MessageService;
}

export interface UpdateInlineBotCallbackQuery
  extends TLObjectType<"UpdateInlineBotCallbackQuery", 0xf9d27a5a, 0x9f89304e> {
  chatInstance: bigint;
  msgId: InputBotInlineMessageID;
  userId: number;
  queryId: bigint;
  data?: Uint8Array;
  gameShortName?: string;
}

export interface UpdateReadChannelOutbox
  extends TLObjectType<"UpdateReadChannelOutbox", 0x25d6c9c7, 0x9f89304e> {
  maxId: number;
  channelId: number;
}

export interface UpdateDraftMessage
  extends TLObjectType<"UpdateDraftMessage", 0xee2bb969, 0x9f89304e> {
  draft: DraftMessageEmpty | DraftMessage;
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface UpdateReadFeaturedStickers
  extends TLObjectType<"UpdateReadFeaturedStickers", 0x571d2742, 0x9f89304e> {}

export interface UpdateRecentStickers
  extends TLObjectType<"UpdateRecentStickers", 0x9a422c20, 0x9f89304e> {}

export interface UpdateConfig
  extends TLObjectType<"UpdateConfig", 0xa229dd06, 0x9f89304e> {}

export interface UpdatePtsChanged
  extends TLObjectType<"UpdatePtsChanged", 0x3354678f, 0x9f89304e> {}

export interface UpdateChannelWebPage
  extends TLObjectType<"UpdateChannelWebPage", 0x40771900, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  webpage:
    | WebPageEmpty
    | WebPagePending
    | WebPage
    | WebPageNotModified
    | messages_GetWebPageRequest;
  channelId: number;
}

export interface UpdateDialogPinned
  extends TLObjectType<"UpdateDialogPinned", 0x6e6fe51c, 0x9f89304e> {
  peer: DialogPeer | DialogPeerFolder;
  pinned?: boolean;
  folderId?: number;
}

export interface UpdatePinnedDialogs
  extends TLObjectType<"UpdatePinnedDialogs", 0xfa0f3ca2, 0x9f89304e> {
  folderId?: number;
  order?: (DialogPeer | DialogPeerFolder)[];
}

export interface UpdateBotWebhookJSON
  extends TLObjectType<"UpdateBotWebhookJSON", 0x8317c0c3, 0x9f89304e> {
  data: DataJSON | bots_SendCustomRequestRequest | phone_GetCallConfigRequest;
}

export interface UpdateBotWebhookJSONQuery
  extends TLObjectType<"UpdateBotWebhookJSONQuery", 0x9b9240a6, 0x9f89304e> {
  timeout: number;
  data: DataJSON | bots_SendCustomRequestRequest | phone_GetCallConfigRequest;
  queryId: bigint;
}

export interface UpdateBotShippingQuery
  extends TLObjectType<"UpdateBotShippingQuery", 0xe0cdc940, 0x9f89304e> {
  shippingAddress: PostAddress;
  payload: Uint8Array;
  userId: number;
  queryId: bigint;
}

export interface UpdateBotPrecheckoutQuery
  extends TLObjectType<"UpdateBotPrecheckoutQuery", 0x5d2f3aa9, 0x9f89304e> {
  totalAmount: bigint;
  currency: string;
  payload: Uint8Array;
  userId: number;
  queryId: bigint;
  info?: PaymentRequestedInfo;
  shippingOptionId?: string;
}

export interface UpdatePhoneCall
  extends TLObjectType<"UpdatePhoneCall", 0xab0f6b1e, 0x9f89304e> {
  phoneCall:
    | PhoneCallEmpty
    | PhoneCallWaiting
    | PhoneCallRequested
    | PhoneCallAccepted
    | PhoneCall
    | PhoneCallDiscarded;
}

export interface UpdateLangPackTooLong
  extends TLObjectType<"UpdateLangPackTooLong", 0x46560264, 0x9f89304e> {
  langCode: string;
}

export interface UpdateLangPack
  extends TLObjectType<"UpdateLangPack", 0x56022f4d, 0x9f89304e> {
  difference:
    | LangPackDifference
    | langpack_GetLangPackRequest
    | langpack_GetDifferenceRequest;
}

export interface UpdateFavedStickers
  extends TLObjectType<"UpdateFavedStickers", 0xe511996d, 0x9f89304e> {}

export interface UpdateChannelReadMessagesContents
  extends TLObjectType<
    "UpdateChannelReadMessagesContents",
    0x89893b45,
    0x9f89304e
  > {
  messages: number[];
  channelId: number;
}

export interface UpdateContactsReset
  extends TLObjectType<"UpdateContactsReset", 0x7084a7be, 0x9f89304e> {}

export interface UpdateChannelAvailableMessages
  extends TLObjectType<
    "UpdateChannelAvailableMessages",
    0x70db6837,
    0x9f89304e
  > {
  availableMinId: number;
  channelId: number;
}

export interface UpdateDialogUnreadMark
  extends TLObjectType<"UpdateDialogUnreadMark", 0xe16459c3, 0x9f89304e> {
  peer: DialogPeer | DialogPeerFolder;
  unread?: boolean;
}

export interface UpdateUserPinnedMessage
  extends TLObjectType<"UpdateUserPinnedMessage", 0x4c43da18, 0x9f89304e> {
  id: number;
  userId: number;
}

export interface UpdateChatPinnedMessage
  extends TLObjectType<"UpdateChatPinnedMessage", 0xe10db349, 0x9f89304e> {
  version: number;
  id: number;
  chatId: number;
}

export interface UpdateMessagePoll
  extends TLObjectType<"UpdateMessagePoll", 0xaca1657b, 0x9f89304e> {
  results: PollResults;
  pollId: bigint;
  poll?: Poll;
}

export interface UpdateChatDefaultBannedRights
  extends TLObjectType<
    "UpdateChatDefaultBannedRights",
    0x54c01850,
    0x9f89304e
  > {
  version: number;
  defaultBannedRights: ChatBannedRights;
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface UpdateFolderPeers
  extends TLObjectType<"UpdateFolderPeers", 0x19360dc0, 0x9f89304e> {
  ptsCount: number;
  pts: number;
  folderPeers: FolderPeer[];
}

export interface UpdatePeerSettings
  extends TLObjectType<"UpdatePeerSettings", 0x6a7e7366, 0x9f89304e> {
  settings: PeerSettings | messages_GetPeerSettingsRequest;
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface UpdatePeerLocated
  extends TLObjectType<"UpdatePeerLocated", 0xb4afcfb0, 0x9f89304e> {
  peers: PeerLocated[];
}

export interface UpdateNewScheduledMessage
  extends TLObjectType<"UpdateNewScheduledMessage", 0x39a51dfb, 0x9f89304e> {
  message: MessageEmpty | Message | MessageService;
}

export interface UpdateDeleteScheduledMessages
  extends TLObjectType<
    "UpdateDeleteScheduledMessages",
    0x90866cee,
    0x9f89304e
  > {
  messages: number[];
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface UpdateTheme
  extends TLObjectType<"UpdateTheme", 0x8216fba3, 0x9f89304e> {
  theme:
    | ThemeDocumentNotModified
    | Theme
    | account_CreateThemeRequest
    | account_UpdateThemeRequest
    | account_GetThemeRequest;
}

export interface updates_State
  extends TLObjectType<"updates_State", 0xa56c2a3e, 0x23df1a01> {
  unreadCount: number;
  seq: number;
  date: number;
  qts: number;
  pts: number;
}

export interface updates_DifferenceEmpty
  extends TLObjectType<"updates_DifferenceEmpty", 0x5d75a138, 0x20482874> {
  seq: number;
  date: number;
}

export interface updates_Difference
  extends TLObjectType<"updates_Difference", 0x00f49ca0, 0x20482874> {
  state: updates_State | updates_GetStateRequest;
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  otherUpdates: (
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
  )[];
  newEncryptedMessages: (EncryptedMessage | EncryptedMessageService)[];
  newMessages: (MessageEmpty | Message | MessageService)[];
}

export interface updates_DifferenceSlice
  extends TLObjectType<"updates_DifferenceSlice", 0xa8fb1981, 0x20482874> {
  intermediateState: updates_State | updates_GetStateRequest;
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  otherUpdates: (
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
  )[];
  newEncryptedMessages: (EncryptedMessage | EncryptedMessageService)[];
  newMessages: (MessageEmpty | Message | MessageService)[];
}

export interface updates_DifferenceTooLong
  extends TLObjectType<"updates_DifferenceTooLong", 0x4afe8f6d, 0x20482874> {
  pts: number;
}

export interface UpdatesTooLong
  extends TLObjectType<"UpdatesTooLong", 0xe317af7e, 0x8af52aac> {}

export interface UpdateShortMessage
  extends TLObjectType<"UpdateShortMessage", 0x914fbf11, 0x8af52aac> {
  date: number;
  ptsCount: number;
  pts: number;
  message: string;
  userId: number;
  id: number;
  out?: boolean;
  mentioned?: boolean;
  mediaUnread?: boolean;
  silent?: boolean;
  fwdFrom?: MessageFwdHeader;
  viaBotId?: number;
  replyToMsgId?: number;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
}

export interface UpdateShortChatMessage
  extends TLObjectType<"UpdateShortChatMessage", 0x16812688, 0x8af52aac> {
  date: number;
  ptsCount: number;
  pts: number;
  message: string;
  chatId: number;
  fromId: number;
  id: number;
  out?: boolean;
  mentioned?: boolean;
  mediaUnread?: boolean;
  silent?: boolean;
  fwdFrom?: MessageFwdHeader;
  viaBotId?: number;
  replyToMsgId?: number;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
}

export interface UpdateShort
  extends TLObjectType<"UpdateShort", 0x78d4dec1, 0x8af52aac> {
  date: number;
  update:
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
    | UpdateTheme;
}

export interface UpdatesCombined
  extends TLObjectType<"UpdatesCombined", 0x725b04c3, 0x8af52aac> {
  seq: number;
  seqStart: number;
  date: number;
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  updates: (
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
  )[];
}

export interface Updates
  extends TLObjectType<"Updates", 0x74ae4240, 0x8af52aac> {
  seq: number;
  date: number;
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  updates: (
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
  )[];
}

export interface UpdateShortSentMessage
  extends TLObjectType<"UpdateShortSentMessage", 0x11f1331c, 0x8af52aac> {
  date: number;
  ptsCount: number;
  pts: number;
  id: number;
  out?: boolean;
  media?:
    | MessageMediaEmpty
    | MessageMediaPhoto
    | MessageMediaGeo
    | MessageMediaContact
    | MessageMediaUnsupported
    | MessageMediaDocument
    | MessageMediaWebPage
    | MessageMediaVenue
    | MessageMediaGame
    | MessageMediaInvoice
    | MessageMediaGeoLive
    | MessageMediaPoll
    | messages_GetWebPagePreviewRequest
    | messages_UploadMediaRequest;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
}

export interface photos_Photos
  extends TLObjectType<"photos_Photos", 0x8dca6aa5, 0x27cfb967> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  photos: (PhotoEmpty | Photo)[];
}

export interface photos_PhotosSlice
  extends TLObjectType<"photos_PhotosSlice", 0x15051f54, 0x27cfb967> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  photos: (PhotoEmpty | Photo)[];
  count: number;
}

export interface photos_Photo
  extends TLObjectType<"photos_Photo", 0x20212ca8, 0xc292bd24> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  photo: PhotoEmpty | Photo;
}

export interface upload_File
  extends TLObjectType<"upload_File", 0x096a18d5, 0x6c9bd728> {
  bytes: Uint8Array;
  mtime: number;
  type:
    | storage_FileUnknown
    | storage_FilePartial
    | storage_FileJpeg
    | storage_FileGif
    | storage_FilePng
    | storage_FilePdf
    | storage_FileMp3
    | storage_FileMov
    | storage_FileMp4
    | storage_FileWebp;
}

export interface upload_FileCdnRedirect
  extends TLObjectType<"upload_FileCdnRedirect", 0xf18cda44, 0x6c9bd728> {
  fileHashes: FileHash[];
  encryptionIv: Uint8Array;
  encryptionKey: Uint8Array;
  fileToken: Uint8Array;
  dcId: number;
}

export interface DcOption
  extends TLObjectType<"DcOption", 0x18b7a10d, 0x9e43e123> {
  port: number;
  ipAddress: string;
  id: number;
  ipv6?: boolean;
  mediaOnly?: boolean;
  tcpoOnly?: boolean;
  cdn?: boolean;
  static?: boolean;
  secret?: Uint8Array;
}

export interface Config extends TLObjectType<"Config", 0x330b4067, 0xd3262a4a> {
  webfileDcId: number;
  messageLengthMax: number;
  captionLengthMax: number;
  meUrlPrefix: string;
  callPacketTimeoutMs: number;
  callConnectTimeoutMs: number;
  callRingTimeoutMs: number;
  callReceiveTimeoutMs: number;
  pinnedInfolderCountMax: number;
  pinnedDialogsCountMax: number;
  channelsReadMediaPeriod: number;
  stickersFavedLimit: number;
  stickersRecentLimit: number;
  ratingEDecay: number;
  revokePmTimeLimit: number;
  revokeTimeLimit: number;
  editTimeLimit: number;
  savedGifsLimit: number;
  pushChatLimit: number;
  pushChatPeriodMs: number;
  notifyDefaultDelayMs: number;
  notifyCloudDelayMs: number;
  onlineCloudTimeoutMs: number;
  offlineIdleTimeoutMs: number;
  offlineBlurTimeoutMs: number;
  onlineUpdatePeriodMs: number;
  forwardedCountMax: number;
  megagroupSizeMax: number;
  chatSizeMax: number;
  dcTxtDomainName: string;
  dcOptions: DcOption[];
  thisDc: number;
  testMode: boolean;
  expires: number;
  date: number;
  phonecallsEnabled?: boolean;
  defaultP2pContacts?: boolean;
  preloadFeaturedStickers?: boolean;
  ignorePhoneEntities?: boolean;
  revokePmInbox?: boolean;
  blockedMode?: boolean;
  pfsEnabled?: boolean;
  tmpSessions?: number;
  autoupdateUrlPrefix?: string;
  gifSearchUsername?: string;
  venueSearchUsername?: string;
  imgSearchUsername?: string;
  staticMapsProvider?: string;
  suggestedLangCode?: string;
  langPackVersion?: number;
  baseLangPackVersion?: number;
}

export interface NearestDc
  extends TLObjectType<"NearestDc", 0x8e1a1775, 0x3877045f> {
  nearestDc: number;
  thisDc: number;
  country: string;
}

export interface help_AppUpdate
  extends TLObjectType<"help_AppUpdate", 0x1da7158f, 0x5897069e> {
  entities: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  text: string;
  version: string;
  id: number;
  canNotSkip?: boolean;
  document?:
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest;
  url?: string;
}

export interface help_NoAppUpdate
  extends TLObjectType<"help_NoAppUpdate", 0xc45a6536, 0x5897069e> {}

export interface help_InviteText
  extends TLObjectType<"help_InviteText", 0x18cb9f78, 0xcf70aa35> {
  message: string;
}

export interface EncryptedChatEmpty
  extends TLObjectType<"EncryptedChatEmpty", 0xab7ec0a0, 0x6d28a37a> {
  id: number;
}

export interface EncryptedChatWaiting
  extends TLObjectType<"EncryptedChatWaiting", 0x3bf703dc, 0x6d28a37a> {
  participantId: number;
  adminId: number;
  date: number;
  accessHash: bigint;
  id: number;
}

export interface EncryptedChatRequested
  extends TLObjectType<"EncryptedChatRequested", 0xc878527e, 0x6d28a37a> {
  gA: Uint8Array;
  participantId: number;
  adminId: number;
  date: number;
  accessHash: bigint;
  id: number;
}

export interface EncryptedChat
  extends TLObjectType<"EncryptedChat", 0xfa56ce36, 0x6d28a37a> {
  keyFingerprint: bigint;
  gAOrB: Uint8Array;
  participantId: number;
  adminId: number;
  date: number;
  accessHash: bigint;
  id: number;
}

export interface EncryptedChatDiscarded
  extends TLObjectType<"EncryptedChatDiscarded", 0x13d6dd27, 0x6d28a37a> {
  id: number;
}

export interface InputEncryptedChat
  extends TLObjectType<"InputEncryptedChat", 0xf141b5e1, 0x6c7606c0> {
  accessHash: bigint;
  chatId: number;
}

export interface EncryptedFileEmpty
  extends TLObjectType<"EncryptedFileEmpty", 0xc21f497e, 0x842a67c0> {}

export interface EncryptedFile
  extends TLObjectType<"EncryptedFile", 0x4a70994c, 0x842a67c0> {
  keyFingerprint: number;
  dcId: number;
  size: number;
  accessHash: bigint;
  id: bigint;
}

export interface InputEncryptedFileEmpty
  extends TLObjectType<"InputEncryptedFileEmpty", 0x1837c364, 0x8574c27a> {}

export interface InputEncryptedFileUploaded
  extends TLObjectType<"InputEncryptedFileUploaded", 0x64bd0306, 0x8574c27a> {
  keyFingerprint: number;
  md5Checksum: string;
  parts: number;
  id: bigint;
}

export interface InputEncryptedFile
  extends TLObjectType<"InputEncryptedFile", 0x5a17b5e5, 0x8574c27a> {
  accessHash: bigint;
  id: bigint;
}

export interface InputEncryptedFileBigUploaded
  extends TLObjectType<
    "InputEncryptedFileBigUploaded",
    0x2dc173c8,
    0x8574c27a
  > {
  keyFingerprint: number;
  parts: number;
  id: bigint;
}

export interface EncryptedMessage
  extends TLObjectType<"EncryptedMessage", 0xed18c118, 0x239f2e51> {
  file:
    | EncryptedFileEmpty
    | EncryptedFile
    | messages_UploadEncryptedFileRequest;
  bytes: Uint8Array;
  date: number;
  chatId: number;
  randomId?: bigint;
}

export interface EncryptedMessageService
  extends TLObjectType<"EncryptedMessageService", 0x23734b06, 0x239f2e51> {
  bytes: Uint8Array;
  date: number;
  chatId: number;
  randomId?: bigint;
}

export interface messages_DhConfigNotModified
  extends TLObjectType<"messages_DhConfigNotModified", 0xc0e24635, 0xe488ed8b> {
  random: Uint8Array;
}

export interface messages_DhConfig
  extends TLObjectType<"messages_DhConfig", 0x2c221edd, 0xe488ed8b> {
  random: Uint8Array;
  version: number;
  p: Uint8Array;
  g: number;
}

export interface messages_SentEncryptedMessage
  extends TLObjectType<
    "messages_SentEncryptedMessage",
    0x560f8935,
    0xc99e3e50
  > {
  date: number;
}

export interface messages_SentEncryptedFile
  extends TLObjectType<"messages_SentEncryptedFile", 0x9493ff32, 0xc99e3e50> {
  file:
    | EncryptedFileEmpty
    | EncryptedFile
    | messages_UploadEncryptedFileRequest;
  date: number;
}

export interface InputDocumentEmpty
  extends TLObjectType<"InputDocumentEmpty", 0x72f0eaae, 0xf33fdb68> {}

export interface InputDocument
  extends TLObjectType<"InputDocument", 0x1abfb575, 0xf33fdb68> {
  fileReference: Uint8Array;
  accessHash: bigint;
  id: bigint;
}

export interface DocumentEmpty
  extends TLObjectType<"DocumentEmpty", 0x36f8c871, 0x211fe820> {
  id: bigint;
}

export interface Document
  extends TLObjectType<"Document", 0x9ba29cc1, 0x211fe820> {
  attributes: (
    | DocumentAttributeImageSize
    | DocumentAttributeAnimated
    | DocumentAttributeSticker
    | DocumentAttributeVideo
    | DocumentAttributeAudio
    | DocumentAttributeFilename
    | DocumentAttributeHasStickers
  )[];
  dcId: number;
  size: number;
  mimeType: string;
  date: number;
  fileReference: Uint8Array;
  accessHash: bigint;
  id: bigint;
  thumbs?: (PhotoSizeEmpty | PhotoSize | PhotoCachedSize | PhotoStrippedSize)[];
}

export interface help_Support
  extends TLObjectType<"help_Support", 0x17c6b5f6, 0x7159bceb> {
  user:
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest;
  phoneNumber: string;
}

export interface NotifyPeer
  extends TLObjectType<"NotifyPeer", 0x9fd40bd8, 0xdfe8602e> {
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface NotifyUsers
  extends TLObjectType<"NotifyUsers", 0xb4c83b4c, 0xdfe8602e> {}

export interface NotifyChats
  extends TLObjectType<"NotifyChats", 0xc007cec3, 0xdfe8602e> {}

export interface NotifyBroadcasts
  extends TLObjectType<"NotifyBroadcasts", 0xd612e8ef, 0xdfe8602e> {}

export interface SendMessageTypingAction
  extends TLObjectType<"SendMessageTypingAction", 0x16bf744e, 0x20b2cc21> {}

export interface SendMessageCancelAction
  extends TLObjectType<"SendMessageCancelAction", 0xfd5ec8f5, 0x20b2cc21> {}

export interface SendMessageRecordVideoAction
  extends TLObjectType<
    "SendMessageRecordVideoAction",
    0xa187d66f,
    0x20b2cc21
  > {}

export interface SendMessageUploadVideoAction
  extends TLObjectType<"SendMessageUploadVideoAction", 0xe9763aec, 0x20b2cc21> {
  progress: number;
}

export interface SendMessageRecordAudioAction
  extends TLObjectType<
    "SendMessageRecordAudioAction",
    0xd52f73f7,
    0x20b2cc21
  > {}

export interface SendMessageUploadAudioAction
  extends TLObjectType<"SendMessageUploadAudioAction", 0xf351d7ab, 0x20b2cc21> {
  progress: number;
}

export interface SendMessageUploadPhotoAction
  extends TLObjectType<"SendMessageUploadPhotoAction", 0xd1d34a26, 0x20b2cc21> {
  progress: number;
}

export interface SendMessageUploadDocumentAction
  extends TLObjectType<
    "SendMessageUploadDocumentAction",
    0xaa0cd9e4,
    0x20b2cc21
  > {
  progress: number;
}

export interface SendMessageGeoLocationAction
  extends TLObjectType<
    "SendMessageGeoLocationAction",
    0x176f8ba1,
    0x20b2cc21
  > {}

export interface SendMessageChooseContactAction
  extends TLObjectType<
    "SendMessageChooseContactAction",
    0x628cbc6f,
    0x20b2cc21
  > {}

export interface SendMessageGamePlayAction
  extends TLObjectType<"SendMessageGamePlayAction", 0xdd6a8f48, 0x20b2cc21> {}

export interface SendMessageRecordRoundAction
  extends TLObjectType<
    "SendMessageRecordRoundAction",
    0x88f27fbc,
    0x20b2cc21
  > {}

export interface SendMessageUploadRoundAction
  extends TLObjectType<"SendMessageUploadRoundAction", 0x243e1c66, 0x20b2cc21> {
  progress: number;
}

export interface contacts_Found
  extends TLObjectType<"contacts_Found", 0xb3134d9d, 0x4386a2e3> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  results: (PeerUser | PeerChat | PeerChannel)[];
  myResults: (PeerUser | PeerChat | PeerChannel)[];
}

export interface InputPrivacyKeyStatusTimestamp
  extends TLObjectType<
    "InputPrivacyKeyStatusTimestamp",
    0x4f96cb18,
    0x53627f8
  > {}

export interface InputPrivacyKeyChatInvite
  extends TLObjectType<"InputPrivacyKeyChatInvite", 0xbdfb0426, 0x53627f8> {}

export interface InputPrivacyKeyPhoneCall
  extends TLObjectType<"InputPrivacyKeyPhoneCall", 0xfabadc5f, 0x53627f8> {}

export interface InputPrivacyKeyPhoneP2P
  extends TLObjectType<"InputPrivacyKeyPhoneP2P", 0xdb9e70d2, 0x53627f8> {}

export interface InputPrivacyKeyForwards
  extends TLObjectType<"InputPrivacyKeyForwards", 0xa4dd4c08, 0x53627f8> {}

export interface InputPrivacyKeyProfilePhoto
  extends TLObjectType<"InputPrivacyKeyProfilePhoto", 0x5719bacc, 0x53627f8> {}

export interface InputPrivacyKeyPhoneNumber
  extends TLObjectType<"InputPrivacyKeyPhoneNumber", 0x0352dafa, 0x53627f8> {}

export interface InputPrivacyKeyAddedByPhone
  extends TLObjectType<"InputPrivacyKeyAddedByPhone", 0xd1219bdd, 0x53627f8> {}

export interface PrivacyKeyStatusTimestamp
  extends TLObjectType<"PrivacyKeyStatusTimestamp", 0xbc2eab30, 0x824651c3> {}

export interface PrivacyKeyChatInvite
  extends TLObjectType<"PrivacyKeyChatInvite", 0x500e6dfa, 0x824651c3> {}

export interface PrivacyKeyPhoneCall
  extends TLObjectType<"PrivacyKeyPhoneCall", 0x3d662b7b, 0x824651c3> {}

export interface PrivacyKeyPhoneP2P
  extends TLObjectType<"PrivacyKeyPhoneP2P", 0x39491cc8, 0x824651c3> {}

export interface PrivacyKeyForwards
  extends TLObjectType<"PrivacyKeyForwards", 0x69ec56a3, 0x824651c3> {}

export interface PrivacyKeyProfilePhoto
  extends TLObjectType<"PrivacyKeyProfilePhoto", 0x96151fed, 0x824651c3> {}

export interface PrivacyKeyPhoneNumber
  extends TLObjectType<"PrivacyKeyPhoneNumber", 0xd19ae46d, 0x824651c3> {}

export interface PrivacyKeyAddedByPhone
  extends TLObjectType<"PrivacyKeyAddedByPhone", 0x42ffd42b, 0x824651c3> {}

export interface InputPrivacyValueAllowContacts
  extends TLObjectType<
    "InputPrivacyValueAllowContacts",
    0x0d09e07b,
    0x5a3b6b22
  > {}

export interface InputPrivacyValueAllowAll
  extends TLObjectType<"InputPrivacyValueAllowAll", 0x184b35ce, 0x5a3b6b22> {}

export interface InputPrivacyValueAllowUsers
  extends TLObjectType<"InputPrivacyValueAllowUsers", 0x131cc67f, 0x5a3b6b22> {
  users: (InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage)[];
}

export interface InputPrivacyValueDisallowContacts
  extends TLObjectType<
    "InputPrivacyValueDisallowContacts",
    0x0ba52007,
    0x5a3b6b22
  > {}

export interface InputPrivacyValueDisallowAll
  extends TLObjectType<
    "InputPrivacyValueDisallowAll",
    0xd66b66c9,
    0x5a3b6b22
  > {}

export interface InputPrivacyValueDisallowUsers
  extends TLObjectType<
    "InputPrivacyValueDisallowUsers",
    0x90110467,
    0x5a3b6b22
  > {
  users: (InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage)[];
}

export interface InputPrivacyValueAllowChatParticipants
  extends TLObjectType<
    "InputPrivacyValueAllowChatParticipants",
    0x4c81c1ba,
    0x5a3b6b22
  > {
  chats: number[];
}

export interface InputPrivacyValueDisallowChatParticipants
  extends TLObjectType<
    "InputPrivacyValueDisallowChatParticipants",
    0xd82363af,
    0x5a3b6b22
  > {
  chats: number[];
}

export interface PrivacyValueAllowContacts
  extends TLObjectType<"PrivacyValueAllowContacts", 0xfffe1bac, 0xebb7f270> {}

export interface PrivacyValueAllowAll
  extends TLObjectType<"PrivacyValueAllowAll", 0x65427b82, 0xebb7f270> {}

export interface PrivacyValueAllowUsers
  extends TLObjectType<"PrivacyValueAllowUsers", 0x4d5bbe0c, 0xebb7f270> {
  users: number[];
}

export interface PrivacyValueDisallowContacts
  extends TLObjectType<
    "PrivacyValueDisallowContacts",
    0xf888fa1a,
    0xebb7f270
  > {}

export interface PrivacyValueDisallowAll
  extends TLObjectType<"PrivacyValueDisallowAll", 0x8b73e763, 0xebb7f270> {}

export interface PrivacyValueDisallowUsers
  extends TLObjectType<"PrivacyValueDisallowUsers", 0x0c7f49b7, 0xebb7f270> {
  users: number[];
}

export interface PrivacyValueAllowChatParticipants
  extends TLObjectType<
    "PrivacyValueAllowChatParticipants",
    0x18be796b,
    0xebb7f270
  > {
  chats: number[];
}

export interface PrivacyValueDisallowChatParticipants
  extends TLObjectType<
    "PrivacyValueDisallowChatParticipants",
    0xacae0690,
    0xebb7f270
  > {
  chats: number[];
}

export interface account_PrivacyRules
  extends TLObjectType<"account_PrivacyRules", 0x50a04e45, 0xb55aba82> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  rules: (
    | PrivacyValueAllowContacts
    | PrivacyValueAllowAll
    | PrivacyValueAllowUsers
    | PrivacyValueDisallowContacts
    | PrivacyValueDisallowAll
    | PrivacyValueDisallowUsers
    | PrivacyValueAllowChatParticipants
    | PrivacyValueDisallowChatParticipants
  )[];
}

export interface AccountDaysTTL
  extends TLObjectType<"AccountDaysTTL", 0xb8d0afdf, 0xbaa39d88> {
  days: number;
}

export interface DocumentAttributeImageSize
  extends TLObjectType<"DocumentAttributeImageSize", 0x6c37c15c, 0xf729eb9b> {
  h: number;
  w: number;
}

export interface DocumentAttributeAnimated
  extends TLObjectType<"DocumentAttributeAnimated", 0x11b58939, 0xf729eb9b> {}

export interface DocumentAttributeSticker
  extends TLObjectType<"DocumentAttributeSticker", 0x6319d612, 0xf729eb9b> {
  stickerset:
    | InputStickerSetEmpty
    | InputStickerSetID
    | InputStickerSetShortName
    | InputStickerSetAnimatedEmoji;
  alt: string;
  mask?: boolean;
  maskCoords?: MaskCoords;
}

export interface DocumentAttributeVideo
  extends TLObjectType<"DocumentAttributeVideo", 0x0ef02ce6, 0xf729eb9b> {
  h: number;
  w: number;
  duration: number;
  roundMessage?: boolean;
  supportsStreaming?: boolean;
}

export interface DocumentAttributeAudio
  extends TLObjectType<"DocumentAttributeAudio", 0x9852f9c6, 0xf729eb9b> {
  duration: number;
  voice?: boolean;
  title?: string;
  performer?: string;
  waveform?: Uint8Array;
}

export interface DocumentAttributeFilename
  extends TLObjectType<"DocumentAttributeFilename", 0x15590068, 0xf729eb9b> {
  fileName: string;
}

export interface DocumentAttributeHasStickers
  extends TLObjectType<
    "DocumentAttributeHasStickers",
    0x9801d2f7,
    0xf729eb9b
  > {}

export interface messages_StickersNotModified
  extends TLObjectType<
    "messages_StickersNotModified",
    0xf1749a22,
    0xd73bb9de
  > {}

export interface messages_Stickers
  extends TLObjectType<"messages_Stickers", 0xe4599bbd, 0xd73bb9de> {
  stickers: (
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest
  )[];
  hash: number;
}

export interface StickerPack
  extends TLObjectType<"StickerPack", 0x12b299d4, 0x9fefa4d4> {
  documents: bigint[];
  emoticon: string;
}

export interface messages_AllStickersNotModified
  extends TLObjectType<
    "messages_AllStickersNotModified",
    0xe86602c3,
    0x45834829
  > {}

export interface messages_AllStickers
  extends TLObjectType<"messages_AllStickers", 0xedfd405f, 0x45834829> {
  sets: StickerSet[];
  hash: number;
}

export interface messages_AffectedMessages
  extends TLObjectType<"messages_AffectedMessages", 0x84d19185, 0xced3c06e> {
  ptsCount: number;
  pts: number;
}

export interface WebPageEmpty
  extends TLObjectType<"WebPageEmpty", 0xeb1477e8, 0x55a97481> {
  id: bigint;
}

export interface WebPagePending
  extends TLObjectType<"WebPagePending", 0xc586da1c, 0x55a97481> {
  date: number;
  id: bigint;
}

export interface WebPage
  extends TLObjectType<"WebPage", 0xfa64e172, 0x55a97481> {
  hash: number;
  displayUrl: string;
  url: string;
  id: bigint;
  type?: string;
  siteName?: string;
  title?: string;
  description?: string;
  photo?: PhotoEmpty | Photo;
  embedUrl?: string;
  embedType?: string;
  embedWidth?: number;
  embedHeight?: number;
  duration?: number;
  author?: string;
  document?:
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest;
  documents?: (
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest
  )[];
  cachedPage?: Page;
}

export interface WebPageNotModified
  extends TLObjectType<"WebPageNotModified", 0x85849473, 0x55a97481> {}

export interface Authorization
  extends TLObjectType<"Authorization", 0xad01d61d, 0xc913c01a> {
  region: string;
  country: string;
  ip: string;
  dateActive: number;
  dateCreated: number;
  appVersion: string;
  appName: string;
  apiId: number;
  systemVersion: string;
  platform: string;
  deviceModel: string;
  hash: bigint;
  current?: boolean;
  officialApp?: boolean;
  passwordPending?: boolean;
}

export interface account_Authorizations
  extends TLObjectType<"account_Authorizations", 0x1250abde, 0xbf5e0ff> {
  authorizations: Authorization[];
}

export interface account_Password
  extends TLObjectType<"account_Password", 0xad2641f8, 0x53a211a3> {
  secureRandom: Uint8Array;
  newSecureAlgo:
    | SecurePasswordKdfAlgoUnknown
    | SecurePasswordKdfAlgoPBKDF2HMACSHA512iter100000
    | SecurePasswordKdfAlgoSHA512;
  newAlgo:
    | PasswordKdfAlgoUnknown
    | PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow;
  hasRecovery?: boolean;
  hasSecureValues?: boolean;
  hasPassword?: boolean;
  currentAlgo?:
    | PasswordKdfAlgoUnknown
    | PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow;
  srp_B?: Uint8Array;
  srpId?: bigint;
  hint?: string;
  emailUnconfirmedPattern?: string;
}

export interface account_PasswordSettings
  extends TLObjectType<"account_PasswordSettings", 0x9a5c33e5, 0xd23fb078> {
  email?: string;
  secureSettings?: SecureSecretSettings;
}

export interface account_PasswordInputSettings
  extends TLObjectType<"account_PasswordInputSettings", 0xc23727c9, 0xc426ca6> {
  newAlgo?:
    | PasswordKdfAlgoUnknown
    | PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow;
  newPasswordHash?: Uint8Array;
  hint?: string;
  email?: string;
  newSecureSettings?: SecureSecretSettings;
}

export interface auth_PasswordRecovery
  extends TLObjectType<"auth_PasswordRecovery", 0x137948a5, 0xfa72d43a> {
  emailPattern: string;
}

export interface ReceivedNotifyMessage
  extends TLObjectType<"ReceivedNotifyMessage", 0xa384b779, 0xa962381e> {
  flags: number;
  id: number;
}

export interface ChatInviteEmpty
  extends TLObjectType<"ChatInviteEmpty", 0x69df3769, 0xb4748a58> {}

export interface ChatInviteExported
  extends TLObjectType<"ChatInviteExported", 0xfc2e05bc, 0xb4748a58> {
  link: string;
}

export interface ChatInviteAlready
  extends TLObjectType<"ChatInviteAlready", 0x5a686d7c, 0x4561736> {
  chat: ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden;
}

export interface ChatInvite
  extends TLObjectType<"ChatInvite", 0xdfc2f58e, 0x4561736> {
  participantsCount: number;
  photo: PhotoEmpty | Photo;
  title: string;
  channel?: boolean;
  broadcast?: boolean;
  public?: boolean;
  megagroup?: boolean;
  participants?: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
}

export interface InputStickerSetEmpty
  extends TLObjectType<"InputStickerSetEmpty", 0xffb62b95, 0x3da389aa> {}

export interface InputStickerSetID
  extends TLObjectType<"InputStickerSetID", 0x9de7a269, 0x3da389aa> {
  accessHash: bigint;
  id: bigint;
}

export interface InputStickerSetShortName
  extends TLObjectType<"InputStickerSetShortName", 0x861cc8a0, 0x3da389aa> {
  shortName: string;
}

export interface InputStickerSetAnimatedEmoji
  extends TLObjectType<
    "InputStickerSetAnimatedEmoji",
    0x028703c8,
    0x3da389aa
  > {}

export interface StickerSet
  extends TLObjectType<"StickerSet", 0xeeb46f27, 0xbad3ff91> {
  hash: number;
  count: number;
  shortName: string;
  title: string;
  accessHash: bigint;
  id: bigint;
  archived?: boolean;
  official?: boolean;
  masks?: boolean;
  animated?: boolean;
  installedDate?: number;
  thumb?: PhotoSizeEmpty | PhotoSize | PhotoCachedSize | PhotoStrippedSize;
  thumbDcId?: number;
}

export interface messages_StickerSet
  extends TLObjectType<"messages_StickerSet", 0xb60a24a6, 0x9b704a5a> {
  documents: (
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest
  )[];
  packs: StickerPack[];
  set: StickerSet;
}

export interface BotCommand
  extends TLObjectType<"BotCommand", 0xc27ac8c7, 0xe1e62c2> {
  description: string;
  command: string;
}

export interface BotInfo
  extends TLObjectType<"BotInfo", 0x98e81d3a, 0xf1f701db> {
  commands: BotCommand[];
  description: string;
  userId: number;
}

export interface KeyboardButton
  extends TLObjectType<"KeyboardButton", 0xa2fa4880, 0xbad74a3> {
  text: string;
}

export interface KeyboardButtonUrl
  extends TLObjectType<"KeyboardButtonUrl", 0x258aff05, 0xbad74a3> {
  url: string;
  text: string;
}

export interface KeyboardButtonCallback
  extends TLObjectType<"KeyboardButtonCallback", 0x683a5e46, 0xbad74a3> {
  data: Uint8Array;
  text: string;
}

export interface KeyboardButtonRequestPhone
  extends TLObjectType<"KeyboardButtonRequestPhone", 0xb16a6c29, 0xbad74a3> {
  text: string;
}

export interface KeyboardButtonRequestGeoLocation
  extends TLObjectType<
    "KeyboardButtonRequestGeoLocation",
    0xfc796b3f,
    0xbad74a3
  > {
  text: string;
}

export interface KeyboardButtonSwitchInline
  extends TLObjectType<"KeyboardButtonSwitchInline", 0x0568a748, 0xbad74a3> {
  query: string;
  text: string;
  samePeer?: boolean;
}

export interface KeyboardButtonGame
  extends TLObjectType<"KeyboardButtonGame", 0x50f41ccf, 0xbad74a3> {
  text: string;
}

export interface KeyboardButtonBuy
  extends TLObjectType<"KeyboardButtonBuy", 0xafd93fbb, 0xbad74a3> {
  text: string;
}

export interface KeyboardButtonUrlAuth
  extends TLObjectType<"KeyboardButtonUrlAuth", 0x10b78d29, 0xbad74a3> {
  buttonId: number;
  url: string;
  text: string;
  fwdText?: string;
}

export interface InputKeyboardButtonUrlAuth
  extends TLObjectType<"InputKeyboardButtonUrlAuth", 0xd02e7fd4, 0xbad74a3> {
  bot: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  url: string;
  text: string;
  requestWriteAccess?: boolean;
  fwdText?: string;
}

export interface KeyboardButtonRow
  extends TLObjectType<"KeyboardButtonRow", 0x77608b83, 0x847730ae> {
  buttons: (
    | KeyboardButton
    | KeyboardButtonUrl
    | KeyboardButtonCallback
    | KeyboardButtonRequestPhone
    | KeyboardButtonRequestGeoLocation
    | KeyboardButtonSwitchInline
    | KeyboardButtonGame
    | KeyboardButtonBuy
    | KeyboardButtonUrlAuth
    | InputKeyboardButtonUrlAuth
  )[];
}

export interface ReplyKeyboardHide
  extends TLObjectType<"ReplyKeyboardHide", 0xa03e5b85, 0xe2e10ef2> {
  selective?: boolean;
}

export interface ReplyKeyboardForceReply
  extends TLObjectType<"ReplyKeyboardForceReply", 0xf4108aa0, 0xe2e10ef2> {
  singleUse?: boolean;
  selective?: boolean;
}

export interface ReplyKeyboardMarkup
  extends TLObjectType<"ReplyKeyboardMarkup", 0x3502758c, 0xe2e10ef2> {
  rows: KeyboardButtonRow[];
  resize?: boolean;
  singleUse?: boolean;
  selective?: boolean;
}

export interface ReplyInlineMarkup
  extends TLObjectType<"ReplyInlineMarkup", 0x48a30254, 0xe2e10ef2> {
  rows: KeyboardButtonRow[];
}

export interface MessageEntityUnknown
  extends TLObjectType<"MessageEntityUnknown", 0xbb92ba95, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityMention
  extends TLObjectType<"MessageEntityMention", 0xfa04579d, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityHashtag
  extends TLObjectType<"MessageEntityHashtag", 0x6f635b0d, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityBotCommand
  extends TLObjectType<"MessageEntityBotCommand", 0x6cef8ac7, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityUrl
  extends TLObjectType<"MessageEntityUrl", 0x6ed02538, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityEmail
  extends TLObjectType<"MessageEntityEmail", 0x64e475c2, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityBold
  extends TLObjectType<"MessageEntityBold", 0xbd610bc9, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityItalic
  extends TLObjectType<"MessageEntityItalic", 0x826f8b60, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityCode
  extends TLObjectType<"MessageEntityCode", 0x28a20571, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityPre
  extends TLObjectType<"MessageEntityPre", 0x73924be0, 0xcf6419dc> {
  language: string;
  length: number;
  offset: number;
}

export interface MessageEntityTextUrl
  extends TLObjectType<"MessageEntityTextUrl", 0x76a6d327, 0xcf6419dc> {
  url: string;
  length: number;
  offset: number;
}

export interface MessageEntityMentionName
  extends TLObjectType<"MessageEntityMentionName", 0x352dca58, 0xcf6419dc> {
  userId: number;
  length: number;
  offset: number;
}

export interface InputMessageEntityMentionName
  extends TLObjectType<
    "InputMessageEntityMentionName",
    0x208e68c9,
    0xcf6419dc
  > {
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  length: number;
  offset: number;
}

export interface MessageEntityPhone
  extends TLObjectType<"MessageEntityPhone", 0x9b69e34b, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityCashtag
  extends TLObjectType<"MessageEntityCashtag", 0x4c4e743f, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityUnderline
  extends TLObjectType<"MessageEntityUnderline", 0x9c4e7e8b, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityStrike
  extends TLObjectType<"MessageEntityStrike", 0xbf0693d4, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface MessageEntityBlockquote
  extends TLObjectType<"MessageEntityBlockquote", 0x020df5d0, 0xcf6419dc> {
  length: number;
  offset: number;
}

export interface InputChannelEmpty
  extends TLObjectType<"InputChannelEmpty", 0xee8c1e86, 0x40f202fd> {}

export interface InputChannel
  extends TLObjectType<"InputChannel", 0xafeb712e, 0x40f202fd> {
  accessHash: bigint;
  channelId: number;
}

export interface InputChannelFromMessage
  extends TLObjectType<"InputChannelFromMessage", 0x2a286531, 0x40f202fd> {
  channelId: number;
  msgId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface contacts_ResolvedPeer
  extends TLObjectType<"contacts_ResolvedPeer", 0x7f077ad9, 0xf065b3a8> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface MessageRange
  extends TLObjectType<"MessageRange", 0x0ae30253, 0xbec74577> {
  maxId: number;
  minId: number;
}

export interface updates_ChannelDifferenceEmpty
  extends TLObjectType<
    "updates_ChannelDifferenceEmpty",
    0x3e11affb,
    0x29896f5d
  > {
  pts: number;
  final?: boolean;
  timeout?: number;
}

export interface updates_ChannelDifferenceTooLong
  extends TLObjectType<
    "updates_ChannelDifferenceTooLong",
    0xa4bcc6fe,
    0x29896f5d
  > {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  messages: (MessageEmpty | Message | MessageService)[];
  dialog: Dialog | DialogFolder;
  final?: boolean;
  timeout?: number;
}

export interface updates_ChannelDifference
  extends TLObjectType<"updates_ChannelDifference", 0x2064674e, 0x29896f5d> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  otherUpdates: (
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
  )[];
  newMessages: (MessageEmpty | Message | MessageService)[];
  pts: number;
  final?: boolean;
  timeout?: number;
}

export interface ChannelMessagesFilterEmpty
  extends TLObjectType<"ChannelMessagesFilterEmpty", 0x94d42ee7, 0x13336a56> {}

export interface ChannelMessagesFilter
  extends TLObjectType<"ChannelMessagesFilter", 0xcd77d957, 0x13336a56> {
  ranges: MessageRange[];
  excludeNewMessages?: boolean;
}

export interface ChannelParticipant
  extends TLObjectType<"ChannelParticipant", 0x15ebac1d, 0xd9c7fc18> {
  date: number;
  userId: number;
}

export interface ChannelParticipantSelf
  extends TLObjectType<"ChannelParticipantSelf", 0xa3289a6d, 0xd9c7fc18> {
  date: number;
  inviterId: number;
  userId: number;
}

export interface ChannelParticipantCreator
  extends TLObjectType<"ChannelParticipantCreator", 0x808d15a4, 0xd9c7fc18> {
  userId: number;
  rank?: string;
}

export interface ChannelParticipantAdmin
  extends TLObjectType<"ChannelParticipantAdmin", 0xccbebbaf, 0xd9c7fc18> {
  adminRights: ChatAdminRights;
  date: number;
  promotedBy: number;
  userId: number;
  canEdit?: boolean;
  isSelf?: boolean;
  inviterId?: number;
  rank?: string;
}

export interface ChannelParticipantBanned
  extends TLObjectType<"ChannelParticipantBanned", 0x1c0facaf, 0xd9c7fc18> {
  bannedRights: ChatBannedRights;
  date: number;
  kickedBy: number;
  userId: number;
  left?: boolean;
}

export interface ChannelParticipantsRecent
  extends TLObjectType<"ChannelParticipantsRecent", 0xde3f3c79, 0xbf4e2753> {}

export interface ChannelParticipantsAdmins
  extends TLObjectType<"ChannelParticipantsAdmins", 0xb4608969, 0xbf4e2753> {}

export interface ChannelParticipantsKicked
  extends TLObjectType<"ChannelParticipantsKicked", 0xa3b54985, 0xbf4e2753> {
  q: string;
}

export interface ChannelParticipantsBots
  extends TLObjectType<"ChannelParticipantsBots", 0xb0d1865b, 0xbf4e2753> {}

export interface ChannelParticipantsBanned
  extends TLObjectType<"ChannelParticipantsBanned", 0x1427a5e1, 0xbf4e2753> {
  q: string;
}

export interface ChannelParticipantsSearch
  extends TLObjectType<"ChannelParticipantsSearch", 0x0656ac4b, 0xbf4e2753> {
  q: string;
}

export interface ChannelParticipantsContacts
  extends TLObjectType<"ChannelParticipantsContacts", 0xbb6ae88d, 0xbf4e2753> {
  q: string;
}

export interface channels_ChannelParticipants
  extends TLObjectType<"channels_ChannelParticipants", 0xf56ee2a8, 0xe60a6e64> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  participants: (
    | ChannelParticipant
    | ChannelParticipantSelf
    | ChannelParticipantCreator
    | ChannelParticipantAdmin
    | ChannelParticipantBanned
  )[];
  count: number;
}

export interface channels_ChannelParticipantsNotModified
  extends TLObjectType<
    "channels_ChannelParticipantsNotModified",
    0xf0173fe9,
    0xe60a6e64
  > {}

export interface channels_ChannelParticipant
  extends TLObjectType<"channels_ChannelParticipant", 0xd0d9b163, 0x6658151a> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  participant:
    | ChannelParticipant
    | ChannelParticipantSelf
    | ChannelParticipantCreator
    | ChannelParticipantAdmin
    | ChannelParticipantBanned;
}

export interface help_TermsOfService
  extends TLObjectType<"help_TermsOfService", 0x780a0310, 0x20ee8312> {
  entities: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  text: string;
  id: DataJSON | bots_SendCustomRequestRequest | phone_GetCallConfigRequest;
  popup?: boolean;
  minAgeConfirm?: number;
}

export interface FoundGif
  extends TLObjectType<"FoundGif", 0x162ecc1f, 0x5bbc92c3> {
  h: number;
  w: number;
  contentType: string;
  contentUrl: string;
  thumbUrl: string;
  url: string;
}

export interface FoundGifCached
  extends TLObjectType<"FoundGifCached", 0x9c750409, 0x5bbc92c3> {
  document:
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest;
  photo: PhotoEmpty | Photo;
  url: string;
}

export interface messages_FoundGifs
  extends TLObjectType<"messages_FoundGifs", 0x450a1c0a, 0xe799ea7> {
  results: (FoundGif | FoundGifCached)[];
  nextOffset: number;
}

export interface messages_SavedGifsNotModified
  extends TLObjectType<
    "messages_SavedGifsNotModified",
    0xe8025ca2,
    0xa68b61f5
  > {}

export interface messages_SavedGifs
  extends TLObjectType<"messages_SavedGifs", 0x2e0709a5, 0xa68b61f5> {
  gifs: (
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest
  )[];
  hash: number;
}

export interface InputBotInlineMessageMediaAuto
  extends TLObjectType<
    "InputBotInlineMessageMediaAuto",
    0x3380c786,
    0x53fb4010
  > {
  message: string;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface InputBotInlineMessageText
  extends TLObjectType<"InputBotInlineMessageText", 0x3dcd7a87, 0x53fb4010> {
  message: string;
  noWebpage?: boolean;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface InputBotInlineMessageMediaGeo
  extends TLObjectType<
    "InputBotInlineMessageMediaGeo",
    0xc1b15d65,
    0x53fb4010
  > {
  period: number;
  geoPoint: InputGeoPointEmpty | InputGeoPoint;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface InputBotInlineMessageMediaVenue
  extends TLObjectType<
    "InputBotInlineMessageMediaVenue",
    0x417bbf11,
    0x53fb4010
  > {
  venueType: string;
  venueId: string;
  provider: string;
  address: string;
  title: string;
  geoPoint: InputGeoPointEmpty | InputGeoPoint;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface InputBotInlineMessageMediaContact
  extends TLObjectType<
    "InputBotInlineMessageMediaContact",
    0xa6edbffd,
    0x53fb4010
  > {
  vcard: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface InputBotInlineMessageGame
  extends TLObjectType<"InputBotInlineMessageGame", 0x4b425864, 0x53fb4010> {
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface InputBotInlineResult
  extends TLObjectType<"InputBotInlineResult", 0x88bf9319, 0x80a4a3de> {
  sendMessage:
    | InputBotInlineMessageMediaAuto
    | InputBotInlineMessageText
    | InputBotInlineMessageMediaGeo
    | InputBotInlineMessageMediaVenue
    | InputBotInlineMessageMediaContact
    | InputBotInlineMessageGame;
  type: string;
  id: string;
  title?: string;
  description?: string;
  url?: string;
  thumb?: InputWebDocument;
  content?: InputWebDocument;
}

export interface InputBotInlineResultPhoto
  extends TLObjectType<"InputBotInlineResultPhoto", 0xa8d864a7, 0x80a4a3de> {
  sendMessage:
    | InputBotInlineMessageMediaAuto
    | InputBotInlineMessageText
    | InputBotInlineMessageMediaGeo
    | InputBotInlineMessageMediaVenue
    | InputBotInlineMessageMediaContact
    | InputBotInlineMessageGame;
  photo: InputPhotoEmpty | InputPhoto;
  type: string;
  id: string;
}

export interface InputBotInlineResultDocument
  extends TLObjectType<"InputBotInlineResultDocument", 0xfff8fdc4, 0x80a4a3de> {
  sendMessage:
    | InputBotInlineMessageMediaAuto
    | InputBotInlineMessageText
    | InputBotInlineMessageMediaGeo
    | InputBotInlineMessageMediaVenue
    | InputBotInlineMessageMediaContact
    | InputBotInlineMessageGame;
  document: InputDocumentEmpty | InputDocument;
  type: string;
  id: string;
  title?: string;
  description?: string;
}

export interface InputBotInlineResultGame
  extends TLObjectType<"InputBotInlineResultGame", 0x4fa417f2, 0x80a4a3de> {
  sendMessage:
    | InputBotInlineMessageMediaAuto
    | InputBotInlineMessageText
    | InputBotInlineMessageMediaGeo
    | InputBotInlineMessageMediaVenue
    | InputBotInlineMessageMediaContact
    | InputBotInlineMessageGame;
  shortName: string;
  id: string;
}

export interface BotInlineMessageMediaAuto
  extends TLObjectType<"BotInlineMessageMediaAuto", 0x764cf810, 0xc4910f88> {
  message: string;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface BotInlineMessageText
  extends TLObjectType<"BotInlineMessageText", 0x8c7f65e2, 0xc4910f88> {
  message: string;
  noWebpage?: boolean;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface BotInlineMessageMediaGeo
  extends TLObjectType<"BotInlineMessageMediaGeo", 0xb722de65, 0xc4910f88> {
  period: number;
  geo: GeoPointEmpty | GeoPoint;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface BotInlineMessageMediaVenue
  extends TLObjectType<"BotInlineMessageMediaVenue", 0x8a86659c, 0xc4910f88> {
  venueType: string;
  venueId: string;
  provider: string;
  address: string;
  title: string;
  geo: GeoPointEmpty | GeoPoint;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface BotInlineMessageMediaContact
  extends TLObjectType<"BotInlineMessageMediaContact", 0x18d1cdc2, 0xc4910f88> {
  vcard: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
}

export interface BotInlineResult
  extends TLObjectType<"BotInlineResult", 0x11965f3a, 0x3832b3d5> {
  sendMessage:
    | BotInlineMessageMediaAuto
    | BotInlineMessageText
    | BotInlineMessageMediaGeo
    | BotInlineMessageMediaVenue
    | BotInlineMessageMediaContact;
  type: string;
  id: string;
  title?: string;
  description?: string;
  url?: string;
  thumb?: WebDocument | WebDocumentNoProxy;
  content?: WebDocument | WebDocumentNoProxy;
}

export interface BotInlineMediaResult
  extends TLObjectType<"BotInlineMediaResult", 0x17db940b, 0x3832b3d5> {
  sendMessage:
    | BotInlineMessageMediaAuto
    | BotInlineMessageText
    | BotInlineMessageMediaGeo
    | BotInlineMessageMediaVenue
    | BotInlineMessageMediaContact;
  type: string;
  id: string;
  photo?: PhotoEmpty | Photo;
  document?:
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest;
  title?: string;
  description?: string;
}

export interface messages_BotResults
  extends TLObjectType<"messages_BotResults", 0x947ca848, 0x3ed4d9c9> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  cacheTime: number;
  results: (BotInlineResult | BotInlineMediaResult)[];
  queryId: bigint;
  gallery?: boolean;
  nextOffset?: string;
  switchPm?: InlineBotSwitchPM;
}

export interface ExportedMessageLink
  extends TLObjectType<"ExportedMessageLink", 0x5dab1af4, 0xdee644cc> {
  html: string;
  link: string;
}

export interface MessageFwdHeader
  extends TLObjectType<"MessageFwdHeader", 0xec338270, 0x7a286804> {
  date: number;
  fromId?: number;
  fromName?: string;
  channelId?: number;
  channelPost?: number;
  postAuthor?: string;
  savedFromPeer?: PeerUser | PeerChat | PeerChannel;
  savedFromMsgId?: number;
}

export interface auth_CodeTypeSms
  extends TLObjectType<"auth_CodeTypeSms", 0x72a3158c, 0xb3f3e401> {}

export interface auth_CodeTypeCall
  extends TLObjectType<"auth_CodeTypeCall", 0x741cd3e3, 0xb3f3e401> {}

export interface auth_CodeTypeFlashCall
  extends TLObjectType<"auth_CodeTypeFlashCall", 0x226ccefb, 0xb3f3e401> {}

export interface auth_SentCodeTypeApp
  extends TLObjectType<"auth_SentCodeTypeApp", 0x3dbb5986, 0xff5b158e> {
  length: number;
}

export interface auth_SentCodeTypeSms
  extends TLObjectType<"auth_SentCodeTypeSms", 0xc000bba2, 0xff5b158e> {
  length: number;
}

export interface auth_SentCodeTypeCall
  extends TLObjectType<"auth_SentCodeTypeCall", 0x5353e5a7, 0xff5b158e> {
  length: number;
}

export interface auth_SentCodeTypeFlashCall
  extends TLObjectType<"auth_SentCodeTypeFlashCall", 0xab03c6d9, 0xff5b158e> {
  pattern: string;
}

export interface messages_BotCallbackAnswer
  extends TLObjectType<"messages_BotCallbackAnswer", 0x36585ea4, 0x6c4dd18c> {
  cacheTime: number;
  alert?: boolean;
  hasUrl?: boolean;
  nativeUi?: boolean;
  message?: string;
  url?: string;
}

export interface messages_MessageEditData
  extends TLObjectType<"messages_MessageEditData", 0x26b5dde6, 0xfb47949d> {
  caption?: boolean;
}

export interface InputBotInlineMessageID
  extends TLObjectType<"InputBotInlineMessageID", 0x890c3d89, 0x2dcd6300> {
  accessHash: bigint;
  id: bigint;
  dcId: number;
}

export interface InlineBotSwitchPM
  extends TLObjectType<"InlineBotSwitchPM", 0x3c20629f, 0x82b1f73b> {
  startParam: string;
  text: string;
}

export interface messages_PeerDialogs
  extends TLObjectType<"messages_PeerDialogs", 0x3371c354, 0x3ac70132> {
  state: updates_State | updates_GetStateRequest;
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  messages: (MessageEmpty | Message | MessageService)[];
  dialogs: (Dialog | DialogFolder)[];
}

export interface TopPeer
  extends TLObjectType<"TopPeer", 0xedcdc05b, 0x6916c601> {
  rating: number;
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface TopPeerCategoryBotsPM
  extends TLObjectType<"TopPeerCategoryBotsPM", 0xab661b5b, 0xddf02502> {}

export interface TopPeerCategoryBotsInline
  extends TLObjectType<"TopPeerCategoryBotsInline", 0x148677e2, 0xddf02502> {}

export interface TopPeerCategoryCorrespondents
  extends TLObjectType<
    "TopPeerCategoryCorrespondents",
    0x0637b7ed,
    0xddf02502
  > {}

export interface TopPeerCategoryGroups
  extends TLObjectType<"TopPeerCategoryGroups", 0xbd17a14a, 0xddf02502> {}

export interface TopPeerCategoryChannels
  extends TLObjectType<"TopPeerCategoryChannels", 0x161d9628, 0xddf02502> {}

export interface TopPeerCategoryPhoneCalls
  extends TLObjectType<"TopPeerCategoryPhoneCalls", 0x1e76a78c, 0xddf02502> {}

export interface TopPeerCategoryForwardUsers
  extends TLObjectType<"TopPeerCategoryForwardUsers", 0xa8406ca9, 0xddf02502> {}

export interface TopPeerCategoryForwardChats
  extends TLObjectType<"TopPeerCategoryForwardChats", 0xfbeec0f0, 0xddf02502> {}

export interface TopPeerCategoryPeers
  extends TLObjectType<"TopPeerCategoryPeers", 0xfb834291, 0x4aec930> {
  peers: TopPeer[];
  count: number;
  category:
    | TopPeerCategoryBotsPM
    | TopPeerCategoryBotsInline
    | TopPeerCategoryCorrespondents
    | TopPeerCategoryGroups
    | TopPeerCategoryChannels
    | TopPeerCategoryPhoneCalls
    | TopPeerCategoryForwardUsers
    | TopPeerCategoryForwardChats;
}

export interface contacts_TopPeersNotModified
  extends TLObjectType<
    "contacts_TopPeersNotModified",
    0xde266ef5,
    0x9ee8bb88
  > {}

export interface contacts_TopPeers
  extends TLObjectType<"contacts_TopPeers", 0x70b772a8, 0x9ee8bb88> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  categories: TopPeerCategoryPeers[];
}

export interface contacts_TopPeersDisabled
  extends TLObjectType<"contacts_TopPeersDisabled", 0xb52c939d, 0x9ee8bb88> {}

export interface DraftMessageEmpty
  extends TLObjectType<"DraftMessageEmpty", 0x1b0c841a, 0x33d47f45> {
  date?: number;
}

export interface DraftMessage
  extends TLObjectType<"DraftMessage", 0xfd8e711f, 0x33d47f45> {
  date: number;
  message: string;
  noWebpage?: boolean;
  replyToMsgId?: number;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
}

export interface messages_FeaturedStickersNotModified
  extends TLObjectType<
    "messages_FeaturedStickersNotModified",
    0x04ede3cf,
    0x2614b722
  > {}

export interface messages_FeaturedStickers
  extends TLObjectType<"messages_FeaturedStickers", 0xf89d88e5, 0x2614b722> {
  unread: bigint[];
  sets: (StickerSetCovered | StickerSetMultiCovered)[];
  hash: number;
}

export interface messages_RecentStickersNotModified
  extends TLObjectType<
    "messages_RecentStickersNotModified",
    0x0b17f890,
    0xf76f8683
  > {}

export interface messages_RecentStickers
  extends TLObjectType<"messages_RecentStickers", 0x22f3afb3, 0xf76f8683> {
  dates: number[];
  stickers: (
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest
  )[];
  packs: StickerPack[];
  hash: number;
}

export interface messages_ArchivedStickers
  extends TLObjectType<"messages_ArchivedStickers", 0x4fcba9c8, 0x7296d771> {
  sets: (StickerSetCovered | StickerSetMultiCovered)[];
  count: number;
}

export interface messages_StickerSetInstallResultSuccess
  extends TLObjectType<
    "messages_StickerSetInstallResultSuccess",
    0x38641628,
    0x67cb3fe8
  > {}

export interface messages_StickerSetInstallResultArchive
  extends TLObjectType<
    "messages_StickerSetInstallResultArchive",
    0x35e410a8,
    0x67cb3fe8
  > {
  sets: (StickerSetCovered | StickerSetMultiCovered)[];
}

export interface StickerSetCovered
  extends TLObjectType<"StickerSetCovered", 0x6410a5d2, 0x7f86e4e5> {
  cover:
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest;
  set: StickerSet;
}

export interface StickerSetMultiCovered
  extends TLObjectType<"StickerSetMultiCovered", 0x3407e51b, 0x7f86e4e5> {
  covers: (
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest
  )[];
  set: StickerSet;
}

export interface MaskCoords
  extends TLObjectType<"MaskCoords", 0xaed6dbb2, 0x6bbb2fd> {
  zoom: number;
  y: number;
  x: number;
  n: number;
}

export interface InputStickeredMediaPhoto
  extends TLObjectType<"InputStickeredMediaPhoto", 0x4a992157, 0x5146d99e> {
  id: InputPhotoEmpty | InputPhoto;
}

export interface InputStickeredMediaDocument
  extends TLObjectType<"InputStickeredMediaDocument", 0x0438865b, 0x5146d99e> {
  id: InputDocumentEmpty | InputDocument;
}

export interface Game extends TLObjectType<"Game", 0xbdf9653b, 0x83199eb2> {
  photo: PhotoEmpty | Photo;
  description: string;
  title: string;
  shortName: string;
  accessHash: bigint;
  id: bigint;
  document?:
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest;
}

export interface InputGameID
  extends TLObjectType<"InputGameID", 0x032c3e77, 0x48d15883> {
  accessHash: bigint;
  id: bigint;
}

export interface InputGameShortName
  extends TLObjectType<"InputGameShortName", 0xc331e80a, 0x48d15883> {
  shortName: string;
  botId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface HighScore
  extends TLObjectType<"HighScore", 0x58fffcd0, 0xd32b1e35> {
  score: number;
  userId: number;
  pos: number;
}

export interface messages_HighScores
  extends TLObjectType<"messages_HighScores", 0x9a3bfd99, 0x6ccd95fd> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  scores: HighScore[];
}

export interface TextEmpty
  extends TLObjectType<"TextEmpty", 0xdc3d824f, 0xf1d0b479> {}

export interface TextPlain
  extends TLObjectType<"TextPlain", 0x744694e0, 0xf1d0b479> {
  text: string;
}

export interface TextBold
  extends TLObjectType<"TextBold", 0x6724abc4, 0xf1d0b479> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextItalic
  extends TLObjectType<"TextItalic", 0xd912a59c, 0xf1d0b479> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextUnderline
  extends TLObjectType<"TextUnderline", 0xc12622c4, 0xf1d0b479> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextStrike
  extends TLObjectType<"TextStrike", 0x9bf8bb95, 0xf1d0b479> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextFixed
  extends TLObjectType<"TextFixed", 0x6c3f19b9, 0xf1d0b479> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextUrl
  extends TLObjectType<"TextUrl", 0x3c2884c1, 0xf1d0b479> {
  webpageId: bigint;
  url: string;
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextEmail
  extends TLObjectType<"TextEmail", 0xde5a0dd6, 0xf1d0b479> {
  email: string;
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextConcat
  extends TLObjectType<"TextConcat", 0x7e6260d7, 0xf1d0b479> {
  texts: (
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor
  )[];
}

export interface TextSubscript
  extends TLObjectType<"TextSubscript", 0xed6a8504, 0xf1d0b479> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextSuperscript
  extends TLObjectType<"TextSuperscript", 0xc7fb5e01, 0xf1d0b479> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextMarked
  extends TLObjectType<"TextMarked", 0x034b8621, 0xf1d0b479> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextPhone
  extends TLObjectType<"TextPhone", 0x1ccb966a, 0xf1d0b479> {
  phone: string;
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface TextImage
  extends TLObjectType<"TextImage", 0x081ccf4f, 0xf1d0b479> {
  h: number;
  w: number;
  documentId: bigint;
}

export interface TextAnchor
  extends TLObjectType<"TextAnchor", 0x35553762, 0xf1d0b479> {
  name: string;
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockUnsupported
  extends TLObjectType<"PageBlockUnsupported", 0x13567e8a, 0x1aca5644> {}

export interface PageBlockTitle
  extends TLObjectType<"PageBlockTitle", 0x70abc3fd, 0x1aca5644> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockSubtitle
  extends TLObjectType<"PageBlockSubtitle", 0x8ffa9a1f, 0x1aca5644> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockAuthorDate
  extends TLObjectType<"PageBlockAuthorDate", 0xbaafe5e0, 0x1aca5644> {
  publishedDate: number;
  author:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockHeader
  extends TLObjectType<"PageBlockHeader", 0xbfd064ec, 0x1aca5644> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockSubheader
  extends TLObjectType<"PageBlockSubheader", 0xf12bb6e1, 0x1aca5644> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockParagraph
  extends TLObjectType<"PageBlockParagraph", 0x467a0766, 0x1aca5644> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockPreformatted
  extends TLObjectType<"PageBlockPreformatted", 0xc070d93e, 0x1aca5644> {
  language: string;
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockFooter
  extends TLObjectType<"PageBlockFooter", 0x48870999, 0x1aca5644> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockDivider
  extends TLObjectType<"PageBlockDivider", 0xdb20b188, 0x1aca5644> {}

export interface PageBlockAnchor
  extends TLObjectType<"PageBlockAnchor", 0xce0d37b0, 0x1aca5644> {
  name: string;
}

export interface PageBlockList
  extends TLObjectType<"PageBlockList", 0xe4e88011, 0x1aca5644> {
  items: (PageListItemText | PageListItemBlocks)[];
}

export interface PageBlockBlockquote
  extends TLObjectType<"PageBlockBlockquote", 0x263d7c26, 0x1aca5644> {
  caption:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockPullquote
  extends TLObjectType<"PageBlockPullquote", 0x4f4456d3, 0x1aca5644> {
  caption:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockPhoto
  extends TLObjectType<"PageBlockPhoto", 0x1759c560, 0x1aca5644> {
  caption: PageCaption;
  photoId: bigint;
  url?: string;
  webpageId?: bigint;
}

export interface PageBlockVideo
  extends TLObjectType<"PageBlockVideo", 0x7c8fe7b6, 0x1aca5644> {
  caption: PageCaption;
  videoId: bigint;
  autoplay?: boolean;
  loop?: boolean;
}

export interface PageBlockCover
  extends TLObjectType<"PageBlockCover", 0x39f23300, 0x1aca5644> {
  cover:
    | PageBlockUnsupported
    | PageBlockTitle
    | PageBlockSubtitle
    | PageBlockAuthorDate
    | PageBlockHeader
    | PageBlockSubheader
    | PageBlockParagraph
    | PageBlockPreformatted
    | PageBlockFooter
    | PageBlockDivider
    | PageBlockAnchor
    | PageBlockList
    | PageBlockBlockquote
    | PageBlockPullquote
    | PageBlockPhoto
    | PageBlockVideo
    | PageBlockCover
    | PageBlockEmbed
    | PageBlockEmbedPost
    | PageBlockCollage
    | PageBlockSlideshow
    | PageBlockChannel
    | PageBlockAudio
    | PageBlockKicker
    | PageBlockTable
    | PageBlockOrderedList
    | PageBlockDetails
    | PageBlockRelatedArticles
    | PageBlockMap;
}

export interface PageBlockEmbed
  extends TLObjectType<"PageBlockEmbed", 0xa8718dc5, 0x1aca5644> {
  caption: PageCaption;
  fullWidth?: boolean;
  allowScrolling?: boolean;
  url?: string;
  html?: string;
  posterPhotoId?: bigint;
  w?: number;
  h?: number;
}

export interface PageBlockEmbedPost
  extends TLObjectType<"PageBlockEmbedPost", 0xf259a80b, 0x1aca5644> {
  caption: PageCaption;
  blocks: (
    | PageBlockUnsupported
    | PageBlockTitle
    | PageBlockSubtitle
    | PageBlockAuthorDate
    | PageBlockHeader
    | PageBlockSubheader
    | PageBlockParagraph
    | PageBlockPreformatted
    | PageBlockFooter
    | PageBlockDivider
    | PageBlockAnchor
    | PageBlockList
    | PageBlockBlockquote
    | PageBlockPullquote
    | PageBlockPhoto
    | PageBlockVideo
    | PageBlockCover
    | PageBlockEmbed
    | PageBlockEmbedPost
    | PageBlockCollage
    | PageBlockSlideshow
    | PageBlockChannel
    | PageBlockAudio
    | PageBlockKicker
    | PageBlockTable
    | PageBlockOrderedList
    | PageBlockDetails
    | PageBlockRelatedArticles
    | PageBlockMap
  )[];
  date: number;
  author: string;
  authorPhotoId: bigint;
  webpageId: bigint;
  url: string;
}

export interface PageBlockCollage
  extends TLObjectType<"PageBlockCollage", 0x65a0fa4d, 0x1aca5644> {
  caption: PageCaption;
  items: (
    | PageBlockUnsupported
    | PageBlockTitle
    | PageBlockSubtitle
    | PageBlockAuthorDate
    | PageBlockHeader
    | PageBlockSubheader
    | PageBlockParagraph
    | PageBlockPreformatted
    | PageBlockFooter
    | PageBlockDivider
    | PageBlockAnchor
    | PageBlockList
    | PageBlockBlockquote
    | PageBlockPullquote
    | PageBlockPhoto
    | PageBlockVideo
    | PageBlockCover
    | PageBlockEmbed
    | PageBlockEmbedPost
    | PageBlockCollage
    | PageBlockSlideshow
    | PageBlockChannel
    | PageBlockAudio
    | PageBlockKicker
    | PageBlockTable
    | PageBlockOrderedList
    | PageBlockDetails
    | PageBlockRelatedArticles
    | PageBlockMap
  )[];
}

export interface PageBlockSlideshow
  extends TLObjectType<"PageBlockSlideshow", 0x031f9590, 0x1aca5644> {
  caption: PageCaption;
  items: (
    | PageBlockUnsupported
    | PageBlockTitle
    | PageBlockSubtitle
    | PageBlockAuthorDate
    | PageBlockHeader
    | PageBlockSubheader
    | PageBlockParagraph
    | PageBlockPreformatted
    | PageBlockFooter
    | PageBlockDivider
    | PageBlockAnchor
    | PageBlockList
    | PageBlockBlockquote
    | PageBlockPullquote
    | PageBlockPhoto
    | PageBlockVideo
    | PageBlockCover
    | PageBlockEmbed
    | PageBlockEmbedPost
    | PageBlockCollage
    | PageBlockSlideshow
    | PageBlockChannel
    | PageBlockAudio
    | PageBlockKicker
    | PageBlockTable
    | PageBlockOrderedList
    | PageBlockDetails
    | PageBlockRelatedArticles
    | PageBlockMap
  )[];
}

export interface PageBlockChannel
  extends TLObjectType<"PageBlockChannel", 0xef1751b5, 0x1aca5644> {
  channel: ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden;
}

export interface PageBlockAudio
  extends TLObjectType<"PageBlockAudio", 0x804361ea, 0x1aca5644> {
  caption: PageCaption;
  audioId: bigint;
}

export interface PageBlockKicker
  extends TLObjectType<"PageBlockKicker", 0x1e148390, 0x1aca5644> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockTable
  extends TLObjectType<"PageBlockTable", 0xbf4dea82, 0x1aca5644> {
  rows: PageTableRow[];
  title:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
  bordered?: boolean;
  striped?: boolean;
}

export interface PageBlockOrderedList
  extends TLObjectType<"PageBlockOrderedList", 0x9a8ae1e1, 0x1aca5644> {
  items: (PageListOrderedItemText | PageListOrderedItemBlocks)[];
}

export interface PageBlockDetails
  extends TLObjectType<"PageBlockDetails", 0x76768bed, 0x1aca5644> {
  title:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
  blocks: (
    | PageBlockUnsupported
    | PageBlockTitle
    | PageBlockSubtitle
    | PageBlockAuthorDate
    | PageBlockHeader
    | PageBlockSubheader
    | PageBlockParagraph
    | PageBlockPreformatted
    | PageBlockFooter
    | PageBlockDivider
    | PageBlockAnchor
    | PageBlockList
    | PageBlockBlockquote
    | PageBlockPullquote
    | PageBlockPhoto
    | PageBlockVideo
    | PageBlockCover
    | PageBlockEmbed
    | PageBlockEmbedPost
    | PageBlockCollage
    | PageBlockSlideshow
    | PageBlockChannel
    | PageBlockAudio
    | PageBlockKicker
    | PageBlockTable
    | PageBlockOrderedList
    | PageBlockDetails
    | PageBlockRelatedArticles
    | PageBlockMap
  )[];
  open?: boolean;
}

export interface PageBlockRelatedArticles
  extends TLObjectType<"PageBlockRelatedArticles", 0x16115a96, 0x1aca5644> {
  articles: PageRelatedArticle[];
  title:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageBlockMap
  extends TLObjectType<"PageBlockMap", 0xa44f3ef6, 0x1aca5644> {
  caption: PageCaption;
  h: number;
  w: number;
  zoom: number;
  geo: GeoPointEmpty | GeoPoint;
}

export interface PhoneCallDiscardReasonMissed
  extends TLObjectType<
    "PhoneCallDiscardReasonMissed",
    0x85e42301,
    0xd89bad3d
  > {}

export interface PhoneCallDiscardReasonDisconnect
  extends TLObjectType<
    "PhoneCallDiscardReasonDisconnect",
    0xe095c1a0,
    0xd89bad3d
  > {}

export interface PhoneCallDiscardReasonHangup
  extends TLObjectType<
    "PhoneCallDiscardReasonHangup",
    0x57adc690,
    0xd89bad3d
  > {}

export interface PhoneCallDiscardReasonBusy
  extends TLObjectType<"PhoneCallDiscardReasonBusy", 0xfaf7e8c9, 0xd89bad3d> {}

export interface DataJSON
  extends TLObjectType<"DataJSON", 0x7d748d04, 0xad0352e8> {
  data: string;
}

export interface LabeledPrice
  extends TLObjectType<"LabeledPrice", 0xcb296bf8, 0x1c84047a> {
  amount: bigint;
  label: string;
}

export interface Invoice
  extends TLObjectType<"Invoice", 0xc30aa358, 0x5fd82ed8> {
  prices: LabeledPrice[];
  currency: string;
  test?: boolean;
  nameRequested?: boolean;
  phoneRequested?: boolean;
  emailRequested?: boolean;
  shippingAddressRequested?: boolean;
  flexible?: boolean;
  phoneToProvider?: boolean;
  emailToProvider?: boolean;
}

export interface PaymentCharge
  extends TLObjectType<"PaymentCharge", 0xea02c27e, 0x3cc830d9> {
  providerChargeId: string;
  id: string;
}

export interface PostAddress
  extends TLObjectType<"PostAddress", 0x1e8caaeb, 0x8d7eda2c> {
  postCode: string;
  countryIso2: string;
  state: string;
  city: string;
  streetLine2: string;
  streetLine1: string;
}

export interface PaymentRequestedInfo
  extends TLObjectType<"PaymentRequestedInfo", 0x909c3f94, 0x8db03146> {
  name?: string;
  phone?: string;
  email?: string;
  shippingAddress?: PostAddress;
}

export interface PaymentSavedCredentialsCard
  extends TLObjectType<"PaymentSavedCredentialsCard", 0xcdc27a1f, 0xb3627ee3> {
  title: string;
  id: string;
}

export interface WebDocument
  extends TLObjectType<"WebDocument", 0x1c570ed1, 0x3b642814> {
  attributes: (
    | DocumentAttributeImageSize
    | DocumentAttributeAnimated
    | DocumentAttributeSticker
    | DocumentAttributeVideo
    | DocumentAttributeAudio
    | DocumentAttributeFilename
    | DocumentAttributeHasStickers
  )[];
  mimeType: string;
  size: number;
  accessHash: bigint;
  url: string;
}

export interface WebDocumentNoProxy
  extends TLObjectType<"WebDocumentNoProxy", 0xf9c8bcc6, 0x3b642814> {
  attributes: (
    | DocumentAttributeImageSize
    | DocumentAttributeAnimated
    | DocumentAttributeSticker
    | DocumentAttributeVideo
    | DocumentAttributeAudio
    | DocumentAttributeFilename
    | DocumentAttributeHasStickers
  )[];
  mimeType: string;
  size: number;
  url: string;
}

export interface InputWebDocument
  extends TLObjectType<"InputWebDocument", 0x9bed434d, 0x8ae8b146> {
  attributes: (
    | DocumentAttributeImageSize
    | DocumentAttributeAnimated
    | DocumentAttributeSticker
    | DocumentAttributeVideo
    | DocumentAttributeAudio
    | DocumentAttributeFilename
    | DocumentAttributeHasStickers
  )[];
  mimeType: string;
  size: number;
  url: string;
}

export interface InputWebFileLocation
  extends TLObjectType<"InputWebFileLocation", 0xc239d686, 0xf72ed8d9> {
  accessHash: bigint;
  url: string;
}

export interface InputWebFileGeoPointLocation
  extends TLObjectType<"InputWebFileGeoPointLocation", 0x9f2221c9, 0xf72ed8d9> {
  scale: number;
  zoom: number;
  h: number;
  w: number;
  accessHash: bigint;
  geoPoint: InputGeoPointEmpty | InputGeoPoint;
}

export interface upload_WebFile
  extends TLObjectType<"upload_WebFile", 0x21e753bc, 0x68f17f51> {
  bytes: Uint8Array;
  mtime: number;
  fileType:
    | storage_FileUnknown
    | storage_FilePartial
    | storage_FileJpeg
    | storage_FileGif
    | storage_FilePng
    | storage_FilePdf
    | storage_FileMp3
    | storage_FileMov
    | storage_FileMp4
    | storage_FileWebp;
  mimeType: string;
  size: number;
}

export interface payments_PaymentForm
  extends TLObjectType<"payments_PaymentForm", 0x3f56aea3, 0xa0483f19> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  url: string;
  providerId: number;
  invoice: Invoice;
  botId: number;
  canSaveCredentials?: boolean;
  passwordMissing?: boolean;
  nativeProvider?: string;
  nativeParams?:
    | DataJSON
    | bots_SendCustomRequestRequest
    | phone_GetCallConfigRequest;
  savedInfo?: PaymentRequestedInfo;
  savedCredentials?: PaymentSavedCredentialsCard;
}

export interface payments_ValidatedRequestedInfo
  extends TLObjectType<
    "payments_ValidatedRequestedInfo",
    0xd1451883,
    0x8f8044b7
  > {
  id?: string;
  shippingOptions?: ShippingOption[];
}

export interface payments_PaymentResult
  extends TLObjectType<"payments_PaymentResult", 0x4e5f810d, 0x8ae16a9d> {
  updates:
    | UpdatesTooLong
    | UpdateShortMessage
    | UpdateShortChatMessage
    | UpdateShort
    | UpdatesCombined
    | Updates
    | UpdateShortSentMessage
    | account_GetNotifyExceptionsRequest
    | contacts_DeleteContactsRequest
    | contacts_AddContactRequest
    | contacts_AcceptContactRequest
    | contacts_GetLocatedRequest
    | messages_SendMessageRequest
    | messages_SendMediaRequest
    | messages_ForwardMessagesRequest
    | messages_EditChatTitleRequest
    | messages_EditChatPhotoRequest
    | messages_AddChatUserRequest
    | messages_DeleteChatUserRequest
    | messages_CreateChatRequest
    | messages_ImportChatInviteRequest
    | messages_StartBotRequest
    | messages_MigrateChatRequest
    | messages_SendInlineBotResultRequest
    | messages_EditMessageRequest
    | messages_GetAllDraftsRequest
    | messages_SetGameScoreRequest
    | messages_SendScreenshotNotificationRequest
    | messages_SendMultiMediaRequest
    | messages_UpdatePinnedMessageRequest
    | messages_SendVoteRequest
    | messages_GetPollResultsRequest
    | messages_EditChatDefaultBannedRightsRequest
    | messages_SendScheduledMessagesRequest
    | messages_DeleteScheduledMessagesRequest
    | help_GetAppChangelogRequest
    | channels_CreateChannelRequest
    | channels_EditAdminRequest
    | channels_EditTitleRequest
    | channels_EditPhotoRequest
    | channels_JoinChannelRequest
    | channels_LeaveChannelRequest
    | channels_InviteToChannelRequest
    | channels_DeleteChannelRequest
    | channels_ToggleSignaturesRequest
    | channels_EditBannedRequest
    | channels_TogglePreHistoryHiddenRequest
    | channels_EditCreatorRequest
    | channels_ToggleSlowModeRequest
    | phone_DiscardCallRequest
    | phone_SetCallRatingRequest
    | folders_EditPeerFoldersRequest
    | folders_DeleteFolderRequest;
}

export interface payments_PaymentVerificationNeeded
  extends TLObjectType<
    "payments_PaymentVerificationNeeded",
    0xd8411139,
    0x8ae16a9d
  > {
  url: string;
}

export interface payments_PaymentReceipt
  extends TLObjectType<"payments_PaymentReceipt", 0x500911e1, 0x590093c9> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  credentialsTitle: string;
  totalAmount: bigint;
  currency: string;
  providerId: number;
  invoice: Invoice;
  botId: number;
  date: number;
  info?: PaymentRequestedInfo;
  shipping?: ShippingOption;
}

export interface payments_SavedInfo
  extends TLObjectType<"payments_SavedInfo", 0xfb8fe43c, 0xad3cf146> {
  hasSavedCredentials?: boolean;
  savedInfo?: PaymentRequestedInfo;
}

export interface InputPaymentCredentialsSaved
  extends TLObjectType<"InputPaymentCredentialsSaved", 0xc10eb2cf, 0x2899a53d> {
  tmpPassword: Uint8Array;
  id: string;
}

export interface InputPaymentCredentials
  extends TLObjectType<"InputPaymentCredentials", 0x3417d728, 0x2899a53d> {
  data: DataJSON | bots_SendCustomRequestRequest | phone_GetCallConfigRequest;
  save?: boolean;
}

export interface InputPaymentCredentialsApplePay
  extends TLObjectType<
    "InputPaymentCredentialsApplePay",
    0x0aa1c39f,
    0x2899a53d
  > {
  paymentData:
    | DataJSON
    | bots_SendCustomRequestRequest
    | phone_GetCallConfigRequest;
}

export interface InputPaymentCredentialsAndroidPay
  extends TLObjectType<
    "InputPaymentCredentialsAndroidPay",
    0xca05d50e,
    0x2899a53d
  > {
  googleTransactionId: string;
  paymentToken:
    | DataJSON
    | bots_SendCustomRequestRequest
    | phone_GetCallConfigRequest;
}

export interface account_TmpPassword
  extends TLObjectType<"account_TmpPassword", 0xdb64fd34, 0xb064992d> {
  validUntil: number;
  tmpPassword: Uint8Array;
}

export interface ShippingOption
  extends TLObjectType<"ShippingOption", 0xb6213cdf, 0xf4e94c78> {
  prices: LabeledPrice[];
  title: string;
  id: string;
}

export interface InputStickerSetItem
  extends TLObjectType<"InputStickerSetItem", 0xffa0a496, 0xae59f075> {
  emoji: string;
  document: InputDocumentEmpty | InputDocument;
  maskCoords?: MaskCoords;
}

export interface InputPhoneCall
  extends TLObjectType<"InputPhoneCall", 0x1e36fded, 0xbcaaf240> {
  accessHash: bigint;
  id: bigint;
}

export interface PhoneCallEmpty
  extends TLObjectType<"PhoneCallEmpty", 0x5366c915, 0xc47f1bd1> {
  id: bigint;
}

export interface PhoneCallWaiting
  extends TLObjectType<"PhoneCallWaiting", 0x1b8f4ad1, 0xc47f1bd1> {
  protocol: PhoneCallProtocol;
  participantId: number;
  adminId: number;
  date: number;
  accessHash: bigint;
  id: bigint;
  video?: boolean;
  receiveDate?: number;
}

export interface PhoneCallRequested
  extends TLObjectType<"PhoneCallRequested", 0x87eabb53, 0xc47f1bd1> {
  protocol: PhoneCallProtocol;
  gAHash: Uint8Array;
  participantId: number;
  adminId: number;
  date: number;
  accessHash: bigint;
  id: bigint;
  video?: boolean;
}

export interface PhoneCallAccepted
  extends TLObjectType<"PhoneCallAccepted", 0x997c454a, 0xc47f1bd1> {
  protocol: PhoneCallProtocol;
  gB: Uint8Array;
  participantId: number;
  adminId: number;
  date: number;
  accessHash: bigint;
  id: bigint;
  video?: boolean;
}

export interface PhoneCall
  extends TLObjectType<"PhoneCall", 0x8742ae7f, 0xc47f1bd1> {
  startDate: number;
  connections: PhoneConnection[];
  protocol: PhoneCallProtocol;
  keyFingerprint: bigint;
  gAOrB: Uint8Array;
  participantId: number;
  adminId: number;
  date: number;
  accessHash: bigint;
  id: bigint;
  p2pAllowed?: boolean;
}

export interface PhoneCallDiscarded
  extends TLObjectType<"PhoneCallDiscarded", 0x50ca4de1, 0xc47f1bd1> {
  id: bigint;
  needRating?: boolean;
  needDebug?: boolean;
  video?: boolean;
  reason?:
    | PhoneCallDiscardReasonMissed
    | PhoneCallDiscardReasonDisconnect
    | PhoneCallDiscardReasonHangup
    | PhoneCallDiscardReasonBusy;
  duration?: number;
}

export interface PhoneConnection
  extends TLObjectType<"PhoneConnection", 0x9d4c17c0, 0xaa8de40d> {
  peerTag: Uint8Array;
  port: number;
  ipv6: string;
  ip: string;
  id: bigint;
}

export interface PhoneCallProtocol
  extends TLObjectType<"PhoneCallProtocol", 0xa2bb35cb, 0x783991a3> {
  maxLayer: number;
  minLayer: number;
  udpP2p?: boolean;
  udpReflector?: boolean;
}

export interface phone_PhoneCall
  extends TLObjectType<"phone_PhoneCall", 0xec82e140, 0xd48afe4f> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  phoneCall:
    | PhoneCallEmpty
    | PhoneCallWaiting
    | PhoneCallRequested
    | PhoneCallAccepted
    | PhoneCall
    | PhoneCallDiscarded;
}

export interface upload_CdnFileReuploadNeeded
  extends TLObjectType<"upload_CdnFileReuploadNeeded", 0xeea8e46e, 0xf5ccf928> {
  requestToken: Uint8Array;
}

export interface upload_CdnFile
  extends TLObjectType<"upload_CdnFile", 0xa99fca4f, 0xf5ccf928> {
  bytes: Uint8Array;
}

export interface CdnPublicKey
  extends TLObjectType<"CdnPublicKey", 0xc982eaba, 0x16db47f3> {
  publicKey: string;
  dcId: number;
}

export interface CdnConfig
  extends TLObjectType<"CdnConfig", 0x5725e40a, 0xecda397c> {
  publicKeys: CdnPublicKey[];
}

export interface LangPackString
  extends TLObjectType<"LangPackString", 0xcad181f6, 0xdc179ab9> {
  value: string;
  key: string;
}

export interface LangPackStringPluralized
  extends TLObjectType<"LangPackStringPluralized", 0x6c47ac9f, 0xdc179ab9> {
  otherValue: string;
  key: string;
  zeroValue?: string;
  oneValue?: string;
  twoValue?: string;
  fewValue?: string;
  manyValue?: string;
}

export interface LangPackStringDeleted
  extends TLObjectType<"LangPackStringDeleted", 0x2979eeb2, 0xdc179ab9> {
  key: string;
}

export interface LangPackDifference
  extends TLObjectType<"LangPackDifference", 0xf385c1f6, 0x52662d55> {
  strings: (
    | LangPackString
    | LangPackStringPluralized
    | LangPackStringDeleted
  )[];
  version: number;
  fromVersion: number;
  langCode: string;
}

export interface LangPackLanguage
  extends TLObjectType<"LangPackLanguage", 0xeeca5ce3, 0xabac89b7> {
  translationsUrl: string;
  translatedCount: number;
  stringsCount: number;
  pluralCode: string;
  langCode: string;
  nativeName: string;
  name: string;
  official?: boolean;
  rtl?: boolean;
  beta?: boolean;
  baseLangCode?: string;
}

export interface ChannelAdminLogEventActionChangeTitle
  extends TLObjectType<
    "ChannelAdminLogEventActionChangeTitle",
    0xe6dfb825,
    0xb2b987f3
  > {
  newValue: string;
  prevValue: string;
}

export interface ChannelAdminLogEventActionChangeAbout
  extends TLObjectType<
    "ChannelAdminLogEventActionChangeAbout",
    0x55188a2e,
    0xb2b987f3
  > {
  newValue: string;
  prevValue: string;
}

export interface ChannelAdminLogEventActionChangeUsername
  extends TLObjectType<
    "ChannelAdminLogEventActionChangeUsername",
    0x6a4afc38,
    0xb2b987f3
  > {
  newValue: string;
  prevValue: string;
}

export interface ChannelAdminLogEventActionChangePhoto
  extends TLObjectType<
    "ChannelAdminLogEventActionChangePhoto",
    0x434bd2af,
    0xb2b987f3
  > {
  newPhoto: PhotoEmpty | Photo;
  prevPhoto: PhotoEmpty | Photo;
}

export interface ChannelAdminLogEventActionToggleInvites
  extends TLObjectType<
    "ChannelAdminLogEventActionToggleInvites",
    0x1b7907ae,
    0xb2b987f3
  > {
  newValue: boolean;
}

export interface ChannelAdminLogEventActionToggleSignatures
  extends TLObjectType<
    "ChannelAdminLogEventActionToggleSignatures",
    0x26ae0971,
    0xb2b987f3
  > {
  newValue: boolean;
}

export interface ChannelAdminLogEventActionUpdatePinned
  extends TLObjectType<
    "ChannelAdminLogEventActionUpdatePinned",
    0xe9e82c18,
    0xb2b987f3
  > {
  message: MessageEmpty | Message | MessageService;
}

export interface ChannelAdminLogEventActionEditMessage
  extends TLObjectType<
    "ChannelAdminLogEventActionEditMessage",
    0x709b2405,
    0xb2b987f3
  > {
  newMessage: MessageEmpty | Message | MessageService;
  prevMessage: MessageEmpty | Message | MessageService;
}

export interface ChannelAdminLogEventActionDeleteMessage
  extends TLObjectType<
    "ChannelAdminLogEventActionDeleteMessage",
    0x42e047bb,
    0xb2b987f3
  > {
  message: MessageEmpty | Message | MessageService;
}

export interface ChannelAdminLogEventActionParticipantJoin
  extends TLObjectType<
    "ChannelAdminLogEventActionParticipantJoin",
    0x183040d3,
    0xb2b987f3
  > {}

export interface ChannelAdminLogEventActionParticipantLeave
  extends TLObjectType<
    "ChannelAdminLogEventActionParticipantLeave",
    0xf89777f2,
    0xb2b987f3
  > {}

export interface ChannelAdminLogEventActionParticipantInvite
  extends TLObjectType<
    "ChannelAdminLogEventActionParticipantInvite",
    0xe31c34d8,
    0xb2b987f3
  > {
  participant:
    | ChannelParticipant
    | ChannelParticipantSelf
    | ChannelParticipantCreator
    | ChannelParticipantAdmin
    | ChannelParticipantBanned;
}

export interface ChannelAdminLogEventActionParticipantToggleBan
  extends TLObjectType<
    "ChannelAdminLogEventActionParticipantToggleBan",
    0xe6d83d7e,
    0xb2b987f3
  > {
  newParticipant:
    | ChannelParticipant
    | ChannelParticipantSelf
    | ChannelParticipantCreator
    | ChannelParticipantAdmin
    | ChannelParticipantBanned;
  prevParticipant:
    | ChannelParticipant
    | ChannelParticipantSelf
    | ChannelParticipantCreator
    | ChannelParticipantAdmin
    | ChannelParticipantBanned;
}

export interface ChannelAdminLogEventActionParticipantToggleAdmin
  extends TLObjectType<
    "ChannelAdminLogEventActionParticipantToggleAdmin",
    0xd5676710,
    0xb2b987f3
  > {
  newParticipant:
    | ChannelParticipant
    | ChannelParticipantSelf
    | ChannelParticipantCreator
    | ChannelParticipantAdmin
    | ChannelParticipantBanned;
  prevParticipant:
    | ChannelParticipant
    | ChannelParticipantSelf
    | ChannelParticipantCreator
    | ChannelParticipantAdmin
    | ChannelParticipantBanned;
}

export interface ChannelAdminLogEventActionChangeStickerSet
  extends TLObjectType<
    "ChannelAdminLogEventActionChangeStickerSet",
    0xb1c3caa7,
    0xb2b987f3
  > {
  newStickerset:
    | InputStickerSetEmpty
    | InputStickerSetID
    | InputStickerSetShortName
    | InputStickerSetAnimatedEmoji;
  prevStickerset:
    | InputStickerSetEmpty
    | InputStickerSetID
    | InputStickerSetShortName
    | InputStickerSetAnimatedEmoji;
}

export interface ChannelAdminLogEventActionTogglePreHistoryHidden
  extends TLObjectType<
    "ChannelAdminLogEventActionTogglePreHistoryHidden",
    0x5f5c95f1,
    0xb2b987f3
  > {
  newValue: boolean;
}

export interface ChannelAdminLogEventActionDefaultBannedRights
  extends TLObjectType<
    "ChannelAdminLogEventActionDefaultBannedRights",
    0x2df5fc0a,
    0xb2b987f3
  > {
  newBannedRights: ChatBannedRights;
  prevBannedRights: ChatBannedRights;
}

export interface ChannelAdminLogEventActionStopPoll
  extends TLObjectType<
    "ChannelAdminLogEventActionStopPoll",
    0x8f079643,
    0xb2b987f3
  > {
  message: MessageEmpty | Message | MessageService;
}

export interface ChannelAdminLogEventActionChangeLinkedChat
  extends TLObjectType<
    "ChannelAdminLogEventActionChangeLinkedChat",
    0xa26f881b,
    0xb2b987f3
  > {
  newValue: number;
  prevValue: number;
}

export interface ChannelAdminLogEventActionChangeLocation
  extends TLObjectType<
    "ChannelAdminLogEventActionChangeLocation",
    0x0e6b76ae,
    0xb2b987f3
  > {
  newValue: ChannelLocationEmpty | ChannelLocation;
  prevValue: ChannelLocationEmpty | ChannelLocation;
}

export interface ChannelAdminLogEventActionToggleSlowMode
  extends TLObjectType<
    "ChannelAdminLogEventActionToggleSlowMode",
    0x53909779,
    0xb2b987f3
  > {
  newValue: number;
  prevValue: number;
}

export interface ChannelAdminLogEvent
  extends TLObjectType<"ChannelAdminLogEvent", 0x3b5a3e40, 0x408f0999> {
  action:
    | ChannelAdminLogEventActionChangeTitle
    | ChannelAdminLogEventActionChangeAbout
    | ChannelAdminLogEventActionChangeUsername
    | ChannelAdminLogEventActionChangePhoto
    | ChannelAdminLogEventActionToggleInvites
    | ChannelAdminLogEventActionToggleSignatures
    | ChannelAdminLogEventActionUpdatePinned
    | ChannelAdminLogEventActionEditMessage
    | ChannelAdminLogEventActionDeleteMessage
    | ChannelAdminLogEventActionParticipantJoin
    | ChannelAdminLogEventActionParticipantLeave
    | ChannelAdminLogEventActionParticipantInvite
    | ChannelAdminLogEventActionParticipantToggleBan
    | ChannelAdminLogEventActionParticipantToggleAdmin
    | ChannelAdminLogEventActionChangeStickerSet
    | ChannelAdminLogEventActionTogglePreHistoryHidden
    | ChannelAdminLogEventActionDefaultBannedRights
    | ChannelAdminLogEventActionStopPoll
    | ChannelAdminLogEventActionChangeLinkedChat
    | ChannelAdminLogEventActionChangeLocation
    | ChannelAdminLogEventActionToggleSlowMode;
  userId: number;
  date: number;
  id: bigint;
}

export interface channels_AdminLogResults
  extends TLObjectType<"channels_AdminLogResults", 0xed8af74d, 0x51f076bc> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  events: ChannelAdminLogEvent[];
}

export interface ChannelAdminLogEventsFilter
  extends TLObjectType<"ChannelAdminLogEventsFilter", 0xea107ae4, 0x7cbbf319> {
  join?: boolean;
  leave?: boolean;
  invite?: boolean;
  ban?: boolean;
  unban?: boolean;
  kick?: boolean;
  unkick?: boolean;
  promote?: boolean;
  demote?: boolean;
  info?: boolean;
  settings?: boolean;
  pinned?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export interface PopularContact
  extends TLObjectType<"PopularContact", 0x5ce14175, 0x409255a> {
  importers: number;
  clientId: bigint;
}

export interface messages_FavedStickersNotModified
  extends TLObjectType<
    "messages_FavedStickersNotModified",
    0x9e8fa6d3,
    0x8e736fb9
  > {}

export interface messages_FavedStickers
  extends TLObjectType<"messages_FavedStickers", 0xf37f2f16, 0x8e736fb9> {
  stickers: (
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest
  )[];
  packs: StickerPack[];
  hash: number;
}

export interface RecentMeUrlUnknown
  extends TLObjectType<"RecentMeUrlUnknown", 0x46e1d13d, 0x55a53079> {
  url: string;
}

export interface RecentMeUrlUser
  extends TLObjectType<"RecentMeUrlUser", 0x8dbc3336, 0x55a53079> {
  userId: number;
  url: string;
}

export interface RecentMeUrlChat
  extends TLObjectType<"RecentMeUrlChat", 0xa01b22f9, 0x55a53079> {
  chatId: number;
  url: string;
}

export interface RecentMeUrlChatInvite
  extends TLObjectType<"RecentMeUrlChatInvite", 0xeb49081d, 0x55a53079> {
  chatInvite: ChatInviteAlready | ChatInvite | messages_CheckChatInviteRequest;
  url: string;
}

export interface RecentMeUrlStickerSet
  extends TLObjectType<"RecentMeUrlStickerSet", 0xbc0a57dc, 0x55a53079> {
  set: StickerSetCovered | StickerSetMultiCovered;
  url: string;
}

export interface help_RecentMeUrls
  extends TLObjectType<"help_RecentMeUrls", 0x0e0310d7, 0xf269c477> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  urls: (
    | RecentMeUrlUnknown
    | RecentMeUrlUser
    | RecentMeUrlChat
    | RecentMeUrlChatInvite
    | RecentMeUrlStickerSet
  )[];
}

export interface InputSingleMedia
  extends TLObjectType<"InputSingleMedia", 0x1cc6e91f, 0x21ca8ed8> {
  message: string;
  media:
    | InputMediaEmpty
    | InputMediaUploadedPhoto
    | InputMediaPhoto
    | InputMediaGeoPoint
    | InputMediaContact
    | InputMediaUploadedDocument
    | InputMediaDocument
    | InputMediaVenue
    | InputMediaGifExternal
    | InputMediaPhotoExternal
    | InputMediaDocumentExternal
    | InputMediaGame
    | InputMediaInvoice
    | InputMediaGeoLive
    | InputMediaPoll;
  randomId?: bigint;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
}

export interface WebAuthorization
  extends TLObjectType<"WebAuthorization", 0xcac943f2, 0x3764d30> {
  region: string;
  ip: string;
  dateActive: number;
  dateCreated: number;
  platform: string;
  browser: string;
  domain: string;
  botId: number;
  hash: bigint;
}

export interface account_WebAuthorizations
  extends TLObjectType<"account_WebAuthorizations", 0xed56c9fc, 0x9a365b32> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  authorizations: WebAuthorization[];
}

export interface InputMessageID
  extends TLObjectType<"InputMessageID", 0xa676a322, 0x54b6bcc5> {
  id: number;
}

export interface InputMessageReplyTo
  extends TLObjectType<"InputMessageReplyTo", 0xbad88395, 0x54b6bcc5> {
  id: number;
}

export interface InputMessagePinned
  extends TLObjectType<"InputMessagePinned", 0x86872538, 0x54b6bcc5> {}

export interface InputDialogPeer
  extends TLObjectType<"InputDialogPeer", 0xfcaafeb7, 0xa21c9795> {
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface InputDialogPeerFolder
  extends TLObjectType<"InputDialogPeerFolder", 0x64600527, 0xa21c9795> {
  folderId: number;
}

export interface DialogPeer
  extends TLObjectType<"DialogPeer", 0xe56dbf05, 0x256ce1ae> {
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface DialogPeerFolder
  extends TLObjectType<"DialogPeerFolder", 0x514519e2, 0x256ce1ae> {
  folderId: number;
}

export interface messages_FoundStickerSetsNotModified
  extends TLObjectType<
    "messages_FoundStickerSetsNotModified",
    0x0d54b65d,
    0x40df361
  > {}

export interface messages_FoundStickerSets
  extends TLObjectType<"messages_FoundStickerSets", 0x5108d648, 0x40df361> {
  sets: (StickerSetCovered | StickerSetMultiCovered)[];
  hash: number;
}

export interface FileHash
  extends TLObjectType<"FileHash", 0x6242c773, 0xead438b3> {
  hash: Uint8Array;
  limit: number;
  offset: number;
}

export interface InputClientProxy
  extends TLObjectType<"InputClientProxy", 0x75588b3f, 0x91a4346> {
  port: number;
  address: string;
}

export interface help_ProxyDataEmpty
  extends TLObjectType<"help_ProxyDataEmpty", 0xe09e1fb8, 0x21e2a448> {
  expires: number;
}

export interface help_ProxyDataPromo
  extends TLObjectType<"help_ProxyDataPromo", 0x2bf7ee23, 0x21e2a448> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  chats: (ChatEmpty | Chat | ChatForbidden | Channel | ChannelForbidden)[];
  peer: PeerUser | PeerChat | PeerChannel;
  expires: number;
}

export interface help_TermsOfServiceUpdateEmpty
  extends TLObjectType<
    "help_TermsOfServiceUpdateEmpty",
    0xe3309f7f,
    0x293c2977
  > {
  expires: number;
}

export interface help_TermsOfServiceUpdate
  extends TLObjectType<"help_TermsOfServiceUpdate", 0x28ecf961, 0x293c2977> {
  termsOfService: help_TermsOfService;
  expires: number;
}

export interface InputSecureFileUploaded
  extends TLObjectType<"InputSecureFileUploaded", 0x3334b0f0, 0xdac8adfc> {
  secret: Uint8Array;
  fileHash: Uint8Array;
  md5Checksum: string;
  parts: number;
  id: bigint;
}

export interface InputSecureFile
  extends TLObjectType<"InputSecureFile", 0x5367e5be, 0xdac8adfc> {
  accessHash: bigint;
  id: bigint;
}

export interface SecureFileEmpty
  extends TLObjectType<"SecureFileEmpty", 0x64199744, 0x5db8dbc7> {}

export interface SecureFile
  extends TLObjectType<"SecureFile", 0xe0277a62, 0x5db8dbc7> {
  secret: Uint8Array;
  fileHash: Uint8Array;
  date: number;
  dcId: number;
  size: number;
  accessHash: bigint;
  id: bigint;
}

export interface SecureData
  extends TLObjectType<"SecureData", 0x8aeabec3, 0x7cd41eb4> {
  secret: Uint8Array;
  dataHash: Uint8Array;
  data: Uint8Array;
}

export interface SecurePlainPhone
  extends TLObjectType<"SecurePlainPhone", 0x7d6099dd, 0x23b2afb6> {
  phone: string;
}

export interface SecurePlainEmail
  extends TLObjectType<"SecurePlainEmail", 0x21ec5a5f, 0x23b2afb6> {
  email: string;
}

export interface SecureValueTypePersonalDetails
  extends TLObjectType<
    "SecureValueTypePersonalDetails",
    0x9d2a81e3,
    0x8893f596
  > {}

export interface SecureValueTypePassport
  extends TLObjectType<"SecureValueTypePassport", 0x3dac6a00, 0x8893f596> {}

export interface SecureValueTypeDriverLicense
  extends TLObjectType<
    "SecureValueTypeDriverLicense",
    0x06e425c4,
    0x8893f596
  > {}

export interface SecureValueTypeIdentityCard
  extends TLObjectType<"SecureValueTypeIdentityCard", 0xa0d0744b, 0x8893f596> {}

export interface SecureValueTypeInternalPassport
  extends TLObjectType<
    "SecureValueTypeInternalPassport",
    0x99a48f23,
    0x8893f596
  > {}

export interface SecureValueTypeAddress
  extends TLObjectType<"SecureValueTypeAddress", 0xcbe31e26, 0x8893f596> {}

export interface SecureValueTypeUtilityBill
  extends TLObjectType<"SecureValueTypeUtilityBill", 0xfc36954e, 0x8893f596> {}

export interface SecureValueTypeBankStatement
  extends TLObjectType<
    "SecureValueTypeBankStatement",
    0x89137c0d,
    0x8893f596
  > {}

export interface SecureValueTypeRentalAgreement
  extends TLObjectType<
    "SecureValueTypeRentalAgreement",
    0x8b883488,
    0x8893f596
  > {}

export interface SecureValueTypePassportRegistration
  extends TLObjectType<
    "SecureValueTypePassportRegistration",
    0x99e3806a,
    0x8893f596
  > {}

export interface SecureValueTypeTemporaryRegistration
  extends TLObjectType<
    "SecureValueTypeTemporaryRegistration",
    0xea02ec33,
    0x8893f596
  > {}

export interface SecureValueTypePhone
  extends TLObjectType<"SecureValueTypePhone", 0xb320aadb, 0x8893f596> {}

export interface SecureValueTypeEmail
  extends TLObjectType<"SecureValueTypeEmail", 0x8e3ca7ee, 0x8893f596> {}

export interface SecureValue
  extends TLObjectType<"SecureValue", 0x187fa0ca, 0x51138ae> {
  hash: Uint8Array;
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
  data?: SecureData;
  frontSide?: SecureFileEmpty | SecureFile;
  reverseSide?: SecureFileEmpty | SecureFile;
  selfie?: SecureFileEmpty | SecureFile;
  translation?: (SecureFileEmpty | SecureFile)[];
  files?: (SecureFileEmpty | SecureFile)[];
  plainData?: SecurePlainPhone | SecurePlainEmail;
}

export interface InputSecureValue
  extends TLObjectType<"InputSecureValue", 0xdb21d0a7, 0xb49da1fc> {
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
  data?: SecureData;
  frontSide?: InputSecureFileUploaded | InputSecureFile;
  reverseSide?: InputSecureFileUploaded | InputSecureFile;
  selfie?: InputSecureFileUploaded | InputSecureFile;
  translation?: (InputSecureFileUploaded | InputSecureFile)[];
  files?: (InputSecureFileUploaded | InputSecureFile)[];
  plainData?: SecurePlainPhone | SecurePlainEmail;
}

export interface SecureValueHash
  extends TLObjectType<"SecureValueHash", 0xed1ecdb0, 0xd5f5c007> {
  hash: Uint8Array;
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
}

export interface SecureValueErrorData
  extends TLObjectType<"SecureValueErrorData", 0xe8a40bd9, 0x6075fce> {
  text: string;
  field: string;
  dataHash: Uint8Array;
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
}

export interface SecureValueErrorFrontSide
  extends TLObjectType<"SecureValueErrorFrontSide", 0x00be3dfa, 0x6075fce> {
  text: string;
  fileHash: Uint8Array;
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
}

export interface SecureValueErrorReverseSide
  extends TLObjectType<"SecureValueErrorReverseSide", 0x868a2aa5, 0x6075fce> {
  text: string;
  fileHash: Uint8Array;
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
}

export interface SecureValueErrorSelfie
  extends TLObjectType<"SecureValueErrorSelfie", 0xe537ced6, 0x6075fce> {
  text: string;
  fileHash: Uint8Array;
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
}

export interface SecureValueErrorFile
  extends TLObjectType<"SecureValueErrorFile", 0x7a700873, 0x6075fce> {
  text: string;
  fileHash: Uint8Array;
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
}

export interface SecureValueErrorFiles
  extends TLObjectType<"SecureValueErrorFiles", 0x666220e9, 0x6075fce> {
  text: string;
  fileHash: Uint8Array[];
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
}

export interface SecureValueError
  extends TLObjectType<"SecureValueError", 0x869d758f, 0x6075fce> {
  text: string;
  hash: Uint8Array;
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
}

export interface SecureValueErrorTranslationFile
  extends TLObjectType<
    "SecureValueErrorTranslationFile",
    0xa1144770,
    0x6075fce
  > {
  text: string;
  fileHash: Uint8Array;
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
}

export interface SecureValueErrorTranslationFiles
  extends TLObjectType<
    "SecureValueErrorTranslationFiles",
    0x34636dd8,
    0x6075fce
  > {
  text: string;
  fileHash: Uint8Array[];
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
}

export interface SecureCredentialsEncrypted
  extends TLObjectType<"SecureCredentialsEncrypted", 0x33f0ea47, 0x94dc7633> {
  secret: Uint8Array;
  hash: Uint8Array;
  data: Uint8Array;
}

export interface account_AuthorizationForm
  extends TLObjectType<"account_AuthorizationForm", 0xad2e1cd8, 0x78049a94> {
  users: (
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest
  )[];
  errors: (
    | SecureValueErrorData
    | SecureValueErrorFrontSide
    | SecureValueErrorReverseSide
    | SecureValueErrorSelfie
    | SecureValueErrorFile
    | SecureValueErrorFiles
    | SecureValueError
    | SecureValueErrorTranslationFile
    | SecureValueErrorTranslationFiles
  )[];
  values: (SecureValue | account_SaveSecureValueRequest)[];
  requiredTypes: (SecureRequiredType | SecureRequiredTypeOneOf)[];
  privacyPolicyUrl?: string;
}

export interface account_SentEmailCode
  extends TLObjectType<"account_SentEmailCode", 0x811f854f, 0x69f3c06e> {
  length: number;
  emailPattern: string;
}

export interface help_DeepLinkInfoEmpty
  extends TLObjectType<"help_DeepLinkInfoEmpty", 0x66afa166, 0x984aac38> {}

export interface help_DeepLinkInfo
  extends TLObjectType<"help_DeepLinkInfo", 0x6a4ee832, 0x984aac38> {
  message: string;
  updateApp?: boolean;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
}

export interface SavedPhoneContact
  extends TLObjectType<"SavedPhoneContact", 0x1142bd56, 0x6db98c4> {
  date: number;
  lastName: string;
  firstName: string;
  phone: string;
}

export interface account_Takeout
  extends TLObjectType<"account_Takeout", 0x4dba4501, 0x843ebe85> {
  id: bigint;
}

export interface PasswordKdfAlgoUnknown
  extends TLObjectType<"PasswordKdfAlgoUnknown", 0xd45ab096, 0x37bcf5cc> {}

export interface PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow
  extends TLObjectType<
    "PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow",
    0x3a912d4a,
    0x37bcf5cc
  > {
  p: Uint8Array;
  g: number;
  salt2: Uint8Array;
  salt1: Uint8Array;
}

export interface SecurePasswordKdfAlgoUnknown
  extends TLObjectType<
    "SecurePasswordKdfAlgoUnknown",
    0x004a8537,
    0x77262943
  > {}

export interface SecurePasswordKdfAlgoPBKDF2HMACSHA512iter100000
  extends TLObjectType<
    "SecurePasswordKdfAlgoPBKDF2HMACSHA512iter100000",
    0xbbf2dda0,
    0x77262943
  > {
  salt: Uint8Array;
}

export interface SecurePasswordKdfAlgoSHA512
  extends TLObjectType<"SecurePasswordKdfAlgoSHA512", 0x86471d92, 0x77262943> {
  salt: Uint8Array;
}

export interface SecureSecretSettings
  extends TLObjectType<"SecureSecretSettings", 0x1527bcac, 0xc6c802fb> {
  secureSecretId: bigint;
  secureSecret: Uint8Array;
  secureAlgo:
    | SecurePasswordKdfAlgoUnknown
    | SecurePasswordKdfAlgoPBKDF2HMACSHA512iter100000
    | SecurePasswordKdfAlgoSHA512;
}

export interface InputCheckPasswordEmpty
  extends TLObjectType<"InputCheckPasswordEmpty", 0x9880f658, 0xd41af560> {}

export interface InputCheckPasswordSRP
  extends TLObjectType<"InputCheckPasswordSRP", 0xd27ff082, 0xd41af560> {
  M1: Uint8Array;
  A: Uint8Array;
  srpId: bigint;
}

export interface SecureRequiredType
  extends TLObjectType<"SecureRequiredType", 0x829d99da, 0x7c7b420a> {
  type:
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail;
  nativeNames?: boolean;
  selfieRequired?: boolean;
  translationRequired?: boolean;
}

export interface SecureRequiredTypeOneOf
  extends TLObjectType<"SecureRequiredTypeOneOf", 0x027477b4, 0x7c7b420a> {
  types: (SecureRequiredType | SecureRequiredTypeOneOf)[];
}

export interface help_PassportConfigNotModified
  extends TLObjectType<
    "help_PassportConfigNotModified",
    0xbfb9f457,
    0xc666c0ad
  > {}

export interface help_PassportConfig
  extends TLObjectType<"help_PassportConfig", 0xa098d6af, 0xc666c0ad> {
  countriesLangs:
    | DataJSON
    | bots_SendCustomRequestRequest
    | phone_GetCallConfigRequest;
  hash: number;
}

export interface InputAppEvent
  extends TLObjectType<"InputAppEvent", 0x1d1b1245, 0x89322106> {
  data:
    | JsonNull
    | JsonBool
    | JsonNumber
    | JsonString
    | JsonArray
    | JsonObject
    | help_GetAppConfigRequest;
  peer: bigint;
  type: string;
  time: number;
}

export interface JsonObjectValue
  extends TLObjectType<"JsonObjectValue", 0xc0de1bd9, 0x937fceb9> {
  value:
    | JsonNull
    | JsonBool
    | JsonNumber
    | JsonString
    | JsonArray
    | JsonObject
    | help_GetAppConfigRequest;
  key: string;
}

export interface JsonNull
  extends TLObjectType<"JsonNull", 0x3f6d7b68, 0xeb9987b3> {}

export interface JsonBool
  extends TLObjectType<"JsonBool", 0xc7345e6a, 0xeb9987b3> {
  value: boolean;
}

export interface JsonNumber
  extends TLObjectType<"JsonNumber", 0x2be0dfa4, 0xeb9987b3> {
  value: number;
}

export interface JsonString
  extends TLObjectType<"JsonString", 0xb71e767a, 0xeb9987b3> {
  value: string;
}

export interface JsonArray
  extends TLObjectType<"JsonArray", 0xf7444763, 0xeb9987b3> {
  value: (
    | JsonNull
    | JsonBool
    | JsonNumber
    | JsonString
    | JsonArray
    | JsonObject
    | help_GetAppConfigRequest
  )[];
}

export interface JsonObject
  extends TLObjectType<"JsonObject", 0x99c1d49d, 0xeb9987b3> {
  value: JsonObjectValue[];
}

export interface PageTableCell
  extends TLObjectType<"PageTableCell", 0x34566b6a, 0xb0eb3054> {
  header?: boolean;
  alignCenter?: boolean;
  alignRight?: boolean;
  valignMiddle?: boolean;
  valignBottom?: boolean;
  text?:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
  colspan?: number;
  rowspan?: number;
}

export interface PageTableRow
  extends TLObjectType<"PageTableRow", 0xe0c0c5e5, 0x59acee11> {
  cells: PageTableCell[];
}

export interface PageCaption
  extends TLObjectType<"PageCaption", 0x6f747657, 0x29b8eeb3> {
  credit:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageListItemText
  extends TLObjectType<"PageListItemText", 0xb92fb6cd, 0x8caebcb1> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
}

export interface PageListItemBlocks
  extends TLObjectType<"PageListItemBlocks", 0x25e073fc, 0x8caebcb1> {
  blocks: (
    | PageBlockUnsupported
    | PageBlockTitle
    | PageBlockSubtitle
    | PageBlockAuthorDate
    | PageBlockHeader
    | PageBlockSubheader
    | PageBlockParagraph
    | PageBlockPreformatted
    | PageBlockFooter
    | PageBlockDivider
    | PageBlockAnchor
    | PageBlockList
    | PageBlockBlockquote
    | PageBlockPullquote
    | PageBlockPhoto
    | PageBlockVideo
    | PageBlockCover
    | PageBlockEmbed
    | PageBlockEmbedPost
    | PageBlockCollage
    | PageBlockSlideshow
    | PageBlockChannel
    | PageBlockAudio
    | PageBlockKicker
    | PageBlockTable
    | PageBlockOrderedList
    | PageBlockDetails
    | PageBlockRelatedArticles
    | PageBlockMap
  )[];
}

export interface PageListOrderedItemText
  extends TLObjectType<"PageListOrderedItemText", 0x5e068047, 0xeeda0eb8> {
  text:
    | TextEmpty
    | TextPlain
    | TextBold
    | TextItalic
    | TextUnderline
    | TextStrike
    | TextFixed
    | TextUrl
    | TextEmail
    | TextConcat
    | TextSubscript
    | TextSuperscript
    | TextMarked
    | TextPhone
    | TextImage
    | TextAnchor;
  num: string;
}

export interface PageListOrderedItemBlocks
  extends TLObjectType<"PageListOrderedItemBlocks", 0x98dd8936, 0xeeda0eb8> {
  blocks: (
    | PageBlockUnsupported
    | PageBlockTitle
    | PageBlockSubtitle
    | PageBlockAuthorDate
    | PageBlockHeader
    | PageBlockSubheader
    | PageBlockParagraph
    | PageBlockPreformatted
    | PageBlockFooter
    | PageBlockDivider
    | PageBlockAnchor
    | PageBlockList
    | PageBlockBlockquote
    | PageBlockPullquote
    | PageBlockPhoto
    | PageBlockVideo
    | PageBlockCover
    | PageBlockEmbed
    | PageBlockEmbedPost
    | PageBlockCollage
    | PageBlockSlideshow
    | PageBlockChannel
    | PageBlockAudio
    | PageBlockKicker
    | PageBlockTable
    | PageBlockOrderedList
    | PageBlockDetails
    | PageBlockRelatedArticles
    | PageBlockMap
  )[];
  num: string;
}

export interface PageRelatedArticle
  extends TLObjectType<"PageRelatedArticle", 0xb390dc08, 0x36d05822> {
  webpageId: bigint;
  url: string;
  title?: string;
  description?: string;
  photoId?: bigint;
  author?: string;
  publishedDate?: number;
}

export interface Page extends TLObjectType<"Page", 0xae891bec, 0xb438191e> {
  documents: (
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest
  )[];
  photos: (PhotoEmpty | Photo)[];
  blocks: (
    | PageBlockUnsupported
    | PageBlockTitle
    | PageBlockSubtitle
    | PageBlockAuthorDate
    | PageBlockHeader
    | PageBlockSubheader
    | PageBlockParagraph
    | PageBlockPreformatted
    | PageBlockFooter
    | PageBlockDivider
    | PageBlockAnchor
    | PageBlockList
    | PageBlockBlockquote
    | PageBlockPullquote
    | PageBlockPhoto
    | PageBlockVideo
    | PageBlockCover
    | PageBlockEmbed
    | PageBlockEmbedPost
    | PageBlockCollage
    | PageBlockSlideshow
    | PageBlockChannel
    | PageBlockAudio
    | PageBlockKicker
    | PageBlockTable
    | PageBlockOrderedList
    | PageBlockDetails
    | PageBlockRelatedArticles
    | PageBlockMap
  )[];
  url: string;
  part?: boolean;
  rtl?: boolean;
  v2?: boolean;
}

export interface help_SupportName
  extends TLObjectType<"help_SupportName", 0x8c05f1c9, 0x7f50b7c2> {
  name: string;
}

export interface help_UserInfoEmpty
  extends TLObjectType<"help_UserInfoEmpty", 0xf3ae2eed, 0x5c53d7d8> {}

export interface help_UserInfo
  extends TLObjectType<"help_UserInfo", 0x01eb3758, 0x5c53d7d8> {
  date: number;
  author: string;
  entities: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  message: string;
}

export interface PollAnswer
  extends TLObjectType<"PollAnswer", 0x6ca9c2e9, 0x7ea5dd9e> {
  option: Uint8Array;
  text: string;
}

export interface Poll extends TLObjectType<"Poll", 0xd5529d06, 0x248e557b> {
  answers: PollAnswer[];
  question: string;
  id: bigint;
  closed?: boolean;
}

export interface PollAnswerVoters
  extends TLObjectType<"PollAnswerVoters", 0x3b6ddad2, 0x7ce0cf91> {
  voters: number;
  option: Uint8Array;
  chosen?: boolean;
}

export interface PollResults
  extends TLObjectType<"PollResults", 0x5755785a, 0xc3b4f687> {
  min?: boolean;
  results?: PollAnswerVoters[];
  totalVoters?: number;
}

export interface ChatOnlines
  extends TLObjectType<"ChatOnlines", 0xf041e250, 0x8c81903a> {
  onlines: number;
}

export interface StatsURL
  extends TLObjectType<"StatsURL", 0x47a971e0, 0x8d4c94c0> {
  url: string;
}

export interface ChatAdminRights
  extends TLObjectType<"ChatAdminRights", 0x5fb224d5, 0x863dc7c4> {
  changeInfo?: boolean;
  postMessages?: boolean;
  editMessages?: boolean;
  deleteMessages?: boolean;
  banUsers?: boolean;
  inviteUsers?: boolean;
  pinMessages?: boolean;
  addAdmins?: boolean;
}

export interface ChatBannedRights
  extends TLObjectType<"ChatBannedRights", 0x9f120418, 0x4b5445a9> {
  untilDate: number;
  viewMessages?: boolean;
  sendMessages?: boolean;
  sendMedia?: boolean;
  sendStickers?: boolean;
  sendGifs?: boolean;
  sendGames?: boolean;
  sendInline?: boolean;
  embedLinks?: boolean;
  sendPolls?: boolean;
  changeInfo?: boolean;
  inviteUsers?: boolean;
  pinMessages?: boolean;
}

export interface InputWallPaper
  extends TLObjectType<"InputWallPaper", 0xe630b979, 0xee77201a> {
  accessHash: bigint;
  id: bigint;
}

export interface InputWallPaperSlug
  extends TLObjectType<"InputWallPaperSlug", 0x72091c80, 0xee77201a> {
  slug: string;
}

export interface account_WallPapersNotModified
  extends TLObjectType<
    "account_WallPapersNotModified",
    0x1c199183,
    0xa2c548fd
  > {}

export interface account_WallPapers
  extends TLObjectType<"account_WallPapers", 0x702b65a9, 0xa2c548fd> {
  wallpapers: (
    | WallPaper
    | account_GetWallPaperRequest
    | account_UploadWallPaperRequest
  )[];
  hash: number;
}

export interface CodeSettings
  extends TLObjectType<"CodeSettings", 0xdebebe83, 0x48edbc8a> {
  allowFlashcall?: boolean;
  currentNumber?: boolean;
  allowAppHash?: boolean;
}

export interface WallPaperSettings
  extends TLObjectType<"WallPaperSettings", 0xa12f40b8, 0x4175e312> {
  blur?: boolean;
  motion?: boolean;
  backgroundColor?: number;
  intensity?: number;
}

export interface AutoDownloadSettings
  extends TLObjectType<"AutoDownloadSettings", 0xd246fd47, 0x512819c7> {
  fileSizeMax: number;
  videoSizeMax: number;
  photoSizeMax: number;
  disabled?: boolean;
  videoPreloadLarge?: boolean;
  audioPreloadNext?: boolean;
  phonecallsLessData?: boolean;
}

export interface account_AutoDownloadSettings
  extends TLObjectType<"account_AutoDownloadSettings", 0x63cacf26, 0x2fb85921> {
  high: AutoDownloadSettings;
  medium: AutoDownloadSettings;
  low: AutoDownloadSettings;
}

export interface EmojiKeyword
  extends TLObjectType<"EmojiKeyword", 0xd5b3b9f9, 0x6612a53e> {
  emoticons: string[];
  keyword: string;
}

export interface EmojiKeywordDeleted
  extends TLObjectType<"EmojiKeywordDeleted", 0x236df622, 0x6612a53e> {
  emoticons: string[];
  keyword: string;
}

export interface EmojiKeywordsDifference
  extends TLObjectType<"EmojiKeywordsDifference", 0x5cc761bd, 0xd279c672> {
  keywords: (EmojiKeyword | EmojiKeywordDeleted)[];
  version: number;
  fromVersion: number;
  langCode: string;
}

export interface EmojiURL
  extends TLObjectType<"EmojiURL", 0xa575739d, 0x1fa08a19> {
  url: string;
}

export interface EmojiLanguage
  extends TLObjectType<"EmojiLanguage", 0xb3fb5361, 0xa48d04ee> {
  langCode: string;
}

export interface FileLocationToBeDeprecated
  extends TLObjectType<"FileLocationToBeDeprecated", 0xbc7fc6cd, 0x90f76823> {
  localId: number;
  volumeId: bigint;
}

export interface Folder extends TLObjectType<"Folder", 0xff544e65, 0xeb0e0cfb> {
  title: string;
  id: number;
  autofillNewBroadcasts?: boolean;
  autofillPublicGroups?: boolean;
  autofillNewCorrespondents?: boolean;
  photo?: ChatPhotoEmpty | ChatPhoto;
}

export interface InputFolderPeer
  extends TLObjectType<"InputFolderPeer", 0xfbd2c296, 0x74825e00> {
  folderId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface FolderPeer
  extends TLObjectType<"FolderPeer", 0xe9baa668, 0xf3f2283b> {
  folderId: number;
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface messages_SearchCounter
  extends TLObjectType<"messages_SearchCounter", 0xe844ebff, 0xd6a7bfa2> {
  count: number;
  filter:
    | InputMessagesFilterEmpty
    | InputMessagesFilterPhotos
    | InputMessagesFilterVideo
    | InputMessagesFilterPhotoVideo
    | InputMessagesFilterDocument
    | InputMessagesFilterUrl
    | InputMessagesFilterGif
    | InputMessagesFilterVoice
    | InputMessagesFilterMusic
    | InputMessagesFilterChatPhotos
    | InputMessagesFilterPhoneCalls
    | InputMessagesFilterRoundVoice
    | InputMessagesFilterRoundVideo
    | InputMessagesFilterMyMentions
    | InputMessagesFilterGeo
    | InputMessagesFilterContacts;
  inexact?: boolean;
}

export interface UrlAuthResultRequest
  extends TLObjectType<"UrlAuthResultRequest", 0x92d33a0e, 0x7765cb1e> {
  domain: string;
  bot:
    | UserEmpty
    | User
    | account_UpdateProfileRequest
    | account_UpdateUsernameRequest
    | account_ChangePhoneRequest;
  requestWriteAccess?: boolean;
}

export interface UrlAuthResultAccepted
  extends TLObjectType<"UrlAuthResultAccepted", 0x8f8c0e4e, 0x7765cb1e> {
  url: string;
}

export interface UrlAuthResultDefault
  extends TLObjectType<"UrlAuthResultDefault", 0xa9d6db1f, 0x7765cb1e> {}

export interface ChannelLocationEmpty
  extends TLObjectType<"ChannelLocationEmpty", 0xbfb5ad8b, 0xec260b7f> {}

export interface ChannelLocation
  extends TLObjectType<"ChannelLocation", 0x209b82db, 0xec260b7f> {
  address: string;
  geoPoint: GeoPointEmpty | GeoPoint;
}

export interface PeerLocated
  extends TLObjectType<"PeerLocated", 0xca461b5d, 0xfada34ac> {
  distance: number;
  expires: number;
  peer: PeerUser | PeerChat | PeerChannel;
}

export interface RestrictionReason
  extends TLObjectType<"RestrictionReason", 0xd072acb4, 0x6ad95ad> {
  text: string;
  reason: string;
  platform: string;
}

export interface InputTheme
  extends TLObjectType<"InputTheme", 0x3c5693e9, 0x7a100f0> {
  accessHash: bigint;
  id: bigint;
}

export interface InputThemeSlug
  extends TLObjectType<"InputThemeSlug", 0xf5890df1, 0x7a100f0> {
  slug: string;
}

export interface ThemeDocumentNotModified
  extends TLObjectType<"ThemeDocumentNotModified", 0x483d270c, 0x56b4c80c> {}

export interface Theme extends TLObjectType<"Theme", 0xf7d90ce0, 0x56b4c80c> {
  installsCount: number;
  title: string;
  slug: string;
  accessHash: bigint;
  id: bigint;
  creator?: boolean;
  default?: boolean;
  document?:
    | DocumentEmpty
    | Document
    | account_UploadThemeRequest
    | messages_GetDocumentByHashRequest;
}

export interface account_ThemesNotModified
  extends TLObjectType<"account_ThemesNotModified", 0xf41eb622, 0x7fc52204> {}

export interface account_Themes
  extends TLObjectType<"account_Themes", 0x7f676421, 0x7fc52204> {
  themes: (
    | ThemeDocumentNotModified
    | Theme
    | account_CreateThemeRequest
    | account_UpdateThemeRequest
    | account_GetThemeRequest
  )[];
  hash: number;
}

export interface InvokeAfterMsgRequest
  extends TLObjectType<"InvokeAfterMsgRequest", 0xcb9f372d, 0xb7b2364b> {
  query:
    | InvokeAfterMsgRequest
    | InvokeAfterMsgsRequest
    | InitConnectionRequest
    | InvokeWithLayerRequest
    | InvokeWithoutUpdatesRequest
    | InvokeWithMessagesRangeRequest
    | InvokeWithTakeoutRequest;
  msgId: bigint;
}

export interface InvokeAfterMsgsRequest
  extends TLObjectType<"InvokeAfterMsgsRequest", 0x3dc4b4f0, 0xb7b2364b> {
  query:
    | InvokeAfterMsgRequest
    | InvokeAfterMsgsRequest
    | InitConnectionRequest
    | InvokeWithLayerRequest
    | InvokeWithoutUpdatesRequest
    | InvokeWithMessagesRangeRequest
    | InvokeWithTakeoutRequest;
  msgIds: bigint[];
}

export interface InitConnectionRequest
  extends TLObjectType<"InitConnectionRequest", 0x785188b8, 0xb7b2364b> {
  query:
    | InvokeAfterMsgRequest
    | InvokeAfterMsgsRequest
    | InitConnectionRequest
    | InvokeWithLayerRequest
    | InvokeWithoutUpdatesRequest
    | InvokeWithMessagesRangeRequest
    | InvokeWithTakeoutRequest;
  langCode: string;
  langPack: string;
  systemLangCode: string;
  appVersion: string;
  systemVersion: string;
  deviceModel: string;
  apiId: number;
  proxy?: InputClientProxy;
}

export interface InvokeWithLayerRequest
  extends TLObjectType<"InvokeWithLayerRequest", 0xda9b0d0d, 0xb7b2364b> {
  query:
    | InvokeAfterMsgRequest
    | InvokeAfterMsgsRequest
    | InitConnectionRequest
    | InvokeWithLayerRequest
    | InvokeWithoutUpdatesRequest
    | InvokeWithMessagesRangeRequest
    | InvokeWithTakeoutRequest;
  layer: number;
}

export interface InvokeWithoutUpdatesRequest
  extends TLObjectType<"InvokeWithoutUpdatesRequest", 0xbf9459b7, 0xb7b2364b> {
  query:
    | InvokeAfterMsgRequest
    | InvokeAfterMsgsRequest
    | InitConnectionRequest
    | InvokeWithLayerRequest
    | InvokeWithoutUpdatesRequest
    | InvokeWithMessagesRangeRequest
    | InvokeWithTakeoutRequest;
}

export interface InvokeWithMessagesRangeRequest
  extends TLObjectType<
    "InvokeWithMessagesRangeRequest",
    0x365275f2,
    0xb7b2364b
  > {
  query:
    | InvokeAfterMsgRequest
    | InvokeAfterMsgsRequest
    | InitConnectionRequest
    | InvokeWithLayerRequest
    | InvokeWithoutUpdatesRequest
    | InvokeWithMessagesRangeRequest
    | InvokeWithTakeoutRequest;
  range: MessageRange;
}

export interface InvokeWithTakeoutRequest
  extends TLObjectType<"InvokeWithTakeoutRequest", 0xaca9fd2e, 0xb7b2364b> {
  query:
    | InvokeAfterMsgRequest
    | InvokeAfterMsgsRequest
    | InitConnectionRequest
    | InvokeWithLayerRequest
    | InvokeWithoutUpdatesRequest
    | InvokeWithMessagesRangeRequest
    | InvokeWithTakeoutRequest;
  takeoutId: bigint;
}

export interface auth_SendCodeRequest
  extends TLObjectType<"auth_SendCodeRequest", 0xa677244f, 0x6ce87081> {
  settings: CodeSettings;
  apiHash: string;
  apiId: number;
  phoneNumber: string;
}

export interface auth_SignUpRequest
  extends TLObjectType<"auth_SignUpRequest", 0x80eee427, 0xb9e04e39> {
  lastName: string;
  firstName: string;
  phoneCodeHash: string;
  phoneNumber: string;
}

export interface auth_SignInRequest
  extends TLObjectType<"auth_SignInRequest", 0xbcd51581, 0xb9e04e39> {
  phoneCode: string;
  phoneCodeHash: string;
  phoneNumber: string;
}

export interface auth_LogOutRequest
  extends TLObjectType<"auth_LogOutRequest", 0x5717da40, 0xf5b399ac> {}

export interface auth_ResetAuthorizationsRequest
  extends TLObjectType<
    "auth_ResetAuthorizationsRequest",
    0x9fab0d1a,
    0xf5b399ac
  > {}

export interface auth_ExportAuthorizationRequest
  extends TLObjectType<
    "auth_ExportAuthorizationRequest",
    0xe5bfffcd,
    0x5fd1ec51
  > {
  dcId: number;
}

export interface auth_ImportAuthorizationRequest
  extends TLObjectType<
    "auth_ImportAuthorizationRequest",
    0xe3ef9613,
    0xb9e04e39
  > {
  bytes: Uint8Array;
  id: number;
}

export interface auth_BindTempAuthKeyRequest
  extends TLObjectType<"auth_BindTempAuthKeyRequest", 0xcdd42a05, 0xf5b399ac> {
  encryptedMessage: Uint8Array;
  expiresAt: number;
  nonce: bigint;
  permAuthKeyId: bigint;
}

export interface auth_ImportBotAuthorizationRequest
  extends TLObjectType<
    "auth_ImportBotAuthorizationRequest",
    0x67a3ff2c,
    0xb9e04e39
  > {
  botAuthToken: string;
  apiHash: string;
  apiId: number;
  flags: number;
}

export interface auth_CheckPasswordRequest
  extends TLObjectType<"auth_CheckPasswordRequest", 0xd18b4d16, 0xb9e04e39> {
  password: InputCheckPasswordEmpty | InputCheckPasswordSRP;
}

export interface auth_RequestPasswordRecoveryRequest
  extends TLObjectType<
    "auth_RequestPasswordRecoveryRequest",
    0xd897bc66,
    0xfa72d43a
  > {}

export interface auth_RecoverPasswordRequest
  extends TLObjectType<"auth_RecoverPasswordRequest", 0x4ea56e92, 0xb9e04e39> {
  code: string;
}

export interface auth_ResendCodeRequest
  extends TLObjectType<"auth_ResendCodeRequest", 0x3ef1a9bf, 0x6ce87081> {
  phoneCodeHash: string;
  phoneNumber: string;
}

export interface auth_CancelCodeRequest
  extends TLObjectType<"auth_CancelCodeRequest", 0x1f040578, 0xf5b399ac> {
  phoneCodeHash: string;
  phoneNumber: string;
}

export interface auth_DropTempAuthKeysRequest
  extends TLObjectType<"auth_DropTempAuthKeysRequest", 0x8e48a188, 0xf5b399ac> {
  exceptAuthKeys: bigint[];
}

export interface account_RegisterDeviceRequest
  extends TLObjectType<
    "account_RegisterDeviceRequest",
    0x68976c6f,
    0xf5b399ac
  > {
  otherUids: number[];
  secret: Uint8Array;
  appSandbox: boolean;
  token: string;
  tokenType: number;
  noMuted?: boolean;
}

export interface account_UnregisterDeviceRequest
  extends TLObjectType<
    "account_UnregisterDeviceRequest",
    0x3076c4bf,
    0xf5b399ac
  > {
  otherUids: number[];
  token: string;
  tokenType: number;
}

export interface account_UpdateNotifySettingsRequest
  extends TLObjectType<
    "account_UpdateNotifySettingsRequest",
    0x84be5b93,
    0xf5b399ac
  > {
  settings: InputPeerNotifySettings;
  peer:
    | InputNotifyPeer
    | InputNotifyUsers
    | InputNotifyChats
    | InputNotifyBroadcasts;
}

export interface account_GetNotifySettingsRequest
  extends TLObjectType<
    "account_GetNotifySettingsRequest",
    0x12b3ad31,
    0xcf20c074
  > {
  peer:
    | InputNotifyPeer
    | InputNotifyUsers
    | InputNotifyChats
    | InputNotifyBroadcasts;
}

export interface account_ResetNotifySettingsRequest
  extends TLObjectType<
    "account_ResetNotifySettingsRequest",
    0xdb7e1747,
    0xf5b399ac
  > {}

export interface account_UpdateProfileRequest
  extends TLObjectType<"account_UpdateProfileRequest", 0x78515775, 0x2da17977> {
  firstName?: string;
  lastName?: string;
  about?: string;
}

export interface account_UpdateStatusRequest
  extends TLObjectType<"account_UpdateStatusRequest", 0x6628562c, 0xf5b399ac> {
  offline: boolean;
}

export interface account_GetWallPapersRequest
  extends TLObjectType<"account_GetWallPapersRequest", 0xaabb1763, 0xa2c548fd> {
  hash: number;
}

export interface account_ReportPeerRequest
  extends TLObjectType<"account_ReportPeerRequest", 0xae189d5f, 0xf5b399ac> {
  reason:
    | InputReportReasonSpam
    | InputReportReasonViolence
    | InputReportReasonPornography
    | InputReportReasonChildAbuse
    | InputReportReasonOther
    | InputReportReasonCopyright
    | InputReportReasonGeoIrrelevant;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface account_CheckUsernameRequest
  extends TLObjectType<"account_CheckUsernameRequest", 0x2714d86c, 0xf5b399ac> {
  username: string;
}

export interface account_UpdateUsernameRequest
  extends TLObjectType<
    "account_UpdateUsernameRequest",
    0x3e0bdd7c,
    0x2da17977
  > {
  username: string;
}

export interface account_GetPrivacyRequest
  extends TLObjectType<"account_GetPrivacyRequest", 0xdadbc950, 0xb55aba82> {
  key:
    | InputPrivacyKeyStatusTimestamp
    | InputPrivacyKeyChatInvite
    | InputPrivacyKeyPhoneCall
    | InputPrivacyKeyPhoneP2P
    | InputPrivacyKeyForwards
    | InputPrivacyKeyProfilePhoto
    | InputPrivacyKeyPhoneNumber
    | InputPrivacyKeyAddedByPhone;
}

export interface account_SetPrivacyRequest
  extends TLObjectType<"account_SetPrivacyRequest", 0xc9f81ce8, 0xb55aba82> {
  rules: (
    | InputPrivacyValueAllowContacts
    | InputPrivacyValueAllowAll
    | InputPrivacyValueAllowUsers
    | InputPrivacyValueDisallowContacts
    | InputPrivacyValueDisallowAll
    | InputPrivacyValueDisallowUsers
    | InputPrivacyValueAllowChatParticipants
    | InputPrivacyValueDisallowChatParticipants
  )[];
  key:
    | InputPrivacyKeyStatusTimestamp
    | InputPrivacyKeyChatInvite
    | InputPrivacyKeyPhoneCall
    | InputPrivacyKeyPhoneP2P
    | InputPrivacyKeyForwards
    | InputPrivacyKeyProfilePhoto
    | InputPrivacyKeyPhoneNumber
    | InputPrivacyKeyAddedByPhone;
}

export interface account_DeleteAccountRequest
  extends TLObjectType<"account_DeleteAccountRequest", 0x418d4e0b, 0xf5b399ac> {
  reason: string;
}

export interface account_GetAccountTTLRequest
  extends TLObjectType<
    "account_GetAccountTTLRequest",
    0x08fc711d,
    0xbaa39d88
  > {}

export interface account_SetAccountTTLRequest
  extends TLObjectType<"account_SetAccountTTLRequest", 0x2442485e, 0xf5b399ac> {
  ttl: AccountDaysTTL | account_GetAccountTTLRequest;
}

export interface account_SendChangePhoneCodeRequest
  extends TLObjectType<
    "account_SendChangePhoneCodeRequest",
    0x82574ae5,
    0x6ce87081
  > {
  settings: CodeSettings;
  phoneNumber: string;
}

export interface account_ChangePhoneRequest
  extends TLObjectType<"account_ChangePhoneRequest", 0x70c32edb, 0x2da17977> {
  phoneCode: string;
  phoneCodeHash: string;
  phoneNumber: string;
}

export interface account_UpdateDeviceLockedRequest
  extends TLObjectType<
    "account_UpdateDeviceLockedRequest",
    0x38df3532,
    0xf5b399ac
  > {
  period: number;
}

export interface account_GetAuthorizationsRequest
  extends TLObjectType<
    "account_GetAuthorizationsRequest",
    0xe320c158,
    0xbf5e0ff
  > {}

export interface account_ResetAuthorizationRequest
  extends TLObjectType<
    "account_ResetAuthorizationRequest",
    0xdf77f3bc,
    0xf5b399ac
  > {
  hash: bigint;
}

export interface account_GetPasswordRequest
  extends TLObjectType<"account_GetPasswordRequest", 0x548a30f5, 0x53a211a3> {}

export interface account_GetPasswordSettingsRequest
  extends TLObjectType<
    "account_GetPasswordSettingsRequest",
    0x9cd4eaf9,
    0xd23fb078
  > {
  password: InputCheckPasswordEmpty | InputCheckPasswordSRP;
}

export interface account_UpdatePasswordSettingsRequest
  extends TLObjectType<
    "account_UpdatePasswordSettingsRequest",
    0xa59b102f,
    0xf5b399ac
  > {
  newSettings: account_PasswordInputSettings;
  password: InputCheckPasswordEmpty | InputCheckPasswordSRP;
}

export interface account_SendConfirmPhoneCodeRequest
  extends TLObjectType<
    "account_SendConfirmPhoneCodeRequest",
    0x1b3faa88,
    0x6ce87081
  > {
  settings: CodeSettings;
  hash: string;
}

export interface account_ConfirmPhoneRequest
  extends TLObjectType<"account_ConfirmPhoneRequest", 0x5f2178c3, 0xf5b399ac> {
  phoneCode: string;
  phoneCodeHash: string;
}

export interface account_GetTmpPasswordRequest
  extends TLObjectType<
    "account_GetTmpPasswordRequest",
    0x449e0b51,
    0xb064992d
  > {
  period: number;
  password: InputCheckPasswordEmpty | InputCheckPasswordSRP;
}

export interface account_GetWebAuthorizationsRequest
  extends TLObjectType<
    "account_GetWebAuthorizationsRequest",
    0x182e6d6f,
    0x9a365b32
  > {}

export interface account_ResetWebAuthorizationRequest
  extends TLObjectType<
    "account_ResetWebAuthorizationRequest",
    0x2d01b9ef,
    0xf5b399ac
  > {
  hash: bigint;
}

export interface account_ResetWebAuthorizationsRequest
  extends TLObjectType<
    "account_ResetWebAuthorizationsRequest",
    0x682d2594,
    0xf5b399ac
  > {}

export interface account_GetAllSecureValuesRequest
  extends TLObjectType<
    "account_GetAllSecureValuesRequest",
    0xb288bc7d,
    0xe82e4121
  > {}

export interface account_GetSecureValueRequest
  extends TLObjectType<
    "account_GetSecureValueRequest",
    0x73665bc2,
    0xe82e4121
  > {
  types: (
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail
  )[];
}

export interface account_SaveSecureValueRequest
  extends TLObjectType<
    "account_SaveSecureValueRequest",
    0x899fe31d,
    0x51138ae
  > {
  secureSecretId: bigint;
  value: InputSecureValue;
}

export interface account_DeleteSecureValueRequest
  extends TLObjectType<
    "account_DeleteSecureValueRequest",
    0xb880bc4b,
    0xf5b399ac
  > {
  types: (
    | SecureValueTypePersonalDetails
    | SecureValueTypePassport
    | SecureValueTypeDriverLicense
    | SecureValueTypeIdentityCard
    | SecureValueTypeInternalPassport
    | SecureValueTypeAddress
    | SecureValueTypeUtilityBill
    | SecureValueTypeBankStatement
    | SecureValueTypeRentalAgreement
    | SecureValueTypePassportRegistration
    | SecureValueTypeTemporaryRegistration
    | SecureValueTypePhone
    | SecureValueTypeEmail
  )[];
}

export interface account_GetAuthorizationFormRequest
  extends TLObjectType<
    "account_GetAuthorizationFormRequest",
    0xb86ba8e1,
    0x78049a94
  > {
  publicKey: string;
  scope: string;
  botId: number;
}

export interface account_AcceptAuthorizationRequest
  extends TLObjectType<
    "account_AcceptAuthorizationRequest",
    0xe7027c94,
    0xf5b399ac
  > {
  credentials: SecureCredentialsEncrypted;
  valueHashes: SecureValueHash[];
  publicKey: string;
  scope: string;
  botId: number;
}

export interface account_SendVerifyPhoneCodeRequest
  extends TLObjectType<
    "account_SendVerifyPhoneCodeRequest",
    0xa5a356f9,
    0x6ce87081
  > {
  settings: CodeSettings;
  phoneNumber: string;
}

export interface account_VerifyPhoneRequest
  extends TLObjectType<"account_VerifyPhoneRequest", 0x4dd3a7f6, 0xf5b399ac> {
  phoneCode: string;
  phoneCodeHash: string;
  phoneNumber: string;
}

export interface account_SendVerifyEmailCodeRequest
  extends TLObjectType<
    "account_SendVerifyEmailCodeRequest",
    0x7011509f,
    0x69f3c06e
  > {
  email: string;
}

export interface account_VerifyEmailRequest
  extends TLObjectType<"account_VerifyEmailRequest", 0xecba39db, 0xf5b399ac> {
  code: string;
  email: string;
}

export interface account_InitTakeoutSessionRequest
  extends TLObjectType<
    "account_InitTakeoutSessionRequest",
    0xf05b4804,
    0x843ebe85
  > {
  contacts?: boolean;
  messageUsers?: boolean;
  messageChats?: boolean;
  messageMegagroups?: boolean;
  messageChannels?: boolean;
  files?: boolean;
  fileMaxSize?: number;
}

export interface account_FinishTakeoutSessionRequest
  extends TLObjectType<
    "account_FinishTakeoutSessionRequest",
    0x1d2652ee,
    0xf5b399ac
  > {
  success?: boolean;
}

export interface account_ConfirmPasswordEmailRequest
  extends TLObjectType<
    "account_ConfirmPasswordEmailRequest",
    0x8fdf1920,
    0xf5b399ac
  > {
  code: string;
}

export interface account_ResendPasswordEmailRequest
  extends TLObjectType<
    "account_ResendPasswordEmailRequest",
    0x7a7f2a15,
    0xf5b399ac
  > {}

export interface account_CancelPasswordEmailRequest
  extends TLObjectType<
    "account_CancelPasswordEmailRequest",
    0xc1cbd5b6,
    0xf5b399ac
  > {}

export interface account_GetContactSignUpNotificationRequest
  extends TLObjectType<
    "account_GetContactSignUpNotificationRequest",
    0x9f07c728,
    0xf5b399ac
  > {}

export interface account_SetContactSignUpNotificationRequest
  extends TLObjectType<
    "account_SetContactSignUpNotificationRequest",
    0xcff43f61,
    0xf5b399ac
  > {
  silent: boolean;
}

export interface account_GetNotifyExceptionsRequest
  extends TLObjectType<
    "account_GetNotifyExceptionsRequest",
    0x53577479,
    0x8af52aac
  > {
  compareSound?: boolean;
  peer?:
    | InputNotifyPeer
    | InputNotifyUsers
    | InputNotifyChats
    | InputNotifyBroadcasts;
}

export interface account_GetWallPaperRequest
  extends TLObjectType<"account_GetWallPaperRequest", 0xfc8ddbea, 0x96a2c98b> {
  wallpaper: InputWallPaper | InputWallPaperSlug;
}

export interface account_UploadWallPaperRequest
  extends TLObjectType<
    "account_UploadWallPaperRequest",
    0xdd853661,
    0x96a2c98b
  > {
  settings: WallPaperSettings;
  mimeType: string;
  file: InputFile | InputFileBig;
}

export interface account_SaveWallPaperRequest
  extends TLObjectType<"account_SaveWallPaperRequest", 0x6c5a5b37, 0xf5b399ac> {
  settings: WallPaperSettings;
  unsave: boolean;
  wallpaper: InputWallPaper | InputWallPaperSlug;
}

export interface account_InstallWallPaperRequest
  extends TLObjectType<
    "account_InstallWallPaperRequest",
    0xfeed5769,
    0xf5b399ac
  > {
  settings: WallPaperSettings;
  wallpaper: InputWallPaper | InputWallPaperSlug;
}

export interface account_ResetWallPapersRequest
  extends TLObjectType<
    "account_ResetWallPapersRequest",
    0xbb3b9804,
    0xf5b399ac
  > {}

export interface account_GetAutoDownloadSettingsRequest
  extends TLObjectType<
    "account_GetAutoDownloadSettingsRequest",
    0x56da0b3f,
    0x2fb85921
  > {}

export interface account_SaveAutoDownloadSettingsRequest
  extends TLObjectType<
    "account_SaveAutoDownloadSettingsRequest",
    0x76f36233,
    0xf5b399ac
  > {
  settings: AutoDownloadSettings;
  low?: boolean;
  high?: boolean;
}

export interface account_UploadThemeRequest
  extends TLObjectType<"account_UploadThemeRequest", 0x1c3db333, 0x211fe820> {
  mimeType: string;
  fileName: string;
  file: InputFile | InputFileBig;
  thumb?: InputFile | InputFileBig;
}

export interface account_CreateThemeRequest
  extends TLObjectType<"account_CreateThemeRequest", 0x2b7ffd7f, 0x56b4c80c> {
  document: InputDocumentEmpty | InputDocument;
  title: string;
  slug: string;
}

export interface account_UpdateThemeRequest
  extends TLObjectType<"account_UpdateThemeRequest", 0x3b8ea202, 0x56b4c80c> {
  theme: InputTheme | InputThemeSlug;
  format: string;
  slug?: string;
  title?: string;
  document?: InputDocumentEmpty | InputDocument;
}

export interface account_SaveThemeRequest
  extends TLObjectType<"account_SaveThemeRequest", 0xf257106c, 0xf5b399ac> {
  unsave: boolean;
  theme: InputTheme | InputThemeSlug;
}

export interface account_InstallThemeRequest
  extends TLObjectType<"account_InstallThemeRequest", 0x7ae43737, 0xf5b399ac> {
  dark?: boolean;
  format?: string;
  theme?: InputTheme | InputThemeSlug;
}

export interface account_GetThemeRequest
  extends TLObjectType<"account_GetThemeRequest", 0x8d9d742b, 0x56b4c80c> {
  documentId: bigint;
  theme: InputTheme | InputThemeSlug;
  format: string;
}

export interface account_GetThemesRequest
  extends TLObjectType<"account_GetThemesRequest", 0x285946f8, 0x7fc52204> {
  hash: number;
  format: string;
}

export interface users_GetUsersRequest
  extends TLObjectType<"users_GetUsersRequest", 0x0d91a548, 0x406da4d> {
  id: (InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage)[];
}

export interface users_GetFullUserRequest
  extends TLObjectType<"users_GetFullUserRequest", 0xca30a5b1, 0x1f4661b9> {
  id: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface users_SetSecureValueErrorsRequest
  extends TLObjectType<
    "users_SetSecureValueErrorsRequest",
    0x90c894b5,
    0xf5b399ac
  > {
  errors: (
    | SecureValueErrorData
    | SecureValueErrorFrontSide
    | SecureValueErrorReverseSide
    | SecureValueErrorSelfie
    | SecureValueErrorFile
    | SecureValueErrorFiles
    | SecureValueError
    | SecureValueErrorTranslationFile
    | SecureValueErrorTranslationFiles
  )[];
  id: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface contacts_GetContactIDsRequest
  extends TLObjectType<
    "contacts_GetContactIDsRequest",
    0x2caa4a42,
    0x5026710f
  > {
  hash: number;
}

export interface contacts_GetStatusesRequest
  extends TLObjectType<"contacts_GetStatusesRequest", 0xc4a353ee, 0xdf815c90> {}

export interface contacts_GetContactsRequest
  extends TLObjectType<"contacts_GetContactsRequest", 0xc023849f, 0x38be25f6> {
  hash: number;
}

export interface contacts_ImportContactsRequest
  extends TLObjectType<
    "contacts_ImportContactsRequest",
    0x2c800be5,
    0x8172ad93
  > {
  contacts: InputPhoneContact[];
}

export interface contacts_DeleteContactsRequest
  extends TLObjectType<
    "contacts_DeleteContactsRequest",
    0x096a0e00,
    0x8af52aac
  > {
  id: (InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage)[];
}

export interface contacts_DeleteByPhonesRequest
  extends TLObjectType<
    "contacts_DeleteByPhonesRequest",
    0x1013fd9e,
    0xf5b399ac
  > {
  phones: string[];
}

export interface contacts_BlockRequest
  extends TLObjectType<"contacts_BlockRequest", 0x332b49fc, 0xf5b399ac> {
  id: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface contacts_UnblockRequest
  extends TLObjectType<"contacts_UnblockRequest", 0xe54100bd, 0xf5b399ac> {
  id: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface contacts_GetBlockedRequest
  extends TLObjectType<"contacts_GetBlockedRequest", 0xf57c350f, 0xffba4f4f> {
  limit: number;
  offset: number;
}

export interface contacts_SearchRequest
  extends TLObjectType<"contacts_SearchRequest", 0x11f812d8, 0x4386a2e3> {
  limit: number;
  q: string;
}

export interface contacts_ResolveUsernameRequest
  extends TLObjectType<
    "contacts_ResolveUsernameRequest",
    0xf93ccba3,
    0xf065b3a8
  > {
  username: string;
}

export interface contacts_GetTopPeersRequest
  extends TLObjectType<"contacts_GetTopPeersRequest", 0xd4982db5, 0x9ee8bb88> {
  hash: number;
  limit: number;
  offset: number;
  correspondents?: boolean;
  botsPm?: boolean;
  botsInline?: boolean;
  phoneCalls?: boolean;
  forwardUsers?: boolean;
  forwardChats?: boolean;
  groups?: boolean;
  channels?: boolean;
}

export interface contacts_ResetTopPeerRatingRequest
  extends TLObjectType<
    "contacts_ResetTopPeerRatingRequest",
    0x1ae373ac,
    0xf5b399ac
  > {
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  category:
    | TopPeerCategoryBotsPM
    | TopPeerCategoryBotsInline
    | TopPeerCategoryCorrespondents
    | TopPeerCategoryGroups
    | TopPeerCategoryChannels
    | TopPeerCategoryPhoneCalls
    | TopPeerCategoryForwardUsers
    | TopPeerCategoryForwardChats;
}

export interface contacts_ResetSavedRequest
  extends TLObjectType<"contacts_ResetSavedRequest", 0x879537f1, 0xf5b399ac> {}

export interface contacts_GetSavedRequest
  extends TLObjectType<"contacts_GetSavedRequest", 0x82f1e39f, 0x975dbef> {}

export interface contacts_ToggleTopPeersRequest
  extends TLObjectType<
    "contacts_ToggleTopPeersRequest",
    0x8514bdda,
    0xf5b399ac
  > {
  enabled: boolean;
}

export interface contacts_AddContactRequest
  extends TLObjectType<"contacts_AddContactRequest", 0xe8f463d0, 0x8af52aac> {
  phone: string;
  lastName: string;
  firstName: string;
  id: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  addPhonePrivacyException?: boolean;
}

export interface contacts_AcceptContactRequest
  extends TLObjectType<
    "contacts_AcceptContactRequest",
    0xf831a20f,
    0x8af52aac
  > {
  id: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface contacts_GetLocatedRequest
  extends TLObjectType<"contacts_GetLocatedRequest", 0x0a356056, 0x8af52aac> {
  geoPoint: InputGeoPointEmpty | InputGeoPoint;
}

export interface messages_GetMessagesRequest
  extends TLObjectType<"messages_GetMessagesRequest", 0x63c66506, 0xd4b40b5e> {
  id: (InputMessageID | InputMessageReplyTo | InputMessagePinned)[];
}

export interface messages_GetDialogsRequest
  extends TLObjectType<"messages_GetDialogsRequest", 0xa0ee3b73, 0xe1b52ee> {
  hash: number;
  limit: number;
  offsetPeer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  offsetId: number;
  offsetDate: number;
  excludePinned?: boolean;
  folderId?: number;
}

export interface messages_GetHistoryRequest
  extends TLObjectType<"messages_GetHistoryRequest", 0xdcbb8260, 0xd4b40b5e> {
  hash: number;
  minId: number;
  maxId: number;
  limit: number;
  addOffset: number;
  offsetDate: number;
  offsetId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_SearchRequest
  extends TLObjectType<"messages_SearchRequest", 0x8614ef68, 0xd4b40b5e> {
  hash: number;
  minId: number;
  maxId: number;
  limit: number;
  addOffset: number;
  offsetId: number;
  maxDate: number;
  minDate: number;
  filter:
    | InputMessagesFilterEmpty
    | InputMessagesFilterPhotos
    | InputMessagesFilterVideo
    | InputMessagesFilterPhotoVideo
    | InputMessagesFilterDocument
    | InputMessagesFilterUrl
    | InputMessagesFilterGif
    | InputMessagesFilterVoice
    | InputMessagesFilterMusic
    | InputMessagesFilterChatPhotos
    | InputMessagesFilterPhoneCalls
    | InputMessagesFilterRoundVoice
    | InputMessagesFilterRoundVideo
    | InputMessagesFilterMyMentions
    | InputMessagesFilterGeo
    | InputMessagesFilterContacts;
  q: string;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  fromId?: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface messages_ReadHistoryRequest
  extends TLObjectType<"messages_ReadHistoryRequest", 0x0e306d3a, 0xced3c06e> {
  maxId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_DeleteHistoryRequest
  extends TLObjectType<
    "messages_DeleteHistoryRequest",
    0x1c015b09,
    0x2c49c116
  > {
  maxId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  justClear?: boolean;
  revoke?: boolean;
}

export interface messages_DeleteMessagesRequest
  extends TLObjectType<
    "messages_DeleteMessagesRequest",
    0xe58e95d2,
    0xced3c06e
  > {
  id: number[];
  revoke?: boolean;
}

export interface messages_ReceivedMessagesRequest
  extends TLObjectType<
    "messages_ReceivedMessagesRequest",
    0x05a954c0,
    0x8565f897
  > {
  maxId: number;
}

export interface messages_SetTypingRequest
  extends TLObjectType<"messages_SetTypingRequest", 0xa3825e50, 0xf5b399ac> {
  action:
    | SendMessageTypingAction
    | SendMessageCancelAction
    | SendMessageRecordVideoAction
    | SendMessageUploadVideoAction
    | SendMessageRecordAudioAction
    | SendMessageUploadAudioAction
    | SendMessageUploadPhotoAction
    | SendMessageUploadDocumentAction
    | SendMessageGeoLocationAction
    | SendMessageChooseContactAction
    | SendMessageGamePlayAction
    | SendMessageRecordRoundAction
    | SendMessageUploadRoundAction;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_SendMessageRequest
  extends TLObjectType<"messages_SendMessageRequest", 0x520c3870, 0x8af52aac> {
  message: string;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  noWebpage?: boolean;
  silent?: boolean;
  background?: boolean;
  clearDraft?: boolean;
  replyToMsgId?: number;
  randomId?: bigint;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  scheduleDate?: number;
}

export interface messages_SendMediaRequest
  extends TLObjectType<"messages_SendMediaRequest", 0x3491eba9, 0x8af52aac> {
  message: string;
  media:
    | InputMediaEmpty
    | InputMediaUploadedPhoto
    | InputMediaPhoto
    | InputMediaGeoPoint
    | InputMediaContact
    | InputMediaUploadedDocument
    | InputMediaDocument
    | InputMediaVenue
    | InputMediaGifExternal
    | InputMediaPhotoExternal
    | InputMediaDocumentExternal
    | InputMediaGame
    | InputMediaInvoice
    | InputMediaGeoLive
    | InputMediaPoll;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  silent?: boolean;
  background?: boolean;
  clearDraft?: boolean;
  replyToMsgId?: number;
  randomId?: bigint;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  scheduleDate?: number;
}

export interface messages_ForwardMessagesRequest
  extends TLObjectType<
    "messages_ForwardMessagesRequest",
    0xd9fee60e,
    0x8af52aac
  > {
  toPeer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  id: number[];
  fromPeer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  silent?: boolean;
  background?: boolean;
  withMyScore?: boolean;
  grouped?: boolean;
  randomId?: bigint[];
  scheduleDate?: number;
}

export interface messages_ReportSpamRequest
  extends TLObjectType<"messages_ReportSpamRequest", 0xcf1592db, 0xf5b399ac> {
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_GetPeerSettingsRequest
  extends TLObjectType<
    "messages_GetPeerSettingsRequest",
    0x3672e09c,
    0xf6a79f84
  > {
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_ReportRequest
  extends TLObjectType<"messages_ReportRequest", 0xbd82b658, 0xf5b399ac> {
  reason:
    | InputReportReasonSpam
    | InputReportReasonViolence
    | InputReportReasonPornography
    | InputReportReasonChildAbuse
    | InputReportReasonOther
    | InputReportReasonCopyright
    | InputReportReasonGeoIrrelevant;
  id: number[];
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_GetChatsRequest
  extends TLObjectType<"messages_GetChatsRequest", 0x3c6aa187, 0x99d5cb14> {
  id: number[];
}

export interface messages_GetFullChatRequest
  extends TLObjectType<"messages_GetFullChatRequest", 0x3b831c66, 0x225a5109> {
  chatId: number;
}

export interface messages_EditChatTitleRequest
  extends TLObjectType<
    "messages_EditChatTitleRequest",
    0xdc452855,
    0x8af52aac
  > {
  title: string;
  chatId: number;
}

export interface messages_EditChatPhotoRequest
  extends TLObjectType<
    "messages_EditChatPhotoRequest",
    0xca4c79d8,
    0x8af52aac
  > {
  photo: InputChatPhotoEmpty | InputChatUploadedPhoto | InputChatPhoto;
  chatId: number;
}

export interface messages_AddChatUserRequest
  extends TLObjectType<"messages_AddChatUserRequest", 0xf9a0aa09, 0x8af52aac> {
  fwdLimit: number;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  chatId: number;
}

export interface messages_DeleteChatUserRequest
  extends TLObjectType<
    "messages_DeleteChatUserRequest",
    0xe0611f16,
    0x8af52aac
  > {
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  chatId: number;
}

export interface messages_CreateChatRequest
  extends TLObjectType<"messages_CreateChatRequest", 0x09cb126e, 0x8af52aac> {
  title: string;
  users: (InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage)[];
}

export interface messages_GetDhConfigRequest
  extends TLObjectType<"messages_GetDhConfigRequest", 0x26cf8950, 0xe488ed8b> {
  randomLength: number;
  version: number;
}

export interface messages_RequestEncryptionRequest
  extends TLObjectType<
    "messages_RequestEncryptionRequest",
    0xf64daf43,
    0x6d28a37a
  > {
  gA: Uint8Array;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  randomId?: number;
}

export interface messages_AcceptEncryptionRequest
  extends TLObjectType<
    "messages_AcceptEncryptionRequest",
    0x3dbc0415,
    0x6d28a37a
  > {
  keyFingerprint: bigint;
  gB: Uint8Array;
  peer: InputEncryptedChat;
}

export interface messages_DiscardEncryptionRequest
  extends TLObjectType<
    "messages_DiscardEncryptionRequest",
    0xedd923c5,
    0xf5b399ac
  > {
  chatId: number;
}

export interface messages_SetEncryptedTypingRequest
  extends TLObjectType<
    "messages_SetEncryptedTypingRequest",
    0x791451ed,
    0xf5b399ac
  > {
  typing: boolean;
  peer: InputEncryptedChat;
}

export interface messages_ReadEncryptedHistoryRequest
  extends TLObjectType<
    "messages_ReadEncryptedHistoryRequest",
    0x7f4b690a,
    0xf5b399ac
  > {
  maxDate: number;
  peer: InputEncryptedChat;
}

export interface messages_SendEncryptedRequest
  extends TLObjectType<
    "messages_SendEncryptedRequest",
    0xa9776773,
    0xc99e3e50
  > {
  data: Uint8Array;
  peer: InputEncryptedChat;
  randomId?: bigint;
}

export interface messages_SendEncryptedFileRequest
  extends TLObjectType<
    "messages_SendEncryptedFileRequest",
    0x9a901b66,
    0xc99e3e50
  > {
  file:
    | InputEncryptedFileEmpty
    | InputEncryptedFileUploaded
    | InputEncryptedFile
    | InputEncryptedFileBigUploaded;
  data: Uint8Array;
  peer: InputEncryptedChat;
  randomId?: bigint;
}

export interface messages_SendEncryptedServiceRequest
  extends TLObjectType<
    "messages_SendEncryptedServiceRequest",
    0x32d439a4,
    0xc99e3e50
  > {
  data: Uint8Array;
  peer: InputEncryptedChat;
  randomId?: bigint;
}

export interface messages_ReceivedQueueRequest
  extends TLObjectType<
    "messages_ReceivedQueueRequest",
    0x55a5bb66,
    0x8918e168
  > {
  maxQts: number;
}

export interface messages_ReportEncryptedSpamRequest
  extends TLObjectType<
    "messages_ReportEncryptedSpamRequest",
    0x4b0c8c0f,
    0xf5b399ac
  > {
  peer: InputEncryptedChat;
}

export interface messages_ReadMessageContentsRequest
  extends TLObjectType<
    "messages_ReadMessageContentsRequest",
    0x36a73f77,
    0xced3c06e
  > {
  id: number[];
}

export interface messages_GetStickersRequest
  extends TLObjectType<"messages_GetStickersRequest", 0x043d4f2c, 0xd73bb9de> {
  hash: number;
  emoticon: string;
}

export interface messages_GetAllStickersRequest
  extends TLObjectType<
    "messages_GetAllStickersRequest",
    0x1c9618b1,
    0x45834829
  > {
  hash: number;
}

export interface messages_GetWebPagePreviewRequest
  extends TLObjectType<
    "messages_GetWebPagePreviewRequest",
    0x8b68b0cc,
    0x476cbe32
  > {
  message: string;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
}

export interface messages_ExportChatInviteRequest
  extends TLObjectType<
    "messages_ExportChatInviteRequest",
    0x0df7534c,
    0xb4748a58
  > {
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_CheckChatInviteRequest
  extends TLObjectType<
    "messages_CheckChatInviteRequest",
    0x3eadb1bb,
    0x4561736
  > {
  hash: string;
}

export interface messages_ImportChatInviteRequest
  extends TLObjectType<
    "messages_ImportChatInviteRequest",
    0x6c50051c,
    0x8af52aac
  > {
  hash: string;
}

export interface messages_GetStickerSetRequest
  extends TLObjectType<
    "messages_GetStickerSetRequest",
    0x2619a90e,
    0x9b704a5a
  > {
  stickerset:
    | InputStickerSetEmpty
    | InputStickerSetID
    | InputStickerSetShortName
    | InputStickerSetAnimatedEmoji;
}

export interface messages_InstallStickerSetRequest
  extends TLObjectType<
    "messages_InstallStickerSetRequest",
    0xc78fe460,
    0x67cb3fe8
  > {
  archived: boolean;
  stickerset:
    | InputStickerSetEmpty
    | InputStickerSetID
    | InputStickerSetShortName
    | InputStickerSetAnimatedEmoji;
}

export interface messages_UninstallStickerSetRequest
  extends TLObjectType<
    "messages_UninstallStickerSetRequest",
    0xf96e55de,
    0xf5b399ac
  > {
  stickerset:
    | InputStickerSetEmpty
    | InputStickerSetID
    | InputStickerSetShortName
    | InputStickerSetAnimatedEmoji;
}

export interface messages_StartBotRequest
  extends TLObjectType<"messages_StartBotRequest", 0xe6df7378, 0x8af52aac> {
  startParam: string;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  bot: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  randomId?: bigint;
}

export interface messages_GetMessagesViewsRequest
  extends TLObjectType<
    "messages_GetMessagesViewsRequest",
    0xc4c8a55d,
    0x5026710f
  > {
  increment: boolean;
  id: number[];
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_EditChatAdminRequest
  extends TLObjectType<
    "messages_EditChatAdminRequest",
    0xa9e69f2e,
    0xf5b399ac
  > {
  isAdmin: boolean;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  chatId: number;
}

export interface messages_MigrateChatRequest
  extends TLObjectType<"messages_MigrateChatRequest", 0x15a3b8e3, 0x8af52aac> {
  chatId: number;
}

export interface messages_SearchGlobalRequest
  extends TLObjectType<"messages_SearchGlobalRequest", 0xbf7225a4, 0xd4b40b5e> {
  limit: number;
  offsetId: number;
  offsetPeer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  offsetRate: number;
  q: string;
  folderId?: number;
}

export interface messages_ReorderStickerSetsRequest
  extends TLObjectType<
    "messages_ReorderStickerSetsRequest",
    0x78337739,
    0xf5b399ac
  > {
  order: bigint[];
  masks?: boolean;
}

export interface messages_GetDocumentByHashRequest
  extends TLObjectType<
    "messages_GetDocumentByHashRequest",
    0x338e2464,
    0x211fe820
  > {
  mimeType: string;
  size: number;
  sha256: Uint8Array;
}

export interface messages_SearchGifsRequest
  extends TLObjectType<"messages_SearchGifsRequest", 0xbf9a776b, 0xe799ea7> {
  offset: number;
  q: string;
}

export interface messages_GetSavedGifsRequest
  extends TLObjectType<"messages_GetSavedGifsRequest", 0x83bf3d52, 0xa68b61f5> {
  hash: number;
}

export interface messages_SaveGifRequest
  extends TLObjectType<"messages_SaveGifRequest", 0x327a30cb, 0xf5b399ac> {
  unsave: boolean;
  id: InputDocumentEmpty | InputDocument;
}

export interface messages_GetInlineBotResultsRequest
  extends TLObjectType<
    "messages_GetInlineBotResultsRequest",
    0x514e999d,
    0x3ed4d9c9
  > {
  offset: string;
  query: string;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  bot: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  geoPoint?: InputGeoPointEmpty | InputGeoPoint;
}

export interface messages_SetInlineBotResultsRequest
  extends TLObjectType<
    "messages_SetInlineBotResultsRequest",
    0xeb5ea206,
    0xf5b399ac
  > {
  cacheTime: number;
  results: (
    | InputBotInlineResult
    | InputBotInlineResultPhoto
    | InputBotInlineResultDocument
    | InputBotInlineResultGame
  )[];
  queryId: bigint;
  gallery?: boolean;
  private?: boolean;
  nextOffset?: string;
  switchPm?: InlineBotSwitchPM;
}

export interface messages_SendInlineBotResultRequest
  extends TLObjectType<
    "messages_SendInlineBotResultRequest",
    0x220815b0,
    0x8af52aac
  > {
  id: string;
  queryId: bigint;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  silent?: boolean;
  background?: boolean;
  clearDraft?: boolean;
  hideVia?: boolean;
  replyToMsgId?: number;
  randomId?: bigint;
  scheduleDate?: number;
}

export interface messages_GetMessageEditDataRequest
  extends TLObjectType<
    "messages_GetMessageEditDataRequest",
    0xfda68d36,
    0xfb47949d
  > {
  id: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_EditMessageRequest
  extends TLObjectType<"messages_EditMessageRequest", 0x48f71778, 0x8af52aac> {
  id: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  noWebpage?: boolean;
  message?: string;
  media?:
    | InputMediaEmpty
    | InputMediaUploadedPhoto
    | InputMediaPhoto
    | InputMediaGeoPoint
    | InputMediaContact
    | InputMediaUploadedDocument
    | InputMediaDocument
    | InputMediaVenue
    | InputMediaGifExternal
    | InputMediaPhotoExternal
    | InputMediaDocumentExternal
    | InputMediaGame
    | InputMediaInvoice
    | InputMediaGeoLive
    | InputMediaPoll;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  scheduleDate?: number;
}

export interface messages_EditInlineBotMessageRequest
  extends TLObjectType<
    "messages_EditInlineBotMessageRequest",
    0x83557dba,
    0xf5b399ac
  > {
  id: InputBotInlineMessageID;
  noWebpage?: boolean;
  message?: string;
  media?:
    | InputMediaEmpty
    | InputMediaUploadedPhoto
    | InputMediaPhoto
    | InputMediaGeoPoint
    | InputMediaContact
    | InputMediaUploadedDocument
    | InputMediaDocument
    | InputMediaVenue
    | InputMediaGifExternal
    | InputMediaPhotoExternal
    | InputMediaDocumentExternal
    | InputMediaGame
    | InputMediaInvoice
    | InputMediaGeoLive
    | InputMediaPoll;
  replyMarkup?:
    | ReplyKeyboardHide
    | ReplyKeyboardForceReply
    | ReplyKeyboardMarkup
    | ReplyInlineMarkup;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
}

export interface messages_GetBotCallbackAnswerRequest
  extends TLObjectType<
    "messages_GetBotCallbackAnswerRequest",
    0x810a9fec,
    0x6c4dd18c
  > {
  msgId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  game?: boolean;
  data?: Uint8Array;
}

export interface messages_SetBotCallbackAnswerRequest
  extends TLObjectType<
    "messages_SetBotCallbackAnswerRequest",
    0xd58f130a,
    0xf5b399ac
  > {
  cacheTime: number;
  queryId: bigint;
  alert?: boolean;
  message?: string;
  url?: string;
}

export interface messages_GetPeerDialogsRequest
  extends TLObjectType<
    "messages_GetPeerDialogsRequest",
    0xe470bcfd,
    0x3ac70132
  > {
  peers: (InputDialogPeer | InputDialogPeerFolder)[];
}

export interface messages_SaveDraftRequest
  extends TLObjectType<"messages_SaveDraftRequest", 0xbc39e14b, 0xf5b399ac> {
  message: string;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  noWebpage?: boolean;
  replyToMsgId?: number;
  entities?: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
}

export interface messages_GetAllDraftsRequest
  extends TLObjectType<
    "messages_GetAllDraftsRequest",
    0x6a3f8d65,
    0x8af52aac
  > {}

export interface messages_GetFeaturedStickersRequest
  extends TLObjectType<
    "messages_GetFeaturedStickersRequest",
    0x2dacca4f,
    0x2614b722
  > {
  hash: number;
}

export interface messages_ReadFeaturedStickersRequest
  extends TLObjectType<
    "messages_ReadFeaturedStickersRequest",
    0x5b118126,
    0xf5b399ac
  > {
  id: bigint[];
}

export interface messages_GetRecentStickersRequest
  extends TLObjectType<
    "messages_GetRecentStickersRequest",
    0x5ea192c9,
    0xf76f8683
  > {
  hash: number;
  attached?: boolean;
}

export interface messages_SaveRecentStickerRequest
  extends TLObjectType<
    "messages_SaveRecentStickerRequest",
    0x392718f8,
    0xf5b399ac
  > {
  unsave: boolean;
  id: InputDocumentEmpty | InputDocument;
  attached?: boolean;
}

export interface messages_ClearRecentStickersRequest
  extends TLObjectType<
    "messages_ClearRecentStickersRequest",
    0x8999602d,
    0xf5b399ac
  > {
  attached?: boolean;
}

export interface messages_GetArchivedStickersRequest
  extends TLObjectType<
    "messages_GetArchivedStickersRequest",
    0x57f17692,
    0x7296d771
  > {
  limit: number;
  offsetId: bigint;
  masks?: boolean;
}

export interface messages_GetMaskStickersRequest
  extends TLObjectType<
    "messages_GetMaskStickersRequest",
    0x65b8c79f,
    0x45834829
  > {
  hash: number;
}

export interface messages_GetAttachedStickersRequest
  extends TLObjectType<
    "messages_GetAttachedStickersRequest",
    0xcc5b67cc,
    0xcc125f6b
  > {
  media: InputStickeredMediaPhoto | InputStickeredMediaDocument;
}

export interface messages_SetGameScoreRequest
  extends TLObjectType<"messages_SetGameScoreRequest", 0x8ef8ecc0, 0x8af52aac> {
  score: number;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  id: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  editMessage?: boolean;
  force?: boolean;
}

export interface messages_SetInlineGameScoreRequest
  extends TLObjectType<
    "messages_SetInlineGameScoreRequest",
    0x15ad9f64,
    0xf5b399ac
  > {
  score: number;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  id: InputBotInlineMessageID;
  editMessage?: boolean;
  force?: boolean;
}

export interface messages_GetGameHighScoresRequest
  extends TLObjectType<
    "messages_GetGameHighScoresRequest",
    0xe822649d,
    0x6ccd95fd
  > {
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  id: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_GetInlineGameHighScoresRequest
  extends TLObjectType<
    "messages_GetInlineGameHighScoresRequest",
    0x0f635e1b,
    0x6ccd95fd
  > {
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  id: InputBotInlineMessageID;
}

export interface messages_GetCommonChatsRequest
  extends TLObjectType<
    "messages_GetCommonChatsRequest",
    0x0d0a48c4,
    0x99d5cb14
  > {
  limit: number;
  maxId: number;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface messages_GetAllChatsRequest
  extends TLObjectType<"messages_GetAllChatsRequest", 0xeba80ff0, 0x99d5cb14> {
  exceptIds: number[];
}

export interface messages_GetWebPageRequest
  extends TLObjectType<"messages_GetWebPageRequest", 0x32ca8f91, 0x55a97481> {
  hash: number;
  url: string;
}

export interface messages_ToggleDialogPinRequest
  extends TLObjectType<
    "messages_ToggleDialogPinRequest",
    0xa731e257,
    0xf5b399ac
  > {
  peer: InputDialogPeer | InputDialogPeerFolder;
  pinned?: boolean;
}

export interface messages_ReorderPinnedDialogsRequest
  extends TLObjectType<
    "messages_ReorderPinnedDialogsRequest",
    0x3b1adf37,
    0xf5b399ac
  > {
  order: (InputDialogPeer | InputDialogPeerFolder)[];
  folderId: number;
  force?: boolean;
}

export interface messages_GetPinnedDialogsRequest
  extends TLObjectType<
    "messages_GetPinnedDialogsRequest",
    0xd6b94df2,
    0x3ac70132
  > {
  folderId: number;
}

export interface messages_SetBotShippingResultsRequest
  extends TLObjectType<
    "messages_SetBotShippingResultsRequest",
    0xe5f672fa,
    0xf5b399ac
  > {
  queryId: bigint;
  error?: string;
  shippingOptions?: ShippingOption[];
}

export interface messages_SetBotPrecheckoutResultsRequest
  extends TLObjectType<
    "messages_SetBotPrecheckoutResultsRequest",
    0x09c2dd95,
    0xf5b399ac
  > {
  queryId: bigint;
  success?: boolean;
  error?: string;
}

export interface messages_UploadMediaRequest
  extends TLObjectType<"messages_UploadMediaRequest", 0x519bc2b1, 0x476cbe32> {
  media:
    | InputMediaEmpty
    | InputMediaUploadedPhoto
    | InputMediaPhoto
    | InputMediaGeoPoint
    | InputMediaContact
    | InputMediaUploadedDocument
    | InputMediaDocument
    | InputMediaVenue
    | InputMediaGifExternal
    | InputMediaPhotoExternal
    | InputMediaDocumentExternal
    | InputMediaGame
    | InputMediaInvoice
    | InputMediaGeoLive
    | InputMediaPoll;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_SendScreenshotNotificationRequest
  extends TLObjectType<
    "messages_SendScreenshotNotificationRequest",
    0xc97df020,
    0x8af52aac
  > {
  replyToMsgId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  randomId?: bigint;
}

export interface messages_GetFavedStickersRequest
  extends TLObjectType<
    "messages_GetFavedStickersRequest",
    0x21ce0b0e,
    0x8e736fb9
  > {
  hash: number;
}

export interface messages_FaveStickerRequest
  extends TLObjectType<"messages_FaveStickerRequest", 0xb9ffc55b, 0xf5b399ac> {
  unfave: boolean;
  id: InputDocumentEmpty | InputDocument;
}

export interface messages_GetUnreadMentionsRequest
  extends TLObjectType<
    "messages_GetUnreadMentionsRequest",
    0x46578472,
    0xd4b40b5e
  > {
  minId: number;
  maxId: number;
  limit: number;
  addOffset: number;
  offsetId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_ReadMentionsRequest
  extends TLObjectType<"messages_ReadMentionsRequest", 0x0f0189d3, 0x2c49c116> {
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_GetRecentLocationsRequest
  extends TLObjectType<
    "messages_GetRecentLocationsRequest",
    0xbbc45b09,
    0xd4b40b5e
  > {
  hash: number;
  limit: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_SendMultiMediaRequest
  extends TLObjectType<
    "messages_SendMultiMediaRequest",
    0xcc0110cb,
    0x8af52aac
  > {
  multiMedia: InputSingleMedia[];
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  silent?: boolean;
  background?: boolean;
  clearDraft?: boolean;
  replyToMsgId?: number;
  scheduleDate?: number;
}

export interface messages_UploadEncryptedFileRequest
  extends TLObjectType<
    "messages_UploadEncryptedFileRequest",
    0x5057c497,
    0x842a67c0
  > {
  file:
    | InputEncryptedFileEmpty
    | InputEncryptedFileUploaded
    | InputEncryptedFile
    | InputEncryptedFileBigUploaded;
  peer: InputEncryptedChat;
}

export interface messages_SearchStickerSetsRequest
  extends TLObjectType<
    "messages_SearchStickerSetsRequest",
    0xc2b7d08b,
    0x40df361
  > {
  hash: number;
  q: string;
  excludeFeatured?: boolean;
}

export interface messages_GetSplitRangesRequest
  extends TLObjectType<
    "messages_GetSplitRangesRequest",
    0x1cff7e08,
    0x5ba52504
  > {}

export interface messages_MarkDialogUnreadRequest
  extends TLObjectType<
    "messages_MarkDialogUnreadRequest",
    0xc286d98f,
    0xf5b399ac
  > {
  peer: InputDialogPeer | InputDialogPeerFolder;
  unread?: boolean;
}

export interface messages_GetDialogUnreadMarksRequest
  extends TLObjectType<
    "messages_GetDialogUnreadMarksRequest",
    0x22e24e22,
    0xbec64ad9
  > {}

export interface messages_ClearAllDraftsRequest
  extends TLObjectType<
    "messages_ClearAllDraftsRequest",
    0x7e58ee9c,
    0xf5b399ac
  > {}

export interface messages_UpdatePinnedMessageRequest
  extends TLObjectType<
    "messages_UpdatePinnedMessageRequest",
    0xd2aaf7ec,
    0x8af52aac
  > {
  id: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  silent?: boolean;
}

export interface messages_SendVoteRequest
  extends TLObjectType<"messages_SendVoteRequest", 0x10ea6184, 0x8af52aac> {
  options: Uint8Array[];
  msgId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_GetPollResultsRequest
  extends TLObjectType<
    "messages_GetPollResultsRequest",
    0x73bb643b,
    0x8af52aac
  > {
  msgId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_GetOnlinesRequest
  extends TLObjectType<"messages_GetOnlinesRequest", 0x6e2be050, 0x8c81903a> {
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_GetStatsURLRequest
  extends TLObjectType<"messages_GetStatsURLRequest", 0x812c2ae6, 0x8d4c94c0> {
  params: string;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  dark?: boolean;
}

export interface messages_EditChatAboutRequest
  extends TLObjectType<
    "messages_EditChatAboutRequest",
    0xdef60797,
    0xf5b399ac
  > {
  about: string;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_EditChatDefaultBannedRightsRequest
  extends TLObjectType<
    "messages_EditChatDefaultBannedRightsRequest",
    0xa5866b41,
    0x8af52aac
  > {
  bannedRights: ChatBannedRights;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_GetEmojiKeywordsRequest
  extends TLObjectType<
    "messages_GetEmojiKeywordsRequest",
    0x35a0e062,
    0xd279c672
  > {
  langCode: string;
}

export interface messages_GetEmojiKeywordsDifferenceRequest
  extends TLObjectType<
    "messages_GetEmojiKeywordsDifferenceRequest",
    0x1508b6af,
    0xd279c672
  > {
  fromVersion: number;
  langCode: string;
}

export interface messages_GetEmojiKeywordsLanguagesRequest
  extends TLObjectType<
    "messages_GetEmojiKeywordsLanguagesRequest",
    0x4e9963b2,
    0xe795d387
  > {
  langCodes: string[];
}

export interface messages_GetEmojiURLRequest
  extends TLObjectType<"messages_GetEmojiURLRequest", 0xd5b10c26, 0x1fa08a19> {
  langCode: string;
}

export interface messages_GetSearchCountersRequest
  extends TLObjectType<
    "messages_GetSearchCountersRequest",
    0x732eef00,
    0x6bde3c6e
  > {
  filters: (
    | InputMessagesFilterEmpty
    | InputMessagesFilterPhotos
    | InputMessagesFilterVideo
    | InputMessagesFilterPhotoVideo
    | InputMessagesFilterDocument
    | InputMessagesFilterUrl
    | InputMessagesFilterGif
    | InputMessagesFilterVoice
    | InputMessagesFilterMusic
    | InputMessagesFilterChatPhotos
    | InputMessagesFilterPhoneCalls
    | InputMessagesFilterRoundVoice
    | InputMessagesFilterRoundVideo
    | InputMessagesFilterMyMentions
    | InputMessagesFilterGeo
    | InputMessagesFilterContacts
  )[];
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_RequestUrlAuthRequest
  extends TLObjectType<
    "messages_RequestUrlAuthRequest",
    0xe33f5613,
    0x7765cb1e
  > {
  buttonId: number;
  msgId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_AcceptUrlAuthRequest
  extends TLObjectType<
    "messages_AcceptUrlAuthRequest",
    0xf729ea98,
    0x7765cb1e
  > {
  buttonId: number;
  msgId: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
  writeAllowed?: boolean;
}

export interface messages_HidePeerSettingsBarRequest
  extends TLObjectType<
    "messages_HidePeerSettingsBarRequest",
    0x4facb138,
    0xf5b399ac
  > {
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_GetScheduledHistoryRequest
  extends TLObjectType<
    "messages_GetScheduledHistoryRequest",
    0xe2c2685b,
    0xd4b40b5e
  > {
  hash: number;
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_GetScheduledMessagesRequest
  extends TLObjectType<
    "messages_GetScheduledMessagesRequest",
    0xbdbb0464,
    0xd4b40b5e
  > {
  id: number[];
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_SendScheduledMessagesRequest
  extends TLObjectType<
    "messages_SendScheduledMessagesRequest",
    0xbd38850a,
    0x8af52aac
  > {
  id: number[];
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface messages_DeleteScheduledMessagesRequest
  extends TLObjectType<
    "messages_DeleteScheduledMessagesRequest",
    0x59ae2b16,
    0x8af52aac
  > {
  id: number[];
  peer:
    | InputPeerEmpty
    | InputPeerSelf
    | InputPeerChat
    | InputPeerUser
    | InputPeerChannel
    | InputPeerUserFromMessage
    | InputPeerChannelFromMessage;
}

export interface updates_GetStateRequest
  extends TLObjectType<"updates_GetStateRequest", 0xedd4882a, 0x23df1a01> {}

export interface updates_GetDifferenceRequest
  extends TLObjectType<"updates_GetDifferenceRequest", 0x25939651, 0x20482874> {
  qts: number;
  date: number;
  pts: number;
  ptsTotalLimit?: number;
}

export interface updates_GetChannelDifferenceRequest
  extends TLObjectType<
    "updates_GetChannelDifferenceRequest",
    0x03173d78,
    0x29896f5d
  > {
  limit: number;
  pts: number;
  filter: ChannelMessagesFilterEmpty | ChannelMessagesFilter;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
  force?: boolean;
}

export interface photos_UpdateProfilePhotoRequest
  extends TLObjectType<
    "photos_UpdateProfilePhotoRequest",
    0xf0bb5152,
    0xc6338f7d
  > {
  id: InputPhotoEmpty | InputPhoto;
}

export interface photos_UploadProfilePhotoRequest
  extends TLObjectType<
    "photos_UploadProfilePhotoRequest",
    0x4f32c098,
    0xc292bd24
  > {
  file: InputFile | InputFileBig;
}

export interface photos_DeletePhotosRequest
  extends TLObjectType<"photos_DeletePhotosRequest", 0x87cf7f2f, 0x8918e168> {
  id: (InputPhotoEmpty | InputPhoto)[];
}

export interface photos_GetUserPhotosRequest
  extends TLObjectType<"photos_GetUserPhotosRequest", 0x91cd32a8, 0x27cfb967> {
  limit: number;
  maxId: bigint;
  offset: number;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface upload_SaveFilePartRequest
  extends TLObjectType<"upload_SaveFilePartRequest", 0xb304a621, 0xf5b399ac> {
  bytes: Uint8Array;
  filePart: number;
  fileId: bigint;
}

export interface upload_GetFileRequest
  extends TLObjectType<"upload_GetFileRequest", 0xb15a9afc, 0x6c9bd728> {
  limit: number;
  offset: number;
  location:
    | InputFileLocation
    | InputEncryptedFileLocation
    | InputDocumentFileLocation
    | InputSecureFileLocation
    | InputTakeoutFileLocation
    | InputPhotoFileLocation
    | InputPeerPhotoFileLocation
    | InputStickerSetThumb;
  precise?: boolean;
}

export interface upload_SaveBigFilePartRequest
  extends TLObjectType<
    "upload_SaveBigFilePartRequest",
    0xde7b673d,
    0xf5b399ac
  > {
  bytes: Uint8Array;
  fileTotalParts: number;
  filePart: number;
  fileId: bigint;
}

export interface upload_GetWebFileRequest
  extends TLObjectType<"upload_GetWebFileRequest", 0x24e6818d, 0x68f17f51> {
  limit: number;
  offset: number;
  location: InputWebFileLocation | InputWebFileGeoPointLocation;
}

export interface upload_GetCdnFileRequest
  extends TLObjectType<"upload_GetCdnFileRequest", 0x2000bcc3, 0xf5ccf928> {
  limit: number;
  offset: number;
  fileToken: Uint8Array;
}

export interface upload_ReuploadCdnFileRequest
  extends TLObjectType<
    "upload_ReuploadCdnFileRequest",
    0x9b2754a8,
    0xa5940726
  > {
  requestToken: Uint8Array;
  fileToken: Uint8Array;
}

export interface upload_GetCdnFileHashesRequest
  extends TLObjectType<
    "upload_GetCdnFileHashesRequest",
    0x4da54231,
    0xa5940726
  > {
  offset: number;
  fileToken: Uint8Array;
}

export interface upload_GetFileHashesRequest
  extends TLObjectType<"upload_GetFileHashesRequest", 0xc7025931, 0xa5940726> {
  offset: number;
  location:
    | InputFileLocation
    | InputEncryptedFileLocation
    | InputDocumentFileLocation
    | InputSecureFileLocation
    | InputTakeoutFileLocation
    | InputPhotoFileLocation
    | InputPeerPhotoFileLocation
    | InputStickerSetThumb;
}

export interface help_GetConfigRequest
  extends TLObjectType<"help_GetConfigRequest", 0xc4f9186b, 0xd3262a4a> {}

export interface help_GetNearestDcRequest
  extends TLObjectType<"help_GetNearestDcRequest", 0x1fb33026, 0x3877045f> {}

export interface help_GetAppUpdateRequest
  extends TLObjectType<"help_GetAppUpdateRequest", 0x522d5a7d, 0x5897069e> {
  source: string;
}

export interface help_GetInviteTextRequest
  extends TLObjectType<"help_GetInviteTextRequest", 0x4d392343, 0xcf70aa35> {}

export interface help_GetSupportRequest
  extends TLObjectType<"help_GetSupportRequest", 0x9cdf08cd, 0x7159bceb> {}

export interface help_GetAppChangelogRequest
  extends TLObjectType<"help_GetAppChangelogRequest", 0x9010ef6f, 0x8af52aac> {
  prevAppVersion: string;
}

export interface help_SetBotUpdatesStatusRequest
  extends TLObjectType<
    "help_SetBotUpdatesStatusRequest",
    0xec22cfcd,
    0xf5b399ac
  > {
  message: string;
  pendingUpdatesCount: number;
}

export interface help_GetCdnConfigRequest
  extends TLObjectType<"help_GetCdnConfigRequest", 0x52029342, 0xecda397c> {}

export interface help_GetRecentMeUrlsRequest
  extends TLObjectType<"help_GetRecentMeUrlsRequest", 0x3dc0f114, 0xf269c477> {
  referer: string;
}

export interface help_GetProxyDataRequest
  extends TLObjectType<"help_GetProxyDataRequest", 0x3d7758e1, 0x21e2a448> {}

export interface help_GetTermsOfServiceUpdateRequest
  extends TLObjectType<
    "help_GetTermsOfServiceUpdateRequest",
    0x2ca51fd1,
    0x293c2977
  > {}

export interface help_AcceptTermsOfServiceRequest
  extends TLObjectType<
    "help_AcceptTermsOfServiceRequest",
    0xee72f79a,
    0xf5b399ac
  > {
  id: DataJSON | bots_SendCustomRequestRequest | phone_GetCallConfigRequest;
}

export interface help_GetDeepLinkInfoRequest
  extends TLObjectType<"help_GetDeepLinkInfoRequest", 0x3fedc75f, 0x984aac38> {
  path: string;
}

export interface help_GetAppConfigRequest
  extends TLObjectType<"help_GetAppConfigRequest", 0x98914110, 0xeb9987b3> {}

export interface help_SaveAppLogRequest
  extends TLObjectType<"help_SaveAppLogRequest", 0x6f02f748, 0xf5b399ac> {
  events: InputAppEvent[];
}

export interface help_GetPassportConfigRequest
  extends TLObjectType<
    "help_GetPassportConfigRequest",
    0xc661ad08,
    0xc666c0ad
  > {
  hash: number;
}

export interface help_GetSupportNameRequest
  extends TLObjectType<"help_GetSupportNameRequest", 0xd360e72c, 0x7f50b7c2> {}

export interface help_GetUserInfoRequest
  extends TLObjectType<"help_GetUserInfoRequest", 0x038a08d3, 0x5c53d7d8> {
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface help_EditUserInfoRequest
  extends TLObjectType<"help_EditUserInfoRequest", 0x66b91b70, 0x5c53d7d8> {
  entities: (
    | MessageEntityUnknown
    | MessageEntityMention
    | MessageEntityHashtag
    | MessageEntityBotCommand
    | MessageEntityUrl
    | MessageEntityEmail
    | MessageEntityBold
    | MessageEntityItalic
    | MessageEntityCode
    | MessageEntityPre
    | MessageEntityTextUrl
    | MessageEntityMentionName
    | InputMessageEntityMentionName
    | MessageEntityPhone
    | MessageEntityCashtag
    | MessageEntityUnderline
    | MessageEntityStrike
    | MessageEntityBlockquote
  )[];
  message: string;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
}

export interface channels_ReadHistoryRequest
  extends TLObjectType<"channels_ReadHistoryRequest", 0xcc104937, 0xf5b399ac> {
  maxId: number;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_DeleteMessagesRequest
  extends TLObjectType<
    "channels_DeleteMessagesRequest",
    0x84c1fd4e,
    0xced3c06e
  > {
  id: number[];
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_DeleteUserHistoryRequest
  extends TLObjectType<
    "channels_DeleteUserHistoryRequest",
    0xd10dd71b,
    0x2c49c116
  > {
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_ReportSpamRequest
  extends TLObjectType<"channels_ReportSpamRequest", 0xfe087810, 0xf5b399ac> {
  id: number[];
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_GetMessagesRequest
  extends TLObjectType<"channels_GetMessagesRequest", 0xad8c9a23, 0xd4b40b5e> {
  id: (InputMessageID | InputMessageReplyTo | InputMessagePinned)[];
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_GetParticipantsRequest
  extends TLObjectType<
    "channels_GetParticipantsRequest",
    0x123e05e9,
    0xe60a6e64
  > {
  hash: number;
  limit: number;
  offset: number;
  filter:
    | ChannelParticipantsRecent
    | ChannelParticipantsAdmins
    | ChannelParticipantsKicked
    | ChannelParticipantsBots
    | ChannelParticipantsBanned
    | ChannelParticipantsSearch
    | ChannelParticipantsContacts;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_GetParticipantRequest
  extends TLObjectType<
    "channels_GetParticipantRequest",
    0x546dd7a6,
    0x6658151a
  > {
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_GetChannelsRequest
  extends TLObjectType<"channels_GetChannelsRequest", 0x0a7f6bbb, 0x99d5cb14> {
  id: (InputChannelEmpty | InputChannel | InputChannelFromMessage)[];
}

export interface channels_GetFullChannelRequest
  extends TLObjectType<
    "channels_GetFullChannelRequest",
    0x08736a09,
    0x225a5109
  > {
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_CreateChannelRequest
  extends TLObjectType<
    "channels_CreateChannelRequest",
    0x3d5fb10f,
    0x8af52aac
  > {
  about: string;
  title: string;
  broadcast?: boolean;
  megagroup?: boolean;
  geoPoint?: InputGeoPointEmpty | InputGeoPoint;
  address?: string;
}

export interface channels_EditAdminRequest
  extends TLObjectType<"channels_EditAdminRequest", 0xd33c8902, 0x8af52aac> {
  rank: string;
  adminRights: ChatAdminRights;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_EditTitleRequest
  extends TLObjectType<"channels_EditTitleRequest", 0x566decd0, 0x8af52aac> {
  title: string;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_EditPhotoRequest
  extends TLObjectType<"channels_EditPhotoRequest", 0xf12e57c9, 0x8af52aac> {
  photo: InputChatPhotoEmpty | InputChatUploadedPhoto | InputChatPhoto;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_CheckUsernameRequest
  extends TLObjectType<
    "channels_CheckUsernameRequest",
    0x10e6bd2c,
    0xf5b399ac
  > {
  username: string;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_UpdateUsernameRequest
  extends TLObjectType<
    "channels_UpdateUsernameRequest",
    0x3514b3de,
    0xf5b399ac
  > {
  username: string;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_JoinChannelRequest
  extends TLObjectType<"channels_JoinChannelRequest", 0x24b524c5, 0x8af52aac> {
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_LeaveChannelRequest
  extends TLObjectType<"channels_LeaveChannelRequest", 0xf836aa95, 0x8af52aac> {
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_InviteToChannelRequest
  extends TLObjectType<
    "channels_InviteToChannelRequest",
    0x199f3a6c,
    0x8af52aac
  > {
  users: (InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage)[];
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_DeleteChannelRequest
  extends TLObjectType<
    "channels_DeleteChannelRequest",
    0xc0111fe3,
    0x8af52aac
  > {
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_ExportMessageLinkRequest
  extends TLObjectType<
    "channels_ExportMessageLinkRequest",
    0xceb77163,
    0xdee644cc
  > {
  grouped: boolean;
  id: number;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_ToggleSignaturesRequest
  extends TLObjectType<
    "channels_ToggleSignaturesRequest",
    0x1f69b606,
    0x8af52aac
  > {
  enabled: boolean;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_GetAdminedPublicChannelsRequest
  extends TLObjectType<
    "channels_GetAdminedPublicChannelsRequest",
    0xf8b036af,
    0x99d5cb14
  > {
  byLocation?: boolean;
  checkLimit?: boolean;
}

export interface channels_EditBannedRequest
  extends TLObjectType<"channels_EditBannedRequest", 0x72796912, 0x8af52aac> {
  bannedRights: ChatBannedRights;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_GetAdminLogRequest
  extends TLObjectType<"channels_GetAdminLogRequest", 0x33ddf480, 0x51f076bc> {
  limit: number;
  minId: bigint;
  maxId: bigint;
  q: string;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
  eventsFilter?: ChannelAdminLogEventsFilter;
  admins?: (
    | InputUserEmpty
    | InputUserSelf
    | InputUser
    | InputUserFromMessage
  )[];
}

export interface channels_SetStickersRequest
  extends TLObjectType<"channels_SetStickersRequest", 0xea8ca4f9, 0xf5b399ac> {
  stickerset:
    | InputStickerSetEmpty
    | InputStickerSetID
    | InputStickerSetShortName
    | InputStickerSetAnimatedEmoji;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_ReadMessageContentsRequest
  extends TLObjectType<
    "channels_ReadMessageContentsRequest",
    0xeab5dc38,
    0xf5b399ac
  > {
  id: number[];
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_DeleteHistoryRequest
  extends TLObjectType<
    "channels_DeleteHistoryRequest",
    0xaf369d42,
    0xf5b399ac
  > {
  maxId: number;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_TogglePreHistoryHiddenRequest
  extends TLObjectType<
    "channels_TogglePreHistoryHiddenRequest",
    0xeabbb94c,
    0x8af52aac
  > {
  enabled: boolean;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_GetLeftChannelsRequest
  extends TLObjectType<
    "channels_GetLeftChannelsRequest",
    0x8341ecc0,
    0x99d5cb14
  > {
  offset: number;
}

export interface channels_GetGroupsForDiscussionRequest
  extends TLObjectType<
    "channels_GetGroupsForDiscussionRequest",
    0xf5dad378,
    0x99d5cb14
  > {}

export interface channels_SetDiscussionGroupRequest
  extends TLObjectType<
    "channels_SetDiscussionGroupRequest",
    0x40582bb2,
    0xf5b399ac
  > {
  group: InputChannelEmpty | InputChannel | InputChannelFromMessage;
  broadcast: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_EditCreatorRequest
  extends TLObjectType<"channels_EditCreatorRequest", 0x8f38cd1f, 0x8af52aac> {
  password: InputCheckPasswordEmpty | InputCheckPasswordSRP;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_EditLocationRequest
  extends TLObjectType<"channels_EditLocationRequest", 0x58e63f6d, 0xf5b399ac> {
  address: string;
  geoPoint: InputGeoPointEmpty | InputGeoPoint;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface channels_ToggleSlowModeRequest
  extends TLObjectType<
    "channels_ToggleSlowModeRequest",
    0xedd49ef0,
    0x8af52aac
  > {
  seconds: number;
  channel: InputChannelEmpty | InputChannel | InputChannelFromMessage;
}

export interface bots_SendCustomRequestRequest
  extends TLObjectType<
    "bots_SendCustomRequestRequest",
    0xaa2769ed,
    0xad0352e8
  > {
  params: DataJSON | bots_SendCustomRequestRequest | phone_GetCallConfigRequest;
  customMethod: string;
}

export interface bots_AnswerWebhookJSONQueryRequest
  extends TLObjectType<
    "bots_AnswerWebhookJSONQueryRequest",
    0xe6213f4d,
    0xf5b399ac
  > {
  data: DataJSON | bots_SendCustomRequestRequest | phone_GetCallConfigRequest;
  queryId: bigint;
}

export interface payments_GetPaymentFormRequest
  extends TLObjectType<
    "payments_GetPaymentFormRequest",
    0x99f09745,
    0xa0483f19
  > {
  msgId: number;
}

export interface payments_GetPaymentReceiptRequest
  extends TLObjectType<
    "payments_GetPaymentReceiptRequest",
    0xa092a980,
    0x590093c9
  > {
  msgId: number;
}

export interface payments_ValidateRequestedInfoRequest
  extends TLObjectType<
    "payments_ValidateRequestedInfoRequest",
    0x770a8e74,
    0x8f8044b7
  > {
  info: PaymentRequestedInfo;
  msgId: number;
  save?: boolean;
}

export interface payments_SendPaymentFormRequest
  extends TLObjectType<
    "payments_SendPaymentFormRequest",
    0x2b8879b3,
    0x8ae16a9d
  > {
  credentials:
    | InputPaymentCredentialsSaved
    | InputPaymentCredentials
    | InputPaymentCredentialsApplePay
    | InputPaymentCredentialsAndroidPay;
  msgId: number;
  requestedInfoId?: string;
  shippingOptionId?: string;
}

export interface payments_GetSavedInfoRequest
  extends TLObjectType<
    "payments_GetSavedInfoRequest",
    0x227d824b,
    0xad3cf146
  > {}

export interface payments_ClearSavedInfoRequest
  extends TLObjectType<
    "payments_ClearSavedInfoRequest",
    0xd83d70c1,
    0xf5b399ac
  > {
  credentials?: boolean;
  info?: boolean;
}

export interface stickers_CreateStickerSetRequest
  extends TLObjectType<
    "stickers_CreateStickerSetRequest",
    0x9bd86e6a,
    0x9b704a5a
  > {
  stickers: InputStickerSetItem[];
  shortName: string;
  title: string;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  masks?: boolean;
}

export interface stickers_RemoveStickerFromSetRequest
  extends TLObjectType<
    "stickers_RemoveStickerFromSetRequest",
    0xf7760f51,
    0x9b704a5a
  > {
  sticker: InputDocumentEmpty | InputDocument;
}

export interface stickers_ChangeStickerPositionRequest
  extends TLObjectType<
    "stickers_ChangeStickerPositionRequest",
    0xffb6d4ca,
    0x9b704a5a
  > {
  position: number;
  sticker: InputDocumentEmpty | InputDocument;
}

export interface stickers_AddStickerToSetRequest
  extends TLObjectType<
    "stickers_AddStickerToSetRequest",
    0x8653febe,
    0x9b704a5a
  > {
  sticker: InputStickerSetItem;
  stickerset:
    | InputStickerSetEmpty
    | InputStickerSetID
    | InputStickerSetShortName
    | InputStickerSetAnimatedEmoji;
}

export interface phone_GetCallConfigRequest
  extends TLObjectType<"phone_GetCallConfigRequest", 0x55451fa9, 0xad0352e8> {}

export interface phone_RequestCallRequest
  extends TLObjectType<"phone_RequestCallRequest", 0x42ff96ed, 0xd48afe4f> {
  protocol: PhoneCallProtocol;
  gAHash: Uint8Array;
  userId: InputUserEmpty | InputUserSelf | InputUser | InputUserFromMessage;
  video?: boolean;
  randomId?: number;
}

export interface phone_AcceptCallRequest
  extends TLObjectType<"phone_AcceptCallRequest", 0x3bd2b4a0, 0xd48afe4f> {
  protocol: PhoneCallProtocol;
  gB: Uint8Array;
  peer: InputPhoneCall;
}

export interface phone_ConfirmCallRequest
  extends TLObjectType<"phone_ConfirmCallRequest", 0x2efe1722, 0xd48afe4f> {
  protocol: PhoneCallProtocol;
  keyFingerprint: bigint;
  gA: Uint8Array;
  peer: InputPhoneCall;
}

export interface phone_ReceivedCallRequest
  extends TLObjectType<"phone_ReceivedCallRequest", 0x17d54f61, 0xf5b399ac> {
  peer: InputPhoneCall;
}

export interface phone_DiscardCallRequest
  extends TLObjectType<"phone_DiscardCallRequest", 0xb2cbc1c0, 0x8af52aac> {
  connectionId: bigint;
  reason:
    | PhoneCallDiscardReasonMissed
    | PhoneCallDiscardReasonDisconnect
    | PhoneCallDiscardReasonHangup
    | PhoneCallDiscardReasonBusy;
  duration: number;
  peer: InputPhoneCall;
  video?: boolean;
}

export interface phone_SetCallRatingRequest
  extends TLObjectType<"phone_SetCallRatingRequest", 0x59ead627, 0x8af52aac> {
  comment: string;
  rating: number;
  peer: InputPhoneCall;
  userInitiative?: boolean;
}

export interface phone_SaveCallDebugRequest
  extends TLObjectType<"phone_SaveCallDebugRequest", 0x277add7e, 0xf5b399ac> {
  debug: DataJSON | bots_SendCustomRequestRequest | phone_GetCallConfigRequest;
  peer: InputPhoneCall;
}

export interface langpack_GetLangPackRequest
  extends TLObjectType<"langpack_GetLangPackRequest", 0xf2f2330a, 0x52662d55> {
  langCode: string;
  langPack: string;
}

export interface langpack_GetStringsRequest
  extends TLObjectType<"langpack_GetStringsRequest", 0xefea3803, 0xc7b7353d> {
  keys: string[];
  langCode: string;
  langPack: string;
}

export interface langpack_GetDifferenceRequest
  extends TLObjectType<
    "langpack_GetDifferenceRequest",
    0xcd984aa5,
    0x52662d55
  > {
  fromVersion: number;
  langCode: string;
  langPack: string;
}

export interface langpack_GetLanguagesRequest
  extends TLObjectType<"langpack_GetLanguagesRequest", 0x42c6978f, 0x280912c9> {
  langPack: string;
}

export interface langpack_GetLanguageRequest
  extends TLObjectType<"langpack_GetLanguageRequest", 0x6a596502, 0xabac89b7> {
  langCode: string;
  langPack: string;
}

export interface folders_EditPeerFoldersRequest
  extends TLObjectType<
    "folders_EditPeerFoldersRequest",
    0x6847d0ab,
    0x8af52aac
  > {
  folderPeers: InputFolderPeer[];
}

export interface folders_DeleteFolderRequest
  extends TLObjectType<"folders_DeleteFolderRequest", 0x1c295881, 0x8af52aac> {
  folderId: number;
}
export type TLObjectTypes =
  | ResPQ
  | PQInnerData
  | PQInnerDataDc
  | PQInnerDataTemp
  | PQInnerDataTempDc
  | ServerDHParamsFail
  | ServerDHParamsOk
  | ServerDHInnerData
  | ClientDHInnerData
  | DhGenOk
  | DhGenRetry
  | DhGenFail
  | DestroyAuthKeyOk
  | DestroyAuthKeyNone
  | DestroyAuthKeyFail
  | ReqPqRequest
  | ReqPqMultiRequest
  | ReqDHParamsRequest
  | SetClientDHParamsRequest
  | DestroyAuthKeyRequest
  | MsgsAck
  | BadMsgNotification
  | BadServerSalt
  | MsgsStateReq
  | MsgsStateInfo
  | MsgsAllInfo
  | MsgDetailedInfo
  | MsgNewDetailedInfo
  | MsgResendReq
  | RpcError
  | RpcAnswerUnknown
  | RpcAnswerDroppedRunning
  | RpcAnswerDropped
  | FutureSalt
  | FutureSalts
  | Pong
  | DestroySessionOk
  | DestroySessionNone
  | NewSessionCreated
  | HttpWait
  | IpPort
  | IpPortSecret
  | AccessPointRule
  | help_ConfigSimple
  | TlsClientHello
  | TlsBlockString
  | TlsBlockRandom
  | TlsBlockZero
  | TlsBlockDomain
  | TlsBlockGrease
  | TlsBlockScope
  | RpcDropAnswerRequest
  | GetFutureSaltsRequest
  | PingRequest
  | PingDelayDisconnectRequest
  | DestroySessionRequest
  | InputPeerEmpty
  | InputPeerSelf
  | InputPeerChat
  | InputPeerUser
  | InputPeerChannel
  | InputPeerUserFromMessage
  | InputPeerChannelFromMessage
  | InputUserEmpty
  | InputUserSelf
  | InputUser
  | InputUserFromMessage
  | InputPhoneContact
  | InputFile
  | InputFileBig
  | InputMediaEmpty
  | InputMediaUploadedPhoto
  | InputMediaPhoto
  | InputMediaGeoPoint
  | InputMediaContact
  | InputMediaUploadedDocument
  | InputMediaDocument
  | InputMediaVenue
  | InputMediaGifExternal
  | InputMediaPhotoExternal
  | InputMediaDocumentExternal
  | InputMediaGame
  | InputMediaInvoice
  | InputMediaGeoLive
  | InputMediaPoll
  | InputChatPhotoEmpty
  | InputChatUploadedPhoto
  | InputChatPhoto
  | InputGeoPointEmpty
  | InputGeoPoint
  | InputPhotoEmpty
  | InputPhoto
  | InputFileLocation
  | InputEncryptedFileLocation
  | InputDocumentFileLocation
  | InputSecureFileLocation
  | InputTakeoutFileLocation
  | InputPhotoFileLocation
  | InputPeerPhotoFileLocation
  | InputStickerSetThumb
  | PeerUser
  | PeerChat
  | PeerChannel
  | storage_FileUnknown
  | storage_FilePartial
  | storage_FileJpeg
  | storage_FileGif
  | storage_FilePng
  | storage_FilePdf
  | storage_FileMp3
  | storage_FileMov
  | storage_FileMp4
  | storage_FileWebp
  | UserEmpty
  | User
  | UserProfilePhotoEmpty
  | UserProfilePhoto
  | UserStatusEmpty
  | UserStatusOnline
  | UserStatusOffline
  | UserStatusRecently
  | UserStatusLastWeek
  | UserStatusLastMonth
  | ChatEmpty
  | Chat
  | ChatForbidden
  | Channel
  | ChannelForbidden
  | ChatFull
  | ChannelFull
  | ChatParticipant
  | ChatParticipantCreator
  | ChatParticipantAdmin
  | ChatParticipantsForbidden
  | ChatParticipants
  | ChatPhotoEmpty
  | ChatPhoto
  | MessageEmpty
  | Message
  | MessageService
  | MessageMediaEmpty
  | MessageMediaPhoto
  | MessageMediaGeo
  | MessageMediaContact
  | MessageMediaUnsupported
  | MessageMediaDocument
  | MessageMediaWebPage
  | MessageMediaVenue
  | MessageMediaGame
  | MessageMediaInvoice
  | MessageMediaGeoLive
  | MessageMediaPoll
  | MessageActionEmpty
  | MessageActionChatCreate
  | MessageActionChatEditTitle
  | MessageActionChatEditPhoto
  | MessageActionChatDeletePhoto
  | MessageActionChatAddUser
  | MessageActionChatDeleteUser
  | MessageActionChatJoinedByLink
  | MessageActionChannelCreate
  | MessageActionChatMigrateTo
  | MessageActionChannelMigrateFrom
  | MessageActionPinMessage
  | MessageActionHistoryClear
  | MessageActionGameScore
  | MessageActionPaymentSentMe
  | MessageActionPaymentSent
  | MessageActionPhoneCall
  | MessageActionScreenshotTaken
  | MessageActionCustomAction
  | MessageActionBotAllowed
  | MessageActionSecureValuesSentMe
  | MessageActionSecureValuesSent
  | MessageActionContactSignUp
  | Dialog
  | DialogFolder
  | PhotoEmpty
  | Photo
  | PhotoSizeEmpty
  | PhotoSize
  | PhotoCachedSize
  | PhotoStrippedSize
  | GeoPointEmpty
  | GeoPoint
  | auth_SentCode
  | auth_Authorization
  | auth_AuthorizationSignUpRequired
  | auth_ExportedAuthorization
  | InputNotifyPeer
  | InputNotifyUsers
  | InputNotifyChats
  | InputNotifyBroadcasts
  | InputPeerNotifySettings
  | PeerNotifySettings
  | PeerSettings
  | WallPaper
  | InputReportReasonSpam
  | InputReportReasonViolence
  | InputReportReasonPornography
  | InputReportReasonChildAbuse
  | InputReportReasonOther
  | InputReportReasonCopyright
  | InputReportReasonGeoIrrelevant
  | UserFull
  | Contact
  | ImportedContact
  | ContactBlocked
  | ContactStatus
  | contacts_ContactsNotModified
  | contacts_Contacts
  | contacts_ImportedContacts
  | contacts_Blocked
  | contacts_BlockedSlice
  | messages_Dialogs
  | messages_DialogsSlice
  | messages_DialogsNotModified
  | messages_Messages
  | messages_MessagesSlice
  | messages_ChannelMessages
  | messages_MessagesNotModified
  | messages_Chats
  | messages_ChatsSlice
  | messages_ChatFull
  | messages_AffectedHistory
  | InputMessagesFilterEmpty
  | InputMessagesFilterPhotos
  | InputMessagesFilterVideo
  | InputMessagesFilterPhotoVideo
  | InputMessagesFilterDocument
  | InputMessagesFilterUrl
  | InputMessagesFilterGif
  | InputMessagesFilterVoice
  | InputMessagesFilterMusic
  | InputMessagesFilterChatPhotos
  | InputMessagesFilterPhoneCalls
  | InputMessagesFilterRoundVoice
  | InputMessagesFilterRoundVideo
  | InputMessagesFilterMyMentions
  | InputMessagesFilterGeo
  | InputMessagesFilterContacts
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
  | updates_State
  | updates_DifferenceEmpty
  | updates_Difference
  | updates_DifferenceSlice
  | updates_DifferenceTooLong
  | UpdatesTooLong
  | UpdateShortMessage
  | UpdateShortChatMessage
  | UpdateShort
  | UpdatesCombined
  | Updates
  | UpdateShortSentMessage
  | photos_Photos
  | photos_PhotosSlice
  | photos_Photo
  | upload_File
  | upload_FileCdnRedirect
  | DcOption
  | Config
  | NearestDc
  | help_AppUpdate
  | help_NoAppUpdate
  | help_InviteText
  | EncryptedChatEmpty
  | EncryptedChatWaiting
  | EncryptedChatRequested
  | EncryptedChat
  | EncryptedChatDiscarded
  | InputEncryptedChat
  | EncryptedFileEmpty
  | EncryptedFile
  | InputEncryptedFileEmpty
  | InputEncryptedFileUploaded
  | InputEncryptedFile
  | InputEncryptedFileBigUploaded
  | EncryptedMessage
  | EncryptedMessageService
  | messages_DhConfigNotModified
  | messages_DhConfig
  | messages_SentEncryptedMessage
  | messages_SentEncryptedFile
  | InputDocumentEmpty
  | InputDocument
  | DocumentEmpty
  | Document
  | help_Support
  | NotifyPeer
  | NotifyUsers
  | NotifyChats
  | NotifyBroadcasts
  | SendMessageTypingAction
  | SendMessageCancelAction
  | SendMessageRecordVideoAction
  | SendMessageUploadVideoAction
  | SendMessageRecordAudioAction
  | SendMessageUploadAudioAction
  | SendMessageUploadPhotoAction
  | SendMessageUploadDocumentAction
  | SendMessageGeoLocationAction
  | SendMessageChooseContactAction
  | SendMessageGamePlayAction
  | SendMessageRecordRoundAction
  | SendMessageUploadRoundAction
  | contacts_Found
  | InputPrivacyKeyStatusTimestamp
  | InputPrivacyKeyChatInvite
  | InputPrivacyKeyPhoneCall
  | InputPrivacyKeyPhoneP2P
  | InputPrivacyKeyForwards
  | InputPrivacyKeyProfilePhoto
  | InputPrivacyKeyPhoneNumber
  | InputPrivacyKeyAddedByPhone
  | PrivacyKeyStatusTimestamp
  | PrivacyKeyChatInvite
  | PrivacyKeyPhoneCall
  | PrivacyKeyPhoneP2P
  | PrivacyKeyForwards
  | PrivacyKeyProfilePhoto
  | PrivacyKeyPhoneNumber
  | PrivacyKeyAddedByPhone
  | InputPrivacyValueAllowContacts
  | InputPrivacyValueAllowAll
  | InputPrivacyValueAllowUsers
  | InputPrivacyValueDisallowContacts
  | InputPrivacyValueDisallowAll
  | InputPrivacyValueDisallowUsers
  | InputPrivacyValueAllowChatParticipants
  | InputPrivacyValueDisallowChatParticipants
  | PrivacyValueAllowContacts
  | PrivacyValueAllowAll
  | PrivacyValueAllowUsers
  | PrivacyValueDisallowContacts
  | PrivacyValueDisallowAll
  | PrivacyValueDisallowUsers
  | PrivacyValueAllowChatParticipants
  | PrivacyValueDisallowChatParticipants
  | account_PrivacyRules
  | AccountDaysTTL
  | DocumentAttributeImageSize
  | DocumentAttributeAnimated
  | DocumentAttributeSticker
  | DocumentAttributeVideo
  | DocumentAttributeAudio
  | DocumentAttributeFilename
  | DocumentAttributeHasStickers
  | messages_StickersNotModified
  | messages_Stickers
  | StickerPack
  | messages_AllStickersNotModified
  | messages_AllStickers
  | messages_AffectedMessages
  | WebPageEmpty
  | WebPagePending
  | WebPage
  | WebPageNotModified
  | Authorization
  | account_Authorizations
  | account_Password
  | account_PasswordSettings
  | account_PasswordInputSettings
  | auth_PasswordRecovery
  | ReceivedNotifyMessage
  | ChatInviteEmpty
  | ChatInviteExported
  | ChatInviteAlready
  | ChatInvite
  | InputStickerSetEmpty
  | InputStickerSetID
  | InputStickerSetShortName
  | InputStickerSetAnimatedEmoji
  | StickerSet
  | messages_StickerSet
  | BotCommand
  | BotInfo
  | KeyboardButton
  | KeyboardButtonUrl
  | KeyboardButtonCallback
  | KeyboardButtonRequestPhone
  | KeyboardButtonRequestGeoLocation
  | KeyboardButtonSwitchInline
  | KeyboardButtonGame
  | KeyboardButtonBuy
  | KeyboardButtonUrlAuth
  | InputKeyboardButtonUrlAuth
  | KeyboardButtonRow
  | ReplyKeyboardHide
  | ReplyKeyboardForceReply
  | ReplyKeyboardMarkup
  | ReplyInlineMarkup
  | MessageEntityUnknown
  | MessageEntityMention
  | MessageEntityHashtag
  | MessageEntityBotCommand
  | MessageEntityUrl
  | MessageEntityEmail
  | MessageEntityBold
  | MessageEntityItalic
  | MessageEntityCode
  | MessageEntityPre
  | MessageEntityTextUrl
  | MessageEntityMentionName
  | InputMessageEntityMentionName
  | MessageEntityPhone
  | MessageEntityCashtag
  | MessageEntityUnderline
  | MessageEntityStrike
  | MessageEntityBlockquote
  | InputChannelEmpty
  | InputChannel
  | InputChannelFromMessage
  | contacts_ResolvedPeer
  | MessageRange
  | updates_ChannelDifferenceEmpty
  | updates_ChannelDifferenceTooLong
  | updates_ChannelDifference
  | ChannelMessagesFilterEmpty
  | ChannelMessagesFilter
  | ChannelParticipant
  | ChannelParticipantSelf
  | ChannelParticipantCreator
  | ChannelParticipantAdmin
  | ChannelParticipantBanned
  | ChannelParticipantsRecent
  | ChannelParticipantsAdmins
  | ChannelParticipantsKicked
  | ChannelParticipantsBots
  | ChannelParticipantsBanned
  | ChannelParticipantsSearch
  | ChannelParticipantsContacts
  | channels_ChannelParticipants
  | channels_ChannelParticipantsNotModified
  | channels_ChannelParticipant
  | help_TermsOfService
  | FoundGif
  | FoundGifCached
  | messages_FoundGifs
  | messages_SavedGifsNotModified
  | messages_SavedGifs
  | InputBotInlineMessageMediaAuto
  | InputBotInlineMessageText
  | InputBotInlineMessageMediaGeo
  | InputBotInlineMessageMediaVenue
  | InputBotInlineMessageMediaContact
  | InputBotInlineMessageGame
  | InputBotInlineResult
  | InputBotInlineResultPhoto
  | InputBotInlineResultDocument
  | InputBotInlineResultGame
  | BotInlineMessageMediaAuto
  | BotInlineMessageText
  | BotInlineMessageMediaGeo
  | BotInlineMessageMediaVenue
  | BotInlineMessageMediaContact
  | BotInlineResult
  | BotInlineMediaResult
  | messages_BotResults
  | ExportedMessageLink
  | MessageFwdHeader
  | auth_CodeTypeSms
  | auth_CodeTypeCall
  | auth_CodeTypeFlashCall
  | auth_SentCodeTypeApp
  | auth_SentCodeTypeSms
  | auth_SentCodeTypeCall
  | auth_SentCodeTypeFlashCall
  | messages_BotCallbackAnswer
  | messages_MessageEditData
  | InputBotInlineMessageID
  | InlineBotSwitchPM
  | messages_PeerDialogs
  | TopPeer
  | TopPeerCategoryBotsPM
  | TopPeerCategoryBotsInline
  | TopPeerCategoryCorrespondents
  | TopPeerCategoryGroups
  | TopPeerCategoryChannels
  | TopPeerCategoryPhoneCalls
  | TopPeerCategoryForwardUsers
  | TopPeerCategoryForwardChats
  | TopPeerCategoryPeers
  | contacts_TopPeersNotModified
  | contacts_TopPeers
  | contacts_TopPeersDisabled
  | DraftMessageEmpty
  | DraftMessage
  | messages_FeaturedStickersNotModified
  | messages_FeaturedStickers
  | messages_RecentStickersNotModified
  | messages_RecentStickers
  | messages_ArchivedStickers
  | messages_StickerSetInstallResultSuccess
  | messages_StickerSetInstallResultArchive
  | StickerSetCovered
  | StickerSetMultiCovered
  | MaskCoords
  | InputStickeredMediaPhoto
  | InputStickeredMediaDocument
  | Game
  | InputGameID
  | InputGameShortName
  | HighScore
  | messages_HighScores
  | TextEmpty
  | TextPlain
  | TextBold
  | TextItalic
  | TextUnderline
  | TextStrike
  | TextFixed
  | TextUrl
  | TextEmail
  | TextConcat
  | TextSubscript
  | TextSuperscript
  | TextMarked
  | TextPhone
  | TextImage
  | TextAnchor
  | PageBlockUnsupported
  | PageBlockTitle
  | PageBlockSubtitle
  | PageBlockAuthorDate
  | PageBlockHeader
  | PageBlockSubheader
  | PageBlockParagraph
  | PageBlockPreformatted
  | PageBlockFooter
  | PageBlockDivider
  | PageBlockAnchor
  | PageBlockList
  | PageBlockBlockquote
  | PageBlockPullquote
  | PageBlockPhoto
  | PageBlockVideo
  | PageBlockCover
  | PageBlockEmbed
  | PageBlockEmbedPost
  | PageBlockCollage
  | PageBlockSlideshow
  | PageBlockChannel
  | PageBlockAudio
  | PageBlockKicker
  | PageBlockTable
  | PageBlockOrderedList
  | PageBlockDetails
  | PageBlockRelatedArticles
  | PageBlockMap
  | PhoneCallDiscardReasonMissed
  | PhoneCallDiscardReasonDisconnect
  | PhoneCallDiscardReasonHangup
  | PhoneCallDiscardReasonBusy
  | DataJSON
  | LabeledPrice
  | Invoice
  | PaymentCharge
  | PostAddress
  | PaymentRequestedInfo
  | PaymentSavedCredentialsCard
  | WebDocument
  | WebDocumentNoProxy
  | InputWebDocument
  | InputWebFileLocation
  | InputWebFileGeoPointLocation
  | upload_WebFile
  | payments_PaymentForm
  | payments_ValidatedRequestedInfo
  | payments_PaymentResult
  | payments_PaymentVerificationNeeded
  | payments_PaymentReceipt
  | payments_SavedInfo
  | InputPaymentCredentialsSaved
  | InputPaymentCredentials
  | InputPaymentCredentialsApplePay
  | InputPaymentCredentialsAndroidPay
  | account_TmpPassword
  | ShippingOption
  | InputStickerSetItem
  | InputPhoneCall
  | PhoneCallEmpty
  | PhoneCallWaiting
  | PhoneCallRequested
  | PhoneCallAccepted
  | PhoneCall
  | PhoneCallDiscarded
  | PhoneConnection
  | PhoneCallProtocol
  | phone_PhoneCall
  | upload_CdnFileReuploadNeeded
  | upload_CdnFile
  | CdnPublicKey
  | CdnConfig
  | LangPackString
  | LangPackStringPluralized
  | LangPackStringDeleted
  | LangPackDifference
  | LangPackLanguage
  | ChannelAdminLogEventActionChangeTitle
  | ChannelAdminLogEventActionChangeAbout
  | ChannelAdminLogEventActionChangeUsername
  | ChannelAdminLogEventActionChangePhoto
  | ChannelAdminLogEventActionToggleInvites
  | ChannelAdminLogEventActionToggleSignatures
  | ChannelAdminLogEventActionUpdatePinned
  | ChannelAdminLogEventActionEditMessage
  | ChannelAdminLogEventActionDeleteMessage
  | ChannelAdminLogEventActionParticipantJoin
  | ChannelAdminLogEventActionParticipantLeave
  | ChannelAdminLogEventActionParticipantInvite
  | ChannelAdminLogEventActionParticipantToggleBan
  | ChannelAdminLogEventActionParticipantToggleAdmin
  | ChannelAdminLogEventActionChangeStickerSet
  | ChannelAdminLogEventActionTogglePreHistoryHidden
  | ChannelAdminLogEventActionDefaultBannedRights
  | ChannelAdminLogEventActionStopPoll
  | ChannelAdminLogEventActionChangeLinkedChat
  | ChannelAdminLogEventActionChangeLocation
  | ChannelAdminLogEventActionToggleSlowMode
  | ChannelAdminLogEvent
  | channels_AdminLogResults
  | ChannelAdminLogEventsFilter
  | PopularContact
  | messages_FavedStickersNotModified
  | messages_FavedStickers
  | RecentMeUrlUnknown
  | RecentMeUrlUser
  | RecentMeUrlChat
  | RecentMeUrlChatInvite
  | RecentMeUrlStickerSet
  | help_RecentMeUrls
  | InputSingleMedia
  | WebAuthorization
  | account_WebAuthorizations
  | InputMessageID
  | InputMessageReplyTo
  | InputMessagePinned
  | InputDialogPeer
  | InputDialogPeerFolder
  | DialogPeer
  | DialogPeerFolder
  | messages_FoundStickerSetsNotModified
  | messages_FoundStickerSets
  | FileHash
  | InputClientProxy
  | help_ProxyDataEmpty
  | help_ProxyDataPromo
  | help_TermsOfServiceUpdateEmpty
  | help_TermsOfServiceUpdate
  | InputSecureFileUploaded
  | InputSecureFile
  | SecureFileEmpty
  | SecureFile
  | SecureData
  | SecurePlainPhone
  | SecurePlainEmail
  | SecureValueTypePersonalDetails
  | SecureValueTypePassport
  | SecureValueTypeDriverLicense
  | SecureValueTypeIdentityCard
  | SecureValueTypeInternalPassport
  | SecureValueTypeAddress
  | SecureValueTypeUtilityBill
  | SecureValueTypeBankStatement
  | SecureValueTypeRentalAgreement
  | SecureValueTypePassportRegistration
  | SecureValueTypeTemporaryRegistration
  | SecureValueTypePhone
  | SecureValueTypeEmail
  | SecureValue
  | InputSecureValue
  | SecureValueHash
  | SecureValueErrorData
  | SecureValueErrorFrontSide
  | SecureValueErrorReverseSide
  | SecureValueErrorSelfie
  | SecureValueErrorFile
  | SecureValueErrorFiles
  | SecureValueError
  | SecureValueErrorTranslationFile
  | SecureValueErrorTranslationFiles
  | SecureCredentialsEncrypted
  | account_AuthorizationForm
  | account_SentEmailCode
  | help_DeepLinkInfoEmpty
  | help_DeepLinkInfo
  | SavedPhoneContact
  | account_Takeout
  | PasswordKdfAlgoUnknown
  | PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow
  | SecurePasswordKdfAlgoUnknown
  | SecurePasswordKdfAlgoPBKDF2HMACSHA512iter100000
  | SecurePasswordKdfAlgoSHA512
  | SecureSecretSettings
  | InputCheckPasswordEmpty
  | InputCheckPasswordSRP
  | SecureRequiredType
  | SecureRequiredTypeOneOf
  | help_PassportConfigNotModified
  | help_PassportConfig
  | InputAppEvent
  | JsonObjectValue
  | JsonNull
  | JsonBool
  | JsonNumber
  | JsonString
  | JsonArray
  | JsonObject
  | PageTableCell
  | PageTableRow
  | PageCaption
  | PageListItemText
  | PageListItemBlocks
  | PageListOrderedItemText
  | PageListOrderedItemBlocks
  | PageRelatedArticle
  | Page
  | help_SupportName
  | help_UserInfoEmpty
  | help_UserInfo
  | PollAnswer
  | Poll
  | PollAnswerVoters
  | PollResults
  | ChatOnlines
  | StatsURL
  | ChatAdminRights
  | ChatBannedRights
  | InputWallPaper
  | InputWallPaperSlug
  | account_WallPapersNotModified
  | account_WallPapers
  | CodeSettings
  | WallPaperSettings
  | AutoDownloadSettings
  | account_AutoDownloadSettings
  | EmojiKeyword
  | EmojiKeywordDeleted
  | EmojiKeywordsDifference
  | EmojiURL
  | EmojiLanguage
  | FileLocationToBeDeprecated
  | Folder
  | InputFolderPeer
  | FolderPeer
  | messages_SearchCounter
  | UrlAuthResultRequest
  | UrlAuthResultAccepted
  | UrlAuthResultDefault
  | ChannelLocationEmpty
  | ChannelLocation
  | PeerLocated
  | RestrictionReason
  | InputTheme
  | InputThemeSlug
  | ThemeDocumentNotModified
  | Theme
  | account_ThemesNotModified
  | account_Themes
  | InvokeAfterMsgRequest
  | InvokeAfterMsgsRequest
  | InitConnectionRequest
  | InvokeWithLayerRequest
  | InvokeWithoutUpdatesRequest
  | InvokeWithMessagesRangeRequest
  | InvokeWithTakeoutRequest
  | auth_SendCodeRequest
  | auth_SignUpRequest
  | auth_SignInRequest
  | auth_LogOutRequest
  | auth_ResetAuthorizationsRequest
  | auth_ExportAuthorizationRequest
  | auth_ImportAuthorizationRequest
  | auth_BindTempAuthKeyRequest
  | auth_ImportBotAuthorizationRequest
  | auth_CheckPasswordRequest
  | auth_RequestPasswordRecoveryRequest
  | auth_RecoverPasswordRequest
  | auth_ResendCodeRequest
  | auth_CancelCodeRequest
  | auth_DropTempAuthKeysRequest
  | account_RegisterDeviceRequest
  | account_UnregisterDeviceRequest
  | account_UpdateNotifySettingsRequest
  | account_GetNotifySettingsRequest
  | account_ResetNotifySettingsRequest
  | account_UpdateProfileRequest
  | account_UpdateStatusRequest
  | account_GetWallPapersRequest
  | account_ReportPeerRequest
  | account_CheckUsernameRequest
  | account_UpdateUsernameRequest
  | account_GetPrivacyRequest
  | account_SetPrivacyRequest
  | account_DeleteAccountRequest
  | account_GetAccountTTLRequest
  | account_SetAccountTTLRequest
  | account_SendChangePhoneCodeRequest
  | account_ChangePhoneRequest
  | account_UpdateDeviceLockedRequest
  | account_GetAuthorizationsRequest
  | account_ResetAuthorizationRequest
  | account_GetPasswordRequest
  | account_GetPasswordSettingsRequest
  | account_UpdatePasswordSettingsRequest
  | account_SendConfirmPhoneCodeRequest
  | account_ConfirmPhoneRequest
  | account_GetTmpPasswordRequest
  | account_GetWebAuthorizationsRequest
  | account_ResetWebAuthorizationRequest
  | account_ResetWebAuthorizationsRequest
  | account_GetAllSecureValuesRequest
  | account_GetSecureValueRequest
  | account_SaveSecureValueRequest
  | account_DeleteSecureValueRequest
  | account_GetAuthorizationFormRequest
  | account_AcceptAuthorizationRequest
  | account_SendVerifyPhoneCodeRequest
  | account_VerifyPhoneRequest
  | account_SendVerifyEmailCodeRequest
  | account_VerifyEmailRequest
  | account_InitTakeoutSessionRequest
  | account_FinishTakeoutSessionRequest
  | account_ConfirmPasswordEmailRequest
  | account_ResendPasswordEmailRequest
  | account_CancelPasswordEmailRequest
  | account_GetContactSignUpNotificationRequest
  | account_SetContactSignUpNotificationRequest
  | account_GetNotifyExceptionsRequest
  | account_GetWallPaperRequest
  | account_UploadWallPaperRequest
  | account_SaveWallPaperRequest
  | account_InstallWallPaperRequest
  | account_ResetWallPapersRequest
  | account_GetAutoDownloadSettingsRequest
  | account_SaveAutoDownloadSettingsRequest
  | account_UploadThemeRequest
  | account_CreateThemeRequest
  | account_UpdateThemeRequest
  | account_SaveThemeRequest
  | account_InstallThemeRequest
  | account_GetThemeRequest
  | account_GetThemesRequest
  | users_GetUsersRequest
  | users_GetFullUserRequest
  | users_SetSecureValueErrorsRequest
  | contacts_GetContactIDsRequest
  | contacts_GetStatusesRequest
  | contacts_GetContactsRequest
  | contacts_ImportContactsRequest
  | contacts_DeleteContactsRequest
  | contacts_DeleteByPhonesRequest
  | contacts_BlockRequest
  | contacts_UnblockRequest
  | contacts_GetBlockedRequest
  | contacts_SearchRequest
  | contacts_ResolveUsernameRequest
  | contacts_GetTopPeersRequest
  | contacts_ResetTopPeerRatingRequest
  | contacts_ResetSavedRequest
  | contacts_GetSavedRequest
  | contacts_ToggleTopPeersRequest
  | contacts_AddContactRequest
  | contacts_AcceptContactRequest
  | contacts_GetLocatedRequest
  | messages_GetMessagesRequest
  | messages_GetDialogsRequest
  | messages_GetHistoryRequest
  | messages_SearchRequest
  | messages_ReadHistoryRequest
  | messages_DeleteHistoryRequest
  | messages_DeleteMessagesRequest
  | messages_ReceivedMessagesRequest
  | messages_SetTypingRequest
  | messages_SendMessageRequest
  | messages_SendMediaRequest
  | messages_ForwardMessagesRequest
  | messages_ReportSpamRequest
  | messages_GetPeerSettingsRequest
  | messages_ReportRequest
  | messages_GetChatsRequest
  | messages_GetFullChatRequest
  | messages_EditChatTitleRequest
  | messages_EditChatPhotoRequest
  | messages_AddChatUserRequest
  | messages_DeleteChatUserRequest
  | messages_CreateChatRequest
  | messages_GetDhConfigRequest
  | messages_RequestEncryptionRequest
  | messages_AcceptEncryptionRequest
  | messages_DiscardEncryptionRequest
  | messages_SetEncryptedTypingRequest
  | messages_ReadEncryptedHistoryRequest
  | messages_SendEncryptedRequest
  | messages_SendEncryptedFileRequest
  | messages_SendEncryptedServiceRequest
  | messages_ReceivedQueueRequest
  | messages_ReportEncryptedSpamRequest
  | messages_ReadMessageContentsRequest
  | messages_GetStickersRequest
  | messages_GetAllStickersRequest
  | messages_GetWebPagePreviewRequest
  | messages_ExportChatInviteRequest
  | messages_CheckChatInviteRequest
  | messages_ImportChatInviteRequest
  | messages_GetStickerSetRequest
  | messages_InstallStickerSetRequest
  | messages_UninstallStickerSetRequest
  | messages_StartBotRequest
  | messages_GetMessagesViewsRequest
  | messages_EditChatAdminRequest
  | messages_MigrateChatRequest
  | messages_SearchGlobalRequest
  | messages_ReorderStickerSetsRequest
  | messages_GetDocumentByHashRequest
  | messages_SearchGifsRequest
  | messages_GetSavedGifsRequest
  | messages_SaveGifRequest
  | messages_GetInlineBotResultsRequest
  | messages_SetInlineBotResultsRequest
  | messages_SendInlineBotResultRequest
  | messages_GetMessageEditDataRequest
  | messages_EditMessageRequest
  | messages_EditInlineBotMessageRequest
  | messages_GetBotCallbackAnswerRequest
  | messages_SetBotCallbackAnswerRequest
  | messages_GetPeerDialogsRequest
  | messages_SaveDraftRequest
  | messages_GetAllDraftsRequest
  | messages_GetFeaturedStickersRequest
  | messages_ReadFeaturedStickersRequest
  | messages_GetRecentStickersRequest
  | messages_SaveRecentStickerRequest
  | messages_ClearRecentStickersRequest
  | messages_GetArchivedStickersRequest
  | messages_GetMaskStickersRequest
  | messages_GetAttachedStickersRequest
  | messages_SetGameScoreRequest
  | messages_SetInlineGameScoreRequest
  | messages_GetGameHighScoresRequest
  | messages_GetInlineGameHighScoresRequest
  | messages_GetCommonChatsRequest
  | messages_GetAllChatsRequest
  | messages_GetWebPageRequest
  | messages_ToggleDialogPinRequest
  | messages_ReorderPinnedDialogsRequest
  | messages_GetPinnedDialogsRequest
  | messages_SetBotShippingResultsRequest
  | messages_SetBotPrecheckoutResultsRequest
  | messages_UploadMediaRequest
  | messages_SendScreenshotNotificationRequest
  | messages_GetFavedStickersRequest
  | messages_FaveStickerRequest
  | messages_GetUnreadMentionsRequest
  | messages_ReadMentionsRequest
  | messages_GetRecentLocationsRequest
  | messages_SendMultiMediaRequest
  | messages_UploadEncryptedFileRequest
  | messages_SearchStickerSetsRequest
  | messages_GetSplitRangesRequest
  | messages_MarkDialogUnreadRequest
  | messages_GetDialogUnreadMarksRequest
  | messages_ClearAllDraftsRequest
  | messages_UpdatePinnedMessageRequest
  | messages_SendVoteRequest
  | messages_GetPollResultsRequest
  | messages_GetOnlinesRequest
  | messages_GetStatsURLRequest
  | messages_EditChatAboutRequest
  | messages_EditChatDefaultBannedRightsRequest
  | messages_GetEmojiKeywordsRequest
  | messages_GetEmojiKeywordsDifferenceRequest
  | messages_GetEmojiKeywordsLanguagesRequest
  | messages_GetEmojiURLRequest
  | messages_GetSearchCountersRequest
  | messages_RequestUrlAuthRequest
  | messages_AcceptUrlAuthRequest
  | messages_HidePeerSettingsBarRequest
  | messages_GetScheduledHistoryRequest
  | messages_GetScheduledMessagesRequest
  | messages_SendScheduledMessagesRequest
  | messages_DeleteScheduledMessagesRequest
  | updates_GetStateRequest
  | updates_GetDifferenceRequest
  | updates_GetChannelDifferenceRequest
  | photos_UpdateProfilePhotoRequest
  | photos_UploadProfilePhotoRequest
  | photos_DeletePhotosRequest
  | photos_GetUserPhotosRequest
  | upload_SaveFilePartRequest
  | upload_GetFileRequest
  | upload_SaveBigFilePartRequest
  | upload_GetWebFileRequest
  | upload_GetCdnFileRequest
  | upload_ReuploadCdnFileRequest
  | upload_GetCdnFileHashesRequest
  | upload_GetFileHashesRequest
  | help_GetConfigRequest
  | help_GetNearestDcRequest
  | help_GetAppUpdateRequest
  | help_GetInviteTextRequest
  | help_GetSupportRequest
  | help_GetAppChangelogRequest
  | help_SetBotUpdatesStatusRequest
  | help_GetCdnConfigRequest
  | help_GetRecentMeUrlsRequest
  | help_GetProxyDataRequest
  | help_GetTermsOfServiceUpdateRequest
  | help_AcceptTermsOfServiceRequest
  | help_GetDeepLinkInfoRequest
  | help_GetAppConfigRequest
  | help_SaveAppLogRequest
  | help_GetPassportConfigRequest
  | help_GetSupportNameRequest
  | help_GetUserInfoRequest
  | help_EditUserInfoRequest
  | channels_ReadHistoryRequest
  | channels_DeleteMessagesRequest
  | channels_DeleteUserHistoryRequest
  | channels_ReportSpamRequest
  | channels_GetMessagesRequest
  | channels_GetParticipantsRequest
  | channels_GetParticipantRequest
  | channels_GetChannelsRequest
  | channels_GetFullChannelRequest
  | channels_CreateChannelRequest
  | channels_EditAdminRequest
  | channels_EditTitleRequest
  | channels_EditPhotoRequest
  | channels_CheckUsernameRequest
  | channels_UpdateUsernameRequest
  | channels_JoinChannelRequest
  | channels_LeaveChannelRequest
  | channels_InviteToChannelRequest
  | channels_DeleteChannelRequest
  | channels_ExportMessageLinkRequest
  | channels_ToggleSignaturesRequest
  | channels_GetAdminedPublicChannelsRequest
  | channels_EditBannedRequest
  | channels_GetAdminLogRequest
  | channels_SetStickersRequest
  | channels_ReadMessageContentsRequest
  | channels_DeleteHistoryRequest
  | channels_TogglePreHistoryHiddenRequest
  | channels_GetLeftChannelsRequest
  | channels_GetGroupsForDiscussionRequest
  | channels_SetDiscussionGroupRequest
  | channels_EditCreatorRequest
  | channels_EditLocationRequest
  | channels_ToggleSlowModeRequest
  | bots_SendCustomRequestRequest
  | bots_AnswerWebhookJSONQueryRequest
  | payments_GetPaymentFormRequest
  | payments_GetPaymentReceiptRequest
  | payments_ValidateRequestedInfoRequest
  | payments_SendPaymentFormRequest
  | payments_GetSavedInfoRequest
  | payments_ClearSavedInfoRequest
  | stickers_CreateStickerSetRequest
  | stickers_RemoveStickerFromSetRequest
  | stickers_ChangeStickerPositionRequest
  | stickers_AddStickerToSetRequest
  | phone_GetCallConfigRequest
  | phone_RequestCallRequest
  | phone_AcceptCallRequest
  | phone_ConfirmCallRequest
  | phone_ReceivedCallRequest
  | phone_DiscardCallRequest
  | phone_SetCallRatingRequest
  | phone_SaveCallDebugRequest
  | langpack_GetLangPackRequest
  | langpack_GetStringsRequest
  | langpack_GetDifferenceRequest
  | langpack_GetLanguagesRequest
  | langpack_GetLanguageRequest
  | folders_EditPeerFoldersRequest
  | folders_DeleteFolderRequest;
