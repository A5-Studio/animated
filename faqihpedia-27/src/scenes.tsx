import React from 'react';
import { Img, staticFile } from 'remotion';
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
type Face = 'happy' | 'out' | 'sad' | 'worried';
const Eyes: React.FC<{ face: Face; cx: number; cy: number; gap?: number }> = ({ face, cx, cy, gap = 34 }) => {
  if (face === 'out')
    return (
      <g stroke={ink} strokeWidth={6} strokeLinecap="round">
        {[-1, 1].map((d) => (
          <g key={d} transform={`translate(${cx + d * gap} ${cy})`}>
            <line x1={-11} y1={-11} x2={11} y2={11} />
            <line x1={11} y1={-11} x2={-11} y2={11} />
          </g>
        ))}
      </g>
    );
  return (
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
};
const Mouth: React.FC<{ face: Face; cx: number; cy: number }> = ({ face, cx, cy }) => {
  const d =
    face === 'happy' ? `M${cx - 24} ${cy} Q${cx} ${cy + 26} ${cx + 24} ${cy}`
    : face === 'sad' ? `M${cx - 24} ${cy + 14} Q${cx} ${cy - 12} ${cx + 24} ${cy + 14}`
    : face === 'worried' ? `M${cx - 22} ${cy + 6} q11 -10 22 0 q11 10 22 0`
    : `M${cx - 14} ${cy + 6} L${cx + 14} ${cy + 6}`;
  return <path d={d} fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />;
};

/** a dream: a fluffy cloud with a face */
const Dream: React.FC<{ face: Face; color?: string; w?: number }> = ({ face, color = C.white, w = 320 }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 320 224" style={{ overflow: 'visible' }}>
    <path
      d="M70 190 C20 190 14 130 56 118 C44 70 104 44 134 80 C150 30 236 30 240 92 C292 84 312 150 270 180 C266 192 256 196 244 196 Z"
      fill={color} stroke={ink} strokeWidth={SW} strokeLinejoin="round"
    />
    <Eyes face={face} cx={160} cy={128} />
    <Mouth face={face} cx={160} cy={158} />
  </svg>
);

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

const Bulb: React.FC<{ on: number; size?: number }> = ({ on, size = 200 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{ overflow: 'visible' }}>
    {on > 0.01 &&
      Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const r1 = 110;
        const r2 = 110 + 40 * on;
        return (
          <line key={i} x1={100 + Math.cos(a) * r1} y1={95 + Math.sin(a) * r1} x2={100 + Math.cos(a) * r2} y2={95 + Math.sin(a) * r2}
            stroke={ink} strokeWidth={10} strokeLinecap="round" />
        );
      })}
    <path d="M100 10 C40 10 12 60 22 104 C30 140 64 156 66 190 L134 190 C136 156 170 140 178 104 C188 60 160 10 100 10 Z"
      fill={on > 0.5 ? C.yellow : C.white} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
    <rect x={64} y={190} width={72} height={46} rx={8} fill="#BDBDBD" stroke={ink} strokeWidth={SW} />
    <line x1={64} y1={212} x2={136} y2={212} stroke={ink} strokeWidth={5} />
  </svg>
);

