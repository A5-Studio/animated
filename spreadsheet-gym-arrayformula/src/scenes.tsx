import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { At, Box, Sticker, between, lin, pop } from './components';
import { Fx, SheetUI } from './Sheet';
import { BODY, BORDER, C, EPISODE, HEAD, MONO, PARTS, cue, s, shadow } from './theme';

/*
 * Spreadsheet Gym · Sesi 02 · ARRAYFORMULA. One scene per recorded VO clip, in order:
 *  0 hook · 1 bumper · 2 bos kirim data · 3 data baru, total kosong · 4 gimana caranya
 *  5 pause dulu (+5 s timer) · 6 jawabannya ARRAYFORMULA · 7 satu kolom terisi · 8 kenapa bisa
 *  9 baris per baris · 10 jebakan · 11 biar rapi (IF) · 12 berbarengan fungsi lain · 13 intinya
 *  14 catatan (Excel) · 15 latihan · 16 like, save, share, follow
 * Times come from the word timestamps of the VO (cue(part, word)).
 */

/* ------------------------------------------------------------------ */
/* brand drawings + small parts                                        */
/* ------------------------------------------------------------------ */
export const Barbell: React.FC<{ w?: number }> = ({ w = 230 }) => (
  <svg viewBox="0 0 230 120" width={w} height={(w * 120) / 230} style={{ display: 'block' }}>
    <rect x="58" y="52" width="114" height="16" rx="4" fill="#fff" stroke="#111" strokeWidth="5" />
    <text x="115" y="65" textAnchor="middle" fontFamily="Space Mono, monospace" fontStyle="italic" fontWeight="700" fontSize="14" fill="#111">fx</text>
    <g stroke="#111" strokeWidth="5" fill="#fff">
      <rect x="10" y="14" width="48" height="92" rx="6" />
      <rect x="172" y="14" width="48" height="92" rx="6" />
    </g>
    <g stroke="#111" strokeWidth="3">
      <line x1="34" y1="14" x2="34" y2="106" /><line x1="10" y1="45" x2="58" y2="45" /><line x1="10" y1="75" x2="58" y2="75" />
      <line x1="196" y1="14" x2="196" y2="106" /><line x1="172" y1="45" x2="220" y2="45" /><line x1="172" y1="75" x2="220" y2="75" />
    </g>
    <rect x="12" y="47" width="20" height="26" fill={C.green} />
    <rect x="198" y="47" width="20" height="26" fill={C.green} />
  </svg>
);

const Bubble: React.FC<{ who: string; children: React.ReactNode }> = ({ who, children }) => (
  <div style={{ position: 'relative' }}>
    <Box pad="18px 28px" radius={26} style={{ maxWidth: 860 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, marginBottom: 6 }}>{who}</div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 44, lineHeight: 1.15 }}>{children}</div>
    </Box>
    <div style={{ position: 'absolute', left: 50, bottom: -30, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `34px solid ${C.ink}` }} />
  </div>
);

const Cursor: React.FC<{ size?: number }> = ({ size = 70 }) => (
  <svg viewBox="0 0 60 80" width={size} height={(size * 94) / 70} style={{ display: 'block' }}>
    <polygon points="4,4 4,64 20,50 32,76 44,70 32,46 54,46" fill={C.white} stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
  </svg>
);

const Plane: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
    <polygon points="6,46 94,8 64,92 48,58" fill={C.white} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
    <polyline points="94,8 48,58" fill="none" stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
  </svg>
);

const Heart: React.FC<{ size?: number; on?: boolean }> = ({ size = 120, on }) => (
  <svg viewBox="0 0 100 90" width={size} height={size * 0.9} style={{ display: 'block' }}>
    <path d="M50 84 C20 62 6 46 6 28 C6 14 17 6 29 6 C39 6 46 12 50 20 C54 12 61 6 71 6 C83 6 94 14 94 28 C94 46 80 62 50 84 Z" fill={on ? C.red : C.white} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
  </svg>
);

const Bookmark: React.FC<{ size?: number; on?: boolean }> = ({ size = 110, on }) => (
  <svg viewBox="0 0 80 100" width={size * 0.8} height={size} style={{ display: 'block' }}>
    <path d="M8 6 H72 V94 L40 70 L8 94 Z" fill={on ? C.yellow : C.white} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
  </svg>
);

const Chip: React.FC<{ bg?: string; children: React.ReactNode; size?: number }> = ({ bg = C.white, children, size = 34 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: bg, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '6px 16px', fontFamily: HEAD, fontSize: size, whiteSpace: 'nowrap', boxShadow: shadow(5) }}>
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* the sales sheet: A Produk, B Harga, C Qty, D Total                  */
/* ------------------------------------------------------------------ */
const ROWS: [string, string, string, string][] = [
  ['Kopi', '18.000', '3', '54.000'],
  ['Teh', '12.000', '5', '60.000'],
  ['Roti', '15.000', '2', '30.000'],
  ['Susu', '9.000', '4', '36.000'],
  ['Gula', '14.000', '1', '14.000'],
];
const NEW_ROW: [string, string, string, string] = ['Kopi', '18.000', '2', '36.000'];
const AF = '=ARRAYFORMULA(B2:B*C2:C)';
const AF_IF = '=ARRAYFORMULA(IF(B2:B="";"";B2:B*C2:C))';
const COLW = [250, 220, 140, 288];

type D = { text?: React.ReactNode; bg?: string; color?: string; o?: number };

/**
 * rows 2-6 hold ROWS; with `extra` a "⋮" row and row 501 (NEW_ROW) follow.
 * d[i] styles the total cell of data row i (0-4, and 5 = row 501).
 */
