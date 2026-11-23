import React from 'react';
import { AbsoluteFill, Easing, Html5Audio, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CAPS } from './caps';
import { At, Background, Box, Burst, Rich, Sticker, lin, pop } from './components';
import { PediaWord, SCENES } from './scenes';
import { Sfx } from './sfx';
import { BORDER, C, CUTS, HEAD, LAYOUT, MORPH, Mode, TOTAL, s, shadow } from './theme';

/* ------------------------------------------------------------------ */
/* layout engine: one video element that morphs between three layouts */
/* ------------------------------------------------------------------ */
const SRC_W = 1080; // source video is 1080x1920
const SRC_H = 1920;
const FACE = { x: 540, y: 720 }; // roughly where the face sits in the source

type G = {
  vx: number; vy: number; vw: number; vh: number; vr: number; vb: number; // video box
  sy: number; // first source row shown in the video box
  scx: number; scy: number; ss: number; // illustration stage center + scale
  full: number; split: number; anim: number; // mode weights, for overlays
};

const GEOM: Record<Mode, G> = {
  full: { vx: 0, vy: 0, vw: 1080, vh: 1920, vr: 0, vb: 0, sy: 0, scx: 540, scy: -640, ss: 1, full: 1, split: 0, anim: 0 },
  split: { vx: 40, vy: 1000, vw: 1000, vh: 880, vr: 28, vb: BORDER, sy: 470, scx: 540, scy: 505, ss: 1, full: 0, split: 1, anim: 0 },
  anim: { vx: 40, vy: 2080, vw: 1000, vh: 880, vr: 28, vb: BORDER, sy: 470, scx: 540, scy: 790, ss: 1.04, full: 0, split: 0, anim: 1 },
};