const Flame: React.FC<{ size?: number; t: number }> = ({ size = 160, t }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 160 200" style={{ overflow: 'visible' }}>
    <path d={`M80 ${8 + Math.sin(t * 0.4) * 6} C120 60 150 90 140 140 C132 180 104 196 80 196 C56 196 26 182 20 142 C14 104 40 90 50 60 C60 90 70 96 80 100 C70 60 70 40 80 8 Z`}
      fill={C.orange} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
    <path d={`M80 ${100 + Math.sin(t * 0.5) * 5} C104 126 112 146 104 166 C98 182 62 182 56 166 C50 146 64 130 80 100 Z`}
      fill={C.yellow} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
  </svg>
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

/* ================================================================== */
/* 1. Pandji's quote (3.4 - 12.6, animation only)                      */
/* ================================================================== */
const Quote: React.FC<SceneProps> = ({ f }) => {
  const faint = ease(f, s(9.3), s(9.8)); // pingsan
  const wake = ease(f, s(10.1), s(10.6)); // bangun
  const regret = ease(f, s(11.6), s(12.0)); // penyesalan
  const face: Face = regret > 0.5 ? 'sad' : faint > 0.5 && wake < 0.5 ? 'out' : 'happy';
  const lying = faint * (1 - wake);
  const color = regret > 0.5 ? C.blue : C.white;
  return (
    <>
      <Title f={f} at={3.5} text="Quote · Pandji Pragiwaksono" bg={C.yellow} size={40} />
      {/* "jangan pernah bunuh" */}
      <At x={180} y={230} s={P(f, 5.5) * (1 - lin(f, s(7.2), s(7.5)))} r={-8}>
        <Sticker bg={C.red} size={42} style={{ color: C.white }}>Jangan dibunuh!</Sticker>
      </At>
      {/* "tidak bisa mati" */}
      <At x={820} y={240} s={P(f, 7.7) * (1 - lin(f, s(9.2), s(9.5)))} r={6}>
        <Sticker bg={C.green} size={40}>Nggak bisa mati</Sticker>
      </At>
      {/* timeline floor */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 700, height: 0, borderTop: `${SW}px solid ${ink}` }} />
      <At x={170} y={760} s={P(f, 3.8)}>
        <Sticker bg={C.white} size={30}>Sekarang</Sticker>
      </At>
      <At x={820} y={760} s={P(f, 10.3)}>
        <Sticker bg={C.purple} size={30}>Masa depan</Sticker>
      </At>
      {/* the dream walks from "now" to "the future" while it is out cold */}
      <At
        x={interpolate3(f, [s(4), s(9.6), s(10.4)], [330, 330, 700])}
        y={540 + lying * 70 + wobble(f, 6 * (1 - lying))}
        r={-82 * lying + wobble(f, 2 * (1 - lying), 0.2)}
        s={P(f, 4)}
      >
        <Dream face={face} color={color} w={400} />
      </At>
      {lying > 0.5 && (
        <At x={interpolate3(f, [s(9.6), s(10.4)], [430, 800])} y={420 - (f % 30)} o={1 - (f % 30) / 30}>
          <span style={{ fontFamily: HEAD, fontSize: 56 }}>z</span>
        </At>
      )}
      <At x={500} y={330} s={P(f, 11.7, 220)} r={-6}>
        <Burst size={330} color={C.pink} rot={f * 0.6}>
          <span style={{ fontSize: 44 }}>PENYESALAN</span>
        </Burst>
      </At>
    </>
  );
};

/** piecewise-linear interpolation, clamped */
function interpolate3(f: number, xs: number[], ys: number[]) {
  if (f <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) {
    if (f <= xs[i]) return ys[i - 1] + ((f - xs[i - 1]) / (xs[i] - xs[i - 1])) * (ys[i] - ys[i - 1]);
  }
  return ys[ys.length - 1];
}

/* ================================================================== */
/* 2. Curiosity stuck in the head for months (17.8 - 25.8, split)      */
/* ================================================================== */
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL'];
const Penasaran: React.FC<SceneProps> = ({ f }) => {
  const scared = f >= s(24.3);
  const nMonth = Math.min(MONTHS.length - 1, Math.max(0, Math.floor((f - s(20.5)) / 7)));
  return (
    <>
      <Title f={f} at={17.9} text="Rasa penasaran" bg={C.yellow} />
      {/* head with orbiting question marks */}
      <At x={330} y={500} s={P(f, 18.0)}>
        <Person color={C.pink} size={300} face={scared ? 'worried' : 'happy'} />
      </At>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = f * 0.07 + (i / 5) * Math.PI * 2;
        return (
          <At key={i} x={330 + Math.cos(a) * 190} y={380 + Math.sin(a) * 70} s={P(f, 18.3 + i * 0.25, 220)} r={wobble(f + i * 9, 12, 0.15)}>
            <span style={{ fontFamily: HEAD, fontSize: 70, color: [C.yellow, C.blue, C.green, C.orange, C.purple][i], WebkitTextStroke: `3px ${ink}` }}>?</span>
          </At>
        );
      })}
      {/* months flipping by */}
      <At x={760} y={420} s={P(f, 20.5)} r={4}>
        <Box bg={C.white} pad={0} radius={18} style={{ width: 260, textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ background: C.red, borderBottom: `${SW}px solid ${ink}`, fontFamily: HEAD, fontSize: 26, padding: 8, color: C.white }}>
            BERBULAN-BULAN
          </div>
          <div style={{ fontFamily: HEAD, fontSize: 96, padding: '18px 0' }}>{MONTHS[nMonth]}</div>
        </Box>
      </At>
      <At x={760} y={680} s={P(f, 23.4)} r={-4}>
        <Sticker bg={C.white} size={34}>Belum dimulai…</Sticker>
      </At>
      <At x={560} y={780} s={P(f, 24.3, 240)} r={5}>
        <Sticker bg={C.red} size={48} style={{ color: C.white }}>Takut!</Sticker>
      </At>
    </>
  );
};

