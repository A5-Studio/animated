import React from 'react';
import { AbsoluteFill, Html5Audio, staticFile, useCurrentFrame } from 'remotion';
import { At, between } from './components';
import { Barbell, SCENES } from './scenes';
import { Fx } from './Sheet';
import { Sfx } from './sfx';
import { BODY, BORDER, C, EPISODE_LABEL, HEAD, MAIN_FORMULA, MONO, PARTS, SAFE, SAFE_CX, STAGE, WORDS, cue, s, shadow } from './theme';

/*
 * Captions. The text is what's shown on screen (formulas written as
 * formulas); it is timed by mapping each caption word onto the transcribed
 * words of the same VO part. A formula token counts as the words it takes
 * to say it, given after a tilde ("=B2*C2~5").
 */
const CAPTIONS: string[] = [
  'Mau rapiin format nomor HP, tapi panjangnya beda-beda? Satu rumus, beres.',
  'Balik lagi di Spreadsheet Gym.',
  'Bos kirim data pelanggan. Semua nomor diawali +62~3, tapi dia minta semua nomor diubah jadi diawali dengan 8. Tapi kamu lihat, jumlah digitnya beda-beda: ada yang 10 digit, ada yang sampai 13 digit.',
  'Kamu biasanya pakai RIGHT, karena jumlah digitnya sama, jadi tinggal ambil 11 digit dari kanan.',
  'Tapi untuk data baru ini hasilnya beda-beda: ada yang masih nyisa 62-nya, ada yang masih nyisa 2, ada yang malah kepotong.',
  'Gimana caranya bikin satu formula yang bisa rapiin nomor HP dengan digit yang beda-beda, jadi format yang seragam? Pause dulu.',
  'Jawabannya: gabungin RIGHT dan LEN. Tulis di B2: =RIGHT(A2;LEN(A2)-3)~8.',
  'LEN menghitung panjang teksnya, dikurangi 3 karena kita mau menghilangkan 3 karakter.',
  'Jadi RIGHT ngambil semua, kecuali karakter +62~3, 3 karakter dari depan.',
  'Nomornya 12 karakter? Ambil 9. Kalau 15 karakter? Ambil 12. Otomatis ngikutin panjang karakter nomor HP-nya.',
  'Kamu juga bisa bungkus pakai ARRAYFORMULA, biar kalau ada data nomor HP baru, nggak perlu narik lagi formulanya ke bawah.',
  'Intinya: jangan pakai angka tetap, tapi biarin LEN menghitung karakternya dan ngambil mana yang mau dipotong.',
  'Sekarang latihan: ubah semua nomor HP jadi format 08, pakai satu formula aja.',
  'Taruh jawabannya di komentar!',
  'Like dan save biar nggak lupa! Share ke temenmu yang masih suka format nomor HP dengan manual. Jangan lupa follow, biar dapat latihan lainnya!',
];

/** words it takes to say a caption token; "=…~N" gives the count explicitly, ARRAYFORMULA is said as two words */
const spoken = (tok: string) => {
  const m = tok.match(/~(\d+)/);
  if (m) return Number(m[1]);
  return /ARRAYFORMULA/.test(tok) ? 2 : 1;
};
const clean = (tok: string) => tok.replace(/~\d+/, '');

type Chunk = { words: { w: string; t: number }[]; from: number; to: number };

