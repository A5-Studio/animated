import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import {
  At, Background, Bill, Box, Burst, Captions, Drop, Globe, Header, Person, Pump, RiceSack, Sticker, Toga,
  between, ease, lin, pop, rp,
} from './components';
import {
  BERAS_KG, BERAS_PER_KG, BIAYA_S1, BODY, BORDER, C, HEAD, KM, KM_PER_LITER, LITER, NASI_PER_ORANG, ORANG_MAKAN,
  PERTALITE, PUTARAN, SARJANA, SEMESTER, UANG, UKT, shadow,
} from './theme';

const shake = (f: number, a: number, b: number, amp = 6) => (f > a && f < b ? Math.sin(f * 2.2) * amp * (1 - (f - a) / (b - a)) : 0);

/** number that rolls up from 0 between frames a and b */
const count = (f: number, a: number, b: number, to: number) =>
  to * interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

/** small grey source / assumption line at the bottom */
const Footnote: React.FC<{ text: string; from?: number }> = ({ text, from = 10 }) => {
  const f = useCurrentFrame();
  return (
    <At x={540} y={1800} o={lin(f, from, from + 10)}>
      <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 26, color: C.ink, background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '6px 16px', width: 'max-content', maxWidth: 980, textAlign: 'center', lineHeight: 1.3 }}>
        {text}
      </div>
    </At>
  );
};

/** "Rp14,7 M ÷ price = big number unit" block */
const Calc: React.FC<{ y: number; at: number; price: string; value: number; unit: string; color: string; dur?: number }> = ({
  y, at, price, value, unit, color, dur = 70,
}) => {
  const f = useCurrentFrame();
  const done = f > at + dur;
  const bump = done ? 1 + 0.08 * Math.sin(Math.PI * lin(f, at + dur, at + dur + 8)) : 1;
  return (
    <>
      <At x={540} y={y} s={pop(f, at - 15)}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.ink, width: 'max-content' }}>Rp14,7 M ÷ {price} =</div>
      </At>
      <At x={540} y={y + 120} s={pop(f, at) * bump} r={-1.5}>
        <Box bg={color} pad="14px 34px" style={{ fontFamily: HEAD, fontSize: 92, lineHeight: 1, width: 'max-content', display: 'flex', alignItems: 'baseline', gap: 18 }}>
          {rp(count(f, at, at + dur, value))}
          <span style={{ fontSize: 46 }}>{unit}</span>
        </Box>
      </At>
    </>
  );
};

/** price tag row: icon + "Barang · Rp xx / unit" */
const PriceTag: React.FC<{ y: number; at: number; icon: React.ReactNode; name: string; price: string; src: string; color: string }> = ({
  y, at, icon, name, price, src, color,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, at);
  return (
    <At x={540 - 700 * (1 - p)} y={y} r={-1}>
      <Box bg={C.white} pad="16px 26px" style={{ width: 900, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ flex: 'none', width: 170, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', background: color, border: `${BORDER}px solid ${C.ink}`, borderRadius: 18 }}>
          {icon}
        </div>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34 }}>{name}</div>
          <div style={{ fontFamily: HEAD, fontSize: 64 }}>{price}</div>
          <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 24 }}>{src}</div>
        </div>
      </Box>
    </At>
  );
};

/* ================================================================== */
/* 0. Hook                                                             */
/* ================================================================== */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const bills = Array.from({ length: 9 }, (_, i) => i);
  return (
    <>
      <Background color={C.green} />
      {bills.map((i) => {
        const t = f - i * 5;
        const y = interpolate(t, [0, 30], [-200, 1150 + (i % 3) * 70], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
        return (
          <At key={i} x={200 + ((i * 263) % 700)} y={y} r={((i * 37) % 50) - 25} o={t > 0 ? 1 : 0}>
            <Bill w={280} />
          </At>
        );
      })}
      <At x={540} y={300} s={pop(f, 0)} r={-2}>
        <Box bg={C.white} pad="20px 34px" style={{ fontFamily: HEAD, fontSize: 64, lineHeight: 1.08, textAlign: 'center', width: 'max-content' }}>
          Kalau kamu punya uang
        </Box>
      </At>
      <At x={540 + shake(f, 50, 75, 10)} y={560} s={pop(f, 12)} r={shake(f, 50, 75, 3)}>
        <Box bg={C.yellow} pad="22px 30px" style={{ fontFamily: HEAD, fontSize: 94, lineHeight: 1, width: 'max-content' }}>
          Rp{rp(count(f, 12, 50, UANG))}
        </Box>
      </At>
      <At x={560} y={760} s={pop(f, 50)} r={3}>
        <Sticker bg={C.pink} size={54}>bisa beli apa aja?!</Sticker>
      </At>
      <At x={880} y={960} s={pop(f, 54, 220) * 0.8} r={14}>
        <Burst size={230} rot={f * 0.8} color={C.orange}>14,7 M</Burst>
      </At>
      <Captions lines={[{ from: 70, to: 150, text: 'Kita belanjain ke *3 hal*: beras, kuliah, sama bensin.' }]} />
    </>
  );
};

