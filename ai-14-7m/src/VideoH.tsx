import React from 'react';
import { AbsoluteFill, Easing, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ChatGPTH, ClaudeH, GeminiH, HookH, RecapH } from './scenesH';
import { C, SCENES_H } from './theme';

const ORDER = [
  ['hook', HookH],
  ['claude', ClaudeH],
  ['chatgpt', ChatGPTH],
  ['gemini', GeminiH],
  ['recap', RecapH],
] as const;

const WIPE_COLORS = [C.orange, C.green, C.blue, C.pink];

/** a loud color panel that slams across the cut, right to left */
const Wipe: React.FC<{ at: number; color: string }> = ({ at, color }) => {
  const f = useCurrentFrame();
  const opt = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) } as const;
  const x = f < at ? interpolate(f, [at - 9, at], [1920, 0], opt) : interpolate(f, [at, at + 9], [0, -1920], opt);
  if (f < at - 9 || f > at + 9) return null;
  return <AbsoluteFill style={{ transform: `translateX(${x}px)`, background: color, borderLeft: `14px solid ${C.ink}`, borderRight: `14px solid ${C.ink}` }} />;
};

export const Ai147MH: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {ORDER.map(([key, Scene]) => (
      <Sequence key={key} from={SCENES_H[key].from} durationInFrames={SCENES_H[key].dur} name={key}>
        <Scene />
      </Sequence>
    ))}
    {ORDER.slice(1).map(([key], i) => (
      <Wipe key={key} at={SCENES_H[key].from} color={WIPE_COLORS[i]} />
    ))}
    <Html5Audio src={staticFile('soundtrack-h.wav')} />
  </AbsoluteFill>
);
