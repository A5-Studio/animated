import React from 'react';
import { Img, OffthreadVideo, staticFile } from 'remotion';
import { At, Box, Cup, Photo, Plate, Spark, Sticker, ease, lin, pop } from './components';
import { BODY, BORDER, C, HEAD, MONO, shadow } from './theme';

/** every scene gets its local frame and its length in frames */
export type SceneProps = { t: number; len: number };

/* 1 · hook ----------------------------------------------------------- */
const Hook: React.FC<SceneProps> = ({ t }) => {
  const phone = pop(t, 0, 140);
  const typed = 'Halo, Claude!'.slice(0, Math.floor(lin(t, 10, 34) * 13));
  return (
    <>
      <At x={540} y={760} s={phone} r={-4}>
        <div style={{ width: 430, height: 820, borderRadius: 64, background: C.white, border: `10px solid ${C.ink}`, boxShadow: shadow(18), padding: 16 }}>
          <div style={{ position: 'relative', height: '100%', borderRadius: 46, border: `5px solid ${C.ink}`, background: '#F7F3EA', overflow: 'hidden', fontFamily: BODY }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0 0', fontWeight: 700, fontSize: 26 }}>Claude</div>
            <div style={{ position: 'absolute', top: 230, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              <Spark size={110} rot={t * 2} />
              <div style={{ fontSize: 36, fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>Mau dibantu<br />apa hari ini?</div>
            </div>
            <div style={{ position: 'absolute', left: 22, right: 22, bottom: 30, border: `4px solid ${C.ink}`, borderRadius: 24, background: C.white, padding: '18px 20px', fontSize: 28, fontWeight: 500 }}>
              {typed}
              <span style={{ opacity: Math.floor(t / 8) % 2 ? 0 : 1 }}>|</span>
            </div>
          </div>
        </div>
      </At>
      <At x={830} y={380} s={pop(t, 30, 200)} r={10}>
        <Plate size={300} />
      </At>
      <At x={540} y={1300} s={pop(t, 40, 200)} r={-3}>
        <Box bg={C.orange} pad="14px 34px" style={{ fontFamily: HEAD, fontSize: 76, whiteSpace: 'nowrap' }}>Claude itu SIAPA?</Box>
      </At>
    </>
  );
};

/* 2 · bumper: the TRIMS opening from trims-bumper/ (3s, with its jingle) */
const Bumper: React.FC<SceneProps> = () => (
  <OffthreadVideo src={staticFile('trims-bumper.mp4')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920 }} />
);

/* 3 · Claude -> Claude Shannon --------------------------------------- */
const Shannon: React.FC<SceneProps> = ({ t, len }) => {
  const arrow = ease(t, 14, 30);
  return (
    <>
      <At x={540} y={300} s={pop(t, 0)} r={-2}>
        <Box bg={C.white} pad="14px 30px" style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: HEAD, fontSize: 54 }}>
          <Spark size={64} /> Claude <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32 }}>(AI)</span>
        </Box>
      </At>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1080} height={1920}>
        <line x1={540} y1={370} x2={540} y2={370 + 90 * arrow} stroke={C.ink} strokeWidth={10} strokeLinecap="round" strokeDasharray="4 22" />
        {arrow > 0.95 && <path d="M512 452 L540 486 L568 452" fill="none" stroke={C.ink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      <At x={540} y={840} s={pop(t, 24, 150)} r={1.5}>
        <Photo src="claude-shannon.png" w={680} h={510} name="Claude Shannon" years="1916–2001" />
      </At>
      <At x={540} y={1300} s={pop(t, Math.round(len * 0.25), 220)} r={3}>
        <Sticker bg={C.yellow} size={28}>diyakini · belum dikonfirmasi resmi</Sticker>
      </At>
    </>
  );
};

/* 4 · bit + Father of Information Theory ----------------------------- */
const Bit: React.FC<SceneProps> = ({ t, len }) => {
  const drops = Array.from({ length: 14 }, (_, i) => i);
  const bitIn = Math.round(len * 0.35);
  return (
    <>
      <At x={320} y={720} s={pop(t, 0, 150)} r={-6}>
        <div style={{ width: 430, height: 563, border: `${BORDER}px solid ${C.ink}`, borderRadius: 14, overflow: 'hidden', boxShadow: shadow(16) }}>
          <Img src={staticFile('img/paper-1948-cover.webp')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </At>
      <At x={250} y={390} s={pop(t, 8, 220)} r={-10}>
        <Sticker bg={C.white} size={40}>1948</Sticker>
      </At>
      {/* bits raining into the plate */}
      {drops.map((i) => {
        const start = bitIn + i * 4;
        if (t < start) return null;
        const p = Math.min(1, (t - start) / 22);
        const x = 790 + ((i * 53) % 150) - 75;
        return (
          <At key={i} x={x} y={330 + 520 * p * p} o={1 - lin(t, start + 18, start + 24)} r={(i % 2 ? 1 : -1) * 20 * p}>
            <div style={{ fontFamily: HEAD, fontSize: 72, color: i % 3 ? C.ink : C.orange }}>{i % 2}</div>
          </At>
        );
      })}
      <At x={790} y={930} s={pop(t, bitIn - 6, 180)}>
        <Plate size={340} mark="" />
      </At>
      <At x={790} y={920} s={pop(t, bitIn + 34, 220)} r={-4}>
        <div style={{ fontFamily: HEAD, fontSize: 66 }}>bit</div>
      </At>
      <At x={540} y={1300} s={pop(t, Math.round(len * 0.7), 200)} r={-2}>
        <Box bg={C.orange} pad="14px 28px" style={{ fontFamily: HEAD, fontSize: 50, textAlign: 'center', lineHeight: 1.05 }}>
          Father of<br />Information Theory
        </Box>
      </At>
    </>
  );
};

/* 5 · Turing enters --------------------------------------------------- */
const Turing: React.FC<SceneProps> = ({ t, len }) => {
  const slide = ease(t, 6, 24);
  return (
    <>
      <At x={300} y={760} s={0.92} r={-3}>
        <Photo src="claude-shannon.png" w={400} h={480} name="Shannon" years="1916–2001" tag="Amerika" tagBg={C.blue} pos="35% 30%" />
      </At>
      <At x={780 + 600 * (1 - slide)} y={760} r={3}>
        <Photo src="alan-turing.png" w={400} h={480} name="Alan Turing" years="1912–1954" tag="Inggris" tagBg={C.red} pos="50% 20%" />
      </At>
      <At x={540} y={1250} s={pop(t, Math.round(len * 0.4), 200)} r={-2}>
        <Sticker bg={C.yellow} size={44}>Hidup sezaman!</Sticker>
      </At>
    </>
  );
};

/* 6 · what Turing did -------------------------------------------------- */
const TuringWork: React.FC<SceneProps> = ({ t, len }) => {
  const half = Math.round(len * 0.42);
  const cells = ['0', '1', '1', '0', '1', '0', '0', '1', '1', '0', '1', '1'];
  const shift = (t * 2.2) % 96;
  return (
    <>
      <At x={540} y={290} s={pop(t, 0)} r={-2}>
        <Sticker bg={C.white} size={44}>Karya Alan Turing</Sticker>
      </At>
      {/* Turing machine tape */}
      <At x={540} y={540} s={pop(t, 4, 150)}>
        <div style={{ width: 960, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <svg width={60} height={50} viewBox="0 0 60 50"><path d="M6 4 h48 L30 46 z" fill={C.orange} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" /></svg>
          <div style={{ width: 960, height: 110, overflow: 'hidden', border: `${BORDER}px solid ${C.ink}`, borderRadius: 16, background: C.white, boxShadow: shadow(10), position: 'relative' }}>
            <div style={{ display: 'flex', transform: `translateX(${-shift}px)` }}>
              {[...cells, ...cells].map((c, i) => (
                <div key={i} style={{ flex: 'none', width: 96, height: 98, borderRight: `5px solid ${C.ink}`, display: 'grid', placeItems: 'center', fontFamily: HEAD, fontSize: 56 }}>{c}</div>
              ))}
            </div>
          </div>
          <Box bg={C.yellow} pad="8px 22px" radius={14} sh={7} style={{ fontFamily: HEAD, fontSize: 38 }}>1936 · Mesin Turing</Box>
        </div>
      </At>
      {/* Enigma */}
      <At x={540} y={1080} s={pop(t, half, 150)} r={2}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 560, height: 610, border: `${BORDER}px solid ${C.ink}`, borderRadius: 22, overflow: 'hidden', boxShadow: shadow(14), background: C.white }}>
            <Img src={staticFile('img/enigma.webp')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + 0.05 * lin(t, half, len)})` }} />
          </div>
          <div style={{ position: 'absolute', right: -60, bottom: -30, transform: 'rotate(-5deg)' }}>
            <Sticker bg={C.red} size={34}>Enigma · PD II</Sticker>
          </div>
        </div>
      </At>
    </>
  );
};

/* 7 · they met at Bell Labs ------------------------------------------- */
const Avatar: React.FC<{ src: string; label: string; pos: string }> = ({ src, label, pos }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
    <div style={{ width: 230, height: 230, borderRadius: '50%', border: `${BORDER}px solid ${C.ink}`, overflow: 'hidden', boxShadow: shadow(9) }}>
      <Img src={staticFile(`img/${src}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1)' }} />
    </div>
    <Box bg={C.white} pad="4px 16px" radius={10} sh={5} style={{ fontFamily: HEAD, fontSize: 30 }}>{label}</Box>
  </div>
);

const Meet: React.FC<SceneProps> = ({ t }) => (
  <>
    <At x={540} y={640} s={pop(t, 0, 150)} r={-2}>
      <div style={{ width: 560, height: 724, border: `${BORDER}px solid ${C.ink}`, borderRadius: 22, overflow: 'hidden', boxShadow: shadow(14) }}>
        <Img src={staticFile('img/bell-labs-west-street.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.05)' }} />
      </div>
    </At>
    <At x={300} y={300} s={pop(t, 6, 220)} r={-6}>
      <Sticker bg={C.blue} size={36}>Bell Labs · New York</Sticker>
    </At>
    <At x={850} y={850} s={pop(t, 12, 240)} r={12}>
      <div style={{ fontFamily: HEAD, fontSize: 84, color: C.red, border: `8px solid ${C.red}`, borderRadius: 18, padding: '0 20px', background: `${C.white}cc` }}>1943</div>
    </At>
    <At x={240} y={1180} s={pop(t, 16, 200)} r={-4}>
      <Avatar src="claude-shannon.png" label="Shannon" pos="38% 30%" />
    </At>
    <At x={540} y={1170} s={pop(t, 22, 200)}>
      <Cup size={150} steam={t} />
    </At>
    <At x={840} y={1180} s={pop(t, 19, 200)} r={4}>
      <Avatar src="alan-turing.png" label="Turing" pos="50% 22%" />
    </At>
  </>
);

/* 8 · the 1951 next-letter experiment ---------------------------------- */
const Predict: React.FC<SceneProps> = ({ t, len }) => {
  const letters = 'MAKAN SIA'.split('');
  const solve = Math.round(len * 0.32);
  const guessN = lin(t, solve, solve + 6);
  const guessG = lin(t, solve + 12, solve + 18);
  const aiIn = Math.round(len * 0.55);
  const bars: [string, number][] = [['siang', 0.92], ['malam', 0.05], ['pagi', 0.03]];
  const cell = (ch: string, i: number, bg = C.white, extra?: React.ReactNode) => (
    <div key={i} style={{ width: 86, height: 104, border: `5px solid ${C.ink}`, borderRadius: 12, background: ch === ' ' ? 'transparent' : bg, borderColor: ch === ' ' ? 'transparent' : C.ink, display: 'grid', placeItems: 'center', fontFamily: HEAD, fontSize: 60, boxShadow: ch === ' ' ? 'none' : shadow(5) }}>
      {extra ?? ch}
    </div>
  );
  return (
    <>
      <At x={540} y={290} s={pop(t, 0)} r={-2}>
        <Sticker bg={C.white} size={44}>1951 · Eksperimen Shannon</Sticker>
      </At>
      <At x={540} y={530} s={pop(t, 6, 160)}>
        <div style={{ display: 'flex', gap: 8 }}>
          {letters.map((ch, i) => cell(ch, i))}
          {cell('N', 98, guessN > 0 ? C.yellow : C.white, guessN > 0 ? <span style={{ transform: `scale(${guessN})` }}>N</span> : <span style={{ opacity: Math.floor(t / 8) % 2 }}>_</span>)}
          {cell('G', 99, guessG > 0 ? C.yellow : C.white, guessG > 0 ? <span style={{ transform: `scale(${guessG})` }}>G</span> : <span style={{ opacity: guessN > 0 ? Math.floor(t / 8) % 2 : 0 }}>_</span>)}
        </div>
      </At>
      <At x={540} y={690} s={pop(t, 14, 200)} r={2}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38 }}>Huruf berikutnya apa?</div>
      </At>
      {/* the modern version */}
      <At x={540} y={1080} s={pop(t, aiIn, 150)} r={-1}>
        <Box bg={C.white} pad="26px 34px" style={{ width: 900 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: HEAD, fontSize: 40, marginBottom: 18 }}>
            <Spark size={50} rot={t * 2} /> AI juga main tebak-tebakan
          </div>
          <div style={{ fontFamily: BODY, fontSize: 40, fontWeight: 500, marginBottom: 20 }}>"Selamat makan <span style={{ background: C.yellow, border: `3px solid ${C.ink}`, borderRadius: 8, padding: '0 10px', fontWeight: 700 }}>___</span>"</div>
          {bars.map(([w, p], i) => {
            const g = ease(t, aiIn + 10 + i * 5, aiIn + 30 + i * 5);
            return (
              <div key={w} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 90px', alignItems: 'center', gap: 14, marginTop: 10, fontFamily: BODY, fontWeight: 700, fontSize: 32 }}>
                <span>{w}</span>
                <div style={{ height: 34, border: `4px solid ${C.ink}`, borderRadius: 8, background: C.rice }}>
                  <div style={{ width: `${p * 100 * g}%`, height: '100%', background: i ? C.blue : C.orange }} />
                </div>
                <span style={{ fontFamily: MONO, fontSize: 28, textAlign: 'right' }}>{Math.round(p * 100 * g)}%</span>
              </div>
            );
          })}
          <div style={{ fontFamily: BODY, fontSize: 22, marginTop: 14, opacity: 0.6 }}>ilustrasi, bukan angka asli</div>
        </Box>
      </At>
    </>
  );
};