/* ================================================================== */
/* 1. Beras                                                            */
/* ================================================================== */
export const Beras: React.FC = () => {
  const f = useCurrentFrame();
  const cols = 10;
  const people = 40; // each icon ≈ 336 people
  const shown = Math.floor(people * lin(f, 250, 300));
  return (
    <>
      <Background />
      <Header step={1} title="BERAS" color={C.yellow} />
      <PriceTag y={600} at={14} color={C.yellow} icon={<RiceSack size={150} />} name="Beras medium" price={`Rp${rp(BERAS_PER_KG)}/kg`} src="rata-rata nasional Bapanas, 2 Nov 2026" />
      <Calc y={800} at={75} price={`Rp${rp(BERAS_PER_KG)}`} value={BERAS_KG} unit="kg" color={C.yellow} />
      <At x={800} y={1070} s={pop(f, 160)} r={6}>
        <Sticker bg={C.red} size={46} style={{ color: C.white }}>≈ 1.074 TON!</Sticker>
      </At>
      <At x={540} y={1290} o={lin(f, 245, 252)}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 64px)`, gap: 10 }}>
          {Array.from({ length: people }, (_, i) => (
            <div key={i} style={{ transform: `scale(${i < shown ? pop(f, 250 + (i / people) * 50, 260) : 0})` }}>
              <Person size={64} color={[C.pink, C.blue, C.orange, C.purple][i % 4]} />
            </div>
          ))}
        </div>
      </At>
      <Captions
        lines={[
          { from: 20, to: 165, text: 'Harga beras medium sekarang sekitar *Rp13 ribuan* per kilo.' },
          { from: 165, to: 250, text: 'Dapetnya *sejuta kilo lebih*. Itu satu gudang penuh!' },
          { from: 250, to: 420, text: `Cukup buat *±${rp(Math.round(ORANG_MAKAN / 1000))} ribu orang* makan nasi *setahun penuh*.` },
        ]}
      />
      <Footnote from={250} text={`Asumsi 1 orang makan ±${NASI_PER_ORANG} kg beras setahun · 1 ikon ≈ 336 orang`} />
    </>
  );
};

/* ================================================================== */
/* 2. Kuliah                                                           */
/* ================================================================== */
export const Kuliah: React.FC = () => {
  const f = useCurrentFrame();
  const cols = 30;
  const shown = Math.floor(count(f, 190, 290, SARJANA));
  return (
    <>
      <Background />
      <Header step={2} title="KULIAH DI PTN" color={C.blue} />
      <PriceTag y={600} at={14} color={C.blue} icon={<Toga size={150} color={C.pink} />} name="UKT rata-rata PTN" price="±Rp5,2 juta" src="per semester (angka rata-rata, beda tiap kampus)" />
      <At x={540} y={790} s={pop(f, 70)} r={1}>
        <Box bg={C.white} pad="14px 26px" style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, width: 'max-content' }}>
          × {SEMESTER} semester = <span style={{ fontFamily: HEAD, background: C.yellow, padding: '0 10px', border: `3px solid ${C.ink}`, borderRadius: 8 }}>Rp41,6 juta</span> / orang
        </Box>
      </At>
      <At x={540} y={925} s={pop(f, 180) * (f > 290 ? 1 + 0.08 * Math.sin(Math.PI * lin(f, 290, 298)) : 1)} r={-1.5}>
        <Box bg={C.blue} pad="14px 34px" style={{ fontFamily: HEAD, fontSize: 92, lineHeight: 1, width: 'max-content', display: 'flex', alignItems: 'baseline', gap: 18 }}>
          {shown}
          <span style={{ fontSize: 46 }}>orang</span>
        </Box>
      </At>
      <At x={540} y={1215} o={lin(f, 185, 192)}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 24px)`, gap: 4, background: C.white, border: `${BORDER}px solid ${C.ink}`, borderRadius: 18, padding: 16, boxShadow: shadow(10) }}>
          {Array.from({ length: SARJANA }, (_, i) => (
            <div key={i} style={{ width: 24, height: 24, borderRadius: 5, border: `3px solid ${C.ink}`, background: i < shown ? [C.blue, C.pink, C.yellow, C.green][i % 4] : C.bg, opacity: i < shown ? 1 : 0.35 }} />
          ))}
        </div>
      </At>
      <At x={900} y={1010} s={pop(f, 300, 220) * 0.6} r={12}>
        <Burst size={240} rot={f * 0.8} color={C.yellow}>LULUS!</Burst>
      </At>
      <Captions
        lines={[
          { from: 20, to: 180, text: `UKT-nya kita anggap *±Rp5,2 juta*. S1 itu *${SEMESTER} semester*, jadi ±Rp41,6 juta per orang.` },
          { from: 180, to: 420, text: `*${SARJANA} orang* kuliah sampai *lulus S1*!` },
        ]}
      />
      <Footnote from={20} text="1 kotak = 1 sarjana · UKT asli beda-beda: Rp0 sampai puluhan juta" />
    </>
  );
};

