import React from 'react';
import { Img, staticFile } from 'remotion';
import { At, Avatar, ClaudeIcon, Count, Key, Lock, Pill, SearchIcon, Spark, UICard, ease, lin, mix, out, pop } from './ui';
import { C, MONO, SANS, TOP, s, shadow } from './theme';

/*
 * Scenes are timed in seconds of public/source.mp4. 'split' scenes fill the top UI card (TOP),
 * 'anim' scenes draw on the whole grid (content in y ~240-1160, captions at 1250).
 */
export type Scene = { from: number; to: number; C: React.FC<{ f: number }> };
const T = s;

/** fade + small rise, 10 frames */
const In: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties; d?: number }> = ({ f, at, children, style, d = 18 }) => {
  const p = out(f, T(at), T(at) + 10);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * d}px)`, ...style }}>{children}</div>;
};
/** a pill that pops in */
const PopIn: React.FC<{ f: number; at: number; x: number; y: number; children: React.ReactNode; r?: number }> = ({ f, at, x, y, children, r = 0 }) => {
  if (f < T(at)) return null;
  const p = pop(f, T(at), 260);
  return <At x={x} y={y} s={0.6 + 0.4 * p} o={Math.min(1, p * 1.6)} r={r}>{children}</At>;
};
/** the top card, popping in when its scene starts */
const Top: React.FC<{ f: number; at: number; icon?: React.ReactNode; label?: string; url?: string; children?: React.ReactNode }> = ({ f, at, ...rest }) => {
  const p = pop(f, T(at), 220);
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${0.96 + 0.04 * p})`, transformOrigin: `540px ${TOP.y + TOP.h / 2}px`, opacity: Math.min(1, p * 1.5) }}>
      <UICard x={TOP.x} y={TOP.y} w={TOP.w} h={TOP.h} {...rest} />
    </div>
  );
};
const Photo: React.FC<{ src: string; w: number; h: number; pos?: string; gray?: boolean; label?: string }> = ({ src, w, h, pos = 'center', gray = true, label }) => (
  <div style={{ background: C.card, borderRadius: 22, border: `2px solid ${C.border}`, boxShadow: shadow, padding: 12 }}>
    <div style={{ width: w, height: h, borderRadius: 14, overflow: 'hidden' }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: gray ? 'grayscale(1)' : undefined }} />
    </div>
    {label && <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 22, color: C.sub, marginTop: 10, paddingLeft: 4 }}>{label}</div>}
  </div>
);
const typed = (f: number, text: string, from: number, to: number) => text.slice(0, Math.round(text.length * lin(f, T(from), T(to))));
const Caret: React.FC<{ f: number }> = ({ f }) => <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.blue }}>|</span>;