/* 9 · lifespans timeline ---------------------------------------------- */
const Lifespan: React.FC<SceneProps> = ({ t }) => {
  const X0 = 110, X1 = 970, Y0 = 1900, Y1 = 2010;
  const x = (y: number) => X0 + ((y - Y0) / (Y1 - Y0)) * (X1 - X0);
  const rows: { name: string; a: number; b: number; color: string; age: string; y: number; d: number }[] = [
    { name: 'Alan Turing', a: 1912, b: 1954, color: C.blue, age: '41 tahun', y: 600, d: 6 },
    { name: 'Claude Shannon', a: 1916, b: 2001, color: C.orange, age: '84 tahun', y: 860, d: 14 },
  ];
  return (
    <>
      <At x={540} y={300} s={pop(t, 0)} r={-2}>
        <Sticker bg={C.white} size={44}>Umur mereka</Sticker>
      </At>
      {rows.map((r) => {
        const g = ease(t, r.d, r.d + 30);
        const w = (x(r.b) - x(r.a)) * g;
        return (
          <React.Fragment key={r.name}>
            <div style={{ position: 'absolute', left: x(r.a), top: r.y - 110, fontFamily: HEAD, fontSize: 42, opacity: lin(t, r.d, r.d + 6) }}>{r.name}</div>
            <div style={{ position: 'absolute', left: x(r.a), top: r.y - 40, width: w, height: 80, background: r.color, border: `${BORDER}px solid ${C.ink}`, borderRadius: 14, boxShadow: shadow(8) }} />
            {g > 0.98 && (
              <>
                <div style={{ position: 'absolute', left: x(r.a) - 30, top: r.y + 54, fontFamily: MONO, fontWeight: 700, fontSize: 30 }}>{r.a}</div>
                <div style={{ position: 'absolute', left: x(r.b) - 40, top: r.y + 54, fontFamily: MONO, fontWeight: 700, fontSize: 30 }}>{r.b}</div>
                <At x={x(r.a) + w / 2} y={r.y} s={pop(t, r.d + 30, 240)}>
                  <div style={{ fontFamily: HEAD, fontSize: 40 }}>{r.age}</div>
                </At>
              </>
            )}
          </React.Fragment>
        );
      })}
      {/* axis */}
      <div style={{ position: 'absolute', left: X0, top: 1080, width: X1 - X0, height: 8, background: C.ink, borderRadius: 4 }} />
      {[1900, 1925, 1950, 1975, 2000].map((y) => (
        <div key={y} style={{ position: 'absolute', left: x(y) - 40, top: 1100, width: 80, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 28 }}>{y}</div>
      ))}
      {[[1943, 'ketemu', C.yellow], [1948, 'bit', C.green]].map(([y, l, c], i) => (
        <At key={String(y)} x={x(Number(y))} y={1200 + i * 80} s={pop(t, 40 + i * 6, 220)}>
          <Box bg={String(c)} pad="4px 14px" radius={10} sh={5} style={{ fontFamily: HEAD, fontSize: 28, whiteSpace: 'nowrap' }}>{y} · {l}</Box>
        </At>
      ))}
    </>
  );
};

