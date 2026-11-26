import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { At, Box, Sticker, between, ease, lin, pop } from './components';
import { Fx, SheetUI } from './Sheet';
import { BODY, BORDER, C, EPISODE, EPISODE_LABEL, HEAD, MONO, PARTS, cue, s, shadow } from './theme';

/*
 * One scene per VO part (Spreadsheet Gym format from brand/segment-kit.html):
 *  0 hook · 1 opening line · 2 warm-up (office problem) · 3 "pause dulu" + 10 s timer
 *  4-6 the moves (formula, function, gym analogy) · 7 takeaway · 8 repetisi · 9 cool-down
 * Every time is in absolute seconds from the VO word timestamps (cue(part, word)).
 */

const typed = (f: number, a: number, b: number, len: number) =>
  interpolate(f, [s(a), s(b)], [0, len], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* ------------------------------------------------------------------ */
/* brand drawings                                                      */
/* ------------------------------------------------------------------ */
/** Spreadsheet Gym logo: barbell whose plates are table cells and whose bar says "fx" */
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

/** weight plate in its official color: 5 kg white, 10 kg green, 20 kg blue */
const Plate: React.FC<{ kg: number; size?: number }> = ({ kg, size = 300 }) => {
  const color = kg === 20 ? C.blue : kg === 10 ? C.green : C.white;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(10), display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: size * 0.12, borderRadius: '50%', border: `4px solid ${C.ink}` }} />
      <div style={{ width: size * 0.16, height: size * 0.16, borderRadius: '50%', background: C.ink, position: 'absolute' }} />
      <div style={{ position: 'absolute', top: size * 0.2, fontFamily: HEAD, fontSize: size * 0.17 }}>{kg} KG</div>
      <div style={{ position: 'absolute', bottom: size * 0.2, fontFamily: MONO, fontWeight: 700, fontSize: size * 0.08 }}>DASAR</div>
    </div>
  );
};

const Tag: React.FC<{ ok: boolean; children: React.ReactNode; size?: number }> = ({ ok, children, size = 28 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ok ? C.green : C.red, border: `4px solid ${C.ink}`, borderRadius: 12, padding: '4px 14px', fontFamily: HEAD, fontSize: size, color: C.ink, whiteSpace: 'nowrap' }}>
    {ok ? '✓' : '✗'} {children}
  </span>
);

const Bubble: React.FC<{ who: string; children: React.ReactNode; bg?: string }> = ({ who, children, bg = C.white }) => (
  <div style={{ position: 'relative' }}>
    <Box bg={bg} pad="18px 28px" radius={26} style={{ maxWidth: 820 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, marginBottom: 6 }}>{who}</div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 44, lineHeight: 1.15 }}>{children}</div>
    </Box>
    <div style={{ position: 'absolute', left: 50, bottom: -30, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `34px solid ${C.ink}` }} />
  </div>
);

/* ------------------------------------------------------------------ */
/* the practice sheet shared by the warm-up and the moves              */
/* ------------------------------------------------------------------ */
const LONG = '=A1+A2+A3+A4+A5';
const SHORT = '=SUM(A1:A5)';
const SALES = ['120', '95', '140', '80', '165']; // penjualan Senin–Jumat (rb)
const REF_COLORS: Record<string, string> = { A1: C.sel, A2: '#D6249F', A3: '#E37400', A4: '#188038', A5: '#9334E6' };

const PracticeSheet: React.FC<{
  a6: React.ReactNode; b6: React.ReactNode; selected?: string; bar: React.ReactNode; refs?: { cells: string[]; color: string }[];
  a6bg?: string; b6bg?: string; labels: number;
}> = ({ a6, b6, selected, bar, refs = [], a6bg, b6bg, labels }) => (
  <SheetUI
    title="penjualan.xlsx"
    cols={2}
    rows={7}
    rowH={70}
    colW={[454, 444]}
    selected={selected}
    nameBox={selected ?? 'A6'}
    cells={{
      A1: SALES[0], A2: SALES[1], A3: SALES[2], A4: SALES[3], A5: SALES[4],
      A6: a6, B6: b6,
      A7: <span style={{ opacity: labels }}>↑ Kamu</span>,
      B7: <span style={{ opacity: labels }}>↑ Temen kamu</span>,
    }}
    cellStyle={{
      A6: { justifyContent: 'flex-start', fontSize: 34, background: a6bg },
      B6: { justifyContent: 'flex-start', fontSize: 34, background: b6bg },
      A7: { justifyContent: 'flex-start', fontFamily: BODY, fontWeight: 700, fontSize: 32 },
      B7: { justifyContent: 'flex-start', fontFamily: BODY, fontWeight: 700, fontSize: 32 },
    }}
    refs={refs}
    bar={bar}
  />
);

