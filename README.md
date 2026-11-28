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

## Spreadsheet Gym · Sesi 01: Formula vs Function (Remotion, Reels 1080×1920, 65.9s)

`spreadsheet-gym-formula-vs-function/spreadsheet-gym.mp4` explains that a formula is anything that starts with `=`, while a function (`SUM`, `AVERAGE`, `VLOOKUP`) is a ready-made formula with a name and parentheses. Every function is used inside a formula, but not every formula uses a function. The script is in `script.md`.

It follows the Spreadsheet Gym identity from `brand/segment-kit.html` and `brand/segments.ts`:
- **Format:** warm-up (an office problem), a 5-second "pause dulu" countdown, the moves, a repetisi question, the cool-down line, and a share & follow CTA.
- **Look:** Sheets green with the 20 kg plate blue, a cell-grid background, the barbell-with-"fx" logo, and Space Mono for formulas.
- **Fixed elements:** the episode formula (`=SUM(A1:A5)`) always in the formula bar on top, and the `SESI 01` label (no weight line in this episode).
- **Sounds:** a coach whistle on the opening line and a ticking countdown.

There is no talking head. The VO is a voice clone made with [VoiceStudio](https://github.com/debpalash/VoiceStudio)'s OmniVoice engine (`k2-fsa/OmniVoice`) from a 5-second reference clip of Faqihpedia #27, running on CPU. English words are spelled so the clone says them in English ("Spredsit", "dambel", "Pos" for pause), formulas are read with Indonesian numbers, and the VO runs at 0.93× speed. Every sentence is its own clip, picked from several takes by pitch: questions need a rising end, exclamations a lively range, statements a firm falling end, and a dragged last syllable is penalized.

The explaining scenes use a spreadsheet window (`src/Sheet.tsx`): a formula bar with `fx`, a selected cell, colored range references and highlighted `=` / function names.

```sh
cd spreadsheet-gym-formula-vs-function
npm install
# one VO part per row of script.md, e.g.
omnivoice-infer --model k2-fsa/OmniVoice --ref_audio ref.wav --ref_text "<words in ref.wav>" --text "<VO line>" --output 01.wav
python3 scripts/build_vo.py --pause-after 4 5.4 01.wav … 11.wav   # joins, adds the countdown pause, normalizes to -14 LUFS, writes src/timing.ts
python3 scripts/whistle.py public/sfx/whistle.wav                   # optional: regenerate the coach whistle
npm run render -- --browser-executable=<chrome-headless-shell>
```

The cover is `thumbnail.png` (the `Thumbnail` still in `src/Thumbnail.tsx`). It uses the same rules and geometry as the TRIMS cover (`trims-eps2-claude/src/Thumbnail.tsx`), which already respects the safe area: the SAFE box is x 60–940, y 285–1500. It has the segment motif and label on top, a 5-word title, a tilted card on the panel edge, a real video frame from y 690 down to the black series strip, and the strip itself. This segment has no face, so the frame is the warm-up question at 18.1 s (`public/thumb-frame.png`), placed so the question stickers end inside y 1500. The cover must not give away the answer. `thumbnail-safe-area-check.png` shows the SAFE box and the platform overlays. Render with `npx remotion still Thumbnail thumbnail.png` and `npx remotion still ThumbnailSafeCheck thumbnail-safe-area-check.png`.

**Safe area:** this uses the same box as TRIMS and AI (An Info): everything that matters stays inside x 60–940, y 285–1500 (`SAFE` in `src/theme.ts`), centered on x 500 so the right-side buttons stay clear. Scenes are drawn on the full 1080-wide canvas and scaled by 0.75 into the box (`STAGE`). The header row (segment chip + formula bar) sits at the top of the box and the captions sit just above y 1500. Only the grid background and the black strip extend outside the box. `safe-area-check.png` shows 11 frames with the box (orange) and the platform UI (red).

Scene timing is cued to words in the VO (`cue(part, word)` in `src/theme.ts`), so the edit follows a regenerated VO without manual retiming. The episode number, weight and main formula are `EPISODE` and `MAIN_FORMULA` in `src/theme.ts`.

## Spreadsheet Gym · Sesi 02: ARRAYFORMULA (Remotion, Reels 1080×1920, 112.5s)

`spreadsheet-gym-arrayformula/spreadsheet-gym-sesi-02.mp4` shows how one ARRAYFORMULA fills a whole column, how to fix the empty-row trap with `IF`, and the Excel equivalent, and ends with a practice question about a discount.

- **Script and storyboard:** `script.md` has delivery marks for recording the VO yourself (↗ rising, ↘ firm ending, `|` short pause). `storyboard.png` draws the planned 12 panels inside the shared safe area. Its source is `storyboard/storyboard.html`.
- **Edit:** the video is cut from the self-recorded VO: 17 clips from Drive (`Spreadsheet Gym - EPS 2 - *.m4a`), one scene per clip, in script order. The recordings depart from the script in places (a different hook and bumper line, "atau error kalau pakai fungsi lain", "berbarengan sama fungsi lain", and a like/save/share/follow CTA), and the scenes follow what was actually said.
- **Audio:** `scripts/clean_vo.py` cleans every clip the same way so they sound like one take. It starts with spectral noise reduction (noisereduce, 80%, with a noise profile from each clip's quietest frames), which lowers the noise floor from about -30 dB to about -55 dB. Then come an 80 Hz high-pass, light FFT denoise, +2 dB presence, gentle compression, two-pass loudnorm to -16 LUFS, a gentle gate that turns pauses longer than 150 ms down 18 dB, and 1.07× speed (`atempo` keeps the pitch). It also cuts silence: leading and trailing silence goes, and pauses inside a clip are shortened to 0.22 s. `scripts/trim_tails.py` cuts anything more than 0.2 s after the last spoken word, using Whisper word timestamps; that removes breaths or room sound the level-based cut keeps (3.6 s after "narik data lagi"). `scripts/build_vo.py` then joins the clips with 0.18 s gaps, adds the 3-second "pause dulu" silence, normalizes the mix to -14 LUFS and writes `src/timing.ts` (word timestamps).
- **Video:** the scenes (`src/scenes.tsx`) reuse the Sesi 01 components and the shared safe area (`safe-area-check.png`). Each big sheet slides in at full size with a fade (`slideIn`), and the direction rotates through left, right and bottom. The formula bar on top asks "1 formula, semua data terisi?" until the answer is said, then shows `=ARRAYFORMULA(B2:B*C2:C)`. The practice sheet types `=ARRAYFORMULA(B2:B*C2:C)` piece by piece on the spoken words, fills column D on "enter", and drops row 501 in to show new data being filled.

The cover (`thumbnail.png`, the `Thumbnail` still) uses the Sesi 01 cover rules: TRIMS cover geometry, the SAFE box x 60–940, y 285–1500, no face, and no answer. The title is "Masih narik formula / tiap data baru?!", and the panel shows the problem frame at 26.3 s (row 501 with an empty total), cropped below the header row so `=ARRAYFORMULA` never shows. `thumbnail-safe-area-check.png` shows the overlays.

```sh
cd spreadsheet-gym-arrayformula
npm install
python3 scripts/clean_vo.py <clean dir> Intro.m4a Bumper.m4a "Bos Kirim Data.m4a" …   # 17 clips in script order
python3 scripts/trim_tails.py <clean dir>/*.wav
GAP=0.18 python3 scripts/build_vo.py --pause-after 6 3.2 <clean dir>/{01..17}.wav
npm run render -- --browser-executable=<chrome-headless-shell>
```

## Spreadsheet Gym · Sesi 03: Hapus +62 di nomor HP (Remotion, Reels 1080×1920, 99.5s)

`spreadsheet-gym-nomor-hp/spreadsheet-gym-sesi-03.mp4` covers numbers that all start with +62 but are 10 to 13 digits long. A fixed `=RIGHT(A2;11)` leaves "62" or "2" in front or cuts digits off, while `=RIGHT(A2;LEN(A2)-3)` lets LEN do the counting. It calls back to Sesi 02 with ARRAYFORMULA, and the latihan asks for the 08 format (answer: `="0"&RIGHT(A2;LEN(A2)-3)`).

- **Script and storyboard:** `script.md` and `storyboard.png` are the plan. The recording departs from them in places (the RIGHT(…;11) example, "Taruh jawabannya di komentar" as its own clip, a different CTA), and the edit follows the recording.
- **Edit:** the same rules as Sesi 02. There are 15 self-recorded clips from Drive, one scene per clip. The audio goes through `clean_vo.py` (denoise, EQ, compression, leveling, 1.07× speed, silence cut), then `trim_tails.py`, with 0.18 s gaps, a 3-second pause, and a 0.6 s hold after the answer. The top bar asks "1 rumus, semua panjang?" until the answer is said. Sheets slide in from varying sides, everything stays inside the shared safe area (`safe-area-check.png`), and the hook sheet has two columns only.

The cover (`thumbnail.png`, the `Thumbnail` still) follows the Sesi 02 cover rules: TRIMS cover geometry, the SAFE box x 60–940, y 285–1500, no face, and no answer. The title is "Rapiin nomor HP / beda panjang?!", and the panel shows the wrong-way frame at 33.9 s (`=RIGHT(A2;11)` with the red "nyisa 62 / nyisa 2 / kepotong" results), so LEN never shows. `thumbnail-safe-area-check.png` shows the overlays.

```sh
cd spreadsheet-gym-nomor-hp
npm install
python3 scripts/clean_vo.py <clean dir> <15 clips in order>
python3 scripts/trim_tails.py <clean dir>/*.wav
GAP=0.18 python3 scripts/build_vo.py --pause-after 6 3.2 --pause-after 7 0.6 <clean dir>/{01..15}.wav
npm run render -- --browser-executable=<chrome-headless-shell>
```
