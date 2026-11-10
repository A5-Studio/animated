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
            AI #{step} dari 3
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
export const Captions: React.FC<{ lines: { from: number; to: number; text: string }[]; x?: number; y?: number; w?: number; size?: number }> = ({
  lines, x = 510, y = 1480, w = 900, size = 44,
}) => {
  const f = useCurrentFrame();
  return (
    <>
      {lines.map((l, i) => {
        if (f < l.from - 1 || f > l.to + 1) return null;
        const s = pop(f, l.from, 220);
        const out = lin(f, l.to - 6, l.to);
        return (
          <At key={i} x={x} y={y} s={(0.85 + 0.15 * s) * (1 - 0.15 * out)} o={Math.min(1, s * 1.5) * (1 - out)} r={i % 2 ? 1 : -1}>
            <Box pad="26px 34px" style={{ width: w, fontSize: size, lineHeight: 1.35, fontWeight: 500, textAlign: 'center' }}>
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

/** generic chat-bubble "AI" badge (no brand logos) */
export const AiBubble: React.FC<{ size?: number; color: string; label: string }> = ({ size = 160, color, label }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
    <path d="M14 18 H86 Q92 18 92 24 V64 Q92 70 86 70 H44 L26 86 V70 H14 Q8 70 8 64 V24 Q8 18 14 18 Z" fill={color} {...ST} />
    <text x={50} y={54} textAnchor="middle" fontFamily='"Archivo Black"' fontSize={label.length > 3 ? 17 : label.length > 1 ? 24 : 34}>{label}</text>
    <path d="M84 4 L87 12 L95 15 L87 18 L84 26 L81 18 L73 15 L81 12 Z" fill={C.yellow} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
  </svg>
);

/** tear-off calendar showing a year */
export const Calendar: React.FC<{ year: number; month?: string; color: string; w?: number }> = ({ year, month = '', color, w = 340 }) => (
  <div style={{ width: w, background: C.white, border: `${BORDER}px solid ${C.ink}`, borderRadius: 22, boxShadow: shadow(12), overflow: 'hidden', fontFamily: HEAD, textAlign: 'center' }}>
    <div style={{ background: color, borderBottom: `${BORDER}px solid ${C.ink}`, fontSize: w * 0.12, padding: '10px 0', display: 'flex', justifyContent: 'center', gap: w * 0.25 }}>
      <span>●</span><span>{month || 'TAHUN'}</span><span>●</span>
    </div>
    <div style={{ fontSize: w * 0.3, padding: '14px 0 20px', fontVariantNumeric: 'tabular-nums' }}>{year}</div>
  </div>
);

/** formats with Indonesian thousands dots */
export const rp = (n: number) => Math.round(n).toLocaleString('id-ID');