const CHUNKS: Chunk[] = CAPTIONS.flatMap((text, p) => {
  const ws = WORDS.filter((w) => w.p === p);
  const cap = text.split(/\s+/);
  const weight = cap.map(spoken);
  const total = weight.reduce((a, b) => a + b, 0);
  const before = weight.map((_, i) => weight.slice(0, i).reduce((a, b) => a + b, 0));
  const timeOf = (i: number) => (ws.length ? ws[Math.min(ws.length - 1, Math.round((before[i] * ws.length) / total))].s : PARTS[p].start);
  const groups: number[][] = [];
  let g: number[] = [];
  cap.forEach((w, i) => {
    g.push(i);
    if (g.length >= 5 || w.startsWith('=') || (/[.,:?]$/.test(w) && g.length >= 3)) {
      groups.push(g);
      g = [];
    }
  });
  if (g.length) groups.push(g);
  return groups.map((idx, k) => ({
    words: idx.map((i) => ({ w: clean(cap[i]), t: timeOf(i) })),
    from: timeOf(idx[0]),
    to: k + 1 < groups.length ? timeOf(groups[k + 1][0]) : PARTS[p].end + 0.2,
  }));
});

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const c = CHUNKS.find((ch) => t >= ch.from - 0.05 && t < ch.to);
  if (!c) return null;
  const o = between(f, s(c.from) - 2, s(c.to) + 2, 3);
  return (
    <At x={SAFE_CX} y={SAFE.bottom - 72} o={o}>
      <div
        style={{
          maxWidth: SAFE.right - SAFE.left - 20, background: C.white, border: `${BORDER}px solid ${C.ink}`, borderRadius: 20, boxShadow: shadow(9),
          padding: '12px 24px', fontFamily: BODY, fontWeight: 700, fontSize: 42, lineHeight: 1.22, textAlign: 'center', color: C.ink, width: 'max-content',
        }}
      >
        {c.words.map((w, i) => {
          const on = t >= w.t && (i + 1 >= c.words.length || t < c.words[i + 1].t);
          const isFx = w.w.startsWith('=') && w.w.length > 2;
          return (
            <span key={i} style={{ background: on ? C.green : 'transparent', borderRadius: 8, padding: '0 6px', fontFamily: isFx ? MONO : undefined }}>
              {isFx ? <Fx text={w.w.replace(/[.,?]$/, '')} /> : w.w}{' '}
            </span>
          );
        })}
      </div>
    </At>
  );
};

/** cell-grid sheet background (segment motif) */
const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.bg,
      backgroundImage: `linear-gradient(90deg, rgba(17,17,17,.12) 2px, transparent 2px), linear-gradient(rgba(17,17,17,.12) 2px, transparent 2px)`,
      backgroundSize: '160px 64px',
    }}
  />
);

/**
 * header row at the top of the safe box: segment chip + formula bar.
 * The bar keeps the answer hidden until it's said ("Jawabannya, gabungin RIGHT dan LEN"):
 * before that it only asks the question.
 */
const REVEAL = () => cue(6, 'right');
const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  const shown = f >= s(REVEAL());
  return (
  <div style={{ position: 'absolute', left: SAFE.left, top: SAFE.top, width: SAFE.right - SAFE.left, height: 76, display: 'flex', gap: 16, alignItems: 'stretch' }}>
    <div style={{ background: C.green, border: `5px solid ${C.ink}`, borderRadius: 14, boxShadow: shadow(6), padding: '0 18px', display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontWeight: 700, fontSize: 26, whiteSpace: 'nowrap', transform: 'rotate(-2deg)' }}>
      <Barbell w={64} />
      GYM · {EPISODE_LABEL}
    </div>
    <div style={{ flex: 1, background: C.white, border: `5px solid ${C.ink}`, borderRadius: 14, boxShadow: shadow(6), display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
      <div style={{ width: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `5px solid ${C.ink}`, fontFamily: MONO, fontStyle: 'italic', fontWeight: 700, fontSize: 32 }}>fx</div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontWeight: 700, fontSize: MAIN_FORMULA.length > 16 ? 25 : 36, whiteSpace: 'nowrap' }}>
        {shown ? <Fx text={MAIN_FORMULA} /> : <span style={{ fontFamily: BODY, fontSize: 30 }}>1 rumus, semua panjang?</span>}
      </div>
    </div>
  </div>
  );
};

/** black strip at the bottom, like the cover */
const Strip: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, bottom: 0, width: 1080, height: 84, background: C.ink, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', boxSizing: 'border-box', fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 2 }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ background: C.white, borderRadius: 8, padding: '2px 4px' }}><Barbell w={64} /></span>
      SPREADSHEET GYM
    </span>
    <span>@faqihpedia</span>
  </div>
);

export const SpreadsheetGym: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden', fontFamily: HEAD }}>
      <Grid />
      {/* scenes: full-canvas design, scaled into the safe box (x ~95-905, y 380-1370) */}
      <AbsoluteFill
        style={{
          transformOrigin: '0 0',
          transform: `translate(${SAFE_CX - 540 * STAGE.k}px, ${STAGE.top - STAGE.y0 * STAGE.k}px) scale(${STAGE.k})`,
        }}
      >
        {SCENES.map(({ from, to, C: Scene }, i) => {
          const a = s(from);
          const b = s(to);
          if (f < a - 1 || f > b + 1) return null;
          return (
            <AbsoluteFill key={i} style={{ opacity: between(f, a, b, 6) }}>
              <Scene />
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
      <TopBar />
      <Captions />
      <Strip />
      <Html5Audio src={staticFile('vo.wav')} />
      <Sfx />
    </AbsoluteFill>
  );
};
