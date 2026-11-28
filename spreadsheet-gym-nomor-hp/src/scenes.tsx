import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { At, Box, Sticker, between, lin, pop } from './components';
import { Fx, SheetUI } from './Sheet';
import { BODY, BORDER, C, EPISODE, HEAD, MONO, PARTS, cue, s, shadow } from './theme';

/*
 * Spreadsheet Gym · Sesi 03 · Hapus +62 di nomor HP. One scene per recorded VO clip, in order:
 *  0 hook · 1 bumper · 2 bos kirim data · 3 biasanya RIGHT 11 · 4 hasilnya beda-beda
 *  5 gimana caranya + pause dulu (+3 s timer) · 6 jawabannya RIGHT + LEN · 7 LEN menghitung
 *  8 RIGHT ambil semua kecuali 3 · 9 panjang apa pun · 10 ARRAYFORMULA · 11 intinya
 *  12 latihan · 13 taruh jawabannya di komentar · 14 like, save, share, follow
 * Times come from the word timestamps of the VO (cue(part, word)).
 */

/* ------------------------------------------------------------------ */
/* brand drawings + small parts (same as sesi 02)                      */
/* ------------------------------------------------------------------ */
export const Barbell: React.FC<{ w?: number }> = ({ w = 230 }) => (
  <svg viewBox="0 0 230 120" width={w} height={(w * 120) / 230} style={{ display: 'block' }}>
    <rect x="58" y="52" width="114" height="16" rx="4" fill="#fff" stroke="#111" strokeWidth="5" />
    <text x="115" y="65" textAnchor="middle" fontFamily="Space Mono, monospace" fontStyle="italic" fontWeight="700" fontSize="14" fill="#111">fx</text>
    <g stroke="#111" strokeWidth="5" fill="#fff">
      <rect x="10" y="14" width="48" height="92" rx="6" />
      <rect x="172" y="14" width="48" height="92" rx="6" />
    </g>
    <g stroke="#111" strokeWidth="3">
      <line x1="34" y1="14" x2="34" y2="106" /><line x1="10" y1="45" x2="58" y2="45" /><line x1="10" y1="75" x2="58" y2="75" />
      <line x1="196" y1="14" x2="196" y2="106" /><line x1="172" y1="45" x2="220" y2="45" /><line x1="172" y1="75" x2="220" y2="75" />
    </g>
    <rect x="12" y="47" width="20" height="26" fill={C.green} />
    <rect x="198" y="47" width="20" height="26" fill={C.green} />
  </svg>
);

const Bubble: React.FC<{ who: string; children: React.ReactNode }> = ({ who, children }) => (
  <div style={{ position: 'relative' }}>
    <Box pad="18px 28px" radius={26} style={{ maxWidth: 860 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, marginBottom: 6 }}>{who}</div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 44, lineHeight: 1.15 }}>{children}</div>
    </Box>
    <div style={{ position: 'absolute', left: 50, bottom: -30, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `34px solid ${C.ink}` }} />
  </div>
);

const Cursor: React.FC<{ size?: number }> = ({ size = 70 }) => (
  <svg viewBox="0 0 60 80" width={size} height={(size * 94) / 70} style={{ display: 'block' }}>
    <polygon points="4,4 4,64 20,50 32,76 44,70 32,46 54,46" fill={C.white} stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
  </svg>
);

const Plane: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
    <polygon points="6,46 94,8 64,92 48,58" fill={C.white} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
    <polyline points="94,8 48,58" fill="none" stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
  </svg>
);

const Heart: React.FC<{ size?: number; on?: boolean }> = ({ size = 120, on }) => (
  <svg viewBox="0 0 100 90" width={size} height={size * 0.9} style={{ display: 'block' }}>
    <path d="M50 84 C20 62 6 46 6 28 C6 14 17 6 29 6 C39 6 46 12 50 20 C54 12 61 6 71 6 C83 6 94 14 94 28 C94 46 80 62 50 84 Z" fill={on ? C.red : C.white} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
  </svg>
);

const Bookmark: React.FC<{ size?: number; on?: boolean }> = ({ size = 110, on }) => (
  <svg viewBox="0 0 80 100" width={size * 0.8} height={size} style={{ display: 'block' }}>
    <path d="M8 6 H72 V94 L40 70 L8 94 Z" fill={on ? C.yellow : C.white} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
  </svg>
);