/* small drawings ----------------------------------------------------- */
const Mouse: React.FC<{ size?: number; dir?: number; wheel?: number; xray?: number }> = ({ size = 90, dir = 0, wheel = 0, xray = 0 }) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ overflow: 'visible', transform: `rotate(${dir}deg)` }}>
    <path d="M-34 0 Q-60 4 -64 22" fill="none" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
    <ellipse cx="0" cy="0" rx="38" ry="25" fill={xray ? '#F1D9BD' : '#C79A6B'} stroke={C.ink} strokeWidth={3} />
    {xray > 0 && (
      <g opacity={xray}>
        {[-14, 14].map((x) => (
          <g key={x} transform={`rotate(${wheel} ${x} 0)`}>
            <circle cx={x} cy={0} r={9} fill={C.ink} />
            <rect x={x - 1.2} y={-7} width={2.4} height={6} fill="#fff" />
          </g>
        ))}
        <rect x="-6" y="-18" width="12" height="8" rx="2" fill={C.red} />
      </g>
    )}
    <circle cx="30" cy="-17" r="10" fill="#E3BE93" stroke={C.ink} strokeWidth={3} />
    <circle cx="30" cy="17" r="10" fill="#E3BE93" stroke={C.ink} strokeWidth={3} />
    <path d="M30 -12 Q50 0 30 12" fill="#C79A6B" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
    <circle cx="48" cy="0" r="4" fill={C.ink} />
    <circle cx="36" cy="-5" r="2.6" fill={C.ink} />
    <circle cx="36" cy="5" r="2.6" fill={C.ink} />
  </svg>
);
const MAZE_WALLS = 'M0 0 H400 M0 0 V400 M0 400 H400 M400 80 V400 M80 0 V160 M160 80 V240 M240 0 V80 M320 80 V240 M80 240 V320 M160 320 V400 M240 240 V320 M320 320 V400 M80 160 H160 M160 240 H240 M240 160 H320 M0 320 H80 M240 320 H320 M80 80 H160';
const MAZE_PATH: [number, number][] = [[40, 360], [120, 360], [120, 280], [200, 280], [200, 360], [280, 360], [280, 280], [360, 280], [360, 200], [360, 120], [280, 120], [280, 40], [360, 40], [440, 40]];
const Maze: React.FC<{ t: number; size?: number }> = ({ t, size = 220 }) => {
  const segs = MAZE_PATH.length - 1;
  const x = Math.max(0, Math.min(1, t)) * segs;
  const i = Math.min(segs - 1, Math.floor(x));
  const k = x - i;
  const [ax, ay] = MAZE_PATH[i];
  const [bx, by] = MAZE_PATH[i + 1];
  const p = { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, dir: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI };
  const n = Math.max(1, Math.round(t * segs));
  return (
    <svg width={size} height={size} viewBox="-10 -10 480 420" style={{ overflow: 'visible' }}>
      <polyline points={[...MAZE_PATH.slice(0, n), [p.x, p.y]].map((q) => q.join(',')).join(' ')} fill="none" stroke={C.blue} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" opacity={0.45} />
      <path d={MAZE_WALLS} fill="none" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <g transform={`translate(${p.x} ${p.y})`}>
        <foreignObject x={-34} y={-34} width={68} height={68} style={{ overflow: 'visible' }}>
          <div style={{ width: 68, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mouse size={58} dir={p.dir} /></div>
        </foreignObject>
      </g>
    </svg>
  );
};
const Toggle: React.FC<{ on: boolean; w?: number }> = ({ on, w = 96 }) => (
  <div style={{ width: w, height: w * 0.56, borderRadius: w, background: on ? C.green : '#D9D9D9', position: 'relative', flex: 'none' }}>
    <div style={{ position: 'absolute', top: w * 0.06, left: on ? w * 0.5 : w * 0.06, width: w * 0.44, height: w * 0.44, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
  </div>
);
const Body: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: 'absolute', left: 30, right: 30, top: 92, bottom: 24, ...style }}>{children}</div>
);

/* ================================================================== */
/* 1. hook: Claude, counting back to 1950                              */
/* ================================================================== */
const Hook: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Top f={f} at={0} icon={<ClaudeIcon />} label="Claude" url="claude.ai">
      <Body>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.sub }}>udah ada sejak tahun</div>
        <div style={{ position: 'absolute', left: 0, top: 44 }}>
          <Count f={f} a={2026} b={1950} from={T(1.9)} to={T(3.3)} size={160} fmt={(n) => String(Math.round(n))} />
        </div>
      </Body>
    </Top>
    <PopIn f={f} at={3.85} x={770} y={440} r={-3}><Pill tone="red" size={30}>Serius</Pill></PopIn>
  </>
);