/* ================================================================== */
/* 3. Bensin                                                           */
/* ================================================================== */
export const Bensin: React.FC = () => {
  const f = useCurrentFrame();
  const phase2 = ease(f, 200, 225); // calc slides away, globe slides in
  const laps = Math.floor(count(f, 250, 340, PUTARAN));
  return (
    <>
      <Background />
      <Header step={3} title="BENSIN PERTALITE" color={C.green} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-1100 * phase2}px)` }}>
        <PriceTag y={600} at={14} color={C.green} icon={<Pump size={150} />} name="Pertalite" price={`Rp${rp(PERTALITE)}/liter`} src="harga Pertamina, November 2026" />
        <Calc y={800} at={75} price={`Rp${rp(PERTALITE)}`} value={LITER} unit="liter" color={C.green} />
        {Array.from({ length: 6 }, (_, i) => {
          const t = (f - 90 - i * 9) % 54;
          return (
            <At key={i} x={250 + i * 116} y={1100 + t * 4} o={f > 90 && f < 200 ? between(t, 0, 54, 10) : 0}>
              <Drop size={56} />
            </At>
          );
        })}
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${1100 * (1 - phase2)}px)` }}>
        <At x={540} y={620}>
          <Box bg={C.white} pad="14px 26px" style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38, width: 'max-content', textAlign: 'center', lineHeight: 1.3 }}>
            Dipakai motor (±{KM_PER_LITER} km/liter):<br />
            <span style={{ fontFamily: HEAD, fontSize: 56 }}>{(KM / 1e6).toLocaleString('id-ID')} juta km</span>
          </Box>
        </At>
        <At x={540} y={1000} r={0}>
          <Globe size={400} spin={f * 3} />
        </At>
        <At x={540} y={1300} s={pop(f, 245) * (f > 340 ? 1 + 0.08 * Math.sin(Math.PI * lin(f, 340, 348)) : 1)} r={-2}>
          <Box bg={C.green} pad="14px 30px" style={{ fontFamily: HEAD, fontSize: 70, lineHeight: 1.05, width: 'max-content', textAlign: 'center' }}>
            keliling bumi<br />{rp(laps)}× !
          </Box>
        </At>
      </div>
      <Captions
        lines={[
          { from: 20, to: 200, text: 'Pertalite masih *Rp10 ribu* per liter. Dapetnya *1,47 juta liter*.' },
          { from: 225, to: 420, text: `Kalau dipakai motor, bisa *keliling bumi ${rp(PUTARAN)} kali*. Puter-puter terus!` },
        ]}
      />
      <Footnote from={225} text="Asumsi motor irit ±40 km/liter · keliling bumi ±40.075 km" />
    </>
  );
};

/* ================================================================== */
/* 4. Recap                                                            */
/* ================================================================== */
const RECAP = [
  { icon: <RiceSack size={120} />, bg: C.yellow, big: '1.074 TON', small: 'beras medium' },
  { icon: <Toga size={120} color={C.pink} />, bg: C.blue, big: `${SARJANA} SARJANA`, small: 'UKT lunas sampai lulus S1' },
  { icon: <Pump size={120} />, bg: C.green, big: '1,47 JUTA L', small: `Pertalite = keliling bumi ${rp(PUTARAN)}×` },
];
export const Recap: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Background color={C.purple} />
      <At x={540} y={250} s={pop(f, 0)} r={-2}>
        <Box bg={C.yellow} pad="18px 34px" style={{ fontFamily: HEAD, fontSize: 64, lineHeight: 1.05, textAlign: 'center', width: 'max-content' }}>
          Rp14,7 M itu…
        </Box>
      </At>
      {RECAP.map((c, i) => {
        const p = pop(f, 15 + i * 18);
        const dir = i % 2 ? 1 : -1;
        return (
          <At key={i} x={540 + dir * 700 * (1 - p)} y={500 + i * 245} r={dir * -1.2}>
            <Box bg={c.bg} pad="14px 26px" style={{ width: 900, display: 'flex', alignItems: 'center', gap: 26 }}>
              <div style={{ flex: 'none', width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.white, border: `${BORDER}px solid ${C.ink}`, borderRadius: 18 }}>{c.icon}</div>
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontFamily: HEAD, fontSize: 62 }}>{c.big}</div>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32 }}>{c.small}</div>
              </div>
            </Box>
          </At>
        );
      })}
      <At x={540} y={1250} s={pop(f, 80)} r={2}>
        <Sticker bg={C.pink} size={50}>kamu pilih yang mana?</Sticker>
      </At>
      <Captions lines={[{ from: 100, to: 270, text: 'Tulis di komentar: *beras*, *kuliah*, atau *bensin*?' }]} />
      <At x={540} y={1760} o={lin(f, 20, 30)}>
        <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 23, background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '8px 16px', width: 960, textAlign: 'center', lineHeight: 1.35 }}>
          Sumber: Bapanas (beras medium Rp{rp(BERAS_PER_KG)}/kg, 2 Nov 2026) · Pertamina (Pertalite Rp{rp(PERTALITE)}/L, Nov 2026) ·
          UKT ±Rp5,2 jt/semester (Kompas.id; tiap PTN beda) · Biaya S1 = Rp{rp(BIAYA_S1)}
        </div>
      </At>
    </>
  );
};
