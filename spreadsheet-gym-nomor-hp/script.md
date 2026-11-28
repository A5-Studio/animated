# Spreadsheet Gym · Sesi 03 · Rapikan nomor HP

Reels 9:16, about 75 seconds. Format from the Faqihpedia Segment Kit (`brand/segment-kit.html`), with the Sesi 02 changes:
hook → bumper → warm-up (soal kantor) → pause dulu (3 seconds) → gerakan → jebakan → intinya → latihan → CTA.
Storyboard: `storyboard.png` (12 panels, same numbers as the table).

**Main formula (shown in the top bar only after the answer is said; before that the bar reads "1 rumus, semua nomor rapi?"):**
`=REGEXREPLACE(A2&"";"^(\+62|62|0)";"")`

**Practice data:** your Drive sheet "🏋🏻‍♀️ Spreadsheets Gym", Day 2 (mixed prefixes +62, 62, 0 and 8, all turned into numbers that start with 8).

## How to read the VO marks

| Mark | Meaning |
|---|---|
| ↗ | rising tone (question) |
| ↘ | firm ending: short last syllable, don't drag it |
| `/` | short pause (about half a second) |
| **bold** | the stressed word |

Say the numbers in Indonesian ("enam dua", "nol delapan"). On-screen formulas use `;` (Google Sheets with Indonesian locale). If your Sheets uses English, it's `,`.

## Script

| # | Part | ~Duration | On screen | VO (what you say) |
|---|---|---|---|---|
| 1 | Hook | 4 s | Column of messy numbers (+62…, 08…, 62…, 8…) shaking · red sticker "Campur aduk!" · then green "1 rumus, beres" | Nomor HP pelanggan / formatnya **campur aduk**? ↗ Satu rumus, / **beres**. ↘ |
| 2 | Bumper | 2 s | Barbell logo, *SPREADSHEET GYM*, *Sesi 03* · coach whistle | Balik lagi di Spreadsheet Gym, / sesi **tiga**. ↘ |
| 3 | Warm-up | 10 s | Boss chat "Kirim promo lewat WA ya" · sheet `pelanggan.xlsx`: Nama, Nomor HP · the prefixes light up one by one (+62, 0, 62, 8) | Bos minta kirim promo lewat **WhatsApp**. ↘ Tapi nomor di datanya campur aduk: / ada yang plus enam dua, / ada yang nol, / ada yang enam dua, / ada yang langsung **delapan**. ↘ |
| 4 | The problem | 6 s | Target column "Format 8xxx" empty · counter "500 nomor" · cursor editing one cell by hand | Semuanya harus diseragamin / jadi awalan delapan. ↘ Kalau diedit manual, / lima ratus nomor… / kapan **kelarnya**? ↗ |
| 5 | Pause dulu | 2 s + 3 s timer | **PAUSE DULU** + 3-second countdown · comment bubble "=??? tebak!" | Pause dulu, / coba tebak rumusnya di **komen**! ↘ *(3 seconds silent)* |
| 6 | Move 1: the answer | 9 s | **REGEXREPLACE** · B2 types `=REGEXREPLACE(A2&"";"^(\+62\|62\|0)";"")` piece by piece · result 812345678 · the top bar reveals the formula | Jawabannya: / **REGEXREPLACE**. ↘ Tulis di B dua: / REGEXREPLACE, / A dua, / terus polanya, / terus ganti sama **kosong**. ↘ |
| 7 | Move 2: reading the pattern | 9 s | The pattern `^(\+62\|62\|0)` broken into chips: `^` = "di awal", `\|` = "atau", `+62` · `62` · `0` · the matching prefix in each number gets a red strike | Polanya dibaca gini: / tanda topi artinya **di awal**. ↘ Garis tegak artinya **atau**. ↘ Jadi kalau di awal ada plus enam dua, / enam dua, / atau nol, / **hapus**. ↘ |
| 8 | Move 3: the trap | 9 s | A cell without + shows `#VALUE!` (red): "REGEXREPLACE cuma mau teks" · `&""` gets added (yellow) · error → 812345678 | Tapi ada satu **jebakan**. ↘ Nomor yang diketik tanpa plus / kebaca sebagai **angka**, / dan REGEXREPLACE cuma mau **teks**. ↘ Tambahin dan, petik, petik, / biar jadi teks. ↘ |
| 9 | Move 4: one column | 7 s | Callback to Sesi 02: wrap in `ARRAYFORMULA(IF(A2:A="";""; … A2:A&"" …))` · column B fills top to bottom in a wave | Mau satu kolom **sekaligus**? ↗ Inget sesi dua: / bungkus pakai **ARRAYFORMULA**. ↘ Lima ratus nomor, / satu rumus. ↘ |
| 10 | Takeaway | 5 s | Before → after: messy column → tidy 8xxx column, all green | Intinya: / hapus awalannya, / sisain angka **delapan**. ↘ Semua nomor jadi **seragam**. ↘ |
| 11 | Latihan | 8 s | **LATIHAN** · sheet: B "Format 8xxx" (tidy), C "Link WA" = **?** · example chip `wa.me/62812345678` | Sekarang latihan: / dari nomor yang udah rapi, / bikin **link WhatsApp** otomatis: / wa titik me, / garis miring, / enam dua, / terus nomornya. ↘ Jawab di komen! ↘ |
| 12 | CTA | 6 s | Like + save icons · share card "ke temen yang datanya masih campur aduk" · cursor taps *+ Follow* → *Following ✓* | Like dan save / biar gak lupa! ↘ Share ke temen yang datanya / masih campur aduk, / terus **follow**, / biar gak ketinggalan sesi berikutnya! ↘ |

About 75 s with the 3-second pause.

## Latihan answer (for pinning in the comments)

One cell: `="https://wa.me/62"&B2`

Whole column: `=ARRAYFORMULA(IF(B2:B="";"";"https://wa.me/62"&B2:B))`

## Sample data (sheet `pelanggan.xlsx`)

| A: Nomor HP | B: Format 8xxx |
|---|---|
| +62812345678 | 812345678 |
| 08112345678 | 8112345678 |
| 6285210345678 | 85210345678 |
| 812345678 | 812345678 |
| +628771234567 | 8771234567 |
| 62822123456 | 822123456 |

## Recording notes

- Record each row as its own take, like Sesi 02. Silences and tails get cut automatically.
- Row 6: you don't have to read the whole formula. The screen types it out; just say the pieces in the VO.
- Row 7: say "tanda topi" and "garis tegak" a bit slower. That's the moment the pattern clicks.
- Row 1: put the energy on "**campur aduk**", end "**beres**" short and firm.
- Questions (rows 1, 4 and 9): let the last word rise ↗. Statements: end short and firm ↘.
