import React from 'react';
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { At, Background, Box, Rich, Sticker, lin, pop } from './components';
import { SCENES } from './scenes';
import { Sfx } from './sfx';
import { BORDER, C, HEAD, LAYOUT, MORPH, Mode, TOTAL, s, shadow } from './theme';

/* ------------------------------------------------------------------ */
/* layout engine: one video element that morphs between three layouts */
/* ------------------------------------------------------------------ */
const SRC_W = 576; // source video is 576x1024

type G = {
  vx: number; vy: number; vw: number; vh: number; vr: number; vb: number; // video box
  sy: number; // first source row shown in the video box
  scx: number; scy: number; ss: number; // illustration stage center + scale
  full: number; split: number; anim: number; // mode weights, for overlays
};

const GEOM: Record<Mode, G> = {
  full: { vx: 0, vy: 0, vw: 1080, vh: 1920, vr: 0, vb: 0, sy: 0, scx: 540, scy: -640, ss: 1, full: 1, split: 0, anim: 0 },
  split: { vx: 40, vy: 1000, vw: 1000, vh: 880, vr: 28, vb: BORDER, sy: 280, scx: 540, scy: 505, ss: 1, full: 0, split: 1, anim: 0 },
  anim: { vx: 40, vy: 2080, vw: 1000, vh: 880, vr: 28, vb: BORDER, sy: 280, scx: 540, scy: 790, ss: 1.04, full: 0, split: 0, anim: 1 },
};

