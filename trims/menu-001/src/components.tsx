import React from 'react';
import { Easing, Img, interpolate, spring, staticFile } from 'remotion';
import { BODY, BORDER, C, FPS, HEAD, shadow } from './theme';

/* animation helpers ------------------------------------------------- */
export const pop = (f: number, start: number, stiffness = 170) =>
  spring({ frame: f - start, fps: FPS, config: { damping: 11, stiffness, mass: 0.8 } });

export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

export const lin = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** absolutely positioned by its center */
export const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; z?: number; children: React.ReactNode }> = ({
  x, y, s = 1, r = 0, o = 1, z, children,
}) => (
  <div style={{ position: 'absolute', left: 0, top: 0, zIndex: z, opacity: o, transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${r}deg) scale(${s})` }}>
    {children}
  </div>
);

/* neobrutalist building blocks -------------------------------------- */
export const Box: React.FC<{ bg?: string; pad?: string | number; radius?: number; sh?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  bg = C.white, pad = '24px 30px', radius = 22, sh = 12, style, children,
}) => (
  <div style={{ background: bg, border: `${BORDER}px solid ${C.ink}`, borderRadius: radius, boxShadow: shadow(sh), padding: pad, color: C.ink, fontFamily: BODY, ...style }}>
    {children}
  </div>
);

export const Sticker: React.FC<{ bg: string; size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ bg, size = 34, children, style }) => (
  <Box bg={bg} pad="10px 22px" radius={14} sh={7} style={{ fontFamily: HEAD, fontSize: size, whiteSpace: 'nowrap', textTransform: 'uppercase', ...style }}>
    {children}
  </Box>
);

/** "*word*" in a string becomes a highlighted chunk */
export const Rich: React.FC<{ text: string; mark?: string }> = ({ text, mark = C.yellow }) => (
  <>
    {text.split('*').map((part, i) =>
      i % 2 ? (
        <span key={i} style={{ background: mark, padding: '0 8px', border: `3px solid ${C.ink}`, borderRadius: 8, fontWeight: 700, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{part}</span>
      ) : (
        <span key={i}>{part}</span>
      ),
    )}
  </>
);

/** orange gingham tablecloth, the TRIMS backdrop */
export const Gingham: React.FC<{ f: number }> = ({ f }) => {
  const o = (f * 0.4) % 120;
  const band = `${C.orange}55`;
  return (
    <div
      style={{
        position: 'absolute', inset: 0, background: C.rice,
        backgroundImage: `linear-gradient(90deg, ${band} 50%, transparent 50%), linear-gradient(${band} 50%, transparent 50%)`,
        backgroundSize: '120px 120px', backgroundPosition: `${o}px ${o}px`,
      }}
    />
  );
};

/** black-and-white archive photo in a neobrutal frame, with a name plate */
export const Photo: React.FC<{ src: string; w: number; h: number; name?: string; years?: string; tag?: string; tagBg?: string; pos?: string }> = ({
  src, w, h, name, years, tag, tagBg = C.yellow, pos = 'center',
}) => (
  <div style={{ position: 'relative', width: w }}>
    <div style={{ width: w, height: h, border: `${BORDER}px solid ${C.ink}`, borderRadius: 22, overflow: 'hidden', boxShadow: shadow(14), background: C.ink }}>
      <Img src={staticFile(`img/${src}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1) contrast(1.08)' }} />
    </div>
    {name && (
      <div style={{ position: 'absolute', left: -18, right: -18, bottom: -46, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <Box bg={C.white} pad="8px 22px" radius={14} sh={7} style={{ fontFamily: HEAD, fontSize: 44, whiteSpace: 'nowrap', transform: 'rotate(-2deg)' }}>{name}</Box>
        {years && <Box bg={C.ink} pad="4px 16px" radius={10} sh={0} style={{ color: C.white, fontFamily: HEAD, fontSize: 32, boxShadow: `5px 5px 0 ${C.orange}` }}>{years}</Box>}
      </div>
    )}
    {tag && (
      <div style={{ position: 'absolute', left: -24, top: -26, transform: 'rotate(-6deg)' }}>
        <Sticker bg={tagBg} size={28}>{tag}</Sticker>
      </div>
    )}
  </div>
);

/** the TRIMS logo: plate with "?", fork and spoon */
export const Plate: React.FC<{ size?: number; spin?: number; mark?: string }> = ({ size = 300, spin = 0, mark = '?' }) => (
  <svg width={size} height={size * 0.68} viewBox="0 0 220 150" style={{ overflow: 'visible' }}>
    <rect x="14" y="20" width="12" height="110" rx="5" fill={C.white} stroke={C.ink} strokeWidth={5} />
    <rect x="8" y="14" width="24" height="40" rx="4" fill={C.white} stroke={C.ink} strokeWidth={5} />
    <line x1="16" y1="14" x2="16" y2="40" stroke={C.ink} strokeWidth={4} />
    <line x1="24" y1="14" x2="24" y2="40" stroke={C.ink} strokeWidth={4} />
    <g transform={`rotate(${spin} 110 75)`}>
      <circle cx="110" cy="75" r="62" fill={C.white} stroke={C.ink} strokeWidth={6} />
      <circle cx="110" cy="75" r="44" fill={C.yellow} stroke={C.ink} strokeWidth={5} />
      <text x="110" y="98" textAnchor="middle" fontFamily={HEAD} fontSize="64" fill={C.ink}>{mark}</text>
    </g>
    <rect x="194" y="58" width="12" height="78" rx="5" fill={C.white} stroke={C.ink} strokeWidth={5} />
    <ellipse cx="200" cy="38" rx="15" ry="24" fill={C.white} stroke={C.ink} strokeWidth={5} />
  </svg>
);

/** a generic chat-app spark (not a reproduction of any product logo) */
export const Spark: React.FC<{ size?: number; color?: string; rot?: number }> = ({ size = 80, color = C.claude, rot = 0 }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <g transform={`rotate(${rot})`}>
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={-5} y={-46} width={10} height={40} rx={5} fill={color} transform={`rotate(${i * 36})`} />
      ))}
      <circle r={9} fill={color} />
    </g>
  </svg>
);

/** small coffee/tea cup */
export const Cup: React.FC<{ size?: number; steam?: number }> = ({ size = 120, steam = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: 'visible' }}>
    {[40, 60, 80].map((x, i) => (
      <path key={x} d={`M${x} 34 q -10 -12 0 -24 q 10 -12 0 -24`} fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round"
        opacity={0.25 + 0.5 * Math.abs(Math.sin(steam / 10 + i))} transform={`translate(0 ${-4 * Math.sin(steam / 12 + i)})`} />
    ))}
    <path d="M18 44 h76 v34 a30 30 0 0 1 -30 30 h-16 a30 30 0 0 1 -30 -30 z" fill={C.white} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M94 54 h8 a14 14 0 0 1 0 28 h-10" fill="none" stroke={C.ink} strokeWidth={6} />
    <rect x="30" y="58" width="52" height="12" rx="6" fill={C.orange} />
  </svg>
);