const morphT = (f: number, start: number) =>
  interpolate(f, [start, start + MORPH], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

const geomAt = (f: number): G => {
  let i = 0;
  while (i + 1 < LAYOUT.length && f >= s(LAYOUT[i + 1][0])) i++;
  const cur = GEOM[LAYOUT[i][1]];
  if (i === 0) return cur;
  const prev = GEOM[LAYOUT[i - 1][1]];
  const t = morphT(f, s(LAYOUT[i][0]));
  const out = {} as G;
  (Object.keys(cur) as (keyof G)[]).forEach((k) => (out[k] = prev[k] + (cur[k] - prev[k]) * t));
  return out;
};

/** every jump cut alternates between a wide and a punched-in framing, with a slow push-in on top */
const zoomAt = (f: number) => {
  const sec = f / 30;
  let idx = 0;
  while (idx < CUTS.length && sec >= CUTS[idx]) idx++;
  const from = idx === 0 ? 0 : CUTS[idx - 1];
  const to = idx < CUTS.length ? CUTS[idx] : TOTAL / 30;
  const drift = (sec - from) / Math.max(1, to - from);
  return (idx % 2 ? 1.08 : 1.0) + 0.025 * drift;
};

const Talking: React.FC<{ g: G; f: number }> = ({ g, f }) => {
  const inner = g.vw - 2 * g.vb;
  const k = inner / SRC_W;
  const z = zoomAt(f);
  return (
    <div
      style={{
        position: 'absolute', left: g.vx, top: g.vy, width: g.vw, height: g.vh, overflow: 'hidden',
        border: `${g.vb}px solid ${C.ink}`, borderRadius: g.vr, boxSizing: 'border-box',
        boxShadow: g.vb > 0.5 ? shadow(2 * g.vb) : 'none', background: C.ink,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${FACE.x * k}px ${(FACE.y - g.sy) * k}px` }}>
        <OffthreadVideo
          src={staticFile('source.mp4')}
          style={{ position: 'absolute', left: 0, top: -g.sy * k, width: SRC_W * k, height: SRC_H * k }}
        />
      </div>
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
/* transition: an ink-edged colour band sweeps across on layout change */
/* ------------------------------------------------------------------ */
const SWIPE_COLORS = [C.yellow, C.pink, C.blue, C.green, C.orange, C.purple];
const Swipe: React.FC<{ f: number }> = ({ f }) => (
  <>
    {LAYOUT.slice(1).map(([t], i) => {
      const a = s(t) - 3;
      if (f < a || f > a + 14) return null;
      const p = interpolate(f, [a, a + 14], [0, 1], { easing: Easing.inOut(Easing.quad) });
      return (
        <div
          key={i}
          style={{
            position: 'absolute', left: -800 + 2200 * p, top: -400, width: 520, height: 2800,
            transform: 'rotate(18deg)', background: SWIPE_COLORS[i % SWIPE_COLORS.length],
            borderLeft: `${BORDER * 2}px solid ${C.ink}`, borderRight: `${BORDER * 2}px solid ${C.ink}`, opacity: 0.95,
          }}
        />
      );
    })}
  </>
);

/* ------------------------------------------------------------------ */
/* captions, whole video                                               */
/* ------------------------------------------------------------------ */
const Captions: React.FC<{ f: number; g: G }> = ({ f, g }) => {
  const y = 1560 * g.full + 1760 * g.split + 1580 * g.anim;
  const w = 900 - 60 * g.split;
  const fs = 46 - 6 * g.split;
  return (
    <>
      {CAPS.map(([a, b, text], i) => {
        const from = s(a);
        const to = s(b);
        if (f < from - 1 || f > to + 1) return null;
        const p = pop(f, from, 260);
        const out = lin(f, to - 3, to);
        return (
          <At key={i} x={540} y={y} s={(0.88 + 0.12 * p) * (1 - 0.06 * out)} o={Math.min(1, p * 1.6) * (1 - out)} r={i % 2 ? 1 : -1}>
            <Box pad="20px 30px" style={{ width: w, fontSize: fs, lineHeight: 1.3, fontWeight: 600, textAlign: 'center' }}>
              <Rich text={text} />
            </Box>
          </At>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* stickers over the full-frame talking head (kept above the face)     */
/* ------------------------------------------------------------------ */
const Heart: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M20 35 L6 21 a8 8 0 0 1 14 -10 a8 8 0 0 1 14 10 z" fill={C.red} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
  </svg>
);

const FullStickers: React.FC<{ f: number; o: number }> = ({ f, o }) => {
  if (o < 0.01) return null;
  const P = (sec: number, k = 220) => pop(f, s(sec), k);
  const gone = (a: number, b: number) => f >= s(a) && f <= s(b);
  const out = (b: number) => 1 - lin(f, s(b) - 6, s(b));
  const hook = [
    { at: 0.3, head: 'ENSIKLO', x: 330, y: 250, r: -4 },
    { at: 1.4, head: 'TOKO', x: 760, y: 330, r: 3 },
    { at: 2.1, head: 'WIKI', x: 360, y: 420, r: -2 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o }}>
      {/* hook: three -pedia names, then the question */}
      {gone(0, 6.3) &&
        hook.map((h) => (
          <At key={h.head} x={h.x} y={h.y} s={P(h.at) * out(6.3)} r={h.r}>
            <PediaWord head={h.head} lit={lin(f, s(4.7), s(4.7) + 6)} size={46} />
          </At>
        ))}
      {gone(5.8, 9.3) && (
        <At x={540} y={330} s={P(5.9, 180) * out(9.3)} r={-3}>
          <Box bg={C.yellow} pad="14px 34px" style={{ fontFamily: HEAD, fontSize: 70, whiteSpace: 'nowrap' }}>
            “PEDIA” = <span style={{ background: C.white, border: `5px solid ${C.ink}`, borderRadius: 12, padding: '0 16px' }}>?</span>
          </Box>
        </At>
      )}
      {/* dig deeper */}
      {gone(33.3, 35.8) && (
        <At x={540} y={330} s={P(33.4) * out(35.8)} r={2}>
          <Sticker bg={C.purple} size={54}>Bedah lebih dalam</Sticker>
        </At>
      )}
      {/* the account name */}
      {gone(86.3, 93.2) && (
        <>
          <At x={540} y={270} s={P(88.5, 180) * out(93.2)} r={-3}>
            <Box bg={C.yellow} pad="10px 30px" style={{ fontFamily: HEAD, fontSize: 64, whiteSpace: 'nowrap' }}>
              FAQIH<span style={{ background: C.white, border: `5px solid ${C.ink}`, borderRadius: 12, padding: '0 10px', marginLeft: 6 }}>PEDIA</span>
            </Box>
          </At>
          <At x={540} y={410} s={P(90.2) * out(93.2)} r={2}>
            <Sticker bg={C.green} size={40}>Dokumentasi yang aku tahu</Sticker>
          </At>
        </>
      )}
      {/* outro */}
      {gone(106.3, 111.3) && (
        <At x={540} y={330} s={P(108.9) * out(111.3)} r={-2}>
          <Box bg={C.white} pad="12px 30px" style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: HEAD, fontSize: 50, whiteSpace: 'nowrap' }}>
            <span style={{ transform: `scale(${1 + 0.15 * Math.max(0, Math.sin((f - s(109.0)) * 0.35))})`, display: 'flex' }}><Heart /></span>
            LIKE DULU YA
          </Box>
        </At>
      )}
      {f >= s(111.3) && (
        <At x={540} y={360} s={P(111.35, 200)} r={-6}>
          <Burst size={460} color={C.yellow} rot={f * 0.8}>
            <span style={{ fontSize: 66 }}>TRIMS!</span>
          </Burst>
        </At>
      )}
    </div>
  );
};

/** segment badge, hidden while the split layout needs the top edge */
const SegmentBadge: React.FC<{ f: number; o: number }> = ({ f, o }) => (
  <At x={540} y={110} s={pop(f, 4)} r={-3} o={o * (1 - lin(f, s(111.2), s(111.2) + 6))}>
    <Box bg={C.ink} pad="12px 24px" radius={14} sh={7} style={{ color: C.white, fontFamily: HEAD, fontSize: 34, whiteSpace: 'nowrap', boxShadow: `7px 7px 0 ${C.yellow}` }}>
      TRIMS · <span style={{ color: C.yellow }}>ARTI “PEDIA”</span>
    </Box>
  </At>
);

/** quiet music bed: fades in, dips a little under the busier anim parts, fades out */
const Music: React.FC = () => (
  <Html5Audio
    src={staticFile('music.wav')}
    volume={(f) => 0.11 * lin(f, 0, 20) * (1 - lin(f, TOTAL - 45, TOTAL))}
  />
);

export const FaqihpediaArtipedia: React.FC = () => {
  const f = useCurrentFrame();
  const g = geomAt(f);
  const fadeOut = 1 - lin(f, TOTAL - 8, TOTAL);
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut, overflow: 'hidden' }}>
      <Background />
      <Talking g={g} f={f} />
      <Stage g={g} f={f} />
      <Captions f={f} g={g} />
      <FullStickers f={f} o={g.full} />
      <SegmentBadge f={f} o={1 - g.split} />
      <Swipe f={f} />
      <Music />
      <Sfx />
    </AbsoluteFill>
  );
};
