import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { At, Box, Gingham, Rich, lin, pop } from './components';
import { SCENES } from './scenes';
import { C, HEAD, TIMING, TOTAL } from './theme';
import VO from './vo.json';

/** voice clips exist in public/vo (scripts/voice.py) */
export const HAS_VO = Object.keys(VO).length > 0;

const STAGE_TOP = 180;

const Badge: React.FC<{ f: number }> = ({ f }) => {
  const hidden = TIMING.filter((b) => b.id === 'bumper' || b.id === 'outro');
  const o = hidden.reduce((acc, b) => acc * (1 - (lin(f, b.from - 4, b.from + 2) * (1 - lin(f, b.from + b.len - 2, b.from + b.len + 6)))), 1);
  return (
    <At x={540} y={100} s={pop(f, 2)} r={-2} o={o}>
      <Box bg={C.ink} pad="10px 24px" radius={14} sh={0} style={{ color: C.white, fontFamily: HEAD, fontSize: 36, whiteSpace: 'nowrap', boxShadow: `7px 7px 0 ${C.orange}` }}>
        TRIMS · <span style={{ color: C.yellow }}>MENU #001</span>
      </Box>
    </At>
  );
};

/** caption card in the lower area; each beat's voice line split on " | " */
const Captions: React.FC<{ f: number }> = ({ f }) => (
  <>
    {TIMING.filter((b) => b.vo).map((b) => {
      const parts = b.vo!.split(' | ');
      const total = parts.reduce((n, p) => n + p.length, 0);
      let at = b.from;
      const span = b.len - 4;
      return parts.map((p, i) => {
        const from = at;
        const to = from + Math.round((p.length / total) * span);
        at = to;
        if (f < from || f >= to) return null;
        const inn = pop(f, from, 260);
        return (
          <At key={`${b.id}${i}`} x={540} y={1640} s={0.9 + 0.1 * inn} o={Math.min(1, inn * 1.6)} r={i % 2 ? 0.8 : -0.8} z={5}>
            <Box pad="22px 30px" style={{ width: 940, fontSize: 46, lineHeight: 1.35, fontWeight: 600, textAlign: 'center' }}>
              <Rich text={p} />
            </Box>
          </At>
        );
      });
    })}
  </>
);

type Kind = 'pop' | 'whoosh' | 'ding' | 'tick' | 'thud';
const VOL: Record<Kind, number> = { pop: 0.07, whoosh: 0.08, ding: 0.08, tick: 0.04, thud: 0.1 };
const at = (id: string, frac = 0, add = 0) => {
  const b = TIMING.find((x) => x.id === id)!;
  return b.from + Math.round(b.len * frac) + add;
};
const CUES: [number, Kind][] = [
  ...TIMING.slice(1).map((b) => [b.from - 4, 'whoosh'] as [number, Kind]),
  [at('hook', 0, 30), 'pop'], [at('hook', 0, 40), 'pop'],
  [at('bumper', 0, 2), 'ding'],
  [at('shannon', 0, 24), 'pop'], [at('shannon', 0.25), 'pop'],
  [at('bit', 0.35, 34), 'ding'], [at('bit', 0.7), 'pop'],
  [at('turing', 0, 20), 'thud'], [at('turing', 0.4), 'pop'],
  [at('turingWork', 0.42), 'pop'],
  [at('meet', 0, 12), 'thud'], [at('meet', 0, 22), 'pop'],
  [at('predict', 0.32), 'ding'], [at('predict', 0.32, 12), 'ding'], [at('predict', 0.55), 'pop'],
  [at('lifespan', 0, 36), 'pop'], [at('lifespan', 0, 44), 'pop'],
  [at('ask', 0, 18), 'thud'],
  [at('outro', 0, 2), 'ding'],
];

export const TrimsMenu001: React.FC = () => {
  const f = useCurrentFrame();
  const fadeOut = 1 - lin(f, TOTAL - 8, TOTAL);
  return (
    <AbsoluteFill style={{ background: C.rice, opacity: fadeOut, overflow: 'hidden' }}>
      <Gingham f={f} />
      {TIMING.map((b) => {
        const Scene = SCENES[b.id];
        return (
          <Sequence key={b.id} from={b.from} durationInFrames={b.len} layout="none">
            <SceneFrame f={f - b.from} len={b.len} full={b.id === 'bumper'}>
              <Scene t={f - b.from} len={b.len} />
            </SceneFrame>
          </Sequence>
        );
      })}
      <Badge f={f} />
      <Captions f={f} />
      {HAS_VO &&
        TIMING.filter((b) => b.vo).map((b) => (
          <Sequence key={`vo-${b.id}`} from={b.from} durationInFrames={b.len} layout="none">
            {(VO as Record<string, number>)[b.id] ? <Html5Audio src={staticFile(`vo/${b.id}.wav`)} /> : null}
          </Sequence>
        ))}
      {CUES.map(([from, kind], i) => (
        <Sequence key={i} from={Math.max(0, from)} durationInFrames={30} layout="none">
          <Html5Audio src={staticFile(`sfx/${kind}.wav`)} volume={VOL[kind]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** quick scale/fade out at the end of each beat so cuts feel like pops */
const SceneFrame: React.FC<{ f: number; len: number; full: boolean; children: React.ReactNode }> = ({ f, len, full, children }) => {
  if (full) return <AbsoluteFill>{children}</AbsoluteFill>;
  const out = lin(f, len - 5, len);
  return (
    <AbsoluteFill style={{ top: STAGE_TOP - 180, opacity: 1 - out, transform: `scale(${1 - 0.06 * out})` }}>{children}</AbsoluteFill>
  );
};
