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

/** horizontal meter with a thick outline */
const Meter: React.FC<{ w: number; h?: number; v: number; color: string; label?: string }> = ({ w, h = 60, v, color, label }) => (
  <div style={{ position: 'relative', width: w, height: h, background: C.white, border: `${SW}px solid ${ink}`, borderRadius: 14, boxShadow: shadow(7), overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, v)) * 100}%`, background: color, borderRight: v > 0.01 ? `${SW}px solid ${ink}` : 'none' }} />
    {label && (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 16, fontFamily: HEAD, fontSize: h * 0.45 }}>{label}</div>
    )}
  </div>
);

/* ================================================================== */
/* 1. Where the line comes from (3.3 - 12.0, animation only)           */
/* ================================================================== */
const Podcast: React.FC<SceneProps> = ({ f }) => {
  const move = ease(f, s(6.2), s(6.8)); // quote card makes room for the thumbnail
  return (
    <>
      <Title f={f} at={3.4} text="Inget banget dari…" bg={C.white} y={70} />
      <At x={500} y={410} s={P(f, 6.4)} r={-1.5}>
        <div style={{ width: 660, height: 495, border: `${SW}px solid ${ink}`, borderRadius: 20, boxShadow: shadow(12), overflow: 'hidden', background: ink }}>
          <Img src={staticFile('gjls.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </At>
      <At x={200} y={190} s={P(f, 7.2, 220)} r={-8}>
        <Sticker bg={C.yellow} size={36}>Podcast GJLS</Sticker>
      </At>
      <At x={730} y={205} s={P(f, 9.4, 220)} r={4}>
        <Sticker bg={C.pink} size={28}>Tamu: Anies Baswedan</Sticker>
      </At>
      {/* the line itself, big first, then tucked under the thumbnail */}
      <At x={500} y={440 + 335 * move} s={P(f, 3.6) * (1.12 - 0.22 * move)} r={1}>
        <Box bg={C.white} pad="18px 30px" style={{ display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap', fontFamily: HEAD, fontSize: 44 }}>
          <span>Pengalaman kerja</span>
          <span style={{ background: C.red, color: C.white, border: `${SW}px solid ${ink}`, borderRadius: 12, padding: '0 14px' }}>≠</span>
          <span>durasi kerja</span>
        </Box>
      </At>
    </>
  );
};

/* ================================================================== */
/* 2. Years on the job, still confused (16.0 - 27.4, split)            */
/* ================================================================== */
const LamaBingung: React.FC<SceneProps> = ({ f }) => {
  const year = 2016 + Math.round(9 * ease(f, s(17.7), s(18.9)));
  const lost = f >= s(19.0);
  return (
    <>
      <Title f={f} at={16.1} text="Kerja bertahun-tahun…" bg={C.yellow} />
      <At x={280} y={470} s={P(f, 16.3)}>
        <Person color={C.orange} size={270} face={lost ? 'worried' : 'happy'} />
      </At>
      {/* question marks orbit once the "tapi" lands */}
      {Array.from({ length: 4 }).map((_, i) => {
        const a = f * 0.07 + (i / 4) * Math.PI * 2;
        return (
          <At key={i} x={280 + Math.cos(a) * 180} y={360 + Math.sin(a) * 60} s={P(f, 19.1 + i * 0.2, 220)} r={wobble(f + i * 9, 12, 0.15)}>
            <span style={{ fontFamily: HEAD, fontSize: 64, color: [C.yellow, C.pink, C.green, C.white][i], WebkitTextStroke: `3px ${ink}` }}>?</span>
          </At>
        );
      })}
      <At x={290} y={770} s={P(f, 20.2, 220)} r={-4}>
        <Sticker bg={C.white} size={30}>nggak ngerti-ngerti…</Sticker>
      </At>
      {/* years flipping by */}
      <At x={740} y={300} s={P(f, 17.6)} r={3}>
        <Box bg={C.white} pad={0} radius={18} style={{ width: 300, textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ background: C.red, borderBottom: `${SW}px solid ${ink}`, fontFamily: HEAD, fontSize: 26, padding: 8, color: C.white }}>MASA KERJA</div>
          <div style={{ fontFamily: HEAD, fontSize: 88, padding: '10px 0' }}>{year}</div>
        </Box>
      </At>
      {/* what they still can't answer */}
      <At x={720} y={640} s={P(f, 23.6)} r={-2}>
        <Box bg={C.white} pad="20px 24px" style={{ width: 470, display: 'flex', flexDirection: 'column', gap: 16, fontSize: 28, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {[
            { at: 24.8, t: 'Salahnya di mana?' },
            { at: 26.5, t: 'Apa yang perlu dibenerin?' },
          ].map((row) => (
            <div key={row.t} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: lin(f, s(row.at), s(row.at) + 4), transform: `scale(${0.6 + 0.4 * P(f, row.at, 220)})`, transformOrigin: 'left center' }}>
              <Check ok={false} size={46} />
              <span>{row.t}</span>
            </div>
          ))}
        </Box>
      </At>
    </>
  );
};

/* ================================================================== */
/* 3. The sharp one: dropped in, gets A to Z (27.4 - 40.6, anim)       */
/* ================================================================== */
const Jago: React.FC<SceneProps> = ({ f }) => {
  const drop = ease(f, s(31.8), s(32.3)); // "dicemplungin"
  const splash = f >= s(32.3) ? lin(f, s(32.3), s(32.3) + 16) : 0;
  const az = ease(f, s(34.9), s(36.3)); // "A sampai Z"
  const letter = String.fromCharCode(65 + Math.round(25 * az));
  return (
    <>
      <Title f={f} at={27.5} text="Orang yang jago banget" bg={C.yellow} />
      <At x={190} y={210} s={P(f, 29.3, 220)} r={-8}>
        <Sticker bg={C.white} size={32}>Jago</Sticker>
      </At>
      <At x={810} y={210} s={P(f, 30.2, 220)} r={7}>
        <Sticker bg={C.purple} size={32}>Pintar</Sticker>
      </At>
      {/* the pool = a new field */}
      <div style={{ position: 'absolute', left: 190, top: 420, width: 620, height: 150, background: C.blue, border: `${SW}px solid ${ink}`, borderRadius: 22, boxShadow: shadow(10), opacity: lin(f, s(31.6), s(31.6) + 5) }} />
      <At x={500} y={180 + 230 * drop + wobble(f, 4 * drop, 0.15)} s={P(f, 29.0)}>
        <Person color={C.pink} size={150} face="happy" />
      </At>
      {/* front water hides the legs */}
      <div style={{ position: 'absolute', left: 190, top: 468, width: 620, height: 102, background: C.blue, border: `${SW}px solid ${ink}`, borderTop: 'none', borderRadius: '0 0 22px 22px', opacity: lin(f, s(31.6), s(31.6) + 5) }}>
        <svg width={620} height={30} viewBox="0 0 620 30" style={{ position: 'absolute', left: -SW, top: -14 }}>
          <path d={`M0 15 ${Array.from({ length: 11 }, (_, i) => `Q${i * 60 + 30} ${15 + 12 * Math.sin(f * 0.2 + i)} ${i * 60 + 60} 15`).join(' ')}`} fill="none" stroke={ink} strokeWidth={5} />
        </svg>
      </div>
      {splash > 0 && splash < 1 &&
        [-1, -0.5, 0.5, 1].map((d) => (
          <At key={d} x={500 + d * 120 * splash} y={420 - 90 * Math.sin(Math.PI * splash)} o={1 - splash}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.white, border: `5px solid ${ink}` }} />
          </At>
        ))}
      <At x={500} y={585} s={P(f, 32.9, 220)} r={-3}>
        <Sticker bg={C.orange} size={34}>Bidang baru</Sticker>
      </At>
      {/* A to Z */}
      <At x={500} y={700} s={P(f, 34.7)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Sticker bg={C.yellow} size={40}>A</Sticker>
          <Meter w={520} v={az} color={C.yellow} label={az > 0.02 && az < 0.97 ? letter : ''} />
          <Sticker bg={az > 0.97 ? C.yellow : C.white} size={40}>Z</Sticker>
        </div>
      </At>
      {/* and knows what to fix */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center', gap: 24 }}>
        {[
          { at: 39.0, t: 'yang salah', r: -2 },
          { at: 39.9, t: 'yang perlu dibenerin', r: 2 },
        ].map((c) => (
          <div key={c.t} style={{ transform: `scale(${P(f, c.at, 220)}) rotate(${c.r}deg)` }}>
            <Box bg={C.white} pad="8px 16px" radius={14} sh={7} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, fontWeight: 700, whiteSpace: 'nowrap' }}>
              <Check size={38} />
              {c.t}
            </Box>
          </div>
        ))}
      </div>
    </>
  );
};

/* ================================================================== */
/* 4. Years go up, learning stays at zero (45.8 - 51.3, anim)          */
/* ================================================================== */
const MasaKerja: React.FC<SceneProps> = ({ f }) => {
  const years = ease(f, s(46.5), s(48.9));
  return (
    <>
      <Title f={f} at={45.9} text="Cuma nambah masa kerja?" bg={C.white} />
      {[
        { at: 46.3, y: 330, label: 'Masa kerja', v: 0.08 + 0.92 * years, color: C.yellow, tag: `${1 + Math.round(9 * years)} tahun` },
        { at: 49.4, y: 590, label: 'Yang dipelajari', v: 0.03, color: C.green, tag: '' },
      ].map((b) => (
        <At key={b.label} x={500} y={b.y} s={P(f, b.at)}>
          <div style={{ width: 820 }}>
            <div style={{ fontFamily: HEAD, fontSize: 40, marginBottom: 14 }}>{b.label}</div>
            <Meter w={820} h={96} v={b.v} color={b.color} label={b.tag} />
          </div>
        </At>
      ))}
      <At x={640} y={640} s={P(f, 50.1, 240)} r={-10}>
        <Stamp text="Nol!" size={80} />
      </At>
    </>
  );
};

/* ================================================================== */
/* 5. Learn as much as you can (51.3 - 63.3, split)                    */
/* ================================================================== */
const Book: React.FC<{ w?: number; glow: number }> = ({ w = 360, glow }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 360 260" style={{ overflow: 'visible' }}>
    {glow > 0.01 &&
      Array.from({ length: 7 }).map((_, i) => {
        const a = Math.PI + (i / 6) * Math.PI;
        return (
          <line key={i} x1={180 + Math.cos(a) * 150} y1={110 + Math.sin(a) * 120} x2={180 + Math.cos(a) * (150 + 50 * glow)} y2={110 + Math.sin(a) * (120 + 50 * glow)}
            stroke={ink} strokeWidth={10} strokeLinecap="round" />
        );
      })}
    <path d="M180 50 Q110 20 20 40 V230 Q110 210 180 240 Z" fill={C.white} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M180 50 Q250 20 340 40 V230 Q250 210 180 240 Z" fill={glow > 0.5 ? C.yellow : C.white} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
    {[80, 115, 150, 185].map((y) => (
      <g key={y} stroke={ink} strokeWidth={5} strokeLinecap="round">
        <line x1={50} y1={y} x2={150} y2={y + 6} />
        <line x1={210} y1={y + 6} x2={310} y2={y} />
      </g>
    ))}
  </svg>
);

const Pelajari: React.FC<SceneProps> = ({ f }) => {
  const all = P(f, 62.5, 220);
  const items = [
    { at: 57.0, t: 'Hal-hal baru', bg: C.yellow, x: 190, y: 270, r: -6 },
    { at: 58.1, t: 'Update-nya', bg: C.green, x: 810, y: 270, r: 6 },
    { at: 60.6, t: 'Sistemnya', bg: C.blue, x: 190, y: 600, r: 5 },
    { at: 61.6, t: 'Dll…', bg: C.pink, x: 810, y: 600, r: -5 },
  ];
  return (
    <>
      <Title f={f} at={51.5} text="Pelajari sebanyak mungkin" bg={C.yellow} />
      <At x={500} y={440 + wobble(f, 5, 0.1)} s={P(f, 52.4)}>
        <Book glow={ease(f, s(62.5), s(62.9))} />
      </At>
      <At x={500} y={620} s={P(f, 54.0, 220)} r={-3}>
        <Sticker bg={C.white} size={30}>Bidang kamu</Sticker>
      </At>
      {items.map((c, i) => (
        <At key={i} x={c.x} y={c.y + wobble(f + i * 11, 8, 0.1)} s={P(f, c.at, 220)} r={c.r}>
          <Sticker bg={c.bg} size={36}>{c.t}</Sticker>
        </At>
      ))}
      <At x={500} y={790} s={all} r={-2}>
        <Box bg={C.orange} pad="12px 34px" style={{ fontFamily: HEAD, fontSize: 52, whiteSpace: 'nowrap' }}>
          SELURUHNYA!
        </Box>
      </At>
    </>
  );
};

/* ================================================================== */
/* 6. Same years, more learned (63.3 - end, anim)                      */
/* ================================================================== */
const SamaDurasi: React.FC<SceneProps> = ({ f }) => {
  const learn = ease(f, s(68.6), s(70.7));
  const cards = [
    { at: 63.6, x: 260, name: 'Orang lain', color: C.blue, face: 'flat' as Face, v: 0.25 * learn, bar: C.orange, r: -2 },
    { at: 64.0, x: 740, name: 'Kamu', color: C.pink, face: 'happy' as Face, v: 0.95 * learn, bar: C.green, r: 2 },
  ];
  return (
    <>
      <Title f={f} at={63.4} text="Durasinya sama…" bg={C.white} />
      {cards.map((c) => (
        <At key={c.name} x={c.x} y={420} s={P(f, c.at)} r={c.r}>
          <Box bg={C.white} pad="20px 24px" style={{ width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: HEAD, fontSize: 40 }}>{c.name}</div>
            <Person color={c.color} size={120} face={c.face} />
            <div style={{ transform: `scale(${P(f, 65.7, 220)})` }}>
              <Sticker bg={C.yellow} size={30}>2 tahun kerja</Sticker>
            </div>
            <div style={{ alignSelf: 'stretch', marginTop: 6, opacity: lin(f, s(68.4), s(68.4) + 5) }}>
              <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 26, marginBottom: 8 }}>Yang dipelajari</div>
              <Meter w={340} h={48} v={c.v} color={c.bar} />
            </div>
          </Box>
        </At>
      ))}
      <At x={740} y={770} s={P(f, 70.7, 220)} r={-4}>
        <Burst size={260} color={C.green} rot={f * 0.6}>
          <span style={{ fontSize: 34, lineHeight: 1.05 }}>LEBIH<br />BANYAK!</span>
        </Burst>
      </At>
    </>
  );
};

export const SCENES: { from: number; to: number; bg: string; C: React.FC<SceneProps> }[] = [
  { from: 3.3, to: 12.0, bg: C.bg, C: Podcast },
  { from: 16.0, to: 27.4, bg: C.blue, C: LamaBingung },
  { from: 27.4, to: 40.6, bg: C.green, C: Jago },
  { from: 45.8, to: 51.3, bg: C.orange, C: MasaKerja },
  { from: 51.3, to: 63.3, bg: C.purple, C: Pelajari },
  { from: 63.3, to: 80, bg: C.yellow, C: SamaDurasi },
];
