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

## Faqihpedia · Yang Penting Ngomong #9 (Remotion, Reels 1080×1920, 77.8s)

`faqihpedia-09/faqihpedia-09.mp4` is built the same way as `faqihpedia-22`. The topic is judging people on a 0–100 scale: start everyone at 50, then let what they do move them. The clip is cut right before the outro ("Mungkin itu aja sih video ke-9…" at 77.9s).

New in this one:

- **Punch-in zooms** on the full-frame talking head (`ZOOMS` in `src/theme.ts`), each with a `zoom` swish.
- **Wipe transition**: a slanted color band sweeps across when the layout cuts to or from `anim`.
- Two more sounds in `scripts/sfx.py`: `zoom` and `buzz` (for the wrong spots on the scale).

| Time | Layout | Scene |
|---|---|---|
| 16.4–25.3 | `split` | people waiting to be placed on a line |
| 25.3–37.8 | `anim` | 0 = really bad, 100 = really good, nobody is either |
| 41.4–57.9 | `split` | start at 50, slide right for good deeds, left for bad |
| 61.9–end | `anim` | new people: not too far right (too trusting), not too far left (paranoid) |

```sh
cd faqihpedia-09
npm install
cp <original clip>.mp4 public/source.mp4    # not committed; trimmed to 0–78s is enough
python3 scripts/sfx.py public/sfx            # optional: regenerate sound effects
npm run render -- --browser-executable=<chrome-headless-shell>
```

## Faqihpedia · Yang Penting Ngomong #9, cut-out edition (Remotion, Reels 1080×1920, 77.8s)

`faqihpedia-09-cutout/faqihpedia-09-cutout.mp4` is the same clip and the same cut as `faqihpedia-09`, in a different style: dark neon, Inter type, and kinetic headlines. In the four explainer scenes the person is **cut out of the room** and stands in front of the animation. Giant type sits behind them and the scale and chips sit in front.

- **Matte**: `scripts/matte.py` runs [Robust Video Matting](https://github.com/PeterL1n/RobustVideoMatting) (`rvm_mobilenetv3_fp32.onnx`) on CPU and writes a grayscale matte. ffmpeg merges it with the clip into `public/person.webm` (VP9 with alpha).
- **Transition**: a glowing scan line sweeps the room away top-down, then the person shrinks into their scene pose. Going back, they grow first, then the room scans back in.
- Layout schedule is `LAYOUT` in `src/theme.ts`. Scenes and per-scene poses are in `src/scenes.tsx`.

| Time | Scene |
|---|---|
| 16.4–25.3 | "SKALA" behind the person, the scale draws in |
| 25.3–37.8 | giant 0 and 100 behind, "Nggak ada!", "Manusia itu kompleks" |
| 41.4–57.9 | live giant score behind (50 → 85 → 25), marker on the scale |
| 61.9–end | new people: marker at 50, ghosts drift right and left |

```sh
cd faqihpedia-09-cutout
npm install
cp <original clip>.mp4 public/source.mp4                       # not committed
pip install onnxruntime numpy                                   # once
python3 scripts/matte.py rvm_mobilenetv3_fp32.onnx public/source.mp4 alpha.mp4 77.8
ffmpeg -i public/source.mp4 -i alpha.mp4 -t 77.8 -filter_complex "[0:v][1:v]alphamerge,format=yuva420p" \
  -c:v libvpx-vp9 -b:v 0 -crf 30 -deadline good -cpu-used 5 -row-mt 1 -an public/person.webm
npm run render -- --browser-executable=<chrome-headless-shell>
```