const Chip: React.FC<{ bg?: string; children: React.ReactNode; size?: number }> = ({ bg = C.white, children, size = 34 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: bg, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 16px', fontFamily: HEAD, fontSize: size, whiteSpace: 'nowrap', boxShadow: shadow(5) }}>
    {children}
  </span>
);

/** smooth entrance for the big sheets: slide in from one side with a fade, full size from the first frame */
type Dir = 'left' | 'right' | 'bottom';
const slideIn = (f: number, start: number, dir: Dir, x: number, y: number, k = 1) => {
  const p = interpolate(f, [start, start + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const off = 1 - p;
  return { x: x + (dir === 'left' ? -700 * off : dir === 'right' ? 700 * off : 0), y: y + (dir === 'bottom' ? 420 * off : 0), s: k, o: Math.min(1, p * 1.6) };
};

/* ------------------------------------------------------------------ */
/* the phone sheet: A Nomor HP, B result (2 columns)                   */
/* ------------------------------------------------------------------ */
const NUMS = ['812345678', '8112345678', '81312345678', '857123456789', '822123456', '8771234567'];
const FULL = NUMS.map((n) => '+62' + n);
const RIGHT11 = FULL.map((n) => n.slice(-11));
// what RIGHT(…;11) did to each row, in the words of the VO
const VERDICT = RIGHT11.map((r, i) => (r === NUMS[i] ? 'ok' : r.startsWith('62') ? '62' : r.startsWith('2') ? '2' : 'cut'));
const GREEN = '#C9F9D5';
const COLW = [500, 398];

type Cell = { text?: React.ReactNode; bg?: string; color?: string; o?: number };

const PhoneSheet: React.FC<{
  a?: (i: number) => React.ReactNode; b?: Cell[]; bar?: React.ReactNode; colB?: string; selected?: string;
  title?: string; extra?: number; extraB?: Cell; refs?: { cells: string[]; color: string }[];
}> = ({ a, b = [], bar, colB = 'Format 8xxx', selected, title = 'pelanggan.xlsx', extra = 0, extraB, refs = [] }) => {
  const rows = extra > 0 ? 9 : 7;
  const cells: Record<string, React.ReactNode> = { A1: 'Nomor HP', B1: colB };
  const style: Record<string, React.CSSProperties> = {
    A1: { justifyContent: 'flex-start', fontFamily: BODY, fontWeight: 700, fontSize: 34, background: C.head },
    B1: { justifyContent: 'flex-start', fontFamily: BODY, fontWeight: 700, fontSize: 34, background: C.head },
  };
  FULL.forEach((n, i) => {
    const r = i + 2;
    cells[`A${r}`] = a ? a(i) : n;
    style[`A${r}`] = { justifyContent: 'flex-start', fontSize: 38 };
    const bc = b[i];
    if (bc) {
      cells[`B${r}`] = bc.text ?? '';
      style[`B${r}`] = { background: bc.bg, color: bc.color, opacity: bc.o ?? 1, fontSize: 38 };
    }
  });
  if (extra > 0) {
    cells.A8 = '⋮'; style.A8 = { justifyContent: 'flex-start' };
    cells.A9 = '+6281234567890'; style.A9 = { justifyContent: 'flex-start', fontSize: 38 };
    if (extraB) { cells.B9 = extraB.text ?? ''; style.B9 = { background: extraB.bg, fontSize: 38 }; }
  }
  return (
    <SheetUI
      title={title} cols={2} rows={rows} rowH={78} colW={COLW} cells={cells} cellStyle={style} selected={selected} refs={refs} bar={bar}
      rowLabels={extra > 0 ? [1, 2, 3, 4, 5, 6, 7, '⋮', 501] : undefined}
      rowOpacity={extra > 0 ? [1, 1, 1, 1, 1, 1, 1, extra, extra] : undefined}
    />
  );
};

/** a number with "+62" highlighted */
const Pre: React.FC<{ n: string; on?: number; strike?: boolean }> = ({ n, on = 1, strike }) => (
  <span>
    <span style={{ background: on > 0 ? (strike ? '#FFD4D4' : C.yellow) : 'transparent', color: strike ? C.red : undefined, textDecoration: strike ? 'line-through' : undefined, borderRadius: 6, padding: '0 2px' }}>{n.slice(0, 3)}</span>
    {n.slice(3)}
  </span>
);

const filledB = (f: number, t: number, i: number, step = 5): Cell => ({ text: NUMS[i], bg: f >= s(t) + i * step ? GREEN : undefined, o: lin(f, s(t) + i * step, s(t) + i * step + 4) });

/* ------------------------------------------------------------------ */
/* 0. hook: "Mau rapiin format nomor HP, tapi panjangnya beda-beda? Satu rumus, beres." */
/* ------------------------------------------------------------------ */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[0].start);
  const tBeda = s(cue(0, 'beda'));
  const tSatu = s(cue(0, 'satu'));
  const tBeres = s(cue(0, 'beres'));
  const shake = f >= tBeda && f < tBeda + 20 ? Math.sin((f - tBeda) * 1.6) * 6 : 0;
  return (
    <>
      <At {...slideIn(f, t0 + 2, 'left', 540 + shake, 740)}>
        <PhoneSheet a={(i) => <Pre n={FULL[i]} on={f >= tBeda ? 1 : 0} />} />
      </At>
      <At x={540} y={290} s={pop(f, tBeda)} r={-3}>
        <Sticker bg={C.red} size={52} style={{ color: C.white }}>Panjangnya beda-beda!</Sticker>
      </At>
      <At x={540} y={1330} s={pop(f, tSatu, 220)} r={2}>
        <Box bg={C.green} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 68 }}>1 rumus{f >= tBeres ? ', beres ✓' : '…'}</Box>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 1. bumper: "Balik lagi di Spreadsheet Gym."                         */
/* ------------------------------------------------------------------ */
const Bumper: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[1].start);
  const lift = Math.sin((f - t0) / 6) * 14;
  return (
    <>
      <At x={540} y={600 + lift} s={pop(f, t0)}>
        <Barbell w={600} />
      </At>
      <At x={540} y={890} s={pop(f, t0 + 5)} r={-2}>
        <Box bg={C.green} pad="18px 44px" style={{ fontFamily: HEAD, fontSize: 84, lineHeight: 1 }}>SPREADSHEET GYM</Box>
      </At>
      <At x={540} y={1100} s={pop(f, t0 + 12)} r={3}>
        <Sticker bg={C.white} size={64}>Sesi {String(EPISODE.n).padStart(2, '0')}</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 2. "Bos kirim data pelanggan… diawali +62… diubah jadi diawali 8… 10 digit, sampai 13 digit." */
/* ------------------------------------------------------------------ */
const BosData: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[2].start);
  const tPlus = s(cue(2, 'plus'));
  const tDelapan = s(cue(2, '8'));
  const t10 = s(cue(2, '10'));
  const t13 = s(cue(2, '13'));
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)}>
        <Bubble who="Bos:">Ubah semua jadi awalan 8 ya</Bubble>
      </At>
      <At {...slideIn(f, t0 + 6, 'right', 540, 830)}>
        <PhoneSheet a={(i) => <Pre n={FULL[i]} on={f >= tPlus ? 1 : 0} />} b={f >= tDelapan ? NUMS.map(() => ({ text: '8…', color: C.sel, bg: '#E3F5FF' })) : []} />
      </At>
      <At x={330} y={1360} s={pop(f, t10)} r={-3}>
        <Chip bg={C.white} size={40}>10 digit</Chip>
      </At>
      <At x={750} y={1360} s={pop(f, t13)} r={3}>
        <Chip bg={C.yellow} size={40}>… sampai 13 digit</Chip>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 3. "Kamu biasanya pakai RIGHT, karena jumlah digitnya sama, jadi tinggal ambil 11 digit dari kanan." */