/* ================================================================== */
/* 3. Not trying = regret later (25.8 - 33.0, split)                   */
/* ================================================================== */
const Nyesel: React.FC<SceneProps> = ({ f }) => {
  const nope = P(f, 27.2);
  const regret = P(f, 31.2, 220);
  return (
    <>
      <Title f={f} at={25.9} text="Kalau nggak mulai nyoba…" bg={C.white} />
      <At x={260} y={430} s={nope} r={-3}>
        <Box bg={C.white} pad="20px" style={{ width: 360, textAlign: 'center' }}>
          <Person color={C.blue} size={130} face="worried" />
          <div style={{ fontFamily: HEAD, fontSize: 36, marginTop: 10 }}>Sekarang</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>“nanti aja deh”</div>
        </Box>
      </At>
      <At x={500} y={430} s={P(f, 30.4)}>
        <svg width={90} height={70} viewBox="0 0 90 70"><path d="M6 35 H70 M48 10 L78 35 L48 60" fill="none" stroke={ink} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </At>
      <At x={745} y={430} s={P(f, 30.5)} r={3}>
        <Box bg={C.purple} pad="20px" style={{ width: 360, textAlign: 'center' }}>
          <Person color={C.blue} size={130} face="sad" />
          <div style={{ fontFamily: HEAD, fontSize: 36, marginTop: 10 }}>Nanti</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>“kok dulu nggak nyoba ya…”</div>
        </Box>
      </At>
      <At x={500} y={720} s={regret} r={-5}>
        <Stamp text="Nyesel!" />
      </At>
    </>
  );
};

/* ================================================================== */
/* 4. Small audience, small start (37.8 - 43.2, split)                 */
/* ================================================================== */
const Kecil: React.FC<SceneProps> = ({ f }) => {
  const bars = [14, 18, 12, 20, 16, 19, 15];
  const grow = ease(f, s(42.0), s(42.8));
  return (
    <>
      <Title f={f} at={37.9} text="Jumlah penonton" bg={C.white} />
      <At x={360} y={470} s={P(f, 38.2)}>
        <Box bg={C.white} pad="26px 30px" style={{ width: 560, height: 420 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 300, borderBottom: `${SW}px solid ${ink}`, borderLeft: `${SW}px solid ${ink}`, padding: '0 12px' }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex: 1, height: h * 5 * ease(f, s(38.5 + i * 0.12), s(38.9 + i * 0.12)), background: C.blue, border: `4px solid ${ink}`, borderBottom: 'none' }} />
            ))}
          </div>
          <div style={{ fontFamily: HEAD, fontSize: 30, textAlign: 'center', marginTop: 16 }}>gitu-gitu aja…</div>
        </Box>
      </At>
      {/* a seedling: starting small */}
      <At x={790} y={560} s={P(f, 41.3)}>
        <svg width={200} height={300} viewBox="0 0 200 300" style={{ overflow: 'visible' }}>
          <path d={`M100 230 L100 ${230 - 120 * (0.3 + 0.7 * grow)}`} stroke={ink} strokeWidth={8} />
          <g transform={`translate(100 ${230 - 120 * (0.3 + 0.7 * grow)}) scale(${0.5 + 0.5 * grow})`}>
            <path d="M0 0 C-60 -10 -80 -60 -70 -70 C-30 -70 -4 -40 0 0 Z" fill={C.green} stroke={ink} strokeWidth={6} />
            <path d="M0 0 C60 -10 80 -60 70 -70 C30 -70 4 -40 0 0 Z" fill={C.green} stroke={ink} strokeWidth={6} />
          </g>
          <path d="M40 220 L160 220 L145 290 L55 290 Z" fill={C.orange} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
        </svg>
      </At>
      <At x={790} y={790} s={P(f, 42.2)} r={-3}>
        <Sticker bg={C.yellow} size={30}>Mulai dari kecil</Sticker>
      </At>
    </>
  );
};

