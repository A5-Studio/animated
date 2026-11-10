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

## Rp14,7 M bisa beli apa? (Remotion, Reels 1080×1920, 56s)

`uang-14-7m/uang-14-7m.mp4` spends Rp14.700.000.000 three ways. It uses the same neobrutalist style as `push-notification-id`, with no voiceover: captions, counters and sound effects only. All prices are from early November 2026, and every number comes from `src/theme.ts`.

| Belanja | Harga | Hasil |
|---|---|---|
| Beras medium | Rp13.686/kg (rata-rata nasional Bapanas, 2 Nov 2026) | 1.074.090 kg ≈ 1.074 ton, cukup buat ±13 ribu orang setahun (asumsi 80 kg/orang/tahun) |
| Kuliah di PTN | UKT ±Rp5,2 juta/semester × 8 semester = Rp41,6 juta | 353 orang lulus S1 |
| Pertalite | Rp10.000/liter (Pertamina, Nov 2026) | 1.470.000 liter = 58,8 juta km naik motor (40 km/L) ≈ keliling bumi 1.467× |

There is no official national average for UKT. Rp5,2 juta is a figure quoted by Kompas.id, and real UKT runs from Rp0 to tens of millions depending on campus, program and bracket. To change any assumption, edit `src/theme.ts` and re-render.

```sh
cd uang-14-7m
npm install
python3 scripts/soundtrack.py public/soundtrack.wav    # optional: regenerate audio
npm run render -- --browser-executable=/opt/pw-browsers/chromium
npm run infografik -- --browser-executable=/opt/pw-browsers/chromium
```

## Rp14,7 M buat langganan AI (Remotion, Reels 1080×1920, 54s)

`ai-14-7m/ai-14-7m.mp4` asks how long Rp14.700.000.000 lasts on the most expensive consumer plan of three popular AI apps. It is built like `uang-14-7m` (same components, palette and sound effects). Every number comes from `PLANS` in `src/theme.ts`, and subscriptions are assumed to start in November 2026.

| AI | Plan tertinggi (Nov 2026) | Per bulan | Rp14,7 M cukup untuk |
|---|---|---|---|
| Claude | Ultra (dulu Max 20x), $200 | Rp3.625.200 | 4.054 bulan = 337 tahun, sampai 2364 |
| ChatGPT | Pro 500, $500 | Rp9.063.000 | 1.621 bulan = 135 tahun, sampai 2161 |
| Gemini | Google AI Ultra 20x | Rp3.399.000 (harga resmi Indonesia) | 4.324 bulan = 360 tahun, sampai 2387 |

Dollar prices use the market rate of Rp18.126/US$ (6 Nov 2026) and exclude tax. To update a price or the rate, edit `src/theme.ts` and re-render.

There is also a horizontal cut, `ai-14-7m/ai-14-7m-horizontal.mp4` (1920×1080, 61s, composition `Ai147MH`). It is laid out for landscape, not cropped from the vertical one. Each AI gets a "tier ladder" on the left listing every consumer plan from Free upward, with the top tier marked *tertinggi* to show why that plan was picked; the math runs on the right. It shows the apps' own logos (`public/logos/`, supplied by the author). Its scenes are in `src/scenesH.tsx`, the tier list is `TIERS` in `src/theme.ts`, and its audio comes from `scripts/soundtrack_h.py`.

```sh
cd ai-14-7m
npm install
python3 scripts/soundtrack.py public/soundtrack.wav    # optional: regenerate audio
npm run render -- --browser-executable=/opt/pw-browsers/chromium     # vertical
python3 scripts/soundtrack_h.py public/soundtrack-h.wav  # optional
npm run render:h -- --browser-executable=/opt/pw-browsers/chromium   # horizontal
```

## Rp14,7 M borong tas Wallts (Remotion, 1920×1080, 55s)

`wallts-14-7m/wallts-14-7m.mp4` spends Rp14.700.000.000 on the most expensive Wallts product on Shopee: the Wallts Teva travel backpack at Rp373.350 (voucher price, Shopee Mall, 10 Nov 2026). The product photos in `public/` are cropped from the author's screenshot of the listing, and `public/wallts-logo.png` is the brand logo supplied by the author. All numbers come from `src/theme.ts`.

| Fakta | Angka |
|---|---|
| Jumlah tas | 39.373 tas, kembalian Rp90.450 |
| Kalau ditumpuk (±45 cm per tas) | 17.718 m ≈ 2× Gunung Everest (8.849 m) |
| Dibanding yang sudah terjual (74) | 532× lipat |
| Ganti tas baru tiap hari | 107 tahun |
| Bonus: produk terlaris, dompet Wallts BROCK Rp144.704 (10RB+ terjual) | 101.586 dompet, ±10× semua yang pernah terjual |

There is also a static infographic, `wallts-14-7m/wallts-14-7m-infografik.png` (1080×1350 at 2×, Instagram feed). It is the `WalltsInfografik` still in `src/Infographic.tsx` and uses the same numbers.

```sh
cd wallts-14-7m
npm install
python3 scripts/soundtrack.py public/soundtrack.wav    # optional: regenerate audio
npm run render -- --browser-executable=/opt/pw-browsers/chromium
npm run infografik -- --browser-executable=/opt/pw-browsers/chromium
```
