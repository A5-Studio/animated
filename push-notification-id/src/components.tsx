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
            Langkah {step} dari 5
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

/** label hanging under an actor: big analogy word + real tech name */
export const ActorLabel: React.FC<{ title: string; sub: string; bg: string }> = ({ title, sub, bg }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
    <Sticker bg={bg} size={30}>{title}</Sticker>
    <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24, color: C.ink, background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '2px 12px' }}>{sub}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* the phone                                                           */
/* ------------------------------------------------------------------ */
export const Phone: React.FC<{
  notif?: number; offline?: number; dialog?: number; press?: number; glow?: number;
}> = ({ notif = 0, offline = 0, dialog = 0, press = 0, glow = 0 }) => {
  const appColors = [C.orange, C.blue, C.green, C.pink, C.purple, C.yellow, C.red, C.white];
  return (
    <div
      style={{
        width: 300, height: 600, borderRadius: 46, background: C.white, border: `8px solid ${C.ink}`,
        boxShadow: `${shadow(14)}${glow ? `, 0 0 0 ${10 * glow}px ${C.yellow}` : ''}`, padding: 12, position: 'relative',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden', background: C.blue, border: `5px solid ${C.ink}` }}>
        {/* status bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 18px', fontFamily: BODY, fontWeight: 700, fontSize: 18 }}>
          <span>09.41</span>
          <span style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
            {[6, 10, 14, 18].map((h, i) => (
              <span key={i} style={{ width: 5, height: h, background: offline > 0.5 ? '#0003' : C.ink, borderRadius: 1 }} />
            ))}
          </span>
        </div>
        <div style={{ textAlign: 'center', fontFamily: HEAD, fontSize: 64, marginTop: 64 }}>09.41</div>
        <div style={{ textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 18 }}>Kamis, 1 Oktober</div>
        {/* app grid */}
        <div style={{ position: 'absolute', left: 22, right: 22, bottom: 40, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {appColors.map((c, i) => (
            <div key={i} style={{ width: 46, height: 46, borderRadius: 12, background: c, border: `4px solid ${C.ink}`, justifySelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {i === 0 && <BagIcon size={26} />}
            </div>
          ))}
        </div>
        {/* notification */}
        <div
          style={{
            position: 'absolute', left: 10, right: 10, top: 34, transform: `translateY(${(1 - notif) * -150}px) rotate(-2deg)`,
            background: C.white, border: `5px solid ${C.ink}`, borderRadius: 18, boxShadow: shadow(6), padding: '10px 12px', display: 'flex', gap: 10, fontFamily: BODY,
          }}
        >
          <div style={{ flex: 'none', width: 40, height: 40, borderRadius: 10, background: C.orange, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BagIcon size={22} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>TokoKu · baru saja</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Paketmu sudah dikirim!</div>
            <div style={{ fontSize: 14 }}>Pesanan #1234 lagi di jalan</div>
          </div>
        </div>
        {/* offline stamp */}
        {offline > 0 && (
          <div style={{ position: 'absolute', inset: 0, background: `rgba(17,17,17,${0.35 * offline})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: `rotate(-14deg) scale(${0.6 + 0.4 * offline})`, opacity: offline, background: C.red, border: `5px solid ${C.ink}`, boxShadow: shadow(6), borderRadius: 12, padding: '8px 18px', fontFamily: HEAD, fontSize: 40 }}>
              OFFLINE
            </div>
          </div>
        )}
        {/* permission dialog (Android 13+) */}
        {dialog > 0 && (
          <div style={{ position: 'absolute', inset: 0, background: `rgba(17,17,17,${0.45 * dialog})` }}>
            <div
              style={{
                position: 'absolute', left: 14, right: 14, top: 150, opacity: dialog, transform: `scale(${0.8 + 0.2 * dialog})`,
                background: C.white, border: `5px solid ${C.ink}`, borderRadius: 20, boxShadow: shadow(8), padding: '18px 16px 14px', textAlign: 'center', fontFamily: BODY,
              }}
            >
              <BellIcon size={40} />
              <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.25, margin: '8px 0 14px' }}>Izinkan TokoKu mengirim notifikasi?</div>
              <div style={{ background: C.green, border: `4px solid ${C.ink}`, borderRadius: 12, padding: 10, fontFamily: HEAD, fontSize: 20, transform: `scale(${1 - 0.1 * press})`, boxShadow: shadow(5 - 4 * press) }}>IZINKAN</div>
              <div style={{ background: C.white, border: `4px solid ${C.ink}`, borderRadius: 12, padding: 8, fontFamily: HEAD, fontSize: 18, marginTop: 10 }}>JANGAN</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* icons (flat fills, thick black outlines)                            */
/* ------------------------------------------------------------------ */
const sw = 6;
export const BagIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M8 14h24l-2 22H10z" fill={C.white} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M14 14v-3a6 6 0 0 1 12 0v3" fill="none" stroke={C.ink} strokeWidth={3.5} />
  </svg>
);

export const BellIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M10 28V18a10 10 0 0 1 20 0v10l3 4H7z" fill={C.yellow} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
    <circle cx="20" cy="35" r="3.5" fill={C.ink} />
  </svg>
);

export const HouseIcon: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="34" y="88" width="132" height="96" fill={C.white} stroke={C.ink} strokeWidth={sw} strokeLinejoin="round" />
    <path d="M18 96 L100 24 L182 96 Z" fill={C.red} stroke={C.ink} strokeWidth={sw} strokeLinejoin="round" />
    <rect x="84" y="124" width="34" height="60" fill={C.yellow} stroke={C.ink} strokeWidth={sw} />
    <rect x="46" y="108" width="28" height="28" fill={C.blue} stroke={C.ink} strokeWidth={sw} />
    <rect x="130" y="108" width="24" height="28" fill={C.blue} stroke={C.ink} strokeWidth={sw} />
  </svg>
);

export const ShopIcon: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="30" y="80" width="140" height="104" fill={C.white} stroke={C.ink} strokeWidth={sw} />
    <rect x="22" y="26" width="156" height="30" fill={C.orange} stroke={C.ink} strokeWidth={sw} />
    <text x="100" y="49" textAnchor="middle" fontFamily={HEAD} fontSize="22">TokoKu</text>
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${22 + i * 31.2} 56 h31.2 v18 a15.6 15.6 0 0 1 -31.2 0 z`} fill={i % 2 ? C.white : C.pink} stroke={C.ink} strokeWidth={sw - 1} strokeLinejoin="round" />
    ))}
    <rect x="44" y="110" width="50" height="40" fill={C.blue} stroke={C.ink} strokeWidth={sw} />
    <rect x="112" y="110" width="40" height="74" fill={C.yellow} stroke={C.ink} strokeWidth={sw} />
  </svg>
);

export const PostIcon: React.FC<{ size?: number }> = ({ size = 220 }) => (
  <svg width={size} height={size} viewBox="0 0 220 220">
    <rect x="28" y="88" width="164" height="104" fill={C.white} stroke={C.ink} strokeWidth={sw} />
    <path d="M14 92 L110 34 L206 92 Z" fill={C.orange} stroke={C.ink} strokeWidth={sw} strokeLinejoin="round" />
    <line x1="110" y1="34" x2="110" y2="6" stroke={C.ink} strokeWidth={sw} />
    <path d="M110 8 h34 l-8 9 l8 9 h-34 z" fill={C.red} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
    <rect x="62" y="98" width="96" height="34" rx="6" fill={C.yellow} stroke={C.ink} strokeWidth={sw} />
    <text x="110" y="125" textAnchor="middle" fontFamily={HEAD} fontSize="26">POS</text>
    {[44, 150].map((x) => (
      <rect key={x} x={x} y="144" width="26" height="48" fill={C.blue} stroke={C.ink} strokeWidth={sw} />
    ))}
    <rect x="92" y="144" width="36" height="48" fill={C.pink} stroke={C.ink} strokeWidth={sw} />
  </svg>
);

export const Envelope: React.FC<{ w?: number; bg?: string; label?: string }> = ({ w = 150, bg = C.white, label }) => (
  <div style={{ position: 'relative', width: w, height: w * 0.66 }}>
    <svg width={w} height={w * 0.66} viewBox="0 0 150 100" style={{ filter: `drop-shadow(6px 6px 0 ${C.ink})` }}>
      <rect x="4" y="4" width="142" height="92" rx="8" fill={bg} stroke={C.ink} strokeWidth={6} />
      <path d="M6 8 L75 58 L144 8" fill="none" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    </svg>
    {label && (
      <div style={{ position: 'absolute', left: '50%', bottom: -14, transform: 'translateX(-50%) rotate(-4deg)', background: C.yellow, border: `4px solid ${C.ink}`, borderRadius: 8, padding: '0 10px', fontFamily: HEAD, fontSize: w * 0.15, whiteSpace: 'nowrap' }}>
        {label}
      </div>
    )}
  </div>
);

/** luggage-tag style address label = the FCM token */
export const AddressTag: React.FC<{ scale?: number; text?: string }> = ({ scale = 1, text = '#fGx9-Q2' }) => (
  <div style={{ transform: `scale(${scale})`, display: 'flex', alignItems: 'center' }}>
    <div style={{ width: 0, height: 0, borderTop: '46px solid transparent', borderBottom: '46px solid transparent', borderRight: `40px solid ${C.ink}`, marginRight: -4 }} />
    <div style={{ background: C.yellow, border: `6px solid ${C.ink}`, borderRadius: '0 16px 16px 0', boxShadow: shadow(8), padding: '8px 22px 8px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `5px solid ${C.ink}`, background: C.bg }} />
      <div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 20, lineHeight: 1 }}>ALAMAT (TOKEN)</div>
        <div style={{ fontFamily: HEAD, fontSize: 36, lineHeight: 1.1 }}>{text}</div>
      </div>
    </div>
  </div>
);

export const Truck: React.FC<{ w?: number; wheel?: number }> = ({ w = 200, wheel = 0 }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 200 140" style={{ overflow: 'visible' }}>
    <rect x="8" y="20" width="120" height="84" rx="8" fill={C.white} stroke={C.ink} strokeWidth={sw} />
    <path d="M128 50 h36 l26 28 v26 h-62 z" fill={C.orange} stroke={C.ink} strokeWidth={sw} strokeLinejoin="round" />
    <rect x="142" y="58" width="20" height="18" fill={C.blue} stroke={C.ink} strokeWidth={4} />
    <rect x="30" y="38" width="76" height="48" rx="4" fill={C.yellow} stroke={C.ink} strokeWidth={5} />
    <path d="M32 40 L68 66 L104 40" fill="none" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    {[46, 156].map((cx) => (
      <g key={cx} transform={`rotate(${wheel} ${cx} 110)`}>
        <circle cx={cx} cy="110" r="20" fill={C.ink} />
        <circle cx={cx} cy="110" r="8" fill={C.white} />
        <rect x={cx - 2} y="92" width="4" height="10" fill={C.white} />
      </g>
    ))}
  </svg>
);

export const Bolt: React.FC<{ size?: number }> = ({ size = 70 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M23 2 L6 23 h12 l-3 15 L34 15 H21 z" fill={C.yellow} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
  </svg>
);

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

/** dashed "road" between two points (straight) */
export const Road: React.FC<{ x1: number; y1: number; x2: number; y2: number; progress?: number; color?: string; width?: number; dashed?: boolean }> = ({
  x1, y1, x2, y2, progress = 1, color = C.ink, width = 10, dashed = true,
}) => {
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * progress} y2={y1 + (y2 - y1) * progress} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? '4 26' : undefined} />
    </svg>
  );
};
