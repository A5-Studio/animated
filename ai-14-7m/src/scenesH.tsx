/* Horizontal (1920×1080) cut. Left column: the tier ladder; right column: the math. */
import React from 'react';
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { At, Background, Bill, Box, Calendar, Captions, Sticker, ease, lin, pop, rp } from './components';
import { BODY, BORDER, C, HEAD, KURS, PLANS, Plan, TIERS, UANG, lastYear, months, shadow } from './theme';

const shake = (f: number, a: number, b: number, amp = 6) => (f > a && f < b ? Math.sin(f * 2.2) * amp * (1 - (f - a) / (b - a)) : 0);
const count = (f: number, a: number, b: number, to: number) =>
  to * interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
/** the app's own logo (public/logos); Gemini's file has extra padding, so it is scaled up a bit */
const Logo: React.FC<{ p: Plan; size: number }> = ({ p, size }) => (
  <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', filter: `drop-shadow(${size * 0.04}px ${size * 0.04}px 0 ${C.ink})` }}>
    <Img src={staticFile(`logos/${p.key}.png`)} style={{ width: size, height: size, objectFit: 'contain', transform: `scale(${p.key === 'gemini' ? 1.16 : 1})` }} />
  </div>
);
const juta = (n: number) => (n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 });
const yrs = (p: Plan) => Math.floor(months(p) / 12);
const bump = (f: number, at: number) => (f > at ? 1 + 0.08 * Math.sin(Math.PI * lin(f, at, at + 8)) : 1);

const CAP = { y: 985, w: 1500, size: 40, x: 960 };

const Footnote: React.FC<{ text: string; x?: number; y?: number; from?: number }> = ({ text, x = 960, y = 1045, from = 10 }) => {
  const f = useCurrentFrame();
  return (
    <At x={x} y={y} o={lin(f, from, from + 10)}>
      <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 22, background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '5px 14px', width: 'max-content', maxWidth: 1700, textAlign: 'center', lineHeight: 1.3 }}>
        {text}
      </div>
    </At>
  );
};

/* ================================================================== */
/* 0. Hook                                                             */
/* ================================================================== */
export const HookH: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Background color={C.purple} />
      {Array.from({ length: 8 }, (_, i) => {
        const t = f - i * 5;
        const y = interpolate(t, [0, 30], [-200, 460 + (i >> 1) * 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
        return (
          <At key={i} x={i % 2 ? 1720 - (i % 3) * 40 : 200 + (i % 3) * 40} y={y} r={((i * 37) % 50) - 25} o={t > 0 ? 1 : 0}>
            <Bill w={250} />
          </At>
        );
      })}
      <At x={960} y={110} s={pop(f, 0)} r={-2}>
        <Box bg={C.white} pad="14px 30px" style={{ fontFamily: HEAD, fontSize: 56, width: 'max-content' }}>Kalau punya uang</Box>
      </At>
      <At x={960 + shake(f, 50, 75, 10)} y={260} s={pop(f, 10)} r={shake(f, 50, 75, 3)}>
        <Box bg={C.yellow} pad="18px 34px" style={{ fontFamily: HEAD, fontSize: 112, lineHeight: 1, width: 'max-content' }}>
          Rp{rp(count(f, 10, 48, UANG))}
        </Box>
      </At>
      <At x={960} y={410} s={pop(f, 48)} r={2}>
        <Sticker bg={C.pink} size={46}>buat langganan AI?!</Sticker>
      </At>
      {PLANS.map((p, i) => (
        <At key={p.key} x={560 + i * 400} y={620} s={pop(f, 62 + i * 8)} r={(i - 1) * 6}>
          <Logo p={p} size={200} />
        </At>
      ))}
      <At x={960} y={810} s={pop(f, 100)} r={-1.5}>
        <Sticker bg={C.red} size={50} style={{ color: C.white }}>pakai PLAN TERTINGGI masing-masing!</Sticker>
      </At>
      <Captions {...CAP} lines={[{ from: 100, to: 180, text: 'Dari tiap AI, kita ambil paket *paling tinggi* (paling mahal). Kuat langganan *berapa lama*?' }]} />
    </>
  );
};

