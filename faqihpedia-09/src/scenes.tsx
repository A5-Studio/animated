import React from 'react';
import { At, Box, Burst, Sticker, ease, lin, pop } from './components';
import { BODY, BORDER, C, HEAD, s, shadow } from './theme';

/*
 * Every scene draws on a 1000x880 stage and gets the ABSOLUTE frame, so
 * beats line up with the transcript seconds written next to them.
 */
type SceneProps = { f: number };
const P = (f: number, sec: number, k = 170) => pop(f, s(sec), k);
const wobble = (f: number, amp = 3, speed = 0.12) => Math.sin(f * speed) * amp;
const ink = C.ink;
const SW = BORDER;

/* ------------------------------------------------------------------ */
/* small drawings                                                      */
/* ------------------------------------------------------------------ */
type Face = 'happy' | 'sad' | 'worried' | 'flat';
const Eyes: React.FC<{ face: Face; cx: number; cy: number; gap?: number }> = ({ face, cx, cy, gap = 34 }) => (
  <g fill={ink}>
    <circle cx={cx - gap} cy={cy} r={9} />
    <circle cx={cx + gap} cy={cy} r={9} />
    {face === 'sad' && (
      <g stroke={ink} strokeWidth={5} strokeLinecap="round">
        <line x1={cx - gap - 16} y1={cy - 24} x2={cx - gap + 10} y2={cy - 30} />
        <line x1={cx + gap + 16} y1={cy - 24} x2={cx + gap - 10} y2={cy - 30} />
      </g>
    )}
  </g>
);
const Mouth: React.FC<{ face: Face; cx: number; cy: number }> = ({ face, cx, cy }) => {
  const d =
    face === 'happy' ? `M${cx - 24} ${cy} Q${cx} ${cy + 26} ${cx + 24} ${cy}`
    : face === 'sad' ? `M${cx - 24} ${cy + 14} Q${cx} ${cy - 12} ${cx + 24} ${cy + 14}`
    : face === 'worried' ? `M${cx - 22} ${cy + 6} q11 -10 22 0 q11 10 22 0`
    : `M${cx - 14} ${cy + 6} L${cx + 14} ${cy + 6}`;
  return <path d={d} fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />;
};

/** a simple round-headed person */
const Person: React.FC<{ color: string; size?: number; face?: Face }> = ({ color, size = 90, face = 'happy' }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{ overflow: 'visible' }}>
    <path d="M10 140 Q10 80 50 80 Q90 80 90 140 Z" fill={color} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={50} cy={44} r={30} fill="#F2C9A0" stroke={ink} strokeWidth={6} />
    <g transform="translate(50 44) scale(0.4) translate(-50 -40)">
      <Eyes face={face} cx={50} cy={30} gap={26} />
      <Mouth face={face} cx={50} cy={58} />
    </g>
  </svg>
);

const Check: React.FC<{ size?: number; ok?: boolean }> = ({ size = 44, ok = true }) => (
  <div style={{
    width: size, height: size, flex: 'none', borderRadius: 10, border: `5px solid ${ink}`, background: ok ? C.green : C.red,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: size * 0.6, color: ok ? ink : C.white,
  }}>
    {ok ? '✓' : '?'}
  </div>
);

const Stamp: React.FC<{ text: string; color?: string; size?: number }> = ({ text, color = C.red, size = 84 }) => (
  <div style={{
    fontFamily: HEAD, fontSize: size, color, border: `10px solid ${color}`, borderRadius: 18, padding: '4px 26px',
    background: `${C.white}E6`, letterSpacing: 2, whiteSpace: 'nowrap', textTransform: 'uppercase',
  }}>
    {text}
  </div>
);

const Title: React.FC<{ f: number; at: number; text: string; bg?: string; y?: number; size?: number; r?: number }> = ({
  f, at, text, bg = C.white, y = 90, size = 44, r = -2,
}) => (
  <At x={500} y={y} s={P(f, at)} r={r}>
    <Sticker bg={bg} size={size}>{text}</Sticker>
  </At>
);

/* ------------------------------------------------------------------ */
/* the 0-100 scale and the pin that sits on it                         */
/* ------------------------------------------------------------------ */
const BAR_X = 90;
const BAR_W = 820;
const BAR_H = 56;
/** stage x of a score on the scale */
const xAt = (v: number) => BAR_X + (BAR_W * v) / 100;

