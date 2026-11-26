import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { LAYOUT, s } from './theme';

/*
 * Quiet sound effects under the voice, no music bed:
 * a whoosh on layout changes, ticks on switches and typing, pops on chips, a ding on a result.
 * Times are seconds of public/source.mp4, the same cues the scenes use.
 */
type Kind = 'pop' | 'whoosh' | 'ding' | 'tick';
const VOL: Record<Kind, number> = { pop: 0.04, whoosh: 0.05, ding: 0.045, tick: 0.025 };

const CUES: [number, Kind][] = [
  // whoosh on every layout change (consecutive split -> split scene swaps included)
  ...LAYOUT.slice(1).map(([t]) => [s(t) - 4, 'whoosh'] as [number, Kind]),
  [s(3.85), 'pop'], // "ya kalian gak salah denger"
  [s(7.3), 'pop'], // "tidak ada"
  ...Array.from({ length: 6 }, (_, i) => [s(5.6) + i * 6, 'tick'] as [number, Kind]), // typing the search
  ...[13.4, 15.4, 17.4].map((t) => [s(t), 'pop'] as [number, Kind]), // forum posts
  ...[21.5, 23.6, 24.4].map((t) => [s(t), 'pop'] as [number, Kind]), // name chips
  [s(30.6), 'pop'], // b-i-t lights up
  ...Array.from({ length: 8 }, (_, i) => [s(34.0) + i * 3, 'tick'] as [number, Kind]), // binary typing
  [s(37.6), 'ding'], // the computer understands
  ...[46.7, 47.8, 48.9, 50.4].map((t) => [s(t), 'pop'] as [number, Kind]), // Theseus callouts
  ...[58.6, 60.6, 62.4].map((t) => [s(t), 'pop'] as [number, Kind]), // maze layers
  ...[64.3, 65.0, 65.7].map((t) => [s(t), 'tick'] as [number, Kind]), // relays switching
  ...[68.6, 69.9].map((t) => [s(t), 'tick'] as [number, Kind]), // 0 / 1 toggles
  [s(75.1), 'ding'], // the mouse is out
  ...Array.from({ length: 6 }, (_, i) => [s(79.4) + i * 7, 'tick'] as [number, Kind]), // typing the search
  [s(82.4), 'pop'],
  ...[86.0, 89.6].map((t) => [s(t), 'pop'] as [number, Kind]),
  [s(96.85), 'pop'], // coba nonton
  [s(101.0), 'pop'],
  [s(103.3), 'pop'],
  [s(107.4), 'tick'],
  ...[111.9, 112.9].map((t) => [s(t), 'pop'] as [number, Kind]),
  [s(119.6), 'tick'],
  [s(123.4), 'pop'],
  [s(127.4), 'tick'], // follow click
  [s(124.45), 'pop'],
  [s(126.8), 'pop'],
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
