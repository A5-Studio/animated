import React from 'react';
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { At, Background, Bill, Box, Captions, Sticker, ease, lin, pop, rp } from './components';
import {
  BODY, BORDER, C, DOMPET, EVEREST_M, LARIS, LARIS_HARGA, LARIS_JENIS, LARIS_RANK, LARIS_TERJUAL, HARGA, HEAD, JENIS, KALI_TERJUAL, PRODUK, SISA, TAHUN_GANTI, TAS, TERJUAL, TINGGI_M,
  TINGGI_TAS_CM, UANG, shadow,
} from './theme';

const shake = (f: number, a: number, b: number, amp = 6) => (f > a && f < b ? Math.sin(f * 2.2) * amp * (1 - (f - a) / (b - a)) : 0);
const count = (f: number, a: number, b: number, to: number) =>
  to * interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
const bump = (f: number, at: number) => (f > at ? 1 + 0.08 * Math.sin(Math.PI * lin(f, at, at + 8)) : 1);
const CAP = { x: 960, y: 985, w: 1500, size: 40 };

const Footnote: React.FC<{ text: string; y?: number; from?: number }> = ({ text, y = 870, from = 10 }) => {
  const f = useCurrentFrame();
  return (
    <At x={960} y={y} o={lin(f, from, from + 10)}>
      <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 22, background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '5px 14px', width: 'max-content', maxWidth: 1700, textAlign: 'center' }}>
        {text}
      </div>
    </At>
  );
};

/** Wallts logo as a bordered tile */
const Logo: React.FC<{ size: number; sh?: number }> = ({ size, sh = 6 }) => (
  <Img
    src={staticFile('wallts-logo.png')}
    style={{ width: size, height: size, display: 'block', flex: 'none', borderRadius: size * 0.22, border: `${Math.max(3, size * 0.05)}px solid ${C.ink}`, boxShadow: shadow(sh), boxSizing: 'border-box' }}
  />
);

/** product photo (3 views) on a white card */
const Photo: React.FC<{ w: number }> = ({ w }) => (
  <Box bg={C.white} pad={10} radius={20} style={{ width: 'max-content' }}>
    <Img src={staticFile('teva-3.png')} style={{ width: w, display: 'block', borderRadius: 12 }} />
  </Box>
);

/* ================================================================== */
/* 0. Hook                                                             */
/* ================================================================== */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Background color={C.blue} />
      {Array.from({ length: 8 }, (_, i) => {
        const t = f - i * 5;
        const y = interpolate(t, [0, 30], [-200, 460 + (i >> 1) * 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
        return (
          <At key={i} x={i % 2 ? 1720 - (i % 3) * 40 : 200 + (i % 3) * 40} y={y} r={((i * 37) % 50) - 25} o={t > 0 ? 1 : 0}>
            <Bill w={250} />
          </At>
        );
      })}
      <At x={960} y={100} s={pop(f, 0)} r={-2}>
        <Box bg={C.white} pad="12px 30px" style={{ fontFamily: HEAD, fontSize: 52, width: 'max-content' }}>Kalau punya uang</Box>
      </At>
      <At x={960 + shake(f, 50, 75, 10)} y={240} s={pop(f, 10)} r={shake(f, 50, 75, 3)}>
        <Box bg={C.yellow} pad="16px 34px" style={{ fontFamily: HEAD, fontSize: 104, lineHeight: 1, width: 'max-content' }}>
          Rp{rp(count(f, 10, 48, UANG))}
        </Box>
      </At>
      <At x={960} y={385} s={pop(f, 48)} r={2}>
        <Sticker bg={C.pink} size={44}>buat borong tas Wallts?!</Sticker>
      </At>
      <At x={1460} y={385} s={pop(f, 56, 220)} r={8}>
        <Logo size={130} sh={8} />
      </At>
      <At x={960} y={660} s={pop(f, 60)} r={-1.5}>
        <Photo w={600} />
      </At>
      <Captions {...CAP} lines={[{ from: 75, to: 150, text: 'Kita ambil produk Wallts yang *paling mahal* di Shopee.' }]} />
    </>
  );
};

