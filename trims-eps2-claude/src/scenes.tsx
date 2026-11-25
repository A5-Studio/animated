import React from 'react';
import { Img, staticFile } from 'remotion';
import { At, Box, Burst, Sticker, ease, lin, pop } from './components';
import { BODY, BORDER, C, HEAD, s, shadow } from './theme';

/*
 * Every scene draws on a 1000x880 stage and gets the ABSOLUTE frame, so
 * beats line up with the source.mp4 seconds written next to them.
 */
type SceneProps = { f: number };
const P = (f: number, sec: number, k = 170) => pop(f, s(sec), k);
const wobble = (f: number, amp = 3, speed = 0.12) => Math.sin(f * speed) * amp;
const ink = C.ink;
const SW = BORDER;

/* ------------------------------------------------------------------ */
/* small drawings                                                      */
/* ------------------------------------------------------------------ */
const Title: React.FC<{ f: number; at: number; text: string; bg?: string; y?: number; size?: number; r?: number }> = ({
  f, at, text, bg = C.white, y = 80, size = 46, r = -2,
}) => (
  <At x={500} y={y} s={P(f, at)} r={r}>
    <Sticker bg={bg} size={size}>{text}</Sticker>
  </At>
);

/** a photo in a thick-bordered polaroid with a caption strip */
export const Photo: React.FC<{ src: string; w: number; h: number; label?: string; labelBg?: string; pos?: string; gray?: boolean }> = ({
  src, w, h, label, labelBg = C.yellow, pos = 'center', gray = true,
}) => (
  <div style={{ background: C.white, border: `${SW}px solid ${ink}`, borderRadius: 18, boxShadow: shadow(10), padding: 12, paddingBottom: label ? 8 : 12 }}>
    <div style={{ width: w, height: h, overflow: 'hidden', borderRadius: 8, border: `4px solid ${ink}` }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: gray ? 'grayscale(1) contrast(1.08)' : undefined }} />
    </div>
    {label && (
      <div style={{ marginTop: 8, textAlign: 'center' }}>
        <span style={{ display: 'inline-block', background: labelBg, border: `4px solid ${ink}`, borderRadius: 10, padding: '2px 14px', fontFamily: HEAD, fontSize: label.length > 12 ? 24 : 30, whiteSpace: 'nowrap' }}>{label}</span>
      </div>
    )}
  </div>
);

export const ClaudeTile: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.22, border: `${SW}px solid ${ink}`, boxShadow: shadow(10), overflow: 'hidden', background: C.claude }}>
    <Img src={staticFile('img/claude-logo.png')} style={{ width: '100%', height: '100%', display: 'block' }} />
  </div>
);

