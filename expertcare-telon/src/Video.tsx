import React from 'react';
import { AbsoluteFill, Easing, Html5Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, FPS, SCENES, TOTAL, s } from './theme';

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
const pop = (f: number, start: number, stiffness = 180) =>
  spring({ frame: f - start, fps: FPS, config: { damping: 12, stiffness, mass: 0.7 } });
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
const lin = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const at = (f: number, sec: number, k = 180) => pop(f, s(sec), k);

const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; children: React.ReactNode }> = ({ x, y, s: sc = 1, r = 0, o = 1, children }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, opacity: o, transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${r}deg) scale(${sc})` }}>
    {children}
  </div>
);

/** visible inside [a, b) seconds, sliding up in and up out */
const Scene: React.FC<{ f: number; a: number; b: number; children: React.ReactNode }> = ({ f, a, b, children }) => {
  const from = s(a);
  const to = s(b);
  if (f < from || f >= to + 8) return null;
  const inP = ease(f, from, from + 10);
  const outP = b >= SCENES.end ? 0 : ease(f, to - 2, to + 8);
  return (
    <AbsoluteFill style={{ opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 60 - outP * 60}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/** words rise in one by one; "*word*" gets the gold highlight */
const Words: React.FC<{ f: number; start: number; text: string; size?: number; color?: string }> = ({ f, start, text, size = 84, color = C.white }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.26}px`, maxWidth: 940, fontFamily: FONT, fontWeight: 850, fontSize: size, lineHeight: 1.12, letterSpacing: -1.5, textAlign: 'center' }}>
    {text.split(' ').map((w, i) => {
      const hot = w.startsWith('*');
      const p = pop(f, start + i * 3, 210);
      return (
        <span key={i} style={{ display: 'inline-block', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 40}px)`, color: hot ? C.gold : color, textShadow: '0 6px 24px rgba(40,25,80,0.35)' }}>
          {w.replace(/\*/g, '')}
        </span>
      );
    })}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.cream, borderRadius: 32, boxShadow: '0 18px 40px rgba(40,25,80,0.28)', color: C.ink, fontFamily: FONT, ...style }}>{children}</div>
);

const Leaf: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = C.green }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ flex: 'none' }}>
    <circle cx="20" cy="20" r="20" fill={`${color}22`} />
    <path d="M11 28 C11 16 20 10 30 10 C30 20 24 29 11 28 Z" fill={color} />
    <path d="M12 27 L25 15" stroke={C.cream} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const Check: React.FC<{ size?: number }> = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ flex: 'none' }}>
    <circle cx="20" cy="20" r="19" fill={C.green} />
    <path d="M11 21 L17 27 L29 14" fill="none" stroke={C.white} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* backdrop: lavender glow, drifting bokeh and herb sprigs             */
/* ------------------------------------------------------------------ */
const Backdrop: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 45%, ${C.lavLight}, ${C.lav} 55%, ${C.lavDeep})`, overflow: 'hidden' }}>
    {Array.from({ length: 14 }, (_, i) => {
      const r = 40 + ((i * 37) % 90);
      const x = (i * 263) % 1080;
      const y = 1920 - ((f * (0.5 + (i % 4) * 0.2) + i * 173) % 2200);
      return <div key={i} style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: C.white, opacity: 0.06 + (i % 3) * 0.02, filter: 'blur(2px)' }} />;
    })}
    {Array.from({ length: 6 }, (_, i) => {
      const x = 80 + ((i * 331) % 920);
      const y = 1980 - ((f * 0.9 + i * 360) % 2200);
      return (
        <div key={`l${i}`} style={{ position: 'absolute', left: x, top: y, opacity: 0.35, transform: `rotate(${Math.sin((f + i * 40) * 0.03) * 25 + i * 50}deg)` }}>
          <Leaf size={70} color={C.cream} />
        </div>
      );
    })}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* the tube travels between scenes                                     */
