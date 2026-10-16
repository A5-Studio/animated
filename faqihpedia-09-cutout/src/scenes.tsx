import React from 'react';
import { At, Giant, Kinetic, Pill, Tick, ease, glow, lin, pop } from './components';
import { C, FONT, s } from './theme';

/*
 * Every scene is drawn on the full 1080x1920 frame in two layers:
 *  Back  - behind the cut-out person (giant type, glows)
 *  Front - in front of them (titles, the scale, chips)
 * Both get the ABSOLUTE frame, so beats line up with transcript seconds.
 * `pose` is where the person stands: scaled from the bottom center.
 */
type P = { f: number };
const at = (f: number, sec: number, k = 170) => pop(f, s(sec), k);
const wobble = (f: number, amp = 6, speed = 0.08) => Math.sin(f * speed) * amp;

/* ------------------------------------------------------------------ */
/* the neon 0-100 scale                                                */
/* ------------------------------------------------------------------ */
const BX = 110;
const BW = 860;
const xAt = (v: number) => BX + (BW * v) / 100;

const Scale: React.FC<{ y: number; draw: number }> = ({ y, draw }) => (
  <>
    <div
      style={{
        position: 'absolute', left: BX, top: y - 13, width: BW * draw, height: 26, borderRadius: 13,
        background: `linear-gradient(90deg, ${C.red}, ${C.amber} ${50 / Math.max(draw, 0.01)}%, ${C.lime} ${100 / Math.max(draw, 0.01)}%)`,
        boxShadow: `0 0 24px ${C.amber}88`,
      }}
    />
    {Array.from({ length: 11 }, (_, i) => (
      <div key={i} style={{ position: 'absolute', left: xAt(i * 10) - 2, top: y + 22, width: 4, height: i % 5 ? 14 : 26, borderRadius: 2, background: C.dim, opacity: lin(draw, i / 10 - 0.02, i / 10 + 0.04) }} />
    ))}
    {[0, 50, 100].map((v) => (
      <At key={v} x={xAt(v)} y={y + 78} o={lin(draw, v / 100 - 0.03, v / 100 + 0.05)}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.dim }}>{v}</span>
      </At>
    ))}
  </>
);

const Marker: React.FC<{ v: number; y: number; c: string; ghost?: boolean; label?: string; s?: number; o?: number }> = ({
  v, y, c, ghost = false, label, s: sc = 1, o = 1,
}) => (
  <At x={xAt(v)} y={y} s={sc} o={o}>
    <div style={{ position: 'relative', width: 64, height: 64 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%', border: `6px ${ghost ? 'dashed' : 'solid'} ${c}`,
        background: ghost ? 'transparent' : C.bg, boxShadow: ghost ? 'none' : glow(c, 16),
      }} />
      {!ghost && <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', background: c }} />}
      {label && (
        <div style={{ position: 'absolute', left: '50%', bottom: 84, transform: 'translateX(-50%)' }}>
          <Pill c={c} size={34} solid>{label}</Pill>
        </div>
      )}
    </div>
  </At>
);

const scoreColor = (v: number) => (v > 62 ? C.lime : v < 38 ? C.red : C.amber);

/* ================================================================== */
/* 1. "semacam skala… pake basis garis" (16.4 - 25.3)                  */
/* ================================================================== */
const SkalaBack: React.FC<P> = ({ f }) => (
  <>
    {/* question marks drift around the head before the idea lands */}
    {Array.from({ length: 5 }, (_, i) => {
      const a = f * 0.03 + (i / 5) * Math.PI * 2;
      const o = lin(f, s(17.6 + i * 0.25), s(17.6 + i * 0.25) + 8) * (1 - lin(f, s(20.3), s(20.6)));
      return (
        <At key={i} x={540 + Math.cos(a) * 400} y={820 + Math.sin(a) * 160} s={0.8 + 0.4 * ((i * 7) % 3) / 2} o={o}>
          <Giant text="?" c={[C.cyan, C.pink, C.violet][i % 3]} size={150} />
        </At>
      );
    })}
    <At x={540} y={560} s={0.7 + 0.3 * at(f, 20.5, 120)} o={lin(f, s(20.5), s(20.5) + 6)}>
      <Giant text="SKALA" c={C.cyan} size={290} outline />
    </At>
  </>
);
const SkalaFront: React.FC<P> = ({ f }) => (
  <>
    <At x={540} y={200}>
      <Kinetic f={f} start={s(16.5)} text="Caraku *menilai* orang" c={C.cyan} size={72} />
    </At>
    <Scale y={760} draw={ease(f, s(22.3), s(23.4))} />
    <At x={540} y={345} s={at(f, 24.5, 220)} r={-2}>
      <Pill c={C.cyan} size={38}>Basisnya: sebuah garis</Pill>
    </At>
  </>
);

/* ================================================================== */
/* 2. 0 = really bad, 100 = really good, nobody is either (25.3-37.8)  */
/* ================================================================== */
const NolBack: React.FC<P> = ({ f }) => {
  const dim = 1 - 0.65 * lin(f, s(34.4), s(34.4) + 8);
  return (
    <>
      <At x={210} y={1020} s={at(f, 26.7, 140)} o={dim}>
        <Giant text="0" c={C.red} size={560} />
      </At>
      <At x={820} y={1020} s={at(f, 27.7, 140)} o={dim}>
        <Giant text="100" c={C.lime} size={290} />
      </At>
    </>
  );
};
const NolFront: React.FC<P> = ({ f }) => {
  const nope = at(f, 34.4, 260) * (1 - lin(f, s(35.9), s(35.9) + 6));
  return (
    <>
      <At x={540} y={190}>
        <Kinetic f={f} start={s(25.4)} text="Skala *0* sampai *100*" c={C.violet} size={72} />
      </At>
      <Scale y={360} draw={ease(f, s(25.5), s(26.5))} />
      <At x={230} y={550} s={at(f, 30.3, 220)} r={-3}>
        <Pill c={C.red} size={38}>Jahat banget</Pill>
      </At>
      <At x={850} y={550} s={at(f, 33.1, 220)} r={3}>
        <Pill c={C.lime} size={38}>Baik banget</Pill>
      </At>
      <At x={540 + wobble(f, 6 * nope, 1.3)} y={720} s={nope} r={-7}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.red, letterSpacing: -4, textShadow: `6px 0 ${C.cyan}, -6px 0 ${C.pink}, ${glow(C.red, 20)}` }}>
          NGGAK ADA!
        </div>
      </At>
      <At x={540} y={700} s={at(f, 36.1, 220)}>
        <Pill c={C.text} size={46} style={{ gap: 18 }}>
          Manusia itu
          <span style={{ background: 'linear-gradient(90deg, #222, #888 50%, #EEE)', color: C.text, borderRadius: 999, padding: '2px 22px', textShadow: '0 2px 8px #000' }}>kompleks</span>
        </Pill>
      </At>
    </>
  );
};

