import React from 'react';
import { AbsoluteFill, Easing, Html5Audio, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CAPS } from './caps';
import { At, Background, Box, Burst, Gingham, Rich, Sticker, lin, pop } from './components';
import { PediaWord, SCENES } from './scenes';
import { Sfx } from './sfx';
import { BODY, BORDER, BUMPER_AT, C, CUTS, END_CARD, HEAD, LAYOUT, MORPH, Mode, SAFE, SAFE_CX, TOTAL, s, shadow } from './theme';

/* ------------------------------------------------------------------ */
/* layout engine: one video element that morphs between three layouts */
/* ------------------------------------------------------------------ */
const SRC_W = 1080; // source video is 1080x1920
const SRC_H = 1920;
const FACE = { x: 540, y: 720 }; // roughly where the face sits in the source

type G = {
  vx: number; vy: number; vw: number; vh: number; vr: number; vb: number; // video box
  sy: number; // first source row shown in the video box
  scx: number; scy: number; ss: number; // illustration stage center + scale
  full: number; split: number; anim: number; // mode weights, for overlays
};

const GEOM: Record<Mode, G> = {
  // stages are 1000x880 and scaled so they sit inside SAFE (x 60-940, y 285-1500)
  full: { vx: 0, vy: 0, vw: 1080, vh: 1920, vr: 0, vb: 0, sy: 0, scx: SAFE_CX, scy: -640, ss: 0.72, full: 1, split: 0, anim: 0 },
  // split: a zoomed-out 560px card so the whole head fits with headroom and the caption keeps ~120px below the chin
  split: { vx: SAFE_CX - 280, vy: 960, vw: 560, vh: 920, vr: 28, vb: BORDER, sy: 513, scx: SAFE_CX, scy: 300 + 317, ss: 0.72, full: 0, split: 1, anim: 0 },
  anim: { vx: SAFE_CX - 280, vy: 2080, vw: 560, vh: 920, vr: 28, vb: BORDER, sy: 513, scx: SAFE_CX, scy: 385 + 387, ss: 0.88, full: 0, split: 0, anim: 1 },
};