/* 10 · lempar ke meja --------------------------------------------------- */
const Ask: React.FC<SceneProps> = ({ t }) => (
  <>
    <At x={540} y={300} s={pop(t, 0)} r={-3}>
      <Box bg={C.orange} pad="14px 34px" style={{ fontFamily: HEAD, fontSize: 64 }}>LEMPAR KE MEJA!</Box>
    </At>
    <At x={290} y={790} s={pop(t, 6, 160)} r={-4}>
      <Photo src="alan-turing.png" w={400} h={480} name="Turing" pos="50% 20%" />
    </At>
    <At x={790} y={790} s={pop(t, 10, 160)} r={4}>
      <Photo src="claude-shannon.png" w={400} h={480} name="Shannon" pos="35% 30%" />
    </At>
    <At x={540} y={780} s={pop(t, 18, 260) * (1 + 0.06 * Math.sin(t / 4))} r={-8}>
      <div style={{ width: 170, height: 170, borderRadius: '50%', background: C.yellow, border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(9), display: 'grid', placeItems: 'center', fontFamily: HEAD, fontSize: 76 }}>VS</div>
    </At>
    <At x={540} y={1250} s={pop(t, 26, 200)} r={2}>
      <Sticker bg={C.white} size={42}>Tulis jawabanmu di komentar</Sticker>
    </At>
  </>
);

