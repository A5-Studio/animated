import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from 'remotion';
import { BODY, BORDER, C, FPS, HEAD, shadow } from './theme';

/* ------------------------------------------------------------------ */
/* animation helpers                                                   */
/* ------------------------------------------------------------------ */
export const pop = (f: number, start: number, stiffness = 170) =>
  spring({ frame: f - start, fps: FPS, config: { damping: 11, stiffness, mass: 0.8 } });

export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

export const lin = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** visible between a and b, with quick fades at both ends */
export const between = (f: number, a: number, b: number, d = 8) => lin(f, a, a + d) * (1 - lin(f, b - d, b));

type P = { x: number; y: number };
export const qbez = (p0: P, p1: P, p2: P, t: number): P => ({
  x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
  y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y,
});

/** absolutely positioned by its center */
export const At: React.FC<{
  x: number; y: number; s?: number; r?: number; o?: number; z?: number; children: React.ReactNode;
}> = ({ x, y, s = 1, r = 0, o = 1, z, children }) => (
  <div
    style={{
      position: 'absolute', left: 0, top: 0, zIndex: z, opacity: o,
      transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${r}deg) scale(${s})`,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* neobrutalist building blocks                                        */
/* ------------------------------------------------------------------ */
export const Box: React.FC<{
  bg?: string; pad?: string | number; radius?: number; sh?: number; style?: React.CSSProperties; children?: React.ReactNode;
}> = ({ bg = C.white, pad = '24px 30px', radius = 22, sh = 12, style, children }) => (
  <div
    style={{
      background: bg, border: `${BORDER}px solid ${C.ink}`, borderRadius: radius, boxShadow: shadow(sh),
      padding: pad, color: C.ink, fontFamily: BODY, ...style,
    }}
  >
    {children}
  </div>
);

export const Sticker: React.FC<{ bg: string; size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  bg, size = 34, children, style,
}) => (
  <Box bg={bg} pad="10px 22px" radius={14} sh={7} style={{ fontFamily: HEAD, fontSize: size, whiteSpace: 'nowrap', textTransform: 'uppercase', ...style }}>
    {children}
  </Box>
);

/** "*word*" in a string becomes a highlighted chunk */
export const Rich: React.FC<{ text: string; mark?: string }> = ({ text, mark = C.yellow }) => (
  <>
    {text.split('*').map((part, i) =>
      i % 2 ? (
        <span key={i} style={{ background: mark, padding: '0 8px', border: `3px solid ${C.ink}`, borderRadius: 8, fontWeight: 700, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      ),
    )}
  </>
);

/* ------------------------------------------------------------------ */
/* scene furniture                                                     */
/* ------------------------------------------------------------------ */
export const Background: React.FC<{ color?: string }> = ({ color = C.bg }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: color,
        backgroundImage: `linear-gradient(${C.ink}14 3px, transparent 3px), linear-gradient(90deg, ${C.ink}14 3px, transparent 3px)`,
        backgroundSize: '90px 90px',
        backgroundPosition: `${(f * 0.6) % 90}px ${(f * 0.6) % 90}px`,
      }}
    />
  );
};

export const Header: React.FC<{ step?: number; title: string; color?: string }> = ({ step, title, color = C.yellow }) => {
  const f = useCurrentFrame();
  const a = pop(f, 0);
  const b = pop(f, 6);
  return (
    <>
      {step !== undefined && (
        <At x={540} y={180} s={a} r={-3}>
          <Sticker bg={C.ink} size={32} style={{ color: C.white, boxShadow: shadow(7).replace(C.ink, color) }}>
            Belanja #{step} dari 3
          </Sticker>
        </At>
      )}
      <At x={540} y={step !== undefined ? 340 : 300} s={b}>
        <Box bg={color} pad="18px 36px" style={{ fontFamily: HEAD, fontSize: 60, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line', width: 'max-content', maxWidth: 940 }}>
          {title}
        </Box>
      </At>
    </>
  );
};

/** caption card in the lower third; switches between lines at the given local frames */
export const Captions: React.FC<{ lines: { from: number; to: number; text: string }[] }> = ({ lines }) => {
  const f = useCurrentFrame();
  return (
    <>
      {lines.map((l, i) => {
        if (f < l.from - 1 || f > l.to + 1) return null;
        const s = pop(f, l.from, 220);
        const out = lin(f, l.to - 6, l.to);
        return (
          <At key={i} x={510} y={1480} s={(0.85 + 0.15 * s) * (1 - 0.15 * out)} o={Math.min(1, s * 1.5) * (1 - out)} r={i % 2 ? 1 : -1}>
            <Box pad="26px 34px" style={{ width: 900, fontSize: 44, lineHeight: 1.35, fontWeight: 500, textAlign: 'center' }}>
              <Rich text={l.text} />
            </Box>
          </At>
        );
      })}
    </>
  );
};


export const Burst: React.FC<{ size?: number; color?: string; children?: React.ReactNode; rot?: number }> = ({ size = 380, color = C.yellow, children, rot = 0 }) => {
  const pts: string[] = [];
  const n = 14;
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? 0.72 : 1;
    const a = (i / (n * 2)) * Math.PI * 2 + (rot * Math.PI) / 180;
    pts.push(`${100 + 92 * r * Math.cos(a)},${100 + 92 * r * Math.sin(a)}`);
  }
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: `drop-shadow(8px 8px 0 ${C.ink})` }}>
        <polygon points={pts.join(' ')} fill={color} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: size * 0.2, textAlign: 'center' }}>{children}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* money + belanjaan icons                                             */
/* ------------------------------------------------------------------ */
const ST = { stroke: C.ink, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Indonesian-style red banknote */
export const Bill: React.FC<{ w?: number }> = ({ w = 300 }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 200 100" style={{ overflow: 'visible' }}>
    <rect x={4} y={4} width={192} height={92} rx={10} fill={C.red} {...ST} />
    <rect x={16} y={16} width={168} height={68} rx={6} fill="none" stroke={C.ink} strokeWidth={3} />
    <circle cx={100} cy={50} r={22} fill={C.white} {...ST} />
    <text x={100} y={59} textAnchor="middle" fontFamily='"Archivo Black"' fontSize={24}>Rp</text>
    <text x={40} y={44} textAnchor="middle" fontFamily='"Archivo Black"' fontSize={18}>100</text>
    <text x={160} y={74} textAnchor="middle" fontFamily='"Archivo Black"' fontSize={18}>RIBU</text>
  </svg>
);

export const RiceSack: React.FC<{ size?: number; label?: string }> = ({ size = 220, label = 'BERAS' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
    <path d="M24 22 Q50 30 76 22 L84 86 Q50 96 16 86 Z" fill={C.white} {...ST} />
    <path d="M24 22 Q22 12 30 10 Q50 18 70 10 Q78 12 76 22" fill={C.white} {...ST} />
    <path d="M30 14 L34 6 M50 16 L50 6 M70 14 L66 6" {...ST} strokeWidth={4} />
    <rect x={24} y={44} width={52} height={26} rx={4} fill={C.yellow} stroke={C.ink} strokeWidth={4} />
    <text x={50} y={63} textAnchor="middle" fontFamily='"Archivo Black"' fontSize={label.length > 5 ? 10 : 13}>{label}</text>
  </svg>
);

export const Toga: React.FC<{ size?: number; color?: string }> = ({ size = 220, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
    <path d="M28 46 V66 Q50 80 72 66 V46" fill={color} {...ST} />
    <path d="M50 20 L94 40 L50 60 L6 40 Z" fill={C.ink} {...ST} />
    <path d="M50 40 L80 50 V74" fill="none" stroke={C.yellow} strokeWidth={4} strokeLinecap="round" />
    <circle cx={80} cy={78} r={6} fill={C.yellow} stroke={C.ink} strokeWidth={3} />
  </svg>
);

export const Pump: React.FC<{ size?: number }> = ({ size = 240 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
    <rect x={16} y={10} width={48} height={82} rx={6} fill={C.green} {...ST} />
    <rect x={24} y={20} width={32} height={22} rx={3} fill={C.white} stroke={C.ink} strokeWidth={4} />
    <rect x={10} y={88} width={60} height={8} rx={2} fill={C.ink} />
    <path d="M64 30 H74 Q82 30 82 38 V70 Q82 76 88 76 Q94 76 94 70 V40 L86 32" fill="none" {...ST} />
    <text x={40} y={66} textAnchor="middle" fontFamily='"Archivo Black"' fontSize={10}>PERTA</text>
    <text x={40} y={78} textAnchor="middle" fontFamily='"Archivo Black"' fontSize={10}>LITE</text>
  </svg>
);

export const Drop: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ overflow: 'visible' }}>
    <path d="M20 3 Q34 20 34 27 A14 14 0 0 1 6 27 Q6 20 20 3 Z" fill={C.green} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
  </svg>
);

export const Person: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = C.pink }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx={20} cy={11} r={8} fill={color} stroke={C.ink} strokeWidth={3.5} />
    <path d="M5 38 Q5 22 20 22 Q35 22 35 38 Z" fill={color} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
  </svg>
);

/** stylised earth that "spins" by sliding its continents */
export const Globe: React.FC<{ size?: number; spin?: number }> = ({ size = 420, spin = 0 }) => {
  const off = ((spin % 200) + 200) % 200;
  const land = (dx: number) => (
    <g transform={`translate(${dx - off} 0)`}>
      <path d="M20 40 Q34 24 52 32 Q60 44 48 52 Q40 66 28 60 Q16 52 20 40 Z" fill={C.green} stroke={C.ink} strokeWidth={4} />
      <path d="M70 70 Q86 62 96 74 Q92 92 78 94 Q66 86 70 70 Z" fill={C.green} stroke={C.ink} strokeWidth={4} />
      <path d="M100 30 Q124 18 150 30 Q160 46 140 54 Q120 60 108 50 Q96 42 100 30 Z" fill={C.green} stroke={C.ink} strokeWidth={4} />
      <path d="M150 78 Q170 70 186 84 Q178 102 160 100 Q146 92 150 78 Z" fill={C.green} stroke={C.ink} strokeWidth={4} />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible', filter: `drop-shadow(10px 10px 0 ${C.ink})` }}>
      <defs>
        <clipPath id="earth"><circle cx={50} cy={50} r={44} /></clipPath>
      </defs>
      <circle cx={50} cy={50} r={44} fill={C.blue} />
      <g clipPath="url(#earth)">{land(0)}{land(200)}</g>
      <circle cx={50} cy={50} r={44} fill="none" stroke={C.ink} strokeWidth={5} />
    </svg>
  );
};

/** formats with Indonesian thousands dots */
export const rp = (n: number) => Math.round(n).toLocaleString('id-ID');
