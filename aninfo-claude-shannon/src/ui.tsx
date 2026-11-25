import React from 'react';
import { Easing, interpolate, spring } from 'remotion';
import { C, FPS, SANS, soft } from './theme';

export const pop = (f: number, start: number, stiffness = 180) =>
  spring({ frame: f - start, fps: FPS, config: { damping: 15, stiffness, mass: 0.7 } });

export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

export const out = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

export const lin = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** absolutely positioned by its center */
export const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; children: React.ReactNode }> = ({
  x, y, s = 1, r = 0, o = 1, children,
}) => (
  <div style={{ position: 'absolute', left: 0, top: 0, opacity: o, transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${r}deg) scale(${s})` }}>
    {children}
  </div>
);

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; r?: number }> = ({ style, children, r = 36 }) => (
  <div style={{ position: 'absolute', background: C.card, borderRadius: r, boxShadow: soft, overflow: 'hidden', fontFamily: SANS, color: C.ink, ...style }}>
    {children}
  </div>
);

/** small grey label pill, like the reference's "Beta" tags */
export const Tag: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ display: 'inline-block', fontFamily: SANS, fontSize: 24, fontWeight: 500, color: C.sub, background: '#ECE8DF', borderRadius: 10, padding: '6px 14px', ...style }}>
    {children}
  </span>
);

/** grey placeholder text line */
export const Bar: React.FC<{ w: number | string; h?: number; c?: string; style?: React.CSSProperties }> = ({ w, h = 14, c = '#ECE8E0', style }) => (
  <div style={{ width: w, height: h, borderRadius: h, background: c, ...style }} />
);

/* ------------------------------ icons ------------------------------ */
export const Pin: React.FC<{ size?: number; color?: string; dot?: string }> = ({ size = 56, color = C.red, dot = '#fff' }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 40 52">
    <path d="M20 51C20 51 4 31 4 19a16 16 0 1 1 32 0c0 12-16 32-16 32z" fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth={1.5} />
    <circle cx="20" cy="19" r="7" fill={dot} />
  </svg>
);

export const Star: React.FC<{ size?: number; fill?: number; color?: string }> = ({ size = 28, fill = 1, color = C.star }) => {
  const id = `st${Math.round(fill * 100)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={id}>
          <stop offset={fill} stopColor={color} />
          <stop offset={fill} stopColor="#DAD5CA" />
        </linearGradient>
      </defs>
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill={`url(#${id})`} />
    </svg>
  );
};

export const Stars: React.FC<{ value: number; size?: number; gap?: number }> = ({ value, size = 28, gap = 2 }) => (
  <span style={{ display: 'inline-flex', gap }}>
    {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} fill={Math.max(0, Math.min(1, value - i))} />)}
  </span>
);

export const Sparkle: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" fill={color} />
  </svg>
);

export const Search: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = C.sub }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" />
  </svg>
);

export const Check: React.FC<{ size?: number; color?: string; bg?: string }> = ({ size = 34, color = '#fff', bg = C.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill={bg} />
    <path d="M7 12.5l3.2 3.2L17 8.8" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Cup: React.FC<{ size?: number; color?: string; liquid?: string }> = ({ size = 60, color = '#fff', liquid = C.matcha }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M10 16h24l-2.5 22a4 4 0 0 1-4 3.5h-11a4 4 0 0 1-4-3.5z" fill={color} opacity={0.95} />
    <path d="M11.2 24h21.6l-1.6 14a3 3 0 0 1-3 2.6H15.8a3 3 0 0 1-3-2.6z" fill={liquid} />
    <path d="M34 20h3a5 5 0 0 1 0 10h-3.8" fill="none" stroke={color} strokeWidth={3} />
    <path d="M18 6c-2 3 2 4 0 7M24 5c-2 3 2 4 0 7" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.8} />
  </svg>
);

export const Chat: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill={color} />
    <path d="M7 9h10M7 13h6" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

export const Thumb: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M2 10h4v11H2zM8 21h9.3a2.5 2.5 0 0 0 2.4-1.9l1.6-6.6A2.5 2.5 0 0 0 18.9 9.5H14l.8-4.1A2 2 0 0 0 12.9 3L8 10z" fill={color} />
  </svg>
);

/** "AI (An Info)" segment mark: blue rounded square, serif "Ai", a small sparkle */
export const AiMark: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block', flex: 'none' }}>
    <rect width="40" height="40" rx="11" fill={C.blue} />
    <text x="17.5" y="29" textAnchor="middle" fontFamily='"Newsreader", Georgia, serif' fontSize="25" fontWeight="500" fill="#fff" letterSpacing="-0.5">Ai</text>
    <path d="M31 6.5c.3 2.6 2.3 4.6 4.9 4.9-2.6.3-4.6 2.3-4.9 4.9-.3-2.6-2.3-4.6-4.9-4.9 2.6-.3 4.6-2.3 4.9-4.9z" fill="#fff" />
  </svg>
);

/** the segment tag: mark + "AI · An Info", optionally followed by the episode topic */
export const SegmentTag: React.FC<{ topic?: string; size?: number }> = ({ topic, size = 26 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.42, fontFamily: SANS, fontSize: size, fontWeight: 500, color: C.sub, background: '#ECE8DF', borderRadius: size * 0.6, padding: `${size * 0.22}px ${size * 0.6}px ${size * 0.22}px ${size * 0.24}px` }}>
    <AiMark size={size * 1.45} />
    <b style={{ color: C.ink, fontWeight: 700 }}>AI · An Info</b>
    {topic && <span>— {topic}</span>}
  </span>
);