/* ================================================================== */
/* the tier ladder: every plan, cheapest at the bottom                 */
/* ================================================================== */
const Ladder: React.FC<{ p: Plan; at: number }> = ({ p, at }) => {
  const f = useCurrentFrame();
  const tiers = TIERS[p.key];
  const n = tiers.length;
  const hl = at + n * 10 + 12; // highlight the top tier once all rows are in
  const rowH = n > 5 ? 74 : 84;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 760 }}>
      {[...tiers].reverse().map((t, ri) => {
        const i = n - 1 - ri; // 0 = cheapest
        const top = i === n - 1;
        const s = pop(f, at + i * 10);
        const lit = top ? lin(f, hl, hl + 6) : 0;
        const dim = top ? 1 : 1 - 0.45 * lin(f, hl, hl + 10);
        return (
          <div key={t.name} style={{ position: 'relative', alignSelf: 'flex-start', marginLeft: (n - 1 - i) * 26, transform: `scale(${s * (top ? 1 + 0.05 * lit : 1)})`, transformOrigin: 'left center', opacity: dim }}>
            <Box
              bg={top && lit > 0.5 ? p.color : C.white} pad="0 24px" radius={16} sh={top ? 10 : 6}
              style={{ height: rowH, width: 500 + i * 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}
            >
              <span style={{ fontFamily: HEAD, fontSize: 36 }}>{t.name}</span>
              <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32 }}>{t.price}<span style={{ fontSize: 20 }}>{t.price === 'Gratis' ? '' : '/bln'}</span></span>
            </Box>
            {top && (
              <div style={{ position: 'absolute', left: '100%', marginLeft: 22, top: '50%', transform: `translateY(-50%) rotate(-6deg) scale(${pop(f, hl, 220)})` }}>
                <Sticker bg={C.red} size={28} style={{ color: C.white }}>✓ tertinggi</Sticker>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ================================================================== */
/* 1-3. One scene per AI                                               */
/* ================================================================== */
const PlanSceneH: React.FC<{ p: Plan; step: number; lines: string[] }> = ({ p, step, lines }) => {
  const f = useCurrentFrame();
  const m = months(p);
  const end = lastYear(p);
  const year = Math.round(2026 + count(f, 315, 395, end - 2026));
  return (
    <>
      <Background />
      {/* left: title + ladder */}
      <At x={250} y={90} s={pop(f, 0)} r={-3}>
        <Sticker bg={C.ink} size={28} style={{ color: C.white, boxShadow: shadow(7).replace(C.ink, p.color) }}>AI #{step} dari 3</Sticker>
      </At>
      <At x={560} y={90} s={pop(f, 6)}>
        <Box bg={p.color} pad="8px 26px 8px 12px" style={{ fontFamily: HEAD, fontSize: 54, width: 'max-content', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Logo p={p} size={64} />
          {p.app.toUpperCase()}
        </Box>
      </At>
      <div style={{ position: 'absolute', left: 70, top: 175 }}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, marginBottom: 14, opacity: lin(f, 8, 16) }}>Semua paket {p.app}, termurah di bawah:</div>
        <Ladder p={p} at={14} />
      </div>
      {/* right: the math */}
      <At x={1420} y={235} s={pop(f, 140)} r={-1}>
        <Box bg={C.white} pad="14px 26px" style={{ width: 820, display: 'flex', alignItems: 'center', gap: 22 }}>
          <Logo p={p} size={130} />
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30 }}>{p.app} {p.plan} <span style={{ background: C.red, color: C.white, border: `3px solid ${C.ink}`, borderRadius: 8, padding: '0 8px', fontSize: 22 }}>TERTINGGI</span></div>
            <div style={{ fontFamily: HEAD, fontSize: 58 }}>Rp{rp(p.idr)}/bln</div>
            <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 22 }}>{p.usd ? `$${p.usd} × kurs Rp${rp(KURS)} (belum pajak)` : 'harga resmi Google untuk Indonesia'}</div>
          </div>
        </Box>
      </At>
      <At x={1420} y={400} s={pop(f, 185)}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38, width: 'max-content' }}>Rp14,7 M ÷ Rp{rp(p.idr)} =</div>
      </At>
      <At x={1420} y={500} s={pop(f, 200) * bump(f, 270)} r={-1.5}>
        <Box bg={p.color} pad="10px 34px" style={{ fontFamily: HEAD, fontSize: 88, lineHeight: 1, width: 'max-content', display: 'flex', alignItems: 'baseline', gap: 16 }}>
          {rp(count(f, 200, 270, m))}
          <span style={{ fontSize: 44 }}>bulan</span>
        </Box>
      </At>
      <At x={1420} y={620} s={pop(f, 285)} r={-3}>
        <Sticker bg={C.red} size={44} style={{ color: C.white }}>= {yrs(p)} tahun {m % 12} bulan!</Sticker>
      </At>
      <At x={1230} y={800} s={pop(f, 310) * bump(f, 395)} r={-3}>
        <Calendar year={year} color={p.color} w={270} month="LUNAS S/D" />
      </At>
      <At x={1620} y={800} s={pop(f, 400)} r={4}>
        <Box bg={C.white} pad="12px 22px" style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, textAlign: 'center', lineHeight: 1.2, width: 'max-content' }}>
          ±<span style={{ fontFamily: HEAD, fontSize: 50 }}>{Math.round(yrs(p) / 25)}</span> generasi<br />
          <span style={{ fontWeight: 500, fontSize: 22 }}>(1 generasi ±25 tahun)</span>
        </Box>
      </At>
      <Captions
        {...CAP}
        lines={[
          { from: 20, to: 140, text: lines[0] },
          { from: 140, to: 285, text: lines[1] },
          { from: 285, to: 450, text: lines[2] },
        ]}
      />
    </>
  );
};

