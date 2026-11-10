import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

// Same neobrutalist palette as push-notification-id.
export const C = {
  bg: '#FFF1C9',
  ink: '#111111',
  white: '#FFFFFF',
  yellow: '#FFD600',
  pink: '#FF7AC6',
  blue: '#5AC8FF',
  green: '#7CF29A',
  orange: '#FF8A3D',
  purple: '#B69CFF',
  red: '#FF5A5A',
};

export const BORDER = 6;
export const shadow = (n = 12) => `${n}px ${n}px 0 ${C.ink}`;

export const HEAD = '"Archivo Black", sans-serif';
export const BODY = '"Space Grotesk", sans-serif';

loadFont({ family: 'Archivo Black', url: staticFile('fonts/ArchivoBlack.woff2') });
loadFont({ family: 'Space Grotesk', url: staticFile('fonts/SpaceGrotesk.woff2'), weight: '300 700' });

/* ------------------------------------------------------------------ */
/* the numbers (prices as of early November 2026)                      */
/* ------------------------------------------------------------------ */
export const UANG = 14_700_000_000;
export const KURS = 18_126; // Rp per US$, kurs pasar 6 Nov 2026
export const MULAI = { year: 2026, month: 11 }; // first paid month

export type Plan = {
  key: 'claude' | 'chatgpt' | 'gemini';
  app: string;
  plan: string;
  usd?: number; // billed in dollars
  idr: number; // per month, in rupiah
  color: string;
  note: string;
};

const P = (p: Omit<Plan, 'idr'> & { idr?: number }): Plan => ({ ...p, idr: p.idr ?? Math.round((p.usd ?? 0) * KURS) });

export const PLANS: Plan[] = [
  P({ key: 'claude', app: 'Claude', plan: 'Ultra', usd: 200, color: '#FF8A3D', note: 'plan tertinggi (dulu Max 20x)' }),
  P({ key: 'chatgpt', app: 'ChatGPT', plan: 'Pro 500', usd: 500, color: '#7CF29A', note: 'plan tertinggi, ada Ultrafast' }),
  P({ key: 'gemini', app: 'Gemini', plan: 'Google AI Ultra 20x', idr: 3_399_000, color: '#5AC8FF', note: 'harga resmi Indonesia' }),
];

/** every consumer tier, cheapest first; the last one is the plan we buy */
export const TIERS: Record<Plan['key'], { name: string; price: string }[]> = {
  claude: [
    { name: 'Free', price: 'Gratis' },
    { name: 'Pro', price: '$20' },
    { name: 'Max', price: '$100' },
    { name: 'Ultra', price: '$200' },
  ],
  chatgpt: [
    { name: 'Free', price: 'Gratis' },
    { name: 'Go', price: 'Rp75 rb' },
    { name: 'Plus', price: 'Rp349 rb' },
    { name: 'Pro 100', price: '$100' },
    { name: 'Pro 200', price: '$200' },
    { name: 'Pro 500', price: '$500' },
  ],
  gemini: [
    { name: 'Free', price: 'Gratis' },
    { name: 'AI Plus', price: 'Rp75 rb' },
    { name: 'AI Pro', price: 'Rp309 rb' },
    { name: 'AI Ultra 5x', price: 'Rp1,58 jt' },
    { name: 'AI Ultra 20x', price: 'Rp3,4 jt' },
  ],
};

// Horizontal (1920×1080) cut: longer plan scenes to fit the tier ladder.
export const SCENES_H = {
  hook: { from: 0, dur: 180 },
  claude: { from: 180, dur: 450 },
  chatgpt: { from: 630, dur: 450 },
  gemini: { from: 1080, dur: 450 },
  recap: { from: 1530, dur: 300 },
};
export const TOTAL_H = 1830;

export const months = (p: Plan) => Math.floor(UANG / p.idr);
/** last month the money still covers, starting from MULAI */
export const lastYear = (p: Plan) => MULAI.year + Math.floor((MULAI.month - 1 + months(p) - 1) / 12);

// Scene timeline, in frames at 30fps.
export const SCENES = {
  hook: { from: 0, dur: 150 },
  claude: { from: 150, dur: 390 },
  chatgpt: { from: 540, dur: 390 },
  gemini: { from: 930, dur: 390 },
  recap: { from: 1320, dur: 300 },
};
export const TOTAL = 1620;