const Scale: React.FC<{ y: number; draw?: number; nums?: number; color?: number }> = ({ y, draw = 1, nums = 1, color = 1 }) => (
  <>
    <div
      style={{
        position: 'absolute', left: BAR_X, top: y, width: BAR_W, height: BAR_H, boxSizing: 'border-box',
        border: `${SW}px solid ${ink}`, borderRadius: BAR_H / 2, boxShadow: shadow(8), overflow: 'hidden',
        background: C.white, clipPath: `inset(-20px ${(1 - draw) * 100}% -20px -20px)`,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: color, background: `linear-gradient(90deg, ${C.red}, ${C.yellow} 50%, ${C.green})` }} />
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${(i + 1) * 10}%`, top: i === 4 ? 0 : 14, bottom: i === 4 ? 0 : 14, width: 4, marginLeft: -2, background: ink, opacity: 0.5 }} />
      ))}
    </div>
    {[0, 50, 100].map((v) => (
      <At key={v} x={xAt(v)} y={y + BAR_H + 34} o={nums * lin(draw, v / 100 - 0.05, v / 100 + 0.05)}>
        <span style={{ fontFamily: HEAD, fontSize: 38 }}>{v}</span>
      </At>
    ))}
  </>
);

const Cross: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible', filter: `drop-shadow(5px 5px 0 ${ink})` }}>
    <path d="M18 30 L30 18 L50 38 L70 18 L82 30 L62 50 L82 70 L70 82 L50 62 L30 82 L18 70 L38 50 Z" fill={C.red} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

/** map pin with a face; its tip is the bottom-center of the box */
const PIN_H = 150;
const Pin: React.FC<{ face: Face; color?: string; ghost?: boolean }> = ({ face, color = '#F2C9A0', ghost = false }) => (
  <svg width={110} height={PIN_H} viewBox="0 0 110 150" style={{ overflow: 'visible', opacity: ghost ? 0.55 : 1, filter: ghost ? 'none' : `drop-shadow(6px 6px 0 ${ink})` }}>
    <path d="M55 146 L22 82 A46 46 0 1 1 88 82 Z" fill={color} stroke={ink} strokeWidth={SW} strokeLinejoin="round" strokeDasharray={ghost ? '14 10' : undefined} />
    <g transform="translate(55 50) scale(0.62) translate(-50 -44)">
      <Eyes face={face} cx={50} cy={30} gap={24} />
      <Mouth face={face} cx={50} cy={58} />
    </g>
  </svg>
);
/** pin standing on a scale whose bar top is at y */
const PinAt: React.FC<{ v: number; y: number; s?: number; o?: number; children: React.ReactNode }> = ({ v, y, s: sc = 1, o = 1, children }) => (
  <At x={xAt(v)} y={y - PIN_H / 2 + 6} s={sc} o={o}>
    <div style={{ transformOrigin: '50% 100%' }}>{children}</div>
  </At>
);
const faceFor = (v: number): Face => (v > 62 ? 'happy' : v < 38 ? 'sad' : 'flat');

/* ================================================================== */
/* 1. People waiting to be placed on a line (16.4 - 25.3, split)       */
/* ================================================================== */
const Skala: React.FC<SceneProps> = ({ f }) => {
  const line = ease(f, s(22.3), s(23.3)); // "skalanya tuh pake basis garis"
  const place = ease(f, s(24.4), s(25.1)); // people drop onto the line
  const people = [
    { at: 17.5, x0: 230, x1: 200, color: C.red, face: 'sad' as Face },
    { at: 18.6, x0: 500, x1: 520, color: C.yellow, face: 'flat' as Face },
    { at: 18.8, x0: 770, x1: 820, color: C.green, face: 'happy' as Face },
  ];
  return (
    <>
      <Title f={f} at={16.5} text="Caraku menilai orang" bg={C.yellow} />
      <At x={500} y={205} s={P(f, 20.5, 220)} r={3}>
        <Sticker bg={C.white} size={40}>pakai semacam SKALA</Sticker>
      </At>
      {people.map((p, i) => (
        <At key={i} x={p.x0 + (p.x1 - p.x0) * place} y={420 + 115 * place + wobble(f + i * 13, 5 * (1 - place), 0.14)} s={P(f, p.at)}>
          <Person color={p.color} size={130} face={place > 0.5 ? p.face : 'flat'} />
        </At>
      ))}
      {people.map((p, i) => (
        <At key={`q${i}`} x={p.x0 + 70} y={300} s={P(f, 19.2 + i * 0.25, 220) * (1 - place)} r={wobble(f + i * 7, 10, 0.15)}>
          <span style={{ fontFamily: HEAD, fontSize: 60, color: [C.pink, C.white, C.yellow][i], WebkitTextStroke: `3px ${ink}` }}>?</span>
        </At>
      ))}
      <div
        style={{
          position: 'absolute', left: 90, top: 640, width: 820 * line, height: 18, background: ink, borderRadius: 9,
          boxShadow: `0 6px 0 ${C.white}`,
        }}
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 90 + i * 205 - 4, top: 620, width: 8, height: 58, background: ink, borderRadius: 4, opacity: lin(line, i / 4 - 0.01, i / 4 + 0.05) }} />
      ))}
      <At x={500} y={760} s={P(f, 24.5, 220)} r={-2}>
        <Sticker bg={C.orange} size={36}>Basisnya: garis</Sticker>
      </At>
    </>
  );
};

/* ================================================================== */
/* 2. 0 = really bad, 100 = really good (25.3 - 37.8, anim)            */
/* ================================================================== */
const NolSeratus: React.FC<SceneProps> = ({ f }) => {
  const draw = ease(f, s(25.4), s(26.4));
  const nobody = lin(f, s(34.4), s(34.4) + 8); // "gak ada yang kayak gitu"
  const stampOut = lin(f, s(35.9), s(35.9) + 6);
  const ends = [
    { at: 28.8, tag: 30.3, x: 210, color: C.red, face: 'sad' as Face, text: 'Jahat banget', bg: C.red, fg: C.white, r: -4 },
    { at: 31.2, tag: 33.1, x: 790, color: C.green, face: 'happy' as Face, text: 'Baik banget', bg: C.green, fg: ink, r: 4 },
  ];
  return (
    <>
      <Title f={f} at={25.4} text="Skala 0 sampai 100" bg={C.white} />
      <Scale y={250} draw={draw} />
      {/* the two ends light up as they are named */}
      {[{ at: 26.7, v: 0, bg: C.red }, { at: 27.7, v: 100, bg: C.green }].map((e) => (
        <At key={e.v} x={e.v ? 840 : 160} y={190} s={P(f, e.at, 240)} r={e.v ? 6 : -6}>
          <Sticker bg={e.bg} size={34} style={{ color: e.v ? ink : C.white }}>{e.v ? 'kanan' : 'kiri'}</Sticker>
        </At>
      ))}
      {ends.map((e) => (
        <React.Fragment key={e.x}>
          <At x={e.x} y={540} s={P(f, e.at)} o={1 - 0.6 * nobody}>
            <Person color={e.color} size={150} face={e.face} />
          </At>
          <At x={e.x} y={700} s={P(f, e.tag, 220)} r={e.r} o={1 - 0.6 * nobody}>
            <Sticker bg={e.bg} size={30} style={{ color: e.fg }}>{e.text}</Sticker>
          </At>
        </React.Fragment>
      ))}
      <At x={500} y={560} s={P(f, 34.4, 240) * (1 - stampOut)} r={-9}>
        <Stamp text="Nggak ada!" size={72} />
      </At>
      {/* people are grey, not black or white */}
      <At x={500} y={790} s={P(f, 36.1, 220)} r={-1}>
        <Box bg={C.white} pad="14px 28px" style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: HEAD, fontSize: 40, whiteSpace: 'nowrap' }}>
          <span>Manusia itu</span>
          <span style={{ background: `linear-gradient(90deg, #8A8A8A, #E6E6E6)`, color: ink, border: `${SW}px solid ${ink}`, borderRadius: 12, padding: '0 18px' }}>
            kompleks
          </span>
        </Box>
      </At>
    </>
  );
};