const SalesSheet: React.FC<{
  d?: D[]; bar?: React.ReactNode; selected?: string; refs?: { cells: string[]; color: string }[];
  extra?: number; colBg?: Record<string, string>; empty?: number[]; overlay?: React.ReactNode; title?: string;
}> = ({ d = [], bar, selected, refs = [], extra = 0, colBg = {}, empty = [], overlay, title = 'penjualan.xlsx' }) => {
  const rows = extra > 0 ? 8 : 6;
  const cells: Record<string, React.ReactNode> = { A1: 'Produk', B1: 'Harga', C1: 'Qty', D1: 'Total' };
  const style: Record<string, React.CSSProperties> = {};
  ['A1', 'B1', 'C1', 'D1'].forEach((a) => (style[a] = { justifyContent: 'flex-start', fontFamily: BODY, fontWeight: 700, fontSize: 34, background: C.head }));
  ROWS.forEach((r, i) => {
    const n = i + 2;
    if (empty.includes(i)) return;
    cells[`A${n}`] = r[0]; cells[`B${n}`] = r[1]; cells[`C${n}`] = r[2];
    style[`A${n}`] = { justifyContent: 'flex-start', fontFamily: BODY, fontWeight: 700, fontSize: 36 };
  });
  const dataRows = ROWS.map((_, i) => i + 2);
  if (extra > 0) {
    cells.A7 = '⋮'; style.A7 = { justifyContent: 'flex-start', fontSize: 34 };
    cells.A8 = NEW_ROW[0]; cells.B8 = NEW_ROW[1]; cells.C8 = NEW_ROW[2];
    style.A8 = { justifyContent: 'flex-start', fontFamily: BODY, fontWeight: 700, fontSize: 36 };
    dataRows.push(8);
  }
  dataRows.forEach((n, i) => {
    const di = d[i];
    if (!di) return;
    cells[`D${n}`] = di.text ?? '';
    style[`D${n}`] = { ...(style[`D${n}`] ?? {}), background: di.bg, color: di.color, opacity: di.o ?? 1, fontSize: 36 };
  });
  Object.entries(colBg).forEach(([col, bg]) => dataRows.forEach((n) => (style[`${col}${n}`] = { ...(style[`${col}${n}`] ?? {}), background: bg })));
  const rowOpacity = extra > 0 ? [1, 1, 1, 1, 1, 1, extra, extra] : undefined;
  return (
    <SheetUI
      title={title}
      cols={4}
      rows={rows}
      rowH={76}
      colW={COLW}
      cells={cells}
      cellStyle={style}
      selected={selected}
      refs={refs}
      bar={bar}
      rowLabels={extra > 0 ? [1, 2, 3, 4, 5, 6, '⋮', 501] : undefined}
      rowOpacity={rowOpacity}
      overlay={overlay}
    />
  );
};

// grid geometry of SalesSheet, for overlays (cursor, arrows)
const GX = (c: number) => 70 + COLW.slice(0, c).reduce((a, b) => a + b, 0);
const GY = (r: number) => 54 + r * 76; // r = 0-based row index
const filled = (f: number, t: number, i: number, step = 4): D => ({ text: ROWS[i][3], bg: f >= s(t) + i * step ? '#C9F9D5' : undefined, o: lin(f, s(t) + i * step, s(t) + i * step + 4) });

/* ------------------------------------------------------------------ */
/* 0. hook: "Masih narikin formula tiap ada data baru, mending coba cara ini." */
/* ------------------------------------------------------------------ */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[0].start);
  const tBaru = s(cue(0, 'baru'));
  const tMending = s(cue(0, 'mending'));
  // a cursor keeps dragging the fill handle down, every 34 frames
  const loop = ((f - t0) % 34) / 34;
  const dragY = interpolate(loop, [0, 0.15, 0.75, 1], [GY(1) + 70, GY(1) + 70, GY(5) + 70, GY(5) + 70]);
  const newRow = lin(f, tBaru - 6, tBaru + 6);
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-3}>
        <Sticker bg={C.red} size={54} style={{ color: C.white }}>Masih narikin formula?</Sticker>
      </At>
      <At x={540} y={790} s={0.92 * (0.5 + 0.5 * pop(f, t0 + 4))}>
        <SalesSheet
          extra={newRow}
          d={[...ROWS.map((r) => ({ text: r[3] })), { text: '', bg: f >= tBaru ? '#FFD4D4' : undefined }]}
          bar="=B2*C2"
          selected="D2"
          overlay={
            <div style={{ position: 'absolute', left: GX(3) + COLW[3] - 30, top: dragY, opacity: f < tMending ? 1 : 0 }}>
              <Cursor size={64} />
            </div>
          }
        />
      </At>
      <At x={540} y={1300} s={pop(f, tBaru)} r={3}>
        <Sticker bg={C.yellow} size={40}>Data baru → narik lagi</Sticker>
      </At>
      <At x={540} y={1450} s={pop(f, tMending, 220)} r={-2}>
        <Box bg={C.green} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 68 }}>Coba cara ini →</Box>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 1. bumper: "Balik lagi di Spreadsheet Gym."                         */