/* ------------------------------------------------------------------ */
/* 0. hook                                                             */
/* ------------------------------------------------------------------ */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[0].start);
  const tF = s(cue(0, 'formula'));
  const tFn = s(cue(0, 'function'));
  const tBeda = s(cue(0, 'beda'));
  const shake = f > tBeda ? Math.sin((f - tBeda) * 1.3) * 6 * (1 - lin(f, tBeda, tBeda + 18)) : 0;
  return (
    <>
      <At x={540} y={400} s={pop(f, t0)} r={-4}>
        <Sticker bg={C.red} size={58} style={{ color: C.white }}>Jangan salah lagi!</Sticker>
      </At>
      <At x={540} y={560} s={pop(f, t0 + 8)} o={lin(f, t0 + 8, t0 + 12)}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40 }}>di Excel atau Spreadsheet…</div>
      </At>
      <At x={540 + shake} y={780} s={pop(f, tF)} r={-2}>
        <Box bg={C.green} pad="26px 60px" style={{ fontFamily: HEAD, fontSize: 104 }}>FORMULA</Box>
      </At>
      <At x={540} y={975} s={pop(f, tBeda, 220)} z={2}>
        <div style={{ width: 170, height: 170, borderRadius: 85, background: C.yellow, border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(9), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 120, lineHeight: 1 }}>≠</div>
      </At>
      <At x={540 - shake} y={1170} s={pop(f, tFn)} r={2}>
        <Box bg={C.blue} pad="26px 60px" style={{ fontFamily: HEAD, fontSize: 104 }}>FUNCTION</Box>
      </At>
      <At x={540} y={1370} s={pop(f, tBeda + 4)} r={-3}>
        <Sticker bg={C.ink} size={54} style={{ color: C.yellow }}>Itu beda!</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 1. opening line: "Spreadsheet Gym, sesi 01. Beban hari ini: 5 kilo." */
/* ------------------------------------------------------------------ */
const Opening: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[1].start);
  const tSesi = s(cue(1, 'sesi'));
  const tBeban = s(cue(1, 'beban'));
  const lift = Math.sin((f - t0) / 6) * 14;
  const roll = interpolate(f, [tBeban, tBeban + 18], [520, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <>
      <At x={540} y={520 + lift} s={pop(f, t0)}>
        <Barbell w={560} />
      </At>
      <At x={540} y={790} s={pop(f, t0 + 5)} r={-2}>
        <Box bg={C.green} pad="18px 44px" style={{ fontFamily: HEAD, fontSize: 84, lineHeight: 1 }}>SPREADSHEET GYM</Box>
      </At>
      <At x={540} y={960} s={pop(f, tSesi)} r={3}>
        <Sticker bg={C.white} size={50}>Sesi {String(EPISODE.n).padStart(2, '0')}</Sticker>
      </At>
      <At x={540 + roll} y={1260} r={roll * 0.6} o={f >= tBeban ? 1 : 0}>
        <Plate kg={EPISODE.kg} size={340} />
      </At>
      <At x={540} y={1490} s={pop(f, tBeban + 16)}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40 }}>Beban hari ini</div>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 2. warm-up: the office problem                                      */
