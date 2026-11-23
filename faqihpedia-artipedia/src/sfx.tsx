import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { LAYOUT, s } from './theme';

/*
 * Subtle sound effects under the voice. Times are the same source.mp4
 * seconds the scenes use. Files come from scripts/sfx.py.
 */
type Kind = 'pop' | 'whoosh' | 'thud' | 'ding' | 'tick' | 'ting';
const VOL: Record<Kind, number> = { pop: 0.05, whoosh: 0.07, thud: 0.08, ding: 0.05, tick: 0.025, ting: 0.06 };

const POPS = [
  0.3, 1.4, 2.1, 5.9, // hook
  9.6, 11.7, 13.7, 15.1, 18.4, 19.6, 20.5, // paideia
  21.4, 23.8, 25.7, 27.2, 30.1, 30.3, 32.2, // pediatri
  33.4, // bedah lebih dalam
  36.0, 39.2, 40.7, 41.1, 41.4, 42.3, 46.8, 51.3, // ensiklopedia
  55.7, 58.4, 60.6, 63.9, 66.7, // wikipedia
  68.5, 70.6, 72.6, 75.3, 75.6, 76.2, 77.4, 79.5, 82.2, // tokopedia
  88.5, 90.2, // faqihpedia
  93.4, 96.1, 96.6, 98.0, 101.0, 102.9, 103.6, // berbagi
  108.9, // like
];
const THUDS = [111.35];
const DINGS = [4.7, 48.75, 81.8, 99.8];
// TRIMS rule: a spoon-on-plate "ting" whenever a fact lands
const TINGS = [13.9, 20.5, 28.5, 32.2, 37.0, 42.3, 56.7, 58.4, 76.9, 88.5];

const CUES: [number, Kind][] = [
  ...LAYOUT.slice(1).map(([t]) => [s(t) - 5, 'whoosh'] as [number, Kind]),
  ...POPS.map((t) => [s(t), 'pop'] as [number, Kind]),
  ...THUDS.map((t) => [s(t), 'thud'] as [number, Kind]),
  ...DINGS.map((t) => [s(t), 'ding'] as [number, Kind]),
  ...TINGS.map((t) => [s(t), 'ting'] as [number, Kind]),
  // end card: whoosh in, then the closing ting
  [s(112.35) - 4, 'whoosh'],
  [s(112.35) + 14, 'ting'],
  // the A -> Z meter (scenes.tsx: 48.1s - 48.75s) and the A-Z shelf (80.9s - 81.8s)
  ...Array.from({ length: 5 }, (_, i) => [s(48.1) + Math.round((i / 5) * (s(48.75) - s(48.1))), 'tick'] as [number, Kind]),
  ...Array.from({ length: 6 }, (_, i) => [s(80.9) + Math.round((i / 6) * (s(81.8) - s(80.9))), 'tick'] as [number, Kind]),
  // typing in the search bar (64.0s - 65.5s)
  ...Array.from({ length: 8 }, (_, i) => [s(64.0) + Math.round((i / 8) * (s(65.5) - s(64.0))), 'tick'] as [number, Kind]),
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