const Stamp: React.FC<{ f: number; at: number; text: string; color?: string; size?: number; r?: number }> = ({ f, at, text, color = C.red, size = 64, r = -14 }) => {
  const p = pop(f, s(at), 260);
  if (f < s(at)) return null;
  return (
    <div style={{ transform: `rotate(${r}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 1.5) }}>
      <div style={{ border: `8px solid ${color}`, borderRadius: 16, padding: '4px 22px', color, fontFamily: HEAD, fontSize: size, background: '#ffffffcc', whiteSpace: 'nowrap' }}>{text}</div>
    </div>
  );
};

const Arrow: React.FC<{ w?: number; color?: string }> = ({ w = 90, color = ink }) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 100 60">
    <path d="M6 30 H76 M58 10 L84 30 L58 50" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Monitor: React.FC<{ size?: number; happy?: number }> = ({ size = 170, happy = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <rect x="10" y="12" width="100" height="72" rx="10" fill={C.white} stroke={ink} strokeWidth={6} />
    <rect x="20" y="22" width="80" height="52" rx="5" fill={happy > 0.5 ? C.green : C.blue} stroke={ink} strokeWidth={4} />
    <circle cx="46" cy="44" r="4.5" fill={ink} />
    <circle cx="74" cy="44" r="4.5" fill={ink} />
    <path d={happy > 0.5 ? 'M46 56 Q60 68 74 56' : 'M48 60 L72 60'} fill="none" stroke={ink} strokeWidth={4.5} strokeLinecap="round" />
    <rect x="50" y="84" width="20" height="16" fill={C.white} stroke={ink} strokeWidth={6} />
    <rect x="30" y="98" width="60" height="12" rx="4" fill={C.white} stroke={ink} strokeWidth={6} />
  </svg>
);

/** the Theseus mouse seen from above: wooden body, ears, tail, whiskers */
const Mouse: React.FC<{ size?: number; dir?: number; wheel?: number; xray?: number }> = ({ size = 90, dir = 0, wheel = 0, xray = 0 }) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ overflow: 'visible', transform: `rotate(${dir}deg)` }}>
    <path d="M-34 0 Q-60 4 -66 22" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
    <ellipse cx="0" cy="0" rx="38" ry="25" fill={xray ? '#E7B27C' : '#C98A4B'} stroke={ink} strokeWidth={6} />
    {xray > 0 && (
      <g opacity={xray}>
        {[-14, 14].map((x) => (
          <g key={x} transform={`rotate(${wheel} ${x} 0)`}>
            <circle cx={x} cy={0} r={10} fill={ink} />
            <rect x={x - 1.5} y={-8} width={3} height={7} fill={C.white} />
          </g>
        ))}
        <rect x="-6" y="-17" width="12" height="9" rx="2" fill={C.red} stroke={ink} strokeWidth={3} />
      </g>
    )}
    <circle cx="30" cy="-17" r="11" fill="#E7B27C" stroke={ink} strokeWidth={5} />
    <circle cx="30" cy="17" r="11" fill="#E7B27C" stroke={ink} strokeWidth={5} />
    <path d="M30 -12 Q50 0 30 12" fill="#C98A4B" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <circle cx="48" cy="0" r="5" fill={ink} />
    <circle cx="36" cy="-5" r="3" fill={ink} />
    <circle cx="36" cy="5" r="3" fill={ink} />
    <g stroke={ink} strokeWidth={2.5} strokeLinecap="round">
      <line x1="46" y1="-3" x2="62" y2="-12" />
      <line x1="46" y1="3" x2="62" y2="12" />
    </g>
  </svg>
);

/** 5x5 maze, path from bottom-left to the top-right exit */
const MAZE_WALLS = [
  'M0 0 H400 M0 0 V400 M0 400 H400 M400 80 V400',
  'M80 0 V160 M160 80 V240 M240 0 V80 M320 80 V240 M80 240 V320 M160 320 V400 M240 240 V320 M320 320 V400',
  'M80 160 H160 M160 240 H240 M240 160 H320 M0 320 H80 M240 320 H320 M80 80 H160',
].join(' ');
// cell centres the mouse walks through (bottom-left -> exit at top-right)
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
const Maze: React.FC<{ t: number; floor?: string; trail?: boolean; mouse?: boolean }> = ({ t, floor = C.white, trail = true, mouse = true }) => {
  const p = pathAt(t);
  const n = Math.max(1, Math.round(t * (MAZE_PATH.length - 1)));
  return (
    <svg width={400} height={400} viewBox="-10 -10 470 420" style={{ overflow: 'visible' }}>
      <rect x="0" y="0" width="400" height="400" fill={floor} />
      {trail && (
        <polyline points={[...MAZE_PATH.slice(0, n), [p.x, p.y]].map((q) => q.join(',')).join(' ')} fill="none" stroke={C.orange} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 22" />
      )}
      <path d={MAZE_WALLS} fill="none" stroke={ink} strokeWidth={12} strokeLinecap="square" />
      <g transform="translate(440 40)">
        <rect x="-26" y="-20" width="52" height="40" rx="8" fill={C.green} stroke={ink} strokeWidth={5} />
        <text x="0" y="8" textAnchor="middle" fontFamily={HEAD} fontSize="18">EXIT</text>
      </g>
      {mouse && (
        <g transform={`translate(${p.x} ${p.y})`}>
          <foreignObject x={-36} y={-36} width={72} height={72} style={{ overflow: 'visible' }}>
            <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mouse size={62} dir={p.dir} />
            </div>
          </foreignObject>
        </g>
      )}
    </svg>
  );
};

const Toggle: React.FC<{ on: boolean; w?: number }> = ({ on, w = 150 }) => (
  <div style={{ width: w, height: w * 0.5, borderRadius: w * 0.25, border: `${SW}px solid ${ink}`, background: on ? C.green : C.white, position: 'relative', boxShadow: shadow(6) }}>
    <div style={{
      position: 'absolute', top: w * 0.05, left: on ? w * 0.52 : w * 0.05, width: w * 0.36, height: w * 0.36, borderRadius: '50%',
      background: on ? C.orange : '#CFCFCF', border: `${SW - 1}px solid ${ink}`,
    }} />
  </div>
);

const Coil: React.FC<{ on: boolean }> = ({ on }) => (
  <svg width={70} height={70} viewBox="0 0 70 70">
    <rect x="22" y="6" width="26" height="58" rx="6" fill={on ? C.orange : '#BDBDBD'} stroke={ink} strokeWidth={5} />
    {[16, 26, 36, 46, 56].map((y) => (
      <line key={y} x1="14" y1={y} x2="56" y2={y} stroke={ink} strokeWidth={4} strokeLinecap="round" />
    ))}
    {on && <path d="M60 10 l8 -8 M62 22 l9 -2 M10 10 l-8 -8" stroke={ink} strokeWidth={4} strokeLinecap="round" />}
  </svg>
);

const Relay: React.FC<{ on: boolean }> = ({ on }) => (
  <div style={{ width: 92, height: 92, background: C.white, border: `${SW}px solid ${ink}`, borderRadius: 14, boxShadow: shadow(6), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
    <svg width={62} height={34} viewBox="0 0 62 34">
      <circle cx="8" cy="26" r="6" fill={ink} />
      <circle cx="54" cy="26" r="6" fill={ink} />
      <line x1="8" y1="26" x2={on ? 54 : 46} y2={on ? 26 : 4} stroke={ink} strokeWidth={6} strokeLinecap="round" />
    </svg>
    <div style={{ fontFamily: HEAD, fontSize: 22, background: on ? C.green : '#E2E2E2', border: `3px solid ${ink}`, borderRadius: 8, padding: '0 8px' }}>{on ? 'ON' : 'OFF'}</div>
  </div>
);

const Folder: React.FC<{ label: string; bg: string }> = ({ label, bg }) => (
  <div style={{ position: 'relative', width: 280, height: 200 }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 120, height: 40, background: bg, border: `${SW}px solid ${ink}`, borderRadius: '14px 14px 0 0' }} />
    <div style={{ position: 'absolute', left: 0, top: 30, right: 0, bottom: 0, background: bg, border: `${SW}px solid ${ink}`, borderRadius: '0 14px 14px 14px', boxShadow: shadow(8), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 30, textAlign: 'center', lineHeight: 1.1, whiteSpace: 'pre-line' }}>
      {label}
    </div>
  </div>
);

/** big binary stream that types itself out */
const Bits: React.FC<{ f: number; from: number; text: string; size?: number; per?: number }> = ({ f, from, text, size = 44, per = 1.2 }) => {
  const shown = Math.max(0, Math.floor((f - s(from)) / per));
  return (
    <div style={{ fontFamily: '"DejaVu Sans Mono", monospace', fontWeight: 700, fontSize: size, letterSpacing: 2, whiteSpace: 'nowrap' }}>
      {text.split('').map((ch, i) => (
        <span key={i} style={{ opacity: i < shown ? 1 : 0.12, color: ch === '1' ? ink : '#6B6B6B' }}>{ch}</span>
      ))}
    </div>
  );
};

/* ================================================================== */
/* 1. no official statement from Anthropic (5.35 - 12.7, anim)         */
/* ================================================================== */
const Statement: React.FC<SceneProps> = ({ f }) => (
  <>
    <Title f={f} at={5.5} text="Asal nama Claude?" bg={C.yellow} />
    <At x={250} y={370} s={P(f, 7.4)} r={-4}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <ClaudeTile size={230} />
        <Box bg={C.white} pad="4px 14px" radius={14} sh={7}><Img src={staticFile('img/anthropic-wordmark.png')} style={{ width: 280, display: 'block' }} /></Box>
      </div>
    </At>
    <At x={660} y={370} s={P(f, 6.8)} r={3}>
      <Box bg={C.white} pad="26px 30px" style={{ width: 400 }}>
        <div style={{ fontFamily: HEAD, fontSize: 30, marginBottom: 16 }}>PERNYATAAN RESMI</div>
        {[300, 330, 250, 310, 200].map((w, i) => (
          <div key={i} style={{ width: w, height: 16, background: '#DADADA', borderRadius: 8, marginBottom: 14 }} />
        ))}
      </Box>
    </At>
    <At x={660} y={400} s={1}>
      <Stamp f={f} at={8.0} text="GAK ADA" size={70} />
    </At>
    <At x={500} y={735} s={P(f, 10.4)} r={-1.5}>
      <Box bg={C.yellow} pad="14px 30px" style={{ fontFamily: BODY, fontWeight: 700, fontSize: 42, whiteSpace: 'nowrap' }}>
        “Claude” = nama seorang ilmuwan?
      </Box>
    </At>
  </>
);

/* ================================================================== */
/* 2. what the forums believe (12.7 - 19.25, split)                     */
/* ================================================================== */
const Post: React.FC<{ user: string; text: string; votes: number; bg?: string }> = ({ user, text, votes, bg = C.white }) => (
  <Box bg={bg} pad="16px 22px" radius={18} sh={8} style={{ width: 760, display: 'flex', gap: 20, alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: HEAD, fontSize: 26, minWidth: 70 }}>
      <svg width={36} height={26} viewBox="0 0 36 26"><path d="M18 2 L34 24 H2 Z" fill={C.orange} stroke={ink} strokeWidth={4} strokeLinejoin="round" /></svg>
      {votes}
    </div>
    <div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 22, color: '#555' }}>{user}</div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, lineHeight: 1.2 }}>{text}</div>
    </div>
  </Box>
);
const Forum: React.FC<SceneProps> = ({ f }) => {
  const posts = [
    { at: 13.4, y: 250, user: 'u/kepo_ai · 2 thn lalu', text: 'Claude itu dari Claude Shannon?', v: 1200, r: -1.5 },
    { at: 15.4, y: 455, user: 'u/bit_by_bit · 2 thn lalu', text: 'AI dari Anthropic, diambil dari nama ilmuwan', v: 870, r: 1.5 },
    { at: 17.4, y: 660, user: 'u/info_theory · 1 thn lalu', text: 'Bapak teori informasi, makanya!', v: 640, r: -1 },
  ];
  return (
    <>
      <Title f={f} at={12.9} text="Kata forum internet…" bg={C.white} />
      {posts.map((p) => (
        <At key={p.text} x={500} y={p.y} s={P(f, p.at, 200)} r={p.r}>
          <Post user={p.user} text={p.text} votes={Math.round(p.v * ease(f, s(p.at), s(p.at) + 40))} />
        </At>
      ))}
    </>
  );
};

/* ================================================================== */
/* 3. the full name (19.25 - 25.35, anim)                              */
/* ================================================================== */
const Name: React.FC<SceneProps> = ({ f }) => {
  const chips = [
    { at: 21.5, t: 'Amerika Serikat', bg: C.white, x: 500, y: 735, r: -2 },
    { at: 23.6, t: 'Matematika', bg: C.orange, x: 300, y: 840, r: 2 },
    { at: 24.4, t: 'Elektronika', bg: C.purple, x: 700, y: 840, r: -2 },
  ];
  return (
    <>
      <At x={500} y={265} s={P(f, 19.4)} r={-2}>
        <Photo src="img/shannon-portrait.png" w={300} h={380} pos="50% 15%" label="1916 – 2001" labelBg={C.white} />
      </At>
      <At x={500} y={600} s={P(f, 19.9, 200)} r={1.5}>
        <Box bg={C.yellow} pad="10px 36px" style={{ fontFamily: HEAD, fontSize: 76, whiteSpace: 'nowrap' }}>
          CLAUDE SHANNON
        </Box>
      </At>
      {chips.map((c) => (
        <At key={c.t} x={c.x} y={c.y} s={P(f, c.at, 220)} r={c.r}>
          <Sticker bg={c.bg} size={38}>{c.t}</Sticker>
        </At>
      ))}
    </>
  );
};

/* ================================================================== */
/* 4. father of information theory, BIT = binary digit (25.35 - 39.0) */
/* ================================================================== */
const Bit: React.FC<SceneProps> = ({ f }) => {
  const lit = lin(f, s(30.6), s(30.6) + 6);
  const L = (ch: string, on: boolean) => (
    <span style={{ background: on && lit > 0.5 ? C.yellow : 'transparent', boxShadow: on && lit > 0.5 ? `inset 0 0 0 4px ${ink}` : 'none', borderRadius: 8, padding: '0 2px' }}>{ch}</span>
  );
  return (
    <>
      <Title f={f} at={26.6} text="Father of Information Theory" bg={C.yellow} size={40} />
      <At x={180} y={330} s={P(f, 27.4)} r={-5}>
        <div style={{ background: C.white, border: `${SW}px solid ${ink}`, boxShadow: shadow(9), padding: 8, borderRadius: 10 }}>
          <Img src={staticFile('img/paper-1948-cover.webp')} style={{ width: 200, display: 'block' }} />
        </div>
      </At>
      <At x={180} y={530} s={P(f, 27.9, 220)} r={3}>
        <Sticker bg={C.white} size={26}>Paper 1948</Sticker>
      </At>
      <At x={620} y={250} s={P(f, 29.9)} r={2}>
        <Box bg={C.orange} pad="6px 40px" style={{ fontFamily: HEAD, fontSize: 110, letterSpacing: 6 }}>BIT</Box>
      </At>
      <At x={620} y={420} s={P(f, 30.4)} r={-1.5}>
        <Box bg={C.white} pad="12px 26px" style={{ fontFamily: HEAD, fontSize: 52, whiteSpace: 'nowrap' }}>
          {L('B', true)}{L('I', true)}nary dig{L('i', false)}{L('T', true)}
        </Box>
      </At>
      {/* information -> 0 and 1 -> computer */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18 }}>
        <div style={{ transform: `scale(${P(f, 32.6, 220)})` }}>
          <Box bg={C.white} pad="12px 22px" style={{ fontFamily: HEAD, fontSize: 44 }}>“Hai”</Box>
        </div>
        <div style={{ transform: `scale(${P(f, 33.4, 220)})` }}><Arrow w={70} /></div>
        <div style={{ transform: `scale(${P(f, 33.8, 220)})` }}>
          <Box bg={C.yellow} pad="12px 18px">
            <Bits f={f} from={34.0} text="01001000 01101001" size={34} per={1.4} />
          </Box>
        </div>
        <div style={{ transform: `scale(${P(f, 36.6, 220)})` }}><Arrow w={70} /></div>
        <div style={{ transform: `scale(${P(f, 37.3, 220)}) translateY(${wobble(f, 4, 0.2)}px)` }}>
          <Monitor size={150} happy={lin(f, s(37.6), s(37.6) + 2)} />
        </div>
      </div>
    </>
  );
};

/* ================================================================== */
/* 5. 1951: Theseus, the wooden mouse without a brain (39.0 - 52.8)    */
/* ================================================================== */
const Theseus: React.FC<SceneProps> = ({ f }) => {
  const mazeOut = ease(f, s(45.1), s(45.6));
  const big = ease(f, s(45.3), s(45.9));
  const xray = lin(f, s(47.7), s(48.2));
  const labels = [
    { at: 47.8, t: 'Kayu', bg: C.yellow, x: 230, y: 360, r: -4 },
    { at: 48.9, t: 'Magnet', bg: C.red, x: 770, y: 360, r: 4 },
    { at: 50.4, t: 'Roda', bg: C.white, x: 500, y: 760, r: -2 },
  ];
  return (
    <>
      <At x={840} y={200} s={P(f, 39.3)} r={6}>
        <Box bg={C.yellow} pad="4px 22px" style={{ fontFamily: HEAD, fontSize: 64 }}>1951</Box>
      </At>
      <Title f={f} at={42.4} text="Robot tikus Theseus" bg={C.white} y={80} size={40} r={2} />
      {mazeOut < 1 && (
        <>
          <At x={400} y={440} s={P(f, 41.2) * (1 - mazeOut)} r={-3}>
            <Photo src="img/shannon-theseus.jpg" w={600} h={475} gray={false} label="DEMO 1951" labelBg={C.yellow} />
          </At>
          <At x={770} y={690} s={P(f, 42.6) * (1 - mazeOut)} r={5}>
            <Photo src="img/theseus-mouse.jpg" w={340} h={255} gray={false} />
          </At>
        </>
      )}
      {big > 0 && (
        <>
          <At x={500} y={520} s={big * 1.0}>
            <div style={{ transform: `translateX(${wobble(f, 6, 0.3)}px)` }}>
              <Mouse size={430} xray={xray} wheel={f * 14} />
            </div>
          </At>
          {/* no brain */}
          <At x={500} y={215} s={P(f, 46.7)} r={-3}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Sticker bg={C.white} size={40}>Otak</Sticker>
              <div style={{ width: 64, height: 64, borderRadius: 14, background: C.red, border: `${SW}px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 44, color: C.white, boxShadow: shadow(6) }}>✗</div>
            </div>
          </At>
          {labels.map((l) => (
            <At key={l.t} x={l.x} y={l.y} s={P(f, l.at, 220)} r={l.r}>
              <Sticker bg={l.bg} size={44}>{l.t}</Sticker>
            </At>
          ))}
        </>
      )}
    </>
  );
};

