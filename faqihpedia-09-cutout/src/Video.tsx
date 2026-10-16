import React from 'react';
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { At, Kinetic, ease, glow, lin, pop } from './components';
import { Pose, SCENES } from './scenes';
import { Sfx } from './sfx';
import { C, FONT, LAYOUT, POSE, SCAN, TOTAL, ZOOMS, s } from './theme';

/** where the face sits in the 1080x1920 source; zooms center here */
const FACE = { x: 560, y: 720 };
const FULL: Pose = { k: 1, x: 0 };

/* ------------------------------------------------------------------ */
/* timeline maths                                                      */
/* ------------------------------------------------------------------ */
const layoutIndex = (f: number) => {
  let i = 0;
  while (i + 1 < LAYOUT.length && f >= s(LAYOUT[i + 1][0])) i++;
  return i;
};

/**
 * Scan line position, 0..1 top to bottom, and which way it is going.
 * Into a cut scene the line sweeps the room away top-down; back to full it
 * paints the room back in the same direction.
 */
const scanAt = (f: number): { p: number; into: boolean } | null => {
  const i = layoutIndex(f);
  if (i === 0) return null;
  const into = LAYOUT[i][1] === 'cut';
  // going back to full, the person grows back first, then the room returns
  const start = s(LAYOUT[i][0]) + (into ? 0 : POSE);
  if (f > start + SCAN) return null;
  return { p: ease(f, start, start + SCAN), into };
};

/** how much of the room is gone: 0 = original frame, 1 = person only */
const cutAt = (f: number) => {
  const i = layoutIndex(f);
  const sc = scanAt(f);
  if (sc) return sc.into ? sc.p : 1 - sc.p;
  return LAYOUT[i][1] === 'cut' ? 1 : 0;
};

const poseOf = (f: number): Pose => {
  const live = SCENES.filter((sc) => f >= s(sc.from) && f < s(sc.to));
  return live.length && LAYOUT[layoutIndex(f)][1] === 'cut' ? live[live.length - 1].pose : FULL;
};

/** pose eased between changes; into a scene it waits for the scan */
const poseAt = (f: number): Pose => {
  const marks = [0, ...LAYOUT.slice(1).map(([t]) => s(t)), ...SCENES.map((sc) => s(sc.from))].sort((a, b) => a - b);
  let m = 0;
  for (const t of marks) if (f >= t) m = t;
  const cur = poseOf(f);
  const prev = poseOf(m - 1);
  const delay = cur.k < prev.k && prev.k === 1 ? SCAN - 2 : 0;
  const t = ease(f, m + delay, m + delay + POSE);
  return { k: prev.k + (cur.k - prev.k) * t, x: prev.x + (cur.x - prev.x) * t };
};

