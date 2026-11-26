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

## Spreadsheet Gym · Sesi 01 · 5 KG: Formula vs Function (Remotion, Reels 1080×1920, 65.9s)

`spreadsheet-gym-formula-vs-function/spreadsheet-gym.mp4` explains that a formula is anything that starts with `=`, while a function (`SUM`, `AVERAGE`, `VLOOKUP`) is a ready-made formula with a name and parentheses. Every function is used inside a formula, but not every formula uses a function. The script is in `script.md`.

It follows the Spreadsheet Gym identity from `brand/segment-kit.html` and `brand/segments.ts`:
- **Format:** warm-up (an office problem), a 10-second "pause dulu" countdown, the moves, a repetisi question, and the fixed cool-down line.
- **Look:** Sheets green with the 20 kg plate blue, a cell-grid background, the barbell-with-"fx" logo, and Space Mono for formulas.
- **Fixed elements:** the episode formula (`=SUM(A1:A5)`) always in the formula bar on top, and the `SESI 01 · 5 KG` label.
- **Sounds:** a coach whistle on the opening line and a ticking countdown.

There is no talking head. The VO is a voice clone made with [VoiceStudio](https://github.com/debpalash/VoiceStudio)'s OmniVoice engine (`k2-fsa/OmniVoice`) from a 5-second reference clip of Faqihpedia #27, running on CPU. "Spreadsheet" is spelled "Spredsit" in the VO text so the clone doesn't drag "sheet".

The explaining scenes use a spreadsheet window (`src/Sheet.tsx`): a formula bar with `fx`, a selected cell, colored range references and highlighted `=` / function names.

```sh
cd spreadsheet-gym-formula-vs-function
npm install
# one VO part per row of script.md, e.g.
omnivoice-infer --model k2-fsa/OmniVoice --ref_audio ref.wav --ref_text "<words in ref.wav>" --text "<VO line>" --output 01.wav
python3 scripts/build_vo.py --pause-after 4 10.4 01.wav … 10.wav   # joins, adds the countdown pause, normalizes to -14 LUFS, writes src/timing.ts
python3 scripts/whistle.py public/sfx/whistle.wav                   # optional: regenerate the coach whistle
npm run render -- --browser-executable=<chrome-headless-shell>
```

Scene timing is cued to words in the VO (`cue(part, word)` in `src/theme.ts`), so the edit follows a regenerated VO without manual retiming. The episode number, weight and main formula are `EPISODE` and `MAIN_FORMULA` in `src/theme.ts`.
