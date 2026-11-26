import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { At, Box, Sticker, between, ease, lin, pop } from './components';
import { Fx, SheetUI } from './Sheet';
import { BODY, BORDER, C, HEAD, MONO, PARTS, cue, s, shadow } from './theme';

/*
 * One scene per VO part. Every time is in absolute seconds, taken from the
 * word timestamps in timing.ts (cue(part, word)), so the edit follows the
 * voice even if the VO is regenerated.
 */

const typed = (f: number, a: number, b: number, len: number) => interpolate(f, [s(a), s(b)], [0, len], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* ------------------------------------------------------------------ */
/* small drawings                                                      */
/* ------------------------------------------------------------------ */
export const Dumbbell: React.FC<{ w?: number; color?: string }> = ({ w = 260, color = C.ink }) => {
  const k = w / 260;
  const plate = (h: number, x: number) => (
    <div style={{ position: 'absolute', left: x * k, top: (100 - h) / 2 * k, width: 26 * k, height: h * k, background: color, border: `${4 * k}px solid ${C.ink}`, borderRadius: 8 * k, boxSizing: 'border-box' }} />
  );
  return (
    <div style={{ position: 'relative', width: w, height: 100 * k }}>
      <div style={{ position: 'absolute', left: 30 * k, top: 42 * k, width: 200 * k, height: 16 * k, background: C.ink, borderRadius: 8 * k }} />
      {plate(100, 18)}
      {plate(76, 46)}
      {plate(76, 188)}
      {plate(100, 216)}
    </div>
  );
};

const Logo: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <Box bg={C.green} pad="22px 40px" style={{ display: 'flex', alignItems: 'center', gap: 26, transform: `scale(${scale})` }}>
    <Dumbbell w={150} color={C.white} />
    <div style={{ fontFamily: HEAD, fontSize: 64, lineHeight: 0.95 }}>
      SPREADSHEET
      <br />
      GYM
    </div>
  </Box>
);

/** small logo chip that sits at the top of every explaining scene */
export const TopChip: React.FC = () => {
  const f = useCurrentFrame();
  const o = lin(f, s(PARTS[2].start) - 10, s(PARTS[2].start)) * (1 - lin(f, s(PARTS[7].start) - 10, s(PARTS[7].start)));
  return (
    <At x={540} y={96} o={o}>
      <Sticker bg={C.green} size={30} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Dumbbell w={60} color={C.white} /> Spreadsheet Gym
      </Sticker>
    </At>
  );
};

const Bookmark: React.FC<{ size?: number }> = ({ size = 240 }) => (
  <div style={{ position: 'relative', width: size, height: size * 1.25 }}>
    <div style={{ position: 'absolute', left: 14, top: 14, width: size, height: size * 1.25, background: C.ink, clipPath: 'polygon(0 0,100% 0,100% 100%,50% 76%,0 100%)' }} />
    <div style={{ position: 'absolute', inset: 0, background: C.ink, clipPath: 'polygon(0 0,100% 0,100% 100%,50% 76%,0 100%)' }} />
    <div style={{ position: 'absolute', left: 9, top: 9, width: size - 18, height: size * 1.25 - 30, background: C.pink, clipPath: 'polygon(0 0,100% 0,100% 100%,50% 76%,0 100%)' }} />
  </div>
);