/* ------------------------------------------------------------------ */
const WarmUp: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = PARTS[2].start;
  const tKamu = cue(2, 'kamu');
  const tTemen = cue(2, 'temen');
  const tMana = cue(2, 'mana');
  const tFn = cue(2, 'function', 99, 99);
  const n1 = typed(f, tKamu + 0.6, tKamu + 3.4, LONG.length);
  const n2 = typed(f, tTemen + 0.6, tTemen + 2.2, SHORT.length);
  const onB = f >= s(tTemen);
  const shown1 = LONG.slice(0, Math.floor(n1));
  const shown2 = SHORT.slice(0, Math.floor(n2));
  const refs = onB
    ? shown2.includes('A1:A5') && n2 < SHORT.length ? [{ cells: ['A1', 'A2', 'A3', 'A4', 'A5'], color: C.sel }] : []
    : n1 < LONG.length ? Object.entries(REF_COLORS).filter(([a]) => shown1.includes(a)).map(([a, color]) => ({ cells: [a], color })) : [];
  const caret = f % 30 < 18;
  const q = (t: number) => pop(f, s(t));
  return (
    <>
      <At x={760} y={262} s={pop(f, s(t0))} r={3}>
        <Sticker bg={C.yellow} size={40}>Pemanasan</Sticker>
      </At>
      <At x={540} y={420} s={pop(f, s(t0) + 6)}>
        <Bubble who="Bos:">Tolong totalin penjualan 5 hari ya</Bubble>
      </At>
      <At x={540} y={940} s={0.5 + 0.5 * pop(f, s(t0) + 10)}>
        <PracticeSheet
          selected={onB ? 'B6' : 'A6'}
          a6={f >= s(tKamu) ? <Fx text={LONG} n={n1} colors={REF_COLORS} caret={!onB && n1 < LONG.length && caret} /> : ''}
          b6={onB ? <Fx text={SHORT} n={n2} caret={n2 < SHORT.length && caret} /> : ''}
          bar={onB ? <Fx text={SHORT} n={n2} /> : f >= s(tKamu) ? <Fx text={LONG} n={n1} colors={REF_COLORS} /> : ''}
          refs={refs}
          labels={lin(f, s(tKamu) + 10, s(tKamu) + 16)}
          b6bg={undefined}
        />
      </At>
      <At x={300} y={1420} s={q(tMana)} r={-4}>
        <Sticker bg={C.green} size={46}>Formula?</Sticker>
      </At>
      <At x={790} y={1420} s={q(tFn < 99 ? tFn : tMana + 0.8)} r={4}>
        <Sticker bg={C.blue} size={46}>Function?</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 3. "pause dulu": 10-second countdown                                */
/* ------------------------------------------------------------------ */
export const TIMER_START = () => PARTS[3].end + 0.15;
export const TIMER_LEN = 10;

const Pause: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[3].start);
  const a = s(TIMER_START());
  const p = lin(f, a, a + s(TIMER_LEN));
  const left = Math.max(0, Math.ceil(TIMER_LEN - (f - a) / 30));
  const done = f >= a + s(TIMER_LEN);
  const R = 230;
  const L = 2 * Math.PI * R;
  const beat = f >= a && !done ? 1 + 0.04 * Math.max(0, 1 - ((f - a) % 30) / 8) : 1;
  return (
    <>
      <At x={540} y={330} s={pop(f, t0)} r={-3}>
        <Box bg={C.yellow} pad="18px 44px" style={{ fontFamily: HEAD, fontSize: 80 }}>PAUSE DULU</Box>
      </At>
      <At x={540} y={480} s={pop(f, t0 + 8)}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 42 }}>Tebak dulu sebelum lanjut</div>
      </At>
      <At x={540} y={840} s={pop(f, t0 + 4) * beat}>
        <div style={{ position: 'relative', width: 2 * R + 80, height: 2 * R + 80 }}>
          <svg width={2 * R + 80} height={2 * R + 80} style={{ position: 'absolute', inset: 0 }}>
            <circle cx={R + 40} cy={R + 40} r={R + 26} fill={C.white} stroke={C.ink} strokeWidth={BORDER} />
            <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={C.head} strokeWidth={34} />
            <circle
              cx={R + 40} cy={R + 40} r={R} fill="none" stroke={done ? C.yellow : C.green} strokeWidth={34}
              strokeDasharray={L} strokeDashoffset={L * p} transform={`rotate(-90 ${R + 40} ${R + 40})`}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: HEAD, fontSize: done ? 120 : 220, lineHeight: 1 }}>{done ? 'WAKTU!' : f < a ? 10 : left}</div>
            {!done && <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34 }}>detik</div>}
          </div>
        </div>
      </At>
      <At x={540} y={1250} s={pop(f, t0 + 14)}>
        <Box pad="14px 26px" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 900, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 38 }}>
            <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30 }}>Kamu</span>
            <Fx text={LONG} colors={REF_COLORS} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 38 }}>
            <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30 }}>Temen</span>
            <Fx text={SHORT} />
          </div>
        </Box>
      </At>
      <At x={540} y={1450} s={pop(f, t0 + 20)} r={2}>
        <Sticker bg={C.blue} size={38}>Mana formula, mana function?</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 4. move 1: formula = anything that starts with "="                   */