/* ================================================================== */
/* 2. no official statement from Anthropic                             */
/* ================================================================== */
const Statement: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Top f={f} at={5.35} icon={<Img src={staticFile('img/anthropic-wordmark.png')} style={{ height: 26 }} />} url="anthropic.com/news">
      <Body>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F6F6F6', border: `2px solid ${C.border}`, borderRadius: 14, padding: '10px 18px', fontFamily: MONO, fontSize: 26 }}>
          <SearchIcon size={28} /> {typed(f, 'asal nama claude', 5.6, 6.7)}{f < T(6.9) && <Caret f={f} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: 18, opacity: out(f, T(6.9), T(6.9) + 8) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 120, lineHeight: 0.9, letterSpacing: -4 }}>0</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.sub, paddingBottom: 8 }}>pernyataan resmi<br />soal asal namanya</div>
        </div>
      </Body>
    </Top>
    <PopIn f={f} at={7.3} x={790} y={420} r={-3}><Pill tone="red" size={28}>Tidak ada</Pill></PopIn>
    <PopIn f={f} at={10.4} x={540} y={488}><Pill tone="grey" size={24}>Nama seorang ilmuwan?</Pill></PopIn>
  </>
);

/* ================================================================== */
/* 3. what the forums believe                                          */
/* ================================================================== */
const Forum: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Top
      f={f}
      at={12.7}
      icon={<div style={{ width: 46, height: 46, borderRadius: '50%', background: '#FF4500', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 26 }}>r/</div>}
      label="Forum internet"
      url="r/ClaudeAI"
    >
      <Body>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, ...{ opacity: out(f, T(13.2), T(13.2) + 8) } }}>“Claude = Claude Shannon?”</div>
        <div style={{ position: 'absolute', left: 0, top: 52 }}>
          <Count f={f} a={0} b={1284} from={T(13.4)} to={T(16.6)} size={118} />
          <div style={{ fontFamily: MONO, fontSize: 20, color: C.faint, marginTop: 4 }}>UPVOTES</div>
        </div>
        <div style={{ position: 'absolute', right: 0, top: 70 }}>
          <Spark f={f} from={T(13.4)} to={T(16.6)} w={330} h={120} pts={[0.03, 0.05, 0.08, 0.1, 0.16, 0.2, 0.3, 0.38, 0.5, 0.62, 0.7, 0.85, 0.95]} />
        </div>
      </Body>
    </Top>
    <PopIn f={f} at={17.4} x={790} y={170} r={3}><Pill tone="blue" size={24}>Teori populer</Pill></PopIn>
  </>
);

/* ================================================================== */
/* 4. full name: a profile card (anim)                                 */
/* ================================================================== */
const Name: React.FC<{ f: number }> = ({ f }) => (
  <>
    <At x={540} y={540} s={0.95 + 0.05 * out(f, T(19.4), T(19.4) + 10)} o={out(f, T(19.4), T(19.4) + 10)}>
      <Photo src="img/shannon-portrait.png" w={420} h={480} pos="50% 15%" />
    </At>
    <div style={{ position: 'absolute', left: 151, width: 778, top: 860, background: C.card, borderRadius: 22, border: `2px solid ${C.border}`, boxShadow: shadow, padding: '26px 32px', boxSizing: 'border-box', ...{ opacity: out(f, T(19.9), T(19.9) + 10) } }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Avatar src="img/shannon-portrait.png" pos="50% 15%" size={84} />
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: -1 }}>Claude Shannon</div>
          <div style={{ fontFamily: MONO, fontSize: 22, color: C.sub }}>1916 – 2001</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
        <In f={f} at={21.5} d={10}><Pill tone="grey" size={22}>Amerika Serikat</Pill></In>
        <In f={f} at={23.6} d={10}><Pill tone="blue" size={22}>Matematika</Pill></In>
        <In f={f} at={24.4} d={10}><Pill tone="blue" size={22}>Elektronika</Pill></In>
      </div>
    </div>
  </>
);