/* ------------------------------------------------------------------ */
const OLD = ['+6281234567890', '+6285712345678', '+6282212345678'];
const Biasanya: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[3].start);
  const tRight = cue(3, 'right');
  const tSama = s(cue(3, 'sama'));
  const t11 = cue(3, '11');
  const text = '=RIGHT(A2;11)';
  const n = interpolate(f, [s(tRight), s(t11) + 6], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const shown = text.slice(0, Math.floor(n));
  const counted = lin(f, s(t11) + 6, s(t11) + 30);
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.yellow} size={46}>Biasanya…</Sticker>
      </At>
      <At {...slideIn(f, t0 + 2, 'left', 540, 600)}>
        <Box pad="18px 34px" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, color: C.formula, minWidth: 560, textAlign: 'center' }}>
          {shown.split('11').map((p, i) => (i ? [<span key="n" style={{ background: C.yellow, color: C.ink, borderRadius: 8, outline: `3px solid ${C.ink}`, padding: '0 6px' }}>11</span>, p] : p))}
          {n < text.length && <span style={{ display: 'inline-block', width: 5, height: 60, background: C.ink, marginLeft: 4, verticalAlign: 'middle' }} />}
        </Box>
      </At>
      {/* the old data: every number had the same length, so 11 from the right was enough */}
      <At x={540} y={1010} s={pop(f, tSama - 4)}>
        <Box pad="18px 28px" style={{ width: 900, boxSizing: 'border-box' }}>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, marginBottom: 10 }}>Data lama: digitnya sama semua</div>
          {OLD.map((num) => (
            <div key={num} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, lineHeight: 1.45 }}>
              <span style={{ color: '#999' }}>{num.slice(0, 3)}</span>
              <span style={{ background: counted > 0 ? GREEN : 'transparent', borderRadius: 6 }}>{num.slice(3)}</span>
              <span style={{ fontFamily: BODY, fontSize: 30, marginLeft: 16, opacity: counted }}>← 11 digit</span>
            </div>
          ))}
        </Box>
      </At>
      <At x={540} y={1400} s={pop(f, s(t11))} r={2}>
        <Chip bg={C.green} size={38}>ambil 11 dari kanan ✓</Chip>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 4. "Tapi untuk data baru ini hasilnya beda-beda: masih nyisa 62, masih nyisa 2, malah kepotong." */