const Tag: React.FC<{ ok: boolean; children: React.ReactNode }> = ({ ok, children }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ok ? C.green : C.red, border: `4px solid ${C.ink}`, borderRadius: 12, padding: '4px 14px', fontFamily: HEAD, fontSize: 26, color: C.ink }}>
    {ok ? '✓' : '✗'} {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* 0. hook                                                             */
/* ------------------------------------------------------------------ */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[0].start);
  const tF = s(cue(0, 'formula'));
  const tFn = s(cue(0, 'function'));
  const tBeda = s(cue(0, 'beda'));
  const shake = f > tBeda ? Math.sin((f - tBeda) * 1.3) * 6 * (1 - lin(f, tBeda, tBeda + 18)) : 0;
  return (
    <>
      <At x={540} y={330} s={pop(f, t0)} r={-4}>
        <Sticker bg={C.red} size={58} style={{ color: C.white }}>Jangan salah lagi!</Sticker>
      </At>
      <At x={540} y={500} s={pop(f, t0 + 8)} o={lin(f, t0 + 8, t0 + 12)}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40 }}>di Excel atau Spreadsheet…</div>
      </At>
      <At x={540 + shake} y={740} s={pop(f, tF)} r={-2}>
        <Box bg={C.yellow} pad="26px 60px" style={{ fontFamily: HEAD, fontSize: 104 }}>FORMULA</Box>
      </At>
      <At x={540} y={940} s={pop(f, tBeda, 220)} z={2}>
        <div style={{ width: 170, height: 170, borderRadius: 85, background: C.pink, border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(9), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 120, lineHeight: 1 }}>≠</div>
      </At>
      <At x={540 - shake} y={1140} s={pop(f, tFn)} r={2}>
        <Box bg={C.blue} pad="26px 60px" style={{ fontFamily: HEAD, fontSize: 104 }}>FUNCTION</Box>
      </At>
      <At x={540} y={1340} s={pop(f, tBeda + 4)} r={-3}>
        <Sticker bg={C.ink} size={54} style={{ color: C.yellow }}>Itu beda!</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 1. segment intro                                                    */
/* ------------------------------------------------------------------ */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[1].start);
  const tLat = s(cue(1, 'latihan'));
  const tKet = s(cue(1, 'ketuker'));
  const lift = Math.sin((f - t0) / 7) * 10;
  const swap = ease(f, tKet, tKet + 16);
  return (
    <>
      <At x={540} y={560 + lift} s={pop(f, t0)} r={-2}>
        <Logo />
      </At>
      <At x={540} y={860} s={pop(f, tLat)} r={3}>
        <Sticker bg={C.yellow} size={40}>Latihan hari ini</Sticker>
      </At>
      <At x={540 - 230 + 460 * swap} y={1060} s={pop(f, tLat + 6)}>
        <Box bg={C.yellow} pad="14px 30px" style={{ fontFamily: HEAD, fontSize: 56 }}>Formula</Box>
      </At>
      <At x={540} y={1060} s={pop(f, tLat + 9)}>
        <div style={{ fontFamily: HEAD, fontSize: 48 }}>vs</div>
      </At>
      <At x={540 + 230 - 460 * swap} y={1060} s={pop(f, tLat + 12)}>
        <Box bg={C.blue} pad="14px 30px" style={{ fontFamily: HEAD, fontSize: 56 }}>Function</Box>
      </At>
      <At x={540} y={1260} s={pop(f, tKet)} r={-3}>
        <Sticker bg={C.pink} size={42}>⇄ sering banget ketuker</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 2. what a formula is                                                */
/* ------------------------------------------------------------------ */
const Formula: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[2].start);
  const tKetik = cue(2, 'ketik');
  const tEq = cue(2, 'sama');
  const tCon = cue(2, 'contoh');
  const tUdah = cue(2, 'udah');
  const tTambah = cue(2, 'tambah');
  const text = '=A1+B1';
  const n = f < s(tEq) ? 0 : f < s(tCon) ? 1 : typed(f, tCon + 0.3, tCon + 1.6, text.length);
  const done = f >= s(tUdah);
  const editing = f >= s(tKetik) && !done;
  const colors = { A1: C.sel, B1: '#D6249F' };
  const eqMark = between(f, s(tEq), s(tCon) + 10);
  return (
    <>
      <At x={540} y={250} s={pop(f, t0)} r={-2}>
        <Box bg={C.yellow} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 70 }}>FORMULA</Box>
      </At>
      <At x={540} y={760} s={0.4 + 0.6 * pop(f, t0 + 4)}>
        <SheetUI
          cols={3}
          rows={4}
          selected="C1"
          cells={{
            A1: '10', B1: '5',
            C1: done ? <b>15</b> : editing ? <Fx text={text} n={n} colors={colors} caret={f % 30 < 18} /> : '',
          }}
          cellStyle={{ C1: editing ? { justifyContent: 'flex-start' } : {} }}
          refs={n >= 3 && !done ? [{ cells: ['A1'], color: C.sel }, ...(n >= 6 ? [{ cells: ['B1'], color: '#D6249F' }] : [])] : []}
          bar={f >= s(tKetik) ? <Fx text={text} n={done ? undefined : n} colors={colors} /> : ''}
        />
      </At>
      {/* "starts with =" callout pointing at the formula bar */}
      <At x={420} y={420} s={pop(f, s(tEq))} o={eqMark}>
        <Sticker bg={C.pink} size={40}>diawali tanda “=”</Sticker>
      </At>
      <At x={540} y={1240} s={pop(f, s(tUdah))} r={-3}>
        <Sticker bg={C.green} size={52}>✓ Ini udah formula</Sticker>
      </At>
      <At x={540} y={1380} s={pop(f, s(tTambah))} r={2}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '8px 22px' }}>
          walaupun cuma tambah-tambahan biasa
        </div>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 3. what a function is                                               */
