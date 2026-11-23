import React from 'react';
import { At, Bolt, Box, Burst, Sticker, ease, lin, pop } from './components';
import { BODY, BORDER, C, HEAD, s, shadow } from './theme';

/*
 * Every scene draws on a 1000x880 stage and gets the ABSOLUTE frame, so
 * beats line up with the source.mp4 seconds written next to them.
 */
type SceneProps = { f: number };
const P = (f: number, sec: number, k = 170) => pop(f, s(sec), k);
const wobble = (f: number, amp = 3, speed = 0.12) => Math.sin(f * speed) * amp;
const ink = C.ink;
const SW = BORDER;

/* ------------------------------------------------------------------ */
/* small drawings                                                      */
/* ------------------------------------------------------------------ */
type Face = 'happy' | 'worried' | 'flat';
const Person: React.FC<{ color: string; size?: number; face?: Face; scope?: boolean }> = ({ color, size = 90, face = 'happy', scope }) => {
  const mouth =
    face === 'happy' ? 'M40 52 Q50 62 60 52' : face === 'worried' ? 'M40 56 q5 -4 10 0 q5 4 10 0' : 'M43 55 L57 55';
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{ overflow: 'visible' }}>
      <path d="M10 140 Q10 80 50 80 Q90 80 90 140 Z" fill={color} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={50} cy={44} r={30} fill="#F2C9A0" stroke={ink} strokeWidth={6} />
      <circle cx={39} cy={40} r={3.8} fill={ink} />
      <circle cx={61} cy={40} r={3.8} fill={ink} />
      <path d={mouth} fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" />
      {scope && (
        <g fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round">
          <path d="M34 82 Q30 112 50 116 Q70 112 66 82" />
          <circle cx={50} cy={120} r={7} fill={C.white} />
        </g>
      )}
    </svg>
  );
};

/** a smaller person = a kid */
const Kid: React.FC<{ color: string; size?: number }> = ({ color, size = 70 }) => <Person color={color} size={size} face="happy" />;

const Check: React.FC<{ size?: number; ok?: boolean }> = ({ size = 44, ok = true }) => (
  <div style={{
    width: size, height: size, flex: 'none', borderRadius: 10, border: `5px solid ${ink}`, background: ok ? C.green : C.red,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: size * 0.6, color: ok ? ink : C.white,
  }}>
    {ok ? '✓' : '✗'}
  </div>
);