/* ================================================================== */
/* 1. The product + the division                                       */
/* ================================================================== */
export const Produk: React.FC = () => {
  const f = useCurrentFrame();
  const icons = Math.round(TAS / 1000);
  const shown = Math.floor(icons * lin(f, 230, 290));
  return (
    <>
      <Background />
      <At x={520} y={460} s={pop(f, 0)} r={-1}>
        <Box bg={C.white} pad="16px 20px 22px" style={{ width: 760 }}>
          <Img src={staticFile('teva-3.png')} style={{ width: 712, display: 'block', borderRadius: 12 }} />
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}><Logo size={48} sh={4} />{PRODUK} · {JENIS}</div>
          <div style={{ fontFamily: HEAD, fontSize: 76, lineHeight: 1.05, color: C.red, WebkitTextStroke: `2px ${C.ink}` }}>Rp{rp(HARGA)}</div>
          <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 22 }}>harga dengan voucher · Shopee Mall · 10 Nov 2026 · {TERJUAL} terjual</div>
        </Box>
      </At>
      <At x={820} y={190} s={pop(f, 25, 220)} r={8}>
        <Sticker bg={C.red} size={34} style={{ color: C.white }}>✓ termahal</Sticker>
      </At>
      <At x={1420} y={250} s={pop(f, 90)}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, width: 'max-content' }}>Rp14,7 M ÷ Rp{rp(HARGA)} =</div>
      </At>
      <At x={1420} y={370} s={pop(f, 105) * bump(f, 185)} r={-1.5}>
        <Box bg={C.yellow} pad="10px 36px" style={{ fontFamily: HEAD, fontSize: 104, lineHeight: 1, width: 'max-content', display: 'flex', alignItems: 'baseline', gap: 18 }}>
          {rp(count(f, 105, 185, TAS))}
          <span style={{ fontSize: 52 }}>tas</span>
        </Box>
      </At>
      <At x={1420} y={500} s={pop(f, 200)} r={-3}>
        <Sticker bg={C.green} size={36}>kembalian Rp{rp(SISA)}</Sticker>
      </At>
      <At x={1420} y={720} o={lin(f, 225, 232)}>
        <Box bg={C.white} pad="14px 16px" radius={18} sh={10}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 50px)', gap: 6 }}>
            {Array.from({ length: icons }, (_, i) => (
              <Img key={i} src={staticFile('teva.png')} style={{ width: 50, height: 70, objectFit: 'contain', transform: `scale(${i < shown ? pop(f, 230 + (i / icons) * 60, 260) : 0})` }} />
            ))}
          </div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24, textAlign: 'center', marginTop: 8 }}>1 ikon = 1.000 tas</div>
        </Box>
      </At>
      <Captions
        {...CAP}
        lines={[
          { from: 15, to: 190, text: `Produk Wallts termahal: *${PRODUK}*, tas ransel travel seharga *Rp${rp(HARGA)}*.` },
          { from: 190, to: 330, text: `Rp14,7 M dapet *${rp(TAS)} tas*. Masih ada kembalian *Rp${rp(SISA)}*!` },
        ]}
      />
    </>
  );
};

/* ================================================================== */
/* 2. Stack them up next to Everest                                    */
/* ================================================================== */
const GROUND = 880;
const PX_PER_M = 740 / TINGGI_M; // the full stack reaches y = 140
export const Tumpuk: React.FC = () => {
  const f = useCurrentFrame();
  const g = ease(f, 30, 190);
  const stackH = TINGGI_M * PX_PER_M * g;
  const evH = EVEREST_M * PX_PER_M;
  const meters = TINGGI_M * g;
  const passed = f > 30 && stackH > evH;
  return (
    <>
      <Background color={C.blue} />
      {/* ground */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: GROUND, height: 200, background: C.green, borderTop: `${BORDER}px solid ${C.ink}` }} />
      {/* Everest */}
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1920} height={1080}>
        <polygon points={`200,${GROUND} 640,${GROUND - evH} 1080,${GROUND}`} fill="#9AA3B5" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
        <polygon
          points={`640,${GROUND - evH} ${640 - 95},${GROUND - evH + 95} 600,${GROUND - evH + 70} 640,${GROUND - evH + 105} 690,${GROUND - evH + 72} ${640 + 95},${GROUND - evH + 95}`}
          fill={C.white} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"
        />
        <line x1={160} x2={1760} y1={GROUND - evH} y2={GROUND - evH} stroke={C.ink} strokeWidth={4} strokeDasharray="14 12" opacity={lin(f, 20, 30)} />
      </svg>
      <At x={640} y={GROUND - evH - 50} s={pop(f, 10)}>
        <Sticker bg={C.white} size={30}>Gunung Everest · {rp(EVEREST_M)} m</Sticker>
      </At>
      {/* the stack of backpacks */}
      <div
        style={{
          position: 'absolute', left: 1240, width: 110, top: GROUND - stackH, height: stackH, background: C.white,
          backgroundImage: `url(${staticFile('teva.png')})`, backgroundSize: '110px 34px', backgroundRepeat: 'repeat-y',
          border: `${BORDER}px solid ${C.ink}`, borderBottom: 'none', boxShadow: shadow(10), boxSizing: 'border-box',
        }}
      />
      <At x={1600} y={Math.max(GROUND - stackH, 200)} s={pop(f, 30)} r={-2}>
        <Box bg={C.yellow} pad="10px 26px" style={{ fontFamily: HEAD, fontSize: 64, width: 'max-content' }}>{rp(meters)} m</Box>
      </At>
      <At x={1600} y={420} s={passed ? pop(f, 200) : 0} r={4}>
        <Sticker bg={C.red} size={44} style={{ color: C.white }}>≈ 2× Everest!</Sticker>
      </At>
      <Captions
        {...CAP}
        lines={[
          { from: 15, to: 195, text: `Kalau semua tasnya *ditumpuk* (anggap 1 tas ±${TINGGI_TAS_CM} cm)…` },
          { from: 195, to: 300, text: `tingginya *${(TINGGI_M / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} km*. Itu *2× tinggi Gunung Everest*!` },
        ]}
      />
    </>
  );
};

