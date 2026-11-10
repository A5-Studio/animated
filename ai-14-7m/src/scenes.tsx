import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { AiBubble, At, Background, Bill, Box, Burst, Calendar, Captions, Header, Sticker, ease, lin, pop, rp } from './components';
import { BODY, BORDER, C, HEAD, KURS, PLANS, Plan, UANG, lastYear, months, shadow } from './theme';

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

const short = (p: Plan) => (p.key === 'chatgpt' ? 'GPT' : p.app);
const juta = (n: number) => (n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 });

/* ================================================================== */
/* 0. Hook                                                             */
/* ================================================================== */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Background color={C.purple} />
      {Array.from({ length: 6 }, (_, i) => {
        const t = f - i * 6;
        const y = interpolate(t, [0, 30], [-200, 1180 + (i % 3) * 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
        return (
          <At key={i} x={190 + ((i * 263) % 700)} y={y} r={((i * 37) % 50) - 25} o={t > 0 ? 1 : 0}>
            <Bill w={260} />
          </At>
        );
      })}
      <At x={540} y={280} s={pop(f, 0)} r={-2}>
        <Box bg={C.white} pad="20px 34px" style={{ fontFamily: HEAD, fontSize: 64, lineHeight: 1.08, textAlign: 'center', width: 'max-content' }}>
          Uang
        </Box>
      </At>
      <At x={540 + shake(f, 50, 75, 10)} y={450} s={pop(f, 10)} r={shake(f, 50, 75, 3)}>
        <Box bg={C.yellow} pad="22px 30px" style={{ fontFamily: HEAD, fontSize: 94, lineHeight: 1, width: 'max-content' }}>
          Rp{rp(count(f, 10, 48, UANG))}
        </Box>
      </At>
      <At x={540} y={640} s={pop(f, 48)} r={2}>
        <Sticker bg={C.pink} size={46}>buat langganan AI?!</Sticker>
      </At>
      {PLANS.map((p, i) => (
        <At key={p.key} x={220 + i * 320} y={900} s={pop(f, 62 + i * 8)} r={(i - 1) * 6}>
          <AiBubble size={230} color={p.color} label={short(p)} />
        </At>
      ))}
      <Captions lines={[{ from: 80, to: 150, text: 'Ambil *plan paling mahal*. Kuat langganan *berapa lama*?' }]} />
    </>
  );
};

/* ================================================================== */
/* 1-3. One scene per AI                                               */
/* ================================================================== */
const PlanScene: React.FC<{ p: Plan; step: number; lines: string[] }> = ({ p, step, lines }) => {
  const f = useCurrentFrame();
  const m = months(p);
  const end = lastYear(p);
  const years = Math.floor(m / 12);
  const year = Math.round(2026 + count(f, 200, 290, end - 2026));
  const gen = Math.round(years / 25);
  const calBump = f > 290 ? 1 + 0.08 * Math.sin(Math.PI * lin(f, 290, 298)) : 1;
  return (
    <>
      <Background />
      <Header step={step} title={p.app.toUpperCase()} color={p.color} />
      <PriceTag
        y={600} at={14} color={p.color} icon={<AiBubble size={140} color={C.white} label={short(p)} />}
        name={`${p.app} ${p.plan}`} price={`Rp${rp(p.idr)}/bln`}
        src={p.usd ? `$${p.usd} × kurs Rp${rp(KURS)} · ${p.note}` : p.note}
      />
      <Calc y={800} at={75} price={`Rp${rp(p.idr)}`} value={m} unit="bulan" color={p.color} />
      <At x={540} y={1050} s={pop(f, 160)} r={-3}>
        <Sticker bg={C.red} size={46} style={{ color: C.white }}>= {years} tahun {m % 12} bulan!</Sticker>
      </At>
      <At x={320} y={1265} s={pop(f, 195) * calBump} r={-3}>
        <Calendar year={year} color={p.color} w={290} month="LUNAS S/D" />
      </At>
      <At x={780} y={1265} s={pop(f, 300)} r={4}>
        <Box bg={C.white} pad="14px 22px" style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, textAlign: 'center', lineHeight: 1.2, width: 'max-content' }}>
          ±<span style={{ fontFamily: HEAD, fontSize: 52 }}>{gen}</span> generasi<br />
          <span style={{ fontWeight: 500, fontSize: 24 }}>(1 generasi ±25 tahun)</span>
        </Box>
      </At>
      <Captions
        lines={[
          { from: 20, to: 160, text: lines[0] },
          { from: 160, to: 390, text: lines[1] },
        ]}
      />
      <Footnote from={20} text={p.usd ? 'Harga dolar, belum termasuk pajak · kurs pasar 6 Nov 2026' : 'Harga di halaman resmi Google untuk Indonesia, Nov 2026'} />
    </>
  );
};