/* ------------------------------------------------------------------ */
const FUNCS: [string, string][] = [
  ['SUM', 'Menjumlahkan angka'],
  ['AVERAGE', 'Rata-rata'],
  ['VLOOKUP', 'Cari data di tabel'],
];

const Func: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[3].start);
  const tRumus = cue(3, 'rumus');
  const tNama = cue(3, 'nama');
  const tKurung = cue(3, 'kurung');
  const tKayak = cue(3, 'kayak');
  const hl = [cue(3, 'sum', 0, 99), cue(3, 'average', 0, 99), cue(3, 'vlookup', 0, 99)];
  // fall back to an even spread after "kayak" if whisper spelled the names differently
  const fn = hl.map((t, i) => (t - PARTS[3].start > 90 ? tKayak + 0.4 + i * 0.7 : t));
  let active = -1;
  fn.forEach((t, i) => f >= s(t) && (active = i));
  const drop = pop(f, s(tRumus));
  const anat = pop(f, s(tNama));
  const nameOn = f >= s(tNama);
  const parOn = f >= s(tKurung);
  const barText = f < s(tRumus) ? '=' : '=S';
  return (
    <>
      <At x={540} y={250} s={pop(f, t0)} r={2}>
        <Box bg={C.blue} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 70 }}>FUNCTION</Box>
      </At>
      <At x={540} y={700} s={0.4 + 0.6 * pop(f, t0 + 4)}>
        <SheetUI
          cols={3}
          rows={4}
          selected="C1"
          cells={{ A1: '10', B1: '5', C1: <Fx text={barText} caret={f % 30 < 18} /> }}
          cellStyle={{ C1: { justifyContent: 'flex-start' } }}
          bar={<Fx text={barText} />}
          overlay={
            <div
              style={{
                position: 'absolute', left: 70 + 2 * 303, top: 54 + 88, transformOrigin: 'top left', transform: `translateX(-300px) scale(${drop})`,
                width: 560, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, boxShadow: shadow(8), overflow: 'hidden',
              }}
            >
              <div style={{ padding: '10px 20px', fontSize: 24, fontWeight: 700, color: '#555', borderBottom: `3px solid ${C.ink}`, background: C.head }}>Function bawaan Excel</div>
              {FUNCS.map(([name, desc], i) => (
                <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '14px 20px', background: active === i ? C.yellow : C.white, borderTop: i ? `2px solid ${C.grid}` : undefined }}>
                  <span style={{ fontFamily: MONO, fontSize: 36 }}>{name}</span>
                  <span style={{ fontSize: 26, color: '#444' }}>{desc}</span>
                </div>
              ))}
            </div>
          }
        />
      </At>
      <At x={540} y={1180} s={pop(f, s(tRumus) + 4)} r={-2}>
        <Sticker bg={C.yellow} size={40}>Rumus jadi, udah disiapin Excel</Sticker>
      </At>
      {/* anatomy: name + parentheses */}
      <At x={540} y={1370} s={anat}>
        <Box pad="18px 34px" style={{ fontFamily: MONO, fontSize: 64, display: 'flex', alignItems: 'center' }}>
          <span>=</span>
          <span style={{ background: nameOn ? C.yellow : 'transparent', borderRadius: 8, padding: '0 6px' }}>SUM</span>
          <span style={{ background: parOn ? C.pink : 'transparent', borderRadius: 8, padding: '0 4px' }}>(</span>
          <span style={{ color: C.sel }}>A1:B1</span>
          <span style={{ background: parOn ? C.pink : 'transparent', borderRadius: 8, padding: '0 4px' }}>)</span>
        </Box>
      </At>
      <At x={420} y={1480} s={pop(f, s(tNama) + 6)}>
        <div style={{ fontFamily: HEAD, fontSize: 32 }}>↑ nama</div>
      </At>
      <At x={720} y={1480} s={pop(f, s(tKurung))}>
        <div style={{ fontFamily: HEAD, fontSize: 32 }}>↑ kurung ↑</div>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 4. gym analogy                                                      */