/* ================================================================== */
/* 5. information theory: bit = binary digit                           */
/* ================================================================== */
const Bit: React.FC<{ f: number }> = ({ f }) => {
  const swap = out(f, T(32.4), T(32.4) + 8);
  const bits = '01001000 01101001';
  const shown = Math.max(0, Math.floor((f - T(34.0)) / 1.4));
  const lit = f >= T(30.6);
  const Hi: React.FC<{ on?: boolean; children: React.ReactNode }> = ({ on, children }) => (
    <span style={{ background: on && lit ? C.pink : 'transparent', boxShadow: on && lit ? `inset 0 0 0 2px ${C.pinkLine}` : 'none', borderRadius: 6, padding: '0 2px' }}>{children}</span>
  );
  return (
    <>
      <Top f={f} at={25.35} icon={<Img src={staticFile('img/paper-1948-cover.webp')} style={{ height: 46, borderRadius: 4 }} />} label="Information Theory" url="1948">
        <Body>
          <div style={{ opacity: 1 - swap }}>
            <In f={f} at={26.4}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.sub }}>Father of Information Theory</div>
            </In>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 28, marginTop: 6, opacity: out(f, T(29.9), T(29.9) + 8) }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 150, letterSpacing: -6, lineHeight: 1 }}>bit</div>
              <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 40 }}>
                <Hi on>b</Hi>inary dig<Hi on>i</Hi><Hi on>t</Hi>
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, opacity: swap, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Key size={30}>“Hai”</Key>
              <span style={{ fontFamily: MONO, fontSize: 34, color: C.faint }}>→</span>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 2 }}>
                {bits.split('').map((ch, i) => <span key={i} style={{ opacity: i < shown ? 1 : 0.15 }}>{ch}</span>)}
              </span>
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.sub }}>informasi → 0 dan 1</div>
          </div>
        </Body>
      </Top>
      <PopIn f={f} at={37.6} x={780} y={420} r={-3}><Pill tone="green" size={26}>Komputer paham</Pill></PopIn>
    </>
  );
};