/* ================================================================== */
/* 3. Two more ways to picture it                                      */
/* ================================================================== */
export const Fakta: React.FC = () => {
  const f = useCurrentFrame();
  const card = (x: number, at: number, bg: string, big: string, small: string, r: number) => (
    <At x={x} y={520} s={pop(f, at)} r={r}>
      <Box bg={bg} pad="30px 36px" style={{ width: 720, textAlign: 'center' }}>
        <div style={{ fontFamily: HEAD, fontSize: 130, lineHeight: 1 }}>{big}</div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38, lineHeight: 1.25, marginTop: 14, whiteSpace: 'pre-line' }}>{small}</div>
      </Box>
    </At>
  );
  return (
    <>
      <Background />
      <At x={960} y={110} s={pop(f, 0)} r={-1.5}>
        <Box bg={C.purple} pad="10px 34px" style={{ fontFamily: HEAD, fontSize: 56, width: 'max-content' }}>Biar kebayang…</Box>
      </At>
      {card(520, 15, C.pink, `${KALI_TERJUAL}×`, `lipat dari yang sudah terjual\ndi halaman produknya (${TERJUAL} tas)`, -2)}
      {card(1400, 150, C.green, `${TAHUN_GANTI} thn`, 'pakai tas baru TIAP HARI,\nnggak pernah dipakai 2 kali', 2)}
      <Captions
        {...CAP}
        lines={[
          { from: 20, to: 150, text: `Halaman produknya baru *${TERJUAL} terjual*. Kita borong *${KALI_TERJUAL}× lipatnya*!` },
          { from: 150, to: 300, text: `Atau ganti *tas baru tiap hari* selama *${TAHUN_GANTI} tahun*.` },
        ]}
      />
    </>
  );
};