/* ================================================================== */
/* 6. the maze is the brain: metal, electromagnets, relays (52.8-66.95)*/
/* ================================================================== */
const MazeBrain: React.FC<SceneProps> = ({ f }) => {
  const flick = (i: number) => f >= s(64.3) && Math.sin(f * 0.35 + i * 1.7) > 0;
  const layers = [
    { at: 58.6, label: 'Lantai logam', y: 300 },
    { at: 60.6, label: 'Elektromagnet', y: 470 },
    { at: 62.4, label: 'Relay telepon', y: 650 },
  ];
  return (
    <>
      <Title f={f} at={53.0} text="Otaknya = labirinnya!" bg={C.orange} />
      <At x={720} y={190} s={P(f, 56.4, 220)} r={6}>
        <Burst size={170} color={C.white} rot={f}><span style={{ fontSize: 30 }}>!!</span></Burst>
      </At>
      {/* metal floor */}
      <At x={360} y={layers[0].y} s={P(f, 54.0)}>
        <div style={{ width: 600, height: 110, background: 'linear-gradient(135deg, #E6E6E6, #A9A9A9)', border: `${SW}px solid ${ink}`, borderRadius: 14, boxShadow: shadow(8), position: 'relative', overflow: 'hidden' }}>
          <svg width={600} height={110} style={{ position: 'absolute' }}>
            <path d="M0 55 H120 V20 M200 0 V70 H320 M400 110 V40 H520 M560 0 V60" fill="none" stroke={ink} strokeWidth={8} />
          </svg>
          <div style={{ position: 'absolute', left: 150 + 300 * ease(f, s(54.5), s(57.5)), top: 22 }}><Mouse size={64} /></div>
        </div>
      </At>
      {/* electromagnets */}
      <div style={{ position: 'absolute', left: 50, top: layers[1].y - 40, display: 'flex', gap: 24, transform: `scale(${P(f, layers[1].at)})`, transformOrigin: '280px 40px' }}>
        {[0, 1, 2, 3, 4, 5].map((i) => <Coil key={i} on={flick(i)} />)}
      </div>
      {/* relays */}
      <div style={{ position: 'absolute', left: 40, top: layers[2].y - 50, display: 'flex', gap: 14, transform: `scale(${P(f, layers[2].at)})`, transformOrigin: '290px 50px' }}>
        {[0, 1, 2, 3, 4].map((i) => <Relay key={i} on={flick(i + 3)} />)}
      </div>
      {layers.map((l, i) => (
        <At key={l.label} x={790} y={l.y} s={P(f, l.at, 220)} r={i % 2 ? 3 : -3}>
          <Sticker bg={i === 0 ? C.white : i === 1 ? C.yellow : C.purple} size={28}>{l.label}</Sticker>
        </At>
      ))}
      {/* wires */}
      <svg width={1000} height={880} style={{ position: 'absolute', left: 0, top: 0, opacity: lin(f, s(62.4), s(62.8)) }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={87 + i * 106} y1={600} x2={85 + i * 94} y2={505} stroke={ink} strokeWidth={4} strokeDasharray="6 10" />
        ))}
      </svg>
    </>
  );
};

