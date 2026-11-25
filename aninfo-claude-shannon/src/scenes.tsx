import React from 'react';
import { Img, staticFile } from 'remotion';
import { At, Card, Check, SegmentTag, Search, Sparkle, Tag, Thumb, ease, lin, mix, out, pop } from './ui';
import { C, SANS, SERIF, s, soft } from './theme';

/*
 * Every scene is timed in seconds of public/source.mp4 (the same cut as trims-eps2-claude).
 * 'split' scenes draw into the top 1080 x STAGE_H, 'anim' scenes into the full 1080x1920.
 * Calm editorial look: cream paper, white cards with soft shadows, serif headlines, real photos as the hero.
 */
export const STAGE_H = 840;
export type Scene = { from: number; to: number; mode: 'split' | 'anim'; C: React.FC<{ f: number }> };

const T = s;
/** soft entrance: fade + 30px rise over 12 frames */
const rise = (f: number, at: number, d = 30) => {
  const p = out(f, T(at), T(at) + 12);
  return { opacity: p, transform: `translateY(${(1 - p) * d}px)` };
};
const Rise: React.FC<{ f: number; at: number; x: number; y: number; w?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  f, at, x, y, w, children, style,
}) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, ...rise(f, at), ...style }}>{children}</div>
);

const Headline: React.FC<{ f: number; at: number; y: number; size?: number; children: React.ReactNode; color?: string }> = ({
  f, at, y, size = 76, children, color = C.ink,
}) => (
  <div style={{ position: 'absolute', left: 60, right: 60, top: y, textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.08, letterSpacing: -2, color, ...rise(f, at) }}>
    {children}
  </div>
);

