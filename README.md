# animated

Short explainer animations, built as time-driven HTML pages and rendered to video.

## Push notifications on Android (Reels, 1080×1920, 60s)

`push-notification-android/push-notification-android.mp4` walks through how a push notification reaches an Android phone:

1. **Get a token**: the Firebase SDK registers the app with FCM and receives a registration token.
2. **Send it to your server**: the app uploads the token, and the backend stores it with the user's account.
3. **Server asks FCM**: the backend calls the FCM HTTP v1 API with the token and the message.
4. **FCM delivers it**: this goes over the single connection Google Play services keeps open for all apps. If the phone is offline, FCM queues the message until it reconnects.
5. **Android shows it**: in the background it goes straight to the notification tray. In the foreground it goes to `onMessageReceived()`. On Android 13+ the user must allow the `POST_NOTIFICATIONS` permission.

### Preview / re-render

- Open `push-notification-android/index.html` in a browser to watch it live. Click to pause, and use ←/→ to seek.
- Re-render the MP4 (needs ffmpeg with libx264 on `PATH`, or set `FFMPEG=/path/to/ffmpeg`):

```sh
npm install
python3 scripts/soundtrack.py push-notification-android/soundtrack.wav   # optional: regenerate audio
npm run render
```

`scripts/snapshots.mjs` grabs still frames at given times for quick review.

## Push notification untuk orang awam: Bahasa Indonesia (Remotion, Reels 1080×1920, 67s)

`push-notification-id/push-notification-id.mp4` retells the same story for non-technical viewers, in Bahasa Indonesia and a neobrutalist style. It uses a letter-and-post-office analogy:

| Analogi | Aslinya |
|---|---|
| Rumah | HP kamu |
| Toko (pengirim) | server aplikasi |
| Kantor Pos | Google FCM |
| Alamat | token |
| Jalur khusus kurir | koneksi Google Play services |

It is built with [Remotion](https://www.remotion.dev/). Scenes live in `push-notification-id/src/scenes.tsx`, and timing is set in `src/theme.ts`.

```sh
cd push-notification-id
npm install
npm run studio                                         # live preview / scrub
python3 scripts/soundtrack.py public/soundtrack.wav    # optional: regenerate audio
npm run render                                         # add --browser-executable=<chrome> if Remotion can't download one
```

## Risiko Claude untuk Google Workspace: Bahasa Indonesia (carousel, 10 slides 1080×1350)

`claude-workspace-risiko-id/slides/` holds 10 PNG slides for an Instagram/Threads carousel. They explain, in plain Indonesian, six risks of connecting Claude to Gmail, Drive, Docs and Calendar: broad access, prompt injection, actions (send/share/delete), confident mistakes, data leaving Google, and account takeover. A slide of safe habits follows. The style matches the neobrutalist push notification video. Ready-to-paste post text is in `claude-workspace-risiko-id/caption.md`.

Edit `claude-workspace-risiko-id/index.html`, then re-export:

```sh
npm install
node scripts/carousel.mjs claude-workspace-risiko-id/index.html claude-workspace-risiko-id/slides
```