/* ------------------------------------------------------------------ */
const Salah: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[4].start);
  const tFill = s(cue(4, 'hasilnya'));
  const t62 = s(cue(4, 'nyisa', 0));
  const t2 = s(cue(4, 'nyisa', 1));
  const tCut = s(cue(4, 'kepotong'));
  const flag = (v: string) => (v === '62' ? t62 : v === '2' ? t2 : v === 'cut' ? tCut : 99999);
  const b: Cell[] = RIGHT11.map((r, i) => {
    if (f < tFill + i * 4) return { text: '' };
    const v = VERDICT[i];
    if (v === 'ok') return { text: r, bg: GREEN };
    const on = f >= flag(v);
    // show the wrong part: the stray "62"/"2" in front, or the cut-off digits
    const body = v === 'cut' ? r : (
      <span><span style={{ color: on ? C.red : undefined, background: on ? '#FFD4D4' : undefined, borderRadius: 4 }}>{v}</span>{r.slice(v.length)}</span>
    );
    return { text: body, bg: on ? '#FFE3E3' : undefined, color: v === 'cut' && on ? C.red : undefined };
  });
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.red} size={46} style={{ color: C.white }}>Data baru, hasilnya beda-beda</Sticker>
      </At>
      <At {...slideIn(f, t0 + 2, 'bottom', 540, 800)}>
        <PhoneSheet bar={<Fx text="=RIGHT(A2;11)" />} colB="RIGHT(…;11)" b={b} />
      </At>
      <At x={250} y={1320} s={pop(f, t62)} r={-3}>
        <Chip bg="#FFD4D4" size={32}>nyisa 62</Chip>
      </At>
      <At x={540} y={1320} s={pop(f, t2)} r={2}>
        <Chip bg="#FFD4D4" size={32}>nyisa 2</Chip>
      </At>
      <At x={830} y={1320} s={pop(f, tCut)} r={-2}>
        <Chip bg={C.red} size={32}>kepotong</Chip>
      </At>
      <At x={540} y={1450} s={pop(f, tCut + 10)}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34 }}>
          <span style={{ background: '#FFD4D4', padding: '0 8px', borderRadius: 6 }}>+62857123456789 → 57123456789</span>
        </div>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 5. "Gimana caranya bikin satu formula… jadi format yang seragam? Pause dulu." + 3 s countdown */
/* ------------------------------------------------------------------ */
export const TIMER_START = () => PARTS[5].end + 0.15;
export const TIMER_LEN = 3;

const Pause: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[5].start);
  const tPause = s(cue(5, 'pause'));
  const a = s(TIMER_START());
  const p = lin(f, a, a + s(TIMER_LEN));
  const left = Math.max(0, Math.ceil(TIMER_LEN - (f - a) / 30));
  const done = f >= a + s(TIMER_LEN);
  const R = 230;
  const L = 2 * Math.PI * R;
  const beat = f >= a && !done ? 1 + 0.04 * Math.max(0, 1 - ((f - a) % 30) / 8) : 1;
  const q = 1 - lin(f, tPause - 4, tPause + 4);
  return (
    <>
      {/* the question first */}
      <At x={540} y={760} s={pop(f, t0)} o={q}>
        <Box bg={C.blue} pad="30px 40px" style={{ width: 900, boxSizing: 'border-box', textAlign: 'center' }}>
          <div style={{ fontFamily: HEAD, fontSize: 64, lineHeight: 1.1 }}>Gimana caranya?</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 42, marginTop: 16 }}>1 formula buat semua panjang → format seragam</div>
        </Box>
      </At>
      {/* then the timer */}
      <At x={540} y={320} s={pop(f, tPause)} r={-3}>
        <Box bg={C.yellow} pad="18px 44px" style={{ fontFamily: HEAD, fontSize: 80 }}>PAUSE DULU</Box>
      </At>
      <At x={540} y={880} s={pop(f, tPause + 4) * beat}>
        <div style={{ position: 'relative', width: 2 * R + 80, height: 2 * R + 80 }}>
          <svg width={2 * R + 80} height={2 * R + 80} style={{ position: 'absolute', inset: 0 }}>
            <circle cx={R + 40} cy={R + 40} r={R + 26} fill={C.white} stroke={C.ink} strokeWidth={BORDER} />
            <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={C.head} strokeWidth={34} />
            <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={done ? C.yellow : C.green} strokeWidth={34} strokeDasharray={L} strokeDashoffset={L * p} transform={`rotate(-90 ${R + 40} ${R + 40})`} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: HEAD, fontSize: done ? 120 : 220, lineHeight: 1 }}>{done ? 'WAKTU!' : f < a ? TIMER_LEN : left}</div>
            {!done && <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34 }}>detik</div>}
          </div>
        </div>
      </At>
      <At x={540} y={1400} s={pop(f, tPause + 8)}>
        <Chip bg={C.white} size={38}>Tebak rumusnya di komen</Chip>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 6. "Jawabannya, gabungin RIGHT dan LEN. Tulis di B2: =RIGHT(A2; LEN(A2) kurangi 3)." */