/* ------------------------------------------------------------------ */
const MoveFormula: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[4].start);
  const tKetik = s(cue(4, 'ketik'));
  const tSama = s(cue(4, 'sama'));
  const tDua = s(cue(4, 'dua'));
  const eq = lin(f, tSama, tSama + 6);
  const both = f >= tDua;
  return (
    <>
      <At x={540} y={250} s={pop(f, t0)} r={-2}>
        <Box bg={C.green} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 70 }}>FORMULA</Box>
      </At>
      <At x={540} y={800}>
        <PracticeSheet
          selected={f >= tKetik ? (Math.floor((f - tKetik) / 24) % 2 ? 'B6' : 'A6') : undefined}
          a6={<Fx text={LONG} colors={REF_COLORS} markEq={eq} />}
          b6={<Fx text={SHORT} markEq={eq} />}
          bar={<Fx text={f >= tKetik && Math.floor((f - tKetik) / 24) % 2 ? SHORT : LONG} colors={REF_COLORS} markEq={eq} />}
          a6bg={both ? '#C9F9D5' : undefined}
          b6bg={both ? '#C9F9D5' : undefined}
          labels={1}
        />
      </At>
      <At x={540} y={1290} s={pop(f, tSama)} r={-2}>
        <Sticker bg={C.yellow} size={44}>Diawali tanda “=” → formula</Sticker>
      </At>
      <At x={540} y={1440} s={pop(f, tDua)} r={2}>
        <Sticker bg={C.green} size={50}>✓ Dua-duanya formula</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 5. move 2: function = ready-made formula with a name + parentheses   */
/* ------------------------------------------------------------------ */
const FUNCS: [string, string][] = [
  ['SUM', 'Menjumlahkan angka'],
  ['AVERAGE', 'Rata-rata'],
  ['VLOOKUP', 'Cari data di tabel'],
];

