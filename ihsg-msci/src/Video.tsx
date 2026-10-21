import React from 'react';
import { AbsoluteFill, Easing, Html5Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { AUDIO_SECONDS, CAPTIONS, LEVEL } from './audio-data';
import { Character } from './Character';
import { C, FONT, FPS, s } from './theme';
import { DURATION, PANELS, SPEECH_AT } from './timeline';

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
const pop = (f: number, start: number, k = 180) => spring({ frame: f - start, fps: FPS, config: { damping: 13, stiffness: k, mass: 0.7 } });
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const at = (f: number, sec: number, k = 180) => pop(f, s(sec), k);
const fmt = (v: number) => Math.round(v).toLocaleString('id-ID');

const Panel: React.FC<{ f: number; a: number; b: number; children: React.ReactNode }> = ({ f, a, b, children }) => {
  const from = s(a);
  const to = s(b);
  if (f < from || f >= to + 8) return null;
  const inP = ease(f, from, from + 10);
  const outP = ease(f, to - 2, to + 8);
  return <AbsoluteFill style={{ opacity: inP * (1 - outP), transform: `translateX(${(1 - inP) * 80 - outP * 80}px)` }}>{children}</AbsoluteFill>;
};

const Title: React.FC<{ f: number; at: number; kicker: string; text: string; color?: string }> = ({ f, at: t, kicker, text, color = C.text }) => {
  const p = pop(f, s(t), 200);
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: 150, fontFamily: FONT, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 3, color: C.amber, textTransform: 'uppercase' }}>{kicker}</div>
      <div style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.08, letterSpacing: -1.5, color, marginTop: 8 }}>{text}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* panel 1: what MSCI is proposing                                     */
/* ------------------------------------------------------------------ */
const Msci: React.FC<{ f: number }> = ({ f }) => {
  const t0 = PANELS.msci;
  const fall = ease(f, s(t0 + 2.2), s(t0 + 3.0));
  return (
    <>
      <Title f={f} at={t0 + 0.1} kicker="Konteks" text="MSCI usul turunkan status pasar Indonesia" />
      <div style={{ position: 'absolute', left: 60, right: 60, top: 420, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FONT }}>
        {[
          { label: 'Emerging Market', sub: 'status sekarang', c: C.blue, t: 0.8 },
          { label: 'Standalone Market', sub: 'yang diusulkan', c: C.red, t: 2.2 },
        ].map((b, i) => (
          <React.Fragment key={b.label}>
            {i === 1 && (
              <div style={{ fontSize: 80, fontWeight: 900, color: C.red, opacity: lin(f, s(t0 + 1.8), s(t0 + 2.1)), transform: `translateY(${fall * 20}px)` }}>→</div>
            )}
            <div style={{ transform: `scale(${at(f, t0 + b.t)})`, width: 400, padding: '26px 24px', borderRadius: 28, background: C.panel, border: `4px solid ${b.c}`, textAlign: 'center' }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: b.c, lineHeight: 1.05 }}>{b.label}</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: C.dim, marginTop: 8 }}>{b.sub}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 680, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: FONT }}>
        {[
          { t: 3.4, k: '15 Okt 2026', v: 'MSCI buka konsultasi' },
          { t: 4.2, k: 'Paling lambat 30 Jun 2027', v: 'keputusan final' },
        ].map((r) => (
          <div key={r.k} style={{ display: 'flex', gap: 18, alignItems: 'baseline', fontSize: 36, opacity: lin(f, s(t0 + r.t), s(t0 + r.t) + 6), transform: `translateX(${(1 - at(f, t0 + r.t, 220)) * -30}px)` }}>
            <span style={{ fontWeight: 900, color: C.amber }}>{r.k}</span>
            <span style={{ fontWeight: 600, color: C.text }}>{r.v}</span>
          </div>
        ))}
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* panel 2: IHSG through 2026                                          */
/* ------------------------------------------------------------------ */
// Closing levels reported by the press from BEI data. Jan 1 is derived from
// the reported YTD changes (all three give ~8,647).
const POINTS: { d: number; v: number; label?: string }[] = [
  { d: 0, v: 8647, label: 'Awal 2026' },
  { d: 141, v: 6162, label: '22 Mei' },
  { d: 161, v: 5867 },
  { d: 274, v: 6037, label: '2 Okt' },
  { d: 287, v: 5864 },
  { d: 288, v: 5185, label: '16 Okt' },
  { d: 291, v: 4997 },
  { d: 292, v: 5279, label: '20 Okt' },
];
const CH = { x: 90, y: 360, w: 860, h: 520, vmin: 4600, vmax: 9000, dmax: 300 };
const px = (d: number) => CH.x + (d / CH.dmax) * CH.w;
const py = (v: number) => CH.y + CH.h - ((v - CH.vmin) / (CH.vmax - CH.vmin)) * CH.h;