/* ------------------------------------------------------------------ */
const Bumper: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[1].start);
  const lift = Math.sin((f - t0) / 6) * 14;
  return (
    <>
      <At x={540} y={600 + lift} s={pop(f, t0)}>
        <Barbell w={600} />
      </At>
      <At x={540} y={890} s={pop(f, t0 + 6)} r={-2}>
        <Box bg={C.green} pad="18px 44px" style={{ fontFamily: HEAD, fontSize: 84, lineHeight: 1 }}>SPREADSHEET GYM</Box>
      </At>
      <At x={540} y={1100} s={pop(f, t0 + 14)} r={3}>
        <Sticker bg={C.white} size={64}>Sesi {String(EPISODE.n).padStart(2, '0')}</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 2. "Bos kirim data penjualan… =B2*C2… tarik ke bawah, atau klik … pojok kanan bawah." */
/* ------------------------------------------------------------------ */
const BosData: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[2].start);
  const tBaris = s(cue(2, 'baris'));
  const tKolom = cue(2, 'kolom');
  const tSama = cue(2, 'sama');
  const tTarik = cue(2, 'tarik');
  const tKlik = cue(2, 'klik');
  const n = interpolate(f, [s(tSama), s(tSama + 2.0)], [0, 6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const typedDone = n >= 6;
  const shown = '=B2*C2'.slice(0, Math.floor(n));
  const drag = lin(f, s(tTarik), s(tTarik) + 24);
  const dragRows = Math.floor(drag * 4); // fills D3..D6
  const d: D[] = ROWS.map((r, i) => {
    if (i === 0) return f < s(tSama) ? { text: '' } : typedDone ? { text: r[3], bg: '#C9F9D5' } : { text: <Fx text="=B2*C2" n={n} caret={f % 30 < 18} /> };
    return i <= dragRows && f >= s(tTarik) ? { text: r[3], bg: '#C9F9D5' } : { text: '' };
  });
  const clickPulse = f >= s(tKlik) ? ((f - s(tKlik)) % 20) / 20 : 0;
  return (
    <>
      <At x={540} y={300} s={pop(f, t0)}>
        <Bubble who="Bos:">Tolong isi kolom total ya</Bubble>
      </At>
      <At x={820} y={455} s={pop(f, tBaris)} r={4}>
        <Sticker bg={C.yellow} size={40}>500 baris</Sticker>
      </At>
      <At x={540} y={950} s={0.5 + 0.5 * pop(f, t0 + 8)}>
        <SalesSheet
          d={d}
          selected={f >= s(tKolom) ? 'D2' : undefined}
          bar={f >= s(tSama) ? <Fx text={typedDone ? '=B2*C2' : shown} /> : ''}
          refs={!typedDone && n >= 3 ? [{ cells: ['B2'], color: C.sel }, ...(n >= 6 ? [{ cells: ['C2'], color: '#D6249F' }] : [])] : []}
          overlay={
            <>
              {/* drag the fill handle down */}
              {f >= s(tTarik) && f < s(tKlik) && (
                <div style={{ position: 'absolute', left: GX(3) + COLW[3] - 26, top: GY(1) + 60 + drag * 4 * 76 }}>
                  <Cursor size={64} />
                </div>
              )}
              {/* or click the fill handle at the bottom-right corner */}
              {f >= s(tKlik) && (
                <div style={{ position: 'absolute', left: GX(4) - 14, top: GY(2) - 14 }}>
                  <div style={{ position: 'absolute', left: 7 - 40 * clickPulse, top: 7 - 40 * clickPulse, width: 14 + 80 * clickPulse, height: 14 + 80 * clickPulse, borderRadius: '50%', border: `5px solid ${C.sel}`, opacity: 1 - clickPulse }} />
                  <div style={{ position: 'absolute', left: 4, top: 4, width: 20, height: 20, background: C.sel, border: '3px solid #fff' }} />
                  <div style={{ position: 'absolute', left: 14, top: 14 }}><Cursor size={60} /></div>
                </div>
              )}
            </>
          }
        />
      </At>
      <At x={290} y={1470} s={pop(f, s(tTarik))} r={-3}>
        <Sticker bg={C.white} size={30}>↓ Tarik ke bawah</Sticker>
      </At>
      <At x={790} y={1470} s={pop(f, s(tKlik))} r={3}>
        <Sticker bg={C.blue} size={30}>atau klik ■ pojok</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 3. "Tapi tiap kali ada data baru, selalu ada bagian total yang kosong, dan kamu harus narik lagi." */
/* ------------------------------------------------------------------ */
const DataBaru: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[3].start);
  const tData = s(cue(3, 'data'));
  const tKosong = s(cue(3, 'kosong'));
  const tNarik = s(cue(3, 'narik'));
  const blink = f >= tKosong && f < tNarik ? (Math.floor((f - tKosong) / 8) % 2 ? '#FFD4D4' : '#FF9E9E') : f >= tNarik ? '#FFD4D4' : undefined;
  const loop = f >= tNarik ? ((f - tNarik) % 30) / 30 : 0;
  return (
    <>
      <At x={540} y={300} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.yellow} size={46}>Ada data baru…</Sticker>
      </At>
      <At x={540} y={870} s={0.5 + 0.5 * pop(f, t0 + 4)}>
        <SalesSheet
          extra={lin(f, tData, tData + 10)}
          d={[...ROWS.map((r) => ({ text: r[3] })), { text: '', bg: blink }]}
          overlay={
            f >= tNarik ? (
              <div style={{ position: 'absolute', left: GX(3) + COLW[3] - 26, top: interpolate(loop, [0, 1], [GY(5) + 60, GY(7) + 60]) }}>
                <Cursor size={64} />
              </div>
            ) : null
          }
        />
      </At>
      <At x={540} y={1330} s={pop(f, tKosong)} r={3}>
        <Sticker bg={C.red} size={48} style={{ color: C.white }}>Total-nya kosong!</Sticker>
      </At>
      <At x={540} y={1470} s={pop(f, tNarik)} r={-2}>
        <Sticker bg={C.white} size={40}>↻ Narik lagi… dan lagi</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 4. "Gimana caranya, satu rumus, kolom total selalu terisi ketika ada data baru?" */
/* ------------------------------------------------------------------ */
const Gimana: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[4].start);
  const tRumus = s(cue(4, 'rumus'));
  const tKolom = s(cue(4, 'kolom'));
  const tData = s(cue(4, 'data'));
  return (
    <>
      <At x={540} y={300} s={pop(f, t0)} r={-2}>
        <Box bg={C.blue} pad="16px 40px" style={{ fontFamily: HEAD, fontSize: 64 }}>Gimana caranya?</Box>
      </At>
      <At x={540} y={440} s={pop(f, tRumus)} r={2}>
        <Chip bg={C.yellow} size={44}>1 rumus</Chip>
      </At>
      <At x={540} y={940} s={0.88 * (0.5 + 0.5 * pop(f, tKolom - 4))}>
        <SalesSheet
          extra={lin(f, tData, tData + 10)}
          d={[...ROWS.map(() => ({ text: '?', color: C.sel, bg: '#E3F5FF' })), { text: '?', color: C.sel, bg: '#E3F5FF' }]}
          colBg={{}}
        />
      </At>
      <At x={540} y={1430} s={pop(f, tData)} r={-2}>
        <Sticker bg={C.green} size={40}>Kolom total selalu terisi?</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 5. "Pause dulu, coba tebak rumusnya di komen." + 5 s countdown       */
/* ------------------------------------------------------------------ */
export const TIMER_START = () => PARTS[5].end + 0.15;
export const TIMER_LEN = 5;

const Pause: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[5].start);
  const tKomen = s(cue(5, 'komen'));
  const a = s(TIMER_START());
  const p = lin(f, a, a + s(TIMER_LEN));
  const left = Math.max(0, Math.ceil(TIMER_LEN - (f - a) / 30));
  const done = f >= a + s(TIMER_LEN);
  const R = 230;
  const L = 2 * Math.PI * R;
  const beat = f >= a && !done ? 1 + 0.04 * Math.max(0, 1 - ((f - a) % 30) / 8) : 1;
  return (
    <>
      <At x={540} y={320} s={pop(f, t0)} r={-3}>
        <Box bg={C.yellow} pad="18px 44px" style={{ fontFamily: HEAD, fontSize: 80 }}>PAUSE DULU</Box>
      </At>
      <At x={540} y={830} s={pop(f, t0 + 4) * beat}>
        <div style={{ position: 'relative', width: 2 * R + 80, height: 2 * R + 80 }}>
          <svg width={2 * R + 80} height={2 * R + 80} style={{ position: 'absolute', inset: 0 }}>
            <circle cx={R + 40} cy={R + 40} r={R + 26} fill={C.white} stroke={C.ink} strokeWidth={BORDER} />
            <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={C.head} strokeWidth={34} />
            <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={done ? C.yellow : C.green} strokeWidth={34} strokeDasharray={L} strokeDashoffset={L * p} transform={`rotate(-90 ${R + 40} ${R + 40})`} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: HEAD, fontSize: done ? 120 : 220, lineHeight: 1 }}>{done ? 'WAKTU!' : f < a ? TIMER_LEN : left}</div>
            {!done && <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34 }}>detik</div>}
          </div>
        </div>
      </At>
      <At x={540} y={1300} s={pop(f, tKomen)}>
        <div style={{ position: 'relative' }}>
          <Box pad="18px 30px" radius={28}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26 }}>Komentar</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 46, color: C.formula }}>=??? <span style={{ background: C.yellow, color: C.ink, padding: '0 10px', border: `3px solid ${C.ink}`, borderRadius: 8 }}>tebak!</span></div>
          </Box>
          <div style={{ position: 'absolute', left: 50, bottom: -30, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `34px solid ${C.ink}` }} />
        </div>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 6. "Jawabannya ARRAYFORMULA. Tulis di D2: =ARRAYFORMULA( B2:B * C2:C ), enter." */