/* ================================================================== */
/* 6. 1951: Theseus (anim)                                             */
/* ================================================================== */
const Theseus: React.FC<{ f: number }> = ({ f }) => {
  const photosOut = 1 - ease(f, T(45.1), T(45.6));
  const drawIn = ease(f, T(45.3), T(45.9));
  const xray = lin(f, T(47.7), T(48.2));
  return (
    <>
      <PopIn f={f} at={39.3} x={540} y={250}><Pill tone="ink" size={28}>1951</Pill></PopIn>
      {photosOut > 0 && (
        <div style={{ opacity: photosOut }}>
          <At x={500} y={620} s={0.95 + 0.05 * out(f, T(41.2), T(41.2) + 10)} o={out(f, T(41.2), T(41.2) + 10)}>
            <Photo src="img/shannon-theseus.jpg" w={700} h={540} gray={false} label="Demo Theseus · Bell Labs" />
          </At>
          <At x={760} y={930} s={0.95 + 0.05 * out(f, T(42.6), T(42.6) + 10)} o={out(f, T(42.6), T(42.6) + 10)} r={3}>
            <Photo src="img/theseus-mouse.jpg" w={320} h={240} gray={false} />
          </At>
        </div>
      )}
      {drawIn > 0 && (
        <>
          <At x={540} y={700} s={0.9 + 0.1 * drawIn} o={drawIn}>
            <div style={{ width: 560, height: 560, borderRadius: 40, background: C.card, border: `2px solid ${C.border}`, boxShadow: shadow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mouse size={380} xray={xray} wheel={f * 14} />
            </div>
          </At>
          <PopIn f={f} at={46.7} x={540} y={380}><Pill tone="red" size={28}>Tanpa otak</Pill></PopIn>
          <PopIn f={f} at={47.8} x={250} y={620} r={-4}><Key size={30}>kayu</Key></PopIn>
          <PopIn f={f} at={48.9} x={830} y={620} r={4}><Key size={30}>magnet</Key></PopIn>
          <PopIn f={f} at={50.4} x={540} y={1020}><Key size={30}>roda</Key></PopIn>
        </>
      )}
    </>
  );
};

/* ================================================================== */
/* 7. the maze is the brain                                            */
/* ================================================================== */
const MazeBrain: React.FC<{ f: number }> = ({ f }) => {
  const flick = (i: number) => f >= T(64.3) && Math.sin(f * 0.35 + i * 1.7) > 0;
  const rows = [
    { at: 58.6, t: 'lantai logam' },
    { at: 60.6, t: 'elektromagnet' },
    { at: 62.4, t: 'relay telepon' },
  ];
  return (
    <Top f={f} at={52.8} icon={<Mouse size={46} />} label="Labirin Theseus" url="bell labs · 1951">
      <Body>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: -1, opacity: 1 - out(f, T(58.3), T(58.3) + 8) }}>
          Otaknya = <span style={{ background: C.pink, boxShadow: `inset 0 0 0 2px ${C.pinkLine}`, borderRadius: 8, padding: '0 8px', opacity: out(f, T(56.3), T(56.3) + 6) }}>labirinnya</span>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map((r, i) => (
            <div key={r.t} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: out(f, T(r.at), T(r.at) + 8) }}>
              <Key size={24}>{r.t}</Key>
              <span style={{ flex: 1, height: 2, background: C.border }} />
              {i === 2 ? (
                <div style={{ display: 'flex', gap: 8 }}>{[0, 1, 2, 3].map((j) => <Pill key={j} tone={flick(j) ? 'green' : 'grey'} size={18}>{flick(j) ? 'on' : 'off'}</Pill>)}</div>
              ) : i === 1 ? (
                <div style={{ display: 'flex', gap: 8 }}>{[0, 1, 2, 3, 4].map((j) => <span key={j} style={{ width: 22, height: 40, borderRadius: 6, background: flick(j + 5) ? C.blue : '#D9D9D9' }} />)}</div>
              ) : (
                <div style={{ width: 200, height: 36, borderRadius: 8, background: 'linear-gradient(180deg,#EDEDED,#C9C9C9)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 10 + 140 * ease(f, T(58.6), T(61)), top: -6 }}><Mouse size={44} /></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Body>
    </Top>
  );
};

/* ================================================================== */
/* 8. 0 = off, 1 = on                                                  */
/* ================================================================== */
const OnOff: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Top f={f} at={66.95} label="bit" url="0 / 1">
      <Body style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { at: 68.6, n: '0', on: false, t: 'off' },
            { at: 69.9, n: '1', on: true, t: 'on' },
          ].map((c) => (
            <div key={c.n} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: out(f, T(c.at), T(c.at) + 8) }}>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 80, width: 60, lineHeight: 1 }}>{c.n}</span>
              <Toggle on={c.on} />
              <Pill tone={c.on ? 'green' : 'grey'} size={22}>{c.t}</Pill>
            </div>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', opacity: out(f, T(71.1), T(71.1) + 8) }}>
          <Maze t={ease(f, T(71.2), T(75.0))} size={210} />
        </div>
      </Body>
    </Top>
    <PopIn f={f} at={75.1} x={800} y={170} r={3}><Pill tone="green" size={26}>Keluar</Pill></PopIn>
  </>
);

/* ================================================================== */
/* 9. look it up: YouTube                                              */
/* ================================================================== */
const LookItUp: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Top
      f={f}
      at={76.3}
      icon={<div style={{ width: 52, height: 38, borderRadius: 10, background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '15px solid #fff', marginLeft: 3 }} /></div>}
      label="YouTube"
      url="youtube.com"
    >
      <Body>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F6F6F6', border: `2px solid ${C.border}`, borderRadius: 40, padding: '10px 22px', fontFamily: MONO, fontSize: 26 }}>
          <SearchIcon size={28} /> {typed(f, 'theseus claude shannon', 79.4, 80.8)}{f < T(81.0) && f >= T(79.0) && <Caret f={f} />}
        </div>
        <div style={{ marginTop: 14, height: 160, borderRadius: 14, overflow: 'hidden', opacity: out(f, T(81.0), T(81.0) + 8) }}>
          <Img src={staticFile('img/youtube-search.png')} style={{ width: '100%', marginTop: -330 }} />
        </div>
      </Body>
    </Top>
    <PopIn f={f} at={82.4} x={780} y={420} r={-3}><Pill tone="blue" size={26}>Cari sendiri</Pill></PopIn>
  </>
);