/* ================================================================== */
/* 7. bits: 0 = off, 1 = on, until the mouse gets out (66.95 - 76.3)    */
/* ================================================================== */
const OnOff: React.FC<SceneProps> = ({ f }) => {
  const walk = ease(f, s(71.2), s(75.0));
  const out = f >= s(75.1);
  return (
    <>
      <At x={250} y={150} s={P(f, 68.6)} r={-3}>
        <Box bg={C.white} pad="16px 26px" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span style={{ fontFamily: HEAD, fontSize: 90 }}>0</span>
          <Toggle on={false} w={130} />
          <span style={{ fontFamily: HEAD, fontSize: 40 }}>OFF</span>
        </Box>
      </At>
      <At x={750} y={150} s={P(f, 69.9)} r={3}>
        <Box bg={C.yellow} pad="16px 26px" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span style={{ fontFamily: HEAD, fontSize: 90 }}>1</span>
          <Toggle on w={130} />
          <span style={{ fontFamily: HEAD, fontSize: 40 }}>ON</span>
        </Box>
      </At>
      <At x={500} y={555} s={P(f, 71.2)}>
        <div style={{ border: `${SW}px solid ${ink}`, borderRadius: 18, background: C.white, boxShadow: shadow(12), padding: 14, transform: 'scale(0.92)' }}>
          <Maze t={walk} floor="#ECECEC" />
        </div>
      </At>
      {/* bits flipping next to the maze while it "thinks" */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const v = f > s(71.2) && f < s(75.1) ? (Math.floor(f / 5 + i * 3) % 3 ? '1' : '0') : i % 2 ? '1' : '0';
        return (
          <At key={i} x={i < 3 ? 95 : 905} y={420 + (i % 3) * 110} s={P(f, 71.4 + i * 0.1, 220)} r={i % 2 ? 4 : -4}>
            <Box bg={v === '1' ? C.yellow : C.white} pad="2px 18px" radius={12} sh={6} style={{ fontFamily: HEAD, fontSize: 52 }}>{v}</Box>
          </At>
        );
      })}
      {out && (
        <At x={790} y={300} s={P(f, 75.1, 220)} r={6}>
          <Burst size={210} color={C.orange} rot={f}><span style={{ fontSize: 36 }}>KELUAR!</span></Burst>
        </At>
      )}
    </>
  );
};

