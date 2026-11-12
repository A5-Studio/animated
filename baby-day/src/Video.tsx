import React from 'react';
import { AbsoluteFill, Audio, Easing, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Background, Cloud, Footage, Heart, Icon, Rainbow, Ribbon, Script, Star, TimePill, fadeIn, usePop } from './components';
import { BABY, C, INTRO, MOMENTS, Moment, OUTRO, SANS, XFADE, s } from './theme';

/** wipes the next scene in as a soft circle growing from the bottom */
const Enter: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const f = useCurrentFrame();
  const r = first ? 150 : interpolate(f, [0, XFADE + 6], [0, 150], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  return <AbsoluteFill style={{ clipPath: `circle(${r}% at 50% 100%)` }}>{children}</AbsoluteFill>;
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background />
      <Cloud x={150} y={190} w={240} face />
      <Star x={760} y={300} size={60} delay={10} />
      <Star x={120} y={720} size={44} color={C.butter} delay={16} />
      <Heart x={880} y={760} size={48} delay={20} />
      <Heart x={90} y={400} size={40} color={C.pink} delay={24} />
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40, paddingBottom: 260 }}>
        <Ribbon text="A DAY IN THE LIFE OF" delay={4} />
        <Rainbow text={BABY} size={170} delay={10} stagger={3} />
        <Script text="satu hari bersamaku" size={110} delay={28} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1360, display: 'flex', justifyContent: 'center', gap: 70, opacity: fadeIn(f, 36, 14) }}>
        {MOMENTS.map((m, i) => <div key={i} style={{ transform: `translateY(${Math.sin((f + i * 8) / 10) * 10}px)` }}><Icon kind={m.icon} size={110} /></div>)}
      </div>
    </AbsoluteFill>
  );
};

const MomentScene: React.FC<{ m: Moment; i: number }> = ({ m, i }) => {
  const f = useCurrentFrame();
  const accent = C[m.accent];
  const card = usePop(4, 15);
  return (
    <AbsoluteFill>
      <Background tint={accent} />
      <Star x={i % 2 ? 90 : 900} y={330} size={50} delay={14} />
      <Heart x={i % 2 ? 930 : 80} y={1640} size={46} delay={18} />
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', paddingTop: 150 }}>
        <TimePill time={m.time} color={accent} delay={2} />
        <div style={{ height: 30 }} />
        <Rainbow text={m.title} size={140} delay={6} />
        <div style={{ height: 50 }} />
        <div style={{ transform: `translateY(${(1 - card) * 120}px) scale(${0.92 + card * 0.08}) rotate(${(i % 2 ? 1 : -1) * (1 - card) * 4}deg)`, opacity: card }}>
          <Footage file={m.file} w={900} h={1080} accent={accent} kind={m.icon} face={m.face} />
        </div>
        <div style={{ marginTop: 40 }}>
          <Script text={m.note} size={92} delay={16} />
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', right: 70, top: 470, transform: `scale(${usePop(12)}) rotate(${Math.sin(f / 20) * 6}deg)` }}>
        <Icon kind={m.icon} size={150} />
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background tint={C.lavender} />
      <Cloud x={90} y={1180} w={300} color={C.sage} face />
      <Cloud x={640} y={1300} w={260} color={C.pink} drift={-18} />
      {[[140, 300], [860, 260], [220, 900], [880, 880], [520, 180]].map(([x, y], i) => <Star key={i} x={x} y={y} size={40 + (i % 3) * 12} delay={4 + i * 4} />)}
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, paddingBottom: 300 }}>
        <div style={{ transform: `scale(${usePop(2)})` }}><Icon kind="moon" size={220} /></div>
        <Rainbow text="Selamat bobo" size={130} delay={8} />
        <Script text={`love, ${BABY}`} size={100} color={C.pink} delay={26} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: C.ink, letterSpacing: 4, opacity: fadeIn(f, 44, 14) * 0.7 }}>♥ SAMPAI JUMPA BESOK ♥</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BabyDay: React.FC = () => {
  const scenes: { from: number; dur: number; el: React.ReactNode }[] = [];
  let t = 0;
  scenes.push({ from: 0, dur: s(INTRO), el: <Intro /> });
  t = s(INTRO);
  MOMENTS.forEach((m, i) => {
    scenes.push({ from: t, dur: s(m.dur), el: <MomentScene m={m} i={i} /> });
    t += s(m.dur);
  });
  scenes.push({ from: t, dur: s(OUTRO), el: <Outro /> });
  const music = getStaticFiles().some((x) => x.name === 'music.mp3');

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {scenes.map((sc, i) => (
        // each scene starts XFADE early so it can wipe in over the previous one
        <Sequence key={i} from={Math.max(0, sc.from - (i ? XFADE : 0))} durationInFrames={sc.dur + (i ? XFADE : 0) + (i < scenes.length - 1 ? XFADE : 0)}>
          <Enter first={i === 0}>{sc.el}</Enter>
        </Sequence>
      ))}
      {music && <Audio src={staticFile('music.mp3')} volume={(f) => interpolate(f, [0, 20, t + s(OUTRO) - 40, t + s(OUTRO)], [0, 0.7, 0.7, 0], { extrapolateRight: 'clamp' })} />}
    </AbsoluteFill>
  );
};