/* ================================================================== */
/* 4. Bonus: the best-seller                                           */
/* ================================================================== */
export const Laris: React.FC = () => {
  const f = useCurrentFrame();
  const icons = Math.round(DOMPET / 5000); // 1 icon = 5.000 dompet
  const shown = Math.floor(icons * lin(f, 230, 285));
  return (
    <>
      <Background color={C.orange} />
      <At x={520} y={450} s={pop(f, 0)} r={1}>
        <Box bg={C.white} pad="16px 20px 22px" style={{ width: 760 }}>
          <Img src={staticFile('brock.png')} style={{ width: 712, display: 'block', borderRadius: 12 }} />
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}><Logo size={48} sh={4} />{LARIS} · {LARIS_JENIS}</div>
          <div style={{ fontFamily: HEAD, fontSize: 76, lineHeight: 1.05, color: C.red, WebkitTextStroke: `2px ${C.ink}` }}>Rp{rp(LARIS_HARGA)}</div>
          <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 22 }}>harga dengan voucher · Shopee Mall · 10 Nov 2026 · 10RB+ terjual</div>
        </Box>
      </At>
      <At x={520} y={118} s={pop(f, 25, 220)} r={-4}>
        <Sticker bg={C.yellow} size={34}>★ terlaris · 10RB+ terjual</Sticker>
      </At>
      <At x={1420} y={150} s={pop(f, 40)} r={2}>
        <Sticker bg={C.white} size={26}>{LARIS_RANK}</Sticker>
      </At>
      <At x={1420} y={270} s={pop(f, 90)}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, width: 'max-content' }}>Rp14,7 M ÷ Rp{rp(LARIS_HARGA)} =</div>
      </At>
      <At x={1420} y={390} s={pop(f, 105) * bump(f, 185)} r={-1.5}>
        <Box bg={C.yellow} pad="10px 36px" style={{ fontFamily: HEAD, fontSize: 100, lineHeight: 1, width: 'max-content', display: 'flex', alignItems: 'baseline', gap: 18 }}>
          {rp(count(f, 105, 185, DOMPET))}
          <span style={{ fontSize: 50 }}>dompet</span>
        </Box>
      </At>
      <At x={1420} y={515} s={pop(f, 200)} r={3}>
        <Sticker bg={C.red} size={34} style={{ color: C.white }}>±{Math.floor(DOMPET / LARIS_TERJUAL)}× semua yang pernah terjual!</Sticker>
      </At>
      <At x={1420} y={720} o={lin(f, 225, 232)}>
        <Box bg={C.white} pad="14px 16px" radius={18} sh={10}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 64px)', gap: 8 }}>
            {Array.from({ length: icons }, (_, i) => (
              <div key={i} style={{ width: 64, height: 46, background: i % 2 ? '#6B4A34' : C.ink, borderRadius: 8, border: `3px solid ${C.ink}`, position: 'relative', transform: `scale(${i < shown ? pop(f, 230 + (i / icons) * 55, 260) : 0})` }}>
                <div style={{ position: 'absolute', right: 6, bottom: 5, width: 14, height: 6, borderRadius: 3, background: C.blue }} />
              </div>
            ))}
          </div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24, textAlign: 'center', marginTop: 8 }}>1 ikon = 5.000 dompet</div>
        </Box>
      </At>
      <Captions
        {...CAP}
        lines={[
          { from: 15, to: 190, text: `Bonus! Produk Wallts *terlaris* di Shopee: dompet *${LARIS.replace('Wallts ', '')}*, *Rp${rp(LARIS_HARGA)}*, sudah laku *10 ribu lebih*.` },
          { from: 190, to: 330, text: `Rp14,7 M dapet *${rp(DOMPET)} dompet*. Kira-kira *10× lipat* dari semua yang pernah terjual!` },
        ]}
      />
    </>
  );
};

/* ================================================================== */
/* 5. Recap                                                            */
/* ================================================================== */
export const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const stats = [
    { bg: C.yellow, big: `${rp(TAS)}`, small: 'tas Wallts Teva' },
    { bg: C.blue, big: '17,7 km', small: 'tumpukan tas ≈ 2× Everest' },
    { bg: C.green, big: `${TAHUN_GANTI} thn`, small: 'ganti tas baru tiap hari' },
    { bg: C.orange, big: `${rp(DOMPET)}`, small: `dompet ${LARIS.replace('Wallts ', '')} (terlaris)` },
  ];
  return (
    <>
      <Background color={C.yellow} />
      <At x={960} y={100} s={pop(f, 0)} r={-1.5}>
        <Box bg={C.white} pad="10px 34px 10px 12px" style={{ fontFamily: HEAD, fontSize: 56, width: 'max-content', display: 'flex', alignItems: 'center', gap: 18 }}><Logo size={72} sh={4} />Rp14,7 M = …</Box>
      </At>
      {stats.map((s, i) => (
        <At key={i} x={255 + i * 470} y={330} s={pop(f, 12 + i * 12)} r={(i % 2 ? 1 : -1) * 2}>
          <Box bg={s.bg} pad="20px 20px" style={{ width: 430, textAlign: 'center' }}>
            <div style={{ fontFamily: HEAD, fontSize: 70, lineHeight: 1 }}>{s.big}</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 27, marginTop: 8, whiteSpace: 'nowrap' }}>{s.small}</div>
          </Box>
        </At>
      ))}
      <At x={700} y={630} s={pop(f, 55)} r={-1.5}>
        <Photo w={420} />
      </At>
      <At x={1220} y={630} s={pop(f, 65)} r={1.5}>
        <Box bg={C.white} pad={10} radius={20} style={{ width: 'max-content' }}>
          <Img src={staticFile('brock.png')} style={{ width: 400, display: 'block', borderRadius: 12 }} />
        </Box>
      </At>
      <Footnote
        y={850} from={20}
        text={`Harga dengan voucher, Shopee Mall, 10 Nov 2026: ${PRODUK} Rp${rp(HARGA)} · ${LARIS} Rp${rp(LARIS_HARGA)} · asumsi tinggi 1 tas ±${TINGGI_TAS_CM} cm · Everest ${rp(EVEREST_M)} m`}
      />
      <Captions {...CAP} lines={[{ from: 90, to: 240, text: 'Kalau kamu, Rp14,7 M mau *diborongin apa*? Tulis di komentar!' }]} />
    </>
  );
};