/* ================================================================== */
/* 5. "Ada yang bilang": 10 viewers fill your room (43.2 - 58.6, anim)  */
/* ================================================================== */
const PEOPLE = [C.pink, C.blue, C.green, C.orange, C.purple, C.yellow, C.red, C.blue, C.pink, C.green];
const Kamar: React.FC<SceneProps> = ({ f }) => {
  const cardOut = ease(f, s(51.0), s(51.5));
  const roomIn = P(f, 51.5);
  const n = Math.max(0, Math.min(10, Math.floor((f - s(52.2)) / 5) + 1));
  return (
    <>
      {/* part 1: the GJLS clip + "10 penonton" */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-1100 * cardOut}px)` }}>
        <Title f={f} at={44.7} text="Ada yang bilang…" bg={C.yellow} y={80} />
        <At x={500} y={400} s={P(f, 44.9)} r={-2}>
          <div style={{ border: `${SW}px solid ${ink}`, borderRadius: 22, boxShadow: shadow(12), overflow: 'hidden', background: C.white, width: 760 }}>
            <div style={{ width: 760, height: 422, overflow: 'hidden', position: 'relative', borderBottom: `${SW}px solid ${ink}` }}>
              <Img src={staticFile('gjls.png')} style={{ position: 'absolute', width: 760, left: 0, top: -332 * (760 / 924) }} />
            </div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, padding: '12px 20px' }}>GJLS Show × Anies Baswedan</div>
          </div>
        </At>
        <At x={500} y={720} s={P(f, 47.6)} r={2}>
          <Box bg={C.white} pad="14px 28px" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <span style={{ fontFamily: HEAD, fontSize: 40 }}>Penonton:</span>
            <span style={{ fontFamily: HEAD, fontSize: 90, background: C.yellow, border: `${SW}px solid ${ink}`, borderRadius: 16, padding: '0 22px', transform: `scale(${0.6 + 0.4 * P(f, 50.0, 240)})`, display: 'inline-block' }}>
              {f < s(50.0) ? 'dikit' : '10'}
            </span>
          </Box>
        </At>
      </div>
      {/* part 2: those 10 people in your room */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${1100 * (1 - cardOut)}px)` }}>
        <Title f={f} at={51.5} text="Kumpulin di kamar…" bg={C.white} y={80} />
        <At x={500} y={470} s={roomIn}>
          <svg width={720} height={560} viewBox="0 0 720 560" style={{ overflow: 'visible' }}>
            <path d="M20 200 L360 20 L700 200 L700 540 L20 540 Z" fill={C.bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
            <rect x={70} y={250} width={130} height={110} fill={C.blue} stroke={ink} strokeWidth={SW} />
            <line x1={135} y1={250} x2={135} y2={360} stroke={ink} strokeWidth={5} />
            <rect x={540} y={330} width={110} height={210} fill={C.orange} stroke={ink} strokeWidth={SW} />
          </svg>
        </At>
        {PEOPLE.slice(0, n).map((c, i) => {
          const row = i < 5 ? 0 : 1;
          const col = i % 5;
          const x = 230 + col * 135 + (row ? 60 : 0);
          const y = 470 + row * 150;
          return (
            <At key={i} x={x} y={y} s={pop(f, s(52.2) + i * 5, 260)} r={wobble(f + i * 7, 4, 0.25)}>
              <Person color={c} size={110} />
            </At>
          );
        })}
        <At x={500} y={420} s={P(f, 54.0, 240)} r={-8}>
          <Stamp text="Penuh!" />
        </At>
        <At x={820} y={180} s={P(f, 55.5, 220)} r={8}>
          <Flame t={f} size={130} />
        </At>
        <At x={500} y={800} s={P(f, 56.6, 220)} r={-2}>
          <Sticker bg={C.orange} size={46}>Bikin semangat lanjut!</Sticker>
        </At>
      </div>
    </>
  );
};

/* ================================================================== */
/* 6. Reasons to quit pile up (62.2 - 71.2, split)                     */
/* ================================================================== */
const REASONS: { at: number; text: string; bg: string; x: number; r: number }[] = [
  { at: 63.4, text: 'Umur 30 lebih', bg: C.pink, x: 360, r: -5 },
  { at: 64.8, text: 'Ngapain mulai?', bg: C.blue, x: 620, r: 4 },
  { at: 66.9, text: 'Udah kerja', bg: C.green, x: 330, r: 3 },
  { at: 68.3, text: 'Pulang malam', bg: C.purple, x: 640, r: -4 },
  { at: 69.7, text: 'Capek!', bg: C.red, x: 480, r: -2 },
];
const Alasan: React.FC<SceneProps> = ({ f }) => (
  <>
    <Title f={f} at={62.3} text="Alasan buat berhenti" bg={C.white} />
    {REASONS.map((r, i) => {
      const p = P(f, r.at, 200);
      return (
        <At key={i} x={r.x} y={780 - i * 125 - 180 * (1 - p)} s={p} r={r.r}>
          <Box bg={r.bg} pad="18px 34px" style={{ fontFamily: HEAD, fontSize: 52, whiteSpace: 'nowrap', color: r.bg === C.red ? C.white : ink }}>
            {r.text}
          </Box>
        </At>
      );
    })}
  </>
);

