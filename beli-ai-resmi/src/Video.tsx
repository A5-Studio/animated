import React from 'react';
import { AbsoluteFill, Easing, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Hook, Offers, Official, Outro, Post, Risk1, Risk2, Risk3, Rule } from './scenes';
import { C, SCENES } from './theme';
import { Sfx } from './sfx';

const ORDER = [
  ['hook', Hook],
  ['post', Post],
  ['offers', Offers],
  ['risk1', Risk1],
  ['risk2', Risk2],
  ['risk3', Risk3],
  ['official', Official],
  ['rule', Rule],
  ['outro', Outro],
] as const;

/** A bar in the incoming scene's color sweeps across the cut. */
const Wipe: React.FC<{ at: number; dark: boolean }> = ({ at, dark }) => {
  const f = useCurrentFrame();
  if (f < at - 8 || f > at + 8) return null;
  const opt = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) } as const;
  const x = f < at ? interpolate(f, [at - 8, at], [-1080, 0], opt) : interpolate(f, [at, at + 8], [0, 1080], opt);
  const fill = dark ? C.paper : C.ink;
  return <AbsoluteFill style={{ transform: `translateX(${x}px)`, background: fill }} />;
};

export const BeliAIResmi: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    {ORDER.map(([key, Scene]) => (
      <Sequence key={key} from={SCENES[key].from} durationInFrames={SCENES[key].dur} name={key}>
        <Scene />
      </Sequence>
    ))}
    {ORDER.slice(1).map(([key]) => (
      <Wipe key={key} at={SCENES[key].from} dark={SCENES[key].dark} />
    ))}
    <Html5Audio src={staticFile('music.wav')} volume={0.35} />
    <Sfx />
  </AbsoluteFill>
);
