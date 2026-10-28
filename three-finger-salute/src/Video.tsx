import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, H, TAU, W, phase, rand, wave } from './theme';

// Sharp periodic bump: peaks `cycles` times per loop, shifted by `offset` (0..1).
const pulse = (frame: number, cycles: number, offset = 0, sharp = 8) =>
  Math.pow(Math.max(0, Math.cos(TAU * (phase(frame, cycles) - offset))), sharp);

const Stripes: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.42 + 0.08 * wave(frame, 10) + 0.05 * wave(frame, 23, 0.3);
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="fireGlow" cx="50%" cy="100%" r="75%">
          <stop offset="0" stopColor={C.flame} stopOpacity={1} />
          <stop offset="0.55" stopColor={C.flameDeep} stopOpacity={0.35} />
          <stop offset="1" stopColor={C.flameDeep} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="topShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.ink} stopOpacity={0.55} />
          <stop offset="0.45" stopColor={C.ink} stopOpacity={0} />
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" />
        </filter>
      </defs>
      <rect x={0} y={0} width={W / 3} height={H} fill={C.green} />
      <rect x={W / 3} y={0} width={W / 3} height={H} fill={C.blue} />
      <rect x={(2 * W) / 3} y={0} width={W / 3} height={H} fill={C.red} />
      <rect width={W} height={H} fill="url(#topShade)" />
      <rect width={W} height={H} fill="url(#fireGlow)" opacity={glow} />
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  );
};

// Fingers, palm and arm drawn twice: a fat black pass for one clean outline around the union, then the fill.
const HandShapes: React.FC<{ fill: string; stroke?: number }> = ({ fill, stroke = 0 }) => {
  const s = stroke ? { stroke: C.ink, strokeWidth: stroke, strokeLinejoin: 'round' as const } : {};
  return (
    <g fill={fill} {...s}>
      {/* ring, middle, index (viewer's left to right; thumb side is on the right) */}
      <rect x={205} y={128} width={84} height={380} rx={42} />
      <rect x={296} y={70} width={88} height={420} rx={44} />
      <rect x={391} y={118} width={82} height={390} rx={41} />
      {/* folded pinky knuckle */}
      <rect x={128} y={455} width={92} height={120} rx={46} />
      {/* palm */}
      <rect x={128} y={430} width={350} height={360} rx={90} />
      {/* wrist and forearm, running off the bottom of the frame */}
      <path d="M170 700 L430 700 L452 1500 L148 1500 Z" />
    </g>
  );
};

const Hand: React.FC = () => {
  const frame = useCurrentFrame();
  const bob = 16 * wave(frame, 2);
  const tilt = 1.6 * wave(frame, 1, 0.25);
  const pump = 1 + 0.02 * pulse(frame, 2, 0.05, 6);
  const scale = 1.18 * pump;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="skin" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1100">
          <stop offset="0" stopColor={C.hand} />
          <stop offset="0.6" stopColor={C.hand} />
          <stop offset="0.82" stopColor="#F6C48E" />
          <stop offset="1" stopColor={C.flame} />
        </linearGradient>
        <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="18" dy="22" stdDeviation="0" floodColor={C.ink} floodOpacity="0.55" />
        </filter>
      </defs>
      <g transform={`translate(${W / 2} ${760 + bob}) rotate(${tilt}) scale(${scale}) translate(-300 0)`}>
        <g filter="url(#handShadow)">
          <HandShapes fill={C.ink} stroke={30} />
        </g>
        <HandShapes fill="url(#skin)" />
        {/* knuckle creases */}
        <g stroke={C.ink} strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.85}>
          <path d="M228 300 Q247 292 266 300" />
          <path d="M320 250 Q340 242 360 250" />
          <path d="M412 290 Q432 282 452 290" />
          <path d="M226 400 Q247 392 268 400" />
          <path d="M318 380 Q340 372 362 380" />
          <path d="M410 395 Q432 387 454 395" />
          <path d="M170 735 Q300 760 430 735" opacity={0.5} />
        </g>
        {/* thumb crossing the palm to hold the pinky down */}
        <path d="M486 690 Q420 600 210 540" stroke={C.ink} strokeWidth={112} strokeLinecap="round" fill="none" />
        <path d="M486 690 Q420 600 210 540" stroke={C.hand} strokeWidth={82} strokeLinecap="round" fill="none" />
        <path d="M226 520 Q206 540 226 562" stroke={C.ink} strokeWidth={8} strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
};

// Three-ish flame layers. Each term uses an integer cycle count so the fire loops exactly.
const FLAME_LAYERS = [
  { color: C.flameDeep, base: 360, amp: 120, seed: 1 },
  { color: C.flame, base: 280, amp: 110, seed: 2 },
  { color: C.flameHot, base: 190, amp: 90, seed: 3 },
  { color: C.flameCore, base: 100, amp: 60, seed: 4 },
];

