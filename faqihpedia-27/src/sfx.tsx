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
  0.9, 14.2, 35.6, 59.6, 71.3, // stickers over the full-frame talking head
  3.5, 5.5, 7.7, 10.3, // quote
  17.9, 20.5, 23.4, 24.3, // penasaran
  25.9, 27.2, 30.5, // nyesel
  37.9, 38.2, 41.3, 42.2, // kecil
  44.7, 44.9, 45.5, 47.6, 50.0, 51.5, 55.5, 56.6, // kamar
  62.3, 63.4, 64.8, 66.9, 68.3, 69.7, // alasan
  75.2, 76.6, 78.4, // progress
  82.9, 83.2, 85.0, 85.4, 85.8, 86.1, 86.8, // konsep
];
const THUDS = [11.7, 31.2, 54.0];
const DINGS = [81.1, 84.7];

const CUES: [number, Kind][] = [
  ...LAYOUT.slice(1).map(([t]) => [s(t) - 4, 'whoosh'] as [number, Kind]),
  ...POPS.map((t) => [s(t), 'pop'] as [number, Kind]),
  ...THUDS.map((t) => [s(t), 'thud'] as [number, Kind]),
  ...DINGS.map((t) => [s(t), 'ding'] as [number, Kind]),
  // one pop per person walking into the room (scenes.tsx: every 5 frames from 52.2s)
  ...Array.from({ length: 10 }, (_, i) => [s(52.2) + i * 5, 'tick'] as [number, Kind]),
  // the day counter ticking from 1 to 27 (scenes.tsx: 77.6s - 80.2s, eased)
  ...Array.from({ length: 9 }, (_, i) => [s(77.6) + Math.round(((i + 1) / 10) * (s(80.2) - s(77.6))), 'tick'] as [number, Kind]),
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
