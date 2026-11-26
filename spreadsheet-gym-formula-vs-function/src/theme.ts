import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { PARTS, PAUSES, TOTAL_SEC, WORDS } from './timing';

export const FPS = 30;

/*
 * Spreadsheet Gym identity from brand/segment-kit.html + brand/segments.ts:
 * master Faqihpedia system (ink borders, hard shadows, Archivo Black +
 * Space Grotesk + Space Mono) with Sheets green as the lead color, the
 * 20 kg plate blue as accent and a cell-grid sheet as the surface.
 */
export const C = {
  bg: '#F2FFF5', // gym surface: the sheet
  cream: '#FFF1C9', // master cream
  ink: '#111111',
  white: '#FFFFFF',
  yellow: '#FFD600', // master accent, allowed everywhere
  green: '#7CF29A', // gym lead
  blue: '#5AC8FF', // gym accent (20 kg plate)
  formula: '#157A3A', // formula text
  pink: '#FF7AC6',
  red: '#FF5A5A',
  orange: '#FF8A3D',
  purple: '#B69CFF',
  // spreadsheet chrome
  grid: '#D5D9DE',
  head: '#EEF1F4',
  sel: '#1A73E8',
};

export const EPISODE = { n: 1, kg: 5 as 5 | 10 | 20 };
export const EPISODE_LABEL = `SESI ${String(EPISODE.n).padStart(2, '0')} · ${EPISODE.kg} KG`;
/** the episode's main formula, always shown in the formula bar on top */
export const MAIN_FORMULA = '=SUM(A1:A5)';

export const BORDER = 6;
export const shadow = (n = 12) => `${n}px ${n}px 0 ${C.ink}`;

export const HEAD = '"Archivo Black", sans-serif';
export const BODY = '"Space Grotesk", sans-serif';
export const MONO = '"Space Mono", monospace';

loadFont({ family: 'Archivo Black', url: staticFile('fonts/ArchivoBlack.woff2') });
loadFont({ family: 'Space Grotesk', url: staticFile('fonts/SpaceGrotesk.woff2'), weight: '300 700' });
loadFont({ family: 'Space Mono', url: staticFile('fonts/SpaceMono-Regular.woff2'), weight: '400' });
loadFont({ family: 'Space Mono', url: staticFile('fonts/SpaceMono-Bold.woff2'), weight: '700' });

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

export const TOTAL = s(TOTAL_SEC);

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

// how whisper sometimes spells words of the cloned voice
const ALIAS: Record<string, string[]> = {
  ketuker: ['ketukar'],
  nyusun: ['newsoon', 'new', 'nyus'],
  function: ['fungsi'],
  nggak: ['tidak', 'gak', 'ngga'],
  dumbel: ['dumbbell'],
  temen: ['teman'],
  pendinginan: ['pendingin'],
  repetisi: ['repetisi', 'reputasi'],
};

/**
 * Seconds at which a word is spoken inside VO part `p` (0-based).
 * `word` matches the start of the transcribed word; `nth` picks a later hit.
 * Falls back to the part start (+ `fallback` seconds) if the word isn't found.
 */
export const cue = (p: number, word: string, nth = 0, fallback = 0): number => {
  const wants = [word, ...(ALIAS[word] ?? [])].map(norm);
  const hits = WORDS.filter((w) => w.p === p && wants.some((want) => norm(w.w).startsWith(want)));
  const hit = hits[Math.min(nth, hits.length - 1)];
  return hit ? hit.s : PARTS[p].start + fallback;
};

export { PARTS, PAUSES, WORDS };