/* ------------------------------------------------------------------ */
const Jawaban: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[6].start);
  const steps: [number, number][] = [
    [cue(6, 'sama'), 1], // "="
    [cue(6, 'arrayformula', 1), 13], // "=ARRAYFORMULA"
    [cue(6, 'buka'), 14], // "("
    [cue(6, 'b2'), 18], // "B2:B"
    [cue(6, 'kali'), 19], // "*"
    [cue(6, 'c2'), 23], // "C2:C"
    [cue(6, 'tutup'), 24], // ")"
  ];
  let n = 0;
  steps.forEach(([t, k], i) => {
    const prev = i ? steps[i - 1][1] : 0;
    n = Math.max(n, interpolate(f, [s(t), s(t) + 8], [prev, k], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    if (f < s(t)) n = Math.min(n, prev);
  });
  const tEnter = cue(6, 'enter');
  const entered = f >= s(tEnter);
  const shown = AF.slice(0, Math.floor(n));
  const refs = !entered ? [
    ...(shown.includes('B2:B') ? [{ cells: ['B2', 'B3', 'B4', 'B5', 'B6'], color: C.sel }] : []),
    ...(shown.includes('C2:C') ? [{ cells: ['C2', 'C3', 'C4', 'C5', 'C6'], color: '#D6249F' }] : []),
  ] : [];
  return (
    <>
      <At x={540} y={290} s={pop(f, s(cue(6, 'arrayformula')))} r={-2}>
        <Box bg={C.green} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 76 }}>ARRAYFORMULA</Box>
      </At>
      <At x={540} y={870} s={0.5 + 0.5 * pop(f, t0 + 4)}>
        <SalesSheet
          selected="D2"
          bar={<Fx text={entered ? AF : shown} colors={{ 'B2:B': C.sel, 'C2:C': '#D6249F' }} />}
          refs={refs}
          d={ROWS.map((_, i) => (entered ? filled(f, tEnter, i, 5) : i === 0 ? { text: <span style={{ fontSize: 26 }}><Fx text={shown} caret={f % 30 < 18} /></span> } : { text: '' }))}
        />
      </At>
      <At x={540} y={1360} s={pop(f, s(cue(6, 'tulis')))} r={2}>
        <Sticker bg={C.yellow} size={40}>Tulis sekali di D2</Sticker>
      </At>
      <At x={540} y={1480} s={pop(f, s(tEnter))} r={-2}>
        <Chip bg={C.white} size={36}>⏎ Enter</Chip>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 7. "Satu kolom total langsung terisi. Ada data baru, aman."          */
/* ------------------------------------------------------------------ */
const Terisi: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[7].start);
  const tData = s(cue(7, 'data'));
  const tAman = s(cue(7, 'aman'));
  const auto = f >= tData + 12;
  return (
    <>
      <At x={540} y={300} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.green} size={48}>Satu kolom langsung terisi</Sticker>
      </At>
      <At x={540} y={880} s={0.5 + 0.5 * pop(f, t0 + 2)}>
        <SalesSheet
          bar={<Fx text={AF} />}
          extra={lin(f, tData, tData + 10)}
          d={[...ROWS.map((r) => ({ text: r[3], bg: '#C9F9D5' })), { text: auto ? NEW_ROW[3] : '', bg: auto ? (Math.floor((f - tData) / 6) % 2 ? '#C9F9D5' : C.green) : undefined }]}
        />
      </At>
      <At x={540} y={1400} s={pop(f, tAman, 220)} r={3}>
        <Box bg={C.green} pad="14px 40px" style={{ fontFamily: HEAD, fontSize: 70 }}>AMAN ✓</Box>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 8. "Kenapa bisa? Karena yang kita kasih bukan sel, tapi satu range. B2:B artinya B2 sampai paling bawah." */