/* ================================================================== */
/* 8. same era as Alan Turing (83.95 - 92.0, split)                     */
/* ================================================================== */
const SameEra: React.FC<SceneProps> = ({ f }) => (
  <>
    <Title f={f} at={84.1} text="Fakta unik" bg={C.white} y={70} />
    <At x={260} y={390} s={P(f, 85.3)} r={-4}>
      <Photo src="img/shannon-portrait.png" w={300} h={330} pos="50% 15%" label="AS · 1916–2001" labelBg={C.white} />
    </At>
    <At x={740} y={390} s={P(f, 86.6)} r={4}>
      <Photo src="img/turing-portrait.jpg" w={300} h={330} pos="50% 25%" label="INGGRIS · 1912–1954" labelBg={C.white} />
    </At>
    <At x={500} y={390} s={P(f, 86.0, 220)} r={-8}>
      <Sticker bg={C.yellow} size={40}>Sezaman</Sticker>
    </At>
    <At x={500} y={760} s={P(f, 89.6)} r={-1.5}>
      <Box bg={C.orange} pad="14px 30px" style={{ fontFamily: HEAD, fontSize: 44, whiteSpace: 'nowrap' }}>
        Mesin yang bisa berpikir
      </Box>
    </At>
  </>
);

/* ================================================================== */
/* 9. The Imitation Game (92.0 - 99.6, split)                           */
/* ================================================================== */
const Film: React.FC<SceneProps> = ({ f }) => (
  <>
    <At x={230} y={300} s={P(f, 92.4)} r={-5}>
      <Photo src="img/turing-portrait.jpg" w={260} h={290} pos="50% 25%" label="ALAN TURING" labelBg={C.yellow} />
    </At>
    <At x={230} y={545} s={P(f, 93.0, 220)} r={3}>
      <Sticker bg={C.white} size={32}>Kisahnya difilmkan</Sticker>
    </At>
    {/* both posters, fanned: the face one first, then the Bombe one on top */}
    {[
      { src: 'img/imitation-game-poster-face.jpg', at: 94.6, x: 590, y: 400, r: -7 },
      { src: 'img/imitation-game-poster.jpg', at: 95.2, x: 790, y: 440, r: 6 },
    ].map((q) => (
      <At key={q.src} x={q.x} y={q.y} s={P(f, q.at)} r={q.r}>
        <div style={{ background: C.white, border: `${SW}px solid ${ink}`, borderRadius: 16, boxShadow: shadow(12), padding: 10 }}>
          <Img src={staticFile(q.src)} style={{ width: 290, height: 428, objectFit: 'cover', display: 'block', borderRadius: 6, border: `4px solid ${ink}` }} />
        </div>
      </At>
    ))}
    <At x={690} y={770} s={P(f, 95.6, 220)} r={-2}>
      <Sticker bg={C.yellow} size={30}>The Imitation Game · 2014</Sticker>
    </At>
    {f >= s(97.4) && (
      <At x={230} y={745} s={P(f, 97.5, 220)} r={-6}>
        <Burst size={250} color={C.orange} rot={f}><span style={{ fontSize: 32, lineHeight: 1.05 }}>COBA<br />NONTON!</span></Burst>
      </At>
    )}
  </>
);

