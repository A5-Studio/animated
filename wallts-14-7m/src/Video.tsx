import React from 'react';
import { AbsoluteFill, Easing, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Fakta, Hook, Laris, Produk, Recap, Tumpuk } from './scenes';
import { C, SCENES } from './theme';

const ORDER = [
  ['hook', Hook],
  ['produk', Produk],
  ['tumpuk', Tumpuk],
  ['fakta', Fakta],
  ['laris', Laris],
  ['recap', Recap],
] as const;

const WIPE_COLORS = [C.yellow, C.blue, C.pink, C.orange, C.yellow];

/** a loud color panel that slams across the cut, right to left */
const Wipe: React.FC<{ at: number; color: string }> = ({ at, color }) => {
  const f = useCurrentFrame();
  const opt = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) } as const;
  const x = f < at ? interpolate(f, [at - 9, at], [1920, 0], opt) : interpolate(f, [at, at + 9], [0, -1920], opt);
  if (f < at - 9 || f > at + 9) return null;
  return <AbsoluteFill style={{ transform: `translateX(${x}px)`, background: color, borderLeft: `14px solid ${C.ink}`, borderRight: `14px solid ${C.ink}` }} />;
};

export const Wallts147M: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {ORDER.map(([key, Scene]) => (
      <Sequence key={key} from={SCENES[key].from} durationInFrames={SCENES[key].dur} name={key}>
        <Scene />
      </Sequence>
    ))}
    {ORDER.slice(1).map(([key], i) => (
      <Wipe key={key} at={SCENES[key].from} color={WIPE_COLORS[i]} />
    ))}
    <Html5Audio src={staticFile('soundtrack.wav')} />
  </AbsoluteFill>
);
