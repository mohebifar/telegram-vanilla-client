## Changelog (Round 4)

- Significant speed improvement by fixing a bug in creating message containers
- Concurrent file upload and downloads
- Improved photo and video preview quality
- Video streaming
- Fix sign up flow
- Add photo upload and cropper to sign up flow
- Auto download GIFs
- Fix issue with ESG panel getting closed after selecting GIF, Sticker or Emoji
- Improved Lottie animation initialization time
- Add indication for video vs. photo in share media tab
- Add video's duration, file size and download button to top left corner of video
- Add support for albums
- Add folders feature
- Fix a bug where uploading multiple files at once was failing at times
- Highlight keywords in search

## Changelog (Round 3)

- Upgraded API Layer to 114
- Fixed UI mismatch issues
- Faster file upload and download
- Fixed issue with uploading multiple files at once
- Fixed blinking issue when sending sticker, GIF, and files
- Fixed continous progress bar in shared media when no media exists
- Show chat's pinned message
- Show a spinner in light box for the first loaded image
- Show sticker set previews
- Change user in the right sidebar on dialog change
- Online user indicator on user's avatar in the dialog list
- Last sent message read check status in the dialog list
- Support for webp stickers on Safari
- Apple emojis
  - [x] Apple emojis will be downloaded only on devices that are not mac-like
- Keyboard events in media lightbox
- Messages that are purely 1-3 emojis, will be displayed without the bubble and with a bigger font size
- Basic mobile style
- Record and send voice message with Safari, Chrome, and Firefox support by including vorbis encoder
- Discovering featured stickers
- Search stickers both locally and from the Telegram API
- Add support for contact media
- Add support for rendering polls (Quiz, anonymous polls)
- Sending vote on polls and quizzes
- Search GIF (uses the @gif inline bot to do the search)
- Recent emojis (updated when a message is sent by scanning its content and extracting emojis)
- Support recent stickers
- Fixed video playback on Safari iOS
- Support sending polls

## Changelog (Round 2)

I continued improving the Telegram Client I'd developed for the first round. I wrote a babel plugin to mangle the code for defining the schema even more leading up to a much smaller bundle size.

The MTProto client is completely written from scratch in TypeScript and supports Layer 105 over WSS.

Total transferred size (JS, CSS, Icons, etc.): 142KB (gzipped)

Improvements in MTProto client since round 1:
- Faster factorizer algorithm
- Switched to Biginteger.js (instead of native BigInt) for better browser support
- Faster file downloads with better DC switch and caching auth keys for all DCs
- Separated UI thread from the complex logic by offloading the entire Telegram connection codes to a Web Worker.
- Babel plugin to mangle schema definition

Other improvements:
- Fully cache all messages, peers, dialogs, sticker set, and configs on IndexedDB (It currently defaults on using network, and this cache is used occasionally, but it can be later used to make the app offline compatible)
- Cache all downloaded files

Handling updates:
- Updates dialogs in the left sidebar with new messages
- Rearranges dialogs in the sidebar when new message is received
- Updates unread count when message is seen on another device
- Deletes message when delete update is received
- Marks message as read on read outbox
- Shows is typing status

Message media:
* Lightbox:
- Full implementation of media lightbox
- Playing video in lightbox
- Lightbox animation when media is opened from a chat
- Lightbox animation when navigating through media
- Lightbox animation for sender profile details
- Download media in lightbox
- Download progress indicator
* Audio
- Supports audio and voice playback
- Renders waveform for audio messages
- Download progress indicator
* Video
- Video playback in chat (muted)
- GIF playback
- Download progress indicator
* Files
- Download files with progress indicator
- Show file size
* Photo
- Displays photo in chat (m)
- Downloads higher rsolution in lightbox

Send message:
- Emoji picker
- Sticker picker and sending stickers from installed stickers
- Lazy loading sticker sets with infinite scroll
- GIF picker and sending GIFs from saved GIFs
- Lazy loading saved GIFs with infinite scroll
- Reply to a message
- Send continous "is typing" signal every 4500ms until finishing typing

Upload media and documents:
- Upload documents
- Upload media
- Upload modal for media and media preview
- Video thumbnail preview in upload modal
- Automatically resize and compress large photos before sending
- Upload modal for documents
- Upload progress indicator

Cosmetic improvements:
- Left sidebar navigation button animation (From menu to back button)
- Message bubble tail
- Showing spinners when loading chats and dialog lists
- Styles are fully compatible with RTL languages (Farsi, Arabic, Hebrew)

Left sidebar:
- Shows top peers before starting search
- Global search for messages and contacts
- Animated menu button

Right sidebar:
- Show profile details (about/bio, phone number, username, profile photo)
- Shared media (photos and videos) with infinite scroll
- Open light box from shared media with animation
- Shared links with infinite scroll
- Shared docs with infinite scroll (downloadable from the same panel)
- Shared audio with infinite scroll (downloadable and playable from the same panel)

Chat:
- Supports showing replied message
- Clicking on a replied message scrolls to the original message
- Supports showing forwarded messages
- Bi-directional loading for message history
- Loads chat from unread position
- Marks message as read when gets into view port
- Full message entity parsing support
- Partial support for translating all message service actions to text
- Context menu on bubble right click
* Copying a message
* Reply to a message