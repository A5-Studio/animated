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

## Data pipeline: ember vs pipa (Reels, 1080×1920, 52s, Bahasa Indonesia)

`data-pipeline-analogy/data-pipeline-analogy.mp4` explains data pipelines with a water analogy:

1. **Pembuka**: data itu seperti air, dan semua tim butuh setiap hari.
2. **Cara ember**: setiap kali butuh data, seseorang mengambilnya manual dari sungai.
3. **Masalah**: lambat, sering tumpah (data hilang atau salah), dan diulang terus.
4. **Cara pipa**: bangun sekali: Ambil (Extract) → Saring (Transform) → Simpan (Load) → Keran.
5. **Buka keran**: data siap kapan pun dibutuhkan.
6. **Perbandingan**: ember vs pipa, dari usaha awal sampai saat kebutuhan tumbuh.
7. **Penutup**: data pipeline = pipa untuk datamu.

This one is built with [Remotion](https://www.remotion.dev) (React):

```sh
cd data-pipeline-analogy
npm install
npm run dev                                   # Remotion Studio preview
npx remotion render DataPipelineAnalogy data-pipeline-analogy.mp4
```

### Neobrutalism version (TikTok safe area)

`data-pipeline-analogy/data-pipeline-analogy-brutal.mp4` tells the same story in a neobrutalist style: thick black outlines, hard offset shadows, flat colours, Space Grotesk. All text and illustrations sit inside the TikTok safe area, which at 1080×1920 is x 120–840, y 252–1280. The strip from y 252–360 may extend right to x 960. Only the dotted background reaches the edges. The source is in `src/brutal/`.

```sh
npx remotion render DataPipelineBrutal data-pipeline-analogy-brutal.mp4
# Preview with the safe area shaded in red:
npx remotion still DataPipelineBrutal check.png --frame=400 --props='{"showSafeArea":true}'
```
