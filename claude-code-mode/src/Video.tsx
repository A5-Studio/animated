import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CAPTIONS, SCENES } from './scenes';
import { Sfx } from './sfx';
import { C, SANS, TOTAL, s } from './theme';
import { lin, out } from './ui';

const FADE = 8;

/** scenes cross-fade; each one gets frames since its own start */
const Stage: React.FC<{ f: number }> = ({ f }) => (
  <>
    {SCENES.map((sc, i) => {
      const a = s(sc.from);
      const b = s(sc.to);
      if (f < a || f >= b + FADE) return null;
      const o = (i === 0 ? 1 : lin(f, a, a + FADE)) * (1 - lin(f, b, b + FADE));
      return (
        <AbsoluteFill key={i} style={{ opacity: o }}>
          <sc.C f={f - a} />
        </AbsoluteFill>
      );
    })}
  </>
);

/** grey caption pill, kept above the TikTok/Reels bottom UI (safe box ends at y 1250) */
const Captions: React.FC<{ f: number }> = ({ f }) => {
  const cur = CAPTIONS.find(([a, b]) => f >= s(a) && f < s(b));
  if (!cur) return null;
  const p = out(f, s(cur[0]), s(cur[0]) + 4);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1185, display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)' }}>
      <div style={{ background: 'rgba(48,46,43,0.72)', color: '#fff', fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: -0.2, padding: '12px 28px 14px', borderRadius: 18, whiteSpace: 'nowrap', opacity: p, transform: `scale(${0.96 + 0.04 * p})` }}>
        {cur[2]}
      </div>
    </div>
  );
};

export const ClaudeCodeMode: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: 1 - lin(f, TOTAL - 10, TOTAL) }}>
      <AbsoluteFill style={{ background: `radial-gradient(1200px 900px at 50% 30%, ${C.paper}, ${C.bg})` }} />
      <Stage f={f} />
      <Captions f={f} />
      <Sfx />
    </AbsoluteFill>
  );
};
