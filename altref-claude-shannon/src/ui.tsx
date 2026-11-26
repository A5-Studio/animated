import React from 'react';
import { Easing, Img, interpolate, spring, staticFile } from 'remotion';
import { C, FPS, MONO, SANS, shadow } from './theme';

export const pop = (f: number, start: number, stiffness = 200) =>
  spring({ frame: f - start, fps: FPS, config: { damping: 16, stiffness, mass: 0.7 } });
export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
export const out = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
export const lin = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; children: React.ReactNode }> = ({ x, y, s = 1, r = 0, o = 1, children }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, opacity: o, transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${r}deg) scale(${s})` }}>{children}</div>
);

/** the white UI card with a header row: icon + bold label, and a mono "url" chip on the right */
export const UICard: React.FC<{
  x: number; y: number; w: number; h: number; icon?: React.ReactNode; label?: string; url?: string; style?: React.CSSProperties; children?: React.ReactNode;
}> = ({ x, y, w, h, icon, label, url, style, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: C.card, borderRadius: 22, border: `2px solid ${C.border}`, boxShadow: shadow, boxSizing: 'border-box', padding: '24px 30px', overflow: 'hidden', fontFamily: SANS, color: C.ink, ...style }}>
    {(icon || label || url) && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 48 }}>
        {icon}
        {label && <span style={{ fontWeight: 700, fontSize: 32, letterSpacing: -0.5 }}>{label}</span>}
        <span style={{ flex: 1 }} />
        {url && <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 20, color: C.sub, border: `2px solid ${C.border}`, borderRadius: 10, padding: '4px 12px' }}>{url}</span>}
      </div>
    )}
    {children}
  </div>
);

/** uppercase mono pill: red "LIMIT"-style, blue "NO WORD LIMITS"-style, or plain */
export const Pill: React.FC<{ tone?: 'red' | 'blue' | 'green' | 'grey' | 'ink'; size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ tone = 'red', size = 26, children, style }) => {
  const t = {
    red: { background: C.red, color: '#fff' },
    blue: { background: C.blue, color: '#fff' },
    green: { background: C.green, color: '#fff' },
    grey: { background: '#F2F2F2', color: C.sub, border: `2px solid ${C.border}` },
    ink: { background: C.ink, color: '#fff' },
  }[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontWeight: 700, fontSize: size, letterSpacing: 1.5, textTransform: 'uppercase', borderRadius: 8, padding: `${size * 0.3}px ${size * 0.55}px`, whiteSpace: 'nowrap', ...t, ...style }}>
      {children}
    </span>
  );
};

/** pink keycap, like "option + space" */
export const Key: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 28 }) => (
  <span style={{ display: 'inline-block', fontFamily: MONO, fontWeight: 500, fontSize: size, background: C.pink, border: `2px solid ${C.pinkLine}`, borderRadius: 12, padding: `${size * 0.4}px ${size * 0.9}px`, color: C.ink }}>{children}</span>
);

/** a big number that counts from a to b between two frames */
export const Count: React.FC<{ f: number; a: number; b: number; from: number; to: number; size?: number; fmt?: (n: number) => string; color?: string }> = ({
  f, a, b, from, to, size = 150, fmt = (n) => Math.round(n).toLocaleString('en-US'), color = C.ink,
}) => {
  const v = mix(a, b, out(f, from, to));
  return <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1, color, fontVariantNumeric: 'tabular-nums' }}>{fmt(v)}</div>;
};

/** sparkline that draws itself, blue with a soft fill */
export const Spark: React.FC<{ f: number; from: number; to: number; w: number; h: number; pts: number[] }> = ({ f, from, to, w, h, pts }) => {
  const p = out(f, from, to);
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * w, h - v * h] as [number, number]);
  const n = Math.max(2, Math.ceil(p * xy.length));
  const shown = xy.slice(0, n);
  const d = shown.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const last = shown[shown.length - 1];
  return (
    <svg width={w} height={h + 10} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.blue} stopOpacity={0.22} />
          <stop offset="1" stopColor={C.blue} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${d} L${last[0]} ${h} L0 ${h} Z`} fill="url(#sparkfill)" />
      <path d={d} fill="none" stroke={C.blue} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r={9} fill="#fff" stroke={C.blue} strokeWidth={5} />
    </svg>
  );
};

export const ClaudeIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, overflow: 'hidden', background: C.claude, flex: 'none' }}>
    <Img src={staticFile('img/claude-logo.png')} style={{ width: '100%', height: '100%', display: 'block' }} />
  </div>
);

export const Avatar: React.FC<{ src: string; pos?: string; size?: number; ring?: string }> = ({ src, pos = 'center', size = 90, ring = C.blue }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${ring}`, flex: 'none' }}>
    <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1)' }} />
  </div>
);

export const Lock: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect x="4.5" y="10.5" width="15" height="11" rx="3" fill={color} />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke={color} strokeWidth={2.4} />
  </svg>
);

export const SearchIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth={2.4} strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" />
  </svg>
);
