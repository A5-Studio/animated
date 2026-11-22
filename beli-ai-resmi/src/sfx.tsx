import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { SCENES } from './theme';

/* Sound effects on the same frames the scenes animate on (scene start + local frame). */
type Kind = 'pop' | 'whoosh' | 'thud' | 'ding' | 'tick';
const VOL: Record<Kind, number> = { pop: 0.35, whoosh: 0.4, thud: 0.6, ding: 0.35, tick: 0.2 };
const at = (k: keyof typeof SCENES, f: number) => SCENES[k].from + f;

const CUES: [number, Kind][] = [
  ...Object.values(SCENES).slice(1).map((s) => [s.from - 6, 'whoosh'] as [number, Kind]),
  [at('hook', 8), 'pop'],
  [at('hook', 30), 'thud'],
  [at('post', 4), 'pop'],
  [at('post', 42), 'tick'],
  [at('post', 112), 'ding'],
  [at('offers', 18), 'pop'],
  [at('offers', 30), 'pop'],
  [at('offers', 42), 'pop'],
  [at('offers', 80), 'tick'],
  [at('offers', 88), 'tick'],
  [at('offers', 96), 'tick'],
  [at('offers', 110), 'pop'],
  [at('risk1', 40), 'pop'],
  [at('risk1', 85), 'thud'],
  ...[0, 1, 2, 3].map((i) => [at('risk2', 40 + i * 7), 'tick'] as [number, Kind]),
  [at('risk3', 40), 'pop'],
  ...[0, 1, 2, 3].map((i) => [at('risk3', 55 + i * 10), 'tick'] as [number, Kind]),
  [at('official', 16), 'pop'],
  [at('official', 66), 'ding'],
  ...[0, 1, 2, 3].map((i) => [at('official', 90 + i * 26), 'tick'] as [number, Kind]),
  ...[0, 1, 2].map((i) => [at('rule', 18 + i * 10), 'pop'] as [number, Kind]),
  [at('outro', 18), 'thud'],
];

export const Sfx: React.FC = () => (
  <>
    {CUES.map(([from, kind], i) => (
      <Sequence key={i} from={Math.max(0, from)} durationInFrames={45} layout="none">
        <Html5Audio src={staticFile(`sfx/${kind}.wav`)} volume={VOL[kind]} />
      </Sequence>
    ))}
  </>
);