/* ------------------------------------------------------------------ */
type Pose = { x: number; y: number; k: number; r: number; o: number };
const TUBE_POSES: [number, Pose][] = [
  [SCENES.hook, { x: 540, y: 2400, k: 1.3, r: 8, o: 1 }],
  [SCENES.reveal, { x: 540, y: 1000, k: 1.35, r: -3, o: 1 }],
  [SCENES.ingredients, { x: 235, y: 1010, k: 1.0, r: -4, o: 1 }],
  [SCENES.benefits, { x: 1400, y: 1000, k: 0.9, r: 12, o: 1 }],
  [SCENES.cta, { x: 540, y: 840, k: 1.2, r: 0, o: 1 }],
];
const tubeAt = (f: number): Pose => {
  let i = 0;
  while (i + 1 < TUBE_POSES.length && f >= s(TUBE_POSES[i + 1][0])) i++;
  const cur = TUBE_POSES[i][1];
  if (i === 0) return cur;
  const prev = TUBE_POSES[i - 1][1];
  const start = s(TUBE_POSES[i][0]);
  const t = i === 1 ? pop(f, start, 90) : ease(f, start, start + 18);
  const mix = (k: keyof Pose) => prev[k] + (cur[k] - prev[k]) * t;
  return { x: mix('x'), y: mix('y'), k: mix('k'), r: mix('r'), o: mix('o') };
};

