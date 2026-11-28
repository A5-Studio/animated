import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { PIECES, PIECE_AT, SCENES } from './scenes';
import { s } from './theme';

/* Quiet sound effects, no music bed (AI (An Info) standard). */
type Kind = 'pop' | 'whoosh' | 'ding' | 'tick';
const VOL: Record<Kind, number> = { pop: 0.04, whoosh: 0.05, ding: 0.045, tick: 0.025 };

const at = (scene: number, frame: number) => s(SCENES[scene].from) + frame;

const CUES: [number, Kind][] = [
  ...SCENES.slice(1).map((sc) => [s(sc.from) - 4, 'whoosh'] as [number, Kind]),
  ...[20, 28, 36].map((k) => [at(0, k), 'pop'] as [number, Kind]), // quoted chips
  [at(1, 14), 'tick'],
  [at(1, 40), 'tick'],
  [at(1, 120), 'pop'], // stamp
  [at(2, 50), 'ding'], // harness ring closes
  ...PIECES.map((_, i) => [at(3, PIECE_AT(i)), 'pop'] as [number, Kind]),
  [at(4, 24), 'tick'],
  [at(4, 50), 'tick'],
  [at(4, 80), 'pop'],
  [at(5, 6), 'pop'],
  [at(5, 20), 'ding'],
  ...[0, 40, 80].flatMap((w) => [0, 4, 8].map((k) => [at(5, 26 + w + k), 'tick'] as [number, Kind])),
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