/* ================================================================== */
/* 8b. look it up yourself: the YouTube search (76.3 - 83.95, split)   */
/* ================================================================== */
const LookItUp: React.FC<SceneProps> = ({ f }) => (
  <>
    <Title f={f} at={76.6} text="Mau lebih detail?" bg={C.purple} />
    <At x={320} y={500} s={P(f, 79.6)} r={-3}>
      <div style={{ background: ink, border: `${SW}px solid ${ink}`, borderRadius: 44, boxShadow: shadow(12), padding: 12 }}>
        <Img src={staticFile('img/youtube-search.png')} style={{ width: 380, display: 'block', borderRadius: 32 }} />
      </div>
    </At>
    <At x={710} y={380} s={P(f, 80.4, 220)} r={3}>
      <Box bg={C.white} pad="12px 20px" radius={30} sh={8} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, whiteSpace: 'nowrap' }}>
        theseus claude shannon
      </Box>
    </At>
    <At x={710} y={560} s={P(f, 82.4, 220)} r={-2}>
      <Sticker bg={C.yellow} size={34}>Cari sendiri ya!</Sticker>
    </At>
  </>
);

/* ================================================================== */
/* 10. they met at Bell Labs, but on secret projects (99.6 - 116.2)    */
/* ================================================================== */
const Avatar: React.FC<{ src: string; pos: string; size?: number }> = ({ src, pos, size = 170 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', border: `${SW}px solid ${ink}`, boxShadow: shadow(8), background: C.white }}>
    <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1)' }} />
  </div>
);
const BellLabs: React.FC<SceneProps> = ({ f }) => {
  const meet = ease(f, s(101.2), s(102.9));
  const secret = f >= s(108.9);
  return (
    <>
      <Title f={f} at={99.9} text="Pernah ketemu!" bg={C.yellow} />
      <At x={500} y={470} s={P(f, 105.3)} r={-2}>
        <Photo src="img/bell-labs.jpg" w={500} h={290} label="BELL LABS · NEW YORK · 1943" labelBg={C.orange} />
      </At>
      {/* the two of them walk toward each other */}
      <At x={150 + 60 * meet} y={330 - 140 * lin(f, s(105.0), s(105.5))} s={P(f, 101.0) * (1 - 0.3 * lin(f, s(105.0), s(105.5)))} r={-4}>
        <Avatar src="img/shannon-portrait.png" pos="50% 15%" />
      </At>
      <At x={850 - 60 * meet} y={330 - 140 * lin(f, s(105.0), s(105.5))} s={P(f, 101.6) * (1 - 0.3 * lin(f, s(105.0), s(105.5)))} r={4}>
        <Avatar src="img/turing-portrait.jpg" pos="50% 25%" />
      </At>
      {secret && (
        <>
          <At x={240} y={745} s={P(f, 113.9)} r={-5}>
            <Folder label={'PROYEK\nAMERIKA'} bg={C.white} />
          </At>
          <At x={760} y={745} s={P(f, 114.9)} r={5}>
            <Folder label={'PROYEK\nINGGRIS'} bg={C.white} />
          </At>
          <At x={250} y={815}><Stamp f={f} at={114.4} text="RAHASIA" size={34} /></At>
          <At x={770} y={815}><Stamp f={f} at={115.3} text="RAHASIA" size={34} r={10} /></At>
          {/* "can't talk about it" bubble */}
          <At x={500} y={200} s={P(f, 109.4, 220)} r={-2}>
            <Box bg={C.white} pad="6px 18px" radius={30} sh={7} style={{ fontFamily: HEAD, fontSize: 34, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span>…</span>
              <span style={{ width: 46, height: 46, borderRadius: 10, background: C.red, color: C.white, border: `4px solid ${ink}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>✗</span>
              <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24 }}>gak boleh cerita</span>
            </Box>
          </At>
        </>
      )}
    </>
  );
};

/* ================================================================== */
/* 11. who is more influential? (116.2 - 126.35, split)                */
/* ================================================================== */
const Versus: React.FC<SceneProps> = ({ f }) => (
  <>
    <Title f={f} at={117.3} text="Siapa lebih berpengaruh?" bg={C.white} size={42} />
    <At x={250} y={390} s={P(f, 118.9)} r={-4}>
      <Photo src="img/shannon-portrait.png" w={300} h={330} pos="50% 15%" label="SHANNON" labelBg={C.yellow} />
    </At>
    <At x={750} y={390} s={P(f, 120.4)} r={4}>
      <Photo src="img/turing-portrait.jpg" w={300} h={330} pos="50% 25%" label="TURING" labelBg={C.yellow} />
    </At>
    <At x={500} y={400} s={P(f, 119.6, 220)} r={0}>
      <Burst size={200} color={C.orange} rot={f * 0.6}><span style={{ fontSize: 52 }}>VS</span></Burst>
    </At>
    <At x={500} y={720} s={P(f, 121.6)} r={-2}>
      <Sticker bg={C.purple} size={44}>AI modern</Sticker>
    </At>
    <At x={500} y={830} s={P(f, 123.6, 220)} r={1.5}>
      <Sticker bg={C.white} size={30} style={{ textTransform: 'none' }}>sama-sama: mesin yang bisa berpikir</Sticker>
    </At>
  </>
);

export const SCENES: { from: number; to: number; bg: string; C: React.FC<SceneProps> }[] = [
  { from: 5.35, to: 12.7, bg: C.bg, C: Statement },
  { from: 12.7, to: 19.25, bg: C.orange, C: Forum },
  { from: 19.25, to: 25.35, bg: C.yellow, C: Name },
  { from: 25.35, to: 39.0, bg: C.bg, C: Bit },
  { from: 39.0, to: 52.8, bg: C.orange, C: Theseus },
  { from: 52.8, to: 66.95, bg: C.yellow, C: MazeBrain },
  { from: 66.95, to: 76.3, bg: C.bg, C: OnOff },
  { from: 76.3, to: 83.95, bg: C.bg, C: LookItUp },
  { from: 83.95, to: 92.0, bg: C.yellow, C: SameEra },
  { from: 92.0, to: 99.6, bg: C.orange, C: Film },
  { from: 99.6, to: 116.2, bg: C.bg, C: BellLabs },
  { from: 116.2, to: 126.35, bg: C.yellow, C: Versus },
];