/* 11 · outro ----------------------------------------------------------- */
const Outro: React.FC<SceneProps> = ({ t }) => (
  <>
    <At x={540} y={620} s={pop(t, 0, 150)}>
      <Plate size={520} spin={Math.sin(t / 10) * 6} />
    </At>
    <At x={540} y={1000} s={pop(t, 6, 200)} r={-2}>
      <Box bg={C.orange} pad="16px 34px" style={{ fontFamily: HEAD, fontSize: 60, textAlign: 'center', lineHeight: 1.08 }}>
        Trims udah makan<br />siang bareng!
      </Box>
    </At>
    <At x={540} y={1200} s={pop(t, 14, 220)} r={3}>
      <Sticker bg={C.yellow} size={40}>Besok lauk baru</Sticker>
    </At>
    <At x={540} y={1330} s={pop(t, 20, 220)}>
      <div style={{ fontFamily: HEAD, fontSize: 48 }}>@faqihpedia</div>
    </At>
  </>
);

export const SCENES: Record<string, React.FC<SceneProps>> = {
  hook: Hook,
  bumper: Bumper,
  shannon: Shannon,
  bit: Bit,
  turing: Turing,
  turingWork: TuringWork,
  meet: Meet,
  predict: Predict,
  lifespan: Lifespan,
  ask: Ask,
  outro: Outro,
};
