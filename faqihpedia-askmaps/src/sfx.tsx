import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { LAYOUT, s } from './theme';

/*
 * Quiet sound effects under the voice (files from faqihpedia-22/scripts/sfx.py).
 * Times are seconds of public/source.mp4, the same cues the scenes use.
 */
type Kind = 'pop' | 'whoosh' | 'ding' | 'tick';
const VOL: Record<Kind, number> = { pop: 0.04, whoosh: 0.05, ding: 0.045, tick: 0.025 };

const CUES: [number, Kind][] = [
  ...LAYOUT.slice(1).map(([t]) => [s(t) - 4, 'whoosh'] as [number, Kind]),
  [s(4.4) - 2, 'whoosh'],
  // pins dropping (scenes.tsx: from 6.6s, every 2 frames), a few of them
  ...[0, 3, 6, 9].map((k) => [s(6.6) + k * 2, 'tick'] as [number, Kind]),
  // opening places one by one, then switching tabs
  ...[8.6, 9.78, 10.42, 15.18, 18.64].map((t) => [s(t), 'tick'] as [number, Kind]),
  [s(11.74), 'pop'],
  [s(12.82), 'pop'],
  // criteria chips, then the "sent" checks
  ...[32.18, 35.94, 38.42, 40.64].map((t) => [s(t), 'pop'] as [number, Kind]),
  [s(41.8), 'ding'],
  // the answer
  [s(45.3), 'ding'],
  [s(47.4), 'pop'],
  [s(51.48), 'ding'],
  [s(57.4), 'pop'],
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