/* ------------------------------------------------------------------ */
const Gym: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[4].start);
  const tFn = cue(4, 'function');
  const tTinggal = cue(4, 'tinggal');
  const tFo = cue(4, 'formula');
  const tNyusun = cue(4, 'nyusun');
  const steps = ['Pemanasan 5 menit', 'Angkat dumbel 3×10', 'Treadmill 10 menit'];
  const lift = Math.sin((f - t0) / 6) * 12;
  return (
    <>
      <At x={540} y={250} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.orange} size={52}>Gampangnya gini…</Sticker>
      </At>
      {/* function = the equipment */}
      <At x={290} y={760} s={pop(f, s(tFn))} r={-2}>
        <Box bg={C.blue} pad="26px 24px" style={{ width: 440, height: 620, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ fontFamily: HEAD, fontSize: 52 }}>FUNCTION</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36 }}>= alatnya</div>
          <div style={{ marginTop: 30 + lift }}>
            <Dumbbell w={300} color={C.white} />
          </div>
          <div style={{ marginTop: 'auto', fontFamily: BODY, fontWeight: 700, fontSize: 32, textAlign: 'center', opacity: lin(f, s(tTinggal), s(tTinggal) + 8) }}>
            Udah jadi,
            <br />
            tinggal dipakai
          </div>
        </Box>
      </At>
      {/* formula = the workout you put together */}
      <At x={790} y={760} s={pop(f, s(tFo))} r={2}>
        <Box bg={C.yellow} pad="26px 24px" style={{ width: 440, height: 620, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ fontFamily: HEAD, fontSize: 52 }}>FORMULA</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36 }}>= gerakannya</div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
            {steps.map((st, i) => {
              const o = lin(f, s(tFo) + 8 + i * 8, s(tFo) + 14 + i * 8);
              const usesTool = i > 0;
              return (
                <div key={st} style={{ opacity: o, transform: `translateX(${(1 - o) * 30}px)`, background: usesTool ? C.blue : C.white, border: `4px solid ${C.ink}`, borderRadius: 12, padding: '10px 14px', fontFamily: BODY, fontWeight: 700, fontSize: 28 }}>
                  {i + 1}. {st}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 'auto', fontFamily: BODY, fontWeight: 700, fontSize: 32, textAlign: 'center', opacity: lin(f, s(tNyusun) - 6, s(tNyusun) + 2) }}>
            Kalian
            <br />
            yang nyusun
          </div>
        </Box>
      </At>
      <At x={540} y={1210} s={pop(f, s(tNyusun) + 6)} r={-2}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '8px 22px' }}>
          gerakannya bisa pakai alat, bisa juga nggak
        </div>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 5. side by side: =A1+…+A5 vs =SUM(A1:A5)                            */
/* ------------------------------------------------------------------ */
const LONG = '=A1+A2+A3+A4+A5';
const SHORT = '=SUM(A1:A5)';
const REF_COLORS: Record<string, string> = { A1: C.sel, A2: '#D6249F', A3: '#E37400', A4: '#188038', A5: '#9334E6' };

