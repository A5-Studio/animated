import React from 'react';
import { AbsoluteFill, Audio, Easing, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Background, Heart, Icon, Rainbow, Ribbon, Script, Star, usePop } from './components';
import { BathCard, ClockFace, Frame, Media, Subtitle, hhmm, toMin } from './media';
import {
  C, CHAPTERS, COLLAGE, Chapter, NAME, OPENING, OUTRO, SANS, Shot, TOTAL, VO_DELAY, XFADE, chapterDur, s, shotDur,
} from './theme';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const has = (p: string) => getStaticFiles().some((f) => f.name === p);

/** wipes a chapter in as a soft circle growing from the bottom */
const Enter: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const f = useCurrentFrame();
  const r = first ? 150 : interpolate(f, [0, XFADE + 6], [0, 150], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return <AbsoluteFill style={{ clipPath: `circle(${r}% at 50% 100%)` }}>{children}</AbsoluteFill>;
};

const Voice: React.FC<{ id: string }> = ({ id }) =>
  has(`vo/${id}.wav`) ? <Sequence from={s(VO_DELAY)} layout="none"><Audio src={staticFile(`vo/${id}.wav`)} /></Sequence> : null;

const SubtitleAt: React.FC<{ sh: Shot; top?: number }> = ({ sh, top = 1590 }) => (
  <div style={{ position: 'absolute', left: 40, right: 40, top, display: 'flex', justifyContent: 'center' }}>
    <Subtitle text={sh.vo} delay={s(VO_DELAY)} len={s(shotDur(sh) - VO_DELAY)} />
  </div>
);

/* ------------------------------ opening ----------------------------- */
// scrapbook collage of the day + clock fast-forwarding 06.00 -> 18.00, then the hello
const TILES = [
  { x: 40, y: 120, w: 300, h: 380, r: -6 }, { x: 390, y: 70, w: 300, h: 360, r: 4 }, { x: 740, y: 130, w: 300, h: 380, r: -3 },
  { x: 20, y: 560, w: 300, h: 380, r: 5 }, { x: 760, y: 580, w: 300, h: 380, r: -5 },
  { x: 40, y: 1010, w: 300, h: 380, r: -4 }, { x: 760, y: 1030, w: 300, h: 380, r: 6 },
  { x: 60, y: 1440, w: 300, h: 360, r: 3 }, { x: 400, y: 1480, w: 300, h: 360, r: -4 }, { x: 740, y: 1460, w: 300, h: 360, r: 5 },
];

const Polaroid: React.FC<{ src: string; w: number; h: number }> = ({ src, w, h }) => (
  <div style={{ width: w, height: h, background: C.paper, padding: '14px 14px 46px', borderRadius: 18, boxShadow: '0 14px 30px rgba(110,100,120,0.22)' }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden' }}>
      <Media src={src} w={w - 28} h={h - 60} zoom={false} />
    </div>
  </div>
);

const Opening: React.FC = () => {
  const f = useCurrentFrame();
  const hello = s(4.6); // collage steps back, hello comes forward
  const back = interpolate(f, [hello - 10, hello + 12], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const mins = interpolate(f, [s(0.8), s(4.2)], [6 * 60, 18 * 60], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const clockPop = usePop(8);
  const sunMoon = mins < 17 * 60 ? 'sun' : 'moon';
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ opacity: 1 - back * 0.72, filter: `blur(${back * 6}px)`, transform: `scale(${1 + back * 0.06})` }}>
        {TILES.map((t, i) => {
          const p = interpolate(f, [i * 4, i * 4 + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
          const sway = Math.sin((f + i * 11) / 28) * 1.5;
          return (
            <div key={i} style={{ position: 'absolute', left: t.x, top: t.y, transform: `rotate(${t.r + sway}deg) scale(${p})`, opacity: Math.min(1, p * 2) }}>
              <Polaroid src={COLLAGE[i % COLLAGE.length]} w={t.w} h={t.h} />
            </div>
          );
        })}
      </AbsoluteFill>
      {/* fast-forward clock */}
      <div style={{
        position: 'absolute', left: 540, top: interpolate(back, [0, 1], [880, 330]),
        transform: `translate(-50%, -50%) scale(${clockPop * interpolate(back, [0, 1], [1, 0.62])})`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
      }}>
        <div style={{ position: 'relative' }}>
          <ClockFace minutes={mins} size={400} />
          <div style={{ position: 'absolute', right: -40, top: -30 }}><Icon kind={sunMoon} size={120} /></div>
        </div>
        <div style={{ padding: '12px 36px', borderRadius: 999, background: C.paper, boxShadow: '0 8px 24px rgba(110,100,120,0.15)', fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink, letterSpacing: 2 }}>
          {hhmm(mins)} <span style={{ fontSize: 40, color: C.pink }}>{f < s(4.2) ? '▶▶' : ''}</span>
        </div>
      </div>
      {f >= hello - 6 && (
        <Sequence from={hello - 6} layout="none">
          <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34, paddingTop: 260 }}>
            <Ribbon text="CERITA SEHARI-HARIKU" delay={0} />
            <Rainbow text={`Halo, aku ${NAME}!`} size={118} delay={4} stagger={2} />
            <Script text="dari bangun sampai bobok" size={96} delay={18} />
          </AbsoluteFill>
          <Heart x={120} y={760} size={56} delay={14} />
          <Star x={900} y={720} size={60} delay={18} />
        </Sequence>
      )}
      <SubtitleAt sh={OPENING} top={1660} />
      <Voice id={OPENING.id} />
    </AbsoluteFill>
  );
};

/* ------------------------------ chapters ---------------------------- */
const FW = 900, FH = 1060;