/* ------------------------------------------------------------------ */
const Kenapa: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[8].start);
  const tBukan = s(cue(8, 'bukan'));
  const tRange = s(cue(8, 'range'));
  const tArtinya = s(cue(8, 'artinya'));
  const runner = lin(f, tArtinya + 6, tArtinya + 36);
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Box bg={C.blue} pad="16px 40px" style={{ fontFamily: HEAD, fontSize: 70 }}>Kenapa bisa?</Box>
      </At>
      <At x={540} y={820} s={0.5 + 0.5 * pop(f, t0 + 4)}>
        <SalesSheet
          bar={<Fx text={AF} colors={{ 'B2:B': C.sel }} />}
          refs={f >= tRange ? [{ cells: ['B2', 'B3', 'B4', 'B5', 'B6'], color: C.sel }] : f >= tBukan ? [{ cells: ['B2'], color: C.red }] : []}
          d={ROWS.map((r) => ({ text: r[3] }))}
          overlay={
            f >= tArtinya ? (
              <div style={{ position: 'absolute', left: GX(1) + COLW[1] - 60, top: GY(1) + 8 + runner * (GY(5) - GY(1) + 40), fontFamily: HEAD, fontSize: 60, color: C.sel, lineHeight: 1 }}>↓</div>
            ) : null
          }
        />
      </At>
      <At x={300} y={1260} s={pop(f, tBukan)} r={-3}>
        <Sticker bg={C.red} size={38} style={{ color: C.white }}>✗ bukan 1 sel</Sticker>
      </At>
      <At x={780} y={1260} s={pop(f, tRange)} r={3}>
        <Sticker bg={C.blue} size={38}>✓ 1 range</Sticker>
      </At>
      <At x={540} y={1430} s={pop(f, tArtinya)}>
        <Box pad="12px 30px" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 46 }}>
          <span style={{ color: C.sel }}>B2:B</span> = B2 → paling bawah
        </Box>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 9. "ARRAYFORMULA menghitung baris per baris, otomatis."             */
/* ------------------------------------------------------------------ */
const Ngitung: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[9].start);
  const tBaris = s(cue(9, 'baris'));
  const tOto = s(cue(9, 'otomatis'));
  const step = 9;
  const active = Math.floor((f - tBaris) / step) % 5;
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.yellow} size={48}>Baris per baris</Sticker>
      </At>
      <At x={540} y={830} s={0.5 + 0.5 * pop(f, t0 + 2)}>
        <SalesSheet
          bar={<Fx text={AF} />}
          d={ROWS.map((r, i) => ({ text: r[3], bg: f >= tBaris && i === active ? C.green : '#C9F9D5' }))}
          refs={f >= tBaris ? [{ cells: [`B${active + 2}`], color: C.sel }, { cells: [`C${active + 2}`], color: '#D6249F' }] : []}
          overlay={
            f >= tBaris ? (
              <div style={{ position: 'absolute', left: GX(2) + COLW[2] - 30, top: GY(active + 1) + 8, fontFamily: HEAD, fontSize: 52, lineHeight: 1 }}>→</div>
            ) : null
          }
        />
      </At>
      <At x={540} y={1290} s={pop(f, tBaris)}>
        <Box pad="12px 30px" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44 }}>
          B{active + 2} × C{active + 2} = {ROWS[Math.max(0, active)][3]}
        </Box>
      </At>
      <At x={540} y={1450} s={pop(f, tOto, 220)} r={3}>
        <Box bg={C.green} pad="12px 40px" style={{ fontFamily: HEAD, fontSize: 62 }}>OTOMATIS</Box>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 10. "Tapi ada satu jebakan: baris yang kosong hasilnya 0, atau error kalau pakai fungsi lain." */