const flamePath = (frame: number, base: number, amp: number, seed: number) => {
  const pts: string[] = [];
  for (let x = -40; x <= W + 40; x += 18) {
    const u = x / W;
    let h = base;
    h += amp * 0.45 * Math.sin(TAU * (u * 2.2 + phase(frame, 3) + rand(seed)));
    h += amp * 0.35 * Math.sin(TAU * (u * 5.3 - phase(frame, 5) + rand(seed + 10)));
    // tongues: sharp upward spikes that travel and flicker
    const tongue = Math.pow(Math.abs(Math.sin(TAU * (u * 4 + phase(frame, 2) + rand(seed + 20)) / 2)), 6);
    h += amp * 1.4 * tongue * (0.7 + 0.3 * wave(frame, 7, u + rand(seed + 30)));
    pts.push(`${x.toFixed(1)},${(H - h).toFixed(1)}`);
  }
  return `M-40,${H + 10} L${pts.join(' L')} L${W + 40},${H + 10} Z`;
};

const Fire: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <filter id="fireSoft" x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="fireBloom" x="-10%" y="-60%" width="120%" height="220%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
      <path d={flamePath(frame, 380, 140, 1)} fill={C.flame} filter="url(#fireBloom)" opacity={0.7} />
      <g filter="url(#fireSoft)">
        {FLAME_LAYERS.map((l) => (
          <path key={l.seed} d={flamePath(frame, l.base, l.amp, l.seed)} fill={l.color} />
        ))}
      </g>
    </svg>
  );
};

const EMBERS = Array.from({ length: 70 }, (_, i) => ({
  x: rand(i * 3 + 1) * W,
  cycles: 1 + Math.floor(rand(i * 3 + 2) * 3), // 1..3 trips per loop
  offset: rand(i * 3 + 3),
  size: 3 + rand(i * 7) * 7,
  sway: 20 + rand(i * 11) * 50,
  hot: rand(i * 13) > 0.5,
}));

const Embers: React.FC = () => {
  const frame = useCurrentFrame();
  const span = H * 0.95;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <filter id="emberGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#emberGlow)">
        {EMBERS.map((e, i) => {
          const p = (phase(frame, e.cycles) + e.offset) % 1;
          const y = H + 20 - p * span;
          const x = e.x + e.sway * Math.sin(TAU * (p * 2 + e.offset));
          const life = Math.sin(Math.PI * p);
          const flicker = 0.6 + 0.4 * wave(frame, 13 + (i % 5), e.offset);
          return <circle key={i} cx={x} cy={y} r={e.size * (0.4 + 0.6 * life)} fill={e.hot ? C.flameCore : C.flameHot} opacity={life * flicker} />;
        })}
      </g>
    </svg>
  );
};

const LINES: { words: { t: string; burn?: boolean }[]; y: number }[] = [
  { words: [{ t: 'IF WE ' }, { t: 'BURN', burn: true }, { t: ',' }], y: 285 },
  { words: [{ t: 'YOU ' }, { t: 'BURN', burn: true }], y: 497 },
  { words: [{ t: 'WITH US' }], y: 709 },
];

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = phase(frame, 2) % 1;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="burnFill" x1="0" y1="0" x2="0" y2="1" gradientTransform={`translate(0 ${-shift})`} spreadMethod="repeat">
          <stop offset="0" stopColor={C.flameCore} />
          <stop offset="0.35" stopColor={C.flameHot} />
          <stop offset="0.65" stopColor={C.flame} />
          <stop offset="1" stopColor={C.flameCore} />
        </linearGradient>
      </defs>
      {LINES.map((line, i) => {
        const punch = 1 + 0.07 * pulse(frame, 2, i / 8, 10);
        return (
          <g key={i} transform={`translate(${W / 2} ${line.y}) scale(${punch})`}>
            {/* hard offset shadow, then outlined text */}
            <text x={12} y={14} textAnchor="middle" fontFamily="Anton" fontSize={176} fill={C.ink} letterSpacing={2}>
              {line.words.map((w) => w.t).join('')}
            </text>
            <text
              x={0}
              y={0}
              textAnchor="middle"
              fontFamily="Anton"
              fontSize={176}
              letterSpacing={2}
              stroke={C.ink}
              strokeWidth={22}
              strokeLinejoin="round"
              paintOrder="stroke"
            >
              {line.words.map((w, j) => (
                <tspan key={j} fill={w.burn ? 'url(#burnFill)' : '#FFFFFF'}>
                  {w.t}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const ThreeFingerSalute: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Stripes />
    <Hand />
    <Fire />
    <Embers />
    <Title />
  </AbsoluteFill>
);