/* ------------------------------------------------------------------ */
const MAIN = '=RIGHT(A2;LEN(A2)-3)';
const Jawaban: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[6].start);
  const tGabung = s(cue(6, 'right'));
  const tLen0 = s(cue(6, 'len'));
  const steps: [number, number][] = [
    [cue(6, 'sama'), 1], // "="
    [cue(6, 'right', 1), 7], // "=RIGHT("
    [cue(6, 'a2'), 10], // "A2;"
    [cue(6, 'len', 1), 14], // "LEN("
    [cue(6, 'a2', 1), 17], // "A2)"
    [cue(6, 'kurangi'), 20], // "-3)" (the closing bracket comes with the 3)
  ];
  let n = 0;
  steps.forEach(([t, k], i) => {
    const prev = i ? steps[i - 1][1] : 0;
    n = Math.max(n, interpolate(f, [s(t), s(t) + 8], [prev, k], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    if (f < s(t)) n = Math.min(n, prev);
  });
  const done = n >= MAIN.length;
  const shown = MAIN.slice(0, Math.floor(n));
  const tDone = steps[5][0] + 0.45;
  return (
    <>
      <At x={360} y={290} s={pop(f, tGabung)} r={-2}>
        <Box bg={C.green} pad="14px 36px" style={{ fontFamily: HEAD, fontSize: 70 }}>RIGHT</Box>
      </At>
      <At x={560} y={290} s={pop(f, tLen0 - 4)}>
        <div style={{ fontFamily: HEAD, fontSize: 64 }}>+</div>
      </At>
      <At x={740} y={290} s={pop(f, tLen0)} r={2}>
        <Box bg={C.yellow} pad="14px 36px" style={{ fontFamily: HEAD, fontSize: 70 }}>LEN</Box>
      </At>
      <At {...slideIn(f, t0 + 2, 'right', 540, 860)}>
        <PhoneSheet
          selected="B2"
          bar={<Fx text={done ? MAIN : shown} />}
          refs={!done && shown.includes('A2') ? [{ cells: ['A2'], color: C.sel }] : []}
          b={NUMS.map((num, i) => (i === 0 ? (done && f >= s(tDone) ? { text: num, bg: GREEN } : { text: <span style={{ fontSize: 30 }}><Fx text={shown} caret={f % 30 < 18} /></span> }) : { text: '' }))}
        />
      </At>
      <At x={540} y={1440} s={pop(f, s(tDone))} r={-2}>
        <Chip bg={C.green} size={40}>+62812345678 → 812345678 ✓</Chip>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 7. "LEN menghitung panjang teksnya, dikurangi 3 karena kita mau menghilangkan 3 karakter." */
/* ------------------------------------------------------------------ */
const Counter: React.FC<{ num: string; upto: number; red?: number }> = ({ num, upto, red = 0 }) => (
  <div style={{ display: 'flex', gap: 6 }}>
    {num.split('').map((ch, i) => (
      <div key={i} style={{ width: 62, textAlign: 'center' }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 52, background: i < red ? '#FFD4D4' : i < upto ? GREEN : C.white, color: i < red ? C.red : C.ink, border: `3px solid ${C.ink}`, borderRadius: 8 }}>{ch}</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, opacity: i < upto ? 1 : 0, marginTop: 4 }}>{i + 1}</div>
      </div>
    ))}
  </div>
);