const Chart: React.FC<{ f: number }> = ({ f }) => {
  const t0 = PANELS.chart;
  const draw = ease(f, s(t0 + 0.4), s(t0 + 3.2));
  // build the path up to `draw` of the time axis
  const dEnd = draw * POINTS[POINTS.length - 1].d;
  const pts: [number, number][] = [];
  for (let i = 0; i < POINTS.length; i++) {
    const p = POINTS[i];
    if (p.d <= dEnd) pts.push([px(p.d), py(p.v)]);
    else {
      const q = POINTS[i - 1];
      const k = (dEnd - q.d) / (p.d - q.d);
      pts.push([px(dEnd), py(q.v + (p.v - q.v) * k)]);
      break;
    }
  }
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return (
    <>
      <Title f={f} at={t0 + 0.1} kicker="IHSG 2026" text="Turun ±40% sejak awal tahun" color={C.red} />
      <svg width={1080} height={1000} style={{ position: 'absolute', left: 0, top: 0 }}>
        {[5000, 6000, 7000, 8000, 9000].map((v) => (
          <g key={v}>
            <line x1={CH.x} x2={CH.x + CH.w} y1={py(v)} y2={py(v)} stroke={C.line} strokeWidth={2} />
            <text x={CH.x + CH.w} y={py(v) - 8} textAnchor="end" fill={C.dim} fontFamily={FONT} fontSize={24} fontWeight={600}>{fmt(v)}</text>
          </g>
        ))}
        <path d={`${path} L${last[0]} ${CH.y + CH.h} L${CH.x} ${CH.y + CH.h} Z`} fill={`${C.red}22`} />
        <path d={path} fill="none" stroke={C.red} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
        {POINTS.filter((p) => p.label && p.d <= dEnd).map((p) => (
          <g key={p.d}>
            <circle cx={px(p.d)} cy={py(p.v)} r={9} fill={C.bg} stroke={C.text} strokeWidth={4} />
            <text x={px(p.d) - (p.d > 280 ? 14 : -14)} y={py(p.v) + (p.d === 288 ? 44 : -18)} textAnchor={p.d > 280 ? 'end' : 'start'} fill={C.text} fontFamily={FONT} fontSize={26} fontWeight={800}>
              {p.label} · {fmt(p.v)}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 90, top: 905, transform: `scale(${at(f, t0 + 3.4, 220)})`, transformOrigin: 'left center', fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.text, background: C.panel, borderRadius: 999, padding: '10px 24px', border: `3px solid ${C.red}` }}>
        Asing net sell ±Rp88 T sepanjang 2026
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* panel 3: the last week, day by day                                  */
/* ------------------------------------------------------------------ */
const DAYS = [
  { d: 'Kam 15', v: 0, note: 'MSCI umumkan konsultasi' },
  { d: 'Jum 16', v: -11.57, note: 'trading halt' },
  { d: 'Sen 19', v: -3.64, note: '' },
  { d: 'Sel 20', v: 5.65, note: 'rebound' },
];
const Week: React.FC<{ f: number }> = ({ f }) => {
  const t0 = PANELS.week;
  const zero = 600;
  return (
    <>
      <Title f={f} at={t0 + 0.1} kicker="Sepekan terakhir" text="Naik-turunnya ekstrem" />
      {DAYS.map((d, i) => {
        const g = ease(f, s(t0 + 0.5 + i * 0.45), s(t0 + 0.9 + i * 0.45));
        const h = Math.abs(d.v) * 21 * g;
        const x = 120 + i * 220;
        const c = d.v < 0 ? C.red : d.v > 0 ? C.green : C.dim;
        return (
          <div key={d.d} style={{ fontFamily: FONT }}>
            <div style={{ position: 'absolute', left: x, width: 150, top: d.v < 0 ? zero : zero - h, height: Math.max(h, 4), background: c, borderRadius: 10 }} />
            <div style={{ position: 'absolute', left: x - 30, width: 210, top: d.v < 0 ? zero + h + 10 : zero - h - 56, textAlign: 'center', fontSize: 40, fontWeight: 900, color: c, opacity: g }}>
              {d.v === 0 ? '—' : `${d.v > 0 ? '+' : ''}${d.v.toLocaleString('id-ID')}%`}
            </div>
            <div style={{ position: 'absolute', left: x - 30, width: 210, top: d.v < 0 ? zero - 50 : zero + 14, textAlign: 'center', fontSize: 28, fontWeight: 700, color: C.dim }}>{d.d}</div>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 90, right: 90, top: zero, height: 3, background: C.line }} />
      <div style={{ position: 'absolute', left: 60, right: 60, top: 950, textAlign: 'center', fontFamily: FONT, fontSize: 24, color: C.dim, opacity: lin(f, s(t0 + 2.4), s(t0 + 2.8)) }}>
        Penutupan harian (sumber berbeda tipis untuk 19 Okt)
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* panel 4: risk for tomorrow, as scenarios                            */
/* ------------------------------------------------------------------ */
const Risk: React.FC<{ f: number }> = ({ f }) => {
  const t0 = PANELS.risk;
  const cols = [
    { t: 0.6, head: '▲ Lanjut pulih jika…', c: C.green, rows: ['BI Rate menenangkan rupiah', 'BEI & Danantara terus menopang', 'Asing berhenti jual'] },
    { t: 1.2, head: '▼ Tertekan lagi jika…', c: C.red, rows: ['Kabar MSCI memburuk', 'Asing lanjut net sell', 'Sentimen global negatif'] },
  ];
  return (
    <>
      <Title f={f} at={t0 + 0.1} kicker="Risiko IHSG besok · 22 Okt" text="Volatilitas masih tinggi" color={C.amber} />
      <div style={{ position: 'absolute', left: 50, right: 50, top: 380, display: 'flex', gap: 24, fontFamily: FONT }}>
        {cols.map((c) => (
          <div key={c.head} style={{ flex: 1, transform: `scale(${at(f, t0 + c.t)})`, background: C.panel, borderRadius: 28, border: `4px solid ${c.c}`, padding: '26px 24px' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: c.c, marginBottom: 18 }}>{c.head}</div>
            {c.rows.map((r, i) => (
              <div key={r} style={{ fontSize: 31, fontWeight: 650, color: C.text, lineHeight: 1.25, marginTop: 14, opacity: lin(f, s(t0 + c.t + 0.4 + i * 0.3), s(t0 + c.t + 0.6 + i * 0.3)) }}>• {r}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 860, textAlign: 'center', fontFamily: FONT, opacity: lin(f, s(t0 + 2.6), s(t0 + 3.0)) }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.text }}>Bukan ajakan jual/beli. DYOR.</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.dim, marginTop: 6 }}>Data: BEI via Kontan, Kompas, Pintu, Investing.com · 21 Okt 2026</div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* speaker                                                             */
/* ------------------------------------------------------------------ */
const Speaker: React.FC<{ f: number }> = ({ f }) => {
  const i = f - s(SPEECH_AT);
  const lv = i >= 0 && i < LEVEL.length ? LEVEL[i] : 0;
  const prev = i >= 1 && i - 1 < LEVEL.length ? LEVEL[i - 1] : 0;
  const mouth = (lv + prev) / 2;
  const blinkPhase = f % 110;
  const blink = blinkPhase < 4 ? Math.sin((blinkPhase / 4) * Math.PI) : 0;
  // raise a finger while the voice stays loud for a moment
  let loud = 0;
  for (let k = Math.max(0, i - 20); k <= i && k < LEVEL.length; k++) loud += LEVEL[k] > 0.55 ? 1 : 0;
  const point = interpolate(loud, [8, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 540 - 330, top: 1920 - 836, transform: `scale(1.1)`, transformOrigin: '50% 100%' }}>
      <Character mouth={mouth} blink={blink} tilt={Math.sin(f * 0.05) * 2.5 + mouth * 2} point={point} />
    </div>
  );
};

const Captions: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS - SPEECH_AT;
  const c = CAPTIONS.find((x) => t >= x.a && t < x.b + 0.15);
  if (!c) return null;
  const p = pop(f, s(SPEECH_AT + c.a), 260);
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: 1010, display: 'flex', justifyContent: 'center' }}>
      <div style={{ transform: `scale(${0.9 + 0.1 * p})`, fontFamily: FONT, fontSize: 46, fontWeight: 850, color: C.text, background: 'rgba(14,22,38,0.88)', border: `3px solid ${C.amber}`, borderRadius: 18, padding: '10px 26px', textAlign: 'center', maxWidth: 940 }}>
        {c.t}
      </div>
    </div>
  );
};

const Opener: React.FC<{ f: number }> = ({ f }) => {
  if (f > s(SPEECH_AT) + 10) return null;
  const o = 1 - lin(f, s(SPEECH_AT), s(SPEECH_AT) + 10);
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 260, fontFamily: FONT }}>
      <div style={{ transform: `scale(${pop(f, 2)})`, textAlign: 'center' }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 4, color: C.amber }}>PIDATO PRESIDEN</div>
        <div style={{ fontSize: 76, fontWeight: 900, color: C.text, lineHeight: 1.05, marginTop: 10 }}>MSCI & nasib IHSG</div>
      </div>
    </AbsoluteFill>
  );
};

export const IhsgMsci: React.FC = () => {
  const f = useCurrentFrame();
  const end = SPEECH_AT + AUDIO_SECONDS + 6;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bg}, #0A1020 55%, #1A1410)`, opacity: 1 - lin(f, DURATION - 10, DURATION) }}>
      {/* ticker band at the very top */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 60, height: 56, display: 'flex', alignItems: 'center', gap: 40, paddingLeft: 40, fontFamily: FONT, fontSize: 28, fontWeight: 800, color: C.dim, borderBottom: `2px solid ${C.line}` }}>
        <span style={{ color: C.text }}>IHSG</span>
        <span>20 Okt <span style={{ color: C.green }}>5.278,89 ▲5,65%</span></span>
        <span>YTD <span style={{ color: C.red }}>±−40%</span></span>
      </div>
      <Opener f={f} />
      <Panel f={f} a={PANELS.msci} b={PANELS.chart}><Msci f={f} /></Panel>
      <Panel f={f} a={PANELS.chart} b={PANELS.week}><Chart f={f} /></Panel>
      <Panel f={f} a={PANELS.week} b={PANELS.risk}><Week f={f} /></Panel>
      <Panel f={f} a={PANELS.risk} b={end + 1}><Risk f={f} /></Panel>
      <Speaker f={f} />
      <Captions f={f} />
      <div style={{ position: 'absolute', left: 30, top: 1060, fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.dim, transform: 'rotate(-90deg)', transformOrigin: 'left top' }}>ilustrasi kartun</div>
      {AUDIO_SECONDS > 0 && (
        <Sequence from={s(SPEECH_AT)} layout="none">
          <SpeechAudio />
        </Sequence>
      )}
      {[PANELS.chart, PANELS.week, PANELS.risk].map((t) => (
        <Sequence key={t} from={s(t) - 3} durationInFrames={30} layout="none">
          <Html5Audio src={staticFile('sfx/whoosh.wav')} volume={0.12} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** the speech clip; absent until scripts/prep_audio.py has been run on it */
const SpeechAudio: React.FC = () => (HAS_SPEECH ? <Html5Audio src={staticFile('speech.wav')} /> : null);
const HAS_SPEECH = false;