const Tube: React.FC<{ f: number }> = ({ f }) => {
  const p = tubeAt(f);
  const bob = Math.sin(f * 0.07) * 10;
  const halo = 0.55 + 0.15 * Math.sin(f * 0.1);
  return (
    <At x={p.x} y={p.y + bob} s={p.k} r={p.r} o={p.o}>
      <div style={{ position: 'relative', width: 263, height: 577 }}>
        <div style={{ position: 'absolute', left: -200, top: -60, width: 663, height: 663, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,255,${halo}), transparent 65%)` }} />
        <div style={{ position: 'absolute', left: 20, right: 20, bottom: -26, height: 40, borderRadius: '50%', background: 'rgba(30,20,60,0.35)', filter: 'blur(10px)' }} />
        <Img src={staticFile('img/tube.png')} style={{ position: 'absolute', inset: 0, width: 263, height: 577 }} />
      </div>
    </At>
  );
};

/* ------------------------------------------------------------------ */
/* scenes                                                              */
/* ------------------------------------------------------------------ */
const WorriedBaby: React.FC<{ f: number }> = ({ f }) => (
  <svg width={320} height={320} viewBox="0 0 200 200" style={{ transform: `rotate(${Math.sin(f * 0.25) * 4}deg)` }}>
    <circle cx="100" cy="100" r="80" fill="#F6D2B4" stroke={C.ink} strokeWidth={5} />
    <path d="M92 22 q8 -14 18 -2" fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
    <path d="M58 82 l22 6 M142 82 l-22 6" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
    <circle cx="72" cy="100" r="7" fill={C.ink} />
    <circle cx="128" cy="100" r="7" fill={C.ink} />
    <path d="M78 140 q22 -18 44 0" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    <circle cx="56" cy="122" r="11" fill={C.red} opacity={0.35} />
    <circle cx="144" cy="122" r="11" fill={C.red} opacity={0.35} />
    <path d="M150 104 q6 12 0 18 q-6 -6 0 -18" fill="#7FC8F2" opacity={0.5 + 0.5 * Math.sin(f * 0.2)} />
  </svg>
);

const Hook: React.FC<{ f: number }> = ({ f }) => (
  <>
    <At x={540} y={560}>
      <Words f={f} start={4} text="Si Kecil *rewel* karena perut *kembung?*" size={96} />
    </At>
    <At x={540} y={1060} s={at(f, 0.9, 140)}>
      <WorriedBaby f={f} />
    </At>
    {[0, 1, 2, 3, 4].map((i) => {
      const t = ((f - s(1.2) - i * 9) % 60) / 60;
      if (f < s(1.2) + i * 9) return null;
      return (
        <At key={i} x={540 + (i - 2) * 70 + Math.sin(t * 6 + i) * 20} y={1260 - t * 260} s={0.6 + t * 0.6} o={(1 - t) * 0.9}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', border: `5px solid ${C.cream}`, background: 'rgba(255,255,255,0.15)' }} />
        </At>
      );
    })}
  </>
);

const Reveal: React.FC<{ f: number }> = ({ f }) => (
  <>
    <At x={540} y={230}>
      <Words f={f} start={s(3.3)} text="Kenalan sama" size={52} color={C.cream} />
    </At>
    <At x={540} y={350}>
      <Words f={f} start={s(3.6)} text="Telon *Calming* Rub Cream" size={92} />
    </At>
    <At x={540} y={1520} s={at(f, 5.0, 200)}>
      <Card style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 32px', borderRadius: 999 }}>
        <svg width={52} height={52} viewBox="0 0 40 40">
          <rect x="1" y="1" width="38" height="38" rx="10" fill={C.lav} />
          <path d="M20 9 v22 M9 20 h22" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
        </svg>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.lav }}>Dikembangkan oleh</div>
          <div style={{ fontSize: 40, fontWeight: 850 }}>Dokter Anak & Kulit</div>
        </div>
      </Card>
    </At>
  </>
);

const INGREDIENTS = [
  { at: 8.3, name: 'Eucalyptus Oil, Menthol & Olive Oil', sub: '' },
  { at: 9.3, name: 'Fennel & Cajuput Oil', sub: 'aroma menghangatkan' },
  { at: 10.3, name: 'Colloidal Oatmeal & Ceramides', sub: 'lembapkan & sejukkan kulit' },
];
const Ingredients: React.FC<{ f: number }> = ({ f }) => (
  <>
    <At x={540} y={300}>
      <Words f={f} start={s(7.7)} text="Kandungannya *lembut*" size={84} />
    </At>
    {INGREDIENTS.map((it, i) => (
      <At key={i} x={700} y={720 + i * 250} s={at(f, it.at, 200)} r={i % 2 ? 1 : -1}>
        <Card style={{ width: 560, display: 'flex', alignItems: 'center', gap: 22, padding: '26px 28px' }}>
          <Leaf size={64} />
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{it.name}</div>
            {it.sub && <div style={{ fontSize: 28, fontWeight: 600, color: C.green, marginTop: 6 }}>{it.sub}</div>}
          </div>
        </Card>
      </At>
    ))}
  </>
);

const BENEFITS = [
  { at: 13.0, t: 'Badan terasa hangat' },
  { at: 13.8, t: 'Bantu redakan kembung' },
  { at: 14.6, t: 'Lembapkan & sejukkan kulit' },
  { at: 15.4, t: 'Aroma yang menenangkan' },
];
const Benefits: React.FC<{ f: number }> = ({ f }) => (
  <>
    <At x={540} y={330}>
      <Words f={f} start={s(12.3)} text="Manfaatnya buat *Si* *Kecil*" size={84} />
    </At>
    <At x={540} y={960} s={at(f, 12.6, 160)}>
      <Card style={{ width: 900, padding: '44px 48px', display: 'flex', flexDirection: 'column', gap: 34 }}>
        {BENEFITS.map((b) => {
          const p = at(f, b.at, 220);
          return (
            <div key={b.t} style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 46, fontWeight: 750, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -40}px)` }}>
              <Check size={62} />
              {b.t}
            </div>
          );
        })}
      </Card>
    </At>
  </>
);

const STEPS = [
  { at: 17.4, n: 1, t: 'Usapkan merata di leher, perut, atau punggung', warn: false },
  { at: 18.5, n: 2, t: 'Usapkan juga di telapak kaki', warn: false },
  { at: 19.6, n: 3, t: 'Hindari area mata & mulut', warn: true },
];
const HowTo: React.FC<{ f: number }> = ({ f }) => (
  <>
    <At x={540} y={330}>
      <Words f={f} start={s(16.9)} text="Cara *pakainya*" size={92} />
    </At>
    {STEPS.map((st, i) => (
      <At key={i} x={540} y={700 + i * 270} s={at(f, st.at, 200)}>
        <Card style={{ width: 900, display: 'flex', alignItems: 'center', gap: 28, padding: '30px 34px', background: st.warn ? '#FFE9E4' : C.cream }}>
          <div style={{ flex: 'none', width: 84, height: 84, borderRadius: '50%', background: st.warn ? C.red : C.lav, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, fontWeight: 900 }}>
            {st.warn ? '!' : st.n}
          </div>
          <div style={{ fontSize: 42, fontWeight: 750, lineHeight: 1.2 }}>{st.t}</div>
        </Card>
      </At>
    ))}
  </>
);

