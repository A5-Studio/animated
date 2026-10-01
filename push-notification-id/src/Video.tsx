import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { Cast, Hook, Recap, Step1, Step2, Step3, Step4, Step5 } from './scenes';
import { C, SCENES } from './theme';

const ORDER = [
  ['hook', Hook],
  ['cast', Cast],
  ['step1', Step1],
  ['step2', Step2],
  ['step3', Step3],
  ['step4', Step4],
  ['step5', Step5],
  ['recap', Recap],
] as const;

const WIPE_COLORS = [C.yellow, C.pink, C.blue, C.green, C.purple, C.orange, C.yellow];

/** A loud color panel that slams up across the cut between two scenes. */
const Wipe: React.FC<{ at: number; color: string }> = ({ at, color }) => {
  const f = useCurrentFrame();
  const opt = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) } as const;
  const y = f < at ? interpolate(f, [at - 9, at], [1920, 0], opt) : interpolate(f, [at, at + 9], [0, -1920], opt);
  if (f < at - 9 || f > at + 9) return null;
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)`, background: color, borderTop: `14px solid ${C.ink}`, borderBottom: `14px solid ${C.ink}` }} />
  );
};

export const PushNotifID: React.FC = () => (
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
