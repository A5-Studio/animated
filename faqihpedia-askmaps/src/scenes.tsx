import React from 'react';
import { OffthreadVideo, Sequence, staticFile } from 'remotion';
import {
  At, Bar, Card, Chat, SegmentTag, Check, Cup, Pin, Search, Sparkle, Star, Stars, Tag, Thumb, ease, lin, mix, out, pop,
} from './ui';
import { C, SANS, SERIF, s, soft } from './theme';

/*
 * Every scene is timed in seconds of public/source.mp4 (the cut talking head).
 * 'split' scenes draw into the top 1080x960, 'anim' scenes into the full 1080x1920.
 */
export type Scene = { from: number; to: number; mode: 'split' | 'anim'; C: React.FC<{ f: number }> };

const T = s;

/* ================================================================== */
/* 1. Hook: "AI itu benar-benar mengubah kita dalam kehidupan…"        */
/* ================================================================== */
const Word: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, children, style }) => {
  const p = out(f, T(at), T(at) + 10);
  return (
    <span style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 26}px)`, filter: `blur(${(1 - p) * 6}px)`, ...style }}>
      {children}
    </span>
  );
};

const Hook: React.FC<{ f: number }> = ({ f }) => {
  const under = ease(f, T(3.3), T(4.1));
  return (
    <>
      <At x={540} y={250} o={out(f, 0, 10)}>
        <SegmentTag size={28} />
      </At>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: SERIF, color: C.ink, fontSize: 104, lineHeight: 1.08, letterSpacing: -2 }}>
        <div>
          <Word f={f} at={0}>AI</Word> <Word f={f} at={0.5}>benar-benar</Word>
        </div>
        <div>
          <Word f={f} at={1.4}>mengubah</Word>
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Word f={f} at={2.58}>keseharian</Word> <Word f={f} at={3.22}>kita.</Word>
          <svg width={720} height={40} style={{ position: 'absolute', left: -10, bottom: -26 }}>
            <path d="M6 24 C 180 6, 420 6, 712 20" stroke={C.blue} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={760} strokeDashoffset={760 * (1 - under)} />
          </svg>
        </div>
      </div>
    </>
  );
};

/* ================================================================== */
/* 2-3. The old way, animated: search -> pins -> open one by one ->     */
/*      stars -> review count -> comments -> menu                       */
/* ================================================================== */
const MAP_W = 960;
const MAP_H = 830;

export const PINS: [number, number][] = [
  [250, 235], [470, 205], [612, 250], [330, 330], [540, 372], [735, 300],
  [175, 420], [420, 470], [650, 455], [830, 415], [290, 600], [565, 625],
];

const PLACES = [
  { pin: 1, name: 'Kopi Senja', rating: 4.3, count: '312', kind: 'Kafe · Rp 25–50 rb · 450 m' },
  { pin: 4, name: 'Teras Pagi', rating: 4.5, count: '876', kind: 'Kafe · Rp 25–50 rb · 700 m' },
  { pin: 8, name: 'Kedai Hijau', rating: 4.6, count: '1.204', kind: 'Kafe · Rp 50–75 rb · 1,1 km' },
];
const SWITCH = [8.6, 9.78, 10.42]; // "kita buka ini lokasinya satu-satu"

export const MapArt: React.FC = () => (
  <svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
    <rect width={MAP_W} height={MAP_H} fill={C.land} />
    <path d="M690 360 L880 330 L905 470 L760 520 L680 470 Z" fill={C.park} />
    <path d="M60 180 L170 160 L190 250 L80 270 Z" fill={C.park} />
    <path d="M-20 760 C 160 700, 260 820, 420 760 S 700 700, 980 780 L980 900 L-20 900 Z" fill={C.water} />
    {/* minor roads */}
    {[
      'M0 140 L960 95', 'M0 520 L960 595', 'M0 690 L960 700', 'M140 0 L225 830', 'M655 0 L705 830',
      'M835 0 L765 830', 'M520 0 L565 310', 'M260 300 L600 560', 'M0 400 L380 380', 'M560 160 L960 220',
    ].map((d, i) => (
      <g key={i}>
        <path d={d} stroke={C.roadEdge} strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d={d} stroke={C.road} strokeWidth={16} fill="none" strokeLinecap="round" />
      </g>
    ))}
    {/* major roads */}
    {['M-10 300 C 300 255, 610 345, 970 280', 'M380 -10 C 410 300, 340 560, 425 840'].map((d, i) => (
      <g key={i}>
        <path d={d} stroke={C.majorEdge} strokeWidth={30} fill="none" />
        <path d={d} stroke={C.major} strokeWidth={24} fill="none" />
      </g>
    ))}
    <g fontFamily={SANS} fontSize={22} fill="#8D877C" fontWeight={500}>
      <text x={430} y={420} fontSize={28} fontWeight={700} fill="#6F6A60">Blok M</text>
      <text x={720} y={190}>Senopati</text>
      <text x={60} y={640}>Kebayoran</text>
      <text x={735} y={420} fill="#5E8A50">Taman</text>
      <text x={210} y={285} transform="rotate(-8 210 285)">Jl. Melawai Raya</text>
    </g>
  </svg>
);

/** camera target per moment: which pin is centred and how far we zoom */
const camera = (f: number) => {
  const zoomIn = ease(f, T(8.6), T(8.6) + 16);
  let x = 480;
  let y = 400;
  let cx = 480;
  let cy = 400;
  SWITCH.forEach((t, i) => {
    const [px, py] = PINS[PLACES[i].pin];
    const k = i === 0 ? 1 : ease(f, T(t), T(t) + 9);
    x = mix(x, px, k);
    y = mix(y, py, k);
  });
  cx = mix(480, x, zoomIn);
  cy = mix(400, y, zoomIn);
  const z = mix(1, 1.35, zoomIn);
  // centre the active pin in the strip above the bottom sheet (y ~ 215)
  const ty = mix(400, 215, zoomIn);
  return { z, tx: 480 - cx * z, ty: ty - cy * z };
};

const activePlace = (f: number) => (f >= T(SWITCH[2]) ? 2 : f >= T(SWITCH[1]) ? 1 : 0);

const Highlight: React.FC<{ f: number; a: number; b: number; children: React.ReactNode }> = ({ f, a, b, children }) => {
  const k = out(f, T(a), T(a) + 8) * (1 - lin(f, T(b), T(b) + 6));
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          position: 'absolute', inset: '-8px -14px', borderRadius: 16, background: `rgba(245,180,0,${0.16 * k})`,
          boxShadow: `0 0 0 ${4 * k}px rgba(245,180,0,${0.9 * k})`, transform: `scale(${0.9 + 0.1 * k})`,
        }}
      />
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>{children}</span>
    </span>
  );
};

const REVIEWS = [
  { c: '#F1B6A8', who: 'Rina', r: 5, text: '“Tempatnya nyaman buat kerja, wifi kencang.”' },
  { c: '#A8C8F1', who: 'Dimas', r: 4, text: '“Kopinya enak, tapi rame pas weekend.”' },
  { c: '#B9DDB0', who: 'Sarah', r: 4, text: '“Matcha-nya oke, pelayanannya ramah.”' },
];
const MENU = [
  { n: 'Matcha Latte', bg: '#D7E8C6', l: C.matcha },
  { n: 'Kopi Susu', bg: '#EBDCC9', l: '#B98A5E' },
  { n: 'Hojicha', bg: '#E8D3C0', l: '#9A6A45' },
  { n: 'Americano', bg: '#E2DAD0', l: '#5B4535' },
  { n: 'Es Teh', bg: '#F3E3B8', l: '#C98E2E' },
  { n: 'Cokelat', bg: '#E5D2CB', l: '#6E4434' },
];

const Sheet: React.FC<{ f: number }> = ({ f }) => {
  const i = activePlace(f);
  const p = PLACES[i];
  const swap = i === 0 ? 1 : out(f, T(SWITCH[i]), T(SWITCH[i]) + 8);
  const tab = f >= T(18.64) ? 2 : f >= T(15.18) ? 1 : 0;
  const starFill = i === 2 ? mix(0, p.rating, ease(f, T(11.74), T(11.74) + 14)) : p.rating;
  const tabX = [0, 196, 362][tab];
  const tabW = [168, 128, 104][tab];
  const tabK = tab === 0 ? 1 : out(f, T(tab === 1 ? 15.18 : 18.64), T(tab === 1 ? 15.18 : 18.64) + 8);
  const prevX = [0, 0, 196][tab];
  const prevW = [168, 168, 128][tab];

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: MAP_W, height: 620, background: C.card, borderRadius: '34px 34px 0 0', boxShadow: '0 -10px 40px rgba(0,0,0,0.12)', fontFamily: SANS }}>
      <div style={{ width: 72, height: 8, borderRadius: 8, background: '#DDD8CE', margin: '14px auto 0' }} />
      <div style={{ padding: '18px 40px 0', opacity: swap, transform: `translateX(${(1 - swap) * 60}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 46, fontWeight: 650, letterSpacing: -0.5 }}>{p.name}</div>
          <Tag style={{ fontSize: 22 }}>tempat {i + 1} dari 12</Tag>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 14, fontSize: 30 }}>
          <Highlight f={f} a={11.74} b={12.82}>
            <b style={{ fontWeight: 650 }}>{p.rating.toFixed(1).replace('.', ',')}</b>
            <Stars value={starFill} size={30} />
          </Highlight>
          <Highlight f={f} a={12.82} b={15.18}>
            <span style={{ color: C.sub }}>({p.count} ulasan)</span>
          </Highlight>
        </div>
        <div style={{ color: C.sub, fontSize: 25, marginTop: 10 }}>{p.kind}</div>
      </div>
      {/* tabs */}
      <div style={{ position: 'relative', display: 'flex', gap: 34, padding: '0 40px', marginTop: 26, fontSize: 27, fontWeight: 600, borderBottom: `2px solid ${C.line}`, height: 58 }}>
        {['Ringkasan', 'Ulasan', 'Menu'].map((t, k) => (
          <div key={t} style={{ color: k === tab ? C.blue : C.sub, width: [168, 128, 104][k] - 34 + (k === 0 ? 34 : 0) }}>{t}</div>
        ))}
        <div style={{ position: 'absolute', bottom: -2, left: 40 + mix(prevX, tabX, tabK), width: mix(prevW, tabW, tabK) - 34, height: 5, borderRadius: 5, background: C.blue }} />
      </div>
      {/* tab bodies */}
      <div style={{ position: 'relative', height: 330, overflow: 'hidden' }}>
        {tab === 0 && (
          <div style={{ display: 'flex', gap: 14, padding: '24px 40px', opacity: swap }}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ width: 280, height: 200, borderRadius: 20, background: ['#E6DCCD', '#D9E4CF', '#E9D8C6'][k], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cup size={86} liquid={[C.matcha, '#B98A5E', '#9A6A45'][k]} />
              </div>
            ))}
          </div>
        )}
        {tab === 1 && (
          <div style={{ padding: '22px 40px', transform: `translateY(${-lin(f, T(16.2), T(18.6)) * 60}px)` }}>
            {REVIEWS.map((r, k) => {
              const a = out(f, T(15.25 + k * 0.45), T(15.25 + k * 0.45) + 8);
              return (
                <div key={k} style={{ display: 'flex', gap: 20, marginBottom: 26, opacity: a, transform: `translateY(${(1 - a) * 20}px)` }}>
                  <div style={{ width: 58, height: 58, borderRadius: 58, background: r.c, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 26, color: '#fff' }}>{r.who[0]}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 600 }}>
                      {r.who} <Stars value={r.r} size={22} gap={1} />
                    </div>
                    <div style={{ fontSize: 27, marginTop: 6, color: '#3B3934' }}>{r.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {tab === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '24px 40px' }}>
            {MENU.map((m, k) => {
              const a = pop(f, T(18.7) + k * 2, 220);
              return (
                <div key={k} style={{ height: 128, borderRadius: 18, background: m.bg, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', transform: `scale(${0.85 + 0.15 * a})`, opacity: Math.min(1, a * 1.4) }}>
                  <Cup size={60} liquid={m.l} />
                  <div style={{ fontSize: 24, fontWeight: 600 }}>{m.n}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const OldMaps: React.FC<{ f: number }> = ({ f }) => {
  const typed = 'cafe dekat Blok M';
  const nType = Math.round(lin(f, T(4.9), T(6.3)) * typed.length);
  const cam = camera(f);
  const act = activePlace(f);
  const opened = f >= T(8.6);
  const sheetY = mix(MAP_H + 20, 300, out(f, T(8.6), T(8.6) + 14));
  const cardIn = out(f, T(4.4), T(4.4) + 14);
  return (
    <Card style={{ left: 60, top: 80 + (1 - cardIn) * 40, width: MAP_W, height: MAP_H, opacity: cardIn }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: MAP_W, height: MAP_H, transformOrigin: '0 0', transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.z})` }}>
        <MapArt />
        {PINS.map(([x, y], k) => {
          const d = pop(f, T(6.6) + k * 2, 260);
          const isAct = opened && PLACES[act].pin === k;
          const visited = opened && PLACES.slice(0, act).some((p) => p.pin === k);
          const sc = (isAct ? 1.35 : 1) / cam.z;
          return (
            <div key={k} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) translateY(${(1 - d) * -40}px) scale(${sc})`, transformOrigin: '50% 100%', opacity: Math.min(1, d * 1.5) * (opened && !isAct ? 0.55 : 1) }}>
              <Pin size={50} color={isAct ? C.red : visited ? '#B9B3A8' : C.red} />
            </div>
          );
        })}
      </div>
      {/* search bar */}
      <div style={{ position: 'absolute', left: 28, right: 28, top: 26, height: 88, borderRadius: 44, background: C.card, boxShadow: '0 4px 18px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 18, padding: '0 30px', fontSize: 32 }}>
        <Search size={34} />
        <span style={{ color: nType ? C.ink : C.faint }}>{nType ? typed.slice(0, nType) : 'Cari di sini'}</span>
        {f < T(6.6) && Math.floor(f / 8) % 2 === 0 && <span style={{ width: 3, height: 38, background: C.blue, marginLeft: -14 }} />}
        <span style={{ flex: 1 }} />
        <Tag style={{ fontSize: 22 }}>cara lama</Tag>
      </div>
      <div style={{ position: 'absolute', left: 0, top: sheetY }}>
        <Sheet f={f} />
      </div>
    </Card>
  );
};

/* ================================================================== */
/* 4. "…fitur AI yang lagi aku suka banget namanya Ask Maps"           */
/* ================================================================== */
const AskTitle: React.FC<{ f: number }> = ({ f }) => {
  const a = out(f, T(22.4), T(22.4) + 12);
  const ai = pop(f, T(24.2), 200);
  const swap = ease(f, T(25.6), T(25.6) + 12);
  const b = pop(f, T(25.7), 160);
  return (
    <>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', opacity: a * (1 - swap), transform: `translateY(${(1 - a) * 30 - swap * 40}px)` }}>
        <div style={{ display: 'inline-block' }}><Pin size={70} /></div>
        <div style={{ fontFamily: SERIF, fontSize: 124, color: C.ink, letterSpacing: -2, marginTop: 10 }}>Google Maps</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 26, background: C.card, boxShadow: soft, borderRadius: 60, padding: '16px 34px', fontFamily: SANS, fontSize: 40, fontWeight: 600, transform: `scale(${ai})`, opacity: Math.min(1, ai * 2) }}>
          <Sparkle size={40} /> sekarang ada AI-nya
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', opacity: swap, transform: `translateY(${(1 - swap) * 40}px)` }}>
        <div style={{ display: 'inline-block', transform: `scale(${b}) rotate(${(1 - b) * -90}deg)` }}><Sparkle size={130} /></div>
        <div style={{ fontFamily: SERIF, fontSize: 176, color: C.ink, letterSpacing: -4, lineHeight: 1.05, marginTop: 20 }}>Ask Maps</div>
        <div style={{ marginTop: 26 }}><Tag style={{ fontSize: 30 }}>Fitur AI di Google Maps</Tag></div>
        {/* the real entry point: a chip next to the search bar */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 80, border: `3px solid ${C.blue}`, color: C.blue, borderRadius: 40, padding: '12px 30px', fontFamily: SANS, fontSize: 36, fontWeight: 600, background: '#EEF4FE', opacity: out(f, T(26.1), T(26.1) + 10) }}>
          <Sparkle size={34} /> Ask Maps
        </div>
      </div>
    </>
  );
};

/* ================================================================== */
/* 5. Typing the prompt (real screen recording) + the criteria          */
/* ================================================================== */
const CRITERIA = [
  { at: 32.18, icon: <Pin size={34} color={C.red} />, big: '≤ 2 km', small: 'dari MRT Blok M' },
  { at: 35.94, icon: <Cup size={46} color="#fff" liquid={C.matcha} />, big: 'Matcha', small: 'ceremonial', dark: C.matcha },
  { at: 38.42, icon: <Chat size={38} />, big: '500+', small: 'ulasan' },
  { at: 40.64, icon: <Star size={40} />, big: '> 4,7', small: 'rating' },
];
const TYPING_FROM = 26.8;

const AskTyping: React.FC<{ f: number }> = ({ f }) => {
  const cardIn = out(f, T(TYPING_FROM), T(TYPING_FROM) + 14);
  const sent = f >= T(41.8);
  return (
    <>
      <Card r={34} style={{ left: 40, top: 72 + (1 - cardIn) * 40, width: 688, height: 800, opacity: cardIn }}>
        <Sequence from={T(TYPING_FROM)} layout="none">
          <OffthreadVideo src={staticFile('ask_typing.mp4')} muted style={{ width: 688, height: 800, objectFit: 'cover', objectPosition: 'top' }} />
        </Sequence>
      </Card>
      <div style={{ position: 'absolute', left: 752, top: 96, fontFamily: SANS, fontSize: 26, fontWeight: 600, color: C.sub, letterSpacing: 2, opacity: cardIn }}>
        KRITERIA
      </div>
      {CRITERIA.map((c, k) => {
        const p = pop(f, T(c.at), 200);
        const ok = pop(f, T(41.8) + k * 3, 260);
        return (
          <div key={k} style={{ position: 'absolute', left: 752, top: 150 + k * 178, width: 296, height: 158, borderRadius: 26, background: C.card, boxShadow: soft, padding: '20px 22px', boxSizing: 'border-box', fontFamily: SANS, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * 60}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 58, height: 58, borderRadius: 18, background: c.dark ?? '#F1EEE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.icon}</div>
              {sent && <div style={{ transform: `scale(${ok})` }}><Check size={38} /></div>}
            </div>
            <div style={{ fontSize: 38, fontWeight: 700, marginTop: 10, letterSpacing: -0.5, color: C.ink }}>{c.big}</div>
            <div style={{ fontSize: 22, color: C.sub, marginTop: -2 }}>{c.small}</div>
          </div>
        );
      })}
    </>
  );
};

/* ================================================================== */
/* 6. The answer (real screen recording) in a phone                     */
/* ================================================================== */
const RESULT_FROM = 43.7;
const PH_W = 682;
const PH_H = 1400;

const AskResult: React.FC<{ f: number }> = ({ f }) => {
  const inP = out(f, T(RESULT_FROM), T(RESULT_FROM) + 16);
  const c1 = pop(f, T(45.3), 200);
  const c2 = ease(f, T(47.4), T(47.4) + 10);
  return (
    <>
      <div style={{ position: 'absolute', left: 540 - PH_W / 2 - 14, top: 96 + (1 - inP) * 300, width: PH_W + 28, height: PH_H + 28, borderRadius: 70, background: '#141414', boxShadow: '0 30px 80px rgba(0,0,0,0.25)', opacity: inP }}>
        <div style={{ position: 'absolute', left: 14, top: 14, width: PH_W, height: PH_H, borderRadius: 56, overflow: 'hidden', background: '#fff' }}>
          <Sequence from={T(RESULT_FROM)} layout="none">
            <OffthreadVideo src={staticFile('ask_result.mp4')} muted style={{ width: PH_W, height: PH_H, objectFit: 'cover', objectPosition: 'top' }} />
          </Sequence>
        </div>
      </div>
      <At x={540} y={1560} s={0.85 + 0.15 * c1} o={Math.min(1, c1 * 2)}>
        <div style={{ position: 'relative', height: 104, width: 820 }}>
          {[0, 1].map((k) => {
            const o = k === 0 ? 1 - c2 : c2;
            return (
              <div key={k} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, background: C.card, borderRadius: 30, boxShadow: soft, fontFamily: SANS, fontSize: 36, fontWeight: 600, color: C.ink, opacity: o, transform: `translateY(${(k === 0 ? -c2 : 1 - c2) * 20}px)` }}>
                {k === 0 ? (
                  <>
                    <Check size={44} /> Cuma 1 kafe yang lolos semua kriteria
                  </>
                ) : (
                  <>
                    <Pin size={34} /> Matcha Times Blok M · 5,0 <Star size={34} /> · 782 ulasan
                  </>
                )}
              </div>
            );
          })}
        </div>
      </At>
    </>
  );
};

/* ================================================================== */
/* 7. "Itu ngebantu banget kita nyari lokasi dengan lebih cepat"       */
/* ================================================================== */
const Compare: React.FC<{ f: number }> = ({ f }) => {
  const a = out(f, T(49.46), T(49.46) + 12);
  const b = out(f, T(49.9), T(49.9) + 12);
  const fast = pop(f, T(51.48), 200);
  const dim = ease(f, T(51.48), T(51.48) + 10);
  const CHECKS = ['Bintang berapa', 'Jumlah ulasan', 'Komen-komennya', 'Menunya'];
  return (
    <>
      <Card r={34} style={{ left: 40, top: 90 + (1 - a) * 40, width: 480, height: 780, opacity: a * (1 - 0.45 * dim), padding: 36, boxSizing: 'border-box' }}>
        <Tag>Dulu</Tag>
        <div style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 1.05, marginTop: 18, letterSpacing: -1 }}>Buka satu-satu</div>
        <div style={{ position: 'relative', height: 220, marginTop: 26 }}>
          {[0, 1, 2, 3].map((k) => (
            <div key={k} style={{ position: 'absolute', left: k * 22, top: k * 28, width: 330, height: 120, borderRadius: 20, background: C.card, boxShadow: '0 2px 10px rgba(0,0,0,0.10)', padding: '18px 22px', boxSizing: 'border-box' }}>
              <Bar w={180} h={16} c="#DCD6CB" />
              <div style={{ marginTop: 14 }}><Stars value={[4.3, 4.5, 4.1, 4.6][k]} size={22} gap={1} /></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          {CHECKS.map((t, k) => {
            const p = out(f, T(49.7) + k * 4, T(49.7) + k * 4 + 8);
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 27, color: '#45423C', marginBottom: 14, opacity: p }}>
                <Check size={28} bg="#BDB7AC" /> {t}
              </div>
            );
          })}
        </div>
      </Card>
      <Card r={34} style={{ left: 560, top: 90 + (1 - b) * 40, width: 480, height: 780, opacity: b, padding: 36, boxSizing: 'border-box', boxShadow: `${soft}, 0 0 0 ${5 * dim}px ${C.blue}`, transform: `scale(${1 + 0.03 * dim})` }}>
        <Tag style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.blue, background: '#E8F0FD' }}><Sparkle size={22} /> Ask Maps</Tag>
        <div style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 1.05, marginTop: 18, letterSpacing: -1 }}>Sekali tanya</div>
        <div style={{ marginTop: 28, marginLeft: 40, background: '#EEF1F6', borderRadius: '26px 26px 6px 26px', padding: '20px 24px', fontSize: 24, lineHeight: 1.35, color: '#2F3540' }}>
          Cafe radius 2 km dari MRT Blok M, menu matcha ceremonial, ulasan 500+, bintang &gt; 4,7
        </div>
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16, background: '#F3FAF4', borderRadius: 22, padding: '20px 22px', opacity: out(f, T(50.3), T(50.3) + 8) }}>
          <Check size={40} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 650 }}>Matcha Times Blok M</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, color: C.sub, marginTop: 4 }}>5,0 <Stars value={5} size={20} gap={1} /> (782)</div>
          </div>
        </div>
      </Card>
      <At x={800} y={880} s={fast} o={Math.min(1, fast * 2)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.blue, color: '#fff', borderRadius: 40, padding: '14px 30px', fontFamily: SANS, fontSize: 34, fontWeight: 700, boxShadow: '0 10px 30px rgba(26,115,232,0.35)' }}>
          <Sparkle size={30} color="#fff" /> Lebih cepat
        </div>
      </At>
    </>
  );
};

export const SCENES: Scene[] = [
  { from: 0, to: 4.4, mode: 'split', C: Hook },
  { from: 4.4, to: 19.98, mode: 'split', C: OldMaps },
  { from: 22.34, to: 26.8, mode: 'anim', C: AskTitle },
  { from: 26.8, to: 43.7, mode: 'split', C: AskTyping },
  { from: 43.7, to: 49.46, mode: 'anim', C: AskResult },
  { from: 49.46, to: 54.88, mode: 'split', C: Compare },
];

/* sticker over the full-frame outro: "boleh tinggalin like dulu" */
export const LikePop: React.FC<{ f: number }> = ({ f }) => {
  const p = pop(f, T(57.4), 220);
  const o = 1 - lin(f, T(59.4), T(59.4) + 8);
  if (f < T(57.4)) return null;
  return (
    <At x={540} y={300} s={p} o={o}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.94)', borderRadius: 60, padding: '20px 40px', boxShadow: soft, fontFamily: SANS, fontSize: 42, fontWeight: 650, color: C.ink }}>
        <Thumb size={48} color={C.blue} /> Like dulu, ya
      </div>
    </At>
  );
};