/* ================================================================== */
/* 10. same era as Alan Turing                                         */
/* ================================================================== */
const SameEra: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Top f={f} at={83.95} label="Fakta unik" url="sezaman">
      <Body style={{ display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
        {[
          { at: 85.3, src: 'img/shannon-portrait.png', pos: '50% 15%', n: 'Claude Shannon', d: 'AS · 1916–2001' },
          { at: 86.6, src: 'img/turing-portrait.jpg', pos: '50% 25%', n: 'Alan Turing', d: 'Inggris · 1912–1954' },
        ].map((p) => (
          <In key={p.n} f={f} at={p.at} d={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Avatar src={p.src} pos={p.pos} size={72} />
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: -0.5 }}>{p.n}</div>
                <div style={{ fontFamily: MONO, fontSize: 20, color: C.sub }}>{p.d}</div>
              </div>
            </div>
          </In>
        ))}
      </Body>
    </Top>
    <PopIn f={f} at={86.0} x={790} y={300} r={3}><Pill tone="blue" size={24}>Sezaman</Pill></PopIn>
    <PopIn f={f} at={89.6} x={540} y={488}><Pill tone="ink" size={24}>Mesin yang bisa berpikir</Pill></PopIn>
  </>
);

/* ================================================================== */
/* 11. The Imitation Game                                              */
/* ================================================================== */
const Film: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Top f={f} at={92.0} label="Film" url="2014">
      <Body style={{ display: 'flex', gap: 26 }}>
        <div style={{ opacity: out(f, T(95.1), T(95.1) + 8), width: 150, height: 222, borderRadius: 12, overflow: 'hidden', flex: 'none', marginTop: -6 }}>
          <Img src={staticFile('img/imitation-game-poster.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <In f={f} at={92.4} d={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar src="img/turing-portrait.jpg" pos="50% 25%" size={52} />
              <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.sub }}>Kisah Alan Turing</span>
            </div>
          </In>
          <In f={f} at={95.1} d={10}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, letterSpacing: -1.5, lineHeight: 1.02, marginTop: 14 }}>The Imitation<br />Game</div>
          </In>
        </div>
      </Body>
    </Top>
    <PopIn f={f} at={96.85} x={780} y={420} r={-3}><Pill tone="blue" size={26}>Coba nonton</Pill></PopIn>
  </>
);

/* ================================================================== */
/* 12. Bell Labs, secret projects (anim)                               */
/* ================================================================== */
const BellLabs: React.FC<{ f: number }> = ({ f }) => {
  const meet = ease(f, T(99.2), T(100.9));
  return (
    <>
      <At x={mix(260, 470, meet)} y={330} o={out(f, T(99.0), T(99.0) + 10)}><Avatar src="img/shannon-portrait.png" pos="50% 15%" size={130} /></At>
      <At x={mix(820, 610, meet)} y={330} o={out(f, T(99.6), T(99.6) + 10)}><Avatar src="img/turing-portrait.jpg" pos="50% 25%" size={130} /></At>
      <PopIn f={f} at={101.0} x={540} y={450}><Pill tone="ink" size={24}>Pernah ketemu</Pill></PopIn>
      <At x={540} y={740} s={0.95 + 0.05 * out(f, T(103.3), T(103.3) + 10)} o={out(f, T(103.3), T(103.3) + 10)}>
        <Photo src="img/bell-labs.jpg" w={760} h={420} label="Bell Labs · New York · 1943" />
      </At>
      <PopIn f={f} at={107.4} x={540} y={1010}><Pill tone="grey" size={24}>Gak bisa ngobrolin proyeknya</Pill></PopIn>
      <PopIn f={f} at={111.9} x={330} y={1110} r={-2}><Pill tone="red" size={24}><Lock size={24} color="#fff" /> Rahasia · AS</Pill></PopIn>
      <PopIn f={f} at={112.9} x={760} y={1110} r={2}><Pill tone="red" size={24}><Lock size={24} color="#fff" /> Rahasia · Inggris</Pill></PopIn>
    </>
  );
};