const ShotView: React.FC<{ sh: Shot; accent: string; i: number }> = ({ sh, accent, i }) => {
  const f = useCurrentFrame();
  const p = i === 0 ? interpolate(f, [2, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) })
    : interpolate(f, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const dir = i % 2 ? -1 : 1;
  const tx = i === 0 ? 0 : (1 - p) * 1000 * dir;
  const ty = i === 0 ? (1 - p) * 140 : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 90, top: 470, transform: `translate(${tx}px, ${ty}px) rotate(${(1 - p) * 5 * dir}deg)`, opacity: i === 0 ? p : 1 }}>
        <Frame w={FW} h={FH} accent={accent}>
          {sh.card === 'bath' ? <BathCard /> : <Media src={sh.src!} w={FW - 36} h={FH - 36} fx={sh.fx} fy={sh.fy} />}
        </Frame>
      </div>
      <SubtitleAt sh={sh} />
      <Voice id={sh.id} />
    </AbsoluteFill>
  );
};

const Night: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [start, start + s(1.6)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: C.night, opacity: o * 0.62, mixBlendMode: 'multiply' }} />
      <div style={{ opacity: o }}>
        {[[120, 380], [930, 330], [180, 1500], [900, 1480], [520, 420]].map(([x, y], i) => <Star key={i} x={x} y={y} size={38 + (i % 3) * 10} delay={start + 6 + i * 4} />)}
      </div>
    </AbsoluteFill>
  );
};

const ChapterScene: React.FC<{ c: Chapter; prev?: Chapter }> = ({ c, prev }) => {
  const f = useCurrentFrame();
  const accent = C[c.accent];
  const from = prev ? toMin(prev.time) : toMin(c.time);
  const mins = interpolate(f, [4, 24], [from, toMin(c.time)], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pill = usePop(2);
  let t = 0;
  const nightAt = c.shots.findIndex((sh) => sh.night);
  return (
    <AbsoluteFill>
      <Background tint={accent} />
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'center', paddingTop: 120 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 34px 12px 14px', borderRadius: 999, background: C.paper, boxShadow: '0 8px 24px rgba(110,100,120,0.12)', transform: `scale(${pill})`, fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.ink }}>
          <ClockFace minutes={mins} size={68} />
          {hhmm(mins)}
        </div>
        <div style={{ height: 22 }} />
        <Rainbow text={c.title} size={128} delay={6} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', right: 40, top: 330, transform: `scale(${usePop(14)})` }}><Icon kind={c.icon} size={130} /></div>
      {c.shots.map((sh, i) => {
        const start = s(t);
        t += shotDur(sh);
        const next = c.shots[i + 1];
        return (
          <Sequence key={sh.id} from={start} durationInFrames={s(shotDur(sh)) + (next ? 14 : XFADE)}>
            <ShotView sh={sh} accent={accent} i={i} />
          </Sequence>
        );
      })}
      {nightAt >= 0 && <Night start={s(c.shots.slice(0, nightAt).reduce((a, sh) => a + shotDur(sh), 0) + 0.8)} />}
    </AbsoluteFill>
  );
};

/* ------------------------------- outro ------------------------------ */
const Outro: React.FC = () => {
  const p = usePop(4, 14);
  return (
    <AbsoluteFill>
      <Background tint={C.lavender} />
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 110 }}>
        <Rainbow text="Dadah semua!" size={130} delay={2} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 150, top: 330, transform: `rotate(${-3 + (1 - p) * -6}deg) scale(${0.85 + p * 0.15})`, opacity: p }}>
        <Frame w={780} h={1000} accent={C.pink}>
          <Media src={OUTRO.src!} w={744} h={964} fy={OUTRO.fy} />
        </Frame>
      </div>
      <Heart x={90} y={420} size={70} delay={14} />
      <Heart x={930} y={1240} size={60} color={C.lavender} delay={20} />
      <Star x={920} y={360} size={60} delay={18} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1360, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Script text={`love, ${NAME}`} size={110} color={C.pink} delay={20} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: C.ink, opacity: 0.7, marginTop: 6 }}>♥ UMMA & BABA ♥</div>
      </div>
      <SubtitleAt sh={OUTRO} top={1640} />
      <Voice id={OUTRO.id} />
    </AbsoluteFill>
  );
};

export const BabyDay: React.FC = () => {
  const parts: { from: number; dur: number; el: React.ReactNode }[] = [];
  let t = 0;
  parts.push({ from: 0, dur: shotDur(OPENING), el: <Opening /> });
  t += shotDur(OPENING);
  CHAPTERS.forEach((c, i) => {
    parts.push({ from: t, dur: chapterDur(c), el: <ChapterScene c={c} prev={CHAPTERS[i - 1]} /> });
    t += chapterDur(c);
  });
  parts.push({ from: t, dur: shotDur(OUTRO), el: <Outro /> });
  const music = has('music.wav');
  const voiced = getStaticFiles().some((f) => f.name.startsWith('vo/') && f.name.endsWith('.wav') && !f.name.includes('_ref'));
  const vol = voiced ? 0.22 : 0.5; // music sits under Migu's voice once it exists
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {parts.map((p, i) => (
        <Sequence key={i} from={Math.max(0, s(p.from) - (i ? XFADE : 0))} durationInFrames={s(p.dur) + (i ? XFADE : 0) + (i < parts.length - 1 ? XFADE : 0)}>
          <Enter first={i === 0}>{p.el}</Enter>
        </Sequence>
      ))}
      {music && <Audio src={staticFile('music.wav')} volume={(fr) => interpolate(fr, [0, 20, TOTAL - 45, TOTAL], [0, vol, vol, 0], clamp)} />}
    </AbsoluteFill>
  );
};