const BADGES = ['Usia 0+', 'Dermatologically Tested', 'Halal', '50 g'];
const Cta: React.FC<{ f: number }> = ({ f }) => {
  const pulse = 1 + 0.04 * Math.sin((f - s(22.0)) * 0.25) * lin(f, s(22.0), s(22.3));
  return (
    <>
      <At x={540} y={250}>
        <Words f={f} start={s(20.9)} text="Hangat, nyaman, *tidur* *nyenyak*" size={78} />
      </At>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1250, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18 }}>
        {BADGES.map((b, i) => (
          <div key={b} style={{ transform: `scale(${at(f, 21.3 + i * 0.15, 220)})` }}>
            <div style={{ fontFamily: FONT, fontWeight: 750, fontSize: 32, color: C.white, padding: '12px 26px', borderRadius: 999, border: `3px solid ${C.cream}`, background: 'rgba(255,255,255,0.12)' }}>{b}</div>
          </div>
        ))}
      </div>
      <At x={540} y={1470} s={at(f, 22.0, 160) * pulse}>
        <div style={{ fontFamily: FONT, textAlign: 'center', background: C.gold, color: C.ink, borderRadius: 40, padding: '24px 48px', boxShadow: '0 16px 40px rgba(40,25,80,0.35)' }}>
          <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -1 }}>Klik produk di bawah ↓</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>Cek voucher-nya sekarang!</div>
        </div>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* sound                                                               */
/* ------------------------------------------------------------------ */
type Kind = 'pop' | 'whoosh' | 'ding' | 'tick';
const VOL: Record<Kind, number> = { pop: 0.18, whoosh: 0.22, ding: 0.2, tick: 0.12 };
const CUES: [number, Kind][] = [
  ...[SCENES.reveal, SCENES.ingredients, SCENES.benefits, SCENES.howto, SCENES.cta].map((t) => [t - 0.1, 'whoosh'] as [number, Kind]),
  ...[0.9, 5.0, ...INGREDIENTS.map((i) => i.at), ...STEPS.map((x) => x.at)].map((t) => [t, 'pop'] as [number, Kind]),
  ...BENEFITS.map((b) => [b.at, 'tick'] as [number, Kind]),
  ...[3.6, 22.0].map((t) => [t, 'ding'] as [number, Kind]),
];

export const ExpertCareTelon: React.FC = () => {
  const f = useCurrentFrame();
  const sc = SCENES;
  return (
    <AbsoluteFill style={{ opacity: 1 - lin(f, TOTAL - 10, TOTAL) }}>
      <Backdrop f={f} />
      <Tube f={f} />
      <Scene f={f} a={sc.hook} b={sc.reveal}><Hook f={f} /></Scene>
      <Scene f={f} a={sc.reveal} b={sc.ingredients}><Reveal f={f} /></Scene>
      <Scene f={f} a={sc.ingredients} b={sc.benefits}><Ingredients f={f} /></Scene>
      <Scene f={f} a={sc.benefits} b={sc.howto}><Benefits f={f} /></Scene>
      <Scene f={f} a={sc.howto} b={sc.cta}><HowTo f={f} /></Scene>
      <Scene f={f} a={sc.cta} b={sc.end}><Cta f={f} /></Scene>
      <Html5Audio src={staticFile('music.wav')} volume={0.45} />
      {CUES.map(([t, kind], i) => (
        <Sequence key={i} from={Math.max(0, s(t))} durationInFrames={30} layout="none">
          <Html5Audio src={staticFile(`sfx/${kind}.wav`)} volume={VOL[kind]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
