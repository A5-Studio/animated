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

## Faqihpedia · TRIMS: Arti "pedia" (Remotion, Reels 1080×1920, 115.5s)

`faqihpedia-artipedia/faqihpedia-artipedia.mp4` explains where "-pedia" comes from (Greek *paideia*). It uses the same layout engine as `faqihpedia-22`, and it keeps the outro ("…boleh di-like dulu… Trims!").

It follows the **TRIMS (Trivia Makan Siang)** rules from the Faqihpedia segment kit:

- **Palette**: sambal orange `#FF8A3D`, egg-yolk yellow `#FFD600`, rice `#FFF6E8` and ink. Red, green and blue are left out because they belong to the other segments.
- **Motif**: an orange gingham "taplak warung" background.
- **Label**: a TRIMS badge with the plate logo in the top-left corner, without an episode number.
- **Fact card**: a yellow "LAUK HARI INI" card tilted 6°.
- **Sound**: a spoon-on-plate "ting" whenever a fact lands.
- **Fixed lines**: the opening line ("Bahan obrolan makan siang hari ini…") is shown on screen. The closing line ("Trims udah makan siang bareng. Besok lauk baru.") is on the end card, with the black "TRIVIA MAKAN SIANG · @faqihpedia" strip.

The edit also adds:

- **A tighter VO**: the dead air and the flubbed retake are removed, and pauses longer than 0.35s are cut down. `CUTS` in `src/theme.ts` lists where the source jumps.
- **Punch-ins**: each jump cut alternates between a wide framing and a 1.08× framing, with a slow push-in.
- **Swipe transitions**: a coloured, ink-edged band sweeps across at every layout change, together with a whoosh.
- **Captions for the whole video**: these are in `src/caps.ts`, generated from the word timings.
- **A quiet music bed**: an original lo-fi loop made by `scripts/music.py`.

| Time | Layout | Scene |
|---|---|---|
| 0–9.3 | `full` | hook: Ensiklopedia / Tokopedia / Wikipedia → "PEDIA = ?" |
| 9.3–21.2 | `anim` | Greek *paideia*, *pais/paidos* = anak-anak |
| 21.2–33.2 | `split` | -pedia ↔ dokter anak (pediatri) |
| 35.8–55.4 | `anim` | Ensiklopedia = pendidikan melingkar, A→Z |
| 55.4–68.2 | `split` | Wikipedia = pendidikan cepat |
| 68.2–86.1 | `anim` | Toko + (ensiklo)pedia = Tokopedia |
| 93.2–106.2 | `split` | sharing what I know |
| 106.2–end | `full` | like + "TRIMS!" |

```sh
cd faqihpedia-artipedia
npm install
cp <tightened clip>.mp4 public/source.mp4    # not committed
python3 scripts/music.py public/music.wav 117 # not committed, regenerate
npm run render -- --browser-executable=<chrome-headless-shell>
```
