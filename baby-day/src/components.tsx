import React from 'react';
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, getStaticFiles, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import { C, Icon as IconKind, SANS, SCRIPT, SERIF } from './theme';

/* ------------------------------ motion ------------------------------ */
export const usePop = (delay = 0, damping = 12) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness: 120, mass: 0.8 } });
};
export const fadeIn = (f: number, start: number, len = 10) =>
  interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

/* --------------------------- decorations ---------------------------- */
export const Star: React.FC<{ x: number; y: number; size?: number; color?: string; delay?: number }> = ({ x, y, size = 46, color = C.butter, delay = 0 }) => {
  const f = useCurrentFrame();
  const p = usePop(delay);
  const tw = 1 + Math.sin((f + delay * 3) / 14) * 0.08;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', left: x, top: y, transform: `scale(${p * tw}) rotate(${Math.sin(f / 30) * 8}deg)` }}>
      <path d="M12 2.5l2.6 6 6.4.6-4.9 4.2 1.5 6.3L12 16.3 6.4 19.6l1.5-6.3L3 9.1l6.4-.6z" fill={color} stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
};

export const Heart: React.FC<{ x: number; y: number; size?: number; color?: string; delay?: number }> = ({ x, y, size = 40, color = C.pink, delay = 0 }) => {
  const f = useCurrentFrame();
  const p = usePop(delay);
  const beat = 1 + Math.max(0, Math.sin((f + delay * 5) / 9)) * 0.08;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', left: x, top: y, transform: `scale(${p * beat})` }}>
      <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.6 4 4.5 7.2 4.5c2 0 3.6 1.2 4.8 3 1.2-1.8 2.8-3 4.8-3 3.2 0 5.6 3.1 4.4 6.7-1.7 4.7-9.2 9.3-9.2 9.3z" fill={color} />
    </svg>
  );
};

/** puffy cloud with a dashed "stitched" outline */
export const Cloud: React.FC<{ x: number; y: number; w?: number; color?: string; drift?: number; face?: boolean }> = ({ x, y, w = 220, color = C.sage, drift = 20, face = false }) => {
  const f = useCurrentFrame();
  const dx = Math.sin(f / 50) * drift;
  return (
    <svg width={w} height={w * 0.6} viewBox="0 0 200 120" style={{ position: 'absolute', left: x + dx, top: y, opacity: 0.85 }}>
      <path d="M45 100c-22 0-36-14-36-31s14-30 32-30c5-20 22-32 42-32 22 0 38 14 42 32 4-2 9-3 14-3 20 0 33 14 33 32s-14 32-33 32z" fill={color} />
      <path d="M45 92c-17 0-28-10-28-24s11-23 26-23h4l1-4c4-16 18-26 35-26 18 0 31 11 34 26l1 6 6-2c3-1 7-2 11-2 15 0 25 10 25 24s-11 25-25 25z" fill="none" stroke={C.white} strokeWidth={2.5} strokeDasharray="7 7" strokeLinecap="round" />
      {face && (
        <g stroke={C.ink} strokeWidth={3} strokeLinecap="round" fill="none">
          <path d="M78 66q6 5 12 0" /><path d="M110 66q6 5 12 0" />
          <circle cx="70" cy="78" r="6" fill={C.pink} stroke="none" opacity={0.7} />
          <circle cx="130" cy="78" r="6" fill={C.pink} stroke="none" opacity={0.7} />
        </g>
      )}
    </svg>
  );
};

export const DotGrid: React.FC<{ x: number; y: number; color?: string }> = ({ x, y, color = C.sage }) => (
  <div style={{ position: 'absolute', left: x, top: y, display: 'grid', gridTemplateColumns: 'repeat(4, 14px)', gap: 22 }}>
    {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: color, opacity: 0.7 }} />)}
  </div>
);