const MoveFunction: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[5].start);
  const tRumus = s(cue(5, 'rumus'));
  const tNama = s(cue(5, 'nama'));
  const tKurung = s(cue(5, 'kurung'));
  const kayak = cue(5, 'kayak');
  const tKayak = s(kayak);
  const hl = [cue(5, 'sum', 0, 99), cue(5, 'average', 0, 99), cue(5, 'vlookup', 0, 99)].map((t, i) => (t - PARTS[5].start > 90 ? kayak + 0.4 + i * 0.7 : t));
  let active = -1;
  hl.forEach((t, i) => f >= s(t) && (active = i));
  const tTemen = s(cue(5, 'temen'));
  const parOn = f >= tKurung;
  const par = (ch: string) => <span style={{ background: parOn ? C.pink : 'transparent', borderRadius: 8, outline: parOn ? `3px solid ${C.ink}` : undefined, padding: '0 4px' }}>{ch}</span>;
  return (
    <>
      <At x={540} y={250} s={pop(f, t0)} r={2}>
        <Box bg={C.blue} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 70 }}>FUNCTION</Box>
      </At>
      <At x={540} y={410} s={pop(f, tRumus)} r={-2}>
        <Sticker bg={C.yellow} size={38}>Rumus jadi, udah disiapin Excel</Sticker>
      </At>
      {/* anatomy */}
      <At x={540} y={600} s={pop(f, tNama - 4)}>
        <Box pad="18px 34px" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 76, display: 'flex', alignItems: 'center', color: C.formula }}>
          <span>=</span>
          <span style={{ background: f >= tNama ? C.yellow : 'transparent', borderRadius: 8, outline: f >= tNama ? `3px solid ${C.ink}` : undefined, padding: '0 6px', color: C.ink }}>SUM</span>
          {par('(')}
          <span style={{ color: C.sel }}>A1:A5</span>
          {par(')')}
        </Box>
      </At>
      <At x={400} y={730} s={pop(f, tNama + 4)}>
        <div style={{ fontFamily: HEAD, fontSize: 34 }}>↑ nama</div>
      </At>
      <At x={760} y={730} s={pop(f, tKurung)}>
        <div style={{ fontFamily: HEAD, fontSize: 34 }}>↑ kurung ↑</div>
      </At>
      {/* function list */}
      <At x={540} y={1020} s={pop(f, tKayak - 4)}>
        <div style={{ width: 860, background: C.white, border: `${BORDER}px solid ${C.ink}`, borderRadius: 20, boxShadow: shadow(10), overflow: 'hidden' }}>
          <div style={{ padding: '12px 24px', fontFamily: MONO, fontWeight: 700, fontSize: 26, borderBottom: `4px solid ${C.ink}`, background: C.head }}>Function bawaan Excel / Sheets</div>
          {FUNCS.map(([name, desc], i) => (
            <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: 20, padding: '16px 24px', background: active === i ? C.blue : C.white, borderTop: i ? `3px solid ${C.grid}` : undefined }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 42, color: C.formula, width: 330, whiteSpace: 'nowrap' }}>{name}( )</span>
              <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32 }}>{desc}</span>
            </div>
          ))}
        </div>
      </At>
      {/* back to the warm-up answer */}
      <At x={540} y={1380} s={pop(f, tTemen)}>
        <Box pad="16px 26px" style={{ width: 900, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32 }}>Punya temen kamu</span>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44 }}><Fx text={SHORT} markName={1} /></span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Tag ok>formula</Tag>
            <span style={{ opacity: lin(f, tTemen + 20, tTemen + 26) }}><Tag ok>pakai function SUM</Tag></span>
          </div>
        </Box>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 6. move 3: gym analogy                                              */
/* ------------------------------------------------------------------ */
const Gym: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[6].start);
  const tFn = s(cue(6, 'function'));
  const tFo = s(cue(6, 'formula'));
  const tBisa = s(cue(6, 'bisa'));
  const lift = Math.sin((f - t0) / 6) * 12;
  const steps: [string, boolean][] = [['Push-up 3×10', false], ['Angkat barbel 3×10', true], ['Plank 1 menit', false]];
  return (
    <>
      <At x={540} y={250} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.yellow} size={52}>Gampangnya gini…</Sticker>
      </At>
      <At x={290} y={720} s={pop(f, tFn)} r={-2}>
        <Box bg={C.blue} pad="26px 24px" style={{ width: 440, height: 560, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{ fontFamily: HEAD, fontSize: 52 }}>FUNCTION</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36 }}>= alat gym-nya</div>
          <div style={{ marginTop: 40 + lift }}>
            <Barbell w={340} />
          </div>
          <div style={{ marginTop: 'auto', fontFamily: MONO, fontWeight: 700, fontSize: 30 }}>SUM( ) AVERAGE( )</div>
        </Box>
      </At>
      <At x={790} y={720} s={pop(f, tFo)} r={2}>
        <Box bg={C.green} pad="26px 24px" style={{ width: 440, height: 560, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{ fontFamily: HEAD, fontSize: 52 }}>FORMULA</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36 }}>= gerakan latihannya</div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
            {steps.map(([st, tool], i) => {
              const o = lin(f, tFo + 8 + i * 8, tFo + 14 + i * 8);
              return (
                <div key={st} style={{ opacity: o, transform: `translateX(${(1 - o) * 30}px)`, background: tool && f >= tBisa ? C.blue : C.white, border: `4px solid ${C.ink}`, borderRadius: 12, padding: '10px 14px', fontFamily: BODY, fontWeight: 700, fontSize: 30 }}>
                  {i + 1}. {st}
                </div>
              );
            })}
          </div>
        </Box>
      </At>
      <At x={540} y={1170} s={pop(f, tBisa)}>
        <Box pad="18px 28px" style={{ width: 920, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34 }}>Gerakannya bisa pakai alat, bisa juga nggak:</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40 }}><Fx text={SHORT} markName={1} /></span>
            <Tag ok size={26}>pakai alat</Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: lin(f, tBisa + 12, tBisa + 18) }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40 }}><Fx text={LONG} colors={REF_COLORS} /></span>
            <Tag ok={false} size={26}>tanpa alat</Tag>
          </div>
        </Box>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 7. takeaway: function sits inside formula                           */