const Compare: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = PARTS[5].start;
  const tNggak = cue(5, 'nggak');
  const tKalau = cue(5, 'kalau');
  const tSum2 = cue(5, 'sum', 1, 9);
  const tHasil = cue(5, 'hasil');
  const tPendek = cue(5, 'pendek');
  const phase2 = f >= s(tKalau);
  const n1 = typed(f, t0 + 0.6, t0 + 3.6, LONG.length);
  const n2 = typed(f, tKalau + 0.5, tKalau + 1.8, SHORT.length);
  const text = phase2 ? SHORT : LONG;
  const n = phase2 ? n2 : n1;
  const done = phase2 ? n2 >= SHORT.length : n1 >= LONG.length;
  const shown = text.slice(0, Math.floor(n));
  const refs = phase2
    ? shown.includes('A1:A5') ? [{ cells: ['A1', 'A2', 'A3', 'A4', 'A5'], color: C.sel }] : []
    : Object.entries(REF_COLORS).filter(([a]) => shown.includes(a)).map(([a, color]) => ({ cells: [a], color }));
  const card = (y: number, code: string, start: number, colors: Record<string, string> | undefined, tags: React.ReactNode, len: number) => (
    <At x={540} y={y} s={pop(f, s(start))}>
      <Box pad="18px 26px" style={{ width: 960, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: MONO, fontSize: 46 }}>
            <Fx text={code} colors={colors} />
          </span>
          <span style={{ opacity: lin(f, s(tHasil), s(tHasil) + 6), fontFamily: HEAD, fontSize: 40, background: C.green, border: `4px solid ${C.ink}`, borderRadius: 12, padding: '2px 14px' }}>150</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>{tags}</div>
        <div style={{ height: 22, opacity: lin(f, s(tPendek) - 4, s(tPendek) + 4), display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: len * 40 * ease(f, s(tPendek) - 4, s(tPendek) + 12), height: 18, background: C.ink, borderRadius: 9 }} />
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24 }}>{len} karakter</span>
        </div>
      </Box>
    </At>
  );
  return (
    <>
      <At x={540} y={540} s={0.4 + 0.6 * pop(f, s(t0))}>
        <SheetUI
          cols={2}
          rows={6}
          rowH={74}
          colW={[420, 478]}
          selected="A6"
          cells={{
            A1: '10', A2: '20', A3: '30', A4: '40', A5: '50',
            A6: done ? <b>150</b> : <Fx text={text} n={n} colors={phase2 ? undefined : REF_COLORS} caret={f % 30 < 18} />,
            B6: 'Total',
          }}
          cellStyle={{ A6: done ? { background: '#FFF6B3' } : { justifyContent: 'flex-start' }, B6: { justifyContent: 'flex-start', fontFamily: BODY, fontWeight: 700, color: '#555' } }}
          refs={done ? [] : refs}
          bar={<Fx text={text} n={done ? undefined : n} colors={phase2 ? undefined : REF_COLORS} />}
        />
      </At>
      {card(1080, LONG, Math.max(t0 + 3.6, tNggak - 1.2), REF_COLORS, <>
        <Tag ok>formula</Tag>
        <span style={{ opacity: lin(f, s(tNggak), s(tNggak) + 6) }}><Tag ok={false}>nggak pakai function</Tag></span>
      </>, LONG.length)}
      {card(1330, SHORT, tKalau + 1.8, undefined, <>
        <Tag ok>formula</Tag>
        <span style={{ opacity: lin(f, s(tSum2), s(tSum2) + 6) }}><Tag ok>pakai function SUM</Tag></span>
      </>, SHORT.length)}
      <At x={830} y={1500} s={pop(f, s(tPendek) + 8)} r={-4}>
        <Sticker bg={C.pink} size={36}>Lebih pendek!</Sticker>
      </At>
      <At x={300} y={1500} s={pop(f, s(tHasil))} r={3}>
        <Sticker bg={C.green} size={36}>Hasilnya sama</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 6. the takeaway: function sits inside formula                       */
/* ------------------------------------------------------------------ */
const Takeaway: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[6].start);
  const tDalam = s(cue(6, 'dalam'));
  const tTapi = s(cue(6, 'tapi'));
  const tBelum = s(cue(6, 'belum'));
  const big = pop(f, t0 + 6);
  const inner = pop(f, tDalam - 6);
  const drop = interpolate(inner, [0, 1], [-420, 0]);
  return (
    <>
      <At x={540} y={240} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.ink} size={52} style={{ color: C.yellow }}>Intinya</Sticker>
      </At>
      <At x={540} y={860} s={big}>
        <div style={{ width: 860, height: 860, borderRadius: 430, background: C.yellow, border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(14), position: 'relative' }}>
          <div style={{ position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 64 }}>FORMULA</div>
          <div style={{ position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 30 }}>semua yang diawali “=”</div>
        </div>
      </At>
      <At x={540} y={960 + drop} s={inner} z={2}>
        <div style={{ width: 400, height: 400, borderRadius: 200, background: C.blue, border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(9), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ fontFamily: HEAD, fontSize: 52 }}>FUNCTION</div>
          <div style={{ fontFamily: MONO, fontSize: 30 }}>SUM( )</div>
          <div style={{ fontFamily: MONO, fontSize: 30 }}>AVERAGE( )</div>
        </div>
      </At>
      <At x={540} y={1170} s={pop(f, tDalam + 4)} z={3} r={-3}>
        <Sticker bg={C.green} size={34}>selalu di dalam formula</Sticker>
      </At>
      {/* a formula without a function lives in the yellow ring */}
      <At x={540} y={620} s={pop(f, tTapi)} z={3} r={2}>
        <Box pad="10px 26px" style={{ fontFamily: MONO, fontSize: 48 }}>
          <Fx text="=A1+B1" />
        </Box>
      </At>
      <At x={540} y={1420} s={pop(f, tBelum)} r={2}>
        <Sticker bg={C.pink} size={40}>Formula belum tentu pakai function</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 7. outro                                                            */
