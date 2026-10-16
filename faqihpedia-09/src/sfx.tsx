import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { LAYOUT, ZOOMS, s } from './theme';

/*
 * Subtle sound effects under the voice. Times are the same transcript
 * seconds the scenes use. Files come from scripts/sfx.py.
 */
type Kind = 'pop' | 'whoosh' | 'thud' | 'ding' | 'tick' | 'zoom' | 'buzz';
const VOL: Record<Kind, number> = { pop: 0.05, whoosh: 0.07, thud: 0.08, ding: 0.05, tick: 0.025, zoom: 0.07, buzz: 0.035 };

const POPS = [
  0.3, 3.9, 7.8, 12.8, 38.6, 59.7, // stickers over the full-frame talking head
  16.5, 17.5, 18.6, 18.8, 19.2, 19.45, 19.7, 20.5, 24.5, // skala
  25.4, 26.7, 27.7, 28.8, 30.3, 31.2, 33.1, 36.1, // 0 - 100
  41.5, 45.1, 49.0, 50.0, 54.2, 56.2, // mulai dari 50
  62.0, 62.5, 63.8, 70.7, 76.4, // orang baru
];
const THUDS = [25.1, 34.4, 42.9];
const DINGS = [45.1, 64.0];
const BUZZ = [71.1, 76.8];

/** ticks while something slides: n clicks spread over [a, b] */
const ticks = (a: number, b: number, n: number) =>
  Array.from({ length: n }, (_, i) => [s(a) + Math.round((i / (n - 1)) * (s(b) - s(a))), 'tick'] as [number, Kind]);

const CUES: [number, Kind][] = [
  ...LAYOUT.slice(1).map(([t]) => [s(t) - 4, 'whoosh'] as [number, Kind]),
  ...ZOOMS.map(([t]) => [s(t) - 6, 'zoom'] as [number, Kind]),
  ...POPS.map((t) => [s(t), 'pop'] as [number, Kind]),
  ...THUDS.map((t) => [s(t), 'thud'] as [number, Kind]),
  ...DINGS.map((t) => [s(t), 'ding'] as [number, Kind]),
  ...BUZZ.map((t) => [s(t), 'buzz'] as [number, Kind]),
  ...ticks(22.3, 23.3, 5), // the line drawing in
  ...ticks(50.0, 52.9, 8), // pin sliding right (scenes.tsx: Mulai50)
  ...ticks(56.2, 57.2, 6), // pin sliding left
  ...ticks(67.4, 68.5, 4), // ghost drifting right (OrangBaru)
  ...ticks(74.1, 75.1, 4), // ghost drifting left
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
