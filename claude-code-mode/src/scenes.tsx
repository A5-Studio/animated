import React from 'react';
import { C, MONO, SANS, SERIF, T, s, soft } from './theme';
import { DotSpin, PromptBox, Ring, Spinner, StatusLine, Terminal, ToolLine, UserLine, VERBS, typed } from './term';
import { SegmentTag, Tag, lin, out } from './ui';

/*
 * AI (An Info), 30 s, drawn only: the "✻ Brewing…" spinner words in Claude Code.
 * Every scene gets `f`, frames since its own start.
 */

/** serif headline, words rising in one by one; "*word" is orange */
const Headline: React.FC<{ f: number; lines: string[]; y: number; size?: number; start?: number }> = ({
  f, lines, y, size = 104, start = 0,
}) => {
  let k = 0;
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, top: y, textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.04, letterSpacing: -3, color: C.ink }}>
      {lines.map((line, i) => (
        <div key={i}>
          {line.split(' ').map((w, j) => {
            const p = out(f, start + k * 3, start + k * 3 + 12);
            k++;
            return (
              <span key={j} style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 30}px)`, marginRight: '0.24em' }}>
                {w.startsWith('*') ? <span style={{ color: T.claude }}>{w.slice(1)}</span> : w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const rise = (f: number, a: number, d = 12) => {
  const p = out(f, a, a + d);
  return { opacity: p, transform: `translateY(${(1 - p) * 34}px)` } as React.CSSProperties;
};

const Pill: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.card, borderRadius: 40, padding: '14px 28px', boxShadow: soft, fontFamily: SANS, fontSize: 32, fontWeight: 600, color: C.ink, ...style }}>
    {children}
  </div>
);

/* ================================================================== */
/* 1. Hook: the word keeps changing                                    */
/* ================================================================== */
const Hook: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', ...rise(f, 0, 10) }}>
      <SegmentTag size={30} />
    </div>
    <Headline f={f} y={400} lines={['*Brewing? *Clauding?', '*Cooking?']} start={4} />
    <div style={{ position: 'absolute', left: 60, top: 760, ...rise(f, 8, 14) }}>
      <Terminal h={620}>
        <UserLine text="bikinin halaman checkout" />
        <div style={{ height: 6 }} />
        <div style={{ position: 'relative' }}>
          <Spinner f={f} cycle={11} size={34} meta={false} />
          <Ring o={lin(f, 24, 32)} style={{ left: -14, top: -12, width: 400, bottom: -12 }} />
        </div>
        <div style={{ flex: 1 }} />
        <PromptBox f={f} />
        <StatusLine kind="default" />
      </Terminal>
    </div>
  </>
);

/* ================================================================== */
/* 2. What it means: Claude is working                                 */
/* ================================================================== */
const Working: React.FC<{ f: number }> = ({ f }) => {
  const secs = Math.max(0, Math.floor((f - 30) / 12));
  const tok = Math.max(0, (f - 30) * 14);
  const tokens = tok >= 1000 ? `${(tok / 1000).toFixed(1)}k` : `${tok}`;
  return (
    <>
      <Headline f={f} y={330} lines={['Artinya: Claude', '*lagi kerja']} />
      <div style={{ position: 'absolute', left: 60, top: 640, ...rise(f, 0, 12) }}>
        <Terminal h={880}>
          <UserLine text={typed('bikinin halaman checkout', f, 4, 40)} />
          <ToolLine tool="Read" arg="cart.js" result="Read 86 lines" o={out(f, 60, 68)} ok={lin(f, 66, 72)} />
          <ToolLine tool="Write" arg="checkout.html" result="Wrote 112 lines" o={out(f, 100, 108)} ok={lin(f, 106, 112)} />
          <ToolLine tool="Bash" arg="npm test" result="12 passed" o={out(f, 140, 148)} ok={lin(f, 146, 152)} />
          {f >= 30 && <Spinner f={f} verb="Brewing" secs={secs} tokens={tokens} size={28} o={out(f, 30, 36)} />}
          <div style={{ flex: 1 }} />
          <PromptBox f={f} />
          <StatusLine kind="default" />
        </Terminal>
      </div>
    </>
  );
};

/* ================================================================== */
/* 3. Turn                                                             */
/* ================================================================== */
const Turn: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Headline f={f} y={640} lines={['Kok katanya', 'ganti-ganti?']} size={124} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', justifyContent: 'center', ...rise(f, 10) }}>
      <div style={{ background: T.bg, borderRadius: 24, padding: '26px 44px', boxShadow: soft }}>
        <Spinner f={f} cycle={6} size={40} meta={false} />
      </div>
    </div>
  </>
);

/* ================================================================== */
/* 4. The many words, with a loose translation                         */
/* ================================================================== */
export const WORDS: [string, string][] = [
  ['Brewing', 'nyeduh kopi'],
  ['Clauding', 'nge-Claude'],
  ['Cooking', 'lagi masak'],
  ['Pondering', 'merenung'],
  ['Marinating', 'dimarinasi'],
  ['Noodling', 'mikir santai'],
  ['Vibing', 'nge-vibe'],
  ['Simmering', 'direbus pelan'],
  ['Conjuring', 'lagi nyulap'],
  ['Hatching', 'lagi menetas'],
  ['Schlepping', 'ngangkut barang'],
  ['Moseying', 'jalan santai'],
];
export const WORD_AT = (i: number) => 16 + i * 7;

const Words: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Headline f={f} y={300} lines={['Ada *puluhan', 'kata kayak gini']} />
    {WORDS.map(([w, id], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      return (
        <div key={w} style={{ position: 'absolute', left: 60 + col * 490, top: 560 + row * 132, width: 470, height: 112, background: C.card, borderRadius: 28, boxShadow: soft, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', overflow: 'hidden', boxSizing: 'border-box', ...rise(f, WORD_AT(i), 10) }}>
          <DotSpin f={f + i * 5} size={30} />
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: T.claude, flex: 'none' }}>{w}…</span>
          <span style={{ fontFamily: SANS, fontSize: 24, color: C.sub, whiteSpace: 'nowrap' }}>{id}</span>
        </div>
      );
    })}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1380, display: 'flex', justifyContent: 'center', gap: 18, ...rise(f, WORD_AT(12) + 6) }}>
      <Pill>+ masih banyak lagi</Pill>
      <Pill style={{ color: T.claude }}>dipilih acak</Pill>
    </div>
  </>
);

/* ================================================================== */
/* 5. Reading the rest of the line                                     */
/* ================================================================== */
const PARTS = [
  { at: 14, col: 10, len: 3, title: '12s', text: 'udah kerja 12 detik' },
  { at: 54, col: 16, len: 13, title: '↓ 1.2k tokens', text: 'teks yang udah diproses' },
  { at: 94, col: 32, len: 16, title: 'esc to interrupt', text: 'tekan Esc buat stop' },
];

const FS = 31;
const CH = FS * 0.6; // JetBrains Mono advance
const ICON = FS * 1.25;

const Read: React.FC<{ f: number }> = ({ f }) => {
  const cur = PARTS.filter((p) => f >= p.at).length - 1;
  return (
    <>
      <Headline f={f} y={330} lines={['Angka di', 'belakangnya?']} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', ...rise(f, 0) }}>
        <div style={{ position: 'relative', background: T.bg, borderRadius: 26, padding: '30px 30px', boxShadow: soft, width: 1000, boxSizing: 'border-box', overflow: 'visible' }}>
          <Spinner f={f} verb="Cooking" secs={12} tokens="1.2k" size={FS} />
          {cur >= 0 && (
            <div style={{ position: 'absolute', top: 18, height: 66, border: `5px solid ${C.amber}`, borderRadius: 14, left: 30 + ICON + (PARTS[cur].col + 0.5) * CH - 10, width: PARTS[cur].len * CH + 20 }} />
          )}
        </div>
      </div>
      {PARTS.map((p, i) => (
        <div key={p.title} style={{ position: 'absolute', left: 60, top: 840 + i * 190, width: 960, height: 160, background: C.card, borderRadius: 34, boxShadow: soft, display: 'flex', alignItems: 'center', gap: 30, padding: '0 34px', boxSizing: 'border-box', opacity: cur === i ? 1 : f >= p.at ? 0.55 : 0, ...(f < p.at + 12 ? rise(f, p.at) : {}) }}>
          <span style={{ fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.ink, background: C.tag, borderRadius: 12, padding: '8px 16px', whiteSpace: 'nowrap' }}>{p.title}</span>
          <span style={{ fontFamily: SANS, fontSize: 38, fontWeight: 600, color: C.ink }}>{p.text}</span>
        </div>
      ))}
    </>
  );
};

/* ================================================================== */
/* 6. Outro                                                            */
/* ================================================================== */
const Outro: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Headline f={f} y={420} lines={['Apa pun katanya,', 'Claude *lagi kerja']} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', ...rise(f, 10) }}>
      <div style={{ background: T.bg, borderRadius: 24, padding: '26px 44px', boxShadow: soft }}>
        <Spinner f={f} cycle={8} size={40} meta={false} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', gap: 18, ...rise(f, 22) }}>
      <Pill>Tunggu aja</Pill>
      <Pill>atau <span style={{ fontFamily: MONO, background: C.tag, borderRadius: 10, padding: '4px 14px' }}>Esc</span> buat stop</Pill>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1080, display: 'flex', justifyContent: 'center', ...rise(f, 34) }}>
      <Tag style={{ fontSize: 30, padding: '10px 22px' }}>Kamu paling sering dapet kata apa?</Tag>
    </div>
  </>
);

/* ------------------------------------------------------------------ */
export type Scene = { from: number; to: number; C: React.FC<{ f: number }> };
export const SCENES: Scene[] = [
  { from: 0, to: 3.4, C: Hook },
  { from: 3.4, to: 9.6, C: Working },
  { from: 9.6, to: 11.4, C: Turn },
  { from: 11.4, to: 19.6, C: Words },
  { from: 19.6, to: 25.8, C: Read },
  { from: 25.8, to: 30, C: Outro },
];

/** on-screen captions (no voice): short grey pills */
export const CAPTIONS: [number, number, string][] = [
  [0.4, 3.3, 'Ini tulisan apa sih?'],
  [3.6, 6.6, 'Tanda Claude lagi'],
  [6.6, 9.5, 'mikir & ngerjain tugas.'],
  [9.8, 11.3, 'Kok ganti-ganti?'],
  [11.6, 15.6, 'Dipilih acak tiap kerja,'],
  [15.6, 19.5, 'artinya tetap sama.'],
  [19.8, 25.7, 'Baca angkanya juga.'],
  [26.0, 28.0, 'Tulis di komentar!'],
  [28.0, 29.8, 'Like dulu, ya'],
];

export { s, VERBS };
