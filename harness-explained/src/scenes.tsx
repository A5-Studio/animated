import React from 'react';
import { C, MONO, SANS, SERIF, T, s, soft } from './theme';
import { DotSpin, PromptBox, Spinner, StatusLine, Terminal, ToolLine, UserLine } from './term';
import { SegmentTag, Tag, lin, out, pop } from './ui';

/*
 * AI (An Info), 39 s, drawn only: what an AI "harness" is, for beginners.
 * Model = brain, harness = the body around it. Everything stays inside the
 * shared safe box x 120-960, y 250-1250; captions sit at y 1185.
 * Every scene gets `f`, frames since its own start.
 */

/** serif headline, words rising in one by one; "*word" is in the accent colour */
const Headline: React.FC<{ f: number; lines: string[]; y: number; size?: number; start?: number; accent?: string }> = ({
  f, lines, y, size = 84, start = 0, accent = C.blue,
}) => {
  let k = 0;
  return (
    <div style={{ position: 'absolute', left: 120, right: 120, top: y, textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.04, letterSpacing: -2.5, color: C.ink }}>
      {lines.map((line, i) => (
        <div key={i}>
          {line.split(' ').map((w, j) => {
            const p = out(f, start + k * 3, start + k * 3 + 12);
            k++;
            return (
              <span key={j} style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 30}px)`, marginRight: '0.24em' }}>
                {w.startsWith('*') ? <span style={{ color: accent }}>{w.slice(1)}</span> : w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const rise = (f: number, a: number, d = 12) => {
  const p = out(f, a, a + d);
  return { opacity: p, transform: `translateY(${(1 - p) * 34}px)` } as React.CSSProperties;
};

/* ------------------------------ icons ------------------------------ */
type Icon = React.FC<{ size?: number; color?: string }>;
const Brain: Icon = ({ size = 80, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-6 6 6 6 0 0 0-4 10 6 6 0 0 0 3 9 6 6 0 0 0 7 7V8z" />
    <path d="M30 8a6 6 0 0 1 6 6 6 6 0 0 1 4 10 6 6 0 0 1-3 9 6 6 0 0 1-7 7V8z" />
    <path d="M18 18h-3M18 28h-4M30 18h3M30 28h4" />
  </svg>
);
const Wrench: Icon = ({ size = 40, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 6.5a4 4 0 0 0 5 5l-8.8 8.8a2 2 0 0 1-2.8-2.8l8.8-8.8a4 4 0 0 1-2.2-2.2z" />
    <path d="M14.5 6.5L17 4l3 3-2.5 2.5" />
  </svg>
);
const Loop: Icon = ({ size = 40, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
    <path d="M18 3v4h-4M6 21v-4h4" />
  </svg>
);
const Notes: Icon = ({ size = 40, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
);
const Shield: Icon = ({ size = 40, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

/* ------------------------- the harness diagram ------------------------- */
export const PIECES: { name: string; Icon: Icon; title: string; text: string; angle: number }[] = [
  { name: 'Alat', Icon: Wrench, title: 'Alat (tools)', text: 'Baca & tulis file, jalanin perintah, cari di web', angle: -90 },
  { name: 'Putaran', Icon: Loop, title: 'Putaran kerja', text: 'Kerjain, cek hasilnya, ulangi sampai beres', angle: 0 },
  { name: 'Memori', Icon: Notes, title: 'Memori', text: 'Ingat isi obrolan, diringkas kalau kepenuhan', angle: 90 },
  { name: 'Izin', Icon: Shield, title: 'Izin', text: 'Nanya kamu dulu sebelum aksi yang berisiko', angle: 180 },
];

/** model (blue core) inside the harness (orange ring with its four pieces) */
export const Diagram: React.FC<{ f: number; cx: number; cy: number; r?: number; ring?: number; shown?: number; active?: number }> = ({
  f, cx, cy, r = 190, ring = 1, shown = 4, active = -1,
}) => {
  const core = 92;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="rgba(217,119,87,0.07)" stroke={T.claude} strokeWidth={6} strokeDasharray={`${2 * Math.PI * r * ring} 9999`} transform={`rotate(-90 ${cx} ${cy})`} />
      </svg>
      <div style={{ position: 'absolute', left: cx - core, top: cy - core, width: core * 2, height: core * 2, borderRadius: core, background: C.blue, boxShadow: soft, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Brain size={70} />
        <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 700, color: '#fff' }}>Model</div>
      </div>
      {PIECES.slice(0, shown).map((p, i) => {
        const a = (p.angle * Math.PI) / 180;
        const on = active === i;
        return (
          <div key={p.name} style={{ position: 'absolute', left: cx + Math.cos(a) * r, top: cy + Math.sin(a) * r, transform: `translate(-50%, -50%) scale(${on ? 1.12 : 1})`, background: on ? T.claude : C.card, color: on ? '#fff' : C.ink, borderRadius: 40, padding: '12px 22px', boxShadow: soft, display: 'flex', alignItems: 'center', gap: 10, fontFamily: SANS, fontSize: 28, fontWeight: 700, whiteSpace: 'nowrap' }}>
            <p.Icon size={32} color={on ? '#fff' : C.ink} />
            {p.name}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: cx + r * 0.72, top: cy + r * 0.72 + 16, fontFamily: SANS, fontSize: 26, fontWeight: 700, color: T.claude, opacity: ring, whiteSpace: 'nowrap' }}>Harness</div>
    </>
  );
};

/* ================================================================== */
/* 1. Hook                                                             */
/* ================================================================== */
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const chips = ['AI harness', 'agent harness', 'harness engineering'];
  return (
    <>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 262, display: 'flex', justifyContent: 'center', ...rise(f, 0, 10) }}>
        <SegmentTag size={28} />
      </div>
      <Headline f={f} y={360} lines={['*Harness', 'itu apa sih?']} size={120} start={4} />
      {chips.map((c, i) => (
        <div key={c} style={{ position: 'absolute', left: [150, 470, 220][i], top: [720, 810, 910][i], transform: `rotate(${[-4, 3, -2][i]}deg) translateY(${Math.sin(f / 14 + i) * 8}px)`, ...rise(f, 20 + i * 8) }}>
          <div style={{ background: C.card, borderRadius: 40, padding: '16px 30px', boxShadow: soft, fontFamily: SANS, fontSize: 36, fontWeight: 600, color: C.sub }}>
            “{c}”
          </div>
        </div>
      ))}
    </>
  );
};

/* ================================================================== */
/* 2. Model alone: a brain that can only answer in text                */
/* ================================================================== */
const Brainy: React.FC<{ f: number }> = ({ f }) => {
  const stamp = pop(f, 120, 160);
  return (
    <>
      <Headline f={f} y={270} lines={['Model AI', 'itu kayak *otak']} />
      <div style={{ position: 'absolute', left: 120, top: 490, width: 840, height: 610, background: C.card, borderRadius: 36, boxShadow: soft, padding: 36, boxSizing: 'border-box', fontFamily: SANS, ...rise(f, 4) }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', ...rise(f, 14) }}>
          <div style={{ background: C.tag, borderRadius: '28px 28px 6px 28px', padding: '18px 26px', fontSize: 34, fontWeight: 500, color: C.ink }}>Rapikan folder project-ku dong</div>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 30, ...rise(f, 40) }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: C.blue, display: 'grid', placeItems: 'center', flex: 'none' }}><Brain size={42} /></div>
          <div style={{ fontSize: 32, lineHeight: 1.45, color: C.ink }}>
            Oke, caranya:
            <div style={{ color: C.sub }}>1. Buka folder-nya</div>
            <div style={{ color: C.sub }}>2. Hapus file yang gak dipakai</div>
            <div style={{ color: C.sub }}>3. Kelompokkan sisanya</div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 40, bottom: 40, transform: `rotate(-6deg) scale(${0.8 + 0.2 * stamp})`, opacity: Math.min(1, stamp * 1.5), border: `5px solid ${C.red}`, borderRadius: 18, padding: '10px 22px', fontSize: 36, fontWeight: 800, color: C.red, letterSpacing: 1 }}>
          CUMA NGASIH SARAN
        </div>
      </div>
    </>
  );
};

/* ================================================================== */
/* 3. Name it                                                          */
/* ================================================================== */
const Name: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Headline f={f} y={290} lines={['Harness =', '*badannya']} size={112} accent={T.claude} />
    <Diagram f={f} cx={540} cy={760} r={190} ring={lin(f, 20, 50)} shown={0} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', fontFamily: SANS, fontSize: 34, fontWeight: 500, color: C.ink, ...rise(f, 50) }}>
      program yang <b>membungkus</b> model AI
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', ...rise(f, 62) }}>
      <Tag style={{ fontSize: 26 }}>arti aslinya: abah-abah kuda</Tag>
    </div>
  </>
);

/* ================================================================== */
/* 4. What is inside the harness                                       */
/* ================================================================== */
export const PIECE_AT = (i: number) => 14 + i * 92;

const Inside: React.FC<{ f: number }> = ({ f }) => {
  const cur = PIECES.filter((_, i) => f >= PIECE_AT(i)).length - 1;
  const p = cur >= 0 ? PIECES[cur] : null;
  return (
    <>
      <Headline f={f} y={262} lines={['Isi harness']} size={84} />
      <Diagram f={f} cx={540} cy={620} r={190} shown={cur + 1} active={cur} />
      {p && (
        <div key={cur} style={{ position: 'absolute', left: 120, top: 880, width: 840, height: 230, background: C.card, borderRadius: 36, boxShadow: soft, padding: '30px 36px', boxSizing: 'border-box', display: 'flex', gap: 26, alignItems: 'center', ...rise(f, PIECE_AT(cur), 10) }}>
          <div style={{ width: 110, height: 110, borderRadius: 30, background: 'rgba(217,119,87,0.12)', display: 'grid', placeItems: 'center', flex: 'none' }}>
            <p.Icon size={64} color={T.claude} />
          </div>
          <div>
            <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 58, letterSpacing: -1.5, color: C.ink, lineHeight: 1.05 }}>{p.title}</div>
            <div style={{ fontFamily: SANS, fontSize: 32, fontWeight: 500, color: C.sub, lineHeight: 1.3, marginTop: 6 }}>{p.text}</div>
          </div>
        </div>
      )}
    </>
  );
};

/* ================================================================== */
/* 5. Example: Claude Code                                             */
/* ================================================================== */
const Example: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Headline f={f} y={262} lines={['Contohnya:', '*Claude Code']} size={84} accent={T.claude} />
    <div style={{ position: 'absolute', left: 120, top: 480, ...rise(f, 4) }}>
      <Terminal w={840} h={440}>
        <UserLine size={25} text="rapikan folder project-ku" />
        <ToolLine size={25} tool="Bash" arg="ls" result="24 files" o={out(f, 24, 32)} ok={lin(f, 30, 36)} />
        <ToolLine size={25} tool="Bash" arg="rm old-*.log" result="Removed 6 files" o={out(f, 50, 58)} ok={lin(f, 56, 62)} />
        <Spinner f={f} verb="Brewing" secs={Math.floor(f / 30)} tokens="2.1k" size={23} o={out(f, 14, 20)} />
        <div style={{ flex: 1 }} />
        <StatusLine kind="default" size={22} />
      </Terminal>
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 960, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: SANS, fontSize: 34, fontWeight: 700, ...rise(f, 80) }}>
      <div style={{ background: T.claude, color: '#fff', borderRadius: 40, padding: '16px 26px' }}>Claude Code</div>
      <span style={{ color: C.sub }}>=</span>
      <div style={{ background: C.blue, color: '#fff', borderRadius: 40, padding: '16px 26px' }}>model</div>
      <span style={{ color: C.sub }}>+</span>
      <div style={{ background: C.card, color: T.claude, borderRadius: 40, padding: '16px 26px', boxShadow: soft }}>harness</div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1070, textAlign: 'center', fontFamily: SANS, fontSize: 28, color: C.sub, ...rise(f, 110) }}>
      “Brewing…” itu juga tampilan dari harness-nya
    </div>
  </>
);

/* ================================================================== */
/* 6. Outro: recap + comment CTA                                       */
/* ================================================================== */
const CTA_WORDS = ['MCP', 'token', 'agent', 'context window'];
const typedComment = (f: number) => {
  const g = Math.max(0, f - 26);
  const w = CTA_WORDS[Math.floor(g / 40) % CTA_WORDS.length];
  const k = g % 40;
  const n = k < 28 ? Math.floor(k / 1.6) : w.length - (k - 28) * 2;
  return w.slice(0, Math.max(0, Math.min(w.length, n)));
};

const Outro: React.FC<{ f: number }> = ({ f }) => {
  const p = pop(f, 6, 150);
  const send = 1 + 0.06 * Math.sin(f / 5) * lin(f, 26, 34);
  return (
    <>
      <div style={{ position: 'absolute', left: 120, right: 120, top: 270, display: 'flex', justifyContent: 'center', gap: 16, fontFamily: SANS, fontSize: 34, fontWeight: 700, ...rise(f, 0) }}>
        <div style={{ background: C.blue, color: '#fff', borderRadius: 40, padding: '14px 26px' }}>Model = otak</div>
        <div style={{ background: T.claude, color: '#fff', borderRadius: 40, padding: '14px 26px' }}>Harness = badan</div>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 400, width: 840, height: 700, background: C.card, borderRadius: 40, boxShadow: soft, overflow: 'hidden', opacity: Math.min(1, p * 1.4), transform: `scale(${0.92 + 0.08 * p})` }}>
        <div style={{ height: 14, background: C.blue }} />
        <div style={{ padding: '34px 44px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <DotSpin f={f} size={40} color={C.blue} />
          <span style={{ fontFamily: SANS, fontSize: 28, fontWeight: 700, letterSpacing: 2, color: C.blue }}>GILIRAN KAMU</span>
        </div>
        <div style={{ padding: '18px 44px 0', fontFamily: SERIF, fontWeight: 500, fontSize: 90, lineHeight: 1.02, letterSpacing: -3, color: C.ink, marginTop: 10 }}>
          Istilah AI apa lagi yang <span style={{ color: C.blue }}>bikin bingung?</span>
        </div>
        <div style={{ position: 'absolute', left: 44, right: 44, bottom: 112, height: 96, borderRadius: 48, background: C.bg, display: 'flex', alignItems: 'center', gap: 18, padding: '0 12px 0 16px', ...rise(f, 18) }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: C.tag, flex: 'none' }} />
          <div style={{ flex: 1, fontFamily: SANS, fontSize: 38, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>
            {typedComment(f) || <span style={{ color: C.faint, fontWeight: 500 }}>Tambah komentar…</span>}
            <span style={{ display: 'inline-block', width: 3, height: 40, verticalAlign: '-6px', marginLeft: 3, background: Math.floor(f / 12) % 2 ? 'transparent' : C.ink }} />
          </div>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: C.blue, flex: 'none', display: 'grid', placeItems: 'center', transform: `scale(${send})` }}>
            <svg width="34" height="34" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 38, textAlign: 'center', fontFamily: SANS, fontSize: 34, fontWeight: 700, color: C.ink, ...rise(f, 26) }}>
          Jawab di komentar ↓
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
export type Scene = { from: number; to: number; C: React.FC<{ f: number }> };
export const SCENES: Scene[] = [
  { from: 0, to: 3.4, C: Hook },
  { from: 3.4, to: 9.6, C: Brainy },
  { from: 9.6, to: 13.6, C: Name },
  { from: 13.6, to: 26.4, C: Inside },
  { from: 26.4, to: 33.4, C: Example },
  { from: 33.4, to: 39, C: Outro },
];
export const TOTAL_SEC = 39;

const piece = (i: number, a: number) => 13.6 + PIECE_AT(i) / 30 + a;

/** on-screen captions (no voice): short grey pills */
export const CAPTIONS: [number, number, string][] = [
  [0.4, 3.3, 'Sering denger kata ini?'],
  [3.6, 6.6, 'Model AI itu otaknya.'],
  [6.6, 9.5, 'Pinter, tapi gak bisa gerak.'],
  [9.8, 13.5, 'Harness yang bikin gerak.'],
  [piece(0, 0.2), piece(1, 0), 'Tangan buat pakai alat.'],
  [piece(1, 0.1), piece(2, 0), 'Kerja sampai beres.'],
  [piece(2, 0.1), piece(3, 0), 'Ingat obrolanmu.'],
  [piece(3, 0.1), 26.3, 'Tahu kapan harus nanya.'],
  [26.6, 30.0, 'Claude Code itu harness.'],
  [30.0, 33.3, 'Otaknya: model Claude.'],
  [33.6, 36.6, 'Jawab di komentar!'],
  [36.6, 38.8, 'Like dulu, ya'],
];

export { s, MONO, PromptBox };
