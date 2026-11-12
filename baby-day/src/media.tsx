import React from 'react';
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, getStaticFiles, interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { Icon } from './components';
import MEDIA from './media.json';
import { C, SANS } from './theme';

type Info = { w: number; h: number; faces?: number[][]; from?: number; track?: number[][] };
const INFO = MEDIA as Record<string, Info>;

const hasFile = (path: string) => getStaticFiles().some((f) => f.name === path);

/** baby-face sticker; uses public/face.png when it exists, else a drawn one */
export const FaceSticker: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => {
  const f = useCurrentFrame();
  const style: React.CSSProperties = {
    position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size,
    transform: `rotate(${Math.sin(f / 9) * 4}deg)`, filter: 'drop-shadow(0 6px 12px rgba(110,100,120,0.3))',
  };
  if (hasFile('face.png')) return <Img src={staticFile('face.png')} style={{ ...style, objectFit: 'contain' }} />;
  return (
    <svg viewBox="0 0 100 100" style={style}>
      <circle cx="50" cy="52" r="46" fill="#F9DCCB" stroke={C.white} strokeWidth={4} />
      <ellipse cx="35" cy="54" rx="6.5" ry="7.5" fill="#3A3240" /><ellipse cx="65" cy="54" rx="6.5" ry="7.5" fill="#3A3240" />
      <circle cx="37" cy="51" r="2.2" fill="#fff" /><circle cx="67" cy="51" r="2.2" fill="#fff" />
      <circle cx="25" cy="67" r="7" fill={C.pink} opacity={0.6} /><circle cx="75" cy="67" r="7" fill={C.pink} opacity={0.6} />
      <ellipse cx="50" cy="73" rx="5" ry="4" fill="#D9808E" />
      <path d="M50 16c-8-8-17-3-12 3 3 3 8 1 12-3zm0 0c8-8 17-3 12 3-3 3-8 1-12-3z" fill={C.pink} /><circle cx="50" cy="16" r="3.5" fill="#E28F9A" />
    </svg>
  );
};

/**
 * A photo or video cropped to cover w x h, with the baby's face covered.
 * fx/fy choose which part survives the crop; zoom is a slow Ken Burns push.
 */
export const Media: React.FC<{ src: string; w: number; h: number; fx?: number; fy?: number; zoom?: boolean }> = ({ src, w, h, fx = 0.5, fy = 0.5, zoom = true }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const info = INFO[src];
  const path = `clips/${src}`;
  if (!info || !hasFile(path)) {
    return (
      <AbsoluteFill style={{ background: C.paper, alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 26, color: C.ink }}>
        missing: public/{path}
      </AbsoluteFill>
    );
  }
  const k = Math.max(w / info.w, h / info.h);
  const iw = info.w * k, ih = info.h * k;
  const dx = (w - iw) * fx, dy = (h - ih) * fy;
  const isVideo = src.endsWith('.mp4');
  const t = f / fps;

  let faces: { x: number; y: number; s: number }[] = [];
  if (info.faces) faces = info.faces.map(([x, y, sz]) => ({ x, y, s: sz }));
  if (info.track && info.track.length) {
    const tr = info.track;
    const at = (j: number) => interpolate(t, tr.map((p) => p[0]), tr.map((p) => p[j]), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    faces = [{ x: at(1), y: at(2), s: at(3) }];
  }
  const z = zoom && !isVideo ? 1.03 + t * 0.012 : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${(fx * 100).toFixed(0)}% ${(fy * 100).toFixed(0)}%` }}>
        {isVideo ? (
          <OffthreadVideo src={staticFile(path)} startFrom={Math.round((info.from ?? 0) * fps)} muted
            style={{ position: 'absolute', left: dx, top: dy, width: iw, height: ih }} />
        ) : (
          <Img src={staticFile(path)} style={{ position: 'absolute', left: dx, top: dy, width: iw, height: ih }} />
        )}
        {faces.map((q, i) => <FaceSticker key={i} x={dx + q.x * iw} y={dy + q.y * ih} size={q.s * iw} />)}
      </div>
    </div>
  );
};

/** rounded paper frame with stitched borders */
export const Frame: React.FC<{ w: number; h: number; accent: string; children: React.ReactNode; pad?: number; radius?: number }> = ({ w, h, accent, children, pad = 18, radius = 56 }) => (
  <div style={{ width: w, height: h, borderRadius: radius, padding: pad, background: C.paper, boxShadow: '0 24px 60px rgba(110,100,120,0.18)', position: 'relative' }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: radius - pad + 4, overflow: 'hidden' }}>{children}</div>
    <div style={{ position: 'absolute', inset: pad + 12, borderRadius: radius - pad - 8, border: `3px dashed ${C.white}`, opacity: 0.9, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', inset: 6, borderRadius: radius - 6, border: `3px dashed ${accent}`, pointerEvents: 'none' }} />
  </div>
);

/** illustrated bath for the moment we have no footage of */
export const BathCard: React.FC = () => {
  const f = useCurrentFrame();
  const bubbles = Array.from({ length: 14 }, (_, i) => {
    const life = ((f + i * 17) % 90) / 90;
    return { x: 180 + ((i * 97) % 520), y: 640 - life * 520, r: 14 + (i % 4) * 8, o: 1 - life };
  });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.paper}, #DDEEE8)` }}>
      <svg viewBox="0 0 864 1064" style={{ width: '100%', height: '100%' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={i * 108} y="0" width="104" height="104" fill={C.sage} opacity={0.12} rx="8" />)}
        {bubbles.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="none" stroke={C.white} strokeWidth={5} opacity={b.o} />)}
        <ellipse cx="432" cy="690" rx="330" ry="70" fill={C.white} />
        <path d="M102 690h660v80c0 110-90 170-200 170H302c-110 0-200-60-200-170z" fill={C.pink} />
        <path d="M130 712h604v58c0 92-76 146-176 146H306c-100 0-176-54-176-146z" fill="none" stroke={C.white} strokeWidth={5} strokeDasharray="14 12" />
        <rect x="220" y="930" width="30" height="60" rx="12" fill={C.wood} /><rect x="614" y="930" width="30" height="60" rx="12" fill={C.wood} />
        {[[200, 680, 60], [290, 660, 72], [400, 670, 64], [520, 655, 76], [630, 675, 58]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y + Math.sin((f + i * 9) / 10) * 6} r={r} fill={C.white} />
        ))}
        <g transform={`translate(${560 + Math.sin(f / 14) * 24} ${560 + Math.sin(f / 8) * 8})`}>
          <ellipse cx="0" cy="40" rx="70" ry="42" fill={C.butter} /><circle cx="30" cy="-10" r="36" fill={C.butter} />
          <path d="M60 -10l30 8-30 10z" fill={C.pink} /><circle cx="40" cy="-18" r="6" fill={C.ink} />
          <path d="M-40 36q24 22 60 2" stroke={C.white} strokeWidth={5} strokeDasharray="8 8" fill="none" />
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 160, display: 'flex', justifyContent: 'center', opacity: 0.9 }}><Icon kind="duck" size={150} /></div>
    </AbsoluteFill>
  );
};

