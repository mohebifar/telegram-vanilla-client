export class RPCError extends Error {
  constructor(
    public message: RPCErrorMessages | string,
    public code: number = null
  ) {
    super(`RPCError ${code} ${message}`);
    this.code = code;
    this.message = message;
  }
}

export class FloodWaitError extends Error {
  constructor(public seconds: number = null) {
    super(`RPCError: A wait of ${seconds}s is required`);
    this.seconds = seconds;
  }
}

export class InvalidBufferError extends Error {
  constructor(buffer: Uint8Array) {
    super(`Invalid buffer error: ${buffer.length}`);
  }
}

export class TypeNotFoundError extends Error {
  constructor(constructorId?: number) {
    super(
      `Unknown constructor type ${constructorId && constructorId.toString(16)}`
    );
  }
}

export class SecurityError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

type RPCErrorMessages =
  | "ABOUT_TOO_LONG"
  | "ACCESS_TOKEN_EXPIRED"
  | "ACCESS_TOKEN_INVALID"
  | "ACTIVE_USER_REQUIRED"
  | "ADMINS_TOO_MUCH"
  | "ADMIN_RANK_EMOJI_NOT_ALLOWED"
  | "ADMIN_RANK_INVALID"
  | "API_ID_INVALID"
  | "API_ID_PUBLISHED_FLOOD"
  | "ARTICLE_TITLE_EMPTY"
  | "AUTH_BYTES_INVALID"
  | "AUTH_KEY_DUPLICATED"
  | "AUTH_KEY_INVALID"
  | "AUTH_KEY_PERM_EMPTY"
  | "AUTH_KEY_UNREGISTERED"
  | "AUTH_RESTART"
  | "BANNED_RIGHTS_INVALID"
  | "BOTS_TOO_MUCH"
  | "BOT_CHANNELS_NA"
  | "BOT_GROUPS_BLOCKED"
  | "BOT_INLINE_DISABLED"
  | "BOT_INVALID"
  | "BOT_METHOD_INVALID"
  | "BOT_MISSING"
  | "BOT_PAYMENTS_DISABLED"
  | "BOT_POLLS_DISABLED"
  | "BROADCAST_ID_INVALID"
  | "BUTTON_DATA_INVALID"
  | "BUTTON_TYPE_INVALID"
  | "BUTTON_URL_INVALID"
  | "CALL_ALREADY_ACCEPTED"
  | "CALL_ALREADY_DECLINED"
  | "CALL_OCCUPY_FAILED"
  | "CALL_PEER_INVALID"
  | "CALL_PROTOCOL_FLAGS_INVALID"
  | "CDN_METHOD_INVALID"
  | "CHANNELS_ADMIN_PUBLIC_TOO_MUCH"
  | "CHANNELS_TOO_MUCH"
  | "CHANNEL_INVALID"
  | "CHANNEL_PRIVATE"
  | "CHANNEL_PUBLIC_GROUP_NA"
  | "CHAT_ABOUT_NOT_MODIFIED"
  | "CHAT_ABOUT_TOO_LONG"
  | "CHAT_ADMIN_INVITE_REQUIRED"
  | "CHAT_ADMIN_REQUIRED"
  | "CHAT_FORBIDDEN"
  | "CHAT_ID_EMPTY"
  | "CHAT_ID_INVALID"
  | "CHAT_INVALID"
  | "CHAT_LINK_EXISTS"
  | "CHAT_NOT_MODIFIED"
  | "CHAT_RESTRICTED"
  | "CHAT_SEND_GIFS_FORBIDDEN"
  | "CHAT_SEND_INLINE_FORBIDDEN"
  | "CHAT_SEND_MEDIA_FORBIDDEN"
  | "CHAT_SEND_STICKERS_FORBIDDEN"
  | "CHAT_TITLE_EMPTY"
  | "CHAT_WRITE_FORBIDDEN"
  | "CODE_EMPTY"
  | "CODE_HASH_INVALID"
  | "CODE_INVALID"
  | "CONNECTION_API_ID_INVALID"
  | "CONNECTION_DEVICE_MODEL_EMPTY"
  | "CONNECTION_LANG_PACK_INVALID"
  | "CONNECTION_LAYER_INVALID"
  | "CONNECTION_NOT_INITED"
  | "CONNECTION_SYSTEM_EMPTY"
  | "CONTACT_ID_INVALID"
  | "DATA_INVALID"
  | "DATA_JSON_INVALID"
  | "DATE_EMPTY"
  | "DC_ID_INVALID"
  | "DH_G_A_INVALID"
  | "EMAIL_HASH_EXPIRED"
  | "EMAIL_INVALID"
  | "EMOTICON_EMPTY"
  | "ENCRYPTED_MESSAGE_INVALID"
  | "ENCRYPTION_ALREADY_ACCEPTED"
  | "ENCRYPTION_ALREADY_DECLINED"
  | "ENCRYPTION_DECLINED"
  | "ENCRYPTION_ID_INVALID"
  | "ENCRYPTION_OCCUPY_FAILED"
  | "ENTITIES_TOO_LONG"
  | "ENTITY_MENTION_USER_INVALID"
  | "ERROR_TEXT_EMPTY"
  | "EXPORT_CARD_INVALID"
  | "EXTERNAL_URL_INVALID"
  | "FIELD_NAME_EMPTY"
  | "FIELD_NAME_INVALID"
  | "FILE_ID_INVALID"
  | "FILE_PARTS_INVALID"
  | "FILE_PART_0_MISSING"
  | "FILE_PART_EMPTY"
  | "FILE_PART_INVALID"
  | "FILE_PART_LENGTH_INVALID"
  | "FILE_PART_SIZE_INVALID"
  | "FILEREF_UPGRADE_NEEDED"
  | "FIRSTNAME_INVALID"
  | "FOLDER_ID_EMPTY"
  | "FOLDER_ID_INVALID"
  | "FRESH_RESET_AUTHORISATION_FORBIDDEN"
  | "GIF_ID_INVALID"
  | "GROUPED_MEDIA_INVALID"
  | "HASH_INVALID"
  | "HISTORY_GET_FAILED"
  | "IMAGE_PROCESS_FAILED"
  | "INLINE_RESULT_EXPIRED"
  | "INPUT_CONSTRUCTOR_INVALID"
  | "INPUT_FETCH_ERROR"
  | "INPUT_FETCH_FAIL"
  | "INPUT_LAYER_INVALID"
  | "INPUT_METHOD_INVALID"
  | "INPUT_REQUEST_TOO_LONG"
  | "INPUT_USER_DEACTIVATED"
  | "INVITE_HASH_EMPTY"
  | "INVITE_HASH_EXPIRED"
  | "INVITE_HASH_INVALID"
  | "LANG_PACK_INVALID"
  | "LASTNAME_INVALID"
  | "LIMIT_INVALID"
  | "LINK_NOT_MODIFIED"
  | "LOCATION_INVALID"
  | "MAX_ID_INVALID"
  | "MAX_QTS_INVALID"
  | "MD5_CHECKSUM_INVALID"
  | "MEDIA_CAPTION_TOO_LONG"
  | "MEDIA_EMPTY"
  | "MEDIA_INVALID"
  | "MEDIA_NEW_INVALID"
  | "MEDIA_PREV_INVALID"
  | "MEGAGROUP_ID_INVALID"
  | "MEGAGROUP_PREHISTORY_HIDDEN"
  | "MEMBER_NO_LOCATION"
  | "MEMBER_OCCUPY_PRIMARY_LOC_FAILED"
  | "MESSAGE_AUTHOR_REQUIRED"
  | "MESSAGE_DELETE_FORBIDDEN"
  | "MESSAGE_EDIT_TIME_EXPIRED"
  | "MESSAGE_EMPTY"
  | "MESSAGE_IDS_EMPTY"
  | "MESSAGE_ID_INVALID"
  | "MESSAGE_NOT_MODIFIED"
  | "MESSAGE_TOO_LONG"
  | "MSG_WAIT_FAILED"
  | "MT_SEND_QUEUE_TOO_LONG"
  | "NEED_CHAT_INVALID"
  | "NEED_MEMBER_INVALID"
  | "NEW_SALT_INVALID"
  | "NEW_SETTINGS_INVALID"
  | "OFFSET_INVALID"
  | "OFFSET_PEER_ID_INVALID"
  | "OPTIONS_TOO_MUCH"
  | "PACK_SHORT_NAME_INVALID"
  | "PACK_SHORT_NAME_OCCUPIED"
  | "PARTICIPANTS_TOO_FEW"
  | "PARTICIPANT_CALL_FAILED"
  | "PARTICIPANT_VERSION_OUTDATED"
  | "PASSWORD_EMPTY"
  | "PASSWORD_HASH_INVALID"
  | "PASSWORD_REQUIRED"
  | "PAYMENT_PROVIDER_INVALID"
  | "PEER_FLOOD"
  | "PEER_ID_INVALID"
  | "PEER_ID_NOT_SUPPORTED"
  | "PERSISTENT_TIMESTAMP_EMPTY"
  | "PERSISTENT_TIMESTAMP_INVALID"
  | "PERSISTENT_TIMESTAMP_OUTDATED"
  | "PHONE_CODE_EMPTY"
  | "PHONE_CODE_EXPIRED"
  | "PHONE_CODE_HASH_EMPTY"
  | "PHONE_CODE_INVALID"
  | "PHONE_NUMBER_APP_SIGNUP_FORBIDDEN"
  | "PHONE_NUMBER_BANNED"
  | "PHONE_NUMBER_FLOOD"
  | "PHONE_NUMBER_INVALID"
  | "PHONE_NUMBER_OCCUPIED"
  | "PHONE_NUMBER_UNOCCUPIED"
  | "PHONE_PASSWORD_FLOOD"
  | "PHONE_PASSWORD_PROTECTED"
  | "PHOTO_CONTENT_URL_EMPTY"
  | "PHOTO_CROP_SIZE_SMALL"
  | "PHOTO_EXT_INVALID"
  | "PHOTO_INVALID"
  | "PHOTO_INVALID_DIMENSIONS"
  | "PHOTO_SAVE_FILE_INVALID"
  | "PHOTO_THUMB_URL_EMPTY"
  | "PIN_RESTRICTED"
  | "POLL_OPTION_DUPLICATE"
  | "POLL_UNSUPPORTED"
  | "PRIVACY_KEY_INVALID"
  | "PTS_CHANGE_EMPTY"
  | "QUERY_ID_EMPTY"
  | "QUERY_ID_INVALID"
  | "QUERY_TOO_SHORT"
  | "RANDOM_ID_DUPLICATE"
  | "RANDOM_ID_INVALID"
  | "RANDOM_LENGTH_INVALID"
  | "RANGES_INVALID"
  | "REACTION_EMPTY"
  | "REACTION_INVALID"
  | "REG_ID_GENERATE_FAILED"
  | "REPLY_MARKUP_INVALID"
  | "REPLY_MARKUP_TOO_LONG"
  | "RESULT_ID_DUPLICATE"
  | "RESULT_TYPE_INVALID"
  | "RESULTS_TOO_MUCH"
  | "RIGHT_FORBIDDEN"
  | "RPC_CALL_FAIL"
  | "RPC_MCGET_FAIL"
  | "RSA_DECRYPT_FAILED"
  | "SCHEDULE_DATE_TOO_LATE"
  | "SCHEDULE_TOO_MUCH"
  | "SEARCH_QUERY_EMPTY"
  | "SECONDS_INVALID"
  | "SEND_MESSAGE_MEDIA_INVALID"
  | "SEND_MESSAGE_TYPE_INVALID"
  | "SESSION_EXPIRED"
  | "SESSION_PASSWORD_NEEDED"
  | "SESSION_REVOKED"
  | "SHA256_HASH_INVALID"
  | "SHORTNAME_OCCUPY_FAILED"
  | "START_PARAM_EMPTY"
  | "START_PARAM_INVALID"
  | "STICKERSET_INVALID"
  | "STICKERS_EMPTY"
  | "STICKER_EMOJI_INVALID"
  | "STICKER_FILE_INVALID"
  | "STICKER_ID_INVALID"
  | "STICKER_INVALID"
  | "STICKER_PNG_DIMENSIONS"
  | "STORAGE_CHECK_FAILED"
  | "STORE_INVALID_SCALAR_TYPE"
  | "TAKEOUT_INVALID"
  | "TAKEOUT_REQUIRED"
  | "TEMP_AUTH_KEY_EMPTY"
  | "Timeout"
  | "TMP_PASSWORD_DISABLED"
  | "TOKEN_INVALID"
  | "TTL_DAYS_INVALID"
  | "TYPES_EMPTY"
  | "TYPE_CONSTRUCTOR_INVALID"
  | "UNKNOWN_METHOD"
  | "UNTIL_DATE_INVALID"
  | "URL_INVALID"
  | "USERNAME_INVALID"
  | "USERNAME_NOT_MODIFIED"
  | "USERNAME_NOT_OCCUPIED"
  | "USERNAME_OCCUPIED"
  | "USERS_TOO_FEW"
  | "USERS_TOO_MUCH"
  | "USER_ADMIN_INVALID"
  | "USER_ALREADY_PARTICIPANT"
  | "USER_BANNED_IN_CHANNEL"
  | "USER_BLOCKED"
  | "USER_BOT"
  | "USER_BOT_INVALID"
  | "USER_BOT_REQUIRED"
  | "USER_CHANNELS_TOO_MUCH"
  | "USER_CREATOR"
  | "USER_DEACTIVATED"
  | "USER_DEACTIVATED_BAN"
  | "USER_ID_INVALID"
  | "USER_INVALID"
  | "USER_IS_BLOCKED"
  | "USER_IS_BOT"
  | "USER_KICKED"
  | "USER_NOT_MUTUAL_CONTACT"
  | "USER_NOT_PARTICIPANT"
  | "USER_PRIVACY_RESTRICTED"
  | "USER_RESTRICTED"
  | "VIDEO_CONTENT_TYPE_INVALID"
  | "WALLPAPER_FILE_INVALID"
  | "WALLPAPER_INVALID"
  | "WC_CONVERT_URL_INVALID"
  | "WEBPAGE_CURL_FAILED"
  | "WEBPAGE_MEDIA_EMPTY"
  | "WORKER_BUSY_TOO_LONG_RETRY"
  | "YOU_BLOCKED_USER";
