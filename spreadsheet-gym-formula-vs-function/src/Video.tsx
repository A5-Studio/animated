import React from 'react';
import { AbsoluteFill, Html5Audio, staticFile, useCurrentFrame } from 'remotion';
import { At, Background, between } from './components';
import { SCENES, TopChip } from './scenes';
import { Sfx } from './sfx';
import { BODY, BORDER, C, PARTS, WORDS, s, shadow } from './theme';

/*
 * Captions. The text is what's shown on screen (formulas written as
 * formulas); it is timed by mapping each caption word onto the transcribed
 * words of the same VO part, in proportion.
 */
const CAPTIONS: string[] = [
  'Jangan salah lagi, di Excel atau Spreadsheet, formula dan function itu beda.',
  'Nah, ini Spreadsheet Gym. Hari ini kita latihan satu hal yang sering banget ketuker.',
  'Formula itu semua yang kalian ketik di sel, yang diawali tanda =. Contohnya =A1+B1. Itu udah formula, walaupun isinya cuma tambah-tambahan biasa.',
  'Kalau function, itu rumus jadi yang udah disiapin sama Excel-nya. Ada namanya, terus ada kurungnya. Kayak SUM, AVERAGE, atau VLOOKUP.',
  'Gampangnya gini. Kalau di gym, function itu alatnya, kayak dumbel atau treadmill. Udah jadi, tinggal dipakai. Nah, formula itu gerakan latihannya. Kalian yang nyusun.',
  'Jadi, =A1+A2+A3+A4+A5 itu formula, tapi nggak pakai function. Kalau =SUM(A1:A5), itu formula yang di dalamnya pakai function SUM. Hasilnya sama, tapi jauh lebih pendek.',
  'Intinya, function itu selalu dipakai di dalam formula. Tapi formula, belum tentu pakai function.',
  'Jadi mulai sekarang jangan ketuker lagi ya. Simpan video ini, biar latihannya nggak lupa.',
];

type Chunk = { words: { w: string; t: number }[]; from: number; to: number };

const CHUNKS: Chunk[] = CAPTIONS.flatMap((text, p) => {
  const ws = WORDS.filter((w) => w.p === p);
  const cap = text.split(/\s+/);
  const timeOf = (i: number) => (ws.length ? ws[Math.min(ws.length - 1, Math.round((i * ws.length) / cap.length))].s : PARTS[p].start);
  // break into chunks of up to 5 words, also at sentence ends
  const groups: number[][] = [];
  let g: number[] = [];
  cap.forEach((w, i) => {
    g.push(i);
    if (g.length >= 5 || /[.,]$/.test(w) && g.length >= 3) {
      groups.push(g);
      g = [];
    }
  });
  if (g.length) groups.push(g);
  return groups.map((idx, k) => ({
    words: idx.map((i) => ({ w: cap[i], t: timeOf(i) })),
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
    <At x={540} y={1690} o={o}>
      <div
        style={{
          maxWidth: 980, background: C.white, border: `${BORDER}px solid ${C.ink}`, borderRadius: 20, boxShadow: shadow(9),
          padding: '16px 28px', fontFamily: BODY, fontWeight: 700, fontSize: 50, lineHeight: 1.25, textAlign: 'center', color: C.ink, width: 'max-content',
        }}
      >
        {c.words.map((w, i) => {
          const on = t >= w.t && (i + 1 >= c.words.length || t < c.words[i + 1].t);
          return (
            <span key={i} style={{ background: on ? C.yellow : 'transparent', borderRadius: 8, padding: '0 6px' }}>
              {w.w}{' '}
            </span>
          );
        })}
      </div>
    </At>
  );
};

export const SpreadsheetGym: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <Background />
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
      <TopChip />
      <Captions />
      <Html5Audio src={staticFile('vo.wav')} />
      <Sfx />
    </AbsoluteFill>
  );
};