const morphT = (f: number, start: number) =>
  interpolate(f, [start, start + MORPH], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

const geomAt = (f: number): G => {
  let i = 0;
  while (i + 1 < LAYOUT.length && f >= s(LAYOUT[i + 1][0])) i++;
  const cur = GEOM[LAYOUT[i][1]];
  if (i === 0) return cur;
  const prev = GEOM[LAYOUT[i - 1][1]];
  // the change that lines up with the bumper is instant: the bumper hides it, so nothing leaks before it
  const t = LAYOUT[i][0] === BUMPER_AT ? 1 : morphT(f, s(LAYOUT[i][0]));
  const out = {} as G;
  (Object.keys(cur) as (keyof G)[]).forEach((k) => (out[k] = prev[k] + (cur[k] - prev[k]) * t));
  return out;
};

/** every jump cut alternates between a wide and a punched-in framing, with a slow push-in on top */
const zoomAt = (f: number) => {
  const sec = f / 30;
  let idx = 0;
  while (idx < CUTS.length && sec >= CUTS[idx]) idx++;
  const from = idx === 0 ? 0 : CUTS[idx - 1];
  const to = idx < CUTS.length ? CUTS[idx] : TOTAL / 30;
  const drift = (sec - from) / Math.max(1, to - from);
  return (idx % 2 ? 1.08 : 1.0) + 0.025 * drift;
};

const Talking: React.FC<{ g: G; f: number }> = ({ g, f }) => {
  const inner = g.vw - 2 * g.vb;
  const k = inner / SRC_W;
  // no punch-in while the head is in the small split card, so it never gets cropped
  const z = 1 + (zoomAt(f) - 1) * (1 - g.split);
  return (
    <div
      style={{
        position: 'absolute', left: g.vx, top: g.vy, width: g.vw, height: g.vh, overflow: 'hidden',
        border: `${g.vb}px solid ${C.ink}`, borderRadius: g.vr, boxSizing: 'border-box',
        boxShadow: g.vb > 0.5 ? shadow(2 * g.vb) : 'none', background: C.ink,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${FACE.x * k}px ${(FACE.y - g.sy) * k}px` }}>
        <OffthreadVideo
          src={staticFile('source.mp4')}
          style={{ position: 'absolute', left: 0, top: -g.sy * k, width: SRC_W * k, height: SRC_H * k }}
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* illustration stage                                                  */
/* ------------------------------------------------------------------ */
const Stage: React.FC<{ g: G; f: number }> = ({ g, f }) => {
  const live = SCENES.filter((sc) => f >= s(sc.from) - 1 && f < s(sc.to) + MORPH);
  if (!live.length || g.full > 0.999) return null;
  const sc = live[live.length - 1];
  const inS = pop(f, s(sc.from), 200);
  return (
    <div
      style={{
        position: 'absolute', left: 0, top: 0, width: 1000, height: 880,
        transform: `translate(${g.scx}px, ${g.scy}px) translate(-50%, -50%) scale(${g.ss})`,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 28, boxSizing: 'border-box',
          border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(14), background: sc.bg,
          backgroundImage: `linear-gradient(${C.ink}12 3px, transparent 3px), linear-gradient(90deg, ${C.ink}12 3px, transparent 3px)`,
          backgroundSize: '80px 80px',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${0.9 + 0.1 * inS})`, opacity: Math.min(1, inS * 2) }}>
          <sc.C f={f} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* transition: an ink-edged colour band sweeps across on layout change */
/* ------------------------------------------------------------------ */
const SWIPE_COLORS = [C.orange, C.yellow];
const Swipe: React.FC<{ f: number }> = ({ f }) => (
  <>
    {LAYOUT.slice(1).map(([t], i) => {
      if (t === BUMPER_AT) return null; // the bumper is the transition there
      const a = s(t) - 3;
      if (f < a || f > a + 14) return null;
      const p = interpolate(f, [a, a + 14], [0, 1], { easing: Easing.inOut(Easing.quad) });
      return (
        <div
          key={i}
          style={{
            position: 'absolute', left: -800 + 2200 * p, top: -400, width: 520, height: 2800,
            transform: 'rotate(18deg)', background: SWIPE_COLORS[i % SWIPE_COLORS.length],
            borderLeft: `${BORDER * 2}px solid ${C.ink}`, borderRight: `${BORDER * 2}px solid ${C.ink}`, opacity: 0.95,
          }}
        />
      );
    })}
  </>
);

/* ------------------------------------------------------------------ */
/* captions, whole video                                               */
/* ------------------------------------------------------------------ */
const Captions: React.FC<{ f: number; g: G }> = ({ f, g }) => {
  // same spot in every layout: just above SAFE.bottom (on the chest in split, below the chin)
  const y = SAFE.bottom - 78; // a two-line box (~150px) still ends above SAFE.bottom
  const w = SAFE.right - SAFE.left - 40;
  const fs = 44;
  return (
    <>
      {CAPS.map(([a, b, text], i) => {
        const from = s(a);
        const to = s(b);
        if (f < from - 1 || f > to + 1) return null;
        const p = pop(f, from, 260);
        const out = lin(f, to - 3, to);
        return (
          <At key={i} x={SAFE_CX} y={y} s={(0.88 + 0.12 * p) * (1 - 0.06 * out)} o={Math.min(1, p * 1.6) * (1 - out)} r={i % 2 ? 1 : -1}>
            <Box pad="20px 30px" style={{ width: w, fontSize: fs, lineHeight: 1.3, fontWeight: 600, textAlign: 'center' }}>
              <Rich text={text} />
            </Box>
          </At>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* stickers over the full-frame talking head (kept above the face)     */
/* ------------------------------------------------------------------ */
const Heart: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M20 35 L6 21 a8 8 0 0 1 14 -10 a8 8 0 0 1 14 10 z" fill={C.red} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
  </svg>
);

const FullStickers: React.FC<{ f: number; o: number }> = ({ f, o }) => {
  if (o < 0.01) return null;
  const P = (sec: number, k = 220) => pop(f, s(sec), k);
  const gone = (a: number, b: number) => f >= s(a) && f <= s(b);
  const out = (b: number) => 1 - lin(f, s(b) - 6, s(b));
  // "pedia" lands at 4.7s: every name gets a little bump
  const bump = 1 + 0.08 * Math.sin(Math.PI * lin(f, s(4.7), s(4.7) + 8));
  const hook = [
    { at: 1.4, src: 'tokopedia.png', w: 270, x: 780, y: 615, r: 3 },
    { at: 2.1, src: 'wikipedia.png', w: 130, x: 780, y: 790, r: -3 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o }}>
      {/* TRIMS fixed opening line */}
      {gone(0, 5.6) && (
        <At x={SAFE_CX} y={385} s={P(0.1, 200) * out(5.6)} r={-1}>
          <Box bg={C.white} pad="10px 24px" radius={14} sh={7} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36, whiteSpace: 'nowrap' }}>
            Bahan obrolan makan siang hari ini…
          </Box>
        </At>
      )}
      {/* hook: three -pedia names, then the question */}
      {gone(0, 6.3) && (
        <At x={780} y={500} s={P(0.3) * out(6.3) * bump} r={-4}>
          <PediaWord head="ENSIKLO" lit={lin(f, s(4.7), s(4.7) + 6)} size={36} />
        </At>
      )}
      {/* the real Tokopedia and Wikipedia logos, on white cards */}
      {gone(0, 6.3) &&
        hook.map((h) => (
          <At key={h.src} x={h.x} y={h.y} s={P(h.at) * out(6.3) * bump} r={h.r}>
            <Box bg={C.white} pad="14px 18px" radius={18} sh={9}>
              <Img src={staticFile(h.src)} style={{ width: h.w, display: 'block' }} />
            </Box>
          </At>
        ))}
      {gone(5.8, 9.45) && (
        <At x={SAFE_CX} y={470} s={P(5.9, 180) * out(9.45)} r={-3}>
          <Box bg={C.yellow} pad="14px 34px" style={{ fontFamily: HEAD, fontSize: 70, whiteSpace: 'nowrap' }}>
            “PEDIA” = <span style={{ background: C.white, border: `5px solid ${C.ink}`, borderRadius: 12, padding: '0 16px' }}>?</span>
          </Box>
        </At>
      )}
      {/* dig deeper */}
      {gone(33.3, 35.8) && (
        <At x={SAFE_CX} y={460} s={P(33.4) * out(35.8)} r={2}>
          <Sticker bg={C.purple} size={54}>Bedah lebih dalam</Sticker>
        </At>
      )}
      {/* the account name */}
      {gone(86.3, 93.2) && (
        <>
          <At x={SAFE_CX} y={440} s={P(88.5, 180) * out(93.2)} r={-3}>
            <Box bg={C.yellow} pad="10px 30px" style={{ fontFamily: HEAD, fontSize: 64, whiteSpace: 'nowrap' }}>
              FAQIH<span style={{ background: C.white, boxShadow: `inset 0 0 0 5px ${C.ink}`, borderRadius: 10, padding: '0 4px' }}>PEDIA</span>
            </Box>
          </At>
          <At x={SAFE_CX} y={570} s={P(90.2) * out(93.2)} r={2}>
            <Sticker bg={C.green} size={40}>Dokumentasi yang aku tahu</Sticker>
          </At>
        </>
      )}
      {/* outro */}
      {gone(106.3, 111.3) && (
        <At x={SAFE_CX} y={460} s={P(108.9) * out(111.3)} r={-2}>
          <Box bg={C.white} pad="12px 30px" style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: HEAD, fontSize: 50, whiteSpace: 'nowrap' }}>
            <span style={{ transform: `scale(${1 + 0.15 * Math.max(0, Math.sin((f - s(109.0)) * 0.35))})`, display: 'flex' }}><Heart /></span>
            LIKE DULU YA
          </Box>
        </At>
      )}
      {f >= s(111.3) && (
        <At x={SAFE_CX} y={520} s={P(111.35, 200)} r={-6}>
          <Burst size={460} color={C.yellow} rot={f * 0.8}>
            <span style={{ fontSize: 66 }}>TRIMS!</span>
          </Burst>
        </At>
      )}
    </div>
  );
};

/** TRIMS logo: a plate with a question mark, between a fork and a spoon */
export const TrimsLogo: React.FC<{ size?: number }> = ({ size = 70 }) => (
  <svg width={size} height={size * 150 / 220} viewBox="0 0 220 150">
    <rect x="14" y="20" width="12" height="110" rx="5" fill={C.white} stroke={C.ink} strokeWidth="5" />
    <rect x="8" y="14" width="24" height="40" rx="4" fill={C.white} stroke={C.ink} strokeWidth="5" />
    <line x1="16" y1="14" x2="16" y2="40" stroke={C.ink} strokeWidth="4" />
    <line x1="24" y1="14" x2="24" y2="40" stroke={C.ink} strokeWidth="4" />
    <circle cx="110" cy="75" r="62" fill={C.white} stroke={C.ink} strokeWidth="6" />
    <circle cx="110" cy="75" r="44" fill={C.yellow} stroke={C.ink} strokeWidth="5" />
    <text x="110" y="98" textAnchor="middle" fontFamily={HEAD} fontSize="64" fill={C.ink}>?</text>
    <rect x="194" y="58" width="12" height="78" rx="5" fill={C.white} stroke={C.ink} strokeWidth="5" />
    <ellipse cx="200" cy="38" rx="15" ry="24" fill={C.white} stroke={C.ink} strokeWidth="5" />
  </svg>
);

/** segment label, top-left (segment kit rule); hidden while the split layout needs the top edge */
const SegmentBadge: React.FC<{ f: number; o: number }> = ({ f, o }) => (
  <div style={{ position: 'absolute', left: SAFE.left, top: SAFE.top + 8, opacity: o, transform: `scale(${pop(f, 4)}) rotate(-2deg)`, transformOrigin: 'left center' }}>
    <Box bg={C.orange} pad="6px 18px 6px 12px" radius={12} sh={6} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: HEAD, fontSize: 30, whiteSpace: 'nowrap' }}>
      <TrimsLogo size={58} />
      TRIMS
    </Box>
  </div>
);

/* ------------------------------------------------------------------ */
/* TRIMS end card with the fixed closing line                          */
/* ------------------------------------------------------------------ */
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const a = s(END_CARD);
  if (f < a) return null;
  const inP = interpolate(f, [a, a + 12], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const P = (d: number, k = 200) => pop(f, a + d, k);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${inP * 130}% at 50% 40%)`, background: `${Gingham(96)}, ${C.bg}` }}>
      <At x={SAFE_CX} y={590} s={P(4)} r={-3}>
        <div style={{ background: C.white, border: `${BORDER}px solid ${C.ink}`, borderRadius: '50%', boxShadow: shadow(14), padding: 40 }}>
          <TrimsLogo size={420} />
        </div>
      </At>
      <At x={SAFE_CX} y={960} s={P(8)} r={2}>
        <Sticker bg={C.orange} size={110}>TRIMS</Sticker>
      </At>
      <At x={SAFE_CX} y={1170} s={P(14)} r={-1.5}>
        <Box bg={C.white} pad="26px 40px" style={{ width: 840, textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 44, lineHeight: 1.3 }}>
          Trims udah makan siang bareng.<br />
          <span style={{ background: C.yellow, border: `4px solid ${C.ink}`, borderRadius: 10, padding: '0 10px' }}>Besok lauk baru.</span>
        </Box>
      </At>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: C.ink, color: C.white,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px',
        fontFamily: BODY, fontWeight: 700, fontSize: 34, letterSpacing: 3, transform: `translateY(${(1 - P(10, 160)) * 150}px)`,
      }}>
        <span>TRIVIA MAKAN SIANG</span>
        <span>@faqihpedia</span>
      </div>
    </AbsoluteFill>
  );
};

/** quiet music bed: fades in, dips a little under the busier anim parts, fades out */
const Music: React.FC = () => (
  <Html5Audio
    src={staticFile('music.wav')}
    volume={(f) => 0.11 * lin(f, 0, 20) * (1 - lin(f, TOTAL - 45, TOTAL))}
  />
);

export const FaqihpediaArtipedia: React.FC = () => {
  const f = useCurrentFrame();
  const g = geomAt(f);
  const fadeOut = 1 - lin(f, TOTAL - 8, TOTAL);
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut, overflow: 'hidden' }}>
      <Background />
      {f < s(END_CARD) + 13 && <Talking g={g} f={f} />}
      <Stage g={g} f={f} />
      <Captions f={f} g={g} />
      <FullStickers f={f} o={g.full} />
      <SegmentBadge f={f} o={(1 - g.split) * (1 - lin(f, s(111.2), s(111.2) + 6))} />
      <Swipe f={f} />
      <EndCard f={f} />
      <Music />
      <Sfx />
    </AbsoluteFill>
  );
};
