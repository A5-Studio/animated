import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { PARTS, TOTAL_SEC, WORDS } from './timing';

export const FPS = 30;

// Same neobrutalism palette as faqihpedia-22 / push-notification-id.
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
  // spreadsheet chrome
  sheet: '#1E7A46',
  grid: '#D5D9DE',
  head: '#EEF1F4',
  sel: '#1A73E8',
};

export const BORDER = 6;
export const shadow = (n = 12) => `${n}px ${n}px 0 ${C.ink}`;

export const HEAD = '"Archivo Black", sans-serif';
export const BODY = '"Space Grotesk", sans-serif';
export const MONO = '"DejaVu Sans Mono", monospace';

loadFont({ family: 'Archivo Black', url: staticFile('fonts/ArchivoBlack.woff2') });
loadFont({ family: 'Space Grotesk', url: staticFile('fonts/SpaceGrotesk.woff2'), weight: '300 700' });
loadFont({ family: 'DejaVu Sans Mono', url: staticFile('fonts/DejaVuSansMono-Bold.ttf'), weight: '700' });

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

export const TOTAL = s(TOTAL_SEC);

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Seconds at which a word is spoken inside VO part `p` (0-based).
 * `word` matches the start of the transcribed word; `nth` picks a later hit.
 * Falls back to the part start (+ `fallback` seconds) if the word isn't found.
 */
export const cue = (p: number, word: string, nth = 0, fallback = 0): number => {
  const want = norm(word);
  const hits = WORDS.filter((w) => w.p === p && norm(w.w).startsWith(want));
  const hit = hits[Math.min(nth, hits.length - 1)];
  return hit ? hit.s : PARTS[p].start + fallback;
};

export { PARTS, WORDS };
