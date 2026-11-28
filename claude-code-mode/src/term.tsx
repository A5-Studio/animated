import React from 'react';
import { C, MONO, T } from './theme';

/*
 * A simplified Claude Code terminal, drawn (no screenshot): window bar,
 * transcript lines, the rounded prompt box and the status line under it.
 */

/** "⏵⏵" drawn as SVG so it renders the same everywhere */
export const Play2: React.FC<{ color: string; size?: number }> = ({ color, size = 26 }) => (
  <svg width={size * 1.3} height={size} viewBox="0 0 26 20" style={{ display: 'inline-block', verticalAlign: '-0.12em', marginRight: size * 0.4 }}>
    <path d="M1 2l10 8-10 8z M13 2l10 8-10 8z" fill={color} />
  </svg>
);

/** "⏸" */
export const Pause: React.FC<{ color: string; size?: number }> = ({ color, size = 26 }) => (
  <svg width={size * 0.8} height={size} viewBox="0 0 16 20" style={{ display: 'inline-block', verticalAlign: '-0.12em', marginRight: size * 0.4 }}>
    <rect x="1" y="2" width="5" height="16" rx="1" fill={color} />
    <rect x="10" y="2" width="5" height="16" rx="1" fill={color} />
  </svg>
);

export type Status = 'default' | 'bypass' | 'accept' | 'plan' | 'context' | 'esc';

/** the line under the prompt box */
export const StatusLine: React.FC<{ kind: Status; size?: number; o?: number; short?: boolean }> = ({ kind, size = 27, o = 1, short = false }) => {
  const base: React.CSSProperties = { fontFamily: MONO, fontSize: size, whiteSpace: 'nowrap', opacity: o };
  switch (kind) {
    case 'bypass':
      return <div style={{ ...base, color: T.bypass }}><Play2 color={T.bypass} size={size * 0.8} />bypass permissions on{!short && <span style={{ color: T.dim }}> (shift+tab to cycle)</span>}</div>;
    case 'accept':
      return <div style={{ ...base, color: T.accept }}><Play2 color={T.accept} size={size * 0.8} />accept edits on <span style={{ color: T.dim }}>(shift+tab to cycle)</span></div>;
    case 'plan':
      return <div style={{ ...base, color: T.plan }}><Pause color={T.plan} size={size * 0.8} />plan mode on <span style={{ color: T.dim }}>(shift+tab to cycle)</span></div>;
    case 'context':
      return <div style={{ ...base, color: T.dim, textAlign: 'right' }}>Context left until auto-compact: <span style={{ color: T.bypass }}>8%</span></div>;
    case 'esc':
      return <div style={{ ...base, color: T.dim }}>esc to interrupt</div>;
    default:
      return <div style={{ ...base, color: T.dim }}>? for shortcuts</div>;
  }
};

/** rounded input box with "> " and a blinking cursor */
export const PromptBox: React.FC<{ f: number; text?: string; size?: number }> = ({ f, text = '', size = 30 }) => (
  <div style={{ border: `2px solid ${T.line}`, borderRadius: 14, padding: '14px 20px', fontFamily: MONO, fontSize: size, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden' }}>
    <span style={{ color: T.dim }}>&gt; </span>
    {text}
    <span style={{ display: 'inline-block', width: size * 0.58, height: size * 1.1, verticalAlign: '-0.2em', background: Math.floor(f / 15) % 2 ? 'transparent' : T.text, marginLeft: 2 }} />
  </div>
);

/** terminal window: title bar + body */
export const Terminal: React.FC<{ w?: number; h?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w = 960, h, children, style }) => (
  <div style={{ width: w, height: h, background: T.bg, borderRadius: 34, overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.10), 0 30px 70px rgba(0,0,0,0.22)', display: 'flex', flexDirection: 'column', ...style }}>
    <div style={{ height: 58, background: T.bar, display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px', flex: 'none' }}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
      <div style={{ flex: 1, textAlign: 'center', marginRight: 80, fontFamily: MONO, fontSize: 22, color: T.dim }}>claude — ~/toko-online</div>
    </div>
    <div style={{ flex: 1, padding: '28px 34px 26px', display: 'flex', flexDirection: 'column', gap: 14, fontFamily: MONO, color: T.text, position: 'relative' }}>
      {children}
    </div>
  </div>
);

/** one transcript line: "● Tool(arg)" with an optional "⎿ result" under it */
export const ToolLine: React.FC<{ tool: string; arg: string; result?: string; o?: number; ok?: number; size?: number }> = ({
  tool, arg, result, o = 1, ok = 0, size = 29,
}) => (
  <div style={{ opacity: o, transform: `translateY(${(1 - o) * 14}px)`, fontFamily: MONO, fontSize: size, lineHeight: 1.35 }}>
    <div style={{ whiteSpace: 'nowrap' }}>
      <span style={{ color: ok ? T.ok : T.text }}>● </span>
      <b style={{ fontWeight: 700 }}>{tool}</b>
      <span style={{ color: T.text }}>({arg})</span>
    </div>
    {result && <div style={{ color: T.dim, whiteSpace: 'nowrap', paddingLeft: size * 0.6, opacity: ok }}>└ {result}</div>}
  </div>
);

/** user message line in the transcript */
export const UserLine: React.FC<{ text: string; size?: number; o?: number }> = ({ text, size = 29, o = 1 }) => (
  <div style={{ fontFamily: MONO, fontSize: size, color: T.dim, whiteSpace: 'nowrap', opacity: o }}>
    &gt; <span style={{ color: T.text }}>{text}</span>
  </div>
);

/** amber ring the standard uses to point at the exact thing being talked about */
export const Ring: React.FC<{ o: number; style: React.CSSProperties }> = ({ o, style }) => (
  <div style={{ position: 'absolute', border: `5px solid ${C.amber}`, borderRadius: 16, opacity: o, boxShadow: `0 0 0 ${8 * o}px rgba(245,180,0,0.18)`, ...style }} />
);

/** n characters of text revealed from frame `start`, at `cps` characters per second */
export const typed = (text: string, f: number, start: number, cps = 24) =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((f - start) / 30) * cps))));

