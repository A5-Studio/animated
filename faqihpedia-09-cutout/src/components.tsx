import React from 'react';
import { Easing, interpolate, spring } from 'remotion';
import { C, FONT, FPS } from './theme';

/* ------------------------------------------------------------------ */
/* animation helpers                                                   */
/* ------------------------------------------------------------------ */
export const pop = (f: number, start: number, stiffness = 170) =>
  spring({ frame: f - start, fps: FPS, config: { damping: 13, stiffness, mass: 0.8 } });

export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

export const lin = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** absolutely positioned by its center */
export const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; children: React.ReactNode }> = ({
  x, y, s = 1, r = 0, o = 1, children,
}) => (
  <div style={{ position: 'absolute', left: 0, top: 0, opacity: o, transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${r}deg) scale(${s})` }}>
    {children}
  </div>
);

export const glow = (c: string, n = 24) => `0 0 ${n}px ${c}AA, 0 0 ${n * 2.5}px ${c}55`;

/* ------------------------------------------------------------------ */
/* building blocks                                                     */
/* ------------------------------------------------------------------ */
/** glass pill with a neon edge */
export const Pill: React.FC<{ c: string; size?: number; solid?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({
  c, size = 40, solid = false, children, style,
}) => (
  <div
    style={{
      display: 'inline-flex', alignItems: 'center', gap: size * 0.35, whiteSpace: 'nowrap',
      padding: `${size * 0.32}px ${size * 0.7}px`, borderRadius: 999, border: `3px solid ${c}`,
      background: solid ? c : 'rgba(20,26,51,0.72)', color: solid ? C.bg : C.text, boxShadow: glow(c, 18),
      fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: -0.5, ...style,
    }}
  >
    {children}
  </div>
);

/** words rise in one by one; "*word*" is drawn in the accent color */
export const Kinetic: React.FC<{ f: number; start: number; text: string; c: string; size?: number; stagger?: number }> = ({
  f, start, text, c, size = 64, stagger = 3,
}) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.28}px`, fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.1, letterSpacing: -1.5, maxWidth: 960, textAlign: 'center' }}>
    {text.split(' ').map((w, i) => {
      const hot = w.startsWith('*');
      const p = pop(f, start + i * stagger, 200);
      return (
        <span key={i} style={{ display: 'inline-block', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 50}px)`, color: hot ? c : C.text, textShadow: hot ? glow(c, 14) : '0 4px 18px rgba(0,0,0,0.6)' }}>
          {w.replace(/\*/g, '')}
        </span>
      );
    })}
  </div>
);

/** huge glowing text for the layer behind the person */
export const Giant: React.FC<{ text: string; c: string; size: number; outline?: boolean }> = ({ text, c, size, outline = false }) => (
  <div
    style={{
      fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.9, letterSpacing: -size * 0.05, whiteSpace: 'nowrap',
      color: outline ? 'transparent' : c, WebkitTextStroke: outline ? `6px ${c}` : undefined, textShadow: glow(c, size * 0.08),
    }}
  >
    {text}
  </div>
);

export const Tick: React.FC<{ size?: number; ok?: boolean }> = ({ size = 40, ok = true }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ flex: 'none', filter: `drop-shadow(0 0 6px ${ok ? C.lime : C.red})` }}>
    <circle cx="20" cy="20" r="18" fill={ok ? C.lime : C.red} />
    {ok ? (
      <path d="M11 21 L17 27 L29 14" fill="none" stroke={C.bg} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M13 13 L27 27 M27 13 L13 27" stroke={C.bg} strokeWidth={5} strokeLinecap="round" />
    )}
  </svg>
);