/** words revealed as spoken */
const Word: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, children, style }) => {
  const p = out(f, T(at), T(at) + 10);
  return (
    <span style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 26}px)`, filter: `blur(${(1 - p) * 6}px)`, ...style }}>
      {children}
    </span>
  );
};

/** amber ring around the exact value being talked about, on the word */
const Ring: React.FC<{ f: number; a: number; b: number; children: React.ReactNode; pad?: string }> = ({ f, a, b, children, pad = '-6px -12px' }) => {
  const k = out(f, T(a), T(a) + 8) * (1 - lin(f, T(b), T(b) + 6));
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ position: 'absolute', inset: pad, borderRadius: 14, background: `rgba(245,180,0,${0.16 * k})`, boxShadow: `0 0 0 ${4 * k}px rgba(245,180,0,${0.9 * k})` }} />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  );
};

/** a real photo on a white card, with a two-line caption under it */
const Photo: React.FC<{ src: string; w: number; h: number; pos?: string; title?: string; sub?: string; gray?: boolean; r?: number }> = ({
  src, w, h, pos = 'center', title, sub, gray = true, r = 30,
}) => (
  <div style={{ background: C.card, borderRadius: r, boxShadow: soft, padding: 14, paddingBottom: title ? 18 : 14, width: w + 28, boxSizing: 'border-box' }}>
    <div style={{ width: w, height: h, borderRadius: r - 12, overflow: 'hidden', background: C.tag }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: gray ? 'grayscale(1) contrast(1.04)' : undefined }} />
    </div>
    {title && <div style={{ fontFamily: SANS, fontWeight: 650, fontSize: 30, color: C.ink, marginTop: 14, paddingLeft: 6 }}>{title}</div>}
    {sub && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: C.sub, marginTop: 2, paddingLeft: 6 }}>{sub}</div>}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; tone?: 'blue' | 'grey' | 'white' | 'red' | 'green'; size?: number; style?: React.CSSProperties }> = ({
  children, tone = 'white', size = 34, style,
}) => {
  const t = {
    blue: { background: C.blue, color: '#fff', boxShadow: '0 10px 30px rgba(26,115,232,0.30)' },
    grey: { background: C.tag, color: C.sub },
    white: { background: C.card, color: C.ink, boxShadow: soft },
    red: { background: '#FDECEA', color: C.red },
    green: { background: C.greenSoft, color: C.green },
  }[tone];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, borderRadius: 60, padding: `${size * 0.36}px ${size * 0.8}px`, fontFamily: SANS, fontWeight: 650, fontSize: size, whiteSpace: 'nowrap', ...t, ...style }}>
      {children}
    </div>
  );
};

const ClaudeTile: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, overflow: 'hidden', boxShadow: soft, background: C.claude, flex: 'none' }}>
    <Img src={staticFile('img/claude-logo.png')} style={{ width: '100%', height: '100%', display: 'block' }} />
  </div>
);

const Cross: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill={C.red} />
    <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" />
  </svg>
);

const Lock: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = C.sub }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect x="4.5" y="10.5" width="15" height="11" rx="3" fill={color} />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke={color} strokeWidth={2.4} />
  </svg>
);

const Arrow: React.FC<{ w?: number; color?: string }> = ({ w = 56, color = C.faint }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 56 28">
    <path d="M4 14h42M36 5l10 9-10 9" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Monitor: React.FC<{ size?: number; on?: number }> = ({ size = 120, on = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <rect x="10" y="14" width="100" height="70" rx="12" fill={C.card} stroke={C.ink} strokeWidth={4} />
    <rect x="20" y="24" width="80" height="50" rx="6" fill={on > 0.5 ? C.blueSoft : C.tag} />
    {on > 0.5 && <path d="M46 49l9 9 19-19" fill="none" stroke={C.blue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
    <path d="M50 84v14M70 84v14M38 100h44" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** Theseus from above, as clean line art */
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

/** 5x5 maze, path from bottom-left to the exit at top-right */
const MAZE_WALLS = [
  'M0 0 H400 M0 0 V400 M0 400 H400 M400 80 V400',
  'M80 0 V160 M160 80 V240 M240 0 V80 M320 80 V240 M80 240 V320 M160 320 V400 M240 240 V320 M320 320 V400',
  'M80 160 H160 M160 240 H240 M240 160 H320 M0 320 H80 M240 320 H320 M80 80 H160',
].join(' ');
const MAZE_PATH: [number, number][] = [
  [40, 360], [120, 360], [120, 280], [200, 280], [200, 360], [280, 360], [280, 280], [360, 280], [360, 200], [360, 120], [280, 120], [280, 40], [360, 40], [440, 40],
];
const pathAt = (t: number) => {
  const segs = MAZE_PATH.length - 1;
  const x = Math.max(0, Math.min(1, t)) * segs;
  const i = Math.min(segs - 1, Math.floor(x));
  const k = x - i;
  const [ax, ay] = MAZE_PATH[i];
  const [bx, by] = MAZE_PATH[i + 1];
  return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, dir: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI };
};
const Maze: React.FC<{ t: number; size?: number }> = ({ t, size = 320 }) => {
  const p = pathAt(t);
  const n = Math.max(1, Math.round(t * (MAZE_PATH.length - 1)));
  return (
    <svg width={size} height={size} viewBox="-10 -10 480 420" style={{ overflow: 'visible' }}>
      <rect x="0" y="0" width="400" height="400" fill="#EEEBE4" rx="6" />
      <polyline points={[...MAZE_PATH.slice(0, n), [p.x, p.y]].map((q) => q.join(',')).join(' ')} fill="none" stroke={C.blue} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
      <path d={MAZE_WALLS} fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      <g transform={`translate(${p.x} ${p.y})`}>
        <foreignObject x={-34} y={-34} width={68} height={68} style={{ overflow: 'visible' }}>
          <div style={{ width: 68, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mouse size={58} dir={p.dir} />
          </div>
        </foreignObject>
      </g>
    </svg>
  );
};

const Toggle: React.FC<{ on: boolean; w?: number }> = ({ on, w = 120 }) => (
  <div style={{ width: w, height: w * 0.56, borderRadius: w, background: on ? C.green : '#D6D1C7', position: 'relative', flex: 'none' }}>
    <div style={{ position: 'absolute', top: w * 0.06, left: on ? w * 0.5 : w * 0.06, width: w * 0.44, height: w * 0.44, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
  </div>
);

/* ================================================================== */
/* 1. Hook (split): "Claude ternyata udah ada dari tahun 1950-an."     */
/* ================================================================== */
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const under = ease(f, T(3.8), T(4.6));
  return (
    <>
      <At x={540} y={250} o={out(f, 0, 10)}>
        <SegmentTag size={28} />
      </At>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', fontFamily: SERIF, fontWeight: 500, color: C.ink, fontSize: 104, lineHeight: 1.08, letterSpacing: -3 }}>
        <div><Word f={f} at={0}>Claude</Word> <Word f={f} at={0.78}>ternyata</Word></div>
        <div><Word f={f} at={1.2}>udah</Word> <Word f={f} at={1.46}>ada</Word> <Word f={f} at={1.68}>dari</Word></div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Word f={f} at={1.98}>tahun</Word> <Word f={f} at={2.2} style={{ color: C.blue }}>1950-an.</Word>
          <svg width={460} height={40} style={{ position: 'absolute', right: -10, bottom: -24 }}>
            <path d="M6 24 C 120 6, 300 6, 452 20" stroke={C.blue} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={500} strokeDashoffset={500 * (1 - under)} />
          </svg>
        </div>
      </div>
      <At x={540} y={700} s={0.96 + 0.04 * out(f, T(3.85), T(3.85) + 10)} o={out(f, T(3.85), T(3.85) + 10)}>
        <Tag style={{ fontSize: 30, padding: '8px 18px' }}>Ya, kalian gak salah dengar</Tag>
      </At>
    </>
  );
};

/* ================================================================== */
/* 2. No official statement from Anthropic (split)                      */
/* ================================================================== */
const Statement: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Card r={36} style={{ left: 90, top: 250, width: 900, height: 440, padding: 44, boxSizing: 'border-box', ...rise(f, 5.5) }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Img src={staticFile('img/anthropic-wordmark.png')} style={{ width: 300, display: 'block' }} />
        <ClaudeTile size={96} />
      </div>
      <div style={{ fontFamily: SANS, fontSize: 26, color: C.sub, marginTop: 30 }}>Pernyataan resmi</div>
      <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 60, letterSpacing: -1.5, marginTop: 4 }}>Asal nama “Claude”</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 34, ...rise(f, 6.9, 16) }}>
        <Cross size={44} />
        <Ring f={f} a={6.9} b={9.5}>
          <span style={{ fontFamily: SANS, fontWeight: 650, fontSize: 36, color: C.red }}>Gak pernah ada</span>
        </Ring>
      </div>
    </Card>
    <At x={540} y={735} o={out(f, T(10.4), T(10.4) + 10)}>
      <Tag style={{ fontSize: 30, padding: '8px 18px' }}>Dari nama seorang ilmuwan?</Tag>
    </At>
  </>
);

/* ================================================================== */
/* 3. What the forums believe (split)                                   */
/* ================================================================== */
const POSTS = [
  { at: 13.4, user: 'kepo_ai · 2 thn lalu', text: 'Claude itu dari Claude Shannon?', votes: 1200 },
  { at: 15.4, user: 'bit_by_bit · 2 thn lalu', text: 'AI-nya Anthropic, dari nama ilmuwan', votes: 870 },
  { at: 17.4, user: 'info_theory · 1 thn lalu', text: 'Bapak teori informasi, makanya', votes: 640 },
];
const Forum: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Headline f={f} at={12.85} y={250} size={70}>Kata forum internet</Headline>
    {POSTS.map((p, i) => (
      <Card key={p.text} r={28} style={{ left: 110, top: 380 + i * 140, width: 860, height: 118, padding: '20px 28px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 24, ...rise(f, p.at) }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: C.sub }}>
          <svg width={26} height={18} viewBox="0 0 26 18"><path d="M13 2 L24 16 H2 Z" fill={C.amber} /></svg>
          {Math.round(p.votes * ease(f, T(p.at), T(p.at) + 40))}
        </div>
        <div>
          <div style={{ fontFamily: SANS, fontSize: 22, color: C.faint }}>{p.user}</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: C.ink, marginTop: 2 }}>
            {i === 0 ? <>Claude itu dari <Ring f={f} a={14.0} b={19.2}>Claude Shannon</Ring>?</> : p.text}
          </div>
        </div>
      </Card>
    ))}
  </>
);

/* ================================================================== */
/* 4. The full name (anim)                                              */
/* ================================================================== */
const Name: React.FC<{ f: number }> = ({ f }) => {
  const chips = [
    { at: 21.5, t: 'Amerika Serikat' },
    { at: 23.6, t: 'Matematika' },
    { at: 24.4, t: 'Elektronika' },
  ];
  return (
    <>
      <At x={540} y={660} s={1}>
        <div style={rise(f, 19.4)}>
          <Photo src="img/shannon-portrait.png" w={440} h={540} pos="50% 15%" />
        </div>
      </At>
      <Headline f={f} at={19.9} y={1000} size={120}>Claude Shannon</Headline>
      <At x={540} y={1170} o={out(f, T(20.6), T(20.6) + 10)}>
        <Tag style={{ fontSize: 30, padding: '8px 18px' }}>1916 – 2001</Tag>
      </At>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1250, display: 'flex', justifyContent: 'center', gap: 18 }}>
        {chips.map((c) => (
          <div key={c.t} style={rise(f, c.at, 20)}>
            <Pill tone="white" size={32}>{c.t}</Pill>
          </div>
        ))}
      </div>
    </>
  );
};

/* ================================================================== */
/* 5. Father of information theory, bit = binary digit (split)          */
/* ================================================================== */
const Bit: React.FC<{ f: number }> = ({ f }) => {
  const lit = out(f, T(30.6), T(30.6) + 8);
  const L: React.FC<{ on?: boolean; children: React.ReactNode }> = ({ on, children }) => (
    <span style={{ color: on ? mixColor(lit) : C.ink }}>{children}</span>
  );
  const paperOut = 1 - lin(f, T(32.2), T(32.2) + 8);
  const shown = Math.max(0, Math.floor((f - T(34.0)) / 1.4));
  const bits = '01001000 01101001';
  return (
    <>
      <Headline f={f} at={26.6} y={250} size={64}>Father of Information Theory</Headline>
      <div style={{ position: 'absolute', left: 120, top: 360, ...rise(f, 27.4), opacity: rise(f, 27.4).opacity * paperOut }}>
        <Photo src="img/paper-1948-cover.webp" w={200} h={260} gray={false} title="Paper 1948" />
      </div>
      <div style={{ position: 'absolute', left: 430, top: 380, ...rise(f, 29.9) }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 170, lineHeight: 0.9, letterSpacing: -4, color: C.blue }}>bit</div>
        <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 64, letterSpacing: -1, marginTop: 14, ...rise(f, 30.4, 16) }}>
          <L on>b</L><L>inary</L> <L>dig</L><L on>i</L><L on>t</L>
        </div>
      </div>
      {/* information -> 0 and 1 -> the computer understands */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22 }}>
        <div style={rise(f, 32.6, 16)}><Pill tone="white" size={36}>“Hai”</Pill></div>
        <div style={rise(f, 33.4, 10)}><Arrow /></div>
        <div style={rise(f, 33.8, 16)}>
          <Pill tone="white" size={34} style={{ fontFamily: '"DejaVu Sans Mono", monospace' }}>
            {bits.split('').map((ch, i) => <span key={i} style={{ opacity: i < shown ? 1 : 0.15 }}>{ch}</span>)}
          </Pill>
        </div>
        <div style={rise(f, 36.6, 10)}><Arrow /></div>
        <div style={rise(f, 37.3, 16)}><Monitor size={110} on={lin(f, T(37.6), T(37.6) + 2)} /></div>
      </div>
    </>
  );
};
/** ink -> amber as the b, i, t letters light up */
const mixColor = (t: number) => (t > 0.5 ? '#C98F00' : C.ink);

/* ================================================================== */
/* 6. 1951: Theseus, the wooden mouse without a brain (anim)            */
/* ================================================================== */
const Theseus: React.FC<{ f: number }> = ({ f }) => {
  const photosOut = 1 - ease(f, T(45.1), T(45.6));
  const drawIn = ease(f, T(45.3), T(45.9));
  const xray = lin(f, T(47.7), T(48.2));
  const labels = [
    { at: 46.7, t: 'Tanpa otak', tone: 'red' as const, x: 540, y: 520, lx: 540, ly: 690 },
    { at: 47.8, t: 'Kayu', tone: 'white' as const, x: 230, y: 760, lx: 400, ly: 860 },
    { at: 48.9, t: 'Magnet', tone: 'white' as const, x: 850, y: 760, lx: 560, ly: 860 },
    { at: 50.4, t: 'Roda', tone: 'white' as const, x: 540, y: 1260, lx: 540, ly: 1060 },
  ];
  return (
    <>
      <At x={540} y={300} o={out(f, T(39.3), T(39.3) + 10)}>
        <Tag style={{ fontSize: 30, padding: '8px 18px' }}>1951</Tag>
      </At>
      <Headline f={f} at={42.4} y={350} size={84}>Theseus, si robot tikus</Headline>
      {photosOut > 0 && (
        <div style={{ opacity: photosOut }}>
          <div style={{ position: 'absolute', left: 130, top: 520, ...rise(f, 41.2) }}>
            <Photo src="img/shannon-theseus.jpg" w={760} h={600} gray={false} title="Demo Theseus" sub="Claude Shannon, Bell Labs" />
          </div>
          <div style={{ position: 'absolute', left: 560, top: 1010, ...rise(f, 42.6) }}>
            <Photo src="img/theseus-mouse.jpg" w={360} h={270} gray={false} />
          </div>
        </div>
      )}
      {drawIn > 0 && (
        <>
          <At x={540} y={880} s={0.9 + 0.1 * drawIn} o={drawIn}>
            <div style={{ width: 640, height: 640, borderRadius: '50%', background: C.card, boxShadow: soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mouse size={420} xray={xray} wheel={f * 14} />
            </div>
          </At>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
            {labels.map((l) => (
              <line key={l.t} x1={l.x} y1={l.y} x2={l.lx} y2={l.ly} stroke={C.faint} strokeWidth={3} strokeDasharray="6 8" opacity={out(f, T(l.at), T(l.at) + 10)} />
            ))}
          </svg>
          {labels.map((l) => (
            <At key={l.t} x={l.x} y={l.y} o={out(f, T(l.at), T(l.at) + 10)}>
              <Pill tone={l.tone} size={36}>{l.tone === 'red' && <Cross size={34} />}{l.t}</Pill>
            </At>
          ))}
        </>
      )}
    </>
  );
};

/* ================================================================== */
/* 7. The maze is the brain: metal, electromagnets, relays (split)      */
/* ================================================================== */
const MazeBrain: React.FC<{ f: number }> = ({ f }) => {
  const flick = (i: number) => f >= T(64.3) && Math.sin(f * 0.35 + i * 1.7) > 0;
  const layers = [
    { at: 58.6, t: 'Lantai logam', y: 380 },
    { at: 60.6, t: 'Elektromagnet', y: 520 },
    { at: 62.4, t: 'Relay telepon', y: 660 },
  ];
  return (
    <>
      <Headline f={f} at={53.0} y={240} size={70}>
        Otaknya justru <Ring f={f} a={56.3} b={58.4}>labirinnya</Ring>
      </Headline>
      {/* metal floor with the mouse walking on it */}
      <Card r={24} style={{ left: 90, top: layers[0].y - 50, width: 560, height: 100, background: 'linear-gradient(180deg, #EDEDED, #C9C9C9)', ...rise(f, 54.0) }}>
        <svg width={560} height={100} style={{ position: 'absolute' }}>
          <path d="M0 50 H110 V18 M190 0 V64 H300 M380 100 V36 H480" fill="none" stroke="#8C8C8C" strokeWidth={6} />
        </svg>
        <div style={{ position: 'absolute', left: 120 + 330 * ease(f, T(54.5), T(57.5)), top: 22 }}><Mouse size={56} /></div>
      </Card>
      {/* electromagnets */}
      <div style={{ position: 'absolute', left: 100, top: layers[1].y - 40, display: 'flex', gap: 22, ...rise(f, layers[1].at) }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: 70, height: 80, borderRadius: 16, background: flick(i) ? C.blueSoft : C.card, boxShadow: soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={40} height={56} viewBox="0 0 40 56">
              <rect x="13" y="4" width="14" height="48" rx="4" fill={flick(i) ? C.blue : C.faint} />
              {[12, 20, 28, 36, 44].map((y) => <line key={y} x1="6" y1={y} x2="34" y2={y} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />)}
            </svg>
          </div>
        ))}
      </div>
      {/* relays */}
      <div style={{ position: 'absolute', left: 100, top: layers[2].y - 44, display: 'flex', gap: 16, ...rise(f, layers[2].at) }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const on = flick(i + 3);
          return (
            <div key={i} style={{ width: 92, height: 88, borderRadius: 18, background: C.card, boxShadow: soft, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width={56} height={26} viewBox="0 0 56 26">
                <circle cx="7" cy="20" r="5" fill={C.ink} />
                <circle cx="49" cy="20" r="5" fill={C.ink} />
                <line x1="7" y1="20" x2={on ? 49 : 42} y2={on ? 20 : 3} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, color: on ? C.green : C.faint }}>{on ? 'ON' : 'OFF'}</span>
            </div>
          );
        })}
      </div>
      {layers.map((l) => (
        <At key={l.t} x={850} y={l.y} o={out(f, T(l.at), T(l.at) + 10)}>
          <Tag style={{ fontSize: 28, padding: '8px 16px' }}>{l.t}</Tag>
        </At>
      ))}
    </>
  );
};

/* ================================================================== */
/* 8. Bits: 0 = off, 1 = on, until the mouse gets out (split)           */
/* ================================================================== */
const OnOff: React.FC<{ f: number }> = ({ f }) => {
  const walk = ease(f, T(71.2), T(75.0));
  const done = out(f, T(75.1), T(75.1) + 10);
  return (
    <>
      {[
        { at: 68.6, n: '0', on: false, t: 'off', x: 110 },
        { at: 69.9, n: '1', on: true, t: 'on', x: 560 },
      ].map((c) => (
        <Card key={c.n} r={32} style={{ left: c.x, top: 250, width: 410, height: 170, padding: '0 36px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...rise(f, c.at) }}>
          <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 120, color: c.on ? C.green : C.sub }}>{c.n}</span>
          <Toggle on={c.on} />
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: c.on ? C.green : C.sub }}>{c.t}</span>
        </Card>
      ))}
      <Card r={32} style={{ left: 330, top: 450, width: 420, height: 370, display: 'flex', alignItems: 'center', justifyContent: 'center', ...rise(f, 71.2) }}>
        <Maze t={walk} size={330} />
      </Card>
      <At x={880} y={640} o={done} s={0.94 + 0.06 * done}>
        <Pill tone="green" size={34}><Check size={34} /> Keluar</Pill>
      </At>
    </>
  );
};

/* ================================================================== */
/* 9. Look it up yourself: the YouTube search (split)                   */
/* ================================================================== */
const LookItUp: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Headline f={f} at={76.6} y={240} size={70}>Mau lebih detail?</Headline>
    <div style={{ position: 'absolute', left: 120, top: 360, ...rise(f, 79.6) }}>
      <div style={{ width: 360, height: 520, background: '#1B1B1D', borderRadius: 46, padding: 12, boxSizing: 'border-box', boxShadow: soft, overflow: 'hidden' }}>
        <Img src={staticFile('img/youtube-search.png')} style={{ width: '100%', display: 'block', borderRadius: 34 }} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 540, top: 440, ...rise(f, 80.4, 16) }}>
      <Pill tone="white" size={30}><Search size={30} /> theseus claude shannon</Pill>
    </div>
    <div style={{ position: 'absolute', left: 540, top: 560, ...rise(f, 82.4, 16) }}>
      <Pill tone="blue" size={34}><Sparkle size={28} color="#fff" /> Cari sendiri, ya</Pill>
    </div>
  </>
);

/* ================================================================== */
/* 10. Same era as Alan Turing (split)                                  */
/* ================================================================== */
const SameEra: React.FC<{ f: number }> = ({ f }) => (
  <>
    <At x={540} y={250} o={out(f, T(84.1), T(84.1) + 10)}>
      <Tag style={{ fontSize: 30, padding: '8px 18px' }}>Fakta unik</Tag>
    </At>
    <div style={{ position: 'absolute', left: 110, top: 310, ...rise(f, 85.3) }}>
      <Photo src="img/shannon-portrait.png" w={300} h={330} pos="50% 15%" title="Claude Shannon" sub="AS · 1916–2001" />
    </div>
    <div style={{ position: 'absolute', left: 642, top: 310, ...rise(f, 86.6) }}>
      <Photo src="img/turing-portrait.jpg" w={300} h={330} pos="50% 25%" title="Alan Turing" sub="Inggris · 1912–1954" />
    </div>
    <At x={540} y={470} o={out(f, T(86.0), T(86.0) + 10)}>
      <Pill tone="white" size={30}>sezaman</Pill>
    </At>
    <At x={540} y={560} o={out(f, T(89.6), T(89.6) + 10)}>
      <Pill tone="blue" size={32}><Sparkle size={26} color="#fff" /> Mesin yang bisa berpikir</Pill>
    </At>
  </>
);

/* ================================================================== */
/* 11. The Imitation Game (split)                                       */
/* ================================================================== */
const Film: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ position: 'absolute', left: 120, top: 290, ...rise(f, 92.4) }}>
      <Photo src="img/turing-portrait.jpg" w={280} h={320} pos="50% 25%" title="Alan Turing" sub="Kisahnya difilmkan" />
    </div>
    <div style={{ position: 'absolute', left: 560, top: 250, ...rise(f, 95.1) }}>
      <Photo src="img/imitation-game-poster.jpg" w={340} h={470} gray={false} title="The Imitation Game" sub="2014" />
    </div>
    <At x={270} y={768} o={out(f, T(96.85), T(96.85) + 8)} s={0.95 + 0.05 * out(f, T(96.85), T(96.85) + 8)}>
      <Pill tone="blue" size={34}>Coba nonton</Pill>
    </At>
  </>
);

/* ================================================================== */
/* 12. They met at Bell Labs, on secret projects (anim)                 */
/* ================================================================== */
const Avatar: React.FC<{ src: string; pos: string; size?: number }> = ({ src, pos, size = 150 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', boxShadow: soft, border: '6px solid #fff' }}>
    <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1)' }} />
  </div>
);
const BellLabs: React.FC<{ f: number }> = ({ f }) => {
  const meet = ease(f, T(99.2), T(100.9));
  return (
    <>
      <Headline f={f} at={97.9} y={300} size={96}>Pernah ketemu</Headline>
      <At x={mix(200, 410, meet)} y={520} o={out(f, T(99.0), T(99.0) + 10)}>
        <Avatar src="img/shannon-portrait.png" pos="50% 15%" />
      </At>
      <At x={mix(880, 670, meet)} y={520} o={out(f, T(99.6), T(99.6) + 10)}>
        <Avatar src="img/turing-portrait.jpg" pos="50% 25%" />
      </At>
      <div style={{ position: 'absolute', left: 140, top: 650, ...rise(f, 103.3) }}>
        <Photo src="img/bell-labs.jpg" w={772} h={420} title="Bell Labs, New York" sub="Amerika Serikat · 1943" />
      </div>
      <At x={540} y={1300} o={out(f, T(107.4), T(107.4) + 10)}>
        <Pill tone="white" size={32}><Lock size={30} /> Gak bisa ngobrolin proyeknya</Pill>
      </At>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1400, display: 'flex', justifyContent: 'center', gap: 24 }}>
        {[
          { at: 111.9, t: 'Proyek rahasia', sub: 'Amerika Serikat' },
          { at: 112.9, t: 'Proyek rahasia', sub: 'Inggris' },
        ].map((p) => (
          <div key={p.sub} style={{ ...rise(f, p.at, 20), background: C.card, borderRadius: 28, boxShadow: soft, padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Lock size={40} color={C.red} />
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 650, fontSize: 30, color: C.ink }}>{p.t}</div>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: C.sub }}>{p.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

/* ================================================================== */
/* 13. Who is more influential? (split)                                 */
/* ================================================================== */
const Versus: React.FC<{ f: number }> = ({ f }) => {
  const swap = lin(f, T(121.6), T(121.6) + 8);
  return (
    <>
      <Headline f={f} at={115.3} y={220} size={68}>Siapa lebih berpengaruh?</Headline>
      <div style={{ position: 'absolute', left: 130, top: 320, ...rise(f, 116.9) }}>
        <Photo src="img/shannon-portrait.png" w={270} h={300} pos="50% 15%" title="Claude Shannon" />
      </div>
      <div style={{ position: 'absolute', left: 652, top: 320, ...rise(f, 118.4) }}>
        <Photo src="img/turing-portrait.jpg" w={270} h={300} pos="50% 25%" title="Alan Turing" />
      </div>
      <At x={540} y={500} o={out(f, T(117.6), T(117.6) + 10)}>
        <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 80, color: C.faint }}>vs</span>
      </At>
      <At x={540} y={730} o={out(f, T(119.6), T(119.6) + 10) * (1 - swap)}>
        <Pill tone="blue" size={34}><Sparkle size={28} color="#fff" /> ke perkembangan AI modern</Pill>
      </At>
      <At x={540} y={730} o={swap}>
        <Tag style={{ fontSize: 30, padding: '8px 18px' }}>Sama-sama: mesin yang bisa berpikir</Tag>
      </At>
    </>
  );
};

export const SCENES: Scene[] = [
  { from: 0, to: 5.35, mode: 'split', C: Hook },
  { from: 5.35, to: 12.7, mode: 'split', C: Statement },
  { from: 12.7, to: 19.25, mode: 'split', C: Forum },
  { from: 19.25, to: 25.35, mode: 'anim', C: Name },
  { from: 25.35, to: 39.0, mode: 'split', C: Bit },
  { from: 39.0, to: 52.8, mode: 'anim', C: Theseus },
  { from: 52.8, to: 66.95, mode: 'split', C: MazeBrain },
  { from: 66.95, to: 76.3, mode: 'split', C: OnOff },
  { from: 76.3, to: 83.95, mode: 'split', C: LookItUp },
  { from: 83.95, to: 92.0, mode: 'split', C: SameEra },
  { from: 92.0, to: 97.633, mode: 'split', C: Film },
  { from: 97.633, to: 114.233, mode: 'anim', C: BellLabs },
  { from: 114.233, to: 124.383, mode: 'split', C: Versus },
];

/* over the full-frame outro: the comment ask, then "Like dulu, ya" while it is said */
export const LikePop: React.FC<{ f: number }> = ({ f }) => {
  const c = out(f, T(124.45), T(124.45) + 10) * (1 - lin(f, T(126.5), T(126.5) + 8));
  const p = pop(f, T(126.8), 220);
  const o = 1 - lin(f, T(129.3), T(129.3) + 8);
  return (
    <>
      {c > 0.01 && (
        <At x={540} y={460} o={c}>
          <div style={{ background: 'rgba(255,255,255,0.94)', borderRadius: 60, padding: '20px 40px', boxShadow: soft, fontFamily: SANS, fontSize: 40, fontWeight: 650, color: C.ink }}>
            Shannon atau Turing? Tulis di komen
          </div>
        </At>
      )}
      {f >= T(126.8) && (
        <At x={540} y={460} s={p} o={o}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.94)', borderRadius: 60, padding: '20px 40px', boxShadow: soft, fontFamily: SANS, fontSize: 42, fontWeight: 650, color: C.ink }}>
            <Thumb size={48} color={C.blue} /> Like dulu, ya
          </div>
        </At>
      )}
    </>
  );
};