const geomAt = (f: number): G => {
  let i = 0;
  while (i + 1 < LAYOUT.length && f >= s(LAYOUT[i + 1][0])) i++;
  const cur = GEOM[LAYOUT[i][1]];
  if (i === 0) return cur;
  const start = s(LAYOUT[i][0]);
  const prev = GEOM[LAYOUT[i - 1][1]];
  const t = interpolate(f, [start, start + MORPH], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const out = {} as G;
  (Object.keys(cur) as (keyof G)[]).forEach((k) => (out[k] = prev[k] + (cur[k] - prev[k]) * t));
  return out;
};

const Talking: React.FC<{ g: G }> = ({ g }) => {
  const inner = g.vw - 2 * g.vb;
  const k = inner / SRC_W;
  return (
    <div
      style={{
        position: 'absolute', left: g.vx, top: g.vy, width: g.vw, height: g.vh, overflow: 'hidden',
        border: `${g.vb}px solid ${C.ink}`, borderRadius: g.vr, boxSizing: 'border-box',
        boxShadow: g.vb > 0.5 ? shadow(2 * g.vb) : 'none', background: C.ink,
      }}
    >
      <OffthreadVideo
        src={staticFile('source.mp4')}
        style={{ position: 'absolute', left: 0, top: -g.sy * k, width: SRC_W * k, height: 1024 * k }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* illustration stage                                                  */
/* ------------------------------------------------------------------ */
const Stage: React.FC<{ g: G; f: number }> = ({ g, f }) => {
  const live = SCENES.filter((sc) => f >= s(sc.from) - 1 && f < s(sc.to) + MORPH);
  if (!live.length || g.full > 0.999) return null;
  const sc = live[live.length - 1];
  const inS = pop(f, s(sc.from), 200);
  return (
    <div
      style={{
        position: 'absolute', left: 0, top: 0, width: 1000, height: 880,
        transform: `translate(${g.scx}px, ${g.scy}px) translate(-50%, -50%) scale(${g.ss})`,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 28, boxSizing: 'border-box',
          border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(14), background: sc.bg,
          backgroundImage: `linear-gradient(${C.ink}12 3px, transparent 3px), linear-gradient(90deg, ${C.ink}12 3px, transparent 3px)`,
          backgroundSize: '80px 80px',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${0.9 + 0.1 * inS})`, opacity: Math.min(1, inS * 2) }}>
          <sc.C f={f} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* captions for the illustration-only parts (the burned-in ones are    */
/* hidden there)                                                       */
/* ------------------------------------------------------------------ */
const CAPS: [number, number, string][] = [
  [3.3, 5.4, 'Itu salah satu poin yang aku *inget banget*'],
  [5.4, 8.2, 'dari salah satu podcast-nya *GJLS*,'],
  [8.2, 12.0, 'yang ngundang *Pak Anies Baswedan* sebagai bintang tamu.'],
  [27.4, 30.9, 'Tapi orang yang *jago banget*, yang *pintar banget*,'],
  [30.9, 33.9, 'baru *dicemplungin* di satu bidang baru,'],
  [33.9, 37.9, 'dia bisa langsung ngerti *A sampai Z* dari kerjaan dia,'],
  [37.9, 40.6, 'termasuk apa yang *salah*, apa yang perlu *dibenerin*.'],
  [45.8, 48.3, 'Kerja cuma diperbanyak *masa kerjanya*'],
  [48.3, 51.3, 'bertahun-tahun, tapi *nggak ada* yang dipelajari.'],
  [63.3, 67.3, 'Supaya walaupun secara *durasi* pengalaman tidak banyak,'],
  [67.3, 70.6, 'tapi yang kalian *pelajari*…'],
  [70.6, 72.8, '…*lebih banyak* dari orang yang durasinya sama.'],
];

const AnimCaptions: React.FC<{ f: number; o: number }> = ({ f, o }) => (
  <>
    {CAPS.map(([a, b, text], i) => {
      const from = s(a);
      const to = s(b);
      if (f < from - 1 || f > to + 1 || o < 0.01) return null;
      const p = pop(f, from, 240);
      const out = lin(f, to - 5, to);
      return (
        <At key={i} x={540} y={1580} s={(0.85 + 0.15 * p) * (1 - 0.1 * out)} o={o * Math.min(1, p * 1.5) * (1 - out)} r={i % 2 ? 1 : -1}>
          <Box pad="24px 32px" style={{ width: 920, fontSize: 46, lineHeight: 1.35, fontWeight: 600, textAlign: 'center' }}>
            <Rich text={text} />
          </Box>
        </At>
      );
    })}
  </>
);

/* ------------------------------------------------------------------ */
/* stickers over the full-frame talking head (kept above the face)     */
/* ------------------------------------------------------------------ */
const POPS: { a: number; b: number; text: string; bg: string; x: number; y: number; r: number }[] = [
  { a: 0.4, b: 3.3, text: 'Pengalaman ≠ durasi', bg: C.yellow, x: 540, y: 330, r: -3 },
  { a: 13.0, b: 16.0, text: 'Setuju banget!', bg: C.green, x: 540, y: 330, r: 2 },
  { a: 42.6, b: 45.8, text: 'Mau jadi pekerja unggul?', bg: C.pink, x: 540, y: 330, r: -2 },
];

const FullPops: React.FC<{ f: number; o: number }> = ({ f, o }) => (
  <>
    {POPS.map((p, i) => {
      const from = s(p.a);
      const to = s(p.b);
      if (f < from || f > to || o < 0.01) return null;
      const out = lin(f, to - 6, to);
      return (
        <At key={i} x={p.x} y={p.y} s={pop(f, from, 220) * (1 - out)} r={p.r} o={o}>
          <Sticker bg={p.bg} size={54}>{p.text}</Sticker>
        </At>
      );
    })}
  </>
);

/** progress badge, hidden while the split layout needs the top edge */
const DayBadge: React.FC<{ f: number; o: number }> = ({ f, o }) => (
  <At x={540} y={110} s={pop(f, 4)} r={-3} o={o}>
    <Box bg={C.ink} pad="12px 24px" radius={14} sh={7} style={{ color: C.white, fontFamily: HEAD, fontSize: 34, whiteSpace: 'nowrap', boxShadow: `7px 7px 0 ${C.yellow}` }}>
      YANG PENTING NGOMONG · <span style={{ color: C.yellow }}>#22</span>
    </Box>
  </At>
);

export const Faqihpedia22: React.FC = () => {
  const f = useCurrentFrame();
  const g = geomAt(f);
  const fadeOut = 1 - lin(f, TOTAL - 8, TOTAL);
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut }}>
      <Background />
      <Talking g={g} />
      <Stage g={g} f={f} />
      <AnimCaptions f={f} o={g.anim} />
      <FullPops f={f} o={g.full} />
      <DayBadge f={f} o={1 - g.split} />
      <Sfx />
    </AbsoluteFill>
  );
};
