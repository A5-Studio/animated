import React from 'react';
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CAPTIONS } from './captions';
import { LikePop, SCENES, STAGE_H } from './scenes';
import { Sfx } from './sfx';
import { C, LAYOUT, MORPH, Mode, SANS, TOTAL, s, soft } from './theme';
import { lin, out } from './ui';

/* ------------------------------------------------------------------ */
/* layout engine (faqihpedia-askmaps): one talking-head element         */
/* ------------------------------------------------------------------ */
type G = { vx: number; vy: number; vw: number; vh: number; k: number; sy: number; r: number; full: number; split: number; anim: number };

/*
 * Platform UI (TikTok, Reels, Shorts) covers the bottom ~660 px and a ~120 px column on the right,
 * so everything that matters sits above y ~1300.
 * source.mp4 is 1080x1920; the head runs from ~420 (hair) to ~1470 (chin), the mouth sits near 1300.
 * split: the talking head is a rounded card at 0.53x (rows 400-1532), y 770-1370, mouth at ~y 1247.
 * full: 1.1x and shifted up (rows 180-1925), so the mouth sits at ~y 1232 and the frame stays filled.
 */
const K = 0.53;
const CARD = { w: Math.round(1080 * K), h: 600, y: 770, sy: 400 };
const FULL_K = 1.1;
const GEOM: Record<Mode, G> = {
  full: { vx: -(1080 * FULL_K - 1080) / 2, vy: 0, vw: 1080 * FULL_K, vh: 1920, k: FULL_K, sy: 180, r: 0, full: 1, split: 0, anim: 0 },
  split: { vx: (1080 - CARD.w) / 2, vy: CARD.y, vw: CARD.w, vh: CARD.h, k: K, sy: CARD.sy, r: 36, full: 0, split: 1, anim: 0 },
  anim: { vx: (1080 - CARD.w) / 2, vy: 1920 + 40, vw: CARD.w, vh: CARD.h, k: K, sy: CARD.sy, r: 36, full: 0, split: 0, anim: 1 },
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
  const o = {} as G;
  (Object.keys(cur) as (keyof G)[]).forEach((k) => (o[k] = prev[k] + (cur[k] - prev[k]) * t));
  return o;
};

const Talking: React.FC<{ g: G }> = ({ g }) => (
  <div style={{ position: 'absolute', left: g.vx, top: g.vy, width: g.vw, height: g.vh, overflow: 'hidden', background: '#000', borderRadius: g.r, boxShadow: g.r > 1 ? soft : 'none' }}>
    <OffthreadVideo src={staticFile('source.mp4')} style={{ position: 'absolute', left: 0, top: -g.sy * g.k, width: 1080 * g.k, height: 1920 * g.k }} />
  </div>
);

/* ------------------------------------------------------------------ */
/* visual stage (sits under the talking head)                          */
/* ------------------------------------------------------------------ */
const FADE = 8;
const Stage: React.FC<{ f: number }> = ({ f }) => (
  <>
    {SCENES.map((sc, i) => {
      const a = s(sc.from);
      const b = s(sc.to);
      if (f < a || f >= b + FADE) return null;
      const o = (i === 0 ? 1 : lin(f, a, a + FADE)) * (1 - lin(f, b, b + FADE));
      return (
        <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: sc.mode === 'split' ? STAGE_H : 1920, opacity: o, overflow: 'hidden' }}>
          {/* scenes are drawn at full size, then fitted above the platform UI: split into y ~220-745, anim into y ~250-1210 */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: sc.mode === 'split' ? STAGE_H : 1920, transform: `scale(${sc.mode === 'split' ? 0.84 : 0.78})`, transformOrigin: '540px 250px' }}>
            <sc.C f={f} />
          </div>
        </div>
      );
    })}
  </>
);

/* ------------------------------------------------------------------ */
/* captions: short phrases in a grey pill                              */
/* ------------------------------------------------------------------ */
const Captions: React.FC<{ f: number; g: G }> = ({ f, g }) => {
  const cur = CAPTIONS.find(([a, b]) => f >= s(a) && f < s(b));
  if (!cur) return null;
  const [a, , text] = cur;
  const p = out(f, s(a), s(a) + 4);
  // everything clear of the platform UI (bottom ~660 px): full = above the head, split = on the seam, anim = under the visual
  const y = g.full * 330 + g.split * 735 + g.anim * 1245;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)' }}>
      <div
        style={{
          background: 'rgba(48,46,43,0.72)', color: '#fff', fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: -0.2,
          padding: '12px 28px 14px', borderRadius: 18, whiteSpace: 'nowrap', opacity: p, transform: `scale(${0.96 + 0.04 * p})`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const AnInfoClaude: React.FC = () => {
  const f = useCurrentFrame();
  const g = geomAt(f);
  const fadeOut = 1 - lin(f, TOTAL - 10, TOTAL);
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut }}>
      <AbsoluteFill style={{ background: `radial-gradient(1200px 900px at 50% 30%, ${C.paper}, ${C.bg})` }} />
      <Stage f={f} />
      <Talking g={g} />
      <LikePop f={f} />
      <Captions f={f} g={g} />
      <Sfx />
    </AbsoluteFill>
  );
};