/** soft corner blobs + floating confetti, shared by every scene */
export const Background: React.FC<{ tint?: string }> = ({ tint = C.sage }) => {
  const f = useCurrentFrame();
  const wob = Math.sin(f / 40) * 10;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <path d={`M0 0H${470 + wob}C${400 + wob} 120 260 160 150 220S0 330 0 330Z`} fill={tint} opacity={0.75} />
        <path d={`M0 270C120 230 260 170 ${360 + wob} 60`} stroke={C.white} strokeWidth={3} strokeDasharray="10 10" fill="none" />
        <path d={`M1080 1920H${540 - wob}C${640 - wob} 1820 760 1760 880 1700S1080 1560 1080 1560Z`} fill={C.pink} opacity={0.75} />
        <path d={`M640 1920C700 1830 830 1760 1080 1640`} stroke={C.white} strokeWidth={3} strokeDasharray="10 10" fill="none" />
      </svg>
      <DotGrid x={890} y={80} />
    </AbsoluteFill>
  );
};

/* ------------------------------ text ------------------------------- */
/** big serif word where each letter takes the next pastel colour */
export const Rainbow: React.FC<{ text: string; size: number; delay?: number; stagger?: number }> = ({ text, size, delay = 0, stagger = 2 }) => {
  const f = useCurrentFrame();
  const cols = [C.sage, C.pink, C.butter, C.lavender];
  let k = 0;
  return (
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: -1, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      {[...text].map((ch, i) => {
        if (ch === ' ') return <span key={i} style={{ width: size * 0.28 }} />;
        const d = delay + k * stagger;
        const col = cols[k++ % cols.length];
        const p = interpolate(f, [d, d + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2)) });
        return (
          <span key={i} style={{ color: col, display: 'inline-block', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px)`, WebkitTextStroke: `${size * 0.03}px ${C.white}`, paintOrder: 'stroke fill', textShadow: `0 6px 0 rgba(110,100,120,0.08)` }}>{ch}</span>
        );
      })}
    </div>
  );
};

/** handwritten line that "writes" itself left to right */
export const Script: React.FC<{ text: string; size: number; color?: string; delay?: number; len?: number }> = ({ text, size, color = C.lavender, delay = 0, len = 18 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + len], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  return (
    <div style={{ fontFamily: SCRIPT, fontWeight: 700, fontSize: size, color, lineHeight: 1.1, textAlign: 'center', clipPath: `inset(-20% ${100 - p}% -20% -5%)` }}>{text}</div>
  );
};

/** ribbon banner with notched ends and stitched edge, like "PRONTOS PARA" */
export const Ribbon: React.FC<{ text: string; color?: string; delay?: number }> = ({ text, color = C.sage, delay = 0 }) => {
  const p = usePop(delay, 14);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 18, padding: '16px 56px', background: color, color: C.ink, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 6, clipPath: 'polygon(0 0,100% 0,96% 50%,100% 100%,0 100%,4% 50%)', transform: `scaleX(${p})` }}>
      <div style={{ position: 'absolute', inset: 7, border: `2.5px dashed ${C.white}`, clipPath: 'inherit' }} />
      <span style={{ color: C.pink }}>♥</span>{text}<span style={{ color: C.pink }}>♥</span>
    </div>
  );
};

/** rounded clock pill */
export const TimePill: React.FC<{ time: string; color: string; delay?: number }> = ({ time, color, delay = 0 }) => {
  const p = usePop(delay);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '14px 34px 14px 18px', borderRadius: 999, background: C.paper, boxShadow: '0 8px 24px rgba(110,100,120,0.12)', transform: `scale(${p})`, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.ink }}>
      <div style={{ width: 56, height: 56, borderRadius: 28, background: color, display: 'grid', placeItems: 'center' }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2.6} strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
      </div>
      {time}
    </div>
  );
};

/* ------------------------------ icons ------------------------------ */
export const Icon: React.FC<{ kind: IconKind; size?: number }> = ({ kind, size = 120 }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 12) * 6;
  const st = { stroke: C.white, strokeWidth: 3, strokeDasharray: '6 6', fill: 'none' } as const;
  const body: Record<IconKind, React.ReactNode> = {
    sun: (<g><g transform={`rotate(${f * 0.8} 50 50)`}>{Array.from({ length: 8 }).map((_, i) => <rect key={i} x="47" y="4" width="6" height="16" rx="3" fill={C.butter} transform={`rotate(${i * 45} 50 50)`} />)}</g><circle cx="50" cy="50" r="24" fill={C.butter} /><circle cx="50" cy="50" r="18" {...st} /></g>),
    bottle: (<g><rect x="40" y="8" width="20" height="14" rx="6" fill={C.pink} /><rect x="34" y="20" width="32" height="10" rx="4" fill={C.lavender} /><rect x="30" y="30" width="40" height="62" rx="14" fill={C.paper} /><rect x="30" y="58" width="40" height="34" rx="12" fill={C.pink} opacity={0.6} /><rect x="35" y="35" width="30" height="52" rx="10" {...st} stroke={C.pink} /></g>),
    duck: (<g><ellipse cx="50" cy="68" rx="36" ry="22" fill={C.butter} /><circle cx="64" cy="38" r="18" fill={C.butter} /><path d="M80 38l14 4-14 5z" fill={C.pink} /><circle cx="68" cy="34" r="3" fill={C.ink} /><path d="M24 64q14 14 34 2" {...st} /></g>),
    cloud: (<g><path d="M24 76c-11 0-18-7-18-16s7-15 16-15c3-11 12-17 22-17 12 0 20 8 22 17 2-1 5-1 7-1 11 0 17 7 17 16s-7 16-17 16z" fill={C.lavender} /><path d="M38 56q4 4 8 0M56 56q4 4 8 0" stroke={C.white} strokeWidth={3} strokeLinecap="round" fill="none" /><text x="70" y="26" fontFamily={SANS} fontWeight={800} fontSize={18} fill={C.lavender}>z</text><text x="82" y="14" fontFamily={SANS} fontWeight={800} fontSize={13} fill={C.lavender}>z</text></g>),
    ball: (<g transform={`rotate(${f * 2} 50 50)`}><circle cx="50" cy="50" r="38" fill={C.sage} /><path d="M50 12a38 38 0 0 1 0 76" fill={C.pink} /><path d="M12 50h76" stroke={C.butter} strokeWidth={12} /><circle cx="50" cy="50" r="32" {...st} /></g>),
    book: (<g><path d="M50 26c-10-8-26-8-38-4v58c12-4 28-4 38 4z" fill={C.butter} /><path d="M50 26c10-8 26-8 38-4v58c-12-4-28-4-38 4z" fill={C.sage} /><path d="M50 30v52" stroke={C.white} strokeWidth={3} strokeDasharray="5 5" /><path d="M22 38q12-4 22 2M22 50q12-4 22 2M58 40q10-6 22-2M58 52q10-6 22-2" stroke={C.white} strokeWidth={3} fill="none" strokeLinecap="round" /></g>),
    bag: (<g><path d="M34 36q0-20 16-20t16 20" stroke={C.lavender} strokeWidth={6} fill="none" /><rect x="18" y="34" width="64" height="54" rx="14" fill={C.pink} /><rect x="24" y="40" width="52" height="42" rx="10" {...st} /><path d="M50 72s-10-6-10-12a5 5 0 0 1 10-2 5 5 0 0 1 10 2c0 6-10 12-10 12z" fill={C.white} /></g>),
    moon: (<g><path d="M66 12a38 38 0 1 0 22 58A30 30 0 0 1 66 12z" fill={C.butter} /><path d="M60 22a28 28 0 1 0 20 44" {...st} /><circle cx="84" cy="22" r="4" fill={C.butter} /></g>),
  };
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `translateY(${bob}px)`, overflow: 'visible' }}>{body[kind]}</svg>;
};

