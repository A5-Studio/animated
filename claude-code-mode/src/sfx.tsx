import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { SCENES, WORDS, WORD_AT } from './scenes';
import { s } from './theme';

/* Quiet sound effects, no music bed (AI (An Info) standard). */
type Kind = 'pop' | 'whoosh' | 'ding' | 'tick';
const VOL: Record<Kind, number> = { pop: 0.04, whoosh: 0.05, ding: 0.045, tick: 0.025 };

const at = (scene: number, frame: number) => s(SCENES[scene].from) + frame;

const CUES: [number, Kind][] = [
  ...SCENES.slice(1).map((sc) => [s(sc.from) - 4, 'whoosh'] as [number, Kind]),
  ...[0, 11, 22, 33, 44, 55, 66, 77, 88].map((k) => [at(0, k), 'tick'] as [number, Kind]), // words flipping
  [at(0, 24), 'pop'],
  ...Array.from({ length: 9 }, (_, i) => [at(1, 4 + i * 2), 'tick'] as [number, Kind]), // typing
  ...[60, 100, 140].map((k) => [at(1, k), 'tick'] as [number, Kind]),
  [at(2, 10), 'pop'],
  ...WORDS.map((_, i) => [at(3, WORD_AT(i)), 'tick'] as [number, Kind]),
  [at(3, WORD_AT(12) + 6), 'pop'],
  ...[14, 54, 94].map((k) => [at(4, k), 'pop'] as [number, Kind]),
  [at(5, 6), 'pop'],
  [at(5, 20), 'ding'],
  ...[0, 40, 80].flatMap((w) => [0, 4, 8, 12].map((k) => [at(5, 26 + w + k), 'tick'] as [number, Kind])), // typing a word
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