/* ================================================================== */
/* 7. Still fun: day 27 of 30 (74.2 - 82.8, anim)                      */
/* ================================================================== */
const Progress: React.FC<SceneProps> = ({ f }) => {
  const done = Math.round(27 * ease(f, s(77.6), s(80.2)));
  const left = f >= s(81.1);
  return (
    <>
      <At x={290} y={90} s={P(f, 75.2)} r={-4}>
        <Sticker bg={C.yellow} size={40}>Masih seru</Sticker>
      </At>
      <At x={700} y={90} s={P(f, 76.6)} r={4}>
        <Sticker bg={C.pink} size={40}>Masih semangat</Sticker>
      </At>
      <div style={{ position: 'absolute', left: 95, top: 180, width: 810, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const isDone = i < done;
          const isLeft = left && i >= 27;
          const pulse = isLeft ? 1 + 0.08 * Math.sin((f - s(81.1)) * 0.35 + i) : 1;
          return (
            <div key={i} style={{
              height: 92, border: `5px solid ${ink}`, borderRadius: 14, background: isDone ? C.green : isLeft ? C.yellow : C.white,
              boxShadow: shadow(isDone ? 2 : 6), transform: `scale(${pulse * (0.6 + 0.4 * P(f, 74.3 + i * 0.03, 240))})`,
              fontFamily: HEAD, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isDone ? <svg width={44} height={44} viewBox="0 0 44 44"><path d="M6 24 L18 35 L38 9" fill="none" stroke={ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></svg> : i + 1}
            </div>
          );
        })}
      </div>
      <At x={330} y={780} s={P(f, 78.4)} r={-3}>
        <Box bg={C.ink} pad="12px 30px" style={{ fontFamily: HEAD, fontSize: 60, color: C.white, boxShadow: `10px 10px 0 ${C.green}` }}>
          HARI KE-{Math.max(1, done)}
        </Box>
      </At>
      <At x={760} y={780} s={P(f, 81.1, 240)} r={4}>
        <Sticker bg={C.yellow} size={46}>Tinggal 3!</Sticker>
      </At>
    </>
  );
};

/* ================================================================== */
/* 8. New ideas after day 30 (82.8 - end, split)                        */
/* ================================================================== */
const Konsep: React.FC<SceneProps> = ({ f }) => {
  const on = ease(f, s(84.7), s(85.1));
  return (
    <>
      <Title f={f} at={82.9} text="Malah kepikiran…" bg={C.white} />
      <At x={500} y={420} s={P(f, 83.2)} r={wobble(f, 3, 0.1)}>
        <Bulb on={on} size={220} />
      </At>
      {[
        { at: 85.0, x: 200, y: 330, t: 'ide', bg: C.blue, r: -8 },
        { at: 85.4, x: 800, y: 300, t: 'konsep', bg: C.pink, r: 7 },
        { at: 85.8, x: 820, y: 560, t: 'format', bg: C.green, r: -5 },
        { at: 86.1, x: 180, y: 590, t: 'seri', bg: C.purple, r: 6 },
      ].map((c, i) => (
        <At key={i} x={c.x} y={c.y + wobble(f + i * 11, 8, 0.1)} s={P(f, c.at, 220)} r={c.r}>
          <Sticker bg={c.bg} size={38}>{`${c.t} baru`}</Sticker>
        </At>
      ))}
      <At x={500} y={790} s={P(f, 86.8, 200)} r={-2}>
        <Box bg={C.yellow} pad="14px 30px" style={{ fontFamily: HEAD, fontSize: 46, whiteSpace: 'nowrap' }}>
          Setelah 30 hari selesai!
        </Box>
      </At>
    </>
  );
};

export const SCENES: { from: number; to: number; bg: string; C: React.FC<SceneProps> }[] = [
  { from: 3.4, to: 12.6, bg: C.bg, C: Quote },
  { from: 17.8, to: 25.8, bg: C.blue, C: Penasaran },
  { from: 25.8, to: 33.0, bg: C.pink, C: Nyesel },
  { from: 37.8, to: 43.2, bg: C.green, C: Kecil },
  { from: 43.2, to: 58.6, bg: C.purple, C: Kamar },
  { from: 62.2, to: 71.2, bg: C.orange, C: Alasan },
  { from: 74.2, to: 82.8, bg: C.blue, C: Progress },
  { from: 82.8, to: 90, bg: C.yellow, C: Konsep },
];
