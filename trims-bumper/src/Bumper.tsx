import React from 'react';
import { AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { BODY, BORDER, C, CUE, FPS, HEAD, TOTAL, shadow } from './theme';

/* ---------------------------------------------------------------- helpers */
const pop = (f: number, start: number, damping = 9, stiffness = 220) =>
  spring({ frame: f - start, fps: FPS, config: { damping, stiffness, mass: 0.7 } });

const lin = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const easeIn = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });

const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; children: React.ReactNode }> = ({
  x, y, s = 1, r = 0, o = 1, children,
}) => (
  <div
    style={{
      position: 'absolute', left: 0, top: 0, opacity: o,
      transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${r}deg) scale(${s})`,
    }}
  >
    {children}
  </div>
);

const CX = 540;
const CY = 900;

/* ------------------------------------------------------------- background */
const Sunburst: React.FC<{ f: number }> = ({ f }) => {
  const rays = 18;
  const grow = pop(f, 0, 14, 160);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      <g transform={`translate(${CX} ${CY}) rotate(${f * 0.9}) scale(${grow})`}>
        {Array.from({ length: rays }, (_, i) => {
          const a0 = (i / rays) * Math.PI * 2;
          const a1 = a0 + Math.PI / rays;
          const r = 1500;
          return (
            <path
              key={i}
              d={`M0 0 L${Math.cos(a0) * r} ${Math.sin(a0) * r} L${Math.cos(a1) * r} ${Math.sin(a1) * r} Z`}
              fill={C.yellow}
            />
          );
        })}
      </g>
    </svg>
  );
};

/** little "?" marks drifting in the background */
const Floaters: React.FC<{ f: number }> = ({ f }) => {
  const items = [
    { x: 150, y: 330, r: -18, c: C.pink, d: 8 },
    { x: 930, y: 380, r: 16, c: C.blue, d: 12 },
    { x: 120, y: 1480, r: 12, c: C.green, d: 16 },
    { x: 960, y: 1530, r: -14, c: C.purple, d: 20 },
    { x: 520, y: 250, r: 6, c: C.orange, d: 24 },
  ];
  return (
    <>
      {items.map((it, i) => {
        const s = pop(f, it.d, 10, 180);
        const bob = Math.sin((f + i * 17) / 9) * 14;
        return (
          <At key={i} x={it.x} y={it.y + bob} s={s} r={it.r + Math.sin((f + i * 11) / 12) * 8}>
            <div
              style={{
                width: 110, height: 110, borderRadius: 999, background: it.c, border: `${BORDER}px solid ${C.ink}`,
                boxShadow: shadow(8), display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: HEAD, fontSize: 70, color: C.ink, lineHeight: 1,
              }}
            >
              ?
            </div>
          </At>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ props */
const Plate: React.FC<{ f: number }> = ({ f }) => {
  const s = pop(f, CUE.plate, 8, 260);
  const squash = 1 + (1 - lin(f, CUE.plate + 4, CUE.plate + 14)) * 0.08 * lin(f, CUE.plate + 2, CUE.plate + 4);
  return (
    <At x={CX} y={CY} s={s} r={(1 - s) * -40}>
      <div style={{ transform: `scale(${squash}, ${2 - squash})` }}>
        <div
          style={{
            width: 900, height: 900, borderRadius: 999, background: C.white, border: `${BORDER + 2}px solid ${C.ink}`,
            boxShadow: shadow(22), display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{ width: 640, height: 640, borderRadius: 999, border: `${BORDER - 2}px dashed ${C.ink}`, background: C.bg }} />
        </div>
      </div>
    </At>
  );
};

const Fork: React.FC = () => (
  <svg width={120} height={520} viewBox="0 0 120 520">
    <g fill={C.white} stroke={C.ink} strokeWidth={8} strokeLinejoin="round">
      <path d="M14 10 v120 q0 50 36 60 v300 q10 22 20 0 v-300 q36 -10 36 -60 v-120 h-18 v110 h-14 v-110 h-14 v110 h-14 v-110 h-14 v110 h-14 v-110 z" />
    </g>
  </svg>
);

const Spoon: React.FC = () => (
  <svg width={130} height={520} viewBox="0 0 130 520">
    <g fill={C.white} stroke={C.ink} strokeWidth={8} strokeLinejoin="round">
      <ellipse cx={65} cy={95} rx={52} ry={85} />
      <path d="M52 175 h26 v305 q-13 30 -26 0 z" />
    </g>
  </svg>
);

/* --------------------------------------------------------------- the logo */
const LETTERS: { ch: string; bg: string; r: number }[] = [
  { ch: 'T', bg: C.pink, r: -8 },
  { ch: 'R', bg: C.blue, r: 5 },
  { ch: 'I', bg: C.green, r: -4 },
  { ch: 'M', bg: C.orange, r: 7 },
  { ch: 'S', bg: C.purple, r: -6 },
];

const Letter: React.FC<{ f: number; i: number }> = ({ f, i }) => {
  const { ch, bg, r } = LETTERS[i];
  const start = CUE.letters[i];
  const s = pop(f, start, 7, 280);
  const drop = (1 - pop(f, start, 12, 260)) * -380;
  // after the stamp every letter hops once in a wave, then wiggles on the beat
  const hop = Math.max(0, Math.sin(((f - CUE.stamp - i * 3) / 14) * Math.PI)) * (f > CUE.stamp + i * 3 && f < CUE.stamp + i * 3 + 14 ? 1 : 0);
  const wiggle = f > CUE.stamp ? Math.sin((f - CUE.stamp) / 5 + i) * 3 : 0;
  const w = ch === 'I' ? 130 : ch === 'M' ? 210 : 175;
  return (
    <div
      style={{
        transform: `translateY(${drop - hop * 50}px) rotate(${r * s + wiggle}deg) scale(${s})`,
        width: w, height: 230, background: bg, border: `${BORDER}px solid ${C.ink}`, borderRadius: 24,
        boxShadow: shadow(14), display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: HEAD, fontSize: 190, color: C.ink, lineHeight: 1, margin: '0 6px',
      }}
    >
      <span style={{ transform: 'translateY(8px)' }}>{ch}</span>
    </div>
  );
};

const Question: React.FC<{ f: number }> = ({ f }) => {
  const s = pop(f, CUE.question, 6, 300);
  const spin = (1 - pop(f, CUE.question, 10, 160)) * 360;
  const tilt = 14 + Math.sin(f / 4) * 6 * lin(f, CUE.question + 10, CUE.question + 20);
  return (
    <At x={940} y={CY - 230} s={s} r={tilt + spin}>
      <div
        style={{
          width: 170, height: 170, borderRadius: 999, background: C.red, border: `${BORDER}px solid ${C.ink}`,
          boxShadow: shadow(10), display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: HEAD, fontSize: 130, color: C.white, WebkitTextStroke: `5px ${C.ink}`, lineHeight: 1,
        }}
      >
        <span style={{ transform: 'translateY(6px)' }}>?</span>
      </div>
    </At>
  );
};

const Ribbon: React.FC<{ f: number }> = ({ f }) => {
  const k = pop(f, CUE.ribbon, 12, 240);
  return (
    <At x={CX + (1 - k) * -1100} y={CY + 205} r={-3}>
      <div
        style={{
          background: C.ink, color: C.yellow, fontFamily: HEAD, fontSize: 64, padding: '18px 40px', borderRadius: 16,
          boxShadow: `10px 10px 0 ${C.white}`, border: `${BORDER - 2}px solid ${C.ink}`, whiteSpace: 'nowrap',
          letterSpacing: 1,
        }}
      >
        TRIVIA MAKAN SIANG
      </div>
    </At>
  );
};

const Handle: React.FC<{ f: number }> = ({ f }) => {
  // stamp: comes in big and slams down
  const k = spring({ frame: f - CUE.stamp, fps: FPS, config: { damping: 11, stiffness: 320, mass: 0.6 } });
  const s = interpolate(k, [0, 1], [2.6, 1]);
  const o = lin(f, CUE.stamp, CUE.stamp + 2);
  return (
    <At x={CX} y={CY + 470} s={s} r={4 - k * 7} o={o}>
      <div
        style={{
          background: C.yellow, border: `${BORDER}px solid ${C.ink}`, borderRadius: 999, boxShadow: shadow(12),
          padding: '22px 52px', fontFamily: BODY, fontWeight: 700, fontSize: 84, color: C.ink, whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 18,
        }}
      >
        <span
          style={{
            width: 74, height: 74, borderRadius: 999, background: C.ink, color: C.yellow, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 50,
          }}
        >
          @
        </span>
        faqihpedia
      </div>
    </At>
  );
};

/** stamp shockwave ring */
const Ring: React.FC<{ f: number }> = ({ f }) => {
  const t = lin(f, CUE.stamp, CUE.stamp + 18);
  if (t <= 0 || t >= 1) return null;
  return (
    <At x={CX} y={CY + 470} s={0.6 + t * 2.2} o={1 - t}>
      <div style={{ width: 520, height: 160, borderRadius: 999, border: `${BORDER}px solid ${C.ink}` }} />
    </At>
  );
};

/* --------------------------------------------------------------- confetti */
const PIECES = Array.from({ length: 46 }, (_, i) => {
  const rnd = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const ang = -Math.PI / 2 + (rnd(1) - 0.5) * Math.PI * 1.7;
  return {
    vx: Math.cos(ang) * (700 + rnd(2) * 900),
    vy: Math.sin(ang) * (900 + rnd(3) * 900),
    spin: (rnd(4) - 0.5) * 1400,
    c: [C.pink, C.blue, C.green, C.orange, C.purple, C.red, C.yellow][i % 7],
    w: 22 + rnd(5) * 22,
    round: rnd(6) > 0.6,
  };
});

const Confetti: React.FC<{ f: number }> = ({ f }) => {
  const t = (f - CUE.stamp) / FPS;
  if (t <= 0) return null;
  return (
    <>
      {PIECES.map((p, i) => {
        const x = CX + p.vx * t;
        const y = CY + 470 + p.vy * t + 2600 * t * t;
        return (
          <At key={i} x={x} y={y} r={p.spin * t}>
            <div
              style={{
                width: p.w, height: p.round ? p.w : p.w * 0.5, background: p.c, border: `4px solid ${C.ink}`,
                borderRadius: p.round ? 999 : 4,
              }}
            />
          </At>
        );
      })}
    </>
  );
};

/* ----------------------------------------------------------------- scene */
export const TrimsBumper: React.FC = () => {
  const f = useCurrentFrame();

  // circle wipe in from a pink frame, iris out to ink at the end
  const wipeIn = easeIn(f, 0, 8) * 1400;
  const irisOut = 1 - easeIn(f, CUE.out, TOTAL - 2);
  // whole group punches on the stamp
  const punch = 1 + 0.06 * Math.sin(lin(f, CUE.stamp, CUE.stamp + 10) * Math.PI);

  const cutK = pop(f, CUE.cutlery, 10, 260);

  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ clipPath: `circle(${irisOut * 1300}px at ${CX}px ${CY}px)` }}>
        <AbsoluteFill style={{ background: C.pink }} />
        <AbsoluteFill style={{ background: C.bg, clipPath: `circle(${wipeIn}px at ${CX}px ${CY}px)` }}>
          <Sunburst f={f} />
          <Floaters f={f} />
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${punch})`, transformOrigin: `${CX}px ${CY}px` }}>
            <At x={70 - (1 - cutK) * 400} y={CY + 60} r={-24 + (1 - cutK) * -60}>
              <Fork />
            </At>
            <At x={1010 + (1 - cutK) * 400} y={CY + 60} r={24 + (1 - cutK) * 60}>
              <Spoon />
            </At>
            <Plate f={f} />
            <At x={CX} y={CY - 30}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {LETTERS.map((_, i) => (
                  <Letter key={i} f={f} i={i} />
                ))}
              </div>
            </At>
            <Question f={f} />
            <Ribbon f={f} />
            <Ring f={f} />
            <Handle f={f} />
          </div>
          <Confetti f={f} />
        </AbsoluteFill>
      </AbsoluteFill>
      <Audio src={staticFile('jingle.wav')} />
    </AbsoluteFill>
  );
};
