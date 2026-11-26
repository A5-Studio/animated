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

## TRIMS EPS 2 · Asal nama Claude (Remotion, Reels 1080×1920, ~138.6s)

`trims-eps2-claude/trims-eps2-claude.mp4` is the second TRIMS (Trivia Makan Siang) episode. It uses the same template as TRIMS episode 1 (`faqihpedia-artipedia` on branch `claude/busy-carson-6bpe0t`): gingham background, TRIMS badge, morphing full/split/anim layouts, captions, spoon "ting" on facts, music bed, the 3s bumper after the hook, and the end card.

Topic: Anthropic never officially said where the name Claude comes from, but forums believe it comes from Claude Shannon (bit, the Theseus maze mouse from 1951, meeting Alan Turing at Bell Labs).

`public/source.mp4` (not committed) is the tightened talking-head cut from three takes (`IMG_5135.MOV` plus two `IMG_5115.mov` inserts in the Drive folder TRIMS/EPS 2):

- the pauses are cut down to at most ~0.3s
- the voice is cleaned up: high-pass, FFT denoise, EQ (−2.5 dB at 220 Hz, +2.5 dB at 3.2 kHz), de-esser, compressor and a soft gate
- the final mix is normalized to −14 LUFS by `scripts/splice.sh`

Images: `public/img/claude-logo.png` and `public/img/bell-labs.jpg` come from the Drive folder. The Shannon, Turing and 1948 paper images come from `trims/menu-001` (branch `claude/busy-keller-8bt82y`).

```sh
cd trims-eps2-claude
npm install
python3 scripts/music.py public/music.wav 135.6
npx remotion render TrimsEps2 main.mp4 --browser-executable=<chrome-headless-shell>
scripts/splice.sh main.mp4 trims-eps2-claude.mp4 3.7   # bumper after the hook line, then -14 LUFS
```

The cover is `trims-eps2-claude/thumbnail.png` (the `Thumbnail` still in `src/Thumbnail.tsx`, rendered with `npx remotion still Thumbnail thumbnail.png`). It follows the episode 1 cover rules, and its photo is the raised-brow frame at 1.4s (`public/thumb-frame.jpg`).

## AI (An Info) · Asal nama Claude (Remotion, Reels 1080×1920, ~131s)

`aninfo-claude-shannon/aninfo-claude-shannon.mp4` is the TRIMS EPS 2 story (`trims-eps2-claude`) re-edited in the AI (An Info) segment look from `faqihpedia-askmaps` (branch `claude/loving-bohr-odpu6a`) and the "AI (An Info): Segment Standard" doc. The content and its order are unchanged, so it runs 2:11, past the standard's 50–65 s. The look follows the standard:

- cream paper with soft white cards, Newsreader serif headlines and Inter for UI text
- real photos as the hero, one blue accent per scene, and amber rings on the word being said
- grey caption pills of at most 22 characters (`scripts/captions.py`, with a fix list for misheard names)
- the "AI · An Info" mark on the hook and the cover
- very quiet SFX, no music bed, no bumper

Deviations, all so that nothing important sits under the platform UI. TikTok, Reels and Shorts cover the bottom ~660 px and a ~120 px column on the right.

- **Split:** the talking head is a rounded card at 0.53×, showing source rows 400–1532 (the whole head) at y 770–1370, with the mouth at about y 1250. The visual is scaled to 0.84 into y ~220–745, and the caption sits on the seam at y 735.
- **Anim:** scenes are scaled to 0.78 into y ~250–1210, with the caption at y 1245.
- **Full:** the frame is 1.1× and shifted up (rows 180–1925), so the mouth sits at about y 1230. The caption is above the head at y 330.

`public/source.mp4` (not committed) is the same file as `trims-eps2-claude/public/source.mp4`.

```sh
cd aninfo-claude-shannon
npm install
ln ../trims-eps2-claude/public/source.mp4 public/source.mp4            # a hard link; Remotion does not serve symlinks
python3 scripts/captions.py scripts/transcript.json src/captions.ts    # transcript = faster-whisper on source.mp4
npx remotion render AnInfoClaude main.mp4 --browser-executable=<chrome-headless-shell>
# then a two-pass loudnorm to -14 LUFS (same as trims-eps2-claude/scripts/splice.sh, without the bumper)
npx remotion still Thumbnail thumbnail/cover.png
```

## Alternative Reference · Asal nama Claude (Remotion, Reels 1080×1920, ~131s)

`altref-claude-shannon/altref-claude-shannon.mp4` is the same cut as `trims-eps2-claude`, restyled after the clip in Drive "TRIMS/EPS 2/Alternative Reference". The look:

- light grey grid paper with white UI cards, each with a header row (icon, bold label and a mono "url" chip)
- big counting numbers, a sparkline, and mono uppercase pills (red, blue, green, ink) plus pink keycaps
- a talking-head card whose **head pops out over the card's top edge**
- word-by-word karaoke captions (`scripts/karaoke.py`), with a box on the word being said

Everything that matters stays above the platform UI, which covers the bottom ~660 px. The mouth sits at about y 1154 and the captions at y 1222. The reference puts captions on the chest, so this layout departs from it there.

- **Pop-out:** `public/person.webm` (not committed) is the talking head with an alpha matte from Robust Video Matting. Use `scripts/matte.py` from `faqihpedia-09-cutout` on branch `claude/faqihpedia-09-edit`, then:
  `ffmpeg -i public/source.mp4 -i alpha.mp4 -filter_complex "[0:v]scale=778:1382[v];[1:v]scale=778:1382,format=gray[a];[v][a]alphamerge,format=yuva420p" -c:v libvpx-vp9 -b:v 0 -crf 32 -an public/person.webm`
- **Decoder:** it is played with `Html5Video`, because Remotion's compositor drops VP9 alpha ("not transparent, BGR24") and only the browser decoder keeps it.

```sh
cd altref-claude-shannon
npm install
ln ../trims-eps2-claude/public/source.mp4 public/source.mp4
python3 scripts/karaoke.py scripts/transcript.json src/karaoke.ts
npx remotion render AltRefClaude main.mp4 --browser-executable=<chrome-headless-shell> --concurrency=2
# then a two-pass loudnorm to -14 LUFS
```
