# Spreadsheet Gym · Sesi 03 · Hapus +62 di nomor HP

Reels 9:16, about 70 seconds. Format from the Faqihpedia Segment Kit (`brand/segment-kit.html`), with the Sesi 02 changes:
hook → bumper → warm-up (soal kantor) → the wrong way → pause dulu (3 seconds) → gerakan → intinya → latihan → CTA.
Storyboard: `storyboard.png` (12 panels, same numbers as the table).

**Main formula (shown in the top bar only after the answer is said; before that the bar reads "1 rumus, semua panjang?"):**
`=RIGHT(A2;LEN(A2)-3)`

**Practice data:** your Drive sheet "🏋🏻‍♀️ Spreadsheets Gym", Day 1 ("Ubah format nomor HP dengan prefix +62 menjadi prefix 8"). Every number starts with +62, but the numbers are 10 to 13 digits long (counted the usual way, starting with 08).

## How to read the VO marks

| Mark | Meaning |
|---|---|
| ↗ | rising tone (question) |
| ↘ | firm ending: short last syllable, don't drag it |
| `/` | short pause (about half a second) |
| **bold** | the stressed word |

Say the numbers in Indonesian ("enam dua", "sepuluh", "dikurang tiga"). On-screen formulas use `;` (Google Sheets with Indonesian locale). If your Sheets uses English, it's `,`.

## Script

| # | Part | ~Duration | On screen | VO (what you say) |
|---|---|---|---|---|
| 1 | Hook | 4 s | Column of +62 numbers with different lengths, a length ruler next to each · red sticker "Panjangnya beda-beda!" · green "1 rumus, beres" | Mau hapus plus enam dua, / tapi panjang nomornya **beda-beda**? ↗ Satu rumus, / **beres**. ↘ |
| 2 | Bumper | 2 s | Barbell logo, *SPREADSHEET GYM*, *Sesi 03* · coach whistle | Balik lagi di Spreadsheet Gym, / sesi **tiga**. ↘ |
| 3 | Warm-up | 9 s | Boss chat "Buang +62-nya ya" · sheet `pelanggan.xlsx`: A "Nomor HP", B "Format 8xxx" · "+62" in every row highlighted · digit-count chips 10, 11, 12, 13 | Bos kirim data pelanggan. ↘ Semua nomor diawali plus enam dua, / tapi panjangnya beda-beda: / ada yang **sepuluh** digit, / ada yang sampai **tiga belas**. ↘ |
| 4 | The wrong way | 8 s | B2 types `=RIGHT(A2;10)` and is dragged down: short numbers come out with "2" still in front (red), long ones get cut (red) · sticker "Angka tetap = salah" | Biasanya kamu pakai RIGHT, / ambil sepuluh angka dari kanan. ↘ Tapi hasilnya: / ada yang masih nyisa angka dua, / ada yang **kepotong**. ↘ |
| 5 | Pause dulu | 3 s + 3 s timer | **PAUSE DULU** + 3-second countdown · comment bubble "=??? tebak!" | Gimana caranya / satu rumus buat semua panjang? ↗ Pause dulu, / tebak di **komen**! ↘ *(3 seconds silent)* |
| 6 | Move 1: the answer | 8 s | **RIGHT + LEN** · B2 types `=RIGHT(A2;LEN(A2)-3)` piece by piece · the top bar reveals the formula · B2 = 812345678 (green) | Jawabannya: / **RIGHT** sama **LEN**. ↘ Tulis di B dua: / RIGHT, / A dua, / terus LEN A dua, / dikurang **tiga**. ↘ |
| 7 | Move 2: why minus 3 | 8 s | `LEN(A2)` counts the characters: "+62812345678" → **12** · `+` `6` `2` boxed = **3 karakter** · RIGHT takes 12 − 3 = 9 from the right | LEN ngitung panjang teksnya. ↘ Dikurang tiga, / karena plus enam dua itu / **tiga karakter**. ↘ Jadi RIGHT ambil semua, / kecuali tiga karakter **paling depan**. ↘ |
| 8 | Move 3: any length | 7 s | Two rows side by side: 12 characters → take 9 · 15 characters → take 12 · both green | Nomornya dua belas karakter? / Ambil **sembilan**. ↘ Lima belas karakter? / Ambil **dua belas**. ↘ Otomatis **ngikutin** panjangnya. ↘ |
| 9 | Move 4: one column | 6 s | Callback to Sesi 02: `=ARRAYFORMULA(IF(A2:A="";"";RIGHT(A2:A;LEN(A2:A)-3)))` · column B fills in a wave | Mau satu kolom **sekaligus**? ↗ Bungkus pakai **ARRAYFORMULA**, / kayak sesi dua. ↘ |
| 10 | Takeaway | 5 s | Card: ~~RIGHT(A2;**10**)~~ → RIGHT(A2;**LEN(A2)-3**) · "Biarin LEN yang ngitung" | Intinya: / jangan pakai angka **tetap**. ↘ Biarin LEN / yang **ngitung**. ↘ |
| 11 | Latihan | 6 s | **LATIHAN** · sheet: A "+62…", B "Format 08xx" = **?** · example chip `0812345678` | Sekarang latihan: / ubah nomornya jadi format **nol delapan**. ↘ Satu rumus. / Jawab di komen! ↘ |
| 12 | CTA | 6 s | Like + save icons · share card "ke temen yang masih hapus +62 manual" · cursor taps *+ Follow* → *Following ✓* | Like dan save / biar gak lupa! ↘ Share ke temen / yang masih hapus plus enam dua manual, / terus **follow**! ↘ |

About 70 s with the 3-second pause.

## Latihan answer (for pinning in the comments)

One cell: `="0"&RIGHT(A2;LEN(A2)-3)`

Whole column: `=ARRAYFORMULA(IF(A2:A="";"";"0"&RIGHT(A2:A;LEN(A2:A)-3)))`

Another way that also works: `=SUBSTITUTE(A2;"+62";"0")`

## Sample data (sheet `pelanggan.xlsx`)

| A: Nomor HP | Characters | 08 format (digits) | B: Format 8xxx |
|---|---|---|---|
| +62812345678 | 12 | 0812345678 (10) | 812345678 |
| +628112345678 | 13 | 08112345678 (11) | 8112345678 |
| +6281312345678 | 14 | 081312345678 (12) | 81312345678 |
| +62857123456789 | 15 | 0857123456789 (13) | 857123456789 |
| +62822123456 | 12 | 0822123456 (10) | 822123456 |
| +628771234567 | 13 | 08771234567 (11) | 8771234567 |

With `=RIGHT(A2;10)` (the wrong way): 12 characters → "2812345678" (an extra 2), 15 characters → "7123456789" (the "85" is cut off).

## Recording notes

- Record each row as its own take, like Sesi 02. Silences and tails get cut automatically.
- Row 4 is the "wrong way". Say "kepotong" with a little disappointment. It sets up the question.
- Row 7: say "tiga karakter" a bit slower. That's the moment it clicks.
- Row 1: put the energy on "**beda-beda**", end "**beres**" short and firm.
- Questions (rows 1, 5 and 9): let the last word rise ↗. Statements: end short and firm ↘.