const LenCount: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[7].start);
  const tLen = s(cue(7, 'len'));
  const tKurang = s(cue(7, 'dikurangi'));
  const tHilang = s(cue(7, 'menghilangkan'));
  const num = FULL[0];
  const upto = Math.floor(interpolate(f, [tLen + 4, tLen + 40], [0, num.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Box bg={C.yellow} pad="14px 40px" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 60 }}>LEN(A2)</Box>
      </At>
      <At {...slideIn(f, t0 + 2, 'left', 540, 680, 0.95)}>
        <Box pad="28px 26px">
          <Counter num={num} upto={upto} red={f >= tHilang ? 3 : 0} />
        </Box>
      </At>
      <At x={540} y={960} s={pop(f, tLen + 40)}>
        <div style={{ fontFamily: HEAD, fontSize: 72 }}>LEN = {num.length}</div>
      </At>
      <At x={540} y={1150} s={pop(f, tKurang)} r={2}>
        <Box bg="#FFD4D4" pad="14px 36px" style={{ fontFamily: HEAD, fontSize: 60 }}>{num.length} − 3 = {num.length - 3}</Box>
      </At>
      <At x={540} y={1360} s={pop(f, tHilang)} r={-2}>
        <Chip bg={C.white} size={38}>"+62" = 3 karakter dibuang</Chip>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 8. "Jadi RIGHT ngambil semua, kecuali karakter +62, 3 karakter dari depan." */
/* ------------------------------------------------------------------ */
const Kecuali: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[8].start);
  const tSemua = s(cue(8, 'semua'));
  const tKecuali = s(cue(8, 'kecuali'));
  const tDepan = s(cue(8, 'depan'));
  const num = FULL[0];
  const away = interpolate(f, [tDepan, tDepan + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Box bg={C.green} pad="14px 40px" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 50 }}>RIGHT(A2; 12−3)</Box>
      </At>
      <At {...slideIn(f, t0 + 2, 'right', 540, 680, 0.95)}>
        <Box pad="28px 26px">
          <div style={{ display: 'flex', gap: 6 }}>
            {num.split('').map((ch, i) => {
              const front = i < 3;
              return (
                <div key={i} style={{
                  width: 62, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 52, borderRadius: 8, border: `3px solid ${C.ink}`,
                  background: front ? (f >= tKecuali ? '#FFD4D4' : C.white) : f >= tSemua ? GREEN : C.white, color: front && f >= tKecuali ? C.red : C.ink,
                  transform: front ? `translate(${-away * 200}px, ${away * 120}px) rotate(${-away * 30}deg)` : undefined, opacity: front ? 1 - away : 1,
                }}>
                  {ch}
                </div>
              );
            })}
          </div>
        </Box>
      </At>
      <At x={760} y={900} s={pop(f, tSemua)} r={3}>
        <Chip bg={C.green} size={38}>ambil 9 dari kanan</Chip>
      </At>
      <At x={300} y={900} s={pop(f, tKecuali)} r={-3}>
        <Chip bg="#FFD4D4" size={38}>kecuali +62</Chip>
      </At>
      <At x={540} y={1200} s={pop(f, tDepan + 14)}>
        <Box pad="14px 34px" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 60, background: GREEN }}>{NUMS[0]}</Box>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 9. "Nomornya 12 karakter, ambil 9. Kalau 15 karakter, ambil 12. Otomatis ngikutin panjangnya." */
/* ------------------------------------------------------------------ */
const Panjang: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[9].start);
  const t12 = s(cue(9, '12'));
  const t15 = s(cue(9, '15'));
  const tOto = s(cue(9, 'otomatis'));
  const row = (num: string, t: number, dir: Dir, y: number) => (
    <At {...slideIn(f, t - 4, dir, 540, y)}>
      <Box pad="20px 28px" style={{ width: 940, boxSizing: 'border-box' }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44 }}>
          <span style={{ color: C.red, textDecoration: f >= t + 20 ? 'line-through' : undefined }}>+62</span>{num.slice(3)}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 12, alignItems: 'center' }}>
          <Chip bg={C.yellow} size={30}>LEN {num.length}</Chip>
          <span style={{ fontFamily: HEAD, fontSize: 34 }}>→</span>
          <Chip bg={GREEN} size={30}>ambil {num.length - 3}</Chip>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, opacity: lin(f, t + 20, t + 26), background: GREEN, padding: '0 8px', borderRadius: 6 }}>{num.slice(3)}</span>
        </div>
      </Box>
    </At>
  );
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.yellow} size={50}>Panjang apa pun</Sticker>
      </At>
      {row(FULL[0], t12, 'left', 620)}
      {row(FULL[3], t15, 'right', 940)}
      <At x={540} y={1300} s={pop(f, tOto, 220)} r={2}>
        <Box bg={C.green} pad="14px 40px" style={{ fontFamily: HEAD, fontSize: 56 }}>Otomatis ngikutin</Box>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 10. "Kamu juga bisa bungkus pakai ARRAYFORMULA, biar ada data baru, nggak perlu narik lagi." */