/* ------------------------------------------------------------------ */
const Jebakan: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[10].start);
  const tJebakan = s(cue(10, 'jebakan'));
  const tKosong = s(cue(10, 'kosong'));
  const tError = s(cue(10, 'error'));
  const err = f >= tError;
  const bad = (i: number): D => (f >= tKosong + i * 3 ? { text: err ? (i === 3 ? '#N/A' : '#VALUE!') : '0', color: C.red, bg: '#FFE3E3' } : { text: '' });
  return (
    <>
      <At x={540} y={290} s={pop(f, tJebakan, 220)} r={-3}>
        <Box bg={C.red} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 70, color: C.white }}>JEBAKAN!</Box>
      </At>
      <At x={540} y={850} s={0.5 + 0.5 * pop(f, t0 + 2)}>
        <SalesSheet
          bar={<Fx text={AF} />}
          empty={[2, 3, 4]}
          d={[{ text: ROWS[0][3], bg: '#C9F9D5' }, { text: ROWS[1][3], bg: '#C9F9D5' }, bad(2), bad(3), bad(4)]}
        />
      </At>
      <At x={540} y={1300} s={pop(f, tKosong)} r={2}>
        <Sticker bg={C.white} size={40}>Baris kosong → 0</Sticker>
      </At>
      <At x={540} y={1450} s={pop(f, tError)} r={-2}>
        <Sticker bg={C.red} size={38} style={{ color: C.white }}>atau error kalau pakai fungsi lain</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 11. "Biar rapi, tambahin IF: kalau B kosong, biarin kosong. Kalau ada isinya, baru dikali." */
/* ------------------------------------------------------------------ */
const BiarRapi: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[11].start);
  const tIf = s(cue(11, 'if'));
  const tBiarin = s(cue(11, 'biarin'));
  const tAda = s(cue(11, 'ada'));
  const fade = 1 - lin(f, tBiarin, tBiarin + 10);
  const hl = (on: boolean) => (on ? { background: C.yellow, borderRadius: 6, outline: `3px solid ${C.ink}` } : {});
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.green} size={50}>Biar rapi: tambahin IF</Sticker>
      </At>
      <At x={540} y={810} s={0.5 + 0.5 * pop(f, t0 + 2)}>
        <SalesSheet
          bar={
            f >= tIf ? (
              <span style={{ fontSize: 26 }}>
                <span style={{ color: C.formula }}>=ARRAYFORMULA(</span>
                <span style={hl(true)}><span style={{ color: C.formula }}>IF(</span><span style={{ color: C.sel }}>B2:B</span><span style={{ color: C.formula }}>="";"";</span></span>
                <span style={{ color: C.sel }}>B2:B</span><span style={{ color: C.formula }}>*</span><span style={{ color: '#D6249F' }}>C2:C</span>
                <span style={hl(true)}><span style={{ color: C.formula }}>)</span></span><span style={{ color: C.formula }}>)</span>
              </span>
            ) : <Fx text={AF} />
          }
          empty={[2, 3, 4]}
          d={[{ text: ROWS[0][3], bg: '#C9F9D5' }, { text: ROWS[1][3], bg: '#C9F9D5' }, ...[2, 3, 4].map(() => ({ text: '0', color: C.red, o: fade }))]}
        />
      </At>
      <At x={540} y={1260} s={pop(f, tBiarin - 8)}>
        <Box pad="12px 26px" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38 }}>B kosong</span>
          <span style={{ fontFamily: HEAD, fontSize: 40 }}>→</span>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 38, background: C.head, padding: '0 14px', border: `3px solid ${C.ink}`, borderRadius: 8 }}>""</span>
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38 }}>kosong</span>
        </Box>
      </At>
      <At x={540} y={1420} s={pop(f, tAda)}>
        <Box bg={C.green} pad="12px 26px" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38 }}>ada isinya</span>
          <span style={{ fontFamily: HEAD, fontSize: 40 }}>→</span>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 38 }}>B × C</span>
        </Box>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 12. "Kamu juga bisa pakai ARRAYFORMULA berbarengan sama fungsi lain." */
/* ------------------------------------------------------------------ */
const Combo: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[12].start);
  const tFungsi = cue(12, 'fungsi', 0, 3.2);
  const ex: [string, string][] = [
    ['=ARRAYFORMULA(IF(…))', 'kayak tadi'],
    ['=ARRAYFORMULA(VLOOKUP(A2:A;…))', 'cari data'],
    ['=ARRAYFORMULA(UPPER(A2:A))', 'huruf besar'],
  ];
  return (
    <>
      <At x={540} y={330} s={pop(f, t0)} r={-2}>
        <Box bg={C.green} pad="16px 40px" style={{ fontFamily: HEAD, fontSize: 70 }}>ARRAYFORMULA</Box>
      </At>
      <At x={540} y={470} s={pop(f, t0 + 10)}>
        <div style={{ fontFamily: HEAD, fontSize: 60 }}>+</div>
      </At>
      <At x={540} y={590} s={pop(f, s(tFungsi) - 6)} r={2}>
        <Sticker bg={C.blue} size={46}>fungsi lain</Sticker>
      </At>
      {ex.map(([fx, label], i) => (
        <At key={fx} x={540} y={830 + i * 190} s={pop(f, s(tFungsi) + 4 + i * 8)}>
          <Box pad="18px 28px" style={{ width: 960, boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 38, whiteSpace: 'nowrap' }}><Fx text={fx} markName={0} /></span>
            <Chip bg={C.yellow} size={26}>{label}</Chip>
          </Box>
        </At>
      ))}
      <At x={540} y={1420} s={pop(f, s(tFungsi) + 30)} r={-2}>
        <Sticker bg={C.white} size={38}>Berbarengan, satu rumus, satu kolom</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 13. "Intinya: satu formula di baris paling atas, satu kolom beres, data baru masuk, total langsung terisi." */
/* ------------------------------------------------------------------ */
const Intinya: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[13].start);
  const tAtas = s(cue(13, 'atas'));
  const tBeres = s(cue(13, 'beres'));
  const tData = s(cue(13, 'data'));
  const tTerisi = s(cue(13, 'terisi'));
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.ink} size={52} style={{ color: C.green }}>Intinya</Sticker>
      </At>
      <At x={540} y={430} s={pop(f, tAtas - 4)}>
        <Chip bg={C.green} size={40}>1 formula · baris paling atas</Chip>
      </At>
      <At x={540} y={540} s={pop(f, tBeres - 4)}>
        <Chip bg={C.blue} size={40}>1 kolom beres</Chip>
      </At>
      <At x={540} y={1000} s={0.86 * (0.5 + 0.5 * pop(f, tData - 6))}>
        <SalesSheet
          bar={<Fx text={AF_IF} />}
          extra={lin(f, tData, tData + 10)}
          d={[...ROWS.map((r) => ({ text: r[3], bg: '#C9F9D5' })), { text: f >= tTerisi ? NEW_ROW[3] : '', bg: f >= tTerisi ? C.green : undefined }]}
        />
      </At>
      <At x={540} y={1470} s={pop(f, tTerisi)} r={2}>
        <Chip bg={C.yellow} size={40}>Data baru → total langsung terisi</Chip>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 14. "Catatan dikit: ARRAYFORMULA cuma ada di Google Sheets. Di Excel versi terbaru, kamu cukup tulis range-nya aja." */
