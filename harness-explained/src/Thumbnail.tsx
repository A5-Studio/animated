import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Diagram } from './scenes';
import { C, SERIF, T } from './theme';
import { SegmentTag } from './ui';

/* Cover: headline + key visual inside the safe box x 120-960, y 285-1250. */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill style={{ background: `radial-gradient(1200px 900px at 50% 30%, ${C.paper}, ${C.bg})` }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 305, display: 'flex', justifyContent: 'center' }}>
      <SegmentTag size={28} topic="Istilah AI" />
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 395, textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: 104, lineHeight: 1.0, letterSpacing: -3.5, color: C.ink }}>
      <span style={{ color: T.claude }}>Harness</span> AI itu apa?
    </div>
    <Diagram f={0} cx={540} cy={860} r={210} shown={4} />
  </AbsoluteFill>
);