/* ------------------------------------------------------------------ */
const AF = '=ARRAYFORMULA(IF(A2:A="";"";RIGHT(A2:A;LEN(A2:A)-3)))';
const Array_: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[10].start);
  const tAf = s(cue(10, 'arrayformula'));
  const tBaru = s(cue(10, 'baru'));
  const tNarik = s(cue(10, 'narik'));
  return (
    <>
      <At x={540} y={290} s={pop(f, tAf - 4)} r={-2}>
        <Box bg={C.green} pad="14px 40px" style={{ fontFamily: HEAD, fontSize: 64 }}>+ ARRAYFORMULA</Box>
      </At>
      <At {...slideIn(f, t0 + 2, 'bottom', 540, 860, 0.95)}>
        <PhoneSheet
          bar={f >= tAf ? <span style={{ fontSize: 26 }}><Fx text={AF} /></span> : <Fx text={MAIN} />}
          b={NUMS.map((_, i) => (f >= tAf ? filledB(f, cue(10, 'arrayformula') + 0.3, i) : i === 0 ? { text: NUMS[0], bg: GREEN } : { text: '' }))}
          extra={lin(f, tBaru, tBaru + 10)}
          extraB={f >= tBaru + 14 ? { text: '81234567890', bg: C.green } : { text: '' }}
        />
      </At>
      <At x={540} y={1450} s={pop(f, tNarik)} r={2}>
        <Chip bg={C.white} size={38}>Data baru? Nggak perlu narik lagi ✓</Chip>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 11. "Intinya: jangan pakai angka tetap, tapi biarin LEN menghitung karakternya…" */
/* ------------------------------------------------------------------ */
const Intinya: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[11].start);
  const tTetap = s(cue(11, 'tetap'));
  const tLen = s(cue(11, 'len'));
  const tPotong = s(cue(11, 'dipotong'));
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.ink} size={52} style={{ color: C.green }}>Intinya</Sticker>
      </At>
      <At {...slideIn(f, t0 + 4, 'left', 540, 600)}>
        <Box pad="16px 36px" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 58, color: C.formula }}>
          <span style={{ textDecoration: f >= tTetap ? 'line-through' : undefined, textDecorationColor: C.red, textDecorationThickness: 6 }}>=RIGHT(A2;<span style={{ background: f >= tTetap ? '#FFD4D4' : 'transparent', color: C.red }}>11</span>)</span>
        </Box>
      </At>
      <At x={540} y={760} s={pop(f, tTetap)}>
        <Chip bg="#FFD4D4" size={36}>✗ angka tetap</Chip>
      </At>
      <At {...slideIn(f, tLen - 4, 'right', 540, 960)}>
        <Box bg={GREEN} pad="16px 36px" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 58, color: C.formula }}>
          =RIGHT(A2;<span style={{ background: C.yellow, color: C.ink, borderRadius: 8, padding: '0 6px' }}>LEN(A2)-3</span>)
        </Box>
      </At>
      <At x={540} y={1130} s={pop(f, tLen)}>
        <Chip bg={C.green} size={36}>✓ biarin LEN yang ngitung</Chip>
      </At>
      <At x={540} y={1330} s={pop(f, tPotong)} r={2}>
        <Sticker bg={C.yellow} size={36}>LEN tahu mana yang dipotong</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 12. "Sekarang latihan: ubah semua nomor HP jadi format 08, pakai satu formula aja." */
/* ------------------------------------------------------------------ */
const Latihan: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[12].start);
  const t08 = s(cue(12, '08'));
  const tSatu = s(cue(12, 'satu'));
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Box bg={C.yellow} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 70 }}>LATIHAN</Box>
      </At>
      <At {...slideIn(f, t0 + 4, 'left', 540, 820)}>
        <PhoneSheet title="latihan.xlsx" colB="Format 08xx" selected="B2" bar={f >= tSatu ? <Fx text="=??? (1 formula)" /> : ''} b={NUMS.map(() => ({ text: f >= t08 ? '?' : '', color: C.sel, bg: f >= t08 ? '#E3F5FF' : undefined }))} />
      </At>
      <At x={540} y={1330} s={pop(f, t08)} r={2}>
        <Chip bg={C.blue} size={40}>+62812345678 → 0812345678</Chip>
      </At>
      <At x={540} y={1460} s={pop(f, tSatu)} r={-2}>
        <Chip bg={C.white} size={34}>pakai satu formula aja</Chip>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 13. "Taruh jawabannya di komentar."                                 */
/* ------------------------------------------------------------------ */
const Komentar: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[13].start);
  return (
    <>
      <At x={540} y={700} s={pop(f, t0)}>
        <div style={{ position: 'relative' }}>
          <Box pad="26px 40px" radius={34} style={{ width: 860, boxSizing: 'border-box' }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Komentar</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 52, color: C.formula }}>="0"&amp;… <span style={{ background: C.yellow, color: C.ink, padding: '0 10px', border: `3px solid ${C.ink}`, borderRadius: 8 }}>?</span></div>
          </Box>
          <div style={{ position: 'absolute', left: 70, bottom: -34, width: 0, height: 0, borderLeft: '24px solid transparent', borderRight: '24px solid transparent', borderTop: `38px solid ${C.ink}` }} />
        </div>
      </At>
      <At x={540} y={1000} s={pop(f, t0 + 8)} r={2}>
        <Sticker bg={C.green} size={52}>Jawab di komentar</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 14. "Like dan save biar nggak lupa. Share… Jangan lupa follow, biar dapat latihan lainnya." */