/* ------------------------------------------------------------------ */
const Catatan: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[14].start);
  const tGoogle = s(cue(14, 'google'));
  const tExcel = s(cue(14, 'excel'));
  const tRange = s(cue(14, 'range'));
  return (
    <>
      <At x={540} y={300} s={pop(f, t0)} r={-2}>
        <Sticker bg={C.yellow} size={50}>Catatan dikit</Sticker>
      </At>
      <At x={540} y={620} s={pop(f, tGoogle - 4)}>
        <Box bg={C.green} pad="24px 34px" style={{ width: 900, boxSizing: 'border-box' }}>
          <div style={{ fontFamily: HEAD, fontSize: 48 }}>Google Sheets</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, marginTop: 10 }}><Fx text={AF} /></div>
        </Box>
      </At>
      <At x={540} y={1010} s={pop(f, tExcel - 4)}>
        <Box pad="24px 34px" style={{ width: 900, boxSizing: 'border-box' }}>
          <div style={{ fontFamily: HEAD, fontSize: 48 }}>Excel versi terbaru</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 46, marginTop: 10 }}>
            <span style={{ color: C.formula }}>=</span>
            <span style={{ color: C.sel, background: f >= tRange ? C.yellow : 'transparent', borderRadius: 6 }}>B2:B6</span>
            <span style={{ color: C.formula }}>*</span>
            <span style={{ color: '#D6249F', background: f >= tRange ? C.yellow : 'transparent', borderRadius: 6 }}>C2:C6</span>
          </div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, marginTop: 8 }}>hasilnya tumpah ke bawah (spill)</div>
        </Box>
      </At>
      <At x={540} y={1330} s={pop(f, tRange)} r={2}>
        <Sticker bg={C.blue} size={40}>Cukup tulis range-nya aja</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 15. "Sekarang latihan dikit: kolom B harga, kolom C diskon. Bikin rumus ARRAYFORMULA… harga setelah diskon." */
