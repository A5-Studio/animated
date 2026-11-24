import React from 'react';
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CAPTIONS } from './captions';
import { LikePop, SCENES } from './scenes';
import { Sfx } from './sfx';
import { C, LAYOUT, MORPH, Mode, SANS, TOTAL, s } from './theme';
import { lin, out } from './ui';

/* ------------------------------------------------------------------ */
/* layout engine: one talking-head element that morphs between layouts */
/* ------------------------------------------------------------------ */
type G = { vy: number; vh: number; sy: number; full: number; split: number; anim: number };

// source.mp4 is 1080x1920; in split we show rows 290..1250 (head + shoulders)
const GEOM: Record<Mode, G> = {
  full: { vy: 0, vh: 1920, sy: 0, full: 1, split: 0, anim: 0 },
  split: { vy: 960, vh: 960, sy: 290, full: 0, split: 1, anim: 0 },
  anim: { vy: 1920, vh: 960, sy: 290, full: 0, split: 0, anim: 1 },
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
  <div style={{ position: 'absolute', left: 0, top: g.vy, width: 1080, height: g.vh, overflow: 'hidden', background: '#000' }}>
    <OffthreadVideo src={staticFile('source.mp4')} style={{ position: 'absolute', left: 0, top: -g.sy, width: 1080, height: 1920 }} />
  </div>
);

/* ------------------------------------------------------------------ */
/* illustration stage (sits under the talking head)                    */
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
        <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: sc.mode === 'split' ? 960 : 1920, opacity: o }}>
          <sc.C f={f} />
        </div>
      );
    })}
  </>
);

/* ------------------------------------------------------------------ */
/* captions: short phrases in a grey pill, like the reference          */
/* ------------------------------------------------------------------ */
const Captions: React.FC<{ f: number; g: G }> = ({ f, g }) => {
  const cur = CAPTIONS.find(([a, b]) => f >= s(a) && f < s(b));
  if (!cur) return null;
  const [a, , text] = cur;
  const p = out(f, s(a), s(a) + 4);
  const y = g.full * 1470 + g.split * 1010 + g.anim * 1760;
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

export const AskMaps: React.FC = () => {
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
