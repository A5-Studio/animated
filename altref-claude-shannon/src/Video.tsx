import React from 'react';
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { KARAOKE } from './karaoke';
import { SCENES } from './scenes';
import { Sfx } from './sfx';
import { C, CAP_Y, HEAD, LAYOUT, MORPH, Mode, SANS, TOTAL, s, shadow } from './theme';
import { lin } from './ui';

/* ------------------------------------------------------------------ */
/* layout: the talking-head card slides away for anim beats             */
/* ------------------------------------------------------------------ */
const splitAt = (f: number) => {
  let i = 0;
  while (i + 1 < LAYOUT.length && f >= s(LAYOUT[i + 1][0])) i++;
  const val = (m: Mode) => (m === 'split' ? 1 : 0);
  if (i === 0) return val(LAYOUT[0][1]);
  const t = interpolate(f, [s(LAYOUT[i][0]), s(LAYOUT[i][0]) + MORPH], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  return val(LAYOUT[i - 1][1]) + (val(LAYOUT[i][1]) - val(LAYOUT[i - 1][1])) * t;
};

const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.bg,
      backgroundImage: `linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`,
      backgroundSize: '54px 54px',
      backgroundPosition: '-1px -1px',
    }}
  />
);

/** the talking-head card, plus the cut-out person on top so the head pops out over the card's top edge */
const Talking: React.FC<{ sp: number }> = ({ sp }) => {
  if (sp < 0.001) return null;
  const dy = (1 - sp) * 1400; // slides down off screen
  const { k, x, y, w, h, sy } = HEAD;
  const imgTop = -sy * k; // video top relative to the card
  const popTop = y + imgTop; // the same, on the page
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateY(${dy}px)` }}>
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 34, overflow: 'hidden', background: '#000', boxShadow: shadow }}>
        <OffthreadVideo src={staticFile('source.mp4')} style={{ position: 'absolute', left: 0, top: imgTop, width: 1080 * k, height: 1920 * k }} />
      </div>
      {/* person.webm = the same frames with an alpha matte (scripts/matte.py); only the part above the card shows */}
      <div style={{ position: 'absolute', left: x, top: popTop, width: 1080 * k, height: y - popTop + 2, overflow: 'hidden' }}>
        <OffthreadVideo src={staticFile('person.webm')} transparent muted style={{ position: 'absolute', left: 0, top: 0, width: 1080 * k, height: 1920 * k }} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* scenes                                                              */
/* ------------------------------------------------------------------ */
const FADE = 8;
const Stage: React.FC<{ f: number }> = ({ f }) => (
  <>
    {SCENES.map((sc, i) => {
      const a = s(sc.from);
      const b = s(sc.to);
      if (f < a - 1 || f >= b + FADE) return null;
      const o = (i === 0 ? 1 : lin(f, a, a + FADE)) * (1 - lin(f, b, b + FADE));
      return (
        <AbsoluteFill key={i} style={{ opacity: o }}>
          <sc.C f={f} />
        </AbsoluteFill>
      );
    })}
  </>
);

/* ------------------------------------------------------------------ */
/* karaoke captions: 2-3 words, a box on the word being said           */
/* ------------------------------------------------------------------ */
const Karaoke: React.FC<{ f: number; sp: number }> = ({ f, sp }) => {
  const t = f / 30;
  let gi = -1;
  for (let i = 0; i < KARAOKE.length; i++) {
    const g = KARAOKE[i];
    const start = g[0][1];
    const next = i + 1 < KARAOKE.length ? KARAOKE[i + 1][0][1] : g[g.length - 1][2] + 0.6;
    const end = Math.min(next, g[g.length - 1][2] + 0.6);
    if (t >= start - 0.05 && t < end) gi = i;
  }
  if (gi < 0) return null;
  const g = KARAOKE[gi];
  const onVideo = sp > 0.5; // over the face card: white words, white box; over the grid: ink words, ink box
  const enter = lin(f, s(g[0][1]) - 2, s(g[0][1]) + 3);
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: CAP_Y, transform: `translateY(-50%) scale(${0.94 + 0.06 * enter})`, opacity: enter, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
      {g.map(([w, a, b], i) => {
        const active = t >= a - 0.03 && (t < b + 0.05 || (i === g.length - 1 && t >= b));
        const boxBg = onVideo ? '#FFFFFF' : C.ink;
        const boxFg = onVideo ? C.ink : '#FFFFFF';
        const fg = onVideo ? '#FFFFFF' : C.ink;
        return (
          <span
            key={i}
            style={{
              fontFamily: SANS, fontWeight: 800, fontSize: 70, letterSpacing: -1.5, lineHeight: 1.15, padding: '0 12px', borderRadius: 12,
              color: active ? boxFg : fg, background: active ? boxBg : 'transparent',
              textShadow: active || !onVideo ? 'none' : '0 2px 10px rgba(0,0,0,0.55)',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const AltRefClaude: React.FC = () => {
  const f = useCurrentFrame();
  const sp = splitAt(f);
  const fadeOut = 1 - lin(f, TOTAL - 10, TOTAL);
  return (
    <AbsoluteFill style={{ opacity: fadeOut, background: C.bg }}>
      <Grid />
      <Stage f={f} />
      <Talking sp={sp} />
      <Karaoke f={f} sp={sp} />
      <Sfx />
    </AbsoluteFill>
  );
};
