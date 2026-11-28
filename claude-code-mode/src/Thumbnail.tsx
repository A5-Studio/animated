import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, MONO, SANS, SERIF, T, soft } from './theme';
import { SegmentTag } from './ui';
import { DotSpin } from './term';

/* Cover: headline + key visual inside the safe box x 120-960, y 285-1250. */
const W = ['Brewing', 'Clauding', 'Cooking', 'Pondering', 'Vibing', 'Marinating'];

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill style={{ background: `radial-gradient(1200px 900px at 50% 30%, ${C.paper}, ${C.bg})` }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 305, display: 'flex', justifyContent: 'center' }}>
      <SegmentTag size={28} topic="Claude Code" />
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 400, textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: 108, lineHeight: 1.02, letterSpacing: -3.5, color: C.ink }}>
      <span style={{ color: T.claude }}>Brewing</span>, <span style={{ color: T.claude }}>Cooking</span> itu artinya apa?
    </div>
    <div style={{ position: 'absolute', left: 120, top: 800, width: 840, height: 430, background: T.bg, borderRadius: 34, boxShadow: soft, padding: '34px 40px', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 20px', alignContent: 'center' }}>
      {W.map((w) => (
        <div key={w} style={{ fontFamily: MONO, fontSize: 38, fontWeight: 700, color: T.claude, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 14 }}><DotSpin f={W.indexOf(w) * 7} size={40} />{w}…</div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: C.card, borderRadius: 40, padding: '16px 30px', boxShadow: soft, fontFamily: SANS, fontSize: 34, fontWeight: 600, color: C.ink }}>
        + puluhan kata lain
      </div>
    </div>
  </AbsoluteFill>
);