/* ------------------------------------------------------------------ */
const Latihan: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[15].start);
  const tHarga = s(cue(15, 'harga'));
  const tDiskon = s(cue(15, 'diskon'));
  const tTugas = s(cue(15, 'tugas'));
  const tSetelah = s(cue(15, 'setelah'));
  const rows: [string, string, string][] = [['Kopi', '18.000', '10%'], ['Teh', '12.000', '25%'], ['Roti', '15.000', '0%'], ['Susu', '9.000', '50%']];
  const cells: Record<string, React.ReactNode> = { A1: 'Produk', B1: 'Harga', C1: 'Diskon', D1: 'Harga akhir' };
  const style: Record<string, React.CSSProperties> = {};
  ['A1', 'B1', 'C1', 'D1'].forEach((a) => (style[a] = { justifyContent: 'flex-start', fontFamily: BODY, fontWeight: 700, fontSize: 32, background: C.head }));
  rows.forEach((r, i) => {
    const n = i + 2;
    cells[`A${n}`] = r[0]; cells[`B${n}`] = r[1]; cells[`C${n}`] = r[2];
    cells[`D${n}`] = f >= tSetelah ? '?' : '';
    style[`A${n}`] = { justifyContent: 'flex-start', fontFamily: BODY, fontWeight: 700, fontSize: 36 };
    style[`D${n}`] = { color: C.sel, fontFamily: HEAD, fontSize: 40, background: f >= tSetelah ? '#E3F5FF' : undefined };
  });
  return (
    <>
      <At x={540} y={290} s={pop(f, t0)} r={-2}>
        <Box bg={C.yellow} pad="16px 44px" style={{ fontFamily: HEAD, fontSize: 70 }}>LATIHAN</Box>
      </At>
      <At x={540} y={760} s={0.5 + 0.5 * pop(f, t0 + 4)}>
        <SheetUI
          title="latihan.xlsx"
          cols={4}
          rows={5}
          rowH={80}
          colW={COLW}
          cells={cells}
          cellStyle={style}
          selected="D2"
          refs={[...(f >= tHarga ? [{ cells: ['B2', 'B3', 'B4', 'B5'], color: C.sel }] : []), ...(f >= tDiskon ? [{ cells: ['C2', 'C3', 'C4', 'C5'], color: '#D6249F' }] : [])]}
          bar={f >= tTugas ? <Fx text="=ARRAYFORMULA( ? )" /> : ''}
        />
      </At>
      <At x={540} y={1240} s={pop(f, tTugas)} r={2}>
        <Sticker bg={C.green} size={40}>Tugasmu: 1 rumus ARRAYFORMULA</Sticker>
      </At>
      <At x={540} y={1400} s={pop(f, tSetelah)} r={-2}>
        <Sticker bg={C.blue} size={40}>D = harga setelah diskon</Sticker>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 16. "Like dan save biar gak lupa. Share ke temenmu… Follow dulu sebelum scroll konten lain." */
/* ------------------------------------------------------------------ */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(PARTS[16].start);
  const tSave = s(cue(16, 'save'));
  const tShare = s(cue(16, 'share'));
  const tFollow = s(cue(16, 'follow'));
  const tScroll = s(cue(16, 'scroll'));
  const fly = lin(f, tShare + 10, tShare + 30);
  const cx = interpolate(f, [tFollow - 12, tFollow + 6], [900, 730], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cy = interpolate(f, [tFollow - 12, tFollow + 6], [1420, 1290], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tap = f >= tFollow + 8;
  const press = 1 - 0.06 * between(f, tFollow + 6, tFollow + 12, 3);
  return (
    <>
      <At x={330} y={380} s={pop(f, t0, 220)} r={-6}>
        <Heart size={170} on={f >= t0 + 8} />
      </At>
      <At x={750} y={380} s={pop(f, tSave, 220)} r={6}>
        <Bookmark size={170} on={f >= tSave + 8} />
      </At>
      <At x={540} y={600} s={pop(f, t0 + 4)}>
        <div style={{ fontFamily: HEAD, fontSize: 50 }}>Like &amp; save biar gak lupa</div>
      </At>
      <At x={540} y={880} s={pop(f, tShare)}>
        <Box pad="22px 30px" style={{ width: 920, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 26 }}>
          <div style={{ transform: `translate(${fly * 8}px, ${-fly * 14}px) rotate(${fly * 8}deg)`, marginRight: 10 }}>
            <Plane size={100} />
          </div>
          <div>
            <div style={{ fontFamily: HEAD, fontSize: 48 }}>Share</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34 }}>ke temen yang masih suka narik formula</div>
          </div>
        </Box>
      </At>
      <At x={540} y={1200} s={pop(f, tFollow - 6) * press}>
        <div style={{ background: tap ? C.white : C.green, border: `${BORDER}px solid ${C.ink}`, borderRadius: 24, boxShadow: shadow(tap ? 4 : 12), padding: '22px 60px', fontFamily: HEAD, fontSize: 60 }}>
          {tap ? 'Following ✓' : '+ Follow'}
        </div>
      </At>
      <At x={cx} y={cy} o={lin(f, tFollow - 12, tFollow - 6)} z={5}>
        <Cursor />
      </At>
      <At x={540} y={1420} s={pop(f, tScroll)} r={2}>
        <Sticker bg={C.yellow} size={38}>sebelum scroll konten lain</Sticker>
      </At>
    </>
  );
};

const LIST = [Hook, Bumper, BosData, DataBaru, Gimana, Pause, Jawaban, Terisi, Kenapa, Ngitung, Jebakan, BiarRapi, Combo, Intinya, Catatan, Latihan, Cta];

export const SCENES: { from: number; to: number; C: React.FC }[] = LIST.map((Comp, i) => ({
  from: i === 0 ? 0 : PARTS[i].start - 0.15,
  to: i + 1 < PARTS.length ? PARTS[i + 1].start - 0.15 : 9999,
  C: Comp,
}));

/** sound-effect cue times (seconds) that match the pops above */
export const POPS: number[] = [
  PARTS[0].start, cue(0, 'baru'),
  PARTS[2].start, cue(2, 'baris'), cue(2, 'tarik'), cue(2, 'klik'),
  PARTS[3].start, cue(3, 'kosong'), cue(3, 'narik'),
  PARTS[4].start, cue(4, 'rumus'), cue(4, 'data'),
  PARTS[5].start, cue(5, 'komen'),
  cue(6, 'arrayformula'), cue(6, 'tulis'),
  PARTS[7].start,
  PARTS[8].start, cue(8, 'bukan'), cue(8, 'range'), cue(8, 'artinya'),
  PARTS[9].start,
  PARTS[10].start, cue(10, 'kosong'), cue(10, 'error'),
  PARTS[11].start, cue(11, 'biarin'), cue(11, 'ada'),
  PARTS[12].start,
  PARTS[13].start, cue(13, 'atas'), cue(13, 'beres'), cue(13, 'terisi'),
  PARTS[14].start, cue(14, 'google'), cue(14, 'excel'), cue(14, 'range'),
  PARTS[15].start, cue(15, 'tugas'), cue(15, 'setelah'),
  PARTS[16].start, cue(16, 'save'), cue(16, 'share'), cue(16, 'follow') + 0.3, cue(16, 'scroll'),
];
export const DINGS: number[] = [cue(6, 'enter'), cue(7, 'aman'), TIMER_START() + TIMER_LEN, cue(9, 'otomatis'), cue(16, 'follow') + 0.3];
export const THUDS: number[] = [cue(0, 'mending'), cue(10, 'jebakan')];
export const WHISTLE = PARTS[1].start - 0.05;
export const TICKS: number[] = Array.from({ length: TIMER_LEN }, (_, i) => TIMER_START() + i);
