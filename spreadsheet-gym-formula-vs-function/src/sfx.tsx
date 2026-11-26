import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { DINGS, POPS, SCENES, THUDS, TICKS, WHISTLE } from './scenes';
import { s } from './theme';

/* Subtle sound effects under the voice, on the same cue times as the scenes.
 * Segment sounds (brand/segments.ts): coach whistle at the start, ticking
 * 10-second countdown for "pause dulu". */
type Kind = 'pop' | 'whoosh' | 'thud' | 'ding' | 'tick' | 'whistle';
const VOL: Record<Kind, number> = { pop: 0.07, whoosh: 0.08, thud: 0.1, ding: 0.09, tick: 0.12, whistle: 0.22 };

const CUES: [number, Kind][] = [
  ...SCENES.slice(1).map(({ from }) => [s(from) - 4, 'whoosh'] as [number, Kind]),
  ...POPS.map((t) => [s(t), 'pop'] as [number, Kind]),
  ...THUDS.map((t) => [s(t), 'thud'] as [number, Kind]),
  ...DINGS.map((t) => [s(t) + 3, 'ding'] as [number, Kind]),
  ...TICKS.map((t) => [s(t), 'tick'] as [number, Kind]),
  [s(WHISTLE), 'whistle'],
];

export const Sfx: React.FC = () => (
  <>
    {CUES.map(([from, kind], i) => (
      <Sequence key={i} from={Math.max(0, from)} durationInFrames={kind === 'whistle' ? 45 : 30} layout="none">
        <Html5Audio src={staticFile(`sfx/${kind}.wav`)} volume={VOL[kind]} />
      </Sequence>
    ))}
  </>
);