const zoomAt = (f: number) => {
  let z = 1;
  for (const [a, b, k] of ZOOMS) {
    const from = s(a);
    const to = s(b);
    if (f < from || f > to + 10) continue;
    const zin = interpolate(f, [from, from + 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    const zout = ease(f, to, to + 10);
    z = Math.max(z, 1 + (k - 1 + 0.03 * lin(f, from, to)) * zin * (1 - zout));
  }
  return z;
};

/* ------------------------------------------------------------------ */
/* layers                                                              */
/* ------------------------------------------------------------------ */
const sceneWeight = (f: number, from: number, to: number) => lin(f, s(from), s(from) + 8) * (1 - lin(f, s(to), s(to) + 8));

/** dark room: accent glow behind the person, perspective floor grid, dust */
const Backdrop: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
    {SCENES.map((sc, i) => {
      const w = sceneWeight(f, sc.from, sc.to);
      if (w <= 0) return null;
      return (
        <AbsoluteFill key={i} style={{ opacity: w }}>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 45% at 50% 62%, ${sc.c}55, transparent 70%)` }} />
          <div
            style={{
              position: 'absolute', left: -540, right: -540, top: 1180, height: 1400,
              transform: 'perspective(700px) rotateX(62deg)', transformOrigin: '50% 0',
              backgroundImage: `linear-gradient(${sc.c}55 2px, transparent 2px), linear-gradient(90deg, ${sc.c}55 2px, transparent 2px)`,
              backgroundSize: '90px 90px', backgroundPosition: `0 ${(f * 2) % 90}px`,
              maskImage: 'linear-gradient(transparent, black 30%)',
            }}
          />
        </AbsoluteFill>
      );
    })}
    {Array.from({ length: 26 }, (_, i) => {
      const x = (i * 397) % 1080;
      const y = 1920 - ((f * (0.6 + (i % 5) * 0.25) + i * 211) % 2100);
      return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: '50%', background: C.text, opacity: 0.18 }} />;
    })}
  </AbsoluteFill>
);

const Layers: React.FC<{ f: number; which: 'Back' | 'Front' }> = ({ f, which }) => (
  <>
    {SCENES.map((sc, i) => {
      const w = sceneWeight(f, sc.from, sc.to) * cutAt(f);
      if (w <= 0.001) return null;
      const L = sc[which];
      return (
        <AbsoluteFill key={i} style={{ opacity: w }}>
          <L f={f} />
        </AbsoluteFill>
      );
    })}
  </>
);

/** the original frame and the cut-out person, stacked in the same spot */
const Person: React.FC<{ f: number }> = ({ f }) => {
  const cut = cutAt(f);
  const sc = scanAt(f);
  const pose = poseAt(f);
  const z = 1 + (zoomAt(f) - 1) * (1 - cut);
  const accent = SCENES.find((x) => f >= s(x.from) - 1 && f < s(x.to) + 10)?.c ?? C.cyan;
  // room is visible only below the line while sweeping away, above it while coming back
  const clip = sc ? (sc.into ? `inset(${sc.p * 100}% 0 0 0)` : `inset(0 0 ${(1 - sc.p) * 100}% 0)`) : cut > 0.5 ? 'inset(100% 0 0 0)' : 'none';
  const media: React.CSSProperties = { position: 'absolute', inset: 0, width: 1080, height: 1920, transform: `scale(${z})`, transformOrigin: `${FACE.x}px ${FACE.y}px` };
  return (
    <AbsoluteFill style={{ transform: `translateX(${pose.x}px) scale(${pose.k})`, transformOrigin: '50% 100%' }}>
      {cut > 0 && (
        <OffthreadVideo src={staticFile('person.webm')} transparent muted style={{ ...media, filter: `drop-shadow(0 0 ${10 + 14 * cut}px ${accent}AA)` }} />
      )}
      <OffthreadVideo src={staticFile('source.mp4')} style={{ ...media, clipPath: clip }} />
      {sc && sc.p > 0 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: `${sc.p * 100}%`, height: 6, marginTop: -3, background: C.text, boxShadow: glow(accent, 22) }} />
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* headlines over the full-frame talking head (kept above the face)    */
/* ------------------------------------------------------------------ */
const HEADS: { a: number; b: number; text: string; c: string }[] = [
  { a: 0.3, b: 3.1, text: 'Gampang *ketipu?*', c: C.pink },
  { a: 3.9, b: 6.3, text: 'Konsep *menilai* orang', c: C.cyan },
  { a: 7.8, b: 12.2, text: 'Asalnya? *Nggak tau*', c: C.amber },
  { a: 12.8, b: 16.4, text: 'Tau teorinya? *Komen!*', c: C.lime },
  { a: 38.6, b: 41.4, text: 'Caraku *menilai* orang', c: C.cyan },
  { a: 59.7, b: 61.9, text: 'Simpel, tapi *membantu*', c: C.lime },
];

const Headlines: React.FC<{ f: number }> = ({ f }) => (
  <>
    {HEADS.map((h, i) => {
      const from = s(h.a);
      const to = s(h.b);
      if (f < from || f > to) return null;
      const out = lin(f, to - 6, to);
      return (
        <At key={i} x={540} y={270} o={1 - out} s={1 - 0.08 * out}>
          <div style={{ background: 'rgba(10,14,31,0.55)', borderRadius: 28, padding: '14px 30px', boxShadow: `inset 0 0 0 3px ${h.c}88` }}>
            <Kinetic f={f} start={from} text={h.text} c={h.c} size={64} />
          </div>
        </At>
      );
    })}
  </>
);

const Badge: React.FC<{ f: number }> = ({ f }) => (
  <At x={540} y={90} s={pop(f, 4)}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: C.text, padding: '10px 26px', borderRadius: 999, background: 'rgba(10,14,31,0.6)', border: `2px solid ${C.cyan}`, boxShadow: glow(C.cyan, 10), whiteSpace: 'nowrap' }}>
      YANG PENTING NGOMONG <span style={{ color: C.cyan }}>#9</span>
    </div>
  </At>
);

export const Faqihpedia09Cutout: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: 1 - lin(f, TOTAL - 8, TOTAL) }}>
      <Backdrop f={f} />
      <Layers f={f} which="Back" />
      <Person f={f} />
      <Layers f={f} which="Front" />
      <Headlines f={f} />
      <Badge f={f} />
      <Sfx />
    </AbsoluteFill>
  );
};