/* ================================================================== */
/* 3. Start at 50, slide with what they do (41.4 - 57.9, split)        */
/* ================================================================== */
const Mulai50: React.FC<SceneProps> = ({ f }) => {
  const Y = 430; // bar top
  const drop = ease(f, s(42.4), s(42.9)); // "di setengah"
  const v = 50 + 35 * ease(f, s(50.0), s(52.9)) - 60 * ease(f, s(56.2), s(57.2));
  return (
    <>
      <Title f={f} at={41.5} text="Mulai dari tengah" bg={C.yellow} />
      <Scale y={Y} draw={ease(f, s(41.6), s(42.3))} />
      <PinAt v={v} y={Y - 260 * (1 - drop)} o={lin(f, s(42.4), s(42.4) + 3)}>
        <Pin face={faceFor(v)} />
      </PinAt>
      {/* live score above the pin */}
      <At x={xAt(v)} y={Y - PIN_H - 50} s={P(f, 45.1, 220)}>
        <Box bg={v > 62 ? C.green : v < 38 ? C.red : C.white} pad="4px 18px" radius={12} sh={6} style={{ fontFamily: HEAD, fontSize: 40, color: v < 38 ? C.white : ink }}>
          {Math.round(v)}
        </Box>
      </At>
      {/* what moves the pin */}
      <At x={760} y={680} s={P(f, 49.0, 220)} r={3}>
        <Sticker bg={C.green} size={34}>+ Berbuat baik</Sticker>
      </At>
      <At x={740 + 30 * wobble(f, 1, 0.3)} y={770} s={P(f, 50.0, 220)} o={1 - lin(f, s(53.3), s(53.3) + 8)}>
        <span style={{ fontFamily: HEAD, fontSize: 56 }}>→ → →</span>
      </At>
      <At x={250} y={680} s={P(f, 54.2, 220)} r={-3}>
        <Sticker bg={C.red} size={34} style={{ color: C.white }}>− Berbuat jahat</Sticker>
      </At>
      <At x={260 - 30 * wobble(f, 1, 0.3)} y={770} s={P(f, 56.2, 220)}>
        <span style={{ fontFamily: HEAD, fontSize: 56 }}>← ← ←</span>
      </At>
    </>
  );
};