/* ------------------------------------------------------------------ */
const Takeaway: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[7].start);
  const tDalam = s(cue(7, 'dalam'));
  const tTapi = s(cue(7, 'tapi'));
  const tBelum = s(cue(7, 'belum'));
  const big = pop(f, t0 + 6);
  const inner = pop(f, tDalam - 6);
  const drop = interpolate(inner, [0, 1], [-420, 0]);
  return (
    <>
      <At x={540} y={250} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.ink} size={52} style={{ color: C.green }}>Intinya</Sticker>
      </At>
      <At x={540} y={860} s={big}>
        <div style={{ width: 860, height: 860, borderRadius: 430, background: C.green, border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(14), position: 'relative' }}>
          <div style={{ position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 64 }}>FORMULA</div>
          <div style={{ position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 30 }}>semua yang diawali “=”</div>
        </div>
      </At>
      <At x={540} y={960 + drop} s={inner} z={2}>
        <div style={{ width: 400, height: 400, borderRadius: 200, background: C.blue, border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(9), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ fontFamily: HEAD, fontSize: 52 }}>FUNCTION</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30 }}>SUM( )</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30 }}>AVERAGE( )</div>
        </div>
      </At>
      <At x={540} y={1170} s={pop(f, tDalam + 4)} z={3} r={-3}>
        <Sticker bg={C.yellow} size={34}>selalu di dalam formula</Sticker>
      </At>
      <At x={540} y={700} s={pop(f, tTapi)} z={3} r={2}>
        <Box pad="10px 26px" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 48 }}>
          <Fx text="=A1+B1" />
        </Box>
      </At>
      <At x={540} y={1420} s={pop(f, tBelum)} r={2}>
        <Sticker bg={C.white} size={40}>Formula belum tentu pakai function</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 8. repetisi: one practice question                                  */
/* ------------------------------------------------------------------ */
const Repetisi: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = PARTS[8].start;
  const tSama = cue(8, 'sama');
  const n = typed(f, tSama + 0.2, tSama + 1.4, 6);
  const done = n >= 6;
  const opts: [string, string, number][] = [
    ['A', 'Formula', cue(8, 'formula', 0, 2.5)],
    ['B', 'Function', cue(8, 'function', 0, 3)],
    ['C', 'Dua-duanya', cue(8, 'dua', 0, 3.5)],
  ];
  return (
    <>
      <At x={540} y={250} s={pop(f, s(t0))} r={-2}>
        <Box bg={C.yellow} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 70 }}>REPETISI</Box>
      </At>
      <At x={540} y={590} s={0.5 + 0.5 * pop(f, s(t0) + 4)}>
        <SheetUI
          title="repetisi.xlsx"
          cols={3}
          rows={2}
          rowH={84}
          selected="C1"
          cells={{
            A1: '4', B1: '25',
            C1: done ? <Fx text="=A1*B1" /> : <Fx text="=A1*B1" n={n} caret={f % 30 < 18} />,
          }}
          cellStyle={{ C1: { justifyContent: 'flex-start' } }}
          refs={n >= 3 ? [{ cells: ['A1'], color: C.sel }, ...(n >= 6 ? [{ cells: ['B1'], color: '#D6249F' }] : [])] : []}
          bar={<Fx text="=A1*B1" n={n} colors={{ B1: '#D6249F' }} />}
        />
      </At>
      {opts.map(([k, label, t], i) => (
        <At key={k} x={540} y={980 + i * 165} s={pop(f, s(t))}>
          <Box pad="16px 30px" style={{ width: 760, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 26 }}>
            <span style={{ width: 70, height: 70, borderRadius: 35, background: C.green, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 40 }}>{k}</span>
            <span style={{ fontFamily: HEAD, fontSize: 50 }}>{label}</span>
          </Box>
        </At>
      ))}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 9. cool-down: "Pendinginan: kerjain repetisinya, jawab di komentar." */
