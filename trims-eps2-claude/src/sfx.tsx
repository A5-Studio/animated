import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { BUMPER_AT, END_CARD, LAYOUT, s } from './theme';

/*
 * Subtle sound effects under the voice. Times are the same source.mp4
 * seconds the scenes use. Files come from scripts/sfx.py.
 */
type Kind = 'pop' | 'whoosh' | 'thud' | 'ding' | 'tick' | 'ting';
const VOL: Record<Kind, number> = { pop: 0.05, whoosh: 0.07, thud: 0.08, ding: 0.05, tick: 0.025, ting: 0.06 };

const POPS = [
  0.4, 2.0, 3.9, // hook
  5.5, 6.8, 7.4, 10.4, // no official statement
  12.9, 13.4, 15.4, 17.4, // forums
  19.4, 20.6, 21.5, 23.6, 24.4, // name
  26.6, 27.4, 29.9, 30.4, 32.6, 33.8, 37.3, // bit
  39.3, 41.8, 42.4, 45.3, 46.7, 47.8, 48.9, 50.4, // theseus
  53.0, 54.0, 58.6, 60.6, 62.4, // maze brain
  68.6, 69.9, 71.2, // on / off
  76.6, 79.6, 80.4, 82.4, // look it up
  84.1, 85.3, 86.0, 86.6, 89.6, // same era
  92.4, 93.0, 95.1, 95.6, // film
  99.9, 101.0, 101.6, 103.6, 105.3, 109.4, 113.9, 114.9, // bell labs
  117.3, 118.9, 120.4, 121.6, 123.6, // versus
  126.5, 128.8, // outro
];
const THUDS = [8.0, 114.4, 115.3, 131.9];
const DINGS = [37.6, 75.1, 97.5];
// TRIMS rule: a spoon-on-plate "ting" whenever a fact lands
const TINGS = [19.9, 30.6, 39.3, 46.7, 56.4, 86.0, 95.6, 105.3, 119.6];

const CUES: [number, Kind][] = [
  ...LAYOUT.slice(1).filter(([t]) => t !== BUMPER_AT).map(([t]) => [s(t) - 5, 'whoosh'] as [number, Kind]),
  ...POPS.map((t) => [s(t), 'pop'] as [number, Kind]),
  ...THUDS.map((t) => [s(t), 'thud'] as [number, Kind]),
  ...DINGS.map((t) => [s(t), 'ding'] as [number, Kind]),
  ...TINGS.map((t) => [s(t), 'ting'] as [number, Kind]),
  // end card: whoosh in, then the closing ting
  [s(END_CARD) - 4, 'whoosh'],
  [s(END_CARD) + 14, 'ting'],
  // binary typing (scenes.tsx Bit: 34.0s, one digit per 1.4 frames)
  ...Array.from({ length: 10 }, (_, i) => [s(34.0) + i * 2, 'tick'] as [number, Kind]),
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
