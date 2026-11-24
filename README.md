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

## Faqihpedia · Anak Penasaran, hari ke-27 (Remotion, Reels 1080×1920, 88.5s)

`faqihpedia-27/faqihpedia-27.mp4` takes a talking-head clip and adds neobrutalist illustrations in the same style as `push-notification-id`. The clip is cut right before the outro ("Itu aja video ke-27…").

The single video layer morphs between three layouts. The schedule is `LAYOUT` in `src/theme.ts`:

| Layout | What you see |
|---|---|
| `full` | talking head fills the frame, with stickers above the face |
| `split` | illustration on top, cropped talking head on the bottom |
| `anim` | illustration only; the voice keeps playing with our own captions |

Scenes are in `src/scenes.tsx`. Each one is timed to the transcript in absolute seconds. Subtle sound effects (`src/sfx.tsx`) sit on the same cue times; the sounds come from `scripts/sfx.py`.

```sh
cd faqihpedia-27
npm install
cp <original clip>.mp4 public/source.mp4    # not committed; trimmed to 0–89.5s is enough
python3 scripts/sfx.py public/sfx            # optional: regenerate sound effects
npm run render -- --browser-executable=<chrome-headless-shell>
```

## Faqihpedia · Yang Penting Ngomong #22 (Remotion, Reels 1080×1920, 72.8s)

`faqihpedia-22/faqihpedia-22.mp4` is built the same way as `faqihpedia-27` (same layout engine, palette and sound effects). The topic is "pengalaman kerja ≠ durasi kerja", a line from the GJLS podcast with Anies Baswedan. The clip is cut right before the outro ("Mungkin itu saja video ke-22…" at 73.0s).

| Time | Layout | Scene |
|---|---|---|
| 3.3–12.0 | `anim` | source: GJLS thumbnail (`public/gjls.jpg`) + the quote |
| 16.0–27.4 | `split` | years on the job, still confused |
| 27.4–40.6 | `anim` | the sharp one: dropped into a new field, gets A to Z |
| 45.8–51.3 | `anim` | years go up, learning stays at zero |
| 51.3–63.3 | `split` | learn as much as you can |
| 63.3–end | `anim` | same years, more learned |

```sh
cd faqihpedia-22
npm install
cp <original clip>.mp4 public/source.mp4    # not committed; trimmed to 0–73.5s is enough
npm run render -- --browser-executable=<chrome-headless-shell>
```

## Faqihpedia · Ask Maps (Remotion, Reels 1080×1920, 60.3s)

`faqihpedia-askmaps/faqihpedia-askmaps.mp4` shows how finding a café used to work in Google Maps and how it works now with **Ask Maps**, Google Maps' AI feature. The look follows a clean editorial reference: cream paper, soft white cards, serif headlines and short grey caption pills.

- **Dead air is cut.** `scripts/cut.py` drops every pause of 0.28s or longer (keeping 0.1s on each side), keeps only the third, clean outro take, and tone-maps the iPhone HLG footage to SDR. The 78.6s of raw speech becomes 60.3s.
- **The old way is animated.** There is no screen recording of it, so it is drawn as a map. You search "cafe dekat Blok M", pins drop, then you open places one by one: the stars, the review count, the comments and the menu are each highlighted as they're mentioned.
- **The new way uses the real screen recording.** `scripts/screen.py` cuts it into the typed prompt (sped up, with a notification skipped) and the answer, which is shown in a phone frame.

| Time | Layout | Scene |
|---|---|---|
| 0–4.4 | `split` | hook: "AI benar-benar mengubah keseharian kita" |
| 4.4–20.0 | `split` | the old way, animated |
| 20.0–22.3 | `full` | "tapi sekarang dengan AI udah berubah banget" |
| 22.3–26.8 | `anim` | Google Maps → **Ask Maps** title |
| 26.8–43.7 | `split` | typing the prompt + criteria chips (≤2 km, matcha ceremonial, 500+ reviews, >4.7) |
| 43.7–49.5 | `anim` | the answer: Matcha Times Blok M |
| 49.5–54.9 | `split` | before vs now |
| 54.9–end | `full` | outro + "Like dulu, ya" |

```sh
cd faqihpedia-askmaps
npm install
python3 scripts/cut.py <IMG_5077.MOV> public/source.mp4 scripts/cuts.json      # not committed
python3 scripts/screen.py <ScreenRecording.mp4> public/                         # ask_typing.mp4, ask_result.mp4
python3 scripts/captions.py scripts/transcript.json src/captions.ts             # transcript = faster-whisper on source.mp4
npm run render -- --browser-executable=<chrome-headless-shell>
```