/* ------------------------------------------------------------------ */
const CoolDown: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[9].start);
  const tKom = s(cue(9, 'komentar'));
  const wiggle = f > tKom ? Math.sin((f - tKom) / 3) * 4 * (1 - lin(f, tKom, tKom + 30)) : 0;
  return (
    <>
      <At x={540} y={330} s={pop(f, t0)} r={-3}>
        <Box bg={C.blue} pad="18px 44px" style={{ fontFamily: HEAD, fontSize: 80 }}>PENDINGINAN</Box>
      </At>
      <At x={540} y={720} s={pop(f, t0 + 10)} r={wiggle}>
        <div style={{ position: 'relative' }}>
          <Box pad="26px 40px" radius={34} style={{ width: 820, boxSizing: 'border-box' }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Komentar</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 46 }}>
              <Fx text="=A1*B1" /> itu… <span style={{ background: C.yellow, padding: '0 10px', border: `3px solid ${C.ink}`, borderRadius: 8 }}>?</span>
            </div>
          </Box>
          <div style={{ position: 'absolute', left: 70, bottom: -34, width: 0, height: 0, borderLeft: '24px solid transparent', borderRight: '24px solid transparent', borderTop: `38px solid ${C.ink}` }} />
        </div>
      </At>
      <At x={540} y={960} s={pop(f, tKom)} r={2}>
        <Sticker bg={C.green} size={48}>Jawab di komentar</Sticker>
      </At>
      <At x={540} y={1250} s={pop(f, tKom + 8)}>
        <Box bg={C.green} pad="22px 34px" style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <Barbell w={180} />
          <div>
            <div style={{ fontFamily: HEAD, fontSize: 56, lineHeight: 0.95 }}>SPREADSHEET<br />GYM</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, marginTop: 8 }}>{EPISODE_LABEL}</div>
          </div>
        </Box>
      </At>
    </>
  );
};

const LIST = [Hook, Opening, WarmUp, Pause, MoveFormula, MoveFunction, Gym, Takeaway, Repetisi, CoolDown];

export const SCENES: { from: number; to: number; C: React.FC }[] = LIST.map((Comp, i) => ({
  from: i === 0 ? 0 : PARTS[i].start - 0.15,
  to: i + 1 < PARTS.length ? PARTS[i + 1].start - 0.15 : 9999,
  C: Comp,
}));

/** sound-effect cue times (seconds) that match the pops above */
export const POPS: number[] = [
  PARTS[0].start, cue(0, 'formula'), cue(0, 'function'),
  cue(1, 'sesi'),
  PARTS[2].start, cue(2, 'kamu'), cue(2, 'temen'), cue(2, 'mana'),
  PARTS[3].start,
  PARTS[4].start, cue(4, 'sama'), cue(4, 'dua'),
  PARTS[5].start, cue(5, 'rumus'), cue(5, 'nama'), cue(5, 'kurung'), cue(5, 'kayak'), cue(5, 'temen'),
  PARTS[6].start, cue(6, 'function'), cue(6, 'formula'), cue(6, 'bisa'),
  PARTS[7].start, cue(7, 'tapi'), cue(7, 'belum'),
  PARTS[8].start, cue(8, 'formula', 0, 2.5), cue(8, 'function', 0, 3), cue(8, 'dua', 0, 3.5),
  PARTS[9].start, cue(9, 'komentar'),
];
export const DINGS: number[] = [cue(4, 'dua'), TIMER_START() + TIMER_LEN];
export const THUDS: number[] = [cue(0, 'beda'), cue(1, 'beban') + 0.6, cue(7, 'dalam')];
export const WHISTLE = PARTS[1].start - 0.05;
export const TICKS: number[] = Array.from({ length: TIMER_LEN }, (_, i) => TIMER_START() + i);