const [CL, GPT, GEM] = PLANS;

export const ClaudeH: React.FC = () => (
  <PlanSceneH
    p={CL} step={1}
    lines={[
      `Claude punya ${TIERS.claude.length} paket. Kita ambil yang *paling tinggi*: *${CL.plan}* (dulu namanya Max 20x).`,
      `Harganya *$${CL.usd}* sebulan, sekitar *Rp${juta(CL.idr)} juta*.`,
      `Rp14,7 M cukup buat *${yrs(CL)} tahun*. Lunas sampai *tahun ${lastYear(CL)}*!`,
    ]}
  />
);

export const ChatGPTH: React.FC = () => (
  <PlanSceneH
    p={GPT} step={2}
    lines={[
      `ChatGPT punya ${TIERS.chatgpt.length} paket. Paling tinggi: *${GPT.plan}*, satu-satunya yang dapat *Ultrafast*.`,
      `Harganya *$${GPT.usd}* sebulan, sekitar *Rp${juta(GPT.idr)} juta*. Paling mahal dari ketiganya.`,
      `Tetap kuat *${yrs(GPT)} tahun*, sampai *tahun ${lastYear(GPT)}*!`,
    ]}
  />
);

export const GeminiH: React.FC = () => (
  <PlanSceneH
    p={GEM} step={3}
    lines={[
      `Gemini punya ${TIERS.gemini.length} paket. Paling tinggi: *Google AI Ultra 20x*.`,
      `Di Indonesia harganya *Rp${juta(GEM.idr)} juta* sebulan, sudah dalam rupiah.`,
      `Ini yang paling awet: *${yrs(GEM)} tahun*, sampai *tahun ${lastYear(GEM)}*!`,
    ]}
  />
);

/* ================================================================== */
/* 4. Recap                                                            */
/* ================================================================== */
export const RecapH: React.FC = () => {
  const f = useCurrentFrame();
  const sorted = [...PLANS].sort((a, b) => months(b) - months(a));
  const max = months(sorted[0]);
  return (
    <>
      <Background color={C.yellow} />
      <At x={960} y={85} s={pop(f, 0)} r={-1.5}>
        <Box bg={C.white} pad="12px 34px" style={{ fontFamily: HEAD, fontSize: 52, width: 'max-content' }}>
          Rp14,7 M = langganan plan tertinggi…
        </Box>
      </At>
      {sorted.map((p, i) => {
        const g = ease(f, 15 + i * 15, 55 + i * 15);
        return (
          <At key={p.key} x={960} y={270 + i * 190} s={pop(f, 10 + i * 15)}>
            <div style={{ width: 1500 }}>
              <div style={{ fontFamily: HEAD, fontSize: 40, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Logo p={p} size={48} />{p.app} <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30 }}>{p.plan} · Rp{rp(p.idr)}/bln</span></span>
                <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, opacity: lin(f, 70 + i * 10, 80 + i * 10) }}>atau {Math.floor(UANG / (p.idr * 12))} orang × 1 thn</span>
              </div>
              <div style={{ height: 100, width: Math.max(420, 1500 * (months(p) / max)) * g, background: p.color, border: `${BORDER}px solid ${C.ink}`, borderRadius: 14, boxShadow: shadow(8), display: 'flex', alignItems: 'center', paddingLeft: 24, fontFamily: HEAD, fontSize: 56, whiteSpace: 'nowrap', overflow: 'hidden', boxSizing: 'border-box' }}>
                {Math.round(yrs(p) * g)} tahun
              </div>
            </div>
          </At>
        );
      })}
      <Footnote
        y={855} from={20}
        text={`Harga Nov 2026 · kurs Rp${rp(KURS)}/$ (6 Nov 2026) · harga dolar belum termasuk pajak · mulai langganan Nov 2026`}
      />
      <Captions {...CAP} lines={[{ from: 110, to: 300, text: 'Kamu pakai AI yang mana? Tulis di *komentar*!' }]} />
    </>
  );
};