const [CL, GPT, GEM] = PLANS;
const yrs = (p: Plan) => Math.floor(months(p) / 12);

export const Claude: React.FC = () => (
  <PlanScene
    p={CL} step={1}
    lines={[
      `Plan Claude paling atas namanya *${CL.plan}*: *$${CL.usd}* sebulan, sekitar *Rp${juta(CL.idr)} juta*.`,
      `Uangnya cukup buat langganan *${yrs(CL)} tahun*. Lunas sampai *tahun ${lastYear(CL)}*!`,
    ]}
  />
);

export const ChatGPT: React.FC = () => (
  <PlanScene
    p={GPT} step={2}
    lines={[
      `ChatGPT paling atas: *${GPT.plan}*, *$${GPT.usd}* sebulan, sekitar *Rp${juta(GPT.idr)} juta*.`,
      `Paling mahal, tapi tetap *${yrs(GPT)} tahun*. Sampai *tahun ${lastYear(GPT)}*!`,
    ]}
  />
);

export const Gemini: React.FC = () => (
  <PlanScene
    p={GEM} step={3}
    lines={[
      `Gemini paling atas: *Google AI Ultra 20x*, *Rp${juta(GEM.idr)} juta* sebulan.`,
      `Ini yang paling awet: *${yrs(GEM)} tahun*, sampai *tahun ${lastYear(GEM)}*!`,
    ]}
  />
);

/* ================================================================== */
/* 4. Recap                                                            */
/* ================================================================== */
export const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const sorted = [...PLANS].sort((a, b) => months(b) - months(a));
  const max = months(sorted[0]);
  return (
    <>
      <Background color={C.yellow} />
      <At x={540} y={230} s={pop(f, 0)} r={-2}>
        <Box bg={C.white} pad="18px 34px" style={{ fontFamily: HEAD, fontSize: 60, lineHeight: 1.05, textAlign: 'center', width: 'max-content' }}>
          Rp14,7 M = langganan…
        </Box>
      </At>
      {sorted.map((p, i) => {
        const g = ease(f, 15 + i * 15, 55 + i * 15);
        return (
          <At key={p.key} x={540} y={500 + i * 270} s={pop(f, 10 + i * 15)}>
            <div style={{ width: 920 }}>
              <div style={{ fontFamily: HEAD, fontSize: 44, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span>{p.app} <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30 }}>{p.plan}</span></span><span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, opacity: lin(f, 70 + i * 10, 80 + i * 10) }}>atau {Math.floor(UANG / (p.idr * 12))} orang × 1 thn</span></div>
              <div style={{ height: 110, width: Math.max(400, 920 * (months(p) / max)) * g, background: p.color, border: `${BORDER}px solid ${C.ink}`, borderRadius: 14, boxShadow: shadow(8), display: 'flex', alignItems: 'center', paddingLeft: 24, fontFamily: HEAD, fontSize: 60, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {Math.round(yrs(p) * g)} tahun
              </div>
            </div>
          </At>
        );
      })}
      <Captions lines={[{ from: 120, to: 300, text: 'Kamu pakai AI yang mana? Tulis di *komentar*!' }]} />
      <At x={540} y={1760} o={lin(f, 20, 30)}>
        <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 23, background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '8px 16px', width: 960, textAlign: 'center', lineHeight: 1.35 }}>
          Harga Nov 2026: Claude Ultra $200 · ChatGPT Pro 500 $500 · Google AI Ultra 20x Rp3.399.000 (resmi ID) ·
          kurs Rp{rp(KURS)}/$ (6 Nov 2026) · harga dolar belum termasuk pajak · mulai langganan Nov 2026
        </div>
      </At>
    </>
  );
};