/** subtitle card for Migu's line; words fade in one by one */
export const Subtitle: React.FC<{ text: string; delay?: number; len: number }> = ({ text, delay = 0, len }) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  const per = Math.max(2, Math.min(7, (len * 0.8) / words.length));
  const inP = interpolate(f, [delay, delay + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6)) });
  return (
    <div style={{ display: 'inline-block', maxWidth: 940, padding: '22px 40px', borderRadius: 40, background: C.paper, boxShadow: '0 10px 30px rgba(110,100,120,0.16)', transform: `scale(${0.9 + inP * 0.1})`, opacity: inP, fontFamily: SANS, fontWeight: 800, fontSize: 48, lineHeight: 1.25, color: C.ink, textAlign: 'center' }}>
      {words.map((w, i) => (
        <span key={i} style={{ opacity: interpolate(f, [delay + i * per, delay + i * per + 6], [0.15, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{w} </span>
      ))}
    </div>
  );
};

/** analog clock in the nursery style; minutes since midnight drive the hands */
export const ClockFace: React.FC<{ minutes: number; size: number }> = ({ minutes, size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="94" fill={C.paper} />
    <circle cx="100" cy="100" r="94" fill="none" stroke={C.sage} strokeWidth={8} />
    <circle cx="100" cy="100" r="80" fill="none" stroke={C.sage} strokeWidth={3} strokeDasharray="7 7" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const col = [C.pink, C.butter, C.lavender, C.sage][i % 4];
      return <circle key={i} cx={100 + Math.sin(a) * 66} cy={100 - Math.cos(a) * 66} r={i % 3 === 0 ? 7 : 4} fill={col} />;
    })}
    <line x1="100" y1="100" x2={100 + Math.sin((minutes / 720) * Math.PI * 2) * 40} y2={100 - Math.cos((minutes / 720) * Math.PI * 2) * 40} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
    <line x1="100" y1="100" x2={100 + Math.sin((minutes / 60) * Math.PI * 2) * 60} y2={100 - Math.cos((minutes / 60) * Math.PI * 2) * 60} stroke={C.pink} strokeWidth={6} strokeLinecap="round" />
    <circle cx="100" cy="100" r="9" fill={C.butter} />
  </svg>
);

export const hhmm = (m: number) => {
  const mm = Math.floor(((m % 1440) + 1440) % 1440);
  return `${String(Math.floor(mm / 60)).padStart(2, '0')}.${String(mm % 60).padStart(2, '0')}`;
};
export const toMin = (t: string) => { const [h, m] = t.split('.').map(Number); return h * 60 + m; };