/* ------------------------------------------------------------------ */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[14].start);
  const tShare = s(cue(14, 'share', 1));
  const tFollow = s(cue(14, 'follow'));
  const tLatihan = s(cue(14, 'latihan'));
  const fly = lin(f, tShare + 10, tShare + 30);
  const cx = interpolate(f, [tFollow - 12, tFollow + 6], [900, 730], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cy = interpolate(f, [tFollow - 12, tFollow + 6], [1420, 1290], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tap = f >= tFollow + 8;
  const press = 1 - 0.06 * between(f, tFollow + 6, tFollow + 12, 3);
  return (
    <>
      <At x={330} y={380} s={pop(f, t0, 220)} r={-6}>
        <Heart size={170} on={f >= t0 + 8} />
      </At>
      <At x={750} y={380} s={pop(f, t0 + 10, 220)} r={6}>
        <Bookmark size={170} on={f >= t0 + 18} />
      </At>
      <At x={540} y={600} s={pop(f, t0 + 4)}>
        <div style={{ fontFamily: HEAD, fontSize: 50 }}>Like &amp; save biar gak lupa</div>
      </At>
      <At x={540} y={880} s={pop(f, tShare)}>
        <Box pad="22px 30px" style={{ width: 920, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 26 }}>
          <div style={{ transform: `translate(${fly * 8}px, ${-fly * 14}px) rotate(${fly * 8}deg)`, marginRight: 10 }}>
            <Plane size={100} />
          </div>
          <div>
            <div style={{ fontFamily: HEAD, fontSize: 48 }}>Share</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34 }}>ke temen yang masih format nomor HP manual</div>
          </div>
        </Box>
      </At>
      <At x={540} y={1200} s={pop(f, tFollow - 6) * press}>
        <div style={{ background: tap ? C.white : C.green, border: `${BORDER}px solid ${C.ink}`, borderRadius: 24, boxShadow: shadow(tap ? 4 : 12), padding: '22px 60px', fontFamily: HEAD, fontSize: 60 }}>
          {tap ? 'Following ✓' : '+ Follow'}
        </div>
      </At>
      <At x={cx} y={cy} o={lin(f, tFollow - 12, tFollow - 6)} z={5}>
        <Cursor />
      </At>
      <At x={540} y={1420} s={pop(f, tLatihan)} r={2}>
        <Sticker bg={C.yellow} size={38}>biar dapat latihan lainnya</Sticker>
      </At>
    </>
  );
};

const LIST = [Hook, Bumper, BosData, Biasanya, Salah, Pause, Jawaban, LenCount, Kecuali, Panjang, Array_, Intinya, Latihan, Komentar, Cta];

export const SCENES: { from: number; to: number; C: React.FC }[] = LIST.map((Comp, i) => ({
  from: i === 0 ? 0 : PARTS[i].start - 0.15,
  to: i + 1 < PARTS.length ? PARTS[i + 1].start - 0.15 : 9999,
  C: Comp,
}));

/** sound-effect cue times (seconds) that match the pops above */
export const POPS: number[] = [
  cue(0, 'beda'), cue(0, 'satu'),
  PARTS[2].start, cue(2, '10'), cue(2, '13'),
  PARTS[3].start, cue(3, '11'),
  PARTS[4].start, cue(4, 'nyisa', 0), cue(4, 'nyisa', 1), cue(4, 'kepotong'),
  PARTS[5].start, cue(5, 'pause'),
  cue(6, 'right'), cue(6, 'len'),
  PARTS[7].start, cue(7, 'dikurangi'), cue(7, 'menghilangkan'),
  PARTS[8].start, cue(8, 'semua'), cue(8, 'kecuali'),
  PARTS[9].start, cue(9, '12'), cue(9, '15'),
  cue(10, 'arrayformula'), cue(10, 'narik'),
  PARTS[11].start, cue(11, 'tetap'), cue(11, 'len'), cue(11, 'dipotong'),
  PARTS[12].start, cue(12, '08'), cue(12, 'satu'),
  PARTS[13].start,
  PARTS[14].start, cue(14, 'share', 1), cue(14, 'follow') + 0.3, cue(14, 'latihan'),
];
export const DINGS: number[] = [cue(6, 'kurangi') + 0.45, TIMER_START() + TIMER_LEN, cue(9, 'otomatis'), cue(10, 'baru') + 0.5, cue(14, 'follow') + 0.3];
export const THUDS: number[] = [cue(0, 'beda'), cue(4, 'kepotong'), cue(8, 'depan')];
export const WHISTLE = PARTS[1].start - 0.05;
export const TICKS: number[] = Array.from({ length: TIMER_LEN }, (_, i) => TIMER_START() + i);
