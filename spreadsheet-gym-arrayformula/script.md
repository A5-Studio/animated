# Spreadsheet Gym · Sesi 02 · ARRAYFORMULA

Reels 9:16, about 70 seconds. Format from the Faqihpedia Segment Kit (`brand/segment-kit.html`):
hook → opening → warm-up (soal kantor) → pause dulu (5 detik) → gerakan → intinya → repetisi → pendinginan + CTA.
Storyboard: `storyboard.png` (12 panels, same numbers as the table).

**Main formula (always in the formula bar on top):** `=ARRAYFORMULA(B2:B*C2:C)`

## How to read the VO marks

| Mark | Meaning |
|---|---|
| ↗ | rising tone (question) |
| ↘ | firm ending: short last syllable, don't drag it |
| `\|` | short pause (about half a second) |
| **bold** | the stressed word |

Formulas are written the way you say them. Say the numbers in Indonesian ("B dua", "lima ratus").
The on-screen formulas use `;` (Google Sheets with Indonesian locale). If your Sheets uses English, it's `,`.

## Script

| # | Part | ~Duration | On screen | VO (what you say) |
|---|---|---|---|---|
| 1 | Hook | 3 s | Cursor drags the fill handle from D2 to row 500, red "500×" sticker | **Jangan** tarik rumus | sampai baris lima ratus **lagi**! ↘ |
| 2 | Opening | 2 s | Barbell logo, *SPREADSHEET GYM*, *Sesi 02* · coach whistle | Ini Spreadsheet Gym, | sesi **dua**. ↘ |
| 3 | Warm-up | 12 s | Boss chat "Isi kolom total ya, 500 baris" · sheet: Produk, Harga, Qty, Total · D2 `=B2*C2`, drag arrow · new row 501 with an empty total | Bos kirim data penjualan. | Ada harga, ada jumlah, | **lima ratus** baris. ↘ Biasanya kamu tulis sama dengan B dua kali C dua, | terus tarik ke bawah. ↘ Besoknya ada data baru masuk… | totalnya **kosong** lagi. ↘ Gimana caranya, | **satu** rumus buat **satu** kolom? ↗ |
| 4 | Pause dulu | 2 s + 5 s timer | **PAUSE DULU** + 5-second countdown · "Satu rumus, satu kolom?" | Pause dulu, | coba tebak rumusnya! ↘ *(5 seconds silent, the timer ticks)* |
| 5 | Move 1: answer | 8 s | D2 types `=ARRAYFORMULA(B2:B*C2:C)`, Enter → the whole D column fills top to bottom · sticker "Tulis sekali" | Jawabannya: | **ARRAYFORMULA**. ↘ Tulis sekali di D dua: | ARRAYFORMULA, | B dua sampai B, | kali C dua sampai C. | Enter. | Satu kolom langsung **keisi semua**! ↘ |
| 6 | Move 2: why | 8 s | Range `B2:B` highlighted from B2 to the bottom (blue), `C2:C` (pink) · row-by-row arrows into D | Kenapa bisa? ↗ Karena yang kita kasih bukan satu sel, | tapi satu **range**. ↘ B dua sampai B | artinya dari B dua | sampai **paling bawah**. ↘ ARRAYFORMULA ngitung baris per baris, | **otomatis**. ↘ |
| 7 | Move 3: the trap | 10 s | Empty rows 7–9 show red `0` · the formula changes to `=ARRAYFORMULA(IF(B2:B="";"";B2:B*C2:C))` · the 0s disappear | Tapi ada satu **jebakan**. ↘ Baris yang masih kosong, | hasilnya jadi **nol**. ↘ Biar rapi, tambahin IF: | kalau B kosong, | biarin kosong. | Kalau nggak, | baru dikali. ↘ |
| 8 | Gym analogy | 7 s | Left: "Tarik rumus = angkat dumbbell satu-satu ×500". Right: "ARRAYFORMULA = mesin, sekali setel" | Gampangnya gini. | Tarik rumus itu kayak angkat dumbbell | **satu-satu**. ↘ ARRAYFORMULA itu kayak **mesin**: | sekali setel, | semua beban keangkat. ↘ |
| 9 | Takeaway | 6 s | Row 501 appears and its total fills itself · chips "1 rumus · 1 kolom · data baru ikut" | Intinya: | **satu** rumus di baris paling atas, | **satu** kolom beres. ↘ Data baru masuk, | totalnya **ngikut sendiri**. ↘ |
| 10 | Excel note *(optional)* | 5 s | Small card: "Di Excel 365: `=B2:B6*C2:C6` → hasilnya tumpah ke bawah (spill)" | Catatan: | ARRAYFORMULA cuma ada di **Google Sheets**. ↘ Di Excel versi baru, | cukup tulis rumus range-nya langsung. ↘ |
| 11 | Repetisi | 6 s | Sheet: B Harga, C Diskon (%), D "Harga akhir" = **?** · **REPETISI** label | Kolom B harga, | kolom C diskon persen. | Tulis **satu** rumus ARRAYFORMULA | buat harga setelah diskon di kolom D! ↘ |
| 12 | Cool-down + CTA | 6 s | Comment bubble "=ARRAYFORMULA(… ?" · share card · *+ Follow* tapped → *Following ✓* · SESI 03 card | Kerjain repetisinya, | jawab di **komentar** ya! ↘ Share ke temen yang masih suka narik rumus, | terus **follow**, | biar nggak ketinggalan sesi berikutnya! ↘ |

About 70 s with panel 10, about 65 s without it.

## Repetisi answer (for pinning in the comments)

`=ARRAYFORMULA(IF(B2:B="";"";B2:B*(1-C2:C)))`

If column C holds whole numbers (10 for 10%) instead of percentages, use `B2:B*(1-C2:C/100)`.

## Recording notes

- Record each row as its own take, then pick the best one. The edit follows the takes, so pauses between rows don't matter.
- Leave about half a second of silence at the start and end of each take.
- Panel 4: just say the line; the 5-second silence is added in the edit.
- Read the formulas a little slower than the rest. Viewers are watching them type out on screen.
- Hook (row 1): put the energy on "**Jangan**", and end "**lagi**!" short and firm.
- Questions (rows 3 and 6): let the last word rise ↗. Statements: end short and firm ↘.