const Title: React.FC<{ f: number; at: number; text: string; bg?: string; y?: number; size?: number; r?: number }> = ({
  f, at, text, bg = C.white, y = 80, size = 46, r = -2,
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

/** "ENSIKLO" + "PEDIA" chip where the -pedia half lights up */
export const PediaWord: React.FC<{ head: string; lit: number; size?: number; bg?: string }> = ({ head, lit, size = 40, bg = C.white }) => (
  <Box bg={bg} pad="8px 18px" radius={14} sh={7} style={{ fontFamily: HEAD, fontSize: size, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
    {/* one word, no gap: the -PEDIA half only gets a highlight */}
    <span>{head}</span>
    <span style={{
      background: lit > 0.5 ? C.yellow : 'transparent', boxShadow: lit > 0.5 ? `inset 0 0 0 4px ${ink}` : 'none', borderRadius: 8,
      padding: '0 3px', transform: `scale(${1 + 0.12 * Math.sin(Math.PI * Math.min(1, lit))})`, display: 'inline-block',
    }}>PEDIA</span>
  </Box>
);

const Book: React.FC<{ w?: number; glow?: number; cover?: string }> = ({ w = 300, glow = 0, cover = C.white }) => (
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
    <path d="M180 50 Q250 20 340 40 V230 Q250 210 180 240 Z" fill={cover} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
    {[80, 115, 150, 185].map((y) => (
      <g key={y} stroke={ink} strokeWidth={5} strokeLinecap="round">
        <line x1={50} y1={y} x2={150} y2={y + 6} />
        <line x1={210} y1={y + 6} x2={310} y2={y} />
      </g>
    ))}
  </svg>
);

const Shop: React.FC<{ w?: number }> = ({ w = 300 }) => (
  <svg width={w} height={w} viewBox="0 0 200 200">
    <rect x="30" y="80" width="140" height="104" fill={C.white} stroke={ink} strokeWidth={SW} />
    <rect x="22" y="26" width="156" height="30" fill={C.green} stroke={ink} strokeWidth={SW} />
    <text x="100" y="50" textAnchor="middle" fontFamily={HEAD} fontSize="24">TOKO</text>
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${22 + i * 31.2} 56 h31.2 v18 a15.6 15.6 0 0 1 -31.2 0 z`} fill={i % 2 ? C.white : C.yellow} stroke={ink} strokeWidth={SW - 1} strokeLinejoin="round" />
    ))}
    <rect x="44" y="110" width="50" height="40" fill={C.blue} stroke={ink} strokeWidth={SW} />
    <rect x="112" y="110" width="40" height="74" fill={C.pink} stroke={ink} strokeWidth={SW} />
  </svg>
);

/* ================================================================== */
/* 1. "pedia" comes from Greek paideia (9.0 - 21.2, anim)              */
/* ================================================================== */
const Paideia: React.FC<SceneProps> = ({ f }) => {
  const kids = [C.pink, C.blue, C.green];
  return (
    <>
      <Title f={f} at={9.6} text="Asal kata “pedia”" bg={C.white} />
      <At x={230} y={178} s={P(f, 11.7, 220)} r={-4}>
        <Sticker bg={C.white} size={30}>Bahasa Yunani</Sticker>
      </At>
      {/* TRIMS fact card */}
      <At x={790} y={178} s={P(f, 13.9, 220)} r={6}>
        <Sticker bg={C.yellow} size={30}>Lauk hari ini</Sticker>
      </At>
      {/* the Greek word */}
      <At x={500} y={335} s={P(f, 13.7)} r={1.5}>
        <Box bg={C.yellow} pad="10px 40px 16px" radius={22} style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontWeight: 900, fontSize: 104, lineHeight: 1.1 }}>παιδεία</div>
          <div style={{ fontFamily: HEAD, fontSize: 40, marginTop: 2 }}>paideia</div>
        </Box>
      </At>
      <At x={500} y={545} s={P(f, 15.1)} r={-1}>
        <Box bg={C.white} pad="14px 28px" style={{ display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: HEAD, fontSize: 44 }}>=</span>
          <Book w={120} cover={C.yellow} />
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, lineHeight: 1.15 }}>pendidikan untuk<br />anak-anak</span>
        </Box>
      </At>
      {/* pais / paidos = children */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22 }}>
        {[
          { at: 18.4, t: 'pais' },
          { at: 19.6, t: 'paidos' },
        ].map((c) => (
          <div key={c.t} style={{ transform: `scale(${P(f, c.at, 220)}) rotate(${c.t === 'pais' ? -3 : 3}deg)` }}>
            <Sticker bg={C.purple} size={42} style={{ textTransform: 'none' }}>{c.t}</Sticker>
          </div>
        ))}
        <div style={{ transform: `scale(${P(f, 20.3, 220)})`, fontFamily: HEAD, fontSize: 60 }}>→</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          {kids.map((c, i) => (
            <div key={i} style={{ transform: `scale(${P(f, 20.5 + i * 0.12, 220)}) translateY(${wobble(f + i * 7, 5, 0.25)}px)` }}>
              <Kid color={c} size={i === 1 ? 84 : 70} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ================================================================== */
/* 2. The -pedia words and the children's doctor (21.2 - 33.2, split)  */
/* ================================================================== */
const Pediatri: React.FC<SceneProps> = ({ f }) => {
  const words = [
    { at: 23.8, head: 'TOKO', y: 250 },
    { at: 25.7, head: 'WIKI', y: 420 },
    { at: 27.2, head: 'ENSIKLO', y: 590 },
  ];
  const link = ease(f, s(28.5), s(29.6));
  return (
    <>
      <Title f={f} at={21.4} text="Secara bahasa…" bg={C.white} />
      {/* lines from each word to the doctor */}
      <svg width={1000} height={880} style={{ position: 'absolute', left: 0, top: 0 }}>
        {words.map((w) => (
          <line key={w.head} x1={420} y1={w.y} x2={420 + (690 - 420) * link} y2={w.y + (430 - w.y) * link}
            stroke={ink} strokeWidth={7} strokeDasharray="4 18" strokeLinecap="round" />
        ))}
      </svg>
      {words.map((w, i) => (
        <At key={w.head} x={250} y={w.y} s={P(f, w.at, 200)} r={i % 2 ? 2 : -2}>
          <PediaWord head={w.head} lit={lin(f, s(28.5), s(28.5) + 6)} size={38} />
        </At>
      ))}
      <At x={760} y={420} s={P(f, 30.1)}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: -60, top: -10, width: 300, height: 300, borderRadius: '50%', background: C.white, border: `${SW}px solid ${ink}`, boxShadow: shadow(10) }} />
          <div style={{ position: 'relative', left: 0, top: 10 }}>
            <Person color={C.white} size={180} face="happy" scope />
          </div>
          <div style={{ position: 'absolute', left: 120, top: 120, transform: `scale(${P(f, 30.5, 220)})` }}>
            <Kid color={C.orange} size={70} />
          </div>
        </div>
      </At>
      <At x={760} y={680} s={P(f, 30.3, 220)} r={3}>
        <Sticker bg={C.green} size={34}>Dokter anak</Sticker>
      </At>
      <At x={760} y={790} s={P(f, 32.2, 220)} r={-2}>
        <Box bg={C.white} pad="6px 20px" radius={14} sh={7} style={{ fontFamily: HEAD, fontSize: 44, whiteSpace: 'nowrap' }}>
          <span style={{ background: C.yellow, boxShadow: `inset 0 0 0 4px ${ink}`, borderRadius: 8, padding: '0 3px' }}>PEDI</span>ATRI
        </Box>
      </At>
    </>
  );
};

/* ================================================================== */
/* 3. Ensiklopedia: circular, all-round learning (35.8 - 55.4, anim)   */
/* ================================================================== */
const Ensiklopedia: React.FC<SceneProps> = ({ f }) => {
  const topics = ['Sejarah', 'Sains', 'Hewan', 'Negara', 'Tokoh', 'Seni'];
  const colors = [C.yellow, C.blue, C.green, C.pink, C.orange, C.white];
  const spin = f * 0.012;
  const az = ease(f, s(48.1), s(48.75));
  const letter = String.fromCharCode(65 + Math.round(25 * az));
  return (
    <>
      <At x={500} y={80} s={P(f, 36.0)} r={-2}>
        <PediaWord head="ENSIKLO" lit={lin(f, s(37.0), s(37.0) + 6)} size={48} bg={C.white} />
      </At>
      <At x={500} y={400 + wobble(f, 5, 0.1)} s={P(f, 39.2)}>
        <Book w={260} glow={ease(f, s(42.3), s(42.7))} cover={C.yellow} />
      </At>
      {/* topics circling the book = "melingkar" */}
      {topics.map((t, i) => {
        const a = spin + (i / topics.length) * Math.PI * 2;
        return (
          <At key={t} x={500 + Math.cos(a) * 360} y={390 + Math.sin(a) * 190} s={P(f, 40.7 + i * 0.18, 220)} r={wobble(f + i * 13, 4, 0.08)}>
            <Sticker bg={colors[i]} size={30}>{t}</Sticker>
          </At>
        );
      })}
      <At x={500} y={690} s={P(f, 40.7, 200)} r={2} o={1 - lin(f, s(42.2), s(42.2) + 4)}>
        <Sticker bg={C.white} size={34}>Melingkar</Sticker>
      </At>
      <At x={500} y={690} s={P(f, 42.3, 200)} r={-2}>
        <Sticker bg={C.purple} size={34}>Menyeluruh</Sticker>
      </At>
      {/* A to Z */}
      <At x={500} y={805} s={P(f, 46.8)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Sticker bg={C.yellow} size={40}>A</Sticker>
          <Meter w={520} v={az} color={C.yellow} label={az > 0.02 && az < 0.97 ? letter : ''} />
          <Sticker bg={az > 0.97 ? C.yellow : C.white} size={40}>Z</Sticker>
        </div>
      </At>
      <At x={830} y={210} s={P(f, 51.3, 220)} r={8}>
        <Burst size={230} color={C.pink} rot={f * 0.6}>
          <span style={{ fontSize: 30, lineHeight: 1.05 }}>BANYAK<br />BANGET!</span>
        </Burst>
      </At>
    </>
  );
};

/* ================================================================== */
/* 4. Wikipedia: fast learning (55.4 - 68.2, split)                    */
/* ================================================================== */
const Wikipedia: React.FC<SceneProps> = ({ f }) => {
  const query = 'arti kata pedia';
  const typed = query.slice(0, Math.round(query.length * lin(f, s(64.0), s(65.5))));
  const caret = Math.floor(f / 8) % 2 === 0 ? '|' : ' ';
  const speed = P(f, 60.6);
  return (
    <>
      <At x={500} y={80} s={P(f, 55.7)} r={-2}>
        <PediaWord head="WIKI" lit={lin(f, s(56.7), s(56.7) + 6)} size={48} />
      </At>
      <At x={700} y={260} s={P(f, 58.4, 220)} r={4}>
        <Box bg={C.white} pad="10px 22px" radius={14} sh={7} style={{ fontFamily: HEAD, fontSize: 40, whiteSpace: 'nowrap' }}>
          WIKI = <span style={{ background: C.yellow, border: `4px solid ${ink}`, borderRadius: 10, padding: '0 8px' }}>CEPAT</span>
        </Box>
      </At>
      {/* speed lines + bolt */}
      <At x={250} y={300} s={speed} r={wobble(f, 6, 0.3)}>
        <div style={{ position: 'relative' }}>
          {[0, 1, 2].map((i) => {
            const t = ((f * 0.06 + i / 3) % 1);
            return <div key={i} style={{ position: 'absolute', left: -150 - 80 * t, top: 50 + i * 55, width: 110, height: 12, borderRadius: 6, background: ink, opacity: 1 - t }} />;
          })}
          <Bolt size={200} />
        </div>
      </At>
      {/* search bar */}
      <At x={500} y={560} s={P(f, 63.9)}>
        <Box bg={C.white} pad="16px 26px" style={{ width: 820, display: 'flex', alignItems: 'center', gap: 20, fontSize: 40, fontWeight: 700 }}>
          <svg width={46} height={46} viewBox="0 0 40 40">
            <circle cx={17} cy={17} r={11} fill="none" stroke={ink} strokeWidth={5} />
            <line x1={25} y1={25} x2={36} y2={36} stroke={ink} strokeWidth={6} strokeLinecap="round" />
          </svg>
          <span style={{ whiteSpace: 'pre' }}>{typed}{f < s(66.6) ? caret : ''}</span>
        </Box>
      </At>
      <At x={500} y={740} s={P(f, 66.7, 220)} r={-2}>
        <Box bg={C.green} pad="12px 26px" radius={16} sh={8} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 700, whiteSpace: 'nowrap' }}>
          <Check size={42} /> Langsung ketemu!
        </Box>
      </At>
    </>
  );
};

/* ================================================================== */
/* 5. Tokopedia = toko + ensiklopedia (68.2 - 86.1, anim)              */
/* ================================================================== */
const Tokopedia: React.FC<SceneProps> = ({ f }) => {
  const eq = P(f, 72.6);
  const shelf = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const fill = lin(f, s(80.9), s(81.8));
  return (
    <>
      <Title f={f} at={68.5} text="Kalau Tokopedia?" bg={C.white} />
      {/* not about education? */}
      <At x={500} y={250} s={P(f, 70.6, 220)} o={1 - lin(f, s(72.4), s(72.4) + 6)} r={-2}>
        <Box bg={C.white} pad="10px 22px" radius={14} sh={7} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 700, whiteSpace: 'nowrap' }}>
          <Check ok={false} size={44} /> pendidikan?
        </Box>
      </At>
      {/* the equation */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: Math.min(1, eq * 1.5) }}>
        <div style={{ transform: `scale(${P(f, 75.3, 220)}) rotate(-3deg)` }}>
          <Sticker bg={C.green} size={46}>Toko</Sticker>
        </div>
        <div style={{ fontFamily: HEAD, fontSize: 56, transform: `scale(${P(f, 75.6, 220)})` }}>+</div>
        <div style={{ transform: `scale(${P(f, 76.2, 220)}) rotate(2deg)` }}>
          <Box bg={C.white} pad="8px 18px" radius={14} sh={7} style={{ fontFamily: HEAD, fontSize: 46, whiteSpace: 'nowrap' }}>
            <span style={{ opacity: 1 - 0.65 * lin(f, s(76.9), s(76.9) + 6), textDecoration: f >= s(76.9) ? `line-through 6px ${C.red}` : 'none' }}>ENSIKLO</span>
            <span style={{ background: C.yellow, boxShadow: `inset 0 0 0 4px ${ink}`, borderRadius: 8, padding: '0 3px' }}>PEDIA</span>
          </Box>
        </div>
      </div>
      <At x={500} y={355} s={P(f, 76.9, 200)} r={-1}>
        <Box bg={C.yellow} pad="10px 30px" style={{ fontFamily: HEAD, fontSize: 56, whiteSpace: 'nowrap' }}>= TOKOPEDIA</Box>
      </At>
      {/* a shop where you find A to Z */}
      <At x={230} y={640 + wobble(f, 4, 0.1)} s={P(f, 77.4)}>
        <Shop w={300} />
      </At>
      <At x={680} y={640} s={P(f, 79.5)} r={1.5}>
        <Box bg={C.white} pad="16px" radius={18} style={{ width: 470, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {shelf.map((l, i) => {
            const on = fill * shelf.length > i;
            return (
              <div key={l} style={{
                height: 50, borderRadius: 8, border: `4px solid ${ink}`, background: on ? [C.yellow, C.pink, C.blue, C.green, C.orange, C.purple][i % 6] : C.bg,
                fontFamily: HEAD, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 1 : 0.85})`,
              }}>
                {on ? l : ''}
              </div>
            );
          })}
        </Box>
      </At>
      <At x={680} y={830} s={P(f, 82.2, 220)} r={-3}>
        <Sticker bg={C.white} size={30}>≈ kayak ensiklopedia</Sticker>
      </At>
    </>
  );
};