/* ================================================================== */
/* 4. New people: not too far right, not too far left (61.9 - end)     */
/* ================================================================== */
const OrangBaru: React.FC<SceneProps> = ({ f }) => {
  const Y = 330; // bar top
  const right = 50 + 25 * ease(f, s(67.4), s(68.5)); // "di agak kanan"
  const left = 50 - 25 * ease(f, s(74.1), s(75.1)); // "agak agak gini"
  const cards = [
    { at: 70.7, x: 760, v: right, text: 'Gampang percaya', show: 67.2, r: 3 },
    { at: 76.4, x: 240, v: left, text: 'Jadi parnoan', show: 73.9, r: -3 },
  ];
  return (
    <>
      <Title f={f} at={62.0} text="Ketemu orang baru?" bg={C.white} />
      <Scale y={Y} draw={ease(f, s(62.1), s(62.8))} />
      {/* ghosts that drift the wrong way */}
      {cards.map((c) => (
        <PinAt key={c.x} v={c.v} y={Y} o={lin(f, s(c.show), s(c.show) + 4)}>
          <Pin face={c.v > 50 ? 'happy' : 'worried'} ghost />
        </PinAt>
      ))}
      <PinAt v={50} y={Y} s={P(f, 62.5)}>
        <Pin face="flat" color={C.yellow} />
      </PinAt>
      <At x={500} y={530} s={P(f, 63.8, 220)} r={-2}>
        <Box bg={C.yellow} pad="10px 26px" radius={16} sh={8} style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: HEAD, fontSize: 40, whiteSpace: 'nowrap' }}>
          <Check size={44} />
          Taruh di 50 dulu
        </Box>
      </At>
      {cards.map((c) => (
        <React.Fragment key={`c${c.x}`}>
          <At x={c.x} y={700} s={P(f, c.at, 220)} r={c.r}>
            <Box bg={C.white} pad="12px 22px" radius={16} sh={8} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: HEAD, fontSize: 34, whiteSpace: 'nowrap' }}>
              {c.text}
            </Box>
          </At>
          <At x={c.x + 165} y={645} s={P(f, c.at + 0.4, 260)} r={-12}>
            <Cross size={96} />
          </At>
        </React.Fragment>
      ))}
    </>
  );
};

export const SCENES: { from: number; to: number; bg: string; C: React.FC<SceneProps> }[] = [
  { from: 16.4, to: 25.3, bg: C.blue, C: Skala },
  { from: 25.3, to: 37.8, bg: C.yellow, C: NolSeratus },
  { from: 41.4, to: 57.9, bg: C.green, C: Mulai50 },
  { from: 61.9, to: 80, bg: C.pink, C: OrangBaru },
];
