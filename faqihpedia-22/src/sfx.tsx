import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { LAYOUT, s } from './theme';

/*
 * Subtle sound effects under the voice. Times are the same transcript
 * seconds the scenes use. Files come from scripts/sfx.py.
 */
type Kind = 'pop' | 'whoosh' | 'thud' | 'ding' | 'tick';
const VOL: Record<Kind, number> = { pop: 0.05, whoosh: 0.06, thud: 0.08, ding: 0.05, tick: 0.025 };

const POPS = [
  0.4, 13.0, 42.6, // stickers over the full-frame talking head
  3.4, 3.6, 6.4, 7.2, 9.4, // podcast
  16.1, 16.3, 17.6, 19.1, 20.2, 23.6, 24.8, 26.5, // lama tapi bingung
  27.5, 29.0, 29.3, 30.2, 32.9, 34.7, 39.0, 39.9, // jago
  45.9, 46.3, 49.4, // masa kerja
  51.5, 52.4, 54.0, 57.0, 58.1, 60.6, 61.6, // pelajari
  63.4, 63.6, 64.0, 65.7, // sama durasi
];
const THUDS = [32.3, 50.1];
const DINGS = [36.3, 62.5, 70.7];

const CUES: [number, Kind][] = [
  ...LAYOUT.slice(1).map(([t]) => [s(t) - 4, 'whoosh'] as [number, Kind]),
  ...POPS.map((t) => [s(t), 'pop'] as [number, Kind]),
  ...THUDS.map((t) => [s(t), 'thud'] as [number, Kind]),
  ...DINGS.map((t) => [s(t), 'ding'] as [number, Kind]),
  // the year counter flipping 2016 -> 2025 (scenes.tsx: 17.7s - 18.9s, eased)
  ...Array.from({ length: 6 }, (_, i) => [s(17.7) + Math.round(((i + 1) / 7) * (s(18.9) - s(17.7))), 'tick'] as [number, Kind]),
  // the A -> Z meter filling (scenes.tsx: 34.9s - 36.3s)
  ...Array.from({ length: 6 }, (_, i) => [s(34.9) + Math.round((i / 6) * (s(36.3) - s(34.9))), 'tick'] as [number, Kind]),
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