/* ================================================================== */
/* 6. Sharing what I know (93.2 - 106.2, split)                        */
/* ================================================================== */
const Berbagi: React.FC<SceneProps> = ({ f }) => {
  const people = [C.blue, C.pink, C.green, C.orange];
  const chips = [
    { at: 101.0, t: 'Pengetahuan', bg: C.orange, x: 190, y: 610, r: -6 },
    { at: 102.9, t: 'Tips', bg: C.green, x: 810, y: 610, r: 6 },
    { at: 103.6, t: 'Macam-macam', bg: C.pink, x: 500, y: 800, r: -2 },
  ];
  return (
    <>
      <Title f={f} at={93.4} text="Sesederhana apa pun…" bg={C.white} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center', gap: 30 }}>
        {people.map((c, i) => (
          <div key={i} style={{ position: 'relative', transform: `scale(${P(f, 96.1 + i * 0.15, 220)})` }}>
            <Person color={c} size={110} face={f >= s(99.8) ? 'happy' : 'worried'} />
            <div style={{
              position: 'absolute', left: 70, top: -40, fontFamily: HEAD, fontSize: 54, color: f >= s(99.8) ? C.yellow : C.white,
              WebkitTextStroke: `3px ${ink}`, transform: `rotate(${wobble(f + i * 9, 12, 0.15)}deg)`,
            }}>
              {f >= s(99.8) ? '!' : '?'}
            </div>
          </div>
        ))}
      </div>
      <At x={500} y={385} s={P(f, 96.6, 220)} r={2}>
        <Sticker bg={C.white} size={32}>masih banyak yang belum tahu</Sticker>
      </At>
      <At x={500} y={560 + wobble(f, 5, 0.1)} s={P(f, 98.0)}>
        <Book w={240} glow={ease(f, s(99.8), s(100.2))} cover={C.yellow} />
      </At>
      {chips.map((c, i) => (
        <At key={c.t} x={c.x} y={c.y + wobble(f + i * 11, 7, 0.1)} s={P(f, c.at, 220)} r={c.r}>
          <Sticker bg={c.bg} size={38}>{c.t}</Sticker>
        </At>
      ))}
    </>
  );
};

export const SCENES: { from: number; to: number; bg: string; C: React.FC<SceneProps> }[] = [
  { from: 9.0, to: 21.2, bg: C.bg, C: Paideia },
  { from: 21.2, to: 33.2, bg: C.orange, C: Pediatri },
  { from: 35.8, to: 55.4, bg: C.yellow, C: Ensiklopedia },
  { from: 55.4, to: 68.2, bg: C.bg, C: Wikipedia },
  { from: 68.2, to: 86.1, bg: C.orange, C: Tokopedia },
  { from: 93.2, to: 106.2, bg: C.yellow, C: Berbagi },
];