/* ================================================================== */
/* 13. poll: who is more influential? then the outro                   */
/* ================================================================== */
const Poll: React.FC<{ f: number }> = ({ f }) => {
  const fill = ease(f, T(119.6), T(121.0));
  return (
    <>
      <Top f={f} at={114.233} label="Siapa lebih berpengaruh?" url="AI modern">
        <Body style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
          {[
            { at: 116.9, src: 'img/shannon-portrait.png', pos: '50% 15%', n: 'Claude Shannon' },
            { at: 118.4, src: 'img/turing-portrait.jpg', pos: '50% 25%', n: 'Alan Turing' },
          ].map((p) => (
            <In key={p.n} f={f} at={p.at} d={10}>
              <div style={{ position: 'relative', height: 86, borderRadius: 16, border: `2px solid ${C.border}`, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${50 * fill}%`, background: C.blueSoft }} />
                <div style={{ position: 'relative' }}><Avatar src={p.src} pos={p.pos} size={56} ring={C.border} /></div>
                <span style={{ position: 'relative', fontFamily: SANS, fontWeight: 700, fontSize: 32 }}>{p.n}</span>
                <span style={{ position: 'relative', marginLeft: 'auto', fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.blue }}>{fill > 0.5 ? '?%' : ''}</span>
              </div>
            </In>
          ))}
        </Body>
      </Top>
      <PopIn f={f} at={123.4} x={540} y={488}><Pill tone="ink" size={24}>Sama-sama mengonsep mesin berpikir</Pill></PopIn>
    </>
  );
};

const Outro: React.FC<{ f: number }> = ({ f }) => {
  const click = f >= T(127.4);
  const cur = ease(f, T(126.9), T(127.35));
  return (
    <>
      <Top f={f} at={124.383}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, height: '100%' }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 0 5px #fff, 0 0 0 9px ${C.blue}`, flex: 'none' }}>
            <Img src={staticFile('img/faqih.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 32%' }} />
          </div>
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: -1 }}>@faqihpedia</div>
            <div style={{ marginTop: 14, display: 'inline-block', background: click ? '#E6E6E6' : C.blue, color: click ? C.ink : '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 30, borderRadius: 12, padding: '10px 44px', transform: `scale(${click ? 0.97 : 1})` }}>
              {click ? 'Following' : 'Follow'}
            </div>
          </div>
        </div>
      </Top>
      {/* cursor sliding to the button and clicking */}
      {f >= T(126.6) && (
        <At x={mix(760, 470, cur)} y={mix(500, 395, cur)} s={click && f < T(127.4) + 4 ? 0.85 : 1}>
          <svg width={40} height={48} viewBox="0 0 20 24"><path d="M2 2 L2 19 L6.5 15 L9.5 22 L12.5 20.8 L9.5 14 L16 14 Z" fill="#111" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" /></svg>
        </At>
      )}
      <PopIn f={f} at={124.45} x={540} y={488}><Pill tone="ink" size={24}>Tulis di komen</Pill></PopIn>
    </>
  );
};

export const SCENES: Scene[] = [
  { from: 0, to: 5.35, C: Hook },
  { from: 5.35, to: 12.7, C: Statement },
  { from: 12.7, to: 19.25, C: Forum },
  { from: 19.25, to: 25.35, C: Name },
  { from: 25.35, to: 39.0, C: Bit },
  { from: 39.0, to: 52.8, C: Theseus },
  { from: 52.8, to: 66.95, C: MazeBrain },
  { from: 66.95, to: 76.3, C: OnOff },
  { from: 76.3, to: 83.95, C: LookItUp },
  { from: 83.95, to: 92.0, C: SameEra },
  { from: 92.0, to: 97.633, C: Film },
  { from: 97.633, to: 114.233, C: BellLabs },
  { from: 114.233, to: 124.383, C: Poll },
  { from: 124.383, to: 131.0, C: Outro },
];