/* ================================================================== */
/* 3. Start at 50, slide with what they do (41.4 - 57.9)               */
/* ================================================================== */
const score = (f: number) => 50 + 35 * ease(f, s(50.0), s(52.9)) - 60 * ease(f, s(56.2), s(57.2));

const MulaiBack: React.FC<P> = ({ f }) => {
  const v = score(f);
  return (
    <At x={540} y={880} s={0.6 + 0.4 * at(f, 45.1, 120)} o={lin(f, s(45.1), s(45.1) + 6)}>
      <Giant text={String(Math.round(v))} c={scoreColor(v)} size={620} />
    </At>
  );
};
const MulaiFront: React.FC<P> = ({ f }) => {
  const v = score(f);
  const drop = ease(f, s(42.4), s(42.9));
  return (
    <>
      <At x={540} y={190}>
        <Kinetic f={f} start={s(41.5)} text="Mulai dari *tengah*" c={C.amber} size={76} />
      </At>
      <Scale y={380} draw={ease(f, s(41.6), s(42.3))} />
      <Marker v={v} y={380 - 300 * (1 - drop)} c={scoreColor(v)} o={lin(f, s(42.4), s(42.4) + 3)} />
      <At x={790} y={560} s={at(f, 49.0, 220)} r={2}>
        <Pill c={C.lime} size={38}>+ Berbuat baik  →</Pill>
      </At>
      <At x={290} y={560} s={at(f, 54.2, 220)} r={-2}>
        <Pill c={C.red} size={38}>←  − Berbuat jahat</Pill>
      </At>
    </>
  );
};

/* ================================================================== */
/* 4. New people: not too far right, not too far left (61.9 - end)     */
/* ================================================================== */
const BaruBack: React.FC<P> = ({ f }) => (
  <At x={540} y={900} s={0.7 + 0.3 * at(f, 63.8, 120)} o={0.9 * lin(f, s(63.8), s(63.8) + 6)}>
    <Giant text="50" c={C.amber} size={620} outline />
  </At>
);
const BaruFront: React.FC<P> = ({ f }) => {
  const right = 50 + 25 * ease(f, s(67.4), s(68.5));
  const left = 50 - 25 * ease(f, s(74.1), s(75.1));
  const cards = [
    { at: 70.7, x: 790, text: 'Gampang percaya', r: 2 },
    { at: 76.4, x: 290, text: 'Jadi parnoan', r: -2 },
  ];
  return (
    <>
      <At x={540} y={190}>
        <Kinetic f={f} start={s(62.0)} text="Ketemu *orang baru?*" c={C.pink} size={76} />
      </At>
      <Scale y={380} draw={ease(f, s(62.1), s(62.8))} />
      <Marker v={right} y={380} c={C.lime} ghost o={lin(f, s(67.2), s(67.2) + 4)} />
      <Marker v={left} y={380} c={C.red} ghost o={lin(f, s(73.9), s(73.9) + 4)} />
      <Marker v={50} y={380} c={C.amber} s={at(f, 62.5)} />
      <At x={540} y={560} s={at(f, 63.8, 220)}>
        <Pill c={C.amber} size={42}><Tick size={44} />Taruh di 50 dulu</Pill>
      </At>
      {cards.map((c) => (
        <At key={c.x} x={c.x} y={700} s={at(f, c.at, 220)} r={c.r}>
          <Pill c={C.red} size={38}><Tick size={40} ok={false} />{c.text}</Pill>
        </At>
      ))}
    </>
  );
};

export type Pose = { k: number; x: number };
export const SCENES: { from: number; to: number; c: string; pose: Pose; Back: React.FC<P>; Front: React.FC<P> }[] = [
  { from: 16.4, to: 25.3, c: C.cyan, pose: { k: 0.7, x: 0 }, Back: SkalaBack, Front: SkalaFront },
  { from: 25.3, to: 37.8, c: C.violet, pose: { k: 0.64, x: 0 }, Back: NolBack, Front: NolFront },
  { from: 41.4, to: 57.9, c: C.amber, pose: { k: 0.64, x: 0 }, Back: MulaiBack, Front: MulaiFront },
  { from: 61.9, to: 78, c: C.pink, pose: { k: 0.62, x: 0 }, Back: BaruBack, Front: BaruFront },
];
