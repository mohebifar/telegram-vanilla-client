export const tlObjectsDefinitions: any[] = [
  [
    0x05162463,
    [
      ["ResPQ", 0x786986b8],
      [
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["pq", "bytes"],
        ["serverPublicKeyFingerprints", "Vector<long>"]
      ]
    ]
  ],
  [
    0x83c95aec,
    [
      ["PQInnerData", 0x41701377],
      [
        ["pq", "bytes"],
        ["p", "bytes"],
        ["q", "bytes"],
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["newNonce", "int256"]
      ]
    ]
  ],
  [
    0xa9f55f95,
    [
      ["PQInnerDataDc", 0x41701377],
      [
        ["pq", "bytes"],
        ["p", "bytes"],
        ["q", "bytes"],
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["newNonce", "int256"],
        ["dc", "int"]
      ]
    ]
  ],
  [
    0x3c6a84d4,
    [
      ["PQInnerDataTemp", 0x41701377],
      [
        ["pq", "bytes"],
        ["p", "bytes"],
        ["q", "bytes"],
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["newNonce", "int256"],
        ["expiresIn", "int"]
      ]
    ]
  ],
  [
    0x56fddf88,
    [
      ["PQInnerDataTempDc", 0x41701377],
      [
        ["pq", "bytes"],
        ["p", "bytes"],
        ["q", "bytes"],
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["newNonce", "int256"],
        ["dc", "int"],
        ["expiresIn", "int"]
      ]
    ]
  ],
  [
    0x75a3f765,
    [
      ["BindAuthKeyInner", 0x2f099171],
      [
        ["nonce", "long"],
        ["tempAuthKeyId", "long"],
        ["permAuthKeyId", "long"],
        ["tempSessionId", "long"],
        ["expiresAt", "int"]
      ]
    ]
  ],
  [
    0x79cb045d,
    [
      ["ServerDHParamsFail", 0xa6188d9e],
      [
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["newNonceHash", "int128"]
      ]
    ]
  ],
  [
    0xd0e8075c,
    [
      ["ServerDHParamsOk", 0xa6188d9e],
      [
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["encryptedAnswer", "bytes"]
      ]
    ]
  ],
  [
    0xb5890dba,
    [
      ["ServerDHInnerData", 0xc69a67bc],
      [
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["g", "int"],
        ["dhPrime", "bytes"],
        ["gA", "bytes"],
        ["serverTime", "int"]
      ]
    ]
  ],
  [
    0x6643b654,
    [
      ["ClientDHInnerData", 0xf8eeef6a],
      [
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["retryId", "long"],
        ["gB", "bytes"]
      ]
    ]
  ],
  [
    0x3bcbf734,
    [
      ["DhGenOk", 0x55dd6cdb],
      [
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["newNonceHash1", "int128"]
      ]
    ]
  ],
  [
    0x46dc1fb9,
    [
      ["DhGenRetry", 0x55dd6cdb],
      [
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["newNonceHash2", "int128"]
      ]
    ]
  ],
  [
    0xa69dae02,
    [
      ["DhGenFail", 0x55dd6cdb],
      [
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["newNonceHash3", "int128"]
      ]
    ]
  ],
  [0xf660e1d4, [["DestroyAuthKeyOk", 0x8291e68e], []]],
  [0x0a9f2259, [["DestroyAuthKeyNone", 0x8291e68e], []]],
  [0xea109b13, [["DestroyAuthKeyFail", 0x8291e68e], []]],
  [0x60469778, [["ReqPqRequest", 0x786986b8], [["nonce", "int128"]]]],
  [0xbe7e8ef1, [["ReqPqMultiRequest", 0x786986b8], [["nonce", "int128"]]]],
  [
    0xd712e4be,
    [
      ["ReqDHParamsRequest", 0xa6188d9e],
      [
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["p", "bytes"],
        ["q", "bytes"],
        ["publicKeyFingerprint", "long"],
        ["encryptedData", "bytes"]
      ]
    ]
  ],
  [
    0xf5045f1f,
    [
      ["SetClientDHParamsRequest", 0x55dd6cdb],
      [
        ["nonce", "int128"],
        ["serverNonce", "int128"],
        ["encryptedData", "bytes"]
      ]
    ]
  ],
  [0xd1435160, [["DestroyAuthKeyRequest", 0x8291e68e], []]],
  [0x62d6b459, [["MsgsAck", 0x827677c4], [["msgIds", "Vector<long>"]]]],
  [
    0xa7eff811,
    [
      ["BadMsgNotification", 0xcebaa157],
      [
        ["badMsgId", "long"],
        ["badMsgSeqno", "int"],
        ["errorCode", "int"]
      ]
    ]
  ],
  [
    0xedab447b,
    [
      ["BadServerSalt", 0xcebaa157],
      [
        ["badMsgId", "long"],
        ["badMsgSeqno", "int"],
        ["errorCode", "int"],
        ["newServerSalt", "long"]
      ]
    ]
  ],
  [0xda69fb52, [["MsgsStateReq", 0x18f01dd0], [["msgIds", "Vector<long>"]]]],
  [
    0x04deb57d,
    [
      ["MsgsStateInfo", 0x70a0a64],
      [
        ["reqMsgId", "long"],
        ["info", "string"]
      ]
    ]
  ],
  [
    0x8cc0d131,
    [
      ["MsgsAllInfo", 0xfa8fcb54],
      [
        ["msgIds", "Vector<long>"],
        ["info", "string"]
      ]
    ]
  ],
  [
    0x276d3ec6,
    [
      ["MsgDetailedInfo", 0x5f32d5ee],
      [
        ["msgId", "long"],
        ["answerMsgId", "long"],
        ["bytes", "int"],
        ["status", "int"]
      ]
    ]
  ],
  [
    0x809db6df,
    [
      ["MsgNewDetailedInfo", 0x5f32d5ee],
      [
        ["answerMsgId", "long"],
        ["bytes", "int"],
        ["status", "int"]
      ]
    ]
  ],
  [0x7d861a08, [["MsgResendReq", 0x2024514], [["msgIds", "Vector<long>"]]]],
  [
    0x2144ca19,
    [
      ["RpcError", 0x4a17e265],
      [
        ["errorCode", "int"],
        ["errorMessage", "string"]
      ]
    ]
  ],
  [0x5e2ad36e, [["RpcAnswerUnknown", 0x4bca7570], []]],
  [0xcd78e586, [["RpcAnswerDroppedRunning", 0x4bca7570], []]],
  [
    0xa43ad8b7,
    [
      ["RpcAnswerDropped", 0x4bca7570],
      [
        ["msgId", "long"],
        ["seqNo", "int"],
        ["bytes", "int"]
      ]
    ]
  ],
  [
    0x0949d9dc,
    [
      ["FutureSalt", 0x45e53dcf],
      [
        ["validSince", "int"],
        ["validUntil", "int"],
        ["salt", "long"]
      ]
    ]
  ],
  [
    0xae500895,
    [
      ["FutureSalts", 0x1090f517],
      [
        ["reqMsgId", "long"],
        ["now", "int"],
        ["salts", "Vector<_>"]
      ]
    ]
  ],
  [
    0x347773c5,
    [
      ["Pong", 0x816aee71],
      [
        ["msgId", "long"],
        ["pingId", "long"]
      ]
    ]
  ],
  [0xe22045fc, [["DestroySessionOk", 0xaf0ce7bd], [["sessionId", "long"]]]],
  [0x62d350c9, [["DestroySessionNone", 0xaf0ce7bd], [["sessionId", "long"]]]],
  [
    0x9ec20908,
    [
      ["NewSessionCreated", 0x510d3031],
      [
        ["firstMsgId", "long"],
        ["uniqueId", "long"],
        ["serverSalt", "long"]
      ]
    ]
  ],
  [
    0x9299359f,
    [
      ["HttpWait", 0x1284aed6],
      [
        ["maxDelay", "int"],
        ["waitAfter", "int"],
        ["maxWait", "int"]
      ]
    ]
  ],
  [
    0xd433ad73,
    [
      ["IpPort", 0xa2a03726],
      [
        ["ipv4", "int"],
        ["port", "int"]
      ]
    ]
  ],
  [
    0x37982646,
    [
      ["IpPortSecret", 0xa2a03726],
      [
        ["ipv4", "int"],
        ["port", "int"],
        ["secret", "bytes"]
      ]
    ]
  ],
  [
    0x4679b65f,
    [
      ["AccessPointRule", 0xb1aca0fd],
      [
        ["phonePrefixRules", "string"],
        ["dcId", "int"],
        ["ips", "Vector<_>"]
      ]
    ]
  ],
  [
    0x5a592a6c,
    [
      ["help_ConfigSimple", 0x29183ac4],
      [
        ["date", "int"],
        ["expires", "int"],
        ["rules", "Vector<_>"]
      ]
    ]
  ],
  [0x6c52c484, [["TlsClientHello", 0xbef20920], [["blocks", "Vector<_>"]]]],
  [0x4218a164, [["TlsBlockString", 0xf1163490], [["data", "string"]]]],
  [0x4d4dc41e, [["TlsBlockRandom", 0xf1163490], [["length", "int"]]]],
  [0x09333afb, [["TlsBlockZero", 0xf1163490], [["length", "int"]]]],
  [0x10e8636f, [["TlsBlockDomain", 0xf1163490], []]],
  [0xe675a1c1, [["TlsBlockGrease", 0xf1163490], [["seed", "int"]]]],
  [0x9eb95b5c, [["TlsBlockPublicKey", 0xf1163490], []]],
  [0xe725d44f, [["TlsBlockScope", 0xf1163490], [["entries", "Vector<_>"]]]],
  [0x58e4a740, [["RpcDropAnswerRequest", 0x4bca7570], [["reqMsgId", "long"]]]],
  [0xb921bd04, [["GetFutureSaltsRequest", 0x1090f517], [["num", "int"]]]],
  [0x7abe77ec, [["PingRequest", 0x816aee71], [["pingId", "long"]]]],
  [
    0xf3427b8c,
    [
      ["PingDelayDisconnectRequest", 0x816aee71],
      [
        ["pingId", "long"],
        ["disconnectDelay", "int"]
      ]
    ]
  ],
  [
    0xe7512126,
    [["DestroySessionRequest", 0xaf0ce7bd], [["sessionId", "long"]]]
  ],
  [0x7f3b18ea, [["InputPeerEmpty", 0xc91c90b6], []]],
  [0x7da07ec9, [["InputPeerSelf", 0xc91c90b6], []]],
  [0x179be863, [["InputPeerChat", 0xc91c90b6], [["chatId", "int"]]]],
  [
    0x7b8e7de6,
    [
      ["InputPeerUser", 0xc91c90b6],
      [
        ["userId", "int"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0x20adaef8,
    [
      ["InputPeerChannel", 0xc91c90b6],
      [
        ["channelId", "int"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0x17bae2e6,
    [
      ["InputPeerUserFromMessage", 0xc91c90b6],
      [
        ["peer", "_"],
        ["msgId", "int"],
        ["userId", "int"]
      ]
    ]
  ],
  [
    0x9c95f7bb,
    [
      ["InputPeerChannelFromMessage", 0xc91c90b6],
      [
        ["peer", "_"],
        ["msgId", "int"],
        ["channelId", "int"]
      ]
    ]
  ],
  [0xb98886cf, [["InputUserEmpty", 0xe669bf46], []]],
  [0xf7c1b13f, [["InputUserSelf", 0xe669bf46], []]],
  [
    0xd8292816,
    [
      ["InputUser", 0xe669bf46],
      [
        ["userId", "int"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0x2d117597,
    [
      ["InputUserFromMessage", 0xe669bf46],
      [
        ["peer", "_"],
        ["msgId", "int"],
        ["userId", "int"]
      ]
    ]
  ],
  [
    0xf392b7f4,
    [
      ["InputPhoneContact", 0xae696a82],
      [
        ["clientId", "long"],
        ["phone", "string"],
        ["firstName", "string"],
        ["lastName", "string"]
      ]
    ]
  ],
  [
    0xf52ff27f,
    [
      ["InputFile", 0xe7655f1f],
      [
        ["id", "long"],
        ["parts", "int"],
        ["name", "string"],
        ["md5Checksum", "string"]
      ]
    ]
  ],
  [
    0xfa4f0bb5,
    [
      ["InputFileBig", 0xe7655f1f],
      [
        ["id", "long"],
        ["parts", "int"],
        ["name", "string"]
      ]
    ]
  ],
  [0x9664f57f, [["InputMediaEmpty", 0xfaf846f4], []]],
  [
    0x1e287d04,
    [
      ["InputMediaUploadedPhoto", 0xfaf846f4],
      [
        ["flags", "#FLAG"],
        ["file", "_"],
        ["stickers", "Flag0<Vector<_>>"],
        ["ttlSeconds", "Flag1<int>"]
      ]
    ]
  ],
  [
    0xb3ba0635,
    [
      ["InputMediaPhoto", 0xfaf846f4],
      [
        ["flags", "#FLAG"],
        ["id", "_"],
        ["ttlSeconds", "Flag0<int>"]
      ]
    ]
  ],
  [0xf9c44144, [["InputMediaGeoPoint", 0xfaf846f4], [["geoPoint", "_"]]]],
  [
    0xf8ab7dfb,
    [
      ["InputMediaContact", 0xfaf846f4],
      [
        ["phoneNumber", "string"],
        ["firstName", "string"],
        ["lastName", "string"],
        ["vcard", "string"]
      ]
    ]
  ],
  [
    0x5b38c6c1,
    [
      ["InputMediaUploadedDocument", 0xfaf846f4],
      [
        ["flags", "#FLAG"],
        ["nosoundVideo", "Flag3<true>"],
        ["file", "_"],
        ["thumb", "Flag2<_>"],
        ["mimeType", "string"],
        ["attributes", "Vector<_>"],
        ["stickers", "Flag0<Vector<_>>"],
        ["ttlSeconds", "Flag1<int>"]
      ]
    ]
  ],
  [
    0x23ab23d2,
    [
      ["InputMediaDocument", 0xfaf846f4],
      [
        ["flags", "#FLAG"],
        ["id", "_"],
        ["ttlSeconds", "Flag0<int>"]
      ]
    ]
  ],
  [
    0xc13d1c11,
    [
      ["InputMediaVenue", 0xfaf846f4],
      [
        ["geoPoint", "_"],
        ["title", "string"],
        ["address", "string"],
        ["provider", "string"],
        ["venueId", "string"],
        ["venueType", "string"]
      ]
    ]
  ],
  [
    0x4843b0fd,
    [
      ["InputMediaGifExternal", 0xfaf846f4],
      [
        ["url", "string"],
        ["q", "string"]
      ]
    ]
  ],
  [
    0xe5bbfe1a,
    [
      ["InputMediaPhotoExternal", 0xfaf846f4],
      [
        ["flags", "#FLAG"],
        ["url", "string"],
        ["ttlSeconds", "Flag0<int>"]
      ]
    ]
  ],
  [
    0xfb52dc99,
    [
      ["InputMediaDocumentExternal", 0xfaf846f4],
      [
        ["flags", "#FLAG"],
        ["url", "string"],
        ["ttlSeconds", "Flag0<int>"]
      ]
    ]
  ],
  [0xd33f43f3, [["InputMediaGame", 0xfaf846f4], [["id", "_"]]]],
  [
    0xf4e096c3,
    [
      ["InputMediaInvoice", 0xfaf846f4],
      [
        ["flags", "#FLAG"],
        ["title", "string"],
        ["description", "string"],
        ["photo", "Flag0<_>"],
        ["invoice", "_"],
        ["payload", "bytes"],
        ["provider", "string"],
        ["providerData", "_"],
        ["startParam", "string"]
      ]
    ]
  ],
  [
    0xce4e82fd,
    [
      ["InputMediaGeoLive", 0xfaf846f4],
      [
        ["flags", "#FLAG"],
        ["stopped", "Flag0<true>"],
        ["geoPoint", "_"],
        ["period", "Flag1<int>"]
      ]
    ]
  ],
  [
    0x0f94e5f1,
    [
      ["InputMediaPoll", 0xfaf846f4],
      [
        ["flags", "#FLAG"],
        ["poll", "_"],
        ["correctAnswers", "Flag0<Vector<bytes>>"],
        ["solution", "Flag1<string>"],
        ["solutionEntities", "Flag1<Vector<_>>"]
      ]
    ]
  ],
  [0xe66fbf7b, [["InputMediaDice", 0xfaf846f4], [["emoticon", "string"]]]],
  [0x1ca48f57, [["InputChatPhotoEmpty", 0xd4eb2d74], []]],
  [0x927c55b4, [["InputChatUploadedPhoto", 0xd4eb2d74], [["file", "_"]]]],
  [0x8953ad37, [["InputChatPhoto", 0xd4eb2d74], [["id", "_"]]]],
  [0xe4c123d6, [["InputGeoPointEmpty", 0x430d225], []]],
  [
    0xf3b7acc9,
    [
      ["InputGeoPoint", 0x430d225],
      [
        ["lat", "double"],
        ["long", "double"]
      ]
    ]
  ],
  [0x1cd7bf0d, [["InputPhotoEmpty", 0x846363e0], []]],
  [
    0x3bb3b94a,
    [
      ["InputPhoto", 0x846363e0],
      [
        ["id", "long"],
        ["accessHash", "long"],
        ["fileReference", "bytes"]
      ]
    ]
  ],
  [
    0xdfdaabe1,
    [
      ["InputFileLocation", 0x1523d462],
      [
        ["volumeId", "long"],
        ["localId", "int"],
        ["secret", "long"],
        ["fileReference", "bytes"]
      ]
    ]
  ],
  [
    0xf5235d55,
    [
      ["InputEncryptedFileLocation", 0x1523d462],
      [
        ["id", "long"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0xbad07584,
    [
      ["InputDocumentFileLocation", 0x1523d462],
      [
        ["id", "long"],
        ["accessHash", "long"],
        ["fileReference", "bytes"],
        ["thumbSize", "string"]
      ]
    ]
  ],
  [
    0xcbc7ee28,
    [
      ["InputSecureFileLocation", 0x1523d462],
      [
        ["id", "long"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [0x29be5899, [["InputTakeoutFileLocation", 0x1523d462], []]],
  [
    0x40181ffe,
    [
      ["InputPhotoFileLocation", 0x1523d462],
      [
        ["id", "long"],
        ["accessHash", "long"],
        ["fileReference", "bytes"],
        ["thumbSize", "string"]
      ]
    ]
  ],
  [
    0xd83466f3,
    [
      ["InputPhotoLegacyFileLocation", 0x1523d462],
      [
        ["id", "long"],
        ["accessHash", "long"],
        ["fileReference", "bytes"],
        ["volumeId", "long"],
        ["localId", "int"],
        ["secret", "long"]
      ]
    ]
  ],
  [
    0x27d69997,
    [
      ["InputPeerPhotoFileLocation", 0x1523d462],
      [
        ["flags", "#FLAG"],
        ["big", "Flag0<true>"],
        ["peer", "_"],
        ["volumeId", "long"],
        ["localId", "int"]
      ]
    ]
  ],
  [
    0x0dbaeae9,
    [
      ["InputStickerSetThumb", 0x1523d462],
      [
        ["stickerset", "_"],
        ["volumeId", "long"],
        ["localId", "int"]
      ]
    ]
  ],
  [0x9db1bc6d, [["PeerUser", 0x2d45687], [["userId", "int"]]]],
  [0xbad0e5bb, [["PeerChat", 0x2d45687], [["chatId", "int"]]]],
  [0xbddde532, [["PeerChannel", 0x2d45687], [["channelId", "int"]]]],
  [0xaa963b05, [["storage_FileUnknown", 0xf3a1e6f3], []]],
  [0x40bc6f52, [["storage_FilePartial", 0xf3a1e6f3], []]],
  [0x007efe0e, [["storage_FileJpeg", 0xf3a1e6f3], []]],
  [0xcae1aadf, [["storage_FileGif", 0xf3a1e6f3], []]],
  [0x0a4f63c0, [["storage_FilePng", 0xf3a1e6f3], []]],
  [0xae1e508d, [["storage_FilePdf", 0xf3a1e6f3], []]],
  [0x528a0677, [["storage_FileMp3", 0xf3a1e6f3], []]],
  [0x4b09ebbc, [["storage_FileMov", 0xf3a1e6f3], []]],
  [0xb3cea0e4, [["storage_FileMp4", 0xf3a1e6f3], []]],
  [0x1081464c, [["storage_FileWebp", 0xf3a1e6f3], []]],
  [0x200250ba, [["UserEmpty", 0x2da17977], [["id", "int"]]]],
  [
    0x938458c1,
    [
      ["User", 0x2da17977],
      [
        ["flags", "#FLAG"],
        ["isSelf", "Flag10<true>"],
        ["contact", "Flag11<true>"],
        ["mutualContact", "Flag12<true>"],
        ["deleted", "Flag13<true>"],
        ["bot", "Flag14<true>"],
        ["botChatHistory", "Flag15<true>"],
        ["botNochats", "Flag16<true>"],
        ["verified", "Flag17<true>"],
        ["restricted", "Flag18<true>"],
        ["min", "Flag20<true>"],
        ["botInlineGeo", "Flag21<true>"],
        ["support", "Flag23<true>"],
        ["scam", "Flag24<true>"],
        ["id", "int"],
        ["accessHash", "Flag0<long>"],
        ["firstName", "Flag1<string>"],
        ["lastName", "Flag2<string>"],
        ["username", "Flag3<string>"],
        ["phone", "Flag4<string>"],
        ["photo", "Flag5<_>"],
        ["status", "Flag6<_>"],
        ["botInfoVersion", "Flag14<int>"],
        ["restrictionReason", "Flag18<Vector<_>>"],
        ["botInlinePlaceholder", "Flag19<string>"],
        ["langCode", "Flag22<string>"]
      ]
    ]
  ],
  [0x4f11bae1, [["UserProfilePhotoEmpty", 0xc6338f7d], []]],
  [
    0xecd75d8c,
    [
      ["UserProfilePhoto", 0xc6338f7d],
      [
        ["photoId", "long"],
        ["photoSmall", "_"],
        ["photoBig", "_"],
        ["dcId", "int"]
      ]
    ]
  ],
  [0x09d05049, [["UserStatusEmpty", 0x5b0b743e], []]],
  [0xedb93949, [["UserStatusOnline", 0x5b0b743e], [["expires", "int"]]]],
  [0x008c703f, [["UserStatusOffline", 0x5b0b743e], [["wasOnline", "int"]]]],
  [0xe26f42f1, [["UserStatusRecently", 0x5b0b743e], []]],
  [0x07bf09fc, [["UserStatusLastWeek", 0x5b0b743e], []]],
  [0x77ebc742, [["UserStatusLastMonth", 0x5b0b743e], []]],
  [0x9ba2d800, [["ChatEmpty", 0xc5af5d94], [["id", "int"]]]],
  [
    0x3bda1bde,
    [
      ["Chat", 0xc5af5d94],
      [
        ["flags", "#FLAG"],
        ["creator", "Flag0<true>"],
        ["kicked", "Flag1<true>"],
        ["left", "Flag2<true>"],
        ["deactivated", "Flag5<true>"],
        ["id", "int"],
        ["title", "string"],
        ["photo", "_"],
        ["participantsCount", "int"],
        ["date", "int"],
        ["version", "int"],
        ["migratedTo", "Flag6<_>"],
        ["adminRights", "Flag14<_>"],
        ["defaultBannedRights", "Flag18<_>"]
      ]
    ]
  ],
  [
    0x07328bdb,
    [
      ["ChatForbidden", 0xc5af5d94],
      [
        ["id", "int"],
        ["title", "string"]
      ]
    ]
  ],
  [
    0xd31a961e,
    [
      ["Channel", 0xc5af5d94],
      [
        ["flags", "#FLAG"],
        ["creator", "Flag0<true>"],
        ["left", "Flag2<true>"],
        ["broadcast", "Flag5<true>"],
        ["verified", "Flag7<true>"],
        ["megagroup", "Flag8<true>"],
        ["restricted", "Flag9<true>"],
        ["signatures", "Flag11<true>"],
        ["min", "Flag12<true>"],
        ["scam", "Flag19<true>"],
        ["hasLink", "Flag20<true>"],
        ["hasGeo", "Flag21<true>"],
        ["slowmodeEnabled", "Flag22<true>"],
        ["id", "int"],
        ["accessHash", "Flag13<long>"],
        ["title", "string"],
        ["username", "Flag6<string>"],
        ["photo", "_"],
        ["date", "int"],
        ["version", "int"],
        ["restrictionReason", "Flag9<Vector<_>>"],
        ["adminRights", "Flag14<_>"],
        ["bannedRights", "Flag15<_>"],
        ["defaultBannedRights", "Flag18<_>"],
        ["participantsCount", "Flag17<int>"]
      ]
    ]
  ],
  [
    0x289da732,
    [
      ["ChannelForbidden", 0xc5af5d94],
      [
        ["flags", "#FLAG"],
        ["broadcast", "Flag5<true>"],
        ["megagroup", "Flag8<true>"],
        ["id", "int"],
        ["accessHash", "long"],
        ["title", "string"],
        ["untilDate", "Flag16<int>"]
      ]
    ]
  ],
  [
    0x1b7c9db3,
    [
      ["ChatFull", 0xd49a2697],
      [
        ["flags", "#FLAG"],
        ["canSetUsername", "Flag7<true>"],
        ["hasScheduled", "Flag8<true>"],
        ["id", "int"],
        ["about", "string"],
        ["participants", "_"],
        ["chatPhoto", "Flag2<_>"],
        ["notifySettings", "_"],
        ["exportedInvite", "_"],
        ["botInfo", "Flag3<Vector<_>>"],
        ["pinnedMsgId", "Flag6<int>"],
        ["folderId", "Flag11<int>"]
      ]
    ]
  ],
  [
    0xf0e6672a,
    [
      ["ChannelFull", 0xd49a2697],
      [
        ["flags", "#FLAG"],
        ["canViewParticipants", "Flag3<true>"],
        ["canSetUsername", "Flag6<true>"],
        ["canSetStickers", "Flag7<true>"],
        ["hiddenPrehistory", "Flag10<true>"],
        ["canViewStats", "Flag12<true>"],
        ["canSetLocation", "Flag16<true>"],
        ["hasScheduled", "Flag19<true>"],
        ["id", "int"],
        ["about", "string"],
        ["participantsCount", "Flag0<int>"],
        ["adminsCount", "Flag1<int>"],
        ["kickedCount", "Flag2<int>"],
        ["bannedCount", "Flag2<int>"],
        ["onlineCount", "Flag13<int>"],
        ["readInboxMaxId", "int"],
        ["readOutboxMaxId", "int"],
        ["unreadCount", "int"],
        ["chatPhoto", "_"],
        ["notifySettings", "_"],
        ["exportedInvite", "_"],
        ["botInfo", "Vector<_>"],
        ["migratedFromChatId", "Flag4<int>"],
        ["migratedFromMaxId", "Flag4<int>"],
        ["pinnedMsgId", "Flag5<int>"],
        ["stickerset", "Flag8<_>"],
        ["availableMinId", "Flag9<int>"],
        ["folderId", "Flag11<int>"],
        ["linkedChatId", "Flag14<int>"],
        ["location", "Flag15<_>"],
        ["slowmodeSeconds", "Flag17<int>"],
        ["slowmodeNextSendDate", "Flag18<int>"],
        ["statsDc", "Flag12<int>"],
        ["pts", "int"]
      ]
    ]
  ],
  [
    0xc8d7493e,
    [
      ["ChatParticipant", 0x7d7c6f86],
      [
        ["userId", "int"],
        ["inviterId", "int"],
        ["date", "int"]
      ]
    ]
  ],
  [0xda13538a, [["ChatParticipantCreator", 0x7d7c6f86], [["userId", "int"]]]],
  [
    0xe2d6e436,
    [
      ["ChatParticipantAdmin", 0x7d7c6f86],
      [
        ["userId", "int"],
        ["inviterId", "int"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0xfc900c2b,
    [
      ["ChatParticipantsForbidden", 0x1fa89571],
      [
        ["flags", "#FLAG"],
        ["chatId", "int"],
        ["selfParticipant", "Flag0<_>"]
      ]
    ]
  ],
  [
    0x3f460fed,
    [
      ["ChatParticipants", 0x1fa89571],
      [
        ["chatId", "int"],
        ["participants", "Vector<_>"],
        ["version", "int"]
      ]
    ]
  ],
  [0x37c1011c, [["ChatPhotoEmpty", 0xac3ec4e5], []]],
  [
    0x475cdbd5,
    [
      ["ChatPhoto", 0xac3ec4e5],
      [
        ["photoSmall", "_"],
        ["photoBig", "_"],
        ["dcId", "int"]
      ]
    ]
  ],
  [0x83e5de54, [["MessageEmpty", 0x790009e3], [["id", "int"]]]],
  [
    0x452c0e65,
    [
      ["Message", 0x790009e3],
      [
        ["flags", "#FLAG"],
        ["out", "Flag1<true>"],
        ["mentioned", "Flag4<true>"],
        ["mediaUnread", "Flag5<true>"],
        ["silent", "Flag13<true>"],
        ["post", "Flag14<true>"],
        ["fromScheduled", "Flag18<true>"],
        ["legacy", "Flag19<true>"],
        ["editHide", "Flag21<true>"],
        ["id", "int"],
        ["fromId", "Flag8<int>"],
        ["toId", "_"],
        ["fwdFrom", "Flag2<_>"],
        ["viaBotId", "Flag11<int>"],
        ["replyToMsgId", "Flag3<int>"],
        ["date", "int"],
        ["message", "string"],
        ["media", "Flag9<_>"],
        ["replyMarkup", "Flag6<_>"],
        ["entities", "Flag7<Vector<_>>"],
        ["views", "Flag10<int>"],
        ["editDate", "Flag15<int>"],
        ["postAuthor", "Flag16<string>"],
        ["groupedId", "Flag17<long>"],
        ["restrictionReason", "Flag22<Vector<_>>"]
      ]
    ]
  ],
  [
    0x9e19a1f6,
    [
      ["MessageService", 0x790009e3],
      [
        ["flags", "#FLAG"],
        ["out", "Flag1<true>"],
        ["mentioned", "Flag4<true>"],
        ["mediaUnread", "Flag5<true>"],
        ["silent", "Flag13<true>"],
        ["post", "Flag14<true>"],
        ["legacy", "Flag19<true>"],
        ["id", "int"],
        ["fromId", "Flag8<int>"],
        ["toId", "_"],
        ["replyToMsgId", "Flag3<int>"],
        ["date", "int"],
        ["action", "_"]
      ]
    ]
  ],
  [0x3ded6320, [["MessageMediaEmpty", 0x476cbe32], []]],
  [
    0x695150d7,
    [
      ["MessageMediaPhoto", 0x476cbe32],
      [
        ["flags", "#FLAG"],
        ["photo", "Flag0<_>"],
        ["ttlSeconds", "Flag2<int>"]
      ]
    ]
  ],
  [0x56e0d474, [["MessageMediaGeo", 0x476cbe32], [["geo", "_"]]]],
  [
    0xcbf24940,
    [
      ["MessageMediaContact", 0x476cbe32],
      [
        ["phoneNumber", "string"],
        ["firstName", "string"],
        ["lastName", "string"],
        ["vcard", "string"],
        ["userId", "int"]
      ]
    ]
  ],
  [0x9f84f49e, [["MessageMediaUnsupported", 0x476cbe32], []]],
  [
    0x9cb070d7,
    [
      ["MessageMediaDocument", 0x476cbe32],
      [
        ["flags", "#FLAG"],
        ["document", "Flag0<_>"],
        ["ttlSeconds", "Flag2<int>"]
      ]
    ]
  ],
  [0xa32dd600, [["MessageMediaWebPage", 0x476cbe32], [["webpage", "_"]]]],
  [
    0x2ec0533f,
    [
      ["MessageMediaVenue", 0x476cbe32],
      [
        ["geo", "_"],
        ["title", "string"],
        ["address", "string"],
        ["provider", "string"],
        ["venueId", "string"],
        ["venueType", "string"]
      ]
    ]
  ],
  [0xfdb19008, [["MessageMediaGame", 0x476cbe32], [["game", "_"]]]],
  [
    0x84551347,
    [
      ["MessageMediaInvoice", 0x476cbe32],
      [
        ["flags", "#FLAG"],
        ["shippingAddressRequested", "Flag1<true>"],
        ["test", "Flag3<true>"],
        ["title", "string"],
        ["description", "string"],
        ["photo", "Flag0<_>"],
        ["receiptMsgId", "Flag2<int>"],
        ["currency", "string"],
        ["totalAmount", "long"],
        ["startParam", "string"]
      ]
    ]
  ],
  [
    0x7c3c2609,
    [
      ["MessageMediaGeoLive", 0x476cbe32],
      [
        ["geo", "_"],
        ["period", "int"]
      ]
    ]
  ],
  [
    0x4bd6e798,
    [
      ["MessageMediaPoll", 0x476cbe32],
      [
        ["poll", "_"],
        ["results", "_"]
      ]
    ]
  ],
  [
    0x3f7ee58b,
    [
      ["MessageMediaDice", 0x476cbe32],
      [
        ["value", "int"],
        ["emoticon", "string"]
      ]
    ]
  ],
  [0xb6aef7b0, [["MessageActionEmpty", 0x8680d126], []]],
  [
    0xa6638b9a,
    [
      ["MessageActionChatCreate", 0x8680d126],
      [
        ["title", "string"],
        ["users", "Vector<int>"]
      ]
    ]
  ],
  [
    0xb5a1ce5a,
    [["MessageActionChatEditTitle", 0x8680d126], [["title", "string"]]]
  ],
  [0x7fcb13a8, [["MessageActionChatEditPhoto", 0x8680d126], [["photo", "_"]]]],
  [0x95e3fbef, [["MessageActionChatDeletePhoto", 0x8680d126], []]],
  [
    0x488a7337,
    [["MessageActionChatAddUser", 0x8680d126], [["users", "Vector<int>"]]]
  ],
  [
    0xb2ae9b0c,
    [["MessageActionChatDeleteUser", 0x8680d126], [["userId", "int"]]]
  ],
  [
    0xf89cf5e8,
    [["MessageActionChatJoinedByLink", 0x8680d126], [["inviterId", "int"]]]
  ],
  [
    0x95d2ac92,
    [["MessageActionChannelCreate", 0x8680d126], [["title", "string"]]]
  ],
  [
    0x51bdb021,
    [["MessageActionChatMigrateTo", 0x8680d126], [["channelId", "int"]]]
  ],
  [
    0xb055eaee,
    [
      ["MessageActionChannelMigrateFrom", 0x8680d126],
      [
        ["title", "string"],
        ["chatId", "int"]
      ]
    ]
  ],
  [0x94bd38ed, [["MessageActionPinMessage", 0x8680d126], []]],
  [0x9fbab604, [["MessageActionHistoryClear", 0x8680d126], []]],
  [
    0x92a72876,
    [
      ["MessageActionGameScore", 0x8680d126],
      [
        ["gameId", "long"],
        ["score", "int"]
      ]
    ]
  ],
  [
    0x8f31b327,
    [
      ["MessageActionPaymentSentMe", 0x8680d126],
      [
        ["flags", "#FLAG"],
        ["currency", "string"],
        ["totalAmount", "long"],
        ["payload", "bytes"],
        ["info", "Flag0<_>"],
        ["shippingOptionId", "Flag1<string>"],
        ["charge", "_"]
      ]
    ]
  ],
  [
    0x40699cd0,
    [
      ["MessageActionPaymentSent", 0x8680d126],
      [
        ["currency", "string"],
        ["totalAmount", "long"]
      ]
    ]
  ],
  [
    0x80e11a7f,
    [
      ["MessageActionPhoneCall", 0x8680d126],
      [
        ["flags", "#FLAG"],
        ["video", "Flag2<true>"],
        ["callId", "long"],
        ["reason", "Flag0<_>"],
        ["duration", "Flag1<int>"]
      ]
    ]
  ],
  [0x4792929b, [["MessageActionScreenshotTaken", 0x8680d126], []]],
  [
    0xfae69f56,
    [["MessageActionCustomAction", 0x8680d126], [["message", "string"]]]
  ],
  [
    0xabe9affe,
    [["MessageActionBotAllowed", 0x8680d126], [["domain", "string"]]]
  ],
  [
    0x1b287353,
    [
      ["MessageActionSecureValuesSentMe", 0x8680d126],
      [
        ["values", "Vector<_>"],
        ["credentials", "_"]
      ]
    ]
  ],
  [
    0xd95c6154,
    [["MessageActionSecureValuesSent", 0x8680d126], [["types", "Vector<_>"]]]
  ],
  [0xf3f25f76, [["MessageActionContactSignUp", 0x8680d126], []]],
  [
    0x2c171f72,
    [
      ["Dialog", 0x42cddd54],
      [
        ["flags", "#FLAG"],
        ["pinned", "Flag2<true>"],
        ["unreadMark", "Flag3<true>"],
        ["peer", "_"],
        ["topMessage", "int"],
        ["readInboxMaxId", "int"],
        ["readOutboxMaxId", "int"],
        ["unreadCount", "int"],
        ["unreadMentionsCount", "int"],
        ["notifySettings", "_"],
        ["pts", "Flag0<int>"],
        ["draft", "Flag1<_>"],
        ["folderId", "Flag4<int>"]
      ]
    ]
  ],
  [
    0x71bd134c,
    [
      ["DialogFolder", 0x42cddd54],
      [
        ["flags", "#FLAG"],
        ["pinned", "Flag2<true>"],
        ["folder", "_"],
        ["peer", "_"],
        ["topMessage", "int"],
        ["unreadMutedPeersCount", "int"],
        ["unreadUnmutedPeersCount", "int"],
        ["unreadMutedMessagesCount", "int"],
        ["unreadUnmutedMessagesCount", "int"]
      ]
    ]
  ],
  [0x2331b22d, [["PhotoEmpty", 0xd576ab1c], [["id", "long"]]]],
  [
    0xd07504a5,
    [
      ["Photo", 0xd576ab1c],
      [
        ["flags", "#FLAG"],
        ["hasStickers", "Flag0<true>"],
        ["id", "long"],
        ["accessHash", "long"],
        ["fileReference", "bytes"],
        ["date", "int"],
        ["sizes", "Vector<_>"],
        ["dcId", "int"]
      ]
    ]
  ],
  [0x0e17e23c, [["PhotoSizeEmpty", 0x17cc29d9], [["type", "string"]]]],
  [
    0x77bfb61b,
    [
      ["PhotoSize", 0x17cc29d9],
      [
        ["type", "string"],
        ["location", "_"],
        ["w", "int"],
        ["h", "int"],
        ["size", "int"]
      ]
    ]
  ],
  [
    0xe9a734fa,
    [
      ["PhotoCachedSize", 0x17cc29d9],
      [
        ["type", "string"],
        ["location", "_"],
        ["w", "int"],
        ["h", "int"],
        ["bytes", "bytes"]
      ]
    ]
  ],
  [
    0xe0b0bc2e,
    [
      ["PhotoStrippedSize", 0x17cc29d9],
      [
        ["type", "string"],
        ["bytes", "bytes"]
      ]
    ]
  ],
  [0x1117dd5f, [["GeoPointEmpty", 0xd610e16d], []]],
  [
    0x0296f104,
    [
      ["GeoPoint", 0xd610e16d],
      [
        ["long", "double"],
        ["lat", "double"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0x5e002502,
    [
      ["auth_SentCode", 0x6ce87081],
      [
        ["flags", "#FLAG"],
        ["type", "_"],
        ["phoneCodeHash", "string"],
        ["nextType", "Flag1<_>"],
        ["timeout", "Flag2<int>"]
      ]
    ]
  ],
  [
    0xcd050916,
    [
      ["auth_Authorization", 0xb9e04e39],
      [
        ["flags", "#FLAG"],
        ["tmpSessions", "Flag0<int>"],
        ["user", "_"]
      ]
    ]
  ],
  [
    0x44747e9a,
    [
      ["auth_AuthorizationSignUpRequired", 0xb9e04e39],
      [
        ["flags", "#FLAG"],
        ["termsOfService", "Flag0<_>"]
      ]
    ]
  ],
  [
    0xdf969c2d,
    [
      ["auth_ExportedAuthorization", 0x5fd1ec51],
      [
        ["id", "int"],
        ["bytes", "bytes"]
      ]
    ]
  ],
  [0xb8bc5b0c, [["InputNotifyPeer", 0x58981615], [["peer", "_"]]]],
  [0x193b4417, [["InputNotifyUsers", 0x58981615], []]],
  [0x4a95e84e, [["InputNotifyChats", 0x58981615], []]],
  [0xb1db7c7e, [["InputNotifyBroadcasts", 0x58981615], []]],
  [
    0x9c3d198e,
    [
      ["InputPeerNotifySettings", 0x90db0b0d],
      [
        ["flags", "#FLAG"],
        ["showPreviews", "Flag0<Bool>"],
        ["silent", "Flag1<Bool>"],
        ["muteUntil", "Flag2<int>"],
        ["sound", "Flag3<string>"]
      ]
    ]
  ],
  [
    0xaf509d20,
    [
      ["PeerNotifySettings", 0xcf20c074],
      [
        ["flags", "#FLAG"],
        ["showPreviews", "Flag0<Bool>"],
        ["silent", "Flag1<Bool>"],
        ["muteUntil", "Flag2<int>"],
        ["sound", "Flag3<string>"]
      ]
    ]
  ],
  [
    0x818426cd,
    [
      ["PeerSettings", 0xf6a79f84],
      [
        ["flags", "#FLAG"],
        ["reportSpam", "Flag0<true>"],
        ["addContact", "Flag1<true>"],
        ["blockContact", "Flag2<true>"],
        ["shareContact", "Flag3<true>"],
        ["needContactsException", "Flag4<true>"],
        ["reportGeo", "Flag5<true>"]
      ]
    ]
  ],
  [
    0xa437c3ed,
    [
      ["WallPaper", 0x96a2c98b],
      [
        ["id", "long"],
        ["flags", "#FLAG"],
        ["creator", "Flag0<true>"],
        ["default", "Flag1<true>"],
        ["pattern", "Flag3<true>"],
        ["dark", "Flag4<true>"],
        ["accessHash", "long"],
        ["slug", "string"],
        ["document", "_"],
        ["settings", "Flag2<_>"]
      ]
    ]
  ],
  [
    0x8af40b25,
    [
      ["WallPaperNoFile", 0x96a2c98b],
      [
        ["flags", "#FLAG"],
        ["default", "Flag1<true>"],
        ["dark", "Flag4<true>"],
        ["settings", "Flag2<_>"]
      ]
    ]
  ],
  [0x58dbcab8, [["InputReportReasonSpam", 0x8401bd27], []]],
  [0x1e22c78d, [["InputReportReasonViolence", 0x8401bd27], []]],
  [0x2e59d922, [["InputReportReasonPornography", 0x8401bd27], []]],
  [0xadf44ee3, [["InputReportReasonChildAbuse", 0x8401bd27], []]],
  [0xe1746d0a, [["InputReportReasonOther", 0x8401bd27], [["text", "string"]]]],
  [0x9b89f93a, [["InputReportReasonCopyright", 0x8401bd27], []]],
  [0xdbd4feed, [["InputReportReasonGeoIrrelevant", 0x8401bd27], []]],
  [
    0xedf17c12,
    [
      ["UserFull", 0x1f4661b9],
      [
        ["flags", "#FLAG"],
        ["blocked", "Flag0<true>"],
        ["phoneCallsAvailable", "Flag4<true>"],
        ["phoneCallsPrivate", "Flag5<true>"],
        ["canPinMessage", "Flag7<true>"],
        ["hasScheduled", "Flag12<true>"],
        ["user", "_"],
        ["about", "Flag1<string>"],
        ["settings", "_"],
        ["profilePhoto", "Flag2<_>"],
        ["notifySettings", "_"],
        ["botInfo", "Flag3<_>"],
        ["pinnedMsgId", "Flag6<int>"],
        ["commonChatsCount", "int"],
        ["folderId", "Flag11<int>"]
      ]
    ]
  ],
  [
    0xf911c994,
    [
      ["Contact", 0x83dfdfa4],
      [
        ["userId", "int"],
        ["mutual", "Bool"]
      ]
    ]
  ],
  [
    0xd0028438,
    [
      ["ImportedContact", 0xb545bbda],
      [
        ["userId", "int"],
        ["clientId", "long"]
      ]
    ]
  ],
  [
    0x561bc879,
    [
      ["ContactBlocked", 0xb12d7ac6],
      [
        ["userId", "int"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0xd3680c61,
    [
      ["ContactStatus", 0x68c0d74c],
      [
        ["userId", "int"],
        ["status", "_"]
      ]
    ]
  ],
  [0xb74ba9d2, [["contacts_ContactsNotModified", 0x38be25f6], []]],
  [
    0xeae87e42,
    [
      ["contacts_Contacts", 0x38be25f6],
      [
        ["contacts", "Vector<_>"],
        ["savedCount", "int"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x77d01c3b,
    [
      ["contacts_ImportedContacts", 0x8172ad93],
      [
        ["imported", "Vector<_>"],
        ["popularInvites", "Vector<_>"],
        ["retryContacts", "Vector<long>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x1c138d15,
    [
      ["contacts_Blocked", 0xffba4f4f],
      [
        ["blocked", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x900802a1,
    [
      ["contacts_BlockedSlice", 0xffba4f4f],
      [
        ["count", "int"],
        ["blocked", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x15ba6c40,
    [
      ["messages_Dialogs", 0xe1b52ee],
      [
        ["dialogs", "Vector<_>"],
        ["messages", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x71e094f3,
    [
      ["messages_DialogsSlice", 0xe1b52ee],
      [
        ["count", "int"],
        ["dialogs", "Vector<_>"],
        ["messages", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0xf0e3e596,
    [["messages_DialogsNotModified", 0xe1b52ee], [["count", "int"]]]
  ],
  [
    0x8c718e87,
    [
      ["messages_Messages", 0xd4b40b5e],
      [
        ["messages", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0xc8edce1e,
    [
      ["messages_MessagesSlice", 0xd4b40b5e],
      [
        ["flags", "#FLAG"],
        ["inexact", "Flag1<true>"],
        ["count", "int"],
        ["nextRate", "Flag0<int>"],
        ["messages", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x99262e37,
    [
      ["messages_ChannelMessages", 0xd4b40b5e],
      [
        ["flags", "#FLAG"],
        ["inexact", "Flag1<true>"],
        ["pts", "int"],
        ["count", "int"],
        ["messages", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x74535f21,
    [["messages_MessagesNotModified", 0xd4b40b5e], [["count", "int"]]]
  ],
  [0x64ff9fd5, [["messages_Chats", 0x99d5cb14], [["chats", "Vector<_>"]]]],
  [
    0x9cd81144,
    [
      ["messages_ChatsSlice", 0x99d5cb14],
      [
        ["count", "int"],
        ["chats", "Vector<_>"]
      ]
    ]
  ],
  [
    0xe5d7d19c,
    [
      ["messages_ChatFull", 0x225a5109],
      [
        ["fullChat", "_"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0xb45c69d1,
    [
      ["messages_AffectedHistory", 0x2c49c116],
      [
        ["pts", "int"],
        ["ptsCount", "int"],
        ["offset", "int"]
      ]
    ]
  ],
  [0x57e2f66c, [["InputMessagesFilterEmpty", 0x8a36ec14], []]],
  [0x9609a51c, [["InputMessagesFilterPhotos", 0x8a36ec14], []]],
  [0x9fc00e65, [["InputMessagesFilterVideo", 0x8a36ec14], []]],
  [0x56e9f0e4, [["InputMessagesFilterPhotoVideo", 0x8a36ec14], []]],
  [0x9eddf188, [["InputMessagesFilterDocument", 0x8a36ec14], []]],
  [0x7ef0dd87, [["InputMessagesFilterUrl", 0x8a36ec14], []]],
  [0xffc86587, [["InputMessagesFilterGif", 0x8a36ec14], []]],
  [0x50f5c392, [["InputMessagesFilterVoice", 0x8a36ec14], []]],
  [0x3751b49e, [["InputMessagesFilterMusic", 0x8a36ec14], []]],
  [0x3a20ecb8, [["InputMessagesFilterChatPhotos", 0x8a36ec14], []]],
  [
    0x80c99768,
    [
      ["InputMessagesFilterPhoneCalls", 0x8a36ec14],
      [
        ["flags", "#FLAG"],
        ["missed", "Flag0<true>"]
      ]
    ]
  ],
  [0x7a7c17a4, [["InputMessagesFilterRoundVoice", 0x8a36ec14], []]],
  [0xb549da53, [["InputMessagesFilterRoundVideo", 0x8a36ec14], []]],
  [0xc1f8e69a, [["InputMessagesFilterMyMentions", 0x8a36ec14], []]],
  [0xe7026d0d, [["InputMessagesFilterGeo", 0x8a36ec14], []]],
  [0xe062db83, [["InputMessagesFilterContacts", 0x8a36ec14], []]],
  [
    0x1f2b0afd,
    [
      ["UpdateNewMessage", 0x9f89304e],
      [
        ["message", "_"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0x4e90bfd6,
    [
      ["UpdateMessageID", 0x9f89304e],
      [
        ["id", "int"],
        ["randomId", "long"]
      ]
    ]
  ],
  [
    0xa20db0e5,
    [
      ["UpdateDeleteMessages", 0x9f89304e],
      [
        ["messages", "Vector<int>"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0x5c486927,
    [
      ["UpdateUserTyping", 0x9f89304e],
      [
        ["userId", "int"],
        ["action", "_"]
      ]
    ]
  ],
  [
    0x9a65ea1f,
    [
      ["UpdateChatUserTyping", 0x9f89304e],
      [
        ["chatId", "int"],
        ["userId", "int"],
        ["action", "_"]
      ]
    ]
  ],
  [
    0x07761198,
    [["UpdateChatParticipants", 0x9f89304e], [["participants", "_"]]]
  ],
  [
    0x1bfbd823,
    [
      ["UpdateUserStatus", 0x9f89304e],
      [
        ["userId", "int"],
        ["status", "_"]
      ]
    ]
  ],
  [
    0xa7332b73,
    [
      ["UpdateUserName", 0x9f89304e],
      [
        ["userId", "int"],
        ["firstName", "string"],
        ["lastName", "string"],
        ["username", "string"]
      ]
    ]
  ],
  [
    0x95313b0c,
    [
      ["UpdateUserPhoto", 0x9f89304e],
      [
        ["userId", "int"],
        ["date", "int"],
        ["photo", "_"],
        ["previous", "Bool"]
      ]
    ]
  ],
  [
    0x12bcbd9a,
    [
      ["UpdateNewEncryptedMessage", 0x9f89304e],
      [
        ["message", "_"],
        ["qts", "int"]
      ]
    ]
  ],
  [
    0x1710f156,
    [["UpdateEncryptedChatTyping", 0x9f89304e], [["chatId", "int"]]]
  ],
  [
    0xb4a2e88d,
    [
      ["UpdateEncryption", 0x9f89304e],
      [
        ["chat", "_"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0x38fe25b7,
    [
      ["UpdateEncryptedMessagesRead", 0x9f89304e],
      [
        ["chatId", "int"],
        ["maxDate", "int"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0xea4b0e5c,
    [
      ["UpdateChatParticipantAdd", 0x9f89304e],
      [
        ["chatId", "int"],
        ["userId", "int"],
        ["inviterId", "int"],
        ["date", "int"],
        ["version", "int"]
      ]
    ]
  ],
  [
    0x6e5f8c22,
    [
      ["UpdateChatParticipantDelete", 0x9f89304e],
      [
        ["chatId", "int"],
        ["userId", "int"],
        ["version", "int"]
      ]
    ]
  ],
  [0x8e5e9873, [["UpdateDcOptions", 0x9f89304e], [["dcOptions", "Vector<_>"]]]],
  [
    0x80ece81a,
    [
      ["UpdateUserBlocked", 0x9f89304e],
      [
        ["userId", "int"],
        ["blocked", "Bool"]
      ]
    ]
  ],
  [
    0xbec268ef,
    [
      ["UpdateNotifySettings", 0x9f89304e],
      [
        ["peer", "_"],
        ["notifySettings", "_"]
      ]
    ]
  ],
  [
    0xebe46819,
    [
      ["UpdateServiceNotification", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["popup", "Flag0<true>"],
        ["inboxDate", "Flag1<int>"],
        ["type", "string"],
        ["message", "string"],
        ["media", "_"],
        ["entities", "Vector<_>"]
      ]
    ]
  ],
  [
    0xee3b272a,
    [
      ["UpdatePrivacy", 0x9f89304e],
      [
        ["key", "_"],
        ["rules", "Vector<_>"]
      ]
    ]
  ],
  [
    0x12b9417b,
    [
      ["UpdateUserPhone", 0x9f89304e],
      [
        ["userId", "int"],
        ["phone", "string"]
      ]
    ]
  ],
  [
    0x9c974fdf,
    [
      ["UpdateReadHistoryInbox", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["folderId", "Flag0<int>"],
        ["peer", "_"],
        ["maxId", "int"],
        ["stillUnreadCount", "int"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0x2f2f21bf,
    [
      ["UpdateReadHistoryOutbox", 0x9f89304e],
      [
        ["peer", "_"],
        ["maxId", "int"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0x7f891213,
    [
      ["UpdateWebPage", 0x9f89304e],
      [
        ["webpage", "_"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0x68c13933,
    [
      ["UpdateReadMessagesContents", 0x9f89304e],
      [
        ["messages", "Vector<int>"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0xeb0467fb,
    [
      ["UpdateChannelTooLong", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["channelId", "int"],
        ["pts", "Flag0<int>"]
      ]
    ]
  ],
  [0xb6d45656, [["UpdateChannel", 0x9f89304e], [["channelId", "int"]]]],
  [
    0x62ba04d9,
    [
      ["UpdateNewChannelMessage", 0x9f89304e],
      [
        ["message", "_"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0x330b5424,
    [
      ["UpdateReadChannelInbox", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["folderId", "Flag0<int>"],
        ["channelId", "int"],
        ["maxId", "int"],
        ["stillUnreadCount", "int"],
        ["pts", "int"]
      ]
    ]
  ],
  [
    0xc37521c9,
    [
      ["UpdateDeleteChannelMessages", 0x9f89304e],
      [
        ["channelId", "int"],
        ["messages", "Vector<int>"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0x98a12b4b,
    [
      ["UpdateChannelMessageViews", 0x9f89304e],
      [
        ["channelId", "int"],
        ["id", "int"],
        ["views", "int"]
      ]
    ]
  ],
  [
    0xb6901959,
    [
      ["UpdateChatParticipantAdmin", 0x9f89304e],
      [
        ["chatId", "int"],
        ["userId", "int"],
        ["isAdmin", "Bool"],
        ["version", "int"]
      ]
    ]
  ],
  [0x688a30aa, [["UpdateNewStickerSet", 0x9f89304e], [["stickerset", "_"]]]],
  [
    0x0bb2d201,
    [
      ["UpdateStickerSetsOrder", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["masks", "Flag0<true>"],
        ["order", "Vector<long>"]
      ]
    ]
  ],
  [0x43ae3dec, [["UpdateStickerSets", 0x9f89304e], []]],
  [0x9375341e, [["UpdateSavedGifs", 0x9f89304e], []]],
  [
    0x54826690,
    [
      ["UpdateBotInlineQuery", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["queryId", "long"],
        ["userId", "int"],
        ["query", "string"],
        ["geo", "Flag0<_>"],
        ["offset", "string"]
      ]
    ]
  ],
  [
    0x0e48f964,
    [
      ["UpdateBotInlineSend", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["userId", "int"],
        ["query", "string"],
        ["geo", "Flag0<_>"],
        ["id", "string"],
        ["msgId", "Flag1<_>"]
      ]
    ]
  ],
  [
    0x1b3f4df7,
    [
      ["UpdateEditChannelMessage", 0x9f89304e],
      [
        ["message", "_"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0x98592475,
    [
      ["UpdateChannelPinnedMessage", 0x9f89304e],
      [
        ["channelId", "int"],
        ["id", "int"]
      ]
    ]
  ],
  [
    0xe73547e1,
    [
      ["UpdateBotCallbackQuery", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["queryId", "long"],
        ["userId", "int"],
        ["peer", "_"],
        ["msgId", "int"],
        ["chatInstance", "long"],
        ["data", "Flag0<bytes>"],
        ["gameShortName", "Flag1<string>"]
      ]
    ]
  ],
  [
    0xe40370a3,
    [
      ["UpdateEditMessage", 0x9f89304e],
      [
        ["message", "_"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0xf9d27a5a,
    [
      ["UpdateInlineBotCallbackQuery", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["queryId", "long"],
        ["userId", "int"],
        ["msgId", "_"],
        ["chatInstance", "long"],
        ["data", "Flag0<bytes>"],
        ["gameShortName", "Flag1<string>"]
      ]
    ]
  ],
  [
    0x25d6c9c7,
    [
      ["UpdateReadChannelOutbox", 0x9f89304e],
      [
        ["channelId", "int"],
        ["maxId", "int"]
      ]
    ]
  ],
  [
    0xee2bb969,
    [
      ["UpdateDraftMessage", 0x9f89304e],
      [
        ["peer", "_"],
        ["draft", "_"]
      ]
    ]
  ],
  [0x571d2742, [["UpdateReadFeaturedStickers", 0x9f89304e], []]],
  [0x9a422c20, [["UpdateRecentStickers", 0x9f89304e], []]],
  [0xa229dd06, [["UpdateConfig", 0x9f89304e], []]],
  [0x3354678f, [["UpdatePtsChanged", 0x9f89304e], []]],
  [
    0x40771900,
    [
      ["UpdateChannelWebPage", 0x9f89304e],
      [
        ["channelId", "int"],
        ["webpage", "_"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0x6e6fe51c,
    [
      ["UpdateDialogPinned", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["pinned", "Flag0<true>"],
        ["folderId", "Flag1<int>"],
        ["peer", "_"]
      ]
    ]
  ],
  [
    0xfa0f3ca2,
    [
      ["UpdatePinnedDialogs", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["folderId", "Flag1<int>"],
        ["order", "Flag0<Vector<_>>"]
      ]
    ]
  ],
  [0x8317c0c3, [["UpdateBotWebhookJSON", 0x9f89304e], [["data", "_"]]]],
  [
    0x9b9240a6,
    [
      ["UpdateBotWebhookJSONQuery", 0x9f89304e],
      [
        ["queryId", "long"],
        ["data", "_"],
        ["timeout", "int"]
      ]
    ]
  ],
  [
    0xe0cdc940,
    [
      ["UpdateBotShippingQuery", 0x9f89304e],
      [
        ["queryId", "long"],
        ["userId", "int"],
        ["payload", "bytes"],
        ["shippingAddress", "_"]
      ]
    ]
  ],
  [
    0x5d2f3aa9,
    [
      ["UpdateBotPrecheckoutQuery", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["queryId", "long"],
        ["userId", "int"],
        ["payload", "bytes"],
        ["info", "Flag0<_>"],
        ["shippingOptionId", "Flag1<string>"],
        ["currency", "string"],
        ["totalAmount", "long"]
      ]
    ]
  ],
  [0xab0f6b1e, [["UpdatePhoneCall", 0x9f89304e], [["phoneCall", "_"]]]],
  [
    0x46560264,
    [["UpdateLangPackTooLong", 0x9f89304e], [["langCode", "string"]]]
  ],
  [0x56022f4d, [["UpdateLangPack", 0x9f89304e], [["difference", "_"]]]],
  [0xe511996d, [["UpdateFavedStickers", 0x9f89304e], []]],
  [
    0x89893b45,
    [
      ["UpdateChannelReadMessagesContents", 0x9f89304e],
      [
        ["channelId", "int"],
        ["messages", "Vector<int>"]
      ]
    ]
  ],
  [0x7084a7be, [["UpdateContactsReset", 0x9f89304e], []]],
  [
    0x70db6837,
    [
      ["UpdateChannelAvailableMessages", 0x9f89304e],
      [
        ["channelId", "int"],
        ["availableMinId", "int"]
      ]
    ]
  ],
  [
    0xe16459c3,
    [
      ["UpdateDialogUnreadMark", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["unread", "Flag0<true>"],
        ["peer", "_"]
      ]
    ]
  ],
  [
    0x4c43da18,
    [
      ["UpdateUserPinnedMessage", 0x9f89304e],
      [
        ["userId", "int"],
        ["id", "int"]
      ]
    ]
  ],
  [
    0xe10db349,
    [
      ["UpdateChatPinnedMessage", 0x9f89304e],
      [
        ["chatId", "int"],
        ["id", "int"],
        ["version", "int"]
      ]
    ]
  ],
  [
    0xaca1657b,
    [
      ["UpdateMessagePoll", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["pollId", "long"],
        ["poll", "Flag0<_>"],
        ["results", "_"]
      ]
    ]
  ],
  [
    0x54c01850,
    [
      ["UpdateChatDefaultBannedRights", 0x9f89304e],
      [
        ["peer", "_"],
        ["defaultBannedRights", "_"],
        ["version", "int"]
      ]
    ]
  ],
  [
    0x19360dc0,
    [
      ["UpdateFolderPeers", 0x9f89304e],
      [
        ["folderPeers", "Vector<_>"],
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [
    0x6a7e7366,
    [
      ["UpdatePeerSettings", 0x9f89304e],
      [
        ["peer", "_"],
        ["settings", "_"]
      ]
    ]
  ],
  [0xb4afcfb0, [["UpdatePeerLocated", 0x9f89304e], [["peers", "Vector<_>"]]]],
  [0x39a51dfb, [["UpdateNewScheduledMessage", 0x9f89304e], [["message", "_"]]]],
  [
    0x90866cee,
    [
      ["UpdateDeleteScheduledMessages", 0x9f89304e],
      [
        ["peer", "_"],
        ["messages", "Vector<int>"]
      ]
    ]
  ],
  [0x8216fba3, [["UpdateTheme", 0x9f89304e], [["theme", "_"]]]],
  [
    0x871fb939,
    [
      ["UpdateGeoLiveViewed", 0x9f89304e],
      [
        ["peer", "_"],
        ["msgId", "int"]
      ]
    ]
  ],
  [0x564fe691, [["UpdateLoginToken", 0x9f89304e], []]],
  [
    0x42f88f2c,
    [
      ["UpdateMessagePollVote", 0x9f89304e],
      [
        ["pollId", "long"],
        ["userId", "int"],
        ["options", "Vector<bytes>"]
      ]
    ]
  ],
  [
    0x26ffde7d,
    [
      ["UpdateDialogFilter", 0x9f89304e],
      [
        ["flags", "#FLAG"],
        ["id", "int"],
        ["filter", "Flag0<_>"]
      ]
    ]
  ],
  [
    0xa5d72105,
    [["UpdateDialogFilterOrder", 0x9f89304e], [["order", "Vector<int>"]]]
  ],
  [0x3504914f, [["UpdateDialogFilters", 0x9f89304e], []]],
  [
    0x2661bf09,
    [
      ["UpdatePhoneCallSignalingData", 0x9f89304e],
      [
        ["phoneCallId", "long"],
        ["data", "bytes"]
      ]
    ]
  ],
  [
    0xa56c2a3e,
    [
      ["updates_State", 0x23df1a01],
      [
        ["pts", "int"],
        ["qts", "int"],
        ["date", "int"],
        ["seq", "int"],
        ["unreadCount", "int"]
      ]
    ]
  ],
  [
    0x5d75a138,
    [
      ["updates_DifferenceEmpty", 0x20482874],
      [
        ["date", "int"],
        ["seq", "int"]
      ]
    ]
  ],
  [
    0x00f49ca0,
    [
      ["updates_Difference", 0x20482874],
      [
        ["newMessages", "Vector<_>"],
        ["newEncryptedMessages", "Vector<_>"],
        ["otherUpdates", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"],
        ["state", "_"]
      ]
    ]
  ],
  [
    0xa8fb1981,
    [
      ["updates_DifferenceSlice", 0x20482874],
      [
        ["newMessages", "Vector<_>"],
        ["newEncryptedMessages", "Vector<_>"],
        ["otherUpdates", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"],
        ["intermediateState", "_"]
      ]
    ]
  ],
  [0x4afe8f6d, [["updates_DifferenceTooLong", 0x20482874], [["pts", "int"]]]],
  [0xe317af7e, [["UpdatesTooLong", 0x8af52aac], []]],
  [
    0x914fbf11,
    [
      ["UpdateShortMessage", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["out", "Flag1<true>"],
        ["mentioned", "Flag4<true>"],
        ["mediaUnread", "Flag5<true>"],
        ["silent", "Flag13<true>"],
        ["id", "int"],
        ["userId", "int"],
        ["message", "string"],
        ["pts", "int"],
        ["ptsCount", "int"],
        ["date", "int"],
        ["fwdFrom", "Flag2<_>"],
        ["viaBotId", "Flag11<int>"],
        ["replyToMsgId", "Flag3<int>"],
        ["entities", "Flag7<Vector<_>>"]
      ]
    ]
  ],
  [
    0x16812688,
    [
      ["UpdateShortChatMessage", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["out", "Flag1<true>"],
        ["mentioned", "Flag4<true>"],
        ["mediaUnread", "Flag5<true>"],
        ["silent", "Flag13<true>"],
        ["id", "int"],
        ["fromId", "int"],
        ["chatId", "int"],
        ["message", "string"],
        ["pts", "int"],
        ["ptsCount", "int"],
        ["date", "int"],
        ["fwdFrom", "Flag2<_>"],
        ["viaBotId", "Flag11<int>"],
        ["replyToMsgId", "Flag3<int>"],
        ["entities", "Flag7<Vector<_>>"]
      ]
    ]
  ],
  [
    0x78d4dec1,
    [
      ["UpdateShort", 0x8af52aac],
      [
        ["update", "_"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0x725b04c3,
    [
      ["UpdatesCombined", 0x8af52aac],
      [
        ["updates", "Vector<_>"],
        ["users", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["date", "int"],
        ["seqStart", "int"],
        ["seq", "int"]
      ]
    ]
  ],
  [
    0x74ae4240,
    [
      ["Updates", 0x8af52aac],
      [
        ["updates", "Vector<_>"],
        ["users", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["date", "int"],
        ["seq", "int"]
      ]
    ]
  ],
  [
    0x11f1331c,
    [
      ["UpdateShortSentMessage", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["out", "Flag1<true>"],
        ["id", "int"],
        ["pts", "int"],
        ["ptsCount", "int"],
        ["date", "int"],
        ["media", "Flag9<_>"],
        ["entities", "Flag7<Vector<_>>"]
      ]
    ]
  ],
  [
    0x8dca6aa5,
    [
      ["photos_Photos", 0x27cfb967],
      [
        ["photos", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x15051f54,
    [
      ["photos_PhotosSlice", 0x27cfb967],
      [
        ["count", "int"],
        ["photos", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x20212ca8,
    [
      ["photos_Photo", 0xc292bd24],
      [
        ["photo", "_"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x096a18d5,
    [
      ["upload_File", 0x6c9bd728],
      [
        ["type", "_"],
        ["mtime", "int"],
        ["bytes", "bytes"]
      ]
    ]
  ],
  [
    0xf18cda44,
    [
      ["upload_FileCdnRedirect", 0x6c9bd728],
      [
        ["dcId", "int"],
        ["fileToken", "bytes"],
        ["encryptionKey", "bytes"],
        ["encryptionIv", "bytes"],
        ["fileHashes", "Vector<_>"]
      ]
    ]
  ],
  [
    0x18b7a10d,
    [
      ["DcOption", 0x9e43e123],
      [
        ["flags", "#FLAG"],
        ["ipv6", "Flag0<true>"],
        ["mediaOnly", "Flag1<true>"],
        ["tcpoOnly", "Flag2<true>"],
        ["cdn", "Flag3<true>"],
        ["static", "Flag4<true>"],
        ["id", "int"],
        ["ipAddress", "string"],
        ["port", "int"],
        ["secret", "Flag10<bytes>"]
      ]
    ]
  ],
  [
    0x330b4067,
    [
      ["Config", 0xd3262a4a],
      [
        ["flags", "#FLAG"],
        ["phonecallsEnabled", "Flag1<true>"],
        ["defaultP2pContacts", "Flag3<true>"],
        ["preloadFeaturedStickers", "Flag4<true>"],
        ["ignorePhoneEntities", "Flag5<true>"],
        ["revokePmInbox", "Flag6<true>"],
        ["blockedMode", "Flag8<true>"],
        ["pfsEnabled", "Flag13<true>"],
        ["date", "int"],
        ["expires", "int"],
        ["testMode", "Bool"],
        ["thisDc", "int"],
        ["dcOptions", "Vector<_>"],
        ["dcTxtDomainName", "string"],
        ["chatSizeMax", "int"],
        ["megagroupSizeMax", "int"],
        ["forwardedCountMax", "int"],
        ["onlineUpdatePeriodMs", "int"],
        ["offlineBlurTimeoutMs", "int"],
        ["offlineIdleTimeoutMs", "int"],
        ["onlineCloudTimeoutMs", "int"],
        ["notifyCloudDelayMs", "int"],
        ["notifyDefaultDelayMs", "int"],
        ["pushChatPeriodMs", "int"],
        ["pushChatLimit", "int"],
        ["savedGifsLimit", "int"],
        ["editTimeLimit", "int"],
        ["revokeTimeLimit", "int"],
        ["revokePmTimeLimit", "int"],
        ["ratingEDecay", "int"],
        ["stickersRecentLimit", "int"],
        ["stickersFavedLimit", "int"],
        ["channelsReadMediaPeriod", "int"],
        ["tmpSessions", "Flag0<int>"],
        ["pinnedDialogsCountMax", "int"],
        ["pinnedInfolderCountMax", "int"],
        ["callReceiveTimeoutMs", "int"],
        ["callRingTimeoutMs", "int"],
        ["callConnectTimeoutMs", "int"],
        ["callPacketTimeoutMs", "int"],
        ["meUrlPrefix", "string"],
        ["autoupdateUrlPrefix", "Flag7<string>"],
        ["gifSearchUsername", "Flag9<string>"],
        ["venueSearchUsername", "Flag10<string>"],
        ["imgSearchUsername", "Flag11<string>"],
        ["staticMapsProvider", "Flag12<string>"],
        ["captionLengthMax", "int"],
        ["messageLengthMax", "int"],
        ["webfileDcId", "int"],
        ["suggestedLangCode", "Flag2<string>"],
        ["langPackVersion", "Flag2<int>"],
        ["baseLangPackVersion", "Flag2<int>"]
      ]
    ]
  ],
  [
    0x8e1a1775,
    [
      ["NearestDc", 0x3877045f],
      [
        ["country", "string"],
        ["thisDc", "int"],
        ["nearestDc", "int"]
      ]
    ]
  ],
  [
    0x1da7158f,
    [
      ["help_AppUpdate", 0x5897069e],
      [
        ["flags", "#FLAG"],
        ["canNotSkip", "Flag0<true>"],
        ["id", "int"],
        ["version", "string"],
        ["text", "string"],
        ["entities", "Vector<_>"],
        ["document", "Flag1<_>"],
        ["url", "Flag2<string>"]
      ]
    ]
  ],
  [0xc45a6536, [["help_NoAppUpdate", 0x5897069e], []]],
  [0x18cb9f78, [["help_InviteText", 0xcf70aa35], [["message", "string"]]]],
  [0xab7ec0a0, [["EncryptedChatEmpty", 0x6d28a37a], [["id", "int"]]]],
  [
    0x3bf703dc,
    [
      ["EncryptedChatWaiting", 0x6d28a37a],
      [
        ["id", "int"],
        ["accessHash", "long"],
        ["date", "int"],
        ["adminId", "int"],
        ["participantId", "int"]
      ]
    ]
  ],
  [
    0xc878527e,
    [
      ["EncryptedChatRequested", 0x6d28a37a],
      [
        ["id", "int"],
        ["accessHash", "long"],
        ["date", "int"],
        ["adminId", "int"],
        ["participantId", "int"],
        ["gA", "bytes"]
      ]
    ]
  ],
  [
    0xfa56ce36,
    [
      ["EncryptedChat", 0x6d28a37a],
      [
        ["id", "int"],
        ["accessHash", "long"],
        ["date", "int"],
        ["adminId", "int"],
        ["participantId", "int"],
        ["gAOrB", "bytes"],
        ["keyFingerprint", "long"]
      ]
    ]
  ],
  [0x13d6dd27, [["EncryptedChatDiscarded", 0x6d28a37a], [["id", "int"]]]],
  [
    0xf141b5e1,
    [
      ["InputEncryptedChat", 0x6c7606c0],
      [
        ["chatId", "int"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [0xc21f497e, [["EncryptedFileEmpty", 0x842a67c0], []]],
  [
    0x4a70994c,
    [
      ["EncryptedFile", 0x842a67c0],
      [
        ["id", "long"],
        ["accessHash", "long"],
        ["size", "int"],
        ["dcId", "int"],
        ["keyFingerprint", "int"]
      ]
    ]
  ],
  [0x1837c364, [["InputEncryptedFileEmpty", 0x8574c27a], []]],
  [
    0x64bd0306,
    [
      ["InputEncryptedFileUploaded", 0x8574c27a],
      [
        ["id", "long"],
        ["parts", "int"],
        ["md5Checksum", "string"],
        ["keyFingerprint", "int"]
      ]
    ]
  ],
  [
    0x5a17b5e5,
    [
      ["InputEncryptedFile", 0x8574c27a],
      [
        ["id", "long"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0x2dc173c8,
    [
      ["InputEncryptedFileBigUploaded", 0x8574c27a],
      [
        ["id", "long"],
        ["parts", "int"],
        ["keyFingerprint", "int"]
      ]
    ]
  ],
  [
    0xed18c118,
    [
      ["EncryptedMessage", 0x239f2e51],
      [
        ["randomId", "long"],
        ["chatId", "int"],
        ["date", "int"],
        ["bytes", "bytes"],
        ["file", "_"]
      ]
    ]
  ],
  [
    0x23734b06,
    [
      ["EncryptedMessageService", 0x239f2e51],
      [
        ["randomId", "long"],
        ["chatId", "int"],
        ["date", "int"],
        ["bytes", "bytes"]
      ]
    ]
  ],
  [
    0xc0e24635,
    [["messages_DhConfigNotModified", 0xe488ed8b], [["random", "bytes"]]]
  ],
  [
    0x2c221edd,
    [
      ["messages_DhConfig", 0xe488ed8b],
      [
        ["g", "int"],
        ["p", "bytes"],
        ["version", "int"],
        ["random", "bytes"]
      ]
    ]
  ],
  [
    0x560f8935,
    [["messages_SentEncryptedMessage", 0xc99e3e50], [["date", "int"]]]
  ],
  [
    0x9493ff32,
    [
      ["messages_SentEncryptedFile", 0xc99e3e50],
      [
        ["date", "int"],
        ["file", "_"]
      ]
    ]
  ],
  [0x72f0eaae, [["InputDocumentEmpty", 0xf33fdb68], []]],
  [
    0x1abfb575,
    [
      ["InputDocument", 0xf33fdb68],
      [
        ["id", "long"],
        ["accessHash", "long"],
        ["fileReference", "bytes"]
      ]
    ]
  ],
  [0x36f8c871, [["DocumentEmpty", 0x211fe820], [["id", "long"]]]],
  [
    0x1e87342b,
    [
      ["Document", 0x211fe820],
      [
        ["flags", "#FLAG"],
        ["id", "long"],
        ["accessHash", "long"],
        ["fileReference", "bytes"],
        ["date", "int"],
        ["mimeType", "string"],
        ["size", "int"],
        ["thumbs", "Flag0<Vector<_>>"],
        ["videoThumbs", "Flag1<Vector<_>>"],
        ["dcId", "int"],
        ["attributes", "Vector<_>"]
      ]
    ]
  ],
  [
    0x17c6b5f6,
    [
      ["help_Support", 0x7159bceb],
      [
        ["phoneNumber", "string"],
        ["user", "_"]
      ]
    ]
  ],
  [0x9fd40bd8, [["NotifyPeer", 0xdfe8602e], [["peer", "_"]]]],
  [0xb4c83b4c, [["NotifyUsers", 0xdfe8602e], []]],
  [0xc007cec3, [["NotifyChats", 0xdfe8602e], []]],
  [0xd612e8ef, [["NotifyBroadcasts", 0xdfe8602e], []]],
  [0x16bf744e, [["SendMessageTypingAction", 0x20b2cc21], []]],
  [0xfd5ec8f5, [["SendMessageCancelAction", 0x20b2cc21], []]],
  [0xa187d66f, [["SendMessageRecordVideoAction", 0x20b2cc21], []]],
  [
    0xe9763aec,
    [["SendMessageUploadVideoAction", 0x20b2cc21], [["progress", "int"]]]
  ],
  [0xd52f73f7, [["SendMessageRecordAudioAction", 0x20b2cc21], []]],
  [
    0xf351d7ab,
    [["SendMessageUploadAudioAction", 0x20b2cc21], [["progress", "int"]]]
  ],
  [
    0xd1d34a26,
    [["SendMessageUploadPhotoAction", 0x20b2cc21], [["progress", "int"]]]
  ],
  [
    0xaa0cd9e4,
    [["SendMessageUploadDocumentAction", 0x20b2cc21], [["progress", "int"]]]
  ],
  [0x176f8ba1, [["SendMessageGeoLocationAction", 0x20b2cc21], []]],
  [0x628cbc6f, [["SendMessageChooseContactAction", 0x20b2cc21], []]],
  [0xdd6a8f48, [["SendMessageGamePlayAction", 0x20b2cc21], []]],
  [0x88f27fbc, [["SendMessageRecordRoundAction", 0x20b2cc21], []]],
  [
    0x243e1c66,
    [["SendMessageUploadRoundAction", 0x20b2cc21], [["progress", "int"]]]
  ],
  [
    0xb3134d9d,
    [
      ["contacts_Found", 0x4386a2e3],
      [
        ["myResults", "Vector<_>"],
        ["results", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [0x4f96cb18, [["InputPrivacyKeyStatusTimestamp", 0x53627f8], []]],
  [0xbdfb0426, [["InputPrivacyKeyChatInvite", 0x53627f8], []]],
  [0xfabadc5f, [["InputPrivacyKeyPhoneCall", 0x53627f8], []]],
  [0xdb9e70d2, [["InputPrivacyKeyPhoneP2P", 0x53627f8], []]],
  [0xa4dd4c08, [["InputPrivacyKeyForwards", 0x53627f8], []]],
  [0x5719bacc, [["InputPrivacyKeyProfilePhoto", 0x53627f8], []]],
  [0x0352dafa, [["InputPrivacyKeyPhoneNumber", 0x53627f8], []]],
  [0xd1219bdd, [["InputPrivacyKeyAddedByPhone", 0x53627f8], []]],
  [0xbc2eab30, [["PrivacyKeyStatusTimestamp", 0x824651c3], []]],
  [0x500e6dfa, [["PrivacyKeyChatInvite", 0x824651c3], []]],
  [0x3d662b7b, [["PrivacyKeyPhoneCall", 0x824651c3], []]],
  [0x39491cc8, [["PrivacyKeyPhoneP2P", 0x824651c3], []]],
  [0x69ec56a3, [["PrivacyKeyForwards", 0x824651c3], []]],
  [0x96151fed, [["PrivacyKeyProfilePhoto", 0x824651c3], []]],
  [0xd19ae46d, [["PrivacyKeyPhoneNumber", 0x824651c3], []]],
  [0x42ffd42b, [["PrivacyKeyAddedByPhone", 0x824651c3], []]],
  [0x0d09e07b, [["InputPrivacyValueAllowContacts", 0x5a3b6b22], []]],
  [0x184b35ce, [["InputPrivacyValueAllowAll", 0x5a3b6b22], []]],
  [
    0x131cc67f,
    [["InputPrivacyValueAllowUsers", 0x5a3b6b22], [["users", "Vector<_>"]]]
  ],
  [0x0ba52007, [["InputPrivacyValueDisallowContacts", 0x5a3b6b22], []]],
  [0xd66b66c9, [["InputPrivacyValueDisallowAll", 0x5a3b6b22], []]],
  [
    0x90110467,
    [["InputPrivacyValueDisallowUsers", 0x5a3b6b22], [["users", "Vector<_>"]]]
  ],
  [
    0x4c81c1ba,
    [
      ["InputPrivacyValueAllowChatParticipants", 0x5a3b6b22],
      [["chats", "Vector<int>"]]
    ]
  ],
  [
    0xd82363af,
    [
      ["InputPrivacyValueDisallowChatParticipants", 0x5a3b6b22],
      [["chats", "Vector<int>"]]
    ]
  ],
  [0xfffe1bac, [["PrivacyValueAllowContacts", 0xebb7f270], []]],
  [0x65427b82, [["PrivacyValueAllowAll", 0xebb7f270], []]],
  [
    0x4d5bbe0c,
    [["PrivacyValueAllowUsers", 0xebb7f270], [["users", "Vector<int>"]]]
  ],
  [0xf888fa1a, [["PrivacyValueDisallowContacts", 0xebb7f270], []]],
  [0x8b73e763, [["PrivacyValueDisallowAll", 0xebb7f270], []]],
  [
    0x0c7f49b7,
    [["PrivacyValueDisallowUsers", 0xebb7f270], [["users", "Vector<int>"]]]
  ],
  [
    0x18be796b,
    [
      ["PrivacyValueAllowChatParticipants", 0xebb7f270],
      [["chats", "Vector<int>"]]
    ]
  ],
  [
    0xacae0690,
    [
      ["PrivacyValueDisallowChatParticipants", 0xebb7f270],
      [["chats", "Vector<int>"]]
    ]
  ],
  [
    0x50a04e45,
    [
      ["account_PrivacyRules", 0xb55aba82],
      [
        ["rules", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [0xb8d0afdf, [["AccountDaysTTL", 0xbaa39d88], [["days", "int"]]]],
  [
    0x6c37c15c,
    [
      ["DocumentAttributeImageSize", 0xf729eb9b],
      [
        ["w", "int"],
        ["h", "int"]
      ]
    ]
  ],
  [0x11b58939, [["DocumentAttributeAnimated", 0xf729eb9b], []]],
  [
    0x6319d612,
    [
      ["DocumentAttributeSticker", 0xf729eb9b],
      [
        ["flags", "#FLAG"],
        ["mask", "Flag1<true>"],
        ["alt", "string"],
        ["stickerset", "_"],
        ["maskCoords", "Flag0<_>"]
      ]
    ]
  ],
  [
    0x0ef02ce6,
    [
      ["DocumentAttributeVideo", 0xf729eb9b],
      [
        ["flags", "#FLAG"],
        ["roundMessage", "Flag0<true>"],
        ["supportsStreaming", "Flag1<true>"],
        ["duration", "int"],
        ["w", "int"],
        ["h", "int"]
      ]
    ]
  ],
  [
    0x9852f9c6,
    [
      ["DocumentAttributeAudio", 0xf729eb9b],
      [
        ["flags", "#FLAG"],
        ["voice", "Flag10<true>"],
        ["duration", "int"],
        ["title", "Flag0<string>"],
        ["performer", "Flag1<string>"],
        ["waveform", "Flag2<bytes>"]
      ]
    ]
  ],
  [
    0x15590068,
    [["DocumentAttributeFilename", 0xf729eb9b], [["fileName", "string"]]]
  ],
  [0x9801d2f7, [["DocumentAttributeHasStickers", 0xf729eb9b], []]],
  [0xf1749a22, [["messages_StickersNotModified", 0xd73bb9de], []]],
  [
    0xe4599bbd,
    [
      ["messages_Stickers", 0xd73bb9de],
      [
        ["hash", "int"],
        ["stickers", "Vector<_>"]
      ]
    ]
  ],
  [
    0x12b299d4,
    [
      ["StickerPack", 0x9fefa4d4],
      [
        ["emoticon", "string"],
        ["documents", "Vector<long>"]
      ]
    ]
  ],
  [0xe86602c3, [["messages_AllStickersNotModified", 0x45834829], []]],
  [
    0xedfd405f,
    [
      ["messages_AllStickers", 0x45834829],
      [
        ["hash", "int"],
        ["sets", "Vector<_>"]
      ]
    ]
  ],
  [
    0x84d19185,
    [
      ["messages_AffectedMessages", 0xced3c06e],
      [
        ["pts", "int"],
        ["ptsCount", "int"]
      ]
    ]
  ],
  [0xeb1477e8, [["WebPageEmpty", 0x55a97481], [["id", "long"]]]],
  [
    0xc586da1c,
    [
      ["WebPagePending", 0x55a97481],
      [
        ["id", "long"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0xe89c45b2,
    [
      ["WebPage", 0x55a97481],
      [
        ["flags", "#FLAG"],
        ["id", "long"],
        ["url", "string"],
        ["displayUrl", "string"],
        ["hash", "int"],
        ["type", "Flag0<string>"],
        ["siteName", "Flag1<string>"],
        ["title", "Flag2<string>"],
        ["description", "Flag3<string>"],
        ["photo", "Flag4<_>"],
        ["embedUrl", "Flag5<string>"],
        ["embedType", "Flag5<string>"],
        ["embedWidth", "Flag6<int>"],
        ["embedHeight", "Flag6<int>"],
        ["duration", "Flag7<int>"],
        ["author", "Flag8<string>"],
        ["document", "Flag9<_>"],
        ["cachedPage", "Flag10<_>"],
        ["attributes", "Flag12<Vector<_>>"]
      ]
    ]
  ],
  [
    0x7311ca11,
    [
      ["WebPageNotModified", 0x55a97481],
      [
        ["flags", "#FLAG"],
        ["cachedPageViews", "Flag0<int>"]
      ]
    ]
  ],
  [
    0xad01d61d,
    [
      ["Authorization", 0xc913c01a],
      [
        ["flags", "#FLAG"],
        ["current", "Flag0<true>"],
        ["officialApp", "Flag1<true>"],
        ["passwordPending", "Flag2<true>"],
        ["hash", "long"],
        ["deviceModel", "string"],
        ["platform", "string"],
        ["systemVersion", "string"],
        ["apiId", "int"],
        ["appName", "string"],
        ["appVersion", "string"],
        ["dateCreated", "int"],
        ["dateActive", "int"],
        ["ip", "string"],
        ["country", "string"],
        ["region", "string"]
      ]
    ]
  ],
  [
    0x1250abde,
    [["account_Authorizations", 0xbf5e0ff], [["authorizations", "Vector<_>"]]]
  ],
  [
    0xad2641f8,
    [
      ["account_Password", 0x53a211a3],
      [
        ["flags", "#FLAG"],
        ["hasRecovery", "Flag0<true>"],
        ["hasSecureValues", "Flag1<true>"],
        ["hasPassword", "Flag2<true>"],
        ["currentAlgo", "Flag2<_>"],
        ["srp_B", "Flag2<bytes>"],
        ["srpId", "Flag2<long>"],
        ["hint", "Flag3<string>"],
        ["emailUnconfirmedPattern", "Flag4<string>"],
        ["newAlgo", "_"],
        ["newSecureAlgo", "_"],
        ["secureRandom", "bytes"]
      ]
    ]
  ],
  [
    0x9a5c33e5,
    [
      ["account_PasswordSettings", 0xd23fb078],
      [
        ["flags", "#FLAG"],
        ["email", "Flag0<string>"],
        ["secureSettings", "Flag1<_>"]
      ]
    ]
  ],
  [
    0xc23727c9,
    [
      ["account_PasswordInputSettings", 0xc426ca6],
      [
        ["flags", "#FLAG"],
        ["newAlgo", "Flag0<_>"],
        ["newPasswordHash", "Flag0<bytes>"],
        ["hint", "Flag0<string>"],
        ["email", "Flag1<string>"],
        ["newSecureSettings", "Flag2<_>"]
      ]
    ]
  ],
  [
    0x137948a5,
    [["auth_PasswordRecovery", 0xfa72d43a], [["emailPattern", "string"]]]
  ],
  [
    0xa384b779,
    [
      ["ReceivedNotifyMessage", 0xa962381e],
      [
        ["id", "int"],
        ["flags", "int"]
      ]
    ]
  ],
  [0x69df3769, [["ChatInviteEmpty", 0xb4748a58], []]],
  [0xfc2e05bc, [["ChatInviteExported", 0xb4748a58], [["link", "string"]]]],
  [0x5a686d7c, [["ChatInviteAlready", 0x4561736], [["chat", "_"]]]],
  [
    0xdfc2f58e,
    [
      ["ChatInvite", 0x4561736],
      [
        ["flags", "#FLAG"],
        ["channel", "Flag0<true>"],
        ["broadcast", "Flag1<true>"],
        ["public", "Flag2<true>"],
        ["megagroup", "Flag3<true>"],
        ["title", "string"],
        ["photo", "_"],
        ["participantsCount", "int"],
        ["participants", "Flag4<Vector<_>>"]
      ]
    ]
  ],
  [0xffb62b95, [["InputStickerSetEmpty", 0x3da389aa], []]],
  [
    0x9de7a269,
    [
      ["InputStickerSetID", 0x3da389aa],
      [
        ["id", "long"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0x861cc8a0,
    [["InputStickerSetShortName", 0x3da389aa], [["shortName", "string"]]]
  ],
  [0x028703c8, [["InputStickerSetAnimatedEmoji", 0x3da389aa], []]],
  [0xe67f520e, [["InputStickerSetDice", 0x3da389aa], [["emoticon", "string"]]]],
  [
    0xeeb46f27,
    [
      ["StickerSet", 0xbad3ff91],
      [
        ["flags", "#FLAG"],
        ["archived", "Flag1<true>"],
        ["official", "Flag2<true>"],
        ["masks", "Flag3<true>"],
        ["animated", "Flag5<true>"],
        ["installedDate", "Flag0<int>"],
        ["id", "long"],
        ["accessHash", "long"],
        ["title", "string"],
        ["shortName", "string"],
        ["thumb", "Flag4<_>"],
        ["thumbDcId", "Flag4<int>"],
        ["count", "int"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0xb60a24a6,
    [
      ["messages_StickerSet", 0x9b704a5a],
      [
        ["set", "_"],
        ["packs", "Vector<_>"],
        ["documents", "Vector<_>"]
      ]
    ]
  ],
  [
    0xc27ac8c7,
    [
      ["BotCommand", 0xe1e62c2],
      [
        ["command", "string"],
        ["description", "string"]
      ]
    ]
  ],
  [
    0x98e81d3a,
    [
      ["BotInfo", 0xf1f701db],
      [
        ["userId", "int"],
        ["description", "string"],
        ["commands", "Vector<_>"]
      ]
    ]
  ],
  [0xa2fa4880, [["KeyboardButton", 0xbad74a3], [["text", "string"]]]],
  [
    0x258aff05,
    [
      ["KeyboardButtonUrl", 0xbad74a3],
      [
        ["text", "string"],
        ["url", "string"]
      ]
    ]
  ],
  [
    0x683a5e46,
    [
      ["KeyboardButtonCallback", 0xbad74a3],
      [
        ["text", "string"],
        ["data", "bytes"]
      ]
    ]
  ],
  [
    0xb16a6c29,
    [["KeyboardButtonRequestPhone", 0xbad74a3], [["text", "string"]]]
  ],
  [
    0xfc796b3f,
    [["KeyboardButtonRequestGeoLocation", 0xbad74a3], [["text", "string"]]]
  ],
  [
    0x0568a748,
    [
      ["KeyboardButtonSwitchInline", 0xbad74a3],
      [
        ["flags", "#FLAG"],
        ["samePeer", "Flag0<true>"],
        ["text", "string"],
        ["query", "string"]
      ]
    ]
  ],
  [0x50f41ccf, [["KeyboardButtonGame", 0xbad74a3], [["text", "string"]]]],
  [0xafd93fbb, [["KeyboardButtonBuy", 0xbad74a3], [["text", "string"]]]],
  [
    0x10b78d29,
    [
      ["KeyboardButtonUrlAuth", 0xbad74a3],
      [
        ["flags", "#FLAG"],
        ["text", "string"],
        ["fwdText", "Flag0<string>"],
        ["url", "string"],
        ["buttonId", "int"]
      ]
    ]
  ],
  [
    0xd02e7fd4,
    [
      ["InputKeyboardButtonUrlAuth", 0xbad74a3],
      [
        ["flags", "#FLAG"],
        ["requestWriteAccess", "Flag0<true>"],
        ["text", "string"],
        ["fwdText", "Flag1<string>"],
        ["url", "string"],
        ["bot", "_"]
      ]
    ]
  ],
  [
    0xbbc7515d,
    [
      ["KeyboardButtonRequestPoll", 0xbad74a3],
      [
        ["flags", "#FLAG"],
        ["quiz", "Flag0<Bool>"],
        ["text", "string"]
      ]
    ]
  ],
  [0x77608b83, [["KeyboardButtonRow", 0x847730ae], [["buttons", "Vector<_>"]]]],
  [
    0xa03e5b85,
    [
      ["ReplyKeyboardHide", 0xe2e10ef2],
      [
        ["flags", "#FLAG"],
        ["selective", "Flag2<true>"]
      ]
    ]
  ],
  [
    0xf4108aa0,
    [
      ["ReplyKeyboardForceReply", 0xe2e10ef2],
      [
        ["flags", "#FLAG"],
        ["singleUse", "Flag1<true>"],
        ["selective", "Flag2<true>"]
      ]
    ]
  ],
  [
    0x3502758c,
    [
      ["ReplyKeyboardMarkup", 0xe2e10ef2],
      [
        ["flags", "#FLAG"],
        ["resize", "Flag0<true>"],
        ["singleUse", "Flag1<true>"],
        ["selective", "Flag2<true>"],
        ["rows", "Vector<_>"]
      ]
    ]
  ],
  [0x48a30254, [["ReplyInlineMarkup", 0xe2e10ef2], [["rows", "Vector<_>"]]]],
  [
    0xbb92ba95,
    [
      ["MessageEntityUnknown", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0xfa04579d,
    [
      ["MessageEntityMention", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x6f635b0d,
    [
      ["MessageEntityHashtag", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x6cef8ac7,
    [
      ["MessageEntityBotCommand", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x6ed02538,
    [
      ["MessageEntityUrl", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x64e475c2,
    [
      ["MessageEntityEmail", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0xbd610bc9,
    [
      ["MessageEntityBold", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x826f8b60,
    [
      ["MessageEntityItalic", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x28a20571,
    [
      ["MessageEntityCode", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x73924be0,
    [
      ["MessageEntityPre", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"],
        ["language", "string"]
      ]
    ]
  ],
  [
    0x76a6d327,
    [
      ["MessageEntityTextUrl", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"],
        ["url", "string"]
      ]
    ]
  ],
  [
    0x352dca58,
    [
      ["MessageEntityMentionName", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"],
        ["userId", "int"]
      ]
    ]
  ],
  [
    0x208e68c9,
    [
      ["InputMessageEntityMentionName", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"],
        ["userId", "_"]
      ]
    ]
  ],
  [
    0x9b69e34b,
    [
      ["MessageEntityPhone", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x4c4e743f,
    [
      ["MessageEntityCashtag", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x9c4e7e8b,
    [
      ["MessageEntityUnderline", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0xbf0693d4,
    [
      ["MessageEntityStrike", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x020df5d0,
    [
      ["MessageEntityBlockquote", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [
    0x761e6af4,
    [
      ["MessageEntityBankCard", 0xcf6419dc],
      [
        ["offset", "int"],
        ["length", "int"]
      ]
    ]
  ],
  [0xee8c1e86, [["InputChannelEmpty", 0x40f202fd], []]],
  [
    0xafeb712e,
    [
      ["InputChannel", 0x40f202fd],
      [
        ["channelId", "int"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0x2a286531,
    [
      ["InputChannelFromMessage", 0x40f202fd],
      [
        ["peer", "_"],
        ["msgId", "int"],
        ["channelId", "int"]
      ]
    ]
  ],
  [
    0x7f077ad9,
    [
      ["contacts_ResolvedPeer", 0xf065b3a8],
      [
        ["peer", "_"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x0ae30253,
    [
      ["MessageRange", 0xbec74577],
      [
        ["minId", "int"],
        ["maxId", "int"]
      ]
    ]
  ],
  [
    0x3e11affb,
    [
      ["updates_ChannelDifferenceEmpty", 0x29896f5d],
      [
        ["flags", "#FLAG"],
        ["final", "Flag0<true>"],
        ["pts", "int"],
        ["timeout", "Flag1<int>"]
      ]
    ]
  ],
  [
    0xa4bcc6fe,
    [
      ["updates_ChannelDifferenceTooLong", 0x29896f5d],
      [
        ["flags", "#FLAG"],
        ["final", "Flag0<true>"],
        ["timeout", "Flag1<int>"],
        ["dialog", "_"],
        ["messages", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x2064674e,
    [
      ["updates_ChannelDifference", 0x29896f5d],
      [
        ["flags", "#FLAG"],
        ["final", "Flag0<true>"],
        ["pts", "int"],
        ["timeout", "Flag1<int>"],
        ["newMessages", "Vector<_>"],
        ["otherUpdates", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [0x94d42ee7, [["ChannelMessagesFilterEmpty", 0x13336a56], []]],
  [
    0xcd77d957,
    [
      ["ChannelMessagesFilter", 0x13336a56],
      [
        ["flags", "#FLAG"],
        ["excludeNewMessages", "Flag1<true>"],
        ["ranges", "Vector<_>"]
      ]
    ]
  ],
  [
    0x15ebac1d,
    [
      ["ChannelParticipant", 0xd9c7fc18],
      [
        ["userId", "int"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0xa3289a6d,
    [
      ["ChannelParticipantSelf", 0xd9c7fc18],
      [
        ["userId", "int"],
        ["inviterId", "int"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0x808d15a4,
    [
      ["ChannelParticipantCreator", 0xd9c7fc18],
      [
        ["flags", "#FLAG"],
        ["userId", "int"],
        ["rank", "Flag0<string>"]
      ]
    ]
  ],
  [
    0xccbebbaf,
    [
      ["ChannelParticipantAdmin", 0xd9c7fc18],
      [
        ["flags", "#FLAG"],
        ["canEdit", "Flag0<true>"],
        ["isSelf", "Flag1<true>"],
        ["userId", "int"],
        ["inviterId", "Flag1<int>"],
        ["promotedBy", "int"],
        ["date", "int"],
        ["adminRights", "_"],
        ["rank", "Flag2<string>"]
      ]
    ]
  ],
  [
    0x1c0facaf,
    [
      ["ChannelParticipantBanned", 0xd9c7fc18],
      [
        ["flags", "#FLAG"],
        ["left", "Flag0<true>"],
        ["userId", "int"],
        ["kickedBy", "int"],
        ["date", "int"],
        ["bannedRights", "_"]
      ]
    ]
  ],
  [0xde3f3c79, [["ChannelParticipantsRecent", 0xbf4e2753], []]],
  [0xb4608969, [["ChannelParticipantsAdmins", 0xbf4e2753], []]],
  [0xa3b54985, [["ChannelParticipantsKicked", 0xbf4e2753], [["q", "string"]]]],
  [0xb0d1865b, [["ChannelParticipantsBots", 0xbf4e2753], []]],
  [0x1427a5e1, [["ChannelParticipantsBanned", 0xbf4e2753], [["q", "string"]]]],
  [0x0656ac4b, [["ChannelParticipantsSearch", 0xbf4e2753], [["q", "string"]]]],
  [
    0xbb6ae88d,
    [["ChannelParticipantsContacts", 0xbf4e2753], [["q", "string"]]]
  ],
  [
    0xf56ee2a8,
    [
      ["channels_ChannelParticipants", 0xe60a6e64],
      [
        ["count", "int"],
        ["participants", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [0xf0173fe9, [["channels_ChannelParticipantsNotModified", 0xe60a6e64], []]],
  [
    0xd0d9b163,
    [
      ["channels_ChannelParticipant", 0x6658151a],
      [
        ["participant", "_"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x780a0310,
    [
      ["help_TermsOfService", 0x20ee8312],
      [
        ["flags", "#FLAG"],
        ["popup", "Flag0<true>"],
        ["id", "_"],
        ["text", "string"],
        ["entities", "Vector<_>"],
        ["minAgeConfirm", "Flag1<int>"]
      ]
    ]
  ],
  [
    0x162ecc1f,
    [
      ["FoundGif", 0x5bbc92c3],
      [
        ["url", "string"],
        ["thumbUrl", "string"],
        ["contentUrl", "string"],
        ["contentType", "string"],
        ["w", "int"],
        ["h", "int"]
      ]
    ]
  ],
  [
    0x9c750409,
    [
      ["FoundGifCached", 0x5bbc92c3],
      [
        ["url", "string"],
        ["photo", "_"],
        ["document", "_"]
      ]
    ]
  ],
  [
    0x450a1c0a,
    [
      ["messages_FoundGifs", 0xe799ea7],
      [
        ["nextOffset", "int"],
        ["results", "Vector<_>"]
      ]
    ]
  ],
  [0xe8025ca2, [["messages_SavedGifsNotModified", 0xa68b61f5], []]],
  [
    0x2e0709a5,
    [
      ["messages_SavedGifs", 0xa68b61f5],
      [
        ["hash", "int"],
        ["gifs", "Vector<_>"]
      ]
    ]
  ],
  [
    0x3380c786,
    [
      ["InputBotInlineMessageMediaAuto", 0x53fb4010],
      [
        ["flags", "#FLAG"],
        ["message", "string"],
        ["entities", "Flag1<Vector<_>>"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0x3dcd7a87,
    [
      ["InputBotInlineMessageText", 0x53fb4010],
      [
        ["flags", "#FLAG"],
        ["noWebpage", "Flag0<true>"],
        ["message", "string"],
        ["entities", "Flag1<Vector<_>>"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0xc1b15d65,
    [
      ["InputBotInlineMessageMediaGeo", 0x53fb4010],
      [
        ["flags", "#FLAG"],
        ["geoPoint", "_"],
        ["period", "int"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0x417bbf11,
    [
      ["InputBotInlineMessageMediaVenue", 0x53fb4010],
      [
        ["flags", "#FLAG"],
        ["geoPoint", "_"],
        ["title", "string"],
        ["address", "string"],
        ["provider", "string"],
        ["venueId", "string"],
        ["venueType", "string"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0xa6edbffd,
    [
      ["InputBotInlineMessageMediaContact", 0x53fb4010],
      [
        ["flags", "#FLAG"],
        ["phoneNumber", "string"],
        ["firstName", "string"],
        ["lastName", "string"],
        ["vcard", "string"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0x4b425864,
    [
      ["InputBotInlineMessageGame", 0x53fb4010],
      [
        ["flags", "#FLAG"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0x88bf9319,
    [
      ["InputBotInlineResult", 0x80a4a3de],
      [
        ["flags", "#FLAG"],
        ["id", "string"],
        ["type", "string"],
        ["title", "Flag1<string>"],
        ["description", "Flag2<string>"],
        ["url", "Flag3<string>"],
        ["thumb", "Flag4<_>"],
        ["content", "Flag5<_>"],
        ["sendMessage", "_"]
      ]
    ]
  ],
  [
    0xa8d864a7,
    [
      ["InputBotInlineResultPhoto", 0x80a4a3de],
      [
        ["id", "string"],
        ["type", "string"],
        ["photo", "_"],
        ["sendMessage", "_"]
      ]
    ]
  ],
  [
    0xfff8fdc4,
    [
      ["InputBotInlineResultDocument", 0x80a4a3de],
      [
        ["flags", "#FLAG"],
        ["id", "string"],
        ["type", "string"],
        ["title", "Flag1<string>"],
        ["description", "Flag2<string>"],
        ["document", "_"],
        ["sendMessage", "_"]
      ]
    ]
  ],
  [
    0x4fa417f2,
    [
      ["InputBotInlineResultGame", 0x80a4a3de],
      [
        ["id", "string"],
        ["shortName", "string"],
        ["sendMessage", "_"]
      ]
    ]
  ],
  [
    0x764cf810,
    [
      ["BotInlineMessageMediaAuto", 0xc4910f88],
      [
        ["flags", "#FLAG"],
        ["message", "string"],
        ["entities", "Flag1<Vector<_>>"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0x8c7f65e2,
    [
      ["BotInlineMessageText", 0xc4910f88],
      [
        ["flags", "#FLAG"],
        ["noWebpage", "Flag0<true>"],
        ["message", "string"],
        ["entities", "Flag1<Vector<_>>"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0xb722de65,
    [
      ["BotInlineMessageMediaGeo", 0xc4910f88],
      [
        ["flags", "#FLAG"],
        ["geo", "_"],
        ["period", "int"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0x8a86659c,
    [
      ["BotInlineMessageMediaVenue", 0xc4910f88],
      [
        ["flags", "#FLAG"],
        ["geo", "_"],
        ["title", "string"],
        ["address", "string"],
        ["provider", "string"],
        ["venueId", "string"],
        ["venueType", "string"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0x18d1cdc2,
    [
      ["BotInlineMessageMediaContact", 0xc4910f88],
      [
        ["flags", "#FLAG"],
        ["phoneNumber", "string"],
        ["firstName", "string"],
        ["lastName", "string"],
        ["vcard", "string"],
        ["replyMarkup", "Flag2<_>"]
      ]
    ]
  ],
  [
    0x11965f3a,
    [
      ["BotInlineResult", 0x3832b3d5],
      [
        ["flags", "#FLAG"],
        ["id", "string"],
        ["type", "string"],
        ["title", "Flag1<string>"],
        ["description", "Flag2<string>"],
        ["url", "Flag3<string>"],
        ["thumb", "Flag4<_>"],
        ["content", "Flag5<_>"],
        ["sendMessage", "_"]
      ]
    ]
  ],
  [
    0x17db940b,
    [
      ["BotInlineMediaResult", 0x3832b3d5],
      [
        ["flags", "#FLAG"],
        ["id", "string"],
        ["type", "string"],
        ["photo", "Flag0<_>"],
        ["document", "Flag1<_>"],
        ["title", "Flag2<string>"],
        ["description", "Flag3<string>"],
        ["sendMessage", "_"]
      ]
    ]
  ],
  [
    0x947ca848,
    [
      ["messages_BotResults", 0x3ed4d9c9],
      [
        ["flags", "#FLAG"],
        ["gallery", "Flag0<true>"],
        ["queryId", "long"],
        ["nextOffset", "Flag1<string>"],
        ["switchPm", "Flag2<_>"],
        ["results", "Vector<_>"],
        ["cacheTime", "int"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x5dab1af4,
    [
      ["ExportedMessageLink", 0xdee644cc],
      [
        ["link", "string"],
        ["html", "string"]
      ]
    ]
  ],
  [
    0x353a686b,
    [
      ["MessageFwdHeader", 0x7a286804],
      [
        ["flags", "#FLAG"],
        ["fromId", "Flag0<int>"],
        ["fromName", "Flag5<string>"],
        ["date", "int"],
        ["channelId", "Flag1<int>"],
        ["channelPost", "Flag2<int>"],
        ["postAuthor", "Flag3<string>"],
        ["savedFromPeer", "Flag4<_>"],
        ["savedFromMsgId", "Flag4<int>"],
        ["psaType", "Flag6<string>"]
      ]
    ]
  ],
  [0x72a3158c, [["auth_CodeTypeSms", 0xb3f3e401], []]],
  [0x741cd3e3, [["auth_CodeTypeCall", 0xb3f3e401], []]],
  [0x226ccefb, [["auth_CodeTypeFlashCall", 0xb3f3e401], []]],
  [0x3dbb5986, [["auth_SentCodeTypeApp", 0xff5b158e], [["length", "int"]]]],
  [0xc000bba2, [["auth_SentCodeTypeSms", 0xff5b158e], [["length", "int"]]]],
  [0x5353e5a7, [["auth_SentCodeTypeCall", 0xff5b158e], [["length", "int"]]]],
  [
    0xab03c6d9,
    [["auth_SentCodeTypeFlashCall", 0xff5b158e], [["pattern", "string"]]]
  ],
  [
    0x36585ea4,
    [
      ["messages_BotCallbackAnswer", 0x6c4dd18c],
      [
        ["flags", "#FLAG"],
        ["alert", "Flag1<true>"],
        ["hasUrl", "Flag3<true>"],
        ["nativeUi", "Flag4<true>"],
        ["message", "Flag0<string>"],
        ["url", "Flag2<string>"],
        ["cacheTime", "int"]
      ]
    ]
  ],
  [
    0x26b5dde6,
    [
      ["messages_MessageEditData", 0xfb47949d],
      [
        ["flags", "#FLAG"],
        ["caption", "Flag0<true>"]
      ]
    ]
  ],
  [
    0x890c3d89,
    [
      ["InputBotInlineMessageID", 0x2dcd6300],
      [
        ["dcId", "int"],
        ["id", "long"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0x3c20629f,
    [
      ["InlineBotSwitchPM", 0x82b1f73b],
      [
        ["text", "string"],
        ["startParam", "string"]
      ]
    ]
  ],
  [
    0x3371c354,
    [
      ["messages_PeerDialogs", 0x3ac70132],
      [
        ["dialogs", "Vector<_>"],
        ["messages", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"],
        ["state", "_"]
      ]
    ]
  ],
  [
    0xedcdc05b,
    [
      ["TopPeer", 0x6916c601],
      [
        ["peer", "_"],
        ["rating", "double"]
      ]
    ]
  ],
  [0xab661b5b, [["TopPeerCategoryBotsPM", 0xddf02502], []]],
  [0x148677e2, [["TopPeerCategoryBotsInline", 0xddf02502], []]],
  [0x0637b7ed, [["TopPeerCategoryCorrespondents", 0xddf02502], []]],
  [0xbd17a14a, [["TopPeerCategoryGroups", 0xddf02502], []]],
  [0x161d9628, [["TopPeerCategoryChannels", 0xddf02502], []]],
  [0x1e76a78c, [["TopPeerCategoryPhoneCalls", 0xddf02502], []]],
  [0xa8406ca9, [["TopPeerCategoryForwardUsers", 0xddf02502], []]],
  [0xfbeec0f0, [["TopPeerCategoryForwardChats", 0xddf02502], []]],
  [
    0xfb834291,
    [
      ["TopPeerCategoryPeers", 0x4aec930],
      [
        ["category", "_"],
        ["count", "int"],
        ["peers", "Vector<_>"]
      ]
    ]
  ],
  [0xde266ef5, [["contacts_TopPeersNotModified", 0x9ee8bb88], []]],
  [
    0x70b772a8,
    [
      ["contacts_TopPeers", 0x9ee8bb88],
      [
        ["categories", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [0xb52c939d, [["contacts_TopPeersDisabled", 0x9ee8bb88], []]],
  [
    0x1b0c841a,
    [
      ["DraftMessageEmpty", 0x33d47f45],
      [
        ["flags", "#FLAG"],
        ["date", "Flag0<int>"]
      ]
    ]
  ],
  [
    0xfd8e711f,
    [
      ["DraftMessage", 0x33d47f45],
      [
        ["flags", "#FLAG"],
        ["noWebpage", "Flag1<true>"],
        ["replyToMsgId", "Flag0<int>"],
        ["message", "string"],
        ["entities", "Flag3<Vector<_>>"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0xc6dc0c66,
    [["messages_FeaturedStickersNotModified", 0x2614b722], [["count", "int"]]]
  ],
  [
    0xb6abc341,
    [
      ["messages_FeaturedStickers", 0x2614b722],
      [
        ["hash", "int"],
        ["count", "int"],
        ["sets", "Vector<_>"],
        ["unread", "Vector<long>"]
      ]
    ]
  ],
  [0x0b17f890, [["messages_RecentStickersNotModified", 0xf76f8683], []]],
  [
    0x22f3afb3,
    [
      ["messages_RecentStickers", 0xf76f8683],
      [
        ["hash", "int"],
        ["packs", "Vector<_>"],
        ["stickers", "Vector<_>"],
        ["dates", "Vector<int>"]
      ]
    ]
  ],
  [
    0x4fcba9c8,
    [
      ["messages_ArchivedStickers", 0x7296d771],
      [
        ["count", "int"],
        ["sets", "Vector<_>"]
      ]
    ]
  ],
  [0x38641628, [["messages_StickerSetInstallResultSuccess", 0x67cb3fe8], []]],
  [
    0x35e410a8,
    [
      ["messages_StickerSetInstallResultArchive", 0x67cb3fe8],
      [["sets", "Vector<_>"]]
    ]
  ],
  [
    0x6410a5d2,
    [
      ["StickerSetCovered", 0x7f86e4e5],
      [
        ["set", "_"],
        ["cover", "_"]
      ]
    ]
  ],
  [
    0x3407e51b,
    [
      ["StickerSetMultiCovered", 0x7f86e4e5],
      [
        ["set", "_"],
        ["covers", "Vector<_>"]
      ]
    ]
  ],
  [
    0xaed6dbb2,
    [
      ["MaskCoords", 0x6bbb2fd],
      [
        ["n", "int"],
        ["x", "double"],
        ["y", "double"],
        ["zoom", "double"]
      ]
    ]
  ],
  [0x4a992157, [["InputStickeredMediaPhoto", 0x5146d99e], [["id", "_"]]]],
  [0x0438865b, [["InputStickeredMediaDocument", 0x5146d99e], [["id", "_"]]]],
  [
    0xbdf9653b,
    [
      ["Game", 0x83199eb2],
      [
        ["flags", "#FLAG"],
        ["id", "long"],
        ["accessHash", "long"],
        ["shortName", "string"],
        ["title", "string"],
        ["description", "string"],
        ["photo", "_"],
        ["document", "Flag0<_>"]
      ]
    ]
  ],
  [
    0x032c3e77,
    [
      ["InputGameID", 0x48d15883],
      [
        ["id", "long"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0xc331e80a,
    [
      ["InputGameShortName", 0x48d15883],
      [
        ["botId", "_"],
        ["shortName", "string"]
      ]
    ]
  ],
  [
    0x58fffcd0,
    [
      ["HighScore", 0xd32b1e35],
      [
        ["pos", "int"],
        ["userId", "int"],
        ["score", "int"]
      ]
    ]
  ],
  [
    0x9a3bfd99,
    [
      ["messages_HighScores", 0x6ccd95fd],
      [
        ["scores", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [0xdc3d824f, [["TextEmpty", 0xf1d0b479], []]],
  [0x744694e0, [["TextPlain", 0xf1d0b479], [["text", "string"]]]],
  [0x6724abc4, [["TextBold", 0xf1d0b479], [["text", "_"]]]],
  [0xd912a59c, [["TextItalic", 0xf1d0b479], [["text", "_"]]]],
  [0xc12622c4, [["TextUnderline", 0xf1d0b479], [["text", "_"]]]],
  [0x9bf8bb95, [["TextStrike", 0xf1d0b479], [["text", "_"]]]],
  [0x6c3f19b9, [["TextFixed", 0xf1d0b479], [["text", "_"]]]],
  [
    0x3c2884c1,
    [
      ["TextUrl", 0xf1d0b479],
      [
        ["text", "_"],
        ["url", "string"],
        ["webpageId", "long"]
      ]
    ]
  ],
  [
    0xde5a0dd6,
    [
      ["TextEmail", 0xf1d0b479],
      [
        ["text", "_"],
        ["email", "string"]
      ]
    ]
  ],
  [0x7e6260d7, [["TextConcat", 0xf1d0b479], [["texts", "Vector<_>"]]]],
  [0xed6a8504, [["TextSubscript", 0xf1d0b479], [["text", "_"]]]],
  [0xc7fb5e01, [["TextSuperscript", 0xf1d0b479], [["text", "_"]]]],
  [0x034b8621, [["TextMarked", 0xf1d0b479], [["text", "_"]]]],
  [
    0x1ccb966a,
    [
      ["TextPhone", 0xf1d0b479],
      [
        ["text", "_"],
        ["phone", "string"]
      ]
    ]
  ],
  [
    0x081ccf4f,
    [
      ["TextImage", 0xf1d0b479],
      [
        ["documentId", "long"],
        ["w", "int"],
        ["h", "int"]
      ]
    ]
  ],
  [
    0x35553762,
    [
      ["TextAnchor", 0xf1d0b479],
      [
        ["text", "_"],
        ["name", "string"]
      ]
    ]
  ],
  [0x13567e8a, [["PageBlockUnsupported", 0x1aca5644], []]],
  [0x70abc3fd, [["PageBlockTitle", 0x1aca5644], [["text", "_"]]]],
  [0x8ffa9a1f, [["PageBlockSubtitle", 0x1aca5644], [["text", "_"]]]],
  [
    0xbaafe5e0,
    [
      ["PageBlockAuthorDate", 0x1aca5644],
      [
        ["author", "_"],
        ["publishedDate", "int"]
      ]
    ]
  ],
  [0xbfd064ec, [["PageBlockHeader", 0x1aca5644], [["text", "_"]]]],
  [0xf12bb6e1, [["PageBlockSubheader", 0x1aca5644], [["text", "_"]]]],
  [0x467a0766, [["PageBlockParagraph", 0x1aca5644], [["text", "_"]]]],
  [
    0xc070d93e,
    [
      ["PageBlockPreformatted", 0x1aca5644],
      [
        ["text", "_"],
        ["language", "string"]
      ]
    ]
  ],
  [0x48870999, [["PageBlockFooter", 0x1aca5644], [["text", "_"]]]],
  [0xdb20b188, [["PageBlockDivider", 0x1aca5644], []]],
  [0xce0d37b0, [["PageBlockAnchor", 0x1aca5644], [["name", "string"]]]],
  [0xe4e88011, [["PageBlockList", 0x1aca5644], [["items", "Vector<_>"]]]],
  [
    0x263d7c26,
    [
      ["PageBlockBlockquote", 0x1aca5644],
      [
        ["text", "_"],
        ["caption", "_"]
      ]
    ]
  ],
  [
    0x4f4456d3,
    [
      ["PageBlockPullquote", 0x1aca5644],
      [
        ["text", "_"],
        ["caption", "_"]
      ]
    ]
  ],
  [
    0x1759c560,
    [
      ["PageBlockPhoto", 0x1aca5644],
      [
        ["flags", "#FLAG"],
        ["photoId", "long"],
        ["caption", "_"],
        ["url", "Flag0<string>"],
        ["webpageId", "Flag0<long>"]
      ]
    ]
  ],
  [
    0x7c8fe7b6,
    [
      ["PageBlockVideo", 0x1aca5644],
      [
        ["flags", "#FLAG"],
        ["autoplay", "Flag0<true>"],
        ["loop", "Flag1<true>"],
        ["videoId", "long"],
        ["caption", "_"]
      ]
    ]
  ],
  [0x39f23300, [["PageBlockCover", 0x1aca5644], [["cover", "_"]]]],
  [
    0xa8718dc5,
    [
      ["PageBlockEmbed", 0x1aca5644],
      [
        ["flags", "#FLAG"],
        ["fullWidth", "Flag0<true>"],
        ["allowScrolling", "Flag3<true>"],
        ["url", "Flag1<string>"],
        ["html", "Flag2<string>"],
        ["posterPhotoId", "Flag4<long>"],
        ["w", "Flag5<int>"],
        ["h", "Flag5<int>"],
        ["caption", "_"]
      ]
    ]
  ],
  [
    0xf259a80b,
    [
      ["PageBlockEmbedPost", 0x1aca5644],
      [
        ["url", "string"],
        ["webpageId", "long"],
        ["authorPhotoId", "long"],
        ["author", "string"],
        ["date", "int"],
        ["blocks", "Vector<_>"],
        ["caption", "_"]
      ]
    ]
  ],
  [
    0x65a0fa4d,
    [
      ["PageBlockCollage", 0x1aca5644],
      [
        ["items", "Vector<_>"],
        ["caption", "_"]
      ]
    ]
  ],
  [
    0x031f9590,
    [
      ["PageBlockSlideshow", 0x1aca5644],
      [
        ["items", "Vector<_>"],
        ["caption", "_"]
      ]
    ]
  ],
  [0xef1751b5, [["PageBlockChannel", 0x1aca5644], [["channel", "_"]]]],
  [
    0x804361ea,
    [
      ["PageBlockAudio", 0x1aca5644],
      [
        ["audioId", "long"],
        ["caption", "_"]
      ]
    ]
  ],
  [0x1e148390, [["PageBlockKicker", 0x1aca5644], [["text", "_"]]]],
  [
    0xbf4dea82,
    [
      ["PageBlockTable", 0x1aca5644],
      [
        ["flags", "#FLAG"],
        ["bordered", "Flag0<true>"],
        ["striped", "Flag1<true>"],
        ["title", "_"],
        ["rows", "Vector<_>"]
      ]
    ]
  ],
  [
    0x9a8ae1e1,
    [["PageBlockOrderedList", 0x1aca5644], [["items", "Vector<_>"]]]
  ],
  [
    0x76768bed,
    [
      ["PageBlockDetails", 0x1aca5644],
      [
        ["flags", "#FLAG"],
        ["open", "Flag0<true>"],
        ["blocks", "Vector<_>"],
        ["title", "_"]
      ]
    ]
  ],
  [
    0x16115a96,
    [
      ["PageBlockRelatedArticles", 0x1aca5644],
      [
        ["title", "_"],
        ["articles", "Vector<_>"]
      ]
    ]
  ],
  [
    0xa44f3ef6,
    [
      ["PageBlockMap", 0x1aca5644],
      [
        ["geo", "_"],
        ["zoom", "int"],
        ["w", "int"],
        ["h", "int"],
        ["caption", "_"]
      ]
    ]
  ],
  [0x85e42301, [["PhoneCallDiscardReasonMissed", 0xd89bad3d], []]],
  [0xe095c1a0, [["PhoneCallDiscardReasonDisconnect", 0xd89bad3d], []]],
  [0x57adc690, [["PhoneCallDiscardReasonHangup", 0xd89bad3d], []]],
  [0xfaf7e8c9, [["PhoneCallDiscardReasonBusy", 0xd89bad3d], []]],
  [0x7d748d04, [["DataJSON", 0xad0352e8], [["data", "string"]]]],
  [
    0xcb296bf8,
    [
      ["LabeledPrice", 0x1c84047a],
      [
        ["label", "string"],
        ["amount", "long"]
      ]
    ]
  ],
  [
    0xc30aa358,
    [
      ["Invoice", 0x5fd82ed8],
      [
        ["flags", "#FLAG"],
        ["test", "Flag0<true>"],
        ["nameRequested", "Flag1<true>"],
        ["phoneRequested", "Flag2<true>"],
        ["emailRequested", "Flag3<true>"],
        ["shippingAddressRequested", "Flag4<true>"],
        ["flexible", "Flag5<true>"],
        ["phoneToProvider", "Flag6<true>"],
        ["emailToProvider", "Flag7<true>"],
        ["currency", "string"],
        ["prices", "Vector<_>"]
      ]
    ]
  ],
  [
    0xea02c27e,
    [
      ["PaymentCharge", 0x3cc830d9],
      [
        ["id", "string"],
        ["providerChargeId", "string"]
      ]
    ]
  ],
  [
    0x1e8caaeb,
    [
      ["PostAddress", 0x8d7eda2c],
      [
        ["streetLine1", "string"],
        ["streetLine2", "string"],
        ["city", "string"],
        ["state", "string"],
        ["countryIso2", "string"],
        ["postCode", "string"]
      ]
    ]
  ],
  [
    0x909c3f94,
    [
      ["PaymentRequestedInfo", 0x8db03146],
      [
        ["flags", "#FLAG"],
        ["name", "Flag0<string>"],
        ["phone", "Flag1<string>"],
        ["email", "Flag2<string>"],
        ["shippingAddress", "Flag3<_>"]
      ]
    ]
  ],
  [
    0xcdc27a1f,
    [
      ["PaymentSavedCredentialsCard", 0xb3627ee3],
      [
        ["id", "string"],
        ["title", "string"]
      ]
    ]
  ],
  [
    0x1c570ed1,
    [
      ["WebDocument", 0x3b642814],
      [
        ["url", "string"],
        ["accessHash", "long"],
        ["size", "int"],
        ["mimeType", "string"],
        ["attributes", "Vector<_>"]
      ]
    ]
  ],
  [
    0xf9c8bcc6,
    [
      ["WebDocumentNoProxy", 0x3b642814],
      [
        ["url", "string"],
        ["size", "int"],
        ["mimeType", "string"],
        ["attributes", "Vector<_>"]
      ]
    ]
  ],
  [
    0x9bed434d,
    [
      ["InputWebDocument", 0x8ae8b146],
      [
        ["url", "string"],
        ["size", "int"],
        ["mimeType", "string"],
        ["attributes", "Vector<_>"]
      ]
    ]
  ],
  [
    0xc239d686,
    [
      ["InputWebFileLocation", 0xf72ed8d9],
      [
        ["url", "string"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [
    0x9f2221c9,
    [
      ["InputWebFileGeoPointLocation", 0xf72ed8d9],
      [
        ["geoPoint", "_"],
        ["accessHash", "long"],
        ["w", "int"],
        ["h", "int"],
        ["zoom", "int"],
        ["scale", "int"]
      ]
    ]
  ],
  [
    0x21e753bc,
    [
      ["upload_WebFile", 0x68f17f51],
      [
        ["size", "int"],
        ["mimeType", "string"],
        ["fileType", "_"],
        ["mtime", "int"],
        ["bytes", "bytes"]
      ]
    ]
  ],
  [
    0x3f56aea3,
    [
      ["payments_PaymentForm", 0xa0483f19],
      [
        ["flags", "#FLAG"],
        ["canSaveCredentials", "Flag2<true>"],
        ["passwordMissing", "Flag3<true>"],
        ["botId", "int"],
        ["invoice", "_"],
        ["providerId", "int"],
        ["url", "string"],
        ["nativeProvider", "Flag4<string>"],
        ["nativeParams", "Flag4<_>"],
        ["savedInfo", "Flag0<_>"],
        ["savedCredentials", "Flag1<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0xd1451883,
    [
      ["payments_ValidatedRequestedInfo", 0x8f8044b7],
      [
        ["flags", "#FLAG"],
        ["id", "Flag0<string>"],
        ["shippingOptions", "Flag1<Vector<_>>"]
      ]
    ]
  ],
  [0x4e5f810d, [["payments_PaymentResult", 0x8ae16a9d], [["updates", "_"]]]],
  [
    0xd8411139,
    [["payments_PaymentVerificationNeeded", 0x8ae16a9d], [["url", "string"]]]
  ],
  [
    0x500911e1,
    [
      ["payments_PaymentReceipt", 0x590093c9],
      [
        ["flags", "#FLAG"],
        ["date", "int"],
        ["botId", "int"],
        ["invoice", "_"],
        ["providerId", "int"],
        ["info", "Flag0<_>"],
        ["shipping", "Flag1<_>"],
        ["currency", "string"],
        ["totalAmount", "long"],
        ["credentialsTitle", "string"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0xfb8fe43c,
    [
      ["payments_SavedInfo", 0xad3cf146],
      [
        ["flags", "#FLAG"],
        ["hasSavedCredentials", "Flag1<true>"],
        ["savedInfo", "Flag0<_>"]
      ]
    ]
  ],
  [
    0xc10eb2cf,
    [
      ["InputPaymentCredentialsSaved", 0x2899a53d],
      [
        ["id", "string"],
        ["tmpPassword", "bytes"]
      ]
    ]
  ],
  [
    0x3417d728,
    [
      ["InputPaymentCredentials", 0x2899a53d],
      [
        ["flags", "#FLAG"],
        ["save", "Flag0<true>"],
        ["data", "_"]
      ]
    ]
  ],
  [
    0x0aa1c39f,
    [["InputPaymentCredentialsApplePay", 0x2899a53d], [["paymentData", "_"]]]
  ],
  [
    0xca05d50e,
    [
      ["InputPaymentCredentialsAndroidPay", 0x2899a53d],
      [
        ["paymentToken", "_"],
        ["googleTransactionId", "string"]
      ]
    ]
  ],
  [
    0xdb64fd34,
    [
      ["account_TmpPassword", 0xb064992d],
      [
        ["tmpPassword", "bytes"],
        ["validUntil", "int"]
      ]
    ]
  ],
  [
    0xb6213cdf,
    [
      ["ShippingOption", 0xf4e94c78],
      [
        ["id", "string"],
        ["title", "string"],
        ["prices", "Vector<_>"]
      ]
    ]
  ],
  [
    0xffa0a496,
    [
      ["InputStickerSetItem", 0xae59f075],
      [
        ["flags", "#FLAG"],
        ["document", "_"],
        ["emoji", "string"],
        ["maskCoords", "Flag0<_>"]
      ]
    ]
  ],
  [
    0x1e36fded,
    [
      ["InputPhoneCall", 0xbcaaf240],
      [
        ["id", "long"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [0x5366c915, [["PhoneCallEmpty", 0xc47f1bd1], [["id", "long"]]]],
  [
    0x1b8f4ad1,
    [
      ["PhoneCallWaiting", 0xc47f1bd1],
      [
        ["flags", "#FLAG"],
        ["video", "Flag5<true>"],
        ["id", "long"],
        ["accessHash", "long"],
        ["date", "int"],
        ["adminId", "int"],
        ["participantId", "int"],
        ["protocol", "_"],
        ["receiveDate", "Flag0<int>"]
      ]
    ]
  ],
  [
    0x87eabb53,
    [
      ["PhoneCallRequested", 0xc47f1bd1],
      [
        ["flags", "#FLAG"],
        ["video", "Flag5<true>"],
        ["id", "long"],
        ["accessHash", "long"],
        ["date", "int"],
        ["adminId", "int"],
        ["participantId", "int"],
        ["gAHash", "bytes"],
        ["protocol", "_"]
      ]
    ]
  ],
  [
    0x997c454a,
    [
      ["PhoneCallAccepted", 0xc47f1bd1],
      [
        ["flags", "#FLAG"],
        ["video", "Flag5<true>"],
        ["id", "long"],
        ["accessHash", "long"],
        ["date", "int"],
        ["adminId", "int"],
        ["participantId", "int"],
        ["gB", "bytes"],
        ["protocol", "_"]
      ]
    ]
  ],
  [
    0x8742ae7f,
    [
      ["PhoneCall", 0xc47f1bd1],
      [
        ["flags", "#FLAG"],
        ["p2pAllowed", "Flag5<true>"],
        ["id", "long"],
        ["accessHash", "long"],
        ["date", "int"],
        ["adminId", "int"],
        ["participantId", "int"],
        ["gAOrB", "bytes"],
        ["keyFingerprint", "long"],
        ["protocol", "_"],
        ["connections", "Vector<_>"],
        ["startDate", "int"]
      ]
    ]
  ],
  [
    0x50ca4de1,
    [
      ["PhoneCallDiscarded", 0xc47f1bd1],
      [
        ["flags", "#FLAG"],
        ["needRating", "Flag2<true>"],
        ["needDebug", "Flag3<true>"],
        ["video", "Flag5<true>"],
        ["id", "long"],
        ["reason", "Flag0<_>"],
        ["duration", "Flag1<int>"]
      ]
    ]
  ],
  [
    0x9d4c17c0,
    [
      ["PhoneConnection", 0xaa8de40d],
      [
        ["id", "long"],
        ["ip", "string"],
        ["ipv6", "string"],
        ["port", "int"],
        ["peerTag", "bytes"]
      ]
    ]
  ],
  [
    0xfc878fc8,
    [
      ["PhoneCallProtocol", 0x783991a3],
      [
        ["flags", "#FLAG"],
        ["udpP2p", "Flag0<true>"],
        ["udpReflector", "Flag1<true>"],
        ["minLayer", "int"],
        ["maxLayer", "int"],
        ["libraryVersions", "Vector<string>"]
      ]
    ]
  ],
  [
    0xec82e140,
    [
      ["phone_PhoneCall", 0xd48afe4f],
      [
        ["phoneCall", "_"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0xeea8e46e,
    [["upload_CdnFileReuploadNeeded", 0xf5ccf928], [["requestToken", "bytes"]]]
  ],
  [0xa99fca4f, [["upload_CdnFile", 0xf5ccf928], [["bytes", "bytes"]]]],
  [
    0xc982eaba,
    [
      ["CdnPublicKey", 0x16db47f3],
      [
        ["dcId", "int"],
        ["publicKey", "string"]
      ]
    ]
  ],
  [0x5725e40a, [["CdnConfig", 0xecda397c], [["publicKeys", "Vector<_>"]]]],
  [
    0xcad181f6,
    [
      ["LangPackString", 0xdc179ab9],
      [
        ["key", "string"],
        ["value", "string"]
      ]
    ]
  ],
  [
    0x6c47ac9f,
    [
      ["LangPackStringPluralized", 0xdc179ab9],
      [
        ["flags", "#FLAG"],
        ["key", "string"],
        ["zeroValue", "Flag0<string>"],
        ["oneValue", "Flag1<string>"],
        ["twoValue", "Flag2<string>"],
        ["fewValue", "Flag3<string>"],
        ["manyValue", "Flag4<string>"],
        ["otherValue", "string"]
      ]
    ]
  ],
  [0x2979eeb2, [["LangPackStringDeleted", 0xdc179ab9], [["key", "string"]]]],
  [
    0xf385c1f6,
    [
      ["LangPackDifference", 0x52662d55],
      [
        ["langCode", "string"],
        ["fromVersion", "int"],
        ["version", "int"],
        ["strings", "Vector<_>"]
      ]
    ]
  ],
  [
    0xeeca5ce3,
    [
      ["LangPackLanguage", 0xabac89b7],
      [
        ["flags", "#FLAG"],
        ["official", "Flag0<true>"],
        ["rtl", "Flag2<true>"],
        ["beta", "Flag3<true>"],
        ["name", "string"],
        ["nativeName", "string"],
        ["langCode", "string"],
        ["baseLangCode", "Flag1<string>"],
        ["pluralCode", "string"],
        ["stringsCount", "int"],
        ["translatedCount", "int"],
        ["translationsUrl", "string"]
      ]
    ]
  ],
  [
    0xe6dfb825,
    [
      ["ChannelAdminLogEventActionChangeTitle", 0xb2b987f3],
      [
        ["prevValue", "string"],
        ["newValue", "string"]
      ]
    ]
  ],
  [
    0x55188a2e,
    [
      ["ChannelAdminLogEventActionChangeAbout", 0xb2b987f3],
      [
        ["prevValue", "string"],
        ["newValue", "string"]
      ]
    ]
  ],
  [
    0x6a4afc38,
    [
      ["ChannelAdminLogEventActionChangeUsername", 0xb2b987f3],
      [
        ["prevValue", "string"],
        ["newValue", "string"]
      ]
    ]
  ],
  [
    0x434bd2af,
    [
      ["ChannelAdminLogEventActionChangePhoto", 0xb2b987f3],
      [
        ["prevPhoto", "_"],
        ["newPhoto", "_"]
      ]
    ]
  ],
  [
    0x1b7907ae,
    [
      ["ChannelAdminLogEventActionToggleInvites", 0xb2b987f3],
      [["newValue", "Bool"]]
    ]
  ],
  [
    0x26ae0971,
    [
      ["ChannelAdminLogEventActionToggleSignatures", 0xb2b987f3],
      [["newValue", "Bool"]]
    ]
  ],
  [
    0xe9e82c18,
    [["ChannelAdminLogEventActionUpdatePinned", 0xb2b987f3], [["message", "_"]]]
  ],
  [
    0x709b2405,
    [
      ["ChannelAdminLogEventActionEditMessage", 0xb2b987f3],
      [
        ["prevMessage", "_"],
        ["newMessage", "_"]
      ]
    ]
  ],
  [
    0x42e047bb,
    [
      ["ChannelAdminLogEventActionDeleteMessage", 0xb2b987f3],
      [["message", "_"]]
    ]
  ],
  [0x183040d3, [["ChannelAdminLogEventActionParticipantJoin", 0xb2b987f3], []]],
  [
    0xf89777f2,
    [["ChannelAdminLogEventActionParticipantLeave", 0xb2b987f3], []]
  ],
  [
    0xe31c34d8,
    [
      ["ChannelAdminLogEventActionParticipantInvite", 0xb2b987f3],
      [["participant", "_"]]
    ]
  ],
  [
    0xe6d83d7e,
    [
      ["ChannelAdminLogEventActionParticipantToggleBan", 0xb2b987f3],
      [
        ["prevParticipant", "_"],
        ["newParticipant", "_"]
      ]
    ]
  ],
  [
    0xd5676710,
    [
      ["ChannelAdminLogEventActionParticipantToggleAdmin", 0xb2b987f3],
      [
        ["prevParticipant", "_"],
        ["newParticipant", "_"]
      ]
    ]
  ],
  [
    0xb1c3caa7,
    [
      ["ChannelAdminLogEventActionChangeStickerSet", 0xb2b987f3],
      [
        ["prevStickerset", "_"],
        ["newStickerset", "_"]
      ]
    ]
  ],
  [
    0x5f5c95f1,
    [
      ["ChannelAdminLogEventActionTogglePreHistoryHidden", 0xb2b987f3],
      [["newValue", "Bool"]]
    ]
  ],
  [
    0x2df5fc0a,
    [
      ["ChannelAdminLogEventActionDefaultBannedRights", 0xb2b987f3],
      [
        ["prevBannedRights", "_"],
        ["newBannedRights", "_"]
      ]
    ]
  ],
  [
    0x8f079643,
    [["ChannelAdminLogEventActionStopPoll", 0xb2b987f3], [["message", "_"]]]
  ],
  [
    0xa26f881b,
    [
      ["ChannelAdminLogEventActionChangeLinkedChat", 0xb2b987f3],
      [
        ["prevValue", "int"],
        ["newValue", "int"]
      ]
    ]
  ],
  [
    0x0e6b76ae,
    [
      ["ChannelAdminLogEventActionChangeLocation", 0xb2b987f3],
      [
        ["prevValue", "_"],
        ["newValue", "_"]
      ]
    ]
  ],
  [
    0x53909779,
    [
      ["ChannelAdminLogEventActionToggleSlowMode", 0xb2b987f3],
      [
        ["prevValue", "int"],
        ["newValue", "int"]
      ]
    ]
  ],
  [
    0x3b5a3e40,
    [
      ["ChannelAdminLogEvent", 0x408f0999],
      [
        ["id", "long"],
        ["date", "int"],
        ["userId", "int"],
        ["action", "_"]
      ]
    ]
  ],
  [
    0xed8af74d,
    [
      ["channels_AdminLogResults", 0x51f076bc],
      [
        ["events", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0xea107ae4,
    [
      ["ChannelAdminLogEventsFilter", 0x7cbbf319],
      [
        ["flags", "#FLAG"],
        ["join", "Flag0<true>"],
        ["leave", "Flag1<true>"],
        ["invite", "Flag2<true>"],
        ["ban", "Flag3<true>"],
        ["unban", "Flag4<true>"],
        ["kick", "Flag5<true>"],
        ["unkick", "Flag6<true>"],
        ["promote", "Flag7<true>"],
        ["demote", "Flag8<true>"],
        ["info", "Flag9<true>"],
        ["settings", "Flag10<true>"],
        ["pinned", "Flag11<true>"],
        ["edit", "Flag12<true>"],
        ["delete", "Flag13<true>"]
      ]
    ]
  ],
  [
    0x5ce14175,
    [
      ["PopularContact", 0x409255a],
      [
        ["clientId", "long"],
        ["importers", "int"]
      ]
    ]
  ],
  [0x9e8fa6d3, [["messages_FavedStickersNotModified", 0x8e736fb9], []]],
  [
    0xf37f2f16,
    [
      ["messages_FavedStickers", 0x8e736fb9],
      [
        ["hash", "int"],
        ["packs", "Vector<_>"],
        ["stickers", "Vector<_>"]
      ]
    ]
  ],
  [0x46e1d13d, [["RecentMeUrlUnknown", 0x55a53079], [["url", "string"]]]],
  [
    0x8dbc3336,
    [
      ["RecentMeUrlUser", 0x55a53079],
      [
        ["url", "string"],
        ["userId", "int"]
      ]
    ]
  ],
  [
    0xa01b22f9,
    [
      ["RecentMeUrlChat", 0x55a53079],
      [
        ["url", "string"],
        ["chatId", "int"]
      ]
    ]
  ],
  [
    0xeb49081d,
    [
      ["RecentMeUrlChatInvite", 0x55a53079],
      [
        ["url", "string"],
        ["chatInvite", "_"]
      ]
    ]
  ],
  [
    0xbc0a57dc,
    [
      ["RecentMeUrlStickerSet", 0x55a53079],
      [
        ["url", "string"],
        ["set", "_"]
      ]
    ]
  ],
  [
    0x0e0310d7,
    [
      ["help_RecentMeUrls", 0xf269c477],
      [
        ["urls", "Vector<_>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0x1cc6e91f,
    [
      ["InputSingleMedia", 0x21ca8ed8],
      [
        ["flags", "#FLAG"],
        ["media", "_"],
        ["randomId", "long"],
        ["message", "string"],
        ["entities", "Flag0<Vector<_>>"]
      ]
    ]
  ],
  [
    0xcac943f2,
    [
      ["WebAuthorization", 0x3764d30],
      [
        ["hash", "long"],
        ["botId", "int"],
        ["domain", "string"],
        ["browser", "string"],
        ["platform", "string"],
        ["dateCreated", "int"],
        ["dateActive", "int"],
        ["ip", "string"],
        ["region", "string"]
      ]
    ]
  ],
  [
    0xed56c9fc,
    [
      ["account_WebAuthorizations", 0x9a365b32],
      [
        ["authorizations", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [0xa676a322, [["InputMessageID", 0x54b6bcc5], [["id", "int"]]]],
  [0xbad88395, [["InputMessageReplyTo", 0x54b6bcc5], [["id", "int"]]]],
  [0x86872538, [["InputMessagePinned", 0x54b6bcc5], []]],
  [0xfcaafeb7, [["InputDialogPeer", 0xa21c9795], [["peer", "_"]]]],
  [0x64600527, [["InputDialogPeerFolder", 0xa21c9795], [["folderId", "int"]]]],
  [0xe56dbf05, [["DialogPeer", 0x256ce1ae], [["peer", "_"]]]],
  [0x514519e2, [["DialogPeerFolder", 0x256ce1ae], [["folderId", "int"]]]],
  [0x0d54b65d, [["messages_FoundStickerSetsNotModified", 0x40df361], []]],
  [
    0x5108d648,
    [
      ["messages_FoundStickerSets", 0x40df361],
      [
        ["hash", "int"],
        ["sets", "Vector<_>"]
      ]
    ]
  ],
  [
    0x6242c773,
    [
      ["FileHash", 0xead438b3],
      [
        ["offset", "int"],
        ["limit", "int"],
        ["hash", "bytes"]
      ]
    ]
  ],
  [
    0x75588b3f,
    [
      ["InputClientProxy", 0x91a4346],
      [
        ["address", "string"],
        ["port", "int"]
      ]
    ]
  ],
  [
    0xe3309f7f,
    [["help_TermsOfServiceUpdateEmpty", 0x293c2977], [["expires", "int"]]]
  ],
  [
    0x28ecf961,
    [
      ["help_TermsOfServiceUpdate", 0x293c2977],
      [
        ["expires", "int"],
        ["termsOfService", "_"]
      ]
    ]
  ],
  [
    0x3334b0f0,
    [
      ["InputSecureFileUploaded", 0xdac8adfc],
      [
        ["id", "long"],
        ["parts", "int"],
        ["md5Checksum", "string"],
        ["fileHash", "bytes"],
        ["secret", "bytes"]
      ]
    ]
  ],
  [
    0x5367e5be,
    [
      ["InputSecureFile", 0xdac8adfc],
      [
        ["id", "long"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [0x64199744, [["SecureFileEmpty", 0x5db8dbc7], []]],
  [
    0xe0277a62,
    [
      ["SecureFile", 0x5db8dbc7],
      [
        ["id", "long"],
        ["accessHash", "long"],
        ["size", "int"],
        ["dcId", "int"],
        ["date", "int"],
        ["fileHash", "bytes"],
        ["secret", "bytes"]
      ]
    ]
  ],
  [
    0x8aeabec3,
    [
      ["SecureData", 0x7cd41eb4],
      [
        ["data", "bytes"],
        ["dataHash", "bytes"],
        ["secret", "bytes"]
      ]
    ]
  ],
  [0x7d6099dd, [["SecurePlainPhone", 0x23b2afb6], [["phone", "string"]]]],
  [0x21ec5a5f, [["SecurePlainEmail", 0x23b2afb6], [["email", "string"]]]],
  [0x9d2a81e3, [["SecureValueTypePersonalDetails", 0x8893f596], []]],
  [0x3dac6a00, [["SecureValueTypePassport", 0x8893f596], []]],
  [0x06e425c4, [["SecureValueTypeDriverLicense", 0x8893f596], []]],
  [0xa0d0744b, [["SecureValueTypeIdentityCard", 0x8893f596], []]],
  [0x99a48f23, [["SecureValueTypeInternalPassport", 0x8893f596], []]],
  [0xcbe31e26, [["SecureValueTypeAddress", 0x8893f596], []]],
  [0xfc36954e, [["SecureValueTypeUtilityBill", 0x8893f596], []]],
  [0x89137c0d, [["SecureValueTypeBankStatement", 0x8893f596], []]],
  [0x8b883488, [["SecureValueTypeRentalAgreement", 0x8893f596], []]],
  [0x99e3806a, [["SecureValueTypePassportRegistration", 0x8893f596], []]],
  [0xea02ec33, [["SecureValueTypeTemporaryRegistration", 0x8893f596], []]],
  [0xb320aadb, [["SecureValueTypePhone", 0x8893f596], []]],
  [0x8e3ca7ee, [["SecureValueTypeEmail", 0x8893f596], []]],
  [
    0x187fa0ca,
    [
      ["SecureValue", 0x51138ae],
      [
        ["flags", "#FLAG"],
        ["type", "_"],
        ["data", "Flag0<_>"],
        ["frontSide", "Flag1<_>"],
        ["reverseSide", "Flag2<_>"],
        ["selfie", "Flag3<_>"],
        ["translation", "Flag6<Vector<_>>"],
        ["files", "Flag4<Vector<_>>"],
        ["plainData", "Flag5<_>"],
        ["hash", "bytes"]
      ]
    ]
  ],
  [
    0xdb21d0a7,
    [
      ["InputSecureValue", 0xb49da1fc],
      [
        ["flags", "#FLAG"],
        ["type", "_"],
        ["data", "Flag0<_>"],
        ["frontSide", "Flag1<_>"],
        ["reverseSide", "Flag2<_>"],
        ["selfie", "Flag3<_>"],
        ["translation", "Flag6<Vector<_>>"],
        ["files", "Flag4<Vector<_>>"],
        ["plainData", "Flag5<_>"]
      ]
    ]
  ],
  [
    0xed1ecdb0,
    [
      ["SecureValueHash", 0xd5f5c007],
      [
        ["type", "_"],
        ["hash", "bytes"]
      ]
    ]
  ],
  [
    0xe8a40bd9,
    [
      ["SecureValueErrorData", 0x6075fce],
      [
        ["type", "_"],
        ["dataHash", "bytes"],
        ["field", "string"],
        ["text", "string"]
      ]
    ]
  ],
  [
    0x00be3dfa,
    [
      ["SecureValueErrorFrontSide", 0x6075fce],
      [
        ["type", "_"],
        ["fileHash", "bytes"],
        ["text", "string"]
      ]
    ]
  ],
  [
    0x868a2aa5,
    [
      ["SecureValueErrorReverseSide", 0x6075fce],
      [
        ["type", "_"],
        ["fileHash", "bytes"],
        ["text", "string"]
      ]
    ]
  ],
  [
    0xe537ced6,
    [
      ["SecureValueErrorSelfie", 0x6075fce],
      [
        ["type", "_"],
        ["fileHash", "bytes"],
        ["text", "string"]
      ]
    ]
  ],
  [
    0x7a700873,
    [
      ["SecureValueErrorFile", 0x6075fce],
      [
        ["type", "_"],
        ["fileHash", "bytes"],
        ["text", "string"]
      ]
    ]
  ],
  [
    0x666220e9,
    [
      ["SecureValueErrorFiles", 0x6075fce],
      [
        ["type", "_"],
        ["fileHash", "Vector<bytes>"],
        ["text", "string"]
      ]
    ]
  ],
  [
    0x869d758f,
    [
      ["SecureValueError", 0x6075fce],
      [
        ["type", "_"],
        ["hash", "bytes"],
        ["text", "string"]
      ]
    ]
  ],
  [
    0xa1144770,
    [
      ["SecureValueErrorTranslationFile", 0x6075fce],
      [
        ["type", "_"],
        ["fileHash", "bytes"],
        ["text", "string"]
      ]
    ]
  ],
  [
    0x34636dd8,
    [
      ["SecureValueErrorTranslationFiles", 0x6075fce],
      [
        ["type", "_"],
        ["fileHash", "Vector<bytes>"],
        ["text", "string"]
      ]
    ]
  ],
  [
    0x33f0ea47,
    [
      ["SecureCredentialsEncrypted", 0x94dc7633],
      [
        ["data", "bytes"],
        ["hash", "bytes"],
        ["secret", "bytes"]
      ]
    ]
  ],
  [
    0xad2e1cd8,
    [
      ["account_AuthorizationForm", 0x78049a94],
      [
        ["flags", "#FLAG"],
        ["requiredTypes", "Vector<_>"],
        ["values", "Vector<_>"],
        ["errors", "Vector<_>"],
        ["users", "Vector<_>"],
        ["privacyPolicyUrl", "Flag0<string>"]
      ]
    ]
  ],
  [
    0x811f854f,
    [
      ["account_SentEmailCode", 0x69f3c06e],
      [
        ["emailPattern", "string"],
        ["length", "int"]
      ]
    ]
  ],
  [0x66afa166, [["help_DeepLinkInfoEmpty", 0x984aac38], []]],
  [
    0x6a4ee832,
    [
      ["help_DeepLinkInfo", 0x984aac38],
      [
        ["flags", "#FLAG"],
        ["updateApp", "Flag0<true>"],
        ["message", "string"],
        ["entities", "Flag1<Vector<_>>"]
      ]
    ]
  ],
  [
    0x1142bd56,
    [
      ["SavedPhoneContact", 0x6db98c4],
      [
        ["phone", "string"],
        ["firstName", "string"],
        ["lastName", "string"],
        ["date", "int"]
      ]
    ]
  ],
  [0x4dba4501, [["account_Takeout", 0x843ebe85], [["id", "long"]]]],
  [0xd45ab096, [["PasswordKdfAlgoUnknown", 0x37bcf5cc], []]],
  [
    0x3a912d4a,
    [
      [
        "PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow",
        0x37bcf5cc
      ],
      [
        ["salt1", "bytes"],
        ["salt2", "bytes"],
        ["g", "int"],
        ["p", "bytes"]
      ]
    ]
  ],
  [0x004a8537, [["SecurePasswordKdfAlgoUnknown", 0x77262943], []]],
  [
    0xbbf2dda0,
    [
      ["SecurePasswordKdfAlgoPBKDF2HMACSHA512iter100000", 0x77262943],
      [["salt", "bytes"]]
    ]
  ],
  [
    0x86471d92,
    [["SecurePasswordKdfAlgoSHA512", 0x77262943], [["salt", "bytes"]]]
  ],
  [
    0x1527bcac,
    [
      ["SecureSecretSettings", 0xc6c802fb],
      [
        ["secureAlgo", "_"],
        ["secureSecret", "bytes"],
        ["secureSecretId", "long"]
      ]
    ]
  ],
  [0x9880f658, [["InputCheckPasswordEmpty", 0xd41af560], []]],
  [
    0xd27ff082,
    [
      ["InputCheckPasswordSRP", 0xd41af560],
      [
        ["srpId", "long"],
        ["A", "bytes"],
        ["M1", "bytes"]
      ]
    ]
  ],
  [
    0x829d99da,
    [
      ["SecureRequiredType", 0x7c7b420a],
      [
        ["flags", "#FLAG"],
        ["nativeNames", "Flag0<true>"],
        ["selfieRequired", "Flag1<true>"],
        ["translationRequired", "Flag2<true>"],
        ["type", "_"]
      ]
    ]
  ],
  [
    0x027477b4,
    [["SecureRequiredTypeOneOf", 0x7c7b420a], [["types", "Vector<_>"]]]
  ],
  [0xbfb9f457, [["help_PassportConfigNotModified", 0xc666c0ad], []]],
  [
    0xa098d6af,
    [
      ["help_PassportConfig", 0xc666c0ad],
      [
        ["hash", "int"],
        ["countriesLangs", "_"]
      ]
    ]
  ],
  [
    0x1d1b1245,
    [
      ["InputAppEvent", 0x89322106],
      [
        ["time", "double"],
        ["type", "string"],
        ["peer", "long"],
        ["data", "_"]
      ]
    ]
  ],
  [
    0xc0de1bd9,
    [
      ["JsonObjectValue", 0x937fceb9],
      [
        ["key", "string"],
        ["value", "_"]
      ]
    ]
  ],
  [0x3f6d7b68, [["JsonNull", 0xeb9987b3], []]],
  [0xc7345e6a, [["JsonBool", 0xeb9987b3], [["value", "Bool"]]]],
  [0x2be0dfa4, [["JsonNumber", 0xeb9987b3], [["value", "double"]]]],
  [0xb71e767a, [["JsonString", 0xeb9987b3], [["value", "string"]]]],
  [0xf7444763, [["JsonArray", 0xeb9987b3], [["value", "Vector<_>"]]]],
  [0x99c1d49d, [["JsonObject", 0xeb9987b3], [["value", "Vector<_>"]]]],
  [
    0x34566b6a,
    [
      ["PageTableCell", 0xb0eb3054],
      [
        ["flags", "#FLAG"],
        ["header", "Flag0<true>"],
        ["alignCenter", "Flag3<true>"],
        ["alignRight", "Flag4<true>"],
        ["valignMiddle", "Flag5<true>"],
        ["valignBottom", "Flag6<true>"],
        ["text", "Flag7<_>"],
        ["colspan", "Flag1<int>"],
        ["rowspan", "Flag2<int>"]
      ]
    ]
  ],
  [0xe0c0c5e5, [["PageTableRow", 0x59acee11], [["cells", "Vector<_>"]]]],
  [
    0x6f747657,
    [
      ["PageCaption", 0x29b8eeb3],
      [
        ["text", "_"],
        ["credit", "_"]
      ]
    ]
  ],
  [0xb92fb6cd, [["PageListItemText", 0x8caebcb1], [["text", "_"]]]],
  [0x25e073fc, [["PageListItemBlocks", 0x8caebcb1], [["blocks", "Vector<_>"]]]],
  [
    0x5e068047,
    [
      ["PageListOrderedItemText", 0xeeda0eb8],
      [
        ["num", "string"],
        ["text", "_"]
      ]
    ]
  ],
  [
    0x98dd8936,
    [
      ["PageListOrderedItemBlocks", 0xeeda0eb8],
      [
        ["num", "string"],
        ["blocks", "Vector<_>"]
      ]
    ]
  ],
  [
    0xb390dc08,
    [
      ["PageRelatedArticle", 0x36d05822],
      [
        ["flags", "#FLAG"],
        ["url", "string"],
        ["webpageId", "long"],
        ["title", "Flag0<string>"],
        ["description", "Flag1<string>"],
        ["photoId", "Flag2<long>"],
        ["author", "Flag3<string>"],
        ["publishedDate", "Flag4<int>"]
      ]
    ]
  ],
  [
    0x98657f0d,
    [
      ["Page", 0xb438191e],
      [
        ["flags", "#FLAG"],
        ["part", "Flag0<true>"],
        ["rtl", "Flag1<true>"],
        ["v2", "Flag2<true>"],
        ["url", "string"],
        ["blocks", "Vector<_>"],
        ["photos", "Vector<_>"],
        ["documents", "Vector<_>"],
        ["views", "Flag3<int>"]
      ]
    ]
  ],
  [0x8c05f1c9, [["help_SupportName", 0x7f50b7c2], [["name", "string"]]]],
  [0xf3ae2eed, [["help_UserInfoEmpty", 0x5c53d7d8], []]],
  [
    0x01eb3758,
    [
      ["help_UserInfo", 0x5c53d7d8],
      [
        ["message", "string"],
        ["entities", "Vector<_>"],
        ["author", "string"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0x6ca9c2e9,
    [
      ["PollAnswer", 0x7ea5dd9e],
      [
        ["text", "string"],
        ["option", "bytes"]
      ]
    ]
  ],
  [
    0x86e18161,
    [
      ["Poll", 0x248e557b],
      [
        ["id", "long"],
        ["flags", "#FLAG"],
        ["closed", "Flag0<true>"],
        ["publicVoters", "Flag1<true>"],
        ["multipleChoice", "Flag2<true>"],
        ["quiz", "Flag3<true>"],
        ["question", "string"],
        ["answers", "Vector<_>"],
        ["closePeriod", "Flag4<int>"],
        ["closeDate", "Flag5<int>"]
      ]
    ]
  ],
  [
    0x3b6ddad2,
    [
      ["PollAnswerVoters", 0x7ce0cf91],
      [
        ["flags", "#FLAG"],
        ["chosen", "Flag0<true>"],
        ["correct", "Flag1<true>"],
        ["option", "bytes"],
        ["voters", "int"]
      ]
    ]
  ],
  [
    0xbadcc1a3,
    [
      ["PollResults", 0xc3b4f687],
      [
        ["flags", "#FLAG"],
        ["min", "Flag0<true>"],
        ["results", "Flag1<Vector<_>>"],
        ["totalVoters", "Flag2<int>"],
        ["recentVoters", "Flag3<Vector<int>>"],
        ["solution", "Flag4<string>"],
        ["solutionEntities", "Flag4<Vector<_>>"]
      ]
    ]
  ],
  [0xf041e250, [["ChatOnlines", 0x8c81903a], [["onlines", "int"]]]],
  [0x47a971e0, [["StatsURL", 0x8d4c94c0], [["url", "string"]]]],
  [
    0x5fb224d5,
    [
      ["ChatAdminRights", 0x863dc7c4],
      [
        ["flags", "#FLAG"],
        ["changeInfo", "Flag0<true>"],
        ["postMessages", "Flag1<true>"],
        ["editMessages", "Flag2<true>"],
        ["deleteMessages", "Flag3<true>"],
        ["banUsers", "Flag4<true>"],
        ["inviteUsers", "Flag5<true>"],
        ["pinMessages", "Flag7<true>"],
        ["addAdmins", "Flag9<true>"]
      ]
    ]
  ],
  [
    0x9f120418,
    [
      ["ChatBannedRights", 0x4b5445a9],
      [
        ["flags", "#FLAG"],
        ["viewMessages", "Flag0<true>"],
        ["sendMessages", "Flag1<true>"],
        ["sendMedia", "Flag2<true>"],
        ["sendStickers", "Flag3<true>"],
        ["sendGifs", "Flag4<true>"],
        ["sendGames", "Flag5<true>"],
        ["sendInline", "Flag6<true>"],
        ["embedLinks", "Flag7<true>"],
        ["sendPolls", "Flag8<true>"],
        ["changeInfo", "Flag10<true>"],
        ["inviteUsers", "Flag15<true>"],
        ["pinMessages", "Flag17<true>"],
        ["untilDate", "int"]
      ]
    ]
  ],
  [
    0xe630b979,
    [
      ["InputWallPaper", 0xee77201a],
      [
        ["id", "long"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [0x72091c80, [["InputWallPaperSlug", 0xee77201a], [["slug", "string"]]]],
  [0x8427bbac, [["InputWallPaperNoFile", 0xee77201a], []]],
  [0x1c199183, [["account_WallPapersNotModified", 0xa2c548fd], []]],
  [
    0x702b65a9,
    [
      ["account_WallPapers", 0xa2c548fd],
      [
        ["hash", "int"],
        ["wallpapers", "Vector<_>"]
      ]
    ]
  ],
  [
    0xdebebe83,
    [
      ["CodeSettings", 0x48edbc8a],
      [
        ["flags", "#FLAG"],
        ["allowFlashcall", "Flag0<true>"],
        ["currentNumber", "Flag1<true>"],
        ["allowAppHash", "Flag4<true>"]
      ]
    ]
  ],
  [
    0x05086cf8,
    [
      ["WallPaperSettings", 0x4175e312],
      [
        ["flags", "#FLAG"],
        ["blur", "Flag1<true>"],
        ["motion", "Flag2<true>"],
        ["backgroundColor", "Flag0<int>"],
        ["secondBackgroundColor", "Flag4<int>"],
        ["intensity", "Flag3<int>"],
        ["rotation", "Flag4<int>"]
      ]
    ]
  ],
  [
    0xe04232f3,
    [
      ["AutoDownloadSettings", 0x512819c7],
      [
        ["flags", "#FLAG"],
        ["disabled", "Flag0<true>"],
        ["videoPreloadLarge", "Flag1<true>"],
        ["audioPreloadNext", "Flag2<true>"],
        ["phonecallsLessData", "Flag3<true>"],
        ["photoSizeMax", "int"],
        ["videoSizeMax", "int"],
        ["fileSizeMax", "int"],
        ["videoUploadMaxbitrate", "int"]
      ]
    ]
  ],
  [
    0x63cacf26,
    [
      ["account_AutoDownloadSettings", 0x2fb85921],
      [
        ["low", "_"],
        ["medium", "_"],
        ["high", "_"]
      ]
    ]
  ],
  [
    0xd5b3b9f9,
    [
      ["EmojiKeyword", 0x6612a53e],
      [
        ["keyword", "string"],
        ["emoticons", "Vector<string>"]
      ]
    ]
  ],
  [
    0x236df622,
    [
      ["EmojiKeywordDeleted", 0x6612a53e],
      [
        ["keyword", "string"],
        ["emoticons", "Vector<string>"]
      ]
    ]
  ],
  [
    0x5cc761bd,
    [
      ["EmojiKeywordsDifference", 0xd279c672],
      [
        ["langCode", "string"],
        ["fromVersion", "int"],
        ["version", "int"],
        ["keywords", "Vector<_>"]
      ]
    ]
  ],
  [0xa575739d, [["EmojiURL", 0x1fa08a19], [["url", "string"]]]],
  [0xb3fb5361, [["EmojiLanguage", 0xa48d04ee], [["langCode", "string"]]]],
  [
    0xbc7fc6cd,
    [
      ["FileLocationToBeDeprecated", 0x90f76823],
      [
        ["volumeId", "long"],
        ["localId", "int"]
      ]
    ]
  ],
  [
    0xff544e65,
    [
      ["Folder", 0xeb0e0cfb],
      [
        ["flags", "#FLAG"],
        ["autofillNewBroadcasts", "Flag0<true>"],
        ["autofillPublicGroups", "Flag1<true>"],
        ["autofillNewCorrespondents", "Flag2<true>"],
        ["id", "int"],
        ["title", "string"],
        ["photo", "Flag3<_>"]
      ]
    ]
  ],
  [
    0xfbd2c296,
    [
      ["InputFolderPeer", 0x74825e00],
      [
        ["peer", "_"],
        ["folderId", "int"]
      ]
    ]
  ],
  [
    0xe9baa668,
    [
      ["FolderPeer", 0xf3f2283b],
      [
        ["peer", "_"],
        ["folderId", "int"]
      ]
    ]
  ],
  [
    0xe844ebff,
    [
      ["messages_SearchCounter", 0xd6a7bfa2],
      [
        ["flags", "#FLAG"],
        ["inexact", "Flag1<true>"],
        ["filter", "_"],
        ["count", "int"]
      ]
    ]
  ],
  [
    0x92d33a0e,
    [
      ["UrlAuthResultRequest", 0x7765cb1e],
      [
        ["flags", "#FLAG"],
        ["requestWriteAccess", "Flag0<true>"],
        ["bot", "_"],
        ["domain", "string"]
      ]
    ]
  ],
  [0x8f8c0e4e, [["UrlAuthResultAccepted", 0x7765cb1e], [["url", "string"]]]],
  [0xa9d6db1f, [["UrlAuthResultDefault", 0x7765cb1e], []]],
  [0xbfb5ad8b, [["ChannelLocationEmpty", 0xec260b7f], []]],
  [
    0x209b82db,
    [
      ["ChannelLocation", 0xec260b7f],
      [
        ["geoPoint", "_"],
        ["address", "string"]
      ]
    ]
  ],
  [
    0xca461b5d,
    [
      ["PeerLocated", 0xfada34ac],
      [
        ["peer", "_"],
        ["expires", "int"],
        ["distance", "int"]
      ]
    ]
  ],
  [0xf8ec284b, [["PeerSelfLocated", 0xfada34ac], [["expires", "int"]]]],
  [
    0xd072acb4,
    [
      ["RestrictionReason", 0x6ad95ad],
      [
        ["platform", "string"],
        ["reason", "string"],
        ["text", "string"]
      ]
    ]
  ],
  [
    0x3c5693e9,
    [
      ["InputTheme", 0x7a100f0],
      [
        ["id", "long"],
        ["accessHash", "long"]
      ]
    ]
  ],
  [0xf5890df1, [["InputThemeSlug", 0x7a100f0], [["slug", "string"]]]],
  [
    0x028f1114,
    [
      ["Theme", 0x56b4c80c],
      [
        ["flags", "#FLAG"],
        ["creator", "Flag0<true>"],
        ["default", "Flag1<true>"],
        ["id", "long"],
        ["accessHash", "long"],
        ["slug", "string"],
        ["title", "string"],
        ["document", "Flag2<_>"],
        ["settings", "Flag3<_>"],
        ["installsCount", "int"]
      ]
    ]
  ],
  [0xf41eb622, [["account_ThemesNotModified", 0x7fc52204], []]],
  [
    0x7f676421,
    [
      ["account_Themes", 0x7fc52204],
      [
        ["hash", "int"],
        ["themes", "Vector<_>"]
      ]
    ]
  ],
  [
    0x629f1980,
    [
      ["auth_LoginToken", 0x6b55f636],
      [
        ["expires", "int"],
        ["token", "bytes"]
      ]
    ]
  ],
  [
    0x068e9916,
    [
      ["auth_LoginTokenMigrateTo", 0x6b55f636],
      [
        ["dcId", "int"],
        ["token", "bytes"]
      ]
    ]
  ],
  [
    0x390d5c5e,
    [["auth_LoginTokenSuccess", 0x6b55f636], [["authorization", "_"]]]
  ],
  [
    0x57e28221,
    [
      ["account_ContentSettings", 0xae3ff891],
      [
        ["flags", "#FLAG"],
        ["sensitiveEnabled", "Flag0<true>"],
        ["sensitiveCanChange", "Flag1<true>"]
      ]
    ]
  ],
  [
    0xa927fec5,
    [
      ["messages_InactiveChats", 0x8bf3d7d4],
      [
        ["dates", "Vector<int>"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [0xc3a12462, [["BaseThemeClassic", 0x1f03f444], []]],
  [0xfbd81688, [["BaseThemeDay", 0x1f03f444], []]],
  [0xb7b31ea8, [["BaseThemeNight", 0x1f03f444], []]],
  [0x6d5f77ee, [["BaseThemeTinted", 0x1f03f444], []]],
  [0x5b11125a, [["BaseThemeArctic", 0x1f03f444], []]],
  [
    0xbd507cd1,
    [
      ["InputThemeSettings", 0x8338c882],
      [
        ["flags", "#FLAG"],
        ["baseTheme", "_"],
        ["accentColor", "int"],
        ["messageTopColor", "Flag0<int>"],
        ["messageBottomColor", "Flag0<int>"],
        ["wallpaper", "Flag1<_>"],
        ["wallpaperSettings", "Flag1<_>"]
      ]
    ]
  ],
  [
    0x9c14984a,
    [
      ["ThemeSettings", 0x82666d38],
      [
        ["flags", "#FLAG"],
        ["baseTheme", "_"],
        ["accentColor", "int"],
        ["messageTopColor", "Flag0<int>"],
        ["messageBottomColor", "Flag0<int>"],
        ["wallpaper", "Flag1<_>"]
      ]
    ]
  ],
  [
    0x54b56617,
    [
      ["WebPageAttributeTheme", 0xafcfe9c7],
      [
        ["flags", "#FLAG"],
        ["documents", "Flag0<Vector<_>>"],
        ["settings", "Flag1<_>"]
      ]
    ]
  ],
  [
    0xa28e5559,
    [
      ["MessageUserVote", 0xc92cd592],
      [
        ["userId", "int"],
        ["option", "bytes"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0x36377430,
    [
      ["MessageUserVoteInputOption", 0xc92cd592],
      [
        ["userId", "int"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0x0e8fe0de,
    [
      ["MessageUserVoteMultiple", 0xc92cd592],
      [
        ["userId", "int"],
        ["options", "Vector<bytes>"],
        ["date", "int"]
      ]
    ]
  ],
  [
    0x0823f649,
    [
      ["messages_VotesList", 0xc2199885],
      [
        ["flags", "#FLAG"],
        ["count", "int"],
        ["votes", "Vector<_>"],
        ["users", "Vector<_>"],
        ["nextOffset", "Flag0<string>"]
      ]
    ]
  ],
  [
    0xf568028a,
    [
      ["BankCardOpenUrl", 0xf2e2460e],
      [
        ["url", "string"],
        ["name", "string"]
      ]
    ]
  ],
  [
    0x3e24e573,
    [
      ["payments_BankCardData", 0x8c6dd68b],
      [
        ["title", "string"],
        ["openUrls", "Vector<_>"]
      ]
    ]
  ],
  [
    0x7438f7e8,
    [
      ["DialogFilter", 0x692bc457],
      [
        ["flags", "#FLAG"],
        ["contacts", "Flag0<true>"],
        ["nonContacts", "Flag1<true>"],
        ["groups", "Flag2<true>"],
        ["broadcasts", "Flag3<true>"],
        ["bots", "Flag4<true>"],
        ["excludeMuted", "Flag11<true>"],
        ["excludeRead", "Flag12<true>"],
        ["excludeArchived", "Flag13<true>"],
        ["id", "int"],
        ["title", "string"],
        ["emoticon", "Flag25<string>"],
        ["pinnedPeers", "Vector<_>"],
        ["includePeers", "Vector<_>"],
        ["excludePeers", "Vector<_>"]
      ]
    ]
  ],
  [
    0x77744d4a,
    [
      ["DialogFilterSuggested", 0x31ede086],
      [
        ["filter", "_"],
        ["description", "string"]
      ]
    ]
  ],
  [
    0xb637edaf,
    [
      ["StatsDateRangeDays", 0x81236245],
      [
        ["minDate", "int"],
        ["maxDate", "int"]
      ]
    ]
  ],
  [
    0xcb43acde,
    [
      ["StatsAbsValueAndPrev", 0x3ebe59af],
      [
        ["current", "double"],
        ["previous", "double"]
      ]
    ]
  ],
  [
    0xcbce2fe0,
    [
      ["StatsPercentValue", 0x9702c51e],
      [
        ["part", "double"],
        ["total", "double"]
      ]
    ]
  ],
  [0x4a27eb2d, [["StatsGraphAsync", 0x9b903153], [["token", "string"]]]],
  [0xbedc9822, [["StatsGraphError", 0x9b903153], [["error", "string"]]]],
  [
    0x8ea464b6,
    [
      ["StatsGraph", 0x9b903153],
      [
        ["flags", "#FLAG"],
        ["json", "_"],
        ["zoomToken", "Flag0<string>"]
      ]
    ]
  ],
  [
    0xad4fc9bd,
    [
      ["MessageInteractionCounters", 0x2638b720],
      [
        ["msgId", "int"],
        ["views", "int"],
        ["forwards", "int"]
      ]
    ]
  ],
  [
    0xbdf78394,
    [
      ["stats_BroadcastStats", 0x7ff25428],
      [
        ["period", "_"],
        ["followers", "_"],
        ["viewsPerPost", "_"],
        ["sharesPerPost", "_"],
        ["enabledNotifications", "_"],
        ["growthGraph", "_"],
        ["followersGraph", "_"],
        ["muteGraph", "_"],
        ["topHoursGraph", "_"],
        ["interactionsGraph", "_"],
        ["ivInteractionsGraph", "_"],
        ["viewsBySourceGraph", "_"],
        ["newFollowersBySourceGraph", "_"],
        ["languagesGraph", "_"],
        ["recentMessageInteractions", "Vector<_>"]
      ]
    ]
  ],
  [0x98f6ac75, [["help_PromoDataEmpty", 0x9d595542], [["expires", "int"]]]],
  [
    0x8c39793f,
    [
      ["help_PromoData", 0x9d595542],
      [
        ["flags", "#FLAG"],
        ["proxy", "Flag0<true>"],
        ["expires", "int"],
        ["peer", "_"],
        ["chats", "Vector<_>"],
        ["users", "Vector<_>"],
        ["psaType", "Flag1<string>"],
        ["psaMessage", "Flag2<string>"]
      ]
    ]
  ],
  [
    0x435bb987,
    [
      ["VideoSize", 0x62f1d509],
      [
        ["type", "string"],
        ["location", "_"],
        ["w", "int"],
        ["h", "int"],
        ["size", "int"]
      ]
    ]
  ],
  [
    0xcb9f372d,
    [
      ["InvokeAfterMsgRequest", 0xb7b2364b],
      [
        ["msgId", "long"],
        ["query", "_"]
      ]
    ]
  ],
  [
    0x3dc4b4f0,
    [
      ["InvokeAfterMsgsRequest", 0xb7b2364b],
      [
        ["msgIds", "Vector<long>"],
        ["query", "_"]
      ]
    ]
  ],
  [
    0xc1cd5ea9,
    [
      ["InitConnectionRequest", 0xb7b2364b],
      [
        ["flags", "#FLAG"],
        ["apiId", "int"],
        ["deviceModel", "string"],
        ["systemVersion", "string"],
        ["appVersion", "string"],
        ["systemLangCode", "string"],
        ["langPack", "string"],
        ["langCode", "string"],
        ["proxy", "Flag0<_>"],
        ["params", "Flag1<_>"],
        ["query", "_"]
      ]
    ]
  ],
  [
    0xda9b0d0d,
    [
      ["InvokeWithLayerRequest", 0xb7b2364b],
      [
        ["layer", "int"],
        ["query", "_"]
      ]
    ]
  ],
  [0xbf9459b7, [["InvokeWithoutUpdatesRequest", 0xb7b2364b], [["query", "_"]]]],
  [
    0x365275f2,
    [
      ["InvokeWithMessagesRangeRequest", 0xb7b2364b],
      [
        ["range", "_"],
        ["query", "_"]
      ]
    ]
  ],
  [
    0xaca9fd2e,
    [
      ["InvokeWithTakeoutRequest", 0xb7b2364b],
      [
        ["takeoutId", "long"],
        ["query", "_"]
      ]
    ]
  ],
  [
    0xa677244f,
    [
      ["auth_SendCodeRequest", 0x6ce87081],
      [
        ["phoneNumber", "string"],
        ["apiId", "int"],
        ["apiHash", "string"],
        ["settings", "_"]
      ]
    ]
  ],
  [
    0x80eee427,
    [
      ["auth_SignUpRequest", 0xb9e04e39],
      [
        ["phoneNumber", "string"],
        ["phoneCodeHash", "string"],
        ["firstName", "string"],
        ["lastName", "string"]
      ]
    ]
  ],
  [
    0xbcd51581,
    [
      ["auth_SignInRequest", 0xb9e04e39],
      [
        ["phoneNumber", "string"],
        ["phoneCodeHash", "string"],
        ["phoneCode", "string"]
      ]
    ]
  ],
  [0x5717da40, [["auth_LogOutRequest", 0xf5b399ac], []]],
  [0x9fab0d1a, [["auth_ResetAuthorizationsRequest", 0xf5b399ac], []]],
  [
    0xe5bfffcd,
    [["auth_ExportAuthorizationRequest", 0x5fd1ec51], [["dcId", "int"]]]
  ],
  [
    0xe3ef9613,
    [
      ["auth_ImportAuthorizationRequest", 0xb9e04e39],
      [
        ["id", "int"],
        ["bytes", "bytes"]
      ]
    ]
  ],
  [
    0xcdd42a05,
    [
      ["auth_BindTempAuthKeyRequest", 0xf5b399ac],
      [
        ["permAuthKeyId", "long"],
        ["nonce", "long"],
        ["expiresAt", "int"],
        ["encryptedMessage", "bytes"]
      ]
    ]
  ],
  [
    0x67a3ff2c,
    [
      ["auth_ImportBotAuthorizationRequest", 0xb9e04e39],
      [
        ["flags", "int"],
        ["apiId", "int"],
        ["apiHash", "string"],
        ["botAuthToken", "string"]
      ]
    ]
  ],
  [
    0xd18b4d16,
    [["auth_CheckPasswordRequest", 0xb9e04e39], [["password", "_"]]]
  ],
  [0xd897bc66, [["auth_RequestPasswordRecoveryRequest", 0xfa72d43a], []]],
  [
    0x4ea56e92,
    [["auth_RecoverPasswordRequest", 0xb9e04e39], [["code", "string"]]]
  ],
  [
    0x3ef1a9bf,
    [
      ["auth_ResendCodeRequest", 0x6ce87081],
      [
        ["phoneNumber", "string"],
        ["phoneCodeHash", "string"]
      ]
    ]
  ],
  [
    0x1f040578,
    [
      ["auth_CancelCodeRequest", 0xf5b399ac],
      [
        ["phoneNumber", "string"],
        ["phoneCodeHash", "string"]
      ]
    ]
  ],
  [
    0x8e48a188,
    [
      ["auth_DropTempAuthKeysRequest", 0xf5b399ac],
      [["exceptAuthKeys", "Vector<long>"]]
    ]
  ],
  [
    0xb1b41517,
    [
      ["auth_ExportLoginTokenRequest", 0x6b55f636],
      [
        ["apiId", "int"],
        ["apiHash", "string"],
        ["exceptIds", "Vector<int>"]
      ]
    ]
  ],
  [
    0x95ac5ce4,
    [["auth_ImportLoginTokenRequest", 0x6b55f636], [["token", "bytes"]]]
  ],
  [
    0xe894ad4d,
    [["auth_AcceptLoginTokenRequest", 0xc913c01a], [["token", "bytes"]]]
  ],
  [
    0x68976c6f,
    [
      ["account_RegisterDeviceRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["noMuted", "Flag0<true>"],
        ["tokenType", "int"],
        ["token", "string"],
        ["appSandbox", "Bool"],
        ["secret", "bytes"],
        ["otherUids", "Vector<int>"]
      ]
    ]
  ],
  [
    0x3076c4bf,
    [
      ["account_UnregisterDeviceRequest", 0xf5b399ac],
      [
        ["tokenType", "int"],
        ["token", "string"],
        ["otherUids", "Vector<int>"]
      ]
    ]
  ],
  [
    0x84be5b93,
    [
      ["account_UpdateNotifySettingsRequest", 0xf5b399ac],
      [
        ["peer", "_"],
        ["settings", "_"]
      ]
    ]
  ],
  [
    0x12b3ad31,
    [["account_GetNotifySettingsRequest", 0xcf20c074], [["peer", "_"]]]
  ],
  [0xdb7e1747, [["account_ResetNotifySettingsRequest", 0xf5b399ac], []]],
  [
    0x78515775,
    [
      ["account_UpdateProfileRequest", 0x2da17977],
      [
        ["flags", "#FLAG"],
        ["firstName", "Flag0<string>"],
        ["lastName", "Flag1<string>"],
        ["about", "Flag2<string>"]
      ]
    ]
  ],
  [
    0x6628562c,
    [["account_UpdateStatusRequest", 0xf5b399ac], [["offline", "Bool"]]]
  ],
  [
    0xaabb1763,
    [["account_GetWallPapersRequest", 0xa2c548fd], [["hash", "int"]]]
  ],
  [
    0xae189d5f,
    [
      ["account_ReportPeerRequest", 0xf5b399ac],
      [
        ["peer", "_"],
        ["reason", "_"]
      ]
    ]
  ],
  [
    0x2714d86c,
    [["account_CheckUsernameRequest", 0xf5b399ac], [["username", "string"]]]
  ],
  [
    0x3e0bdd7c,
    [["account_UpdateUsernameRequest", 0x2da17977], [["username", "string"]]]
  ],
  [0xdadbc950, [["account_GetPrivacyRequest", 0xb55aba82], [["key", "_"]]]],
  [
    0xc9f81ce8,
    [
      ["account_SetPrivacyRequest", 0xb55aba82],
      [
        ["key", "_"],
        ["rules", "Vector<_>"]
      ]
    ]
  ],
  [
    0x418d4e0b,
    [["account_DeleteAccountRequest", 0xf5b399ac], [["reason", "string"]]]
  ],
  [0x08fc711d, [["account_GetAccountTTLRequest", 0xbaa39d88], []]],
  [0x2442485e, [["account_SetAccountTTLRequest", 0xf5b399ac], [["ttl", "_"]]]],
  [
    0x82574ae5,
    [
      ["account_SendChangePhoneCodeRequest", 0x6ce87081],
      [
        ["phoneNumber", "string"],
        ["settings", "_"]
      ]
    ]
  ],
  [
    0x70c32edb,
    [
      ["account_ChangePhoneRequest", 0x2da17977],
      [
        ["phoneNumber", "string"],
        ["phoneCodeHash", "string"],
        ["phoneCode", "string"]
      ]
    ]
  ],
  [
    0x38df3532,
    [["account_UpdateDeviceLockedRequest", 0xf5b399ac], [["period", "int"]]]
  ],
  [0xe320c158, [["account_GetAuthorizationsRequest", 0xbf5e0ff], []]],
  [
    0xdf77f3bc,
    [["account_ResetAuthorizationRequest", 0xf5b399ac], [["hash", "long"]]]
  ],
  [0x548a30f5, [["account_GetPasswordRequest", 0x53a211a3], []]],
  [
    0x9cd4eaf9,
    [["account_GetPasswordSettingsRequest", 0xd23fb078], [["password", "_"]]]
  ],
  [
    0xa59b102f,
    [
      ["account_UpdatePasswordSettingsRequest", 0xf5b399ac],
      [
        ["password", "_"],
        ["newSettings", "_"]
      ]
    ]
  ],
  [
    0x1b3faa88,
    [
      ["account_SendConfirmPhoneCodeRequest", 0x6ce87081],
      [
        ["hash", "string"],
        ["settings", "_"]
      ]
    ]
  ],
  [
    0x5f2178c3,
    [
      ["account_ConfirmPhoneRequest", 0xf5b399ac],
      [
        ["phoneCodeHash", "string"],
        ["phoneCode", "string"]
      ]
    ]
  ],
  [
    0x449e0b51,
    [
      ["account_GetTmpPasswordRequest", 0xb064992d],
      [
        ["password", "_"],
        ["period", "int"]
      ]
    ]
  ],
  [0x182e6d6f, [["account_GetWebAuthorizationsRequest", 0x9a365b32], []]],
  [
    0x2d01b9ef,
    [["account_ResetWebAuthorizationRequest", 0xf5b399ac], [["hash", "long"]]]
  ],
  [0x682d2594, [["account_ResetWebAuthorizationsRequest", 0xf5b399ac], []]],
  [0xb288bc7d, [["account_GetAllSecureValuesRequest", 0xe82e4121], []]],
  [
    0x73665bc2,
    [["account_GetSecureValueRequest", 0xe82e4121], [["types", "Vector<_>"]]]
  ],
  [
    0x899fe31d,
    [
      ["account_SaveSecureValueRequest", 0x51138ae],
      [
        ["value", "_"],
        ["secureSecretId", "long"]
      ]
    ]
  ],
  [
    0xb880bc4b,
    [["account_DeleteSecureValueRequest", 0xf5b399ac], [["types", "Vector<_>"]]]
  ],
  [
    0xb86ba8e1,
    [
      ["account_GetAuthorizationFormRequest", 0x78049a94],
      [
        ["botId", "int"],
        ["scope", "string"],
        ["publicKey", "string"]
      ]
    ]
  ],
  [
    0xe7027c94,
    [
      ["account_AcceptAuthorizationRequest", 0xf5b399ac],
      [
        ["botId", "int"],
        ["scope", "string"],
        ["publicKey", "string"],
        ["valueHashes", "Vector<_>"],
        ["credentials", "_"]
      ]
    ]
  ],
  [
    0xa5a356f9,
    [
      ["account_SendVerifyPhoneCodeRequest", 0x6ce87081],
      [
        ["phoneNumber", "string"],
        ["settings", "_"]
      ]
    ]
  ],
  [
    0x4dd3a7f6,
    [
      ["account_VerifyPhoneRequest", 0xf5b399ac],
      [
        ["phoneNumber", "string"],
        ["phoneCodeHash", "string"],
        ["phoneCode", "string"]
      ]
    ]
  ],
  [
    0x7011509f,
    [["account_SendVerifyEmailCodeRequest", 0x69f3c06e], [["email", "string"]]]
  ],
  [
    0xecba39db,
    [
      ["account_VerifyEmailRequest", 0xf5b399ac],
      [
        ["email", "string"],
        ["code", "string"]
      ]
    ]
  ],
  [
    0xf05b4804,
    [
      ["account_InitTakeoutSessionRequest", 0x843ebe85],
      [
        ["flags", "#FLAG"],
        ["contacts", "Flag0<true>"],
        ["messageUsers", "Flag1<true>"],
        ["messageChats", "Flag2<true>"],
        ["messageMegagroups", "Flag3<true>"],
        ["messageChannels", "Flag4<true>"],
        ["files", "Flag5<true>"],
        ["fileMaxSize", "Flag5<int>"]
      ]
    ]
  ],
  [
    0x1d2652ee,
    [
      ["account_FinishTakeoutSessionRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["success", "Flag0<true>"]
      ]
    ]
  ],
  [
    0x8fdf1920,
    [["account_ConfirmPasswordEmailRequest", 0xf5b399ac], [["code", "string"]]]
  ],
  [0x7a7f2a15, [["account_ResendPasswordEmailRequest", 0xf5b399ac], []]],
  [0xc1cbd5b6, [["account_CancelPasswordEmailRequest", 0xf5b399ac], []]],
  [
    0x9f07c728,
    [["account_GetContactSignUpNotificationRequest", 0xf5b399ac], []]
  ],
  [
    0xcff43f61,
    [
      ["account_SetContactSignUpNotificationRequest", 0xf5b399ac],
      [["silent", "Bool"]]
    ]
  ],
  [
    0x53577479,
    [
      ["account_GetNotifyExceptionsRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["compareSound", "Flag1<true>"],
        ["peer", "Flag0<_>"]
      ]
    ]
  ],
  [
    0xfc8ddbea,
    [["account_GetWallPaperRequest", 0x96a2c98b], [["wallpaper", "_"]]]
  ],
  [
    0xdd853661,
    [
      ["account_UploadWallPaperRequest", 0x96a2c98b],
      [
        ["file", "_"],
        ["mimeType", "string"],
        ["settings", "_"]
      ]
    ]
  ],
  [
    0x6c5a5b37,
    [
      ["account_SaveWallPaperRequest", 0xf5b399ac],
      [
        ["wallpaper", "_"],
        ["unsave", "Bool"],
        ["settings", "_"]
      ]
    ]
  ],
  [
    0xfeed5769,
    [
      ["account_InstallWallPaperRequest", 0xf5b399ac],
      [
        ["wallpaper", "_"],
        ["settings", "_"]
      ]
    ]
  ],
  [0xbb3b9804, [["account_ResetWallPapersRequest", 0xf5b399ac], []]],
  [0x56da0b3f, [["account_GetAutoDownloadSettingsRequest", 0x2fb85921], []]],
  [
    0x76f36233,
    [
      ["account_SaveAutoDownloadSettingsRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["low", "Flag0<true>"],
        ["high", "Flag1<true>"],
        ["settings", "_"]
      ]
    ]
  ],
  [
    0x1c3db333,
    [
      ["account_UploadThemeRequest", 0x211fe820],
      [
        ["flags", "#FLAG"],
        ["file", "_"],
        ["thumb", "Flag0<_>"],
        ["fileName", "string"],
        ["mimeType", "string"]
      ]
    ]
  ],
  [
    0x8432c21f,
    [
      ["account_CreateThemeRequest", 0x56b4c80c],
      [
        ["flags", "#FLAG"],
        ["slug", "string"],
        ["title", "string"],
        ["document", "Flag2<_>"],
        ["settings", "Flag3<_>"]
      ]
    ]
  ],
  [
    0x5cb367d5,
    [
      ["account_UpdateThemeRequest", 0x56b4c80c],
      [
        ["flags", "#FLAG"],
        ["format", "string"],
        ["theme", "_"],
        ["slug", "Flag0<string>"],
        ["title", "Flag1<string>"],
        ["document", "Flag2<_>"],
        ["settings", "Flag3<_>"]
      ]
    ]
  ],
  [
    0xf257106c,
    [
      ["account_SaveThemeRequest", 0xf5b399ac],
      [
        ["theme", "_"],
        ["unsave", "Bool"]
      ]
    ]
  ],
  [
    0x7ae43737,
    [
      ["account_InstallThemeRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["dark", "Flag0<true>"],
        ["format", "Flag1<string>"],
        ["theme", "Flag1<_>"]
      ]
    ]
  ],
  [
    0x8d9d742b,
    [
      ["account_GetThemeRequest", 0x56b4c80c],
      [
        ["format", "string"],
        ["theme", "_"],
        ["documentId", "long"]
      ]
    ]
  ],
  [
    0x285946f8,
    [
      ["account_GetThemesRequest", 0x7fc52204],
      [
        ["format", "string"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0xb574b16b,
    [
      ["account_SetContentSettingsRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["sensitiveEnabled", "Flag0<true>"]
      ]
    ]
  ],
  [0x8b9b4dae, [["account_GetContentSettingsRequest", 0xae3ff891], []]],
  [
    0x65ad71dc,
    [
      ["account_GetMultiWallPapersRequest", 0x8ec35283],
      [["wallpapers", "Vector<_>"]]
    ]
  ],
  [0x0d91a548, [["users_GetUsersRequest", 0x406da4d], [["id", "Vector<_>"]]]],
  [0xca30a5b1, [["users_GetFullUserRequest", 0x1f4661b9], [["id", "_"]]]],
  [
    0x90c894b5,
    [
      ["users_SetSecureValueErrorsRequest", 0xf5b399ac],
      [
        ["id", "_"],
        ["errors", "Vector<_>"]
      ]
    ]
  ],
  [
    0x2caa4a42,
    [["contacts_GetContactIDsRequest", 0x5026710f], [["hash", "int"]]]
  ],
  [0xc4a353ee, [["contacts_GetStatusesRequest", 0xdf815c90], []]],
  [
    0xc023849f,
    [["contacts_GetContactsRequest", 0x38be25f6], [["hash", "int"]]]
  ],
  [
    0x2c800be5,
    [
      ["contacts_ImportContactsRequest", 0x8172ad93],
      [["contacts", "Vector<_>"]]
    ]
  ],
  [
    0x096a0e00,
    [["contacts_DeleteContactsRequest", 0x8af52aac], [["id", "Vector<_>"]]]
  ],
  [
    0x1013fd9e,
    [
      ["contacts_DeleteByPhonesRequest", 0xf5b399ac],
      [["phones", "Vector<string>"]]
    ]
  ],
  [0x332b49fc, [["contacts_BlockRequest", 0xf5b399ac], [["id", "_"]]]],
  [0xe54100bd, [["contacts_UnblockRequest", 0xf5b399ac], [["id", "_"]]]],
  [
    0xf57c350f,
    [
      ["contacts_GetBlockedRequest", 0xffba4f4f],
      [
        ["offset", "int"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0x11f812d8,
    [
      ["contacts_SearchRequest", 0x4386a2e3],
      [
        ["q", "string"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0xf93ccba3,
    [["contacts_ResolveUsernameRequest", 0xf065b3a8], [["username", "string"]]]
  ],
  [
    0xd4982db5,
    [
      ["contacts_GetTopPeersRequest", 0x9ee8bb88],
      [
        ["flags", "#FLAG"],
        ["correspondents", "Flag0<true>"],
        ["botsPm", "Flag1<true>"],
        ["botsInline", "Flag2<true>"],
        ["phoneCalls", "Flag3<true>"],
        ["forwardUsers", "Flag4<true>"],
        ["forwardChats", "Flag5<true>"],
        ["groups", "Flag10<true>"],
        ["channels", "Flag15<true>"],
        ["offset", "int"],
        ["limit", "int"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0x1ae373ac,
    [
      ["contacts_ResetTopPeerRatingRequest", 0xf5b399ac],
      [
        ["category", "_"],
        ["peer", "_"]
      ]
    ]
  ],
  [0x879537f1, [["contacts_ResetSavedRequest", 0xf5b399ac], []]],
  [0x82f1e39f, [["contacts_GetSavedRequest", 0x975dbef], []]],
  [
    0x8514bdda,
    [["contacts_ToggleTopPeersRequest", 0xf5b399ac], [["enabled", "Bool"]]]
  ],
  [
    0xe8f463d0,
    [
      ["contacts_AddContactRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["addPhonePrivacyException", "Flag0<true>"],
        ["id", "_"],
        ["firstName", "string"],
        ["lastName", "string"],
        ["phone", "string"]
      ]
    ]
  ],
  [0xf831a20f, [["contacts_AcceptContactRequest", 0x8af52aac], [["id", "_"]]]],
  [
    0xd348bc44,
    [
      ["contacts_GetLocatedRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["background", "Flag1<true>"],
        ["geoPoint", "_"],
        ["selfExpires", "Flag0<int>"]
      ]
    ]
  ],
  [
    0x63c66506,
    [["messages_GetMessagesRequest", 0xd4b40b5e], [["id", "Vector<_>"]]]
  ],
  [
    0xa0ee3b73,
    [
      ["messages_GetDialogsRequest", 0xe1b52ee],
      [
        ["flags", "#FLAG"],
        ["excludePinned", "Flag0<true>"],
        ["folderId", "Flag1<int>"],
        ["offsetDate", "int"],
        ["offsetId", "int"],
        ["offsetPeer", "_"],
        ["limit", "int"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0xdcbb8260,
    [
      ["messages_GetHistoryRequest", 0xd4b40b5e],
      [
        ["peer", "_"],
        ["offsetId", "int"],
        ["offsetDate", "int"],
        ["addOffset", "int"],
        ["limit", "int"],
        ["maxId", "int"],
        ["minId", "int"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0x8614ef68,
    [
      ["messages_SearchRequest", 0xd4b40b5e],
      [
        ["flags", "#FLAG"],
        ["peer", "_"],
        ["q", "string"],
        ["fromId", "Flag0<_>"],
        ["filter", "_"],
        ["minDate", "int"],
        ["maxDate", "int"],
        ["offsetId", "int"],
        ["addOffset", "int"],
        ["limit", "int"],
        ["maxId", "int"],
        ["minId", "int"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0x0e306d3a,
    [
      ["messages_ReadHistoryRequest", 0xced3c06e],
      [
        ["peer", "_"],
        ["maxId", "int"]
      ]
    ]
  ],
  [
    0x1c015b09,
    [
      ["messages_DeleteHistoryRequest", 0x2c49c116],
      [
        ["flags", "#FLAG"],
        ["justClear", "Flag0<true>"],
        ["revoke", "Flag1<true>"],
        ["peer", "_"],
        ["maxId", "int"]
      ]
    ]
  ],
  [
    0xe58e95d2,
    [
      ["messages_DeleteMessagesRequest", 0xced3c06e],
      [
        ["flags", "#FLAG"],
        ["revoke", "Flag0<true>"],
        ["id", "Vector<int>"]
      ]
    ]
  ],
  [
    0x05a954c0,
    [["messages_ReceivedMessagesRequest", 0x8565f897], [["maxId", "int"]]]
  ],
  [
    0xa3825e50,
    [
      ["messages_SetTypingRequest", 0xf5b399ac],
      [
        ["peer", "_"],
        ["action", "_"]
      ]
    ]
  ],
  [
    0x520c3870,
    [
      ["messages_SendMessageRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["noWebpage", "Flag1<true>"],
        ["silent", "Flag5<true>"],
        ["background", "Flag6<true>"],
        ["clearDraft", "Flag7<true>"],
        ["peer", "_"],
        ["replyToMsgId", "Flag0<int>"],
        ["message", "string"],
        ["randomId", "long"],
        ["replyMarkup", "Flag2<_>"],
        ["entities", "Flag3<Vector<_>>"],
        ["scheduleDate", "Flag10<int>"]
      ]
    ]
  ],
  [
    0x3491eba9,
    [
      ["messages_SendMediaRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["silent", "Flag5<true>"],
        ["background", "Flag6<true>"],
        ["clearDraft", "Flag7<true>"],
        ["peer", "_"],
        ["replyToMsgId", "Flag0<int>"],
        ["media", "_"],
        ["message", "string"],
        ["randomId", "long"],
        ["replyMarkup", "Flag2<_>"],
        ["entities", "Flag3<Vector<_>>"],
        ["scheduleDate", "Flag10<int>"]
      ]
    ]
  ],
  [
    0xd9fee60e,
    [
      ["messages_ForwardMessagesRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["silent", "Flag5<true>"],
        ["background", "Flag6<true>"],
        ["withMyScore", "Flag8<true>"],
        ["grouped", "Flag9<true>"],
        ["fromPeer", "_"],
        ["id", "Vector<int>"],
        ["randomId", "Vector<long>"],
        ["toPeer", "_"],
        ["scheduleDate", "Flag10<int>"]
      ]
    ]
  ],
  [0xcf1592db, [["messages_ReportSpamRequest", 0xf5b399ac], [["peer", "_"]]]],
  [
    0x3672e09c,
    [["messages_GetPeerSettingsRequest", 0xf6a79f84], [["peer", "_"]]]
  ],
  [
    0xbd82b658,
    [
      ["messages_ReportRequest", 0xf5b399ac],
      [
        ["peer", "_"],
        ["id", "Vector<int>"],
        ["reason", "_"]
      ]
    ]
  ],
  [
    0x3c6aa187,
    [["messages_GetChatsRequest", 0x99d5cb14], [["id", "Vector<int>"]]]
  ],
  [
    0x3b831c66,
    [["messages_GetFullChatRequest", 0x225a5109], [["chatId", "int"]]]
  ],
  [
    0xdc452855,
    [
      ["messages_EditChatTitleRequest", 0x8af52aac],
      [
        ["chatId", "int"],
        ["title", "string"]
      ]
    ]
  ],
  [
    0xca4c79d8,
    [
      ["messages_EditChatPhotoRequest", 0x8af52aac],
      [
        ["chatId", "int"],
        ["photo", "_"]
      ]
    ]
  ],
  [
    0xf9a0aa09,
    [
      ["messages_AddChatUserRequest", 0x8af52aac],
      [
        ["chatId", "int"],
        ["userId", "_"],
        ["fwdLimit", "int"]
      ]
    ]
  ],
  [
    0xe0611f16,
    [
      ["messages_DeleteChatUserRequest", 0x8af52aac],
      [
        ["chatId", "int"],
        ["userId", "_"]
      ]
    ]
  ],
  [
    0x09cb126e,
    [
      ["messages_CreateChatRequest", 0x8af52aac],
      [
        ["users", "Vector<_>"],
        ["title", "string"]
      ]
    ]
  ],
  [
    0x26cf8950,
    [
      ["messages_GetDhConfigRequest", 0xe488ed8b],
      [
        ["version", "int"],
        ["randomLength", "int"]
      ]
    ]
  ],
  [
    0xf64daf43,
    [
      ["messages_RequestEncryptionRequest", 0x6d28a37a],
      [
        ["userId", "_"],
        ["randomId", "int"],
        ["gA", "bytes"]
      ]
    ]
  ],
  [
    0x3dbc0415,
    [
      ["messages_AcceptEncryptionRequest", 0x6d28a37a],
      [
        ["peer", "_"],
        ["gB", "bytes"],
        ["keyFingerprint", "long"]
      ]
    ]
  ],
  [
    0xedd923c5,
    [["messages_DiscardEncryptionRequest", 0xf5b399ac], [["chatId", "int"]]]
  ],
  [
    0x791451ed,
    [
      ["messages_SetEncryptedTypingRequest", 0xf5b399ac],
      [
        ["peer", "_"],
        ["typing", "Bool"]
      ]
    ]
  ],
  [
    0x7f4b690a,
    [
      ["messages_ReadEncryptedHistoryRequest", 0xf5b399ac],
      [
        ["peer", "_"],
        ["maxDate", "int"]
      ]
    ]
  ],
  [
    0xa9776773,
    [
      ["messages_SendEncryptedRequest", 0xc99e3e50],
      [
        ["peer", "_"],
        ["randomId", "long"],
        ["data", "bytes"]
      ]
    ]
  ],
  [
    0x9a901b66,
    [
      ["messages_SendEncryptedFileRequest", 0xc99e3e50],
      [
        ["peer", "_"],
        ["randomId", "long"],
        ["data", "bytes"],
        ["file", "_"]
      ]
    ]
  ],
  [
    0x32d439a4,
    [
      ["messages_SendEncryptedServiceRequest", 0xc99e3e50],
      [
        ["peer", "_"],
        ["randomId", "long"],
        ["data", "bytes"]
      ]
    ]
  ],
  [
    0x55a5bb66,
    [["messages_ReceivedQueueRequest", 0x8918e168], [["maxQts", "int"]]]
  ],
  [
    0x4b0c8c0f,
    [["messages_ReportEncryptedSpamRequest", 0xf5b399ac], [["peer", "_"]]]
  ],
  [
    0x36a73f77,
    [
      ["messages_ReadMessageContentsRequest", 0xced3c06e],
      [["id", "Vector<int>"]]
    ]
  ],
  [
    0x043d4f2c,
    [
      ["messages_GetStickersRequest", 0xd73bb9de],
      [
        ["emoticon", "string"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0x1c9618b1,
    [["messages_GetAllStickersRequest", 0x45834829], [["hash", "int"]]]
  ],
  [
    0x8b68b0cc,
    [
      ["messages_GetWebPagePreviewRequest", 0x476cbe32],
      [
        ["flags", "#FLAG"],
        ["message", "string"],
        ["entities", "Flag3<Vector<_>>"]
      ]
    ]
  ],
  [
    0x0df7534c,
    [["messages_ExportChatInviteRequest", 0xb4748a58], [["peer", "_"]]]
  ],
  [
    0x3eadb1bb,
    [["messages_CheckChatInviteRequest", 0x4561736], [["hash", "string"]]]
  ],
  [
    0x6c50051c,
    [["messages_ImportChatInviteRequest", 0x8af52aac], [["hash", "string"]]]
  ],
  [
    0x2619a90e,
    [["messages_GetStickerSetRequest", 0x9b704a5a], [["stickerset", "_"]]]
  ],
  [
    0xc78fe460,
    [
      ["messages_InstallStickerSetRequest", 0x67cb3fe8],
      [
        ["stickerset", "_"],
        ["archived", "Bool"]
      ]
    ]
  ],
  [
    0xf96e55de,
    [["messages_UninstallStickerSetRequest", 0xf5b399ac], [["stickerset", "_"]]]
  ],
  [
    0xe6df7378,
    [
      ["messages_StartBotRequest", 0x8af52aac],
      [
        ["bot", "_"],
        ["peer", "_"],
        ["randomId", "long"],
        ["startParam", "string"]
      ]
    ]
  ],
  [
    0xc4c8a55d,
    [
      ["messages_GetMessagesViewsRequest", 0x5026710f],
      [
        ["peer", "_"],
        ["id", "Vector<int>"],
        ["increment", "Bool"]
      ]
    ]
  ],
  [
    0xa9e69f2e,
    [
      ["messages_EditChatAdminRequest", 0xf5b399ac],
      [
        ["chatId", "int"],
        ["userId", "_"],
        ["isAdmin", "Bool"]
      ]
    ]
  ],
  [
    0x15a3b8e3,
    [["messages_MigrateChatRequest", 0x8af52aac], [["chatId", "int"]]]
  ],
  [
    0xbf7225a4,
    [
      ["messages_SearchGlobalRequest", 0xd4b40b5e],
      [
        ["flags", "#FLAG"],
        ["folderId", "Flag0<int>"],
        ["q", "string"],
        ["offsetRate", "int"],
        ["offsetPeer", "_"],
        ["offsetId", "int"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0x78337739,
    [
      ["messages_ReorderStickerSetsRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["masks", "Flag0<true>"],
        ["order", "Vector<long>"]
      ]
    ]
  ],
  [
    0x338e2464,
    [
      ["messages_GetDocumentByHashRequest", 0x211fe820],
      [
        ["sha256", "bytes"],
        ["size", "int"],
        ["mimeType", "string"]
      ]
    ]
  ],
  [
    0xbf9a776b,
    [
      ["messages_SearchGifsRequest", 0xe799ea7],
      [
        ["q", "string"],
        ["offset", "int"]
      ]
    ]
  ],
  [
    0x83bf3d52,
    [["messages_GetSavedGifsRequest", 0xa68b61f5], [["hash", "int"]]]
  ],
  [
    0x327a30cb,
    [
      ["messages_SaveGifRequest", 0xf5b399ac],
      [
        ["id", "_"],
        ["unsave", "Bool"]
      ]
    ]
  ],
  [
    0x514e999d,
    [
      ["messages_GetInlineBotResultsRequest", 0x3ed4d9c9],
      [
        ["flags", "#FLAG"],
        ["bot", "_"],
        ["peer", "_"],
        ["geoPoint", "Flag0<_>"],
        ["query", "string"],
        ["offset", "string"]
      ]
    ]
  ],
  [
    0xeb5ea206,
    [
      ["messages_SetInlineBotResultsRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["gallery", "Flag0<true>"],
        ["private", "Flag1<true>"],
        ["queryId", "long"],
        ["results", "Vector<_>"],
        ["cacheTime", "int"],
        ["nextOffset", "Flag2<string>"],
        ["switchPm", "Flag3<_>"]
      ]
    ]
  ],
  [
    0x220815b0,
    [
      ["messages_SendInlineBotResultRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["silent", "Flag5<true>"],
        ["background", "Flag6<true>"],
        ["clearDraft", "Flag7<true>"],
        ["hideVia", "Flag11<true>"],
        ["peer", "_"],
        ["replyToMsgId", "Flag0<int>"],
        ["randomId", "long"],
        ["queryId", "long"],
        ["id", "string"],
        ["scheduleDate", "Flag10<int>"]
      ]
    ]
  ],
  [
    0xfda68d36,
    [
      ["messages_GetMessageEditDataRequest", 0xfb47949d],
      [
        ["peer", "_"],
        ["id", "int"]
      ]
    ]
  ],
  [
    0x48f71778,
    [
      ["messages_EditMessageRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["noWebpage", "Flag1<true>"],
        ["peer", "_"],
        ["id", "int"],
        ["message", "Flag11<string>"],
        ["media", "Flag14<_>"],
        ["replyMarkup", "Flag2<_>"],
        ["entities", "Flag3<Vector<_>>"],
        ["scheduleDate", "Flag15<int>"]
      ]
    ]
  ],
  [
    0x83557dba,
    [
      ["messages_EditInlineBotMessageRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["noWebpage", "Flag1<true>"],
        ["id", "_"],
        ["message", "Flag11<string>"],
        ["media", "Flag14<_>"],
        ["replyMarkup", "Flag2<_>"],
        ["entities", "Flag3<Vector<_>>"]
      ]
    ]
  ],
  [
    0x810a9fec,
    [
      ["messages_GetBotCallbackAnswerRequest", 0x6c4dd18c],
      [
        ["flags", "#FLAG"],
        ["game", "Flag1<true>"],
        ["peer", "_"],
        ["msgId", "int"],
        ["data", "Flag0<bytes>"]
      ]
    ]
  ],
  [
    0xd58f130a,
    [
      ["messages_SetBotCallbackAnswerRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["alert", "Flag1<true>"],
        ["queryId", "long"],
        ["message", "Flag0<string>"],
        ["url", "Flag2<string>"],
        ["cacheTime", "int"]
      ]
    ]
  ],
  [
    0xe470bcfd,
    [["messages_GetPeerDialogsRequest", 0x3ac70132], [["peers", "Vector<_>"]]]
  ],
  [
    0xbc39e14b,
    [
      ["messages_SaveDraftRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["noWebpage", "Flag1<true>"],
        ["replyToMsgId", "Flag0<int>"],
        ["peer", "_"],
        ["message", "string"],
        ["entities", "Flag3<Vector<_>>"]
      ]
    ]
  ],
  [0x6a3f8d65, [["messages_GetAllDraftsRequest", 0x8af52aac], []]],
  [
    0x2dacca4f,
    [["messages_GetFeaturedStickersRequest", 0x2614b722], [["hash", "int"]]]
  ],
  [
    0x5b118126,
    [
      ["messages_ReadFeaturedStickersRequest", 0xf5b399ac],
      [["id", "Vector<long>"]]
    ]
  ],
  [
    0x5ea192c9,
    [
      ["messages_GetRecentStickersRequest", 0xf76f8683],
      [
        ["flags", "#FLAG"],
        ["attached", "Flag0<true>"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0x392718f8,
    [
      ["messages_SaveRecentStickerRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["attached", "Flag0<true>"],
        ["id", "_"],
        ["unsave", "Bool"]
      ]
    ]
  ],
  [
    0x8999602d,
    [
      ["messages_ClearRecentStickersRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["attached", "Flag0<true>"]
      ]
    ]
  ],
  [
    0x57f17692,
    [
      ["messages_GetArchivedStickersRequest", 0x7296d771],
      [
        ["flags", "#FLAG"],
        ["masks", "Flag0<true>"],
        ["offsetId", "long"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0x65b8c79f,
    [["messages_GetMaskStickersRequest", 0x45834829], [["hash", "int"]]]
  ],
  [
    0xcc5b67cc,
    [["messages_GetAttachedStickersRequest", 0xcc125f6b], [["media", "_"]]]
  ],
  [
    0x8ef8ecc0,
    [
      ["messages_SetGameScoreRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["editMessage", "Flag0<true>"],
        ["force", "Flag1<true>"],
        ["peer", "_"],
        ["id", "int"],
        ["userId", "_"],
        ["score", "int"]
      ]
    ]
  ],
  [
    0x15ad9f64,
    [
      ["messages_SetInlineGameScoreRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["editMessage", "Flag0<true>"],
        ["force", "Flag1<true>"],
        ["id", "_"],
        ["userId", "_"],
        ["score", "int"]
      ]
    ]
  ],
  [
    0xe822649d,
    [
      ["messages_GetGameHighScoresRequest", 0x6ccd95fd],
      [
        ["peer", "_"],
        ["id", "int"],
        ["userId", "_"]
      ]
    ]
  ],
  [
    0x0f635e1b,
    [
      ["messages_GetInlineGameHighScoresRequest", 0x6ccd95fd],
      [
        ["id", "_"],
        ["userId", "_"]
      ]
    ]
  ],
  [
    0x0d0a48c4,
    [
      ["messages_GetCommonChatsRequest", 0x99d5cb14],
      [
        ["userId", "_"],
        ["maxId", "int"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0xeba80ff0,
    [
      ["messages_GetAllChatsRequest", 0x99d5cb14],
      [["exceptIds", "Vector<int>"]]
    ]
  ],
  [
    0x32ca8f91,
    [
      ["messages_GetWebPageRequest", 0x55a97481],
      [
        ["url", "string"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0xa731e257,
    [
      ["messages_ToggleDialogPinRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["pinned", "Flag0<true>"],
        ["peer", "_"]
      ]
    ]
  ],
  [
    0x3b1adf37,
    [
      ["messages_ReorderPinnedDialogsRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["force", "Flag0<true>"],
        ["folderId", "int"],
        ["order", "Vector<_>"]
      ]
    ]
  ],
  [
    0xd6b94df2,
    [["messages_GetPinnedDialogsRequest", 0x3ac70132], [["folderId", "int"]]]
  ],
  [
    0xe5f672fa,
    [
      ["messages_SetBotShippingResultsRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["queryId", "long"],
        ["error", "Flag0<string>"],
        ["shippingOptions", "Flag1<Vector<_>>"]
      ]
    ]
  ],
  [
    0x09c2dd95,
    [
      ["messages_SetBotPrecheckoutResultsRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["success", "Flag1<true>"],
        ["queryId", "long"],
        ["error", "Flag0<string>"]
      ]
    ]
  ],
  [
    0x519bc2b1,
    [
      ["messages_UploadMediaRequest", 0x476cbe32],
      [
        ["peer", "_"],
        ["media", "_"]
      ]
    ]
  ],
  [
    0xc97df020,
    [
      ["messages_SendScreenshotNotificationRequest", 0x8af52aac],
      [
        ["peer", "_"],
        ["replyToMsgId", "int"],
        ["randomId", "long"]
      ]
    ]
  ],
  [
    0x21ce0b0e,
    [["messages_GetFavedStickersRequest", 0x8e736fb9], [["hash", "int"]]]
  ],
  [
    0xb9ffc55b,
    [
      ["messages_FaveStickerRequest", 0xf5b399ac],
      [
        ["id", "_"],
        ["unfave", "Bool"]
      ]
    ]
  ],
  [
    0x46578472,
    [
      ["messages_GetUnreadMentionsRequest", 0xd4b40b5e],
      [
        ["peer", "_"],
        ["offsetId", "int"],
        ["addOffset", "int"],
        ["limit", "int"],
        ["maxId", "int"],
        ["minId", "int"]
      ]
    ]
  ],
  [0x0f0189d3, [["messages_ReadMentionsRequest", 0x2c49c116], [["peer", "_"]]]],
  [
    0xbbc45b09,
    [
      ["messages_GetRecentLocationsRequest", 0xd4b40b5e],
      [
        ["peer", "_"],
        ["limit", "int"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0xcc0110cb,
    [
      ["messages_SendMultiMediaRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["silent", "Flag5<true>"],
        ["background", "Flag6<true>"],
        ["clearDraft", "Flag7<true>"],
        ["peer", "_"],
        ["replyToMsgId", "Flag0<int>"],
        ["multiMedia", "Vector<_>"],
        ["scheduleDate", "Flag10<int>"]
      ]
    ]
  ],
  [
    0x5057c497,
    [
      ["messages_UploadEncryptedFileRequest", 0x842a67c0],
      [
        ["peer", "_"],
        ["file", "_"]
      ]
    ]
  ],
  [
    0xc2b7d08b,
    [
      ["messages_SearchStickerSetsRequest", 0x40df361],
      [
        ["flags", "#FLAG"],
        ["excludeFeatured", "Flag0<true>"],
        ["q", "string"],
        ["hash", "int"]
      ]
    ]
  ],
  [0x1cff7e08, [["messages_GetSplitRangesRequest", 0x5ba52504], []]],
  [
    0xc286d98f,
    [
      ["messages_MarkDialogUnreadRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["unread", "Flag0<true>"],
        ["peer", "_"]
      ]
    ]
  ],
  [0x22e24e22, [["messages_GetDialogUnreadMarksRequest", 0xbec64ad9], []]],
  [0x7e58ee9c, [["messages_ClearAllDraftsRequest", 0xf5b399ac], []]],
  [
    0xd2aaf7ec,
    [
      ["messages_UpdatePinnedMessageRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["silent", "Flag0<true>"],
        ["peer", "_"],
        ["id", "int"]
      ]
    ]
  ],
  [
    0x10ea6184,
    [
      ["messages_SendVoteRequest", 0x8af52aac],
      [
        ["peer", "_"],
        ["msgId", "int"],
        ["options", "Vector<bytes>"]
      ]
    ]
  ],
  [
    0x73bb643b,
    [
      ["messages_GetPollResultsRequest", 0x8af52aac],
      [
        ["peer", "_"],
        ["msgId", "int"]
      ]
    ]
  ],
  [0x6e2be050, [["messages_GetOnlinesRequest", 0x8c81903a], [["peer", "_"]]]],
  [
    0x812c2ae6,
    [
      ["messages_GetStatsURLRequest", 0x8d4c94c0],
      [
        ["flags", "#FLAG"],
        ["dark", "Flag0<true>"],
        ["peer", "_"],
        ["params", "string"]
      ]
    ]
  ],
  [
    0xdef60797,
    [
      ["messages_EditChatAboutRequest", 0xf5b399ac],
      [
        ["peer", "_"],
        ["about", "string"]
      ]
    ]
  ],
  [
    0xa5866b41,
    [
      ["messages_EditChatDefaultBannedRightsRequest", 0x8af52aac],
      [
        ["peer", "_"],
        ["bannedRights", "_"]
      ]
    ]
  ],
  [
    0x35a0e062,
    [["messages_GetEmojiKeywordsRequest", 0xd279c672], [["langCode", "string"]]]
  ],
  [
    0x1508b6af,
    [
      ["messages_GetEmojiKeywordsDifferenceRequest", 0xd279c672],
      [
        ["langCode", "string"],
        ["fromVersion", "int"]
      ]
    ]
  ],
  [
    0x4e9963b2,
    [
      ["messages_GetEmojiKeywordsLanguagesRequest", 0xe795d387],
      [["langCodes", "Vector<string>"]]
    ]
  ],
  [
    0xd5b10c26,
    [["messages_GetEmojiURLRequest", 0x1fa08a19], [["langCode", "string"]]]
  ],
  [
    0x732eef00,
    [
      ["messages_GetSearchCountersRequest", 0x6bde3c6e],
      [
        ["peer", "_"],
        ["filters", "Vector<_>"]
      ]
    ]
  ],
  [
    0xe33f5613,
    [
      ["messages_RequestUrlAuthRequest", 0x7765cb1e],
      [
        ["peer", "_"],
        ["msgId", "int"],
        ["buttonId", "int"]
      ]
    ]
  ],
  [
    0xf729ea98,
    [
      ["messages_AcceptUrlAuthRequest", 0x7765cb1e],
      [
        ["flags", "#FLAG"],
        ["writeAllowed", "Flag0<true>"],
        ["peer", "_"],
        ["msgId", "int"],
        ["buttonId", "int"]
      ]
    ]
  ],
  [
    0x4facb138,
    [["messages_HidePeerSettingsBarRequest", 0xf5b399ac], [["peer", "_"]]]
  ],
  [
    0xe2c2685b,
    [
      ["messages_GetScheduledHistoryRequest", 0xd4b40b5e],
      [
        ["peer", "_"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0xbdbb0464,
    [
      ["messages_GetScheduledMessagesRequest", 0xd4b40b5e],
      [
        ["peer", "_"],
        ["id", "Vector<int>"]
      ]
    ]
  ],
  [
    0xbd38850a,
    [
      ["messages_SendScheduledMessagesRequest", 0x8af52aac],
      [
        ["peer", "_"],
        ["id", "Vector<int>"]
      ]
    ]
  ],
  [
    0x59ae2b16,
    [
      ["messages_DeleteScheduledMessagesRequest", 0x8af52aac],
      [
        ["peer", "_"],
        ["id", "Vector<int>"]
      ]
    ]
  ],
  [
    0xb86e380e,
    [
      ["messages_GetPollVotesRequest", 0xc2199885],
      [
        ["flags", "#FLAG"],
        ["peer", "_"],
        ["id", "int"],
        ["option", "Flag0<bytes>"],
        ["offset", "Flag1<string>"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0xb5052fea,
    [
      ["messages_ToggleStickerSetsRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["uninstall", "Flag0<true>"],
        ["archive", "Flag1<true>"],
        ["unarchive", "Flag2<true>"],
        ["stickersets", "Vector<_>"]
      ]
    ]
  ],
  [0xf19ed96d, [["messages_GetDialogFiltersRequest", 0x601ce94d], []]],
  [0xa29cd42c, [["messages_GetSuggestedDialogFiltersRequest", 0x7b296c39], []]],
  [
    0x1ad4a04a,
    [
      ["messages_UpdateDialogFilterRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["id", "int"],
        ["filter", "Flag0<_>"]
      ]
    ]
  ],
  [
    0xc563c1e4,
    [
      ["messages_UpdateDialogFiltersOrderRequest", 0xf5b399ac],
      [["order", "Vector<int>"]]
    ]
  ],
  [
    0x5fe7025b,
    [
      ["messages_GetOldFeaturedStickersRequest", 0x2614b722],
      [
        ["offset", "int"],
        ["limit", "int"],
        ["hash", "int"]
      ]
    ]
  ],
  [0xedd4882a, [["updates_GetStateRequest", 0x23df1a01], []]],
  [
    0x25939651,
    [
      ["updates_GetDifferenceRequest", 0x20482874],
      [
        ["flags", "#FLAG"],
        ["pts", "int"],
        ["ptsTotalLimit", "Flag0<int>"],
        ["date", "int"],
        ["qts", "int"]
      ]
    ]
  ],
  [
    0x03173d78,
    [
      ["updates_GetChannelDifferenceRequest", 0x29896f5d],
      [
        ["flags", "#FLAG"],
        ["force", "Flag0<true>"],
        ["channel", "_"],
        ["filter", "_"],
        ["pts", "int"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0xf0bb5152,
    [["photos_UpdateProfilePhotoRequest", 0xc6338f7d], [["id", "_"]]]
  ],
  [
    0x4f32c098,
    [["photos_UploadProfilePhotoRequest", 0xc292bd24], [["file", "_"]]]
  ],
  [
    0x87cf7f2f,
    [["photos_DeletePhotosRequest", 0x8918e168], [["id", "Vector<_>"]]]
  ],
  [
    0x91cd32a8,
    [
      ["photos_GetUserPhotosRequest", 0x27cfb967],
      [
        ["userId", "_"],
        ["offset", "int"],
        ["maxId", "long"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0xb304a621,
    [
      ["upload_SaveFilePartRequest", 0xf5b399ac],
      [
        ["fileId", "long"],
        ["filePart", "int"],
        ["bytes", "bytes"]
      ]
    ]
  ],
  [
    0xb15a9afc,
    [
      ["upload_GetFileRequest", 0x6c9bd728],
      [
        ["flags", "#FLAG"],
        ["precise", "Flag0<true>"],
        ["cdnSupported", "Flag1<true>"],
        ["location", "_"],
        ["offset", "int"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0xde7b673d,
    [
      ["upload_SaveBigFilePartRequest", 0xf5b399ac],
      [
        ["fileId", "long"],
        ["filePart", "int"],
        ["fileTotalParts", "int"],
        ["bytes", "bytes"]
      ]
    ]
  ],
  [
    0x24e6818d,
    [
      ["upload_GetWebFileRequest", 0x68f17f51],
      [
        ["location", "_"],
        ["offset", "int"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0x2000bcc3,
    [
      ["upload_GetCdnFileRequest", 0xf5ccf928],
      [
        ["fileToken", "bytes"],
        ["offset", "int"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0x9b2754a8,
    [
      ["upload_ReuploadCdnFileRequest", 0xa5940726],
      [
        ["fileToken", "bytes"],
        ["requestToken", "bytes"]
      ]
    ]
  ],
  [
    0x4da54231,
    [
      ["upload_GetCdnFileHashesRequest", 0xa5940726],
      [
        ["fileToken", "bytes"],
        ["offset", "int"]
      ]
    ]
  ],
  [
    0xc7025931,
    [
      ["upload_GetFileHashesRequest", 0xa5940726],
      [
        ["location", "_"],
        ["offset", "int"]
      ]
    ]
  ],
  [0xc4f9186b, [["help_GetConfigRequest", 0xd3262a4a], []]],
  [0x1fb33026, [["help_GetNearestDcRequest", 0x3877045f], []]],
  [
    0x522d5a7d,
    [["help_GetAppUpdateRequest", 0x5897069e], [["source", "string"]]]
  ],
  [0x4d392343, [["help_GetInviteTextRequest", 0xcf70aa35], []]],
  [0x9cdf08cd, [["help_GetSupportRequest", 0x7159bceb], []]],
  [
    0x9010ef6f,
    [
      ["help_GetAppChangelogRequest", 0x8af52aac],
      [["prevAppVersion", "string"]]
    ]
  ],
  [
    0xec22cfcd,
    [
      ["help_SetBotUpdatesStatusRequest", 0xf5b399ac],
      [
        ["pendingUpdatesCount", "int"],
        ["message", "string"]
      ]
    ]
  ],
  [0x52029342, [["help_GetCdnConfigRequest", 0xecda397c], []]],
  [
    0x3dc0f114,
    [["help_GetRecentMeUrlsRequest", 0xf269c477], [["referer", "string"]]]
  ],
  [0x2ca51fd1, [["help_GetTermsOfServiceUpdateRequest", 0x293c2977], []]],
  [
    0xee72f79a,
    [["help_AcceptTermsOfServiceRequest", 0xf5b399ac], [["id", "_"]]]
  ],
  [
    0x3fedc75f,
    [["help_GetDeepLinkInfoRequest", 0x984aac38], [["path", "string"]]]
  ],
  [0x98914110, [["help_GetAppConfigRequest", 0xeb9987b3], []]],
  [
    0x6f02f748,
    [["help_SaveAppLogRequest", 0xf5b399ac], [["events", "Vector<_>"]]]
  ],
  [
    0xc661ad08,
    [["help_GetPassportConfigRequest", 0xc666c0ad], [["hash", "int"]]]
  ],
  [0xd360e72c, [["help_GetSupportNameRequest", 0x7f50b7c2], []]],
  [0x038a08d3, [["help_GetUserInfoRequest", 0x5c53d7d8], [["userId", "_"]]]],
  [
    0x66b91b70,
    [
      ["help_EditUserInfoRequest", 0x5c53d7d8],
      [
        ["userId", "_"],
        ["message", "string"],
        ["entities", "Vector<_>"]
      ]
    ]
  ],
  [0xc0977421, [["help_GetPromoDataRequest", 0x9d595542], []]],
  [0x1e251c95, [["help_HidePromoDataRequest", 0xf5b399ac], [["peer", "_"]]]],
  [
    0xcc104937,
    [
      ["channels_ReadHistoryRequest", 0xf5b399ac],
      [
        ["channel", "_"],
        ["maxId", "int"]
      ]
    ]
  ],
  [
    0x84c1fd4e,
    [
      ["channels_DeleteMessagesRequest", 0xced3c06e],
      [
        ["channel", "_"],
        ["id", "Vector<int>"]
      ]
    ]
  ],
  [
    0xd10dd71b,
    [
      ["channels_DeleteUserHistoryRequest", 0x2c49c116],
      [
        ["channel", "_"],
        ["userId", "_"]
      ]
    ]
  ],
  [
    0xfe087810,
    [
      ["channels_ReportSpamRequest", 0xf5b399ac],
      [
        ["channel", "_"],
        ["userId", "_"],
        ["id", "Vector<int>"]
      ]
    ]
  ],
  [
    0xad8c9a23,
    [
      ["channels_GetMessagesRequest", 0xd4b40b5e],
      [
        ["channel", "_"],
        ["id", "Vector<_>"]
      ]
    ]
  ],
  [
    0x123e05e9,
    [
      ["channels_GetParticipantsRequest", 0xe60a6e64],
      [
        ["channel", "_"],
        ["filter", "_"],
        ["offset", "int"],
        ["limit", "int"],
        ["hash", "int"]
      ]
    ]
  ],
  [
    0x546dd7a6,
    [
      ["channels_GetParticipantRequest", 0x6658151a],
      [
        ["channel", "_"],
        ["userId", "_"]
      ]
    ]
  ],
  [
    0x0a7f6bbb,
    [["channels_GetChannelsRequest", 0x99d5cb14], [["id", "Vector<_>"]]]
  ],
  [
    0x08736a09,
    [["channels_GetFullChannelRequest", 0x225a5109], [["channel", "_"]]]
  ],
  [
    0x3d5fb10f,
    [
      ["channels_CreateChannelRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["broadcast", "Flag0<true>"],
        ["megagroup", "Flag1<true>"],
        ["title", "string"],
        ["about", "string"],
        ["geoPoint", "Flag2<_>"],
        ["address", "Flag2<string>"]
      ]
    ]
  ],
  [
    0xd33c8902,
    [
      ["channels_EditAdminRequest", 0x8af52aac],
      [
        ["channel", "_"],
        ["userId", "_"],
        ["adminRights", "_"],
        ["rank", "string"]
      ]
    ]
  ],
  [
    0x566decd0,
    [
      ["channels_EditTitleRequest", 0x8af52aac],
      [
        ["channel", "_"],
        ["title", "string"]
      ]
    ]
  ],
  [
    0xf12e57c9,
    [
      ["channels_EditPhotoRequest", 0x8af52aac],
      [
        ["channel", "_"],
        ["photo", "_"]
      ]
    ]
  ],
  [
    0x10e6bd2c,
    [
      ["channels_CheckUsernameRequest", 0xf5b399ac],
      [
        ["channel", "_"],
        ["username", "string"]
      ]
    ]
  ],
  [
    0x3514b3de,
    [
      ["channels_UpdateUsernameRequest", 0xf5b399ac],
      [
        ["channel", "_"],
        ["username", "string"]
      ]
    ]
  ],
  [
    0x24b524c5,
    [["channels_JoinChannelRequest", 0x8af52aac], [["channel", "_"]]]
  ],
  [
    0xf836aa95,
    [["channels_LeaveChannelRequest", 0x8af52aac], [["channel", "_"]]]
  ],
  [
    0x199f3a6c,
    [
      ["channels_InviteToChannelRequest", 0x8af52aac],
      [
        ["channel", "_"],
        ["users", "Vector<_>"]
      ]
    ]
  ],
  [
    0xc0111fe3,
    [["channels_DeleteChannelRequest", 0x8af52aac], [["channel", "_"]]]
  ],
  [
    0xceb77163,
    [
      ["channels_ExportMessageLinkRequest", 0xdee644cc],
      [
        ["channel", "_"],
        ["id", "int"],
        ["grouped", "Bool"]
      ]
    ]
  ],
  [
    0x1f69b606,
    [
      ["channels_ToggleSignaturesRequest", 0x8af52aac],
      [
        ["channel", "_"],
        ["enabled", "Bool"]
      ]
    ]
  ],
  [
    0xf8b036af,
    [
      ["channels_GetAdminedPublicChannelsRequest", 0x99d5cb14],
      [
        ["flags", "#FLAG"],
        ["byLocation", "Flag0<true>"],
        ["checkLimit", "Flag1<true>"]
      ]
    ]
  ],
  [
    0x72796912,
    [
      ["channels_EditBannedRequest", 0x8af52aac],
      [
        ["channel", "_"],
        ["userId", "_"],
        ["bannedRights", "_"]
      ]
    ]
  ],
  [
    0x33ddf480,
    [
      ["channels_GetAdminLogRequest", 0x51f076bc],
      [
        ["flags", "#FLAG"],
        ["channel", "_"],
        ["q", "string"],
        ["eventsFilter", "Flag0<_>"],
        ["admins", "Flag1<Vector<_>>"],
        ["maxId", "long"],
        ["minId", "long"],
        ["limit", "int"]
      ]
    ]
  ],
  [
    0xea8ca4f9,
    [
      ["channels_SetStickersRequest", 0xf5b399ac],
      [
        ["channel", "_"],
        ["stickerset", "_"]
      ]
    ]
  ],
  [
    0xeab5dc38,
    [
      ["channels_ReadMessageContentsRequest", 0xf5b399ac],
      [
        ["channel", "_"],
        ["id", "Vector<int>"]
      ]
    ]
  ],
  [
    0xaf369d42,
    [
      ["channels_DeleteHistoryRequest", 0xf5b399ac],
      [
        ["channel", "_"],
        ["maxId", "int"]
      ]
    ]
  ],
  [
    0xeabbb94c,
    [
      ["channels_TogglePreHistoryHiddenRequest", 0x8af52aac],
      [
        ["channel", "_"],
        ["enabled", "Bool"]
      ]
    ]
  ],
  [
    0x8341ecc0,
    [["channels_GetLeftChannelsRequest", 0x99d5cb14], [["offset", "int"]]]
  ],
  [0xf5dad378, [["channels_GetGroupsForDiscussionRequest", 0x99d5cb14], []]],
  [
    0x40582bb2,
    [
      ["channels_SetDiscussionGroupRequest", 0xf5b399ac],
      [
        ["broadcast", "_"],
        ["group", "_"]
      ]
    ]
  ],
  [
    0x8f38cd1f,
    [
      ["channels_EditCreatorRequest", 0x8af52aac],
      [
        ["channel", "_"],
        ["userId", "_"],
        ["password", "_"]
      ]
    ]
  ],
  [
    0x58e63f6d,
    [
      ["channels_EditLocationRequest", 0xf5b399ac],
      [
        ["channel", "_"],
        ["geoPoint", "_"],
        ["address", "string"]
      ]
    ]
  ],
  [
    0xedd49ef0,
    [
      ["channels_ToggleSlowModeRequest", 0x8af52aac],
      [
        ["channel", "_"],
        ["seconds", "int"]
      ]
    ]
  ],
  [0x11e831ee, [["channels_GetInactiveChannelsRequest", 0x8bf3d7d4], []]],
  [
    0xaa2769ed,
    [
      ["bots_SendCustomRequestRequest", 0xad0352e8],
      [
        ["customMethod", "string"],
        ["params", "_"]
      ]
    ]
  ],
  [
    0xe6213f4d,
    [
      ["bots_AnswerWebhookJSONQueryRequest", 0xf5b399ac],
      [
        ["queryId", "long"],
        ["data", "_"]
      ]
    ]
  ],
  [
    0x805d46f6,
    [["bots_SetBotCommandsRequest", 0xf5b399ac], [["commands", "Vector<_>"]]]
  ],
  [
    0x99f09745,
    [["payments_GetPaymentFormRequest", 0xa0483f19], [["msgId", "int"]]]
  ],
  [
    0xa092a980,
    [["payments_GetPaymentReceiptRequest", 0x590093c9], [["msgId", "int"]]]
  ],
  [
    0x770a8e74,
    [
      ["payments_ValidateRequestedInfoRequest", 0x8f8044b7],
      [
        ["flags", "#FLAG"],
        ["save", "Flag0<true>"],
        ["msgId", "int"],
        ["info", "_"]
      ]
    ]
  ],
  [
    0x2b8879b3,
    [
      ["payments_SendPaymentFormRequest", 0x8ae16a9d],
      [
        ["flags", "#FLAG"],
        ["msgId", "int"],
        ["requestedInfoId", "Flag0<string>"],
        ["shippingOptionId", "Flag1<string>"],
        ["credentials", "_"]
      ]
    ]
  ],
  [0x227d824b, [["payments_GetSavedInfoRequest", 0xad3cf146], []]],
  [
    0xd83d70c1,
    [
      ["payments_ClearSavedInfoRequest", 0xf5b399ac],
      [
        ["flags", "#FLAG"],
        ["credentials", "Flag0<true>"],
        ["info", "Flag1<true>"]
      ]
    ]
  ],
  [
    0x2e79d779,
    [["payments_GetBankCardDataRequest", 0x8c6dd68b], [["number", "string"]]]
  ],
  [
    0xf1036780,
    [
      ["stickers_CreateStickerSetRequest", 0x9b704a5a],
      [
        ["flags", "#FLAG"],
        ["masks", "Flag0<true>"],
        ["animated", "Flag1<true>"],
        ["userId", "_"],
        ["title", "string"],
        ["shortName", "string"],
        ["thumb", "Flag2<_>"],
        ["stickers", "Vector<_>"]
      ]
    ]
  ],
  [
    0xf7760f51,
    [["stickers_RemoveStickerFromSetRequest", 0x9b704a5a], [["sticker", "_"]]]
  ],
  [
    0xffb6d4ca,
    [
      ["stickers_ChangeStickerPositionRequest", 0x9b704a5a],
      [
        ["sticker", "_"],
        ["position", "int"]
      ]
    ]
  ],
  [
    0x8653febe,
    [
      ["stickers_AddStickerToSetRequest", 0x9b704a5a],
      [
        ["stickerset", "_"],
        ["sticker", "_"]
      ]
    ]
  ],
  [
    0x9a364e30,
    [
      ["stickers_SetStickerSetThumbRequest", 0x9b704a5a],
      [
        ["stickerset", "_"],
        ["thumb", "_"]
      ]
    ]
  ],
  [0x55451fa9, [["phone_GetCallConfigRequest", 0xad0352e8], []]],
  [
    0x42ff96ed,
    [
      ["phone_RequestCallRequest", 0xd48afe4f],
      [
        ["flags", "#FLAG"],
        ["video", "Flag0<true>"],
        ["userId", "_"],
        ["randomId", "int"],
        ["gAHash", "bytes"],
        ["protocol", "_"]
      ]
    ]
  ],
  [
    0x3bd2b4a0,
    [
      ["phone_AcceptCallRequest", 0xd48afe4f],
      [
        ["peer", "_"],
        ["gB", "bytes"],
        ["protocol", "_"]
      ]
    ]
  ],
  [
    0x2efe1722,
    [
      ["phone_ConfirmCallRequest", 0xd48afe4f],
      [
        ["peer", "_"],
        ["gA", "bytes"],
        ["keyFingerprint", "long"],
        ["protocol", "_"]
      ]
    ]
  ],
  [0x17d54f61, [["phone_ReceivedCallRequest", 0xf5b399ac], [["peer", "_"]]]],
  [
    0xb2cbc1c0,
    [
      ["phone_DiscardCallRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["video", "Flag0<true>"],
        ["peer", "_"],
        ["duration", "int"],
        ["reason", "_"],
        ["connectionId", "long"]
      ]
    ]
  ],
  [
    0x59ead627,
    [
      ["phone_SetCallRatingRequest", 0x8af52aac],
      [
        ["flags", "#FLAG"],
        ["userInitiative", "Flag0<true>"],
        ["peer", "_"],
        ["rating", "int"],
        ["comment", "string"]
      ]
    ]
  ],
  [
    0x277add7e,
    [
      ["phone_SaveCallDebugRequest", 0xf5b399ac],
      [
        ["peer", "_"],
        ["debug", "_"]
      ]
    ]
  ],
  [
    0xff7a9383,
    [
      ["phone_SendSignalingDataRequest", 0xf5b399ac],
      [
        ["peer", "_"],
        ["data", "bytes"]
      ]
    ]
  ],
  [
    0xf2f2330a,
    [
      ["langpack_GetLangPackRequest", 0x52662d55],
      [
        ["langPack", "string"],
        ["langCode", "string"]
      ]
    ]
  ],
  [
    0xefea3803,
    [
      ["langpack_GetStringsRequest", 0xc7b7353d],
      [
        ["langPack", "string"],
        ["langCode", "string"],
        ["keys", "Vector<string>"]
      ]
    ]
  ],
  [
    0xcd984aa5,
    [
      ["langpack_GetDifferenceRequest", 0x52662d55],
      [
        ["langPack", "string"],
        ["langCode", "string"],
        ["fromVersion", "int"]
      ]
    ]
  ],
  [
    0x42c6978f,
    [["langpack_GetLanguagesRequest", 0x280912c9], [["langPack", "string"]]]
  ],
  [
    0x6a596502,
    [
      ["langpack_GetLanguageRequest", 0xabac89b7],
      [
        ["langPack", "string"],
        ["langCode", "string"]
      ]
    ]
  ],
  [
    0x6847d0ab,
    [
      ["folders_EditPeerFoldersRequest", 0x8af52aac],
      [["folderPeers", "Vector<_>"]]
    ]
  ],
  [
    0x1c295881,
    [["folders_DeleteFolderRequest", 0x8af52aac], [["folderId", "int"]]]
  ],
  [
    0xab42441a,
    [
      ["stats_GetBroadcastStatsRequest", 0x7ff25428],
      [
        ["flags", "#FLAG"],
        ["dark", "Flag0<true>"],
        ["channel", "_"]
      ]
    ]
  ],
  [
    0x621d5fa0,
    [
      ["stats_LoadAsyncGraphRequest", 0x9b903153],
      [
        ["flags", "#FLAG"],
        ["token", "string"],
        ["x", "Flag0<long>"]
      ]
    ]
  ]
];