/* ------------------------------------------------------------------ */
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[7].start);
  const tSimpan = s(cue(7, 'simpan'));
  const pulse = 1 + 0.06 * Math.sin(Math.max(0, f - tSimpan) / 4) * (f > tSimpan ? 1 : 0);
  return (
    <>
      <At x={540} y={360} s={pop(f, t0)} r={-3}>
        <Box bg={C.yellow} pad="22px 40px" style={{ fontFamily: HEAD, fontSize: 64, textAlign: 'center', lineHeight: 1.05 }}>
          Jangan ketuker
          <br />
          lagi ya!
        </Box>
      </At>
      <At x={540} y={840} s={pop(f, tSimpan) * pulse}>
        <Bookmark size={260} />
      </At>
      <At x={540} y={1100} s={pop(f, tSimpan + 4)} r={2}>
        <Sticker bg={C.ink} size={48} style={{ color: C.white }}>Simpan video ini</Sticker>
      </At>
      <At x={540} y={1330} s={pop(f, tSimpan + 10)}>
        <Logo scale={0.85} />
      </At>
    </>
  );
};

const LIST = [Hook, Intro, Formula, Func, Gym, Compare, Takeaway, Outro];

export const SCENES: { from: number; to: number; C: React.FC }[] = LIST.map((Comp, i) => ({
  from: i === 0 ? 0 : PARTS[i].start - 0.15,
  to: i + 1 < PARTS.length ? PARTS[i + 1].start - 0.15 : 9999,
  C: Comp,
}));

/** sound-effect cue times (seconds) that match the pops above */
export const POPS: number[] = [
  PARTS[0].start, cue(0, 'formula'), cue(0, 'function'), cue(0, 'beda'),
  PARTS[1].start, cue(1, 'latihan'), cue(1, 'ketuker'),
  PARTS[2].start, cue(2, 'sama'), cue(2, 'udah'), cue(2, 'tambah'),
  PARTS[3].start, cue(3, 'rumus'), cue(3, 'nama'), cue(3, 'kurung'),
  PARTS[4].start, cue(4, 'function'), cue(4, 'formula'),
  PARTS[5].start, cue(5, 'nggak'), cue(5, 'kalau'), cue(5, 'hasil'), cue(5, 'pendek'),
  PARTS[6].start, cue(6, 'dalam'), cue(6, 'tapi'), cue(6, 'belum'),
  PARTS[7].start, cue(7, 'simpan'),
];
export const DINGS: number[] = [cue(2, 'udah'), cue(5, 'hasil'), cue(7, 'simpan')];
export const THUDS: number[] = [cue(0, 'beda'), cue(6, 'dalam')];
