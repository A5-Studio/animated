import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { DINGS, POPS, SCENES, THUDS } from './scenes';
import { s } from './theme';

/* Subtle sound effects under the voice, on the same cue times as the scenes. */
type Kind = 'pop' | 'whoosh' | 'thud' | 'ding' | 'tick';
const VOL: Record<Kind, number> = { pop: 0.07, whoosh: 0.08, thud: 0.1, ding: 0.07, tick: 0.03 };

const CUES: [number, Kind][] = [
  ...SCENES.slice(1).map(({ from }) => [s(from) - 4, 'whoosh'] as [number, Kind]),
  ...POPS.map((t) => [s(t), 'pop'] as [number, Kind]),
  ...THUDS.map((t) => [s(t), 'thud'] as [number, Kind]),
  ...DINGS.map((t) => [s(t) + 3, 'ding'] as [number, Kind]),
];

export const Sfx: React.FC = () => (
  <>
    {CUES.map(([from, kind], i) => (
      <Sequence key={i} from={Math.max(0, from)} durationInFrames={30} layout="none">
        <Html5Audio src={staticFile(`sfx/${kind}.wav`)} volume={VOL[kind]} />
      </Sequence>
    ))}
  </>
);