/* ------------------------------------------------------------------ */
/* the "✻ Brewing…" spinner                                            */
/* ------------------------------------------------------------------ */
export const VERBS = [
  'Brewing', 'Clauding', 'Cooking', 'Pondering', 'Noodling', 'Marinating', 'Vibing', 'Percolating',
  'Simmering', 'Honking', 'Schlepping', 'Moseying', 'Ruminating', 'Conjuring', 'Reticulating', 'Hatching',
];
/** three orange dots orbiting, each growing and shrinking: the app's working indicator */
export const DotSpin: React.FC<{ f: number; size: number; color?: string }> = ({ f, size, color = T.claude }) => {
  const turn = (f / 30) * 0.9; // turns per second
  return (
    <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ display: 'inline-block', verticalAlign: '-0.15em', flex: 'none' }}>
      {[0, 1, 2].map((i) => {
        const a = (turn + i / 3) * Math.PI * 2;
        const r = 1.9 + 2.0 * (0.5 + 0.5 * Math.sin(a * 1 + i * 2.1 + f / 6));
        return <circle key={i} cx={Math.cos(a) * 7} cy={Math.sin(a) * 7} r={r} fill={color} />;
      })}
    </svg>
  );
};

/** orange word with a light sweep across it, like the real spinner */
export const Shimmer: React.FC<{ f: number; text: string; size: number }> = ({ f, text, size }) => {
  const pos = ((f * 0.6) % (text.length + 8)) - 4;
  return (
    <span>
      {text.split('').map((ch, i) => {
        const d = Math.abs(i - pos);
        const glow = Math.max(0, 1 - d / 2.5);
        return (
          <span key={i} style={{ color: glow > 0 ? `color-mix(in srgb, #FFD2BE ${Math.round(glow * 100)}%, ${T.claude})` : T.claude, fontSize: size }}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/**
 * "✻ Brewing… (12s · ↓ 1.2k tokens · esc to interrupt)"
 * verb: fixed word, or cycles through VERBS when `cycle` > 0 (frames per word).
 */
export const Spinner: React.FC<{
  f: number; size?: number; verb?: string; cycle?: number; secs?: number; tokens?: string; meta?: boolean; o?: number;
}> = ({ f, size = 29, verb, cycle = 0, secs, tokens, meta = true, o = 1 }) => {
  const word = verb ?? VERBS[cycle ? Math.floor(f / cycle) % VERBS.length : 0];
  return (
    <div style={{ fontFamily: MONO, fontSize: size, whiteSpace: 'nowrap', opacity: o }}>
      <span style={{ display: 'inline-block', width: size * 1.25 }}><DotSpin f={f} size={size * 0.95} /></span>
      <Shimmer f={f} text={`${word}…`} size={size} />
      {meta && (
        <span style={{ color: T.dim }}>
          {' '}({secs !== undefined ? `${secs}s · ` : ''}{tokens ? `↓ ${tokens} tokens · ` : ''}esc to interrupt)
        </span>
      )}
    </div>
  );
};
