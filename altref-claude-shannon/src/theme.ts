import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

// Look of the "Alternative Reference" clip (Drive: TRIMS/EPS 2/Alternative Reference): light grey grid paper,
// clean white UI cards with a header row, big counting numbers, mono pills, a talking-head card whose head
// pops out over its top edge, and word-by-word captions with a box on the word being said.
export const C = {
  bg: '#EFEFEF',
  grid: '#E3E3E3',
  card: '#FFFFFF',
  border: '#E4E4E4',
  ink: '#111111',
  sub: '#6B6B6B',
  faint: '#A3A3A3',
  blue: '#1F6FEB',
  blueSoft: '#E7F0FE',
  red: '#E5484D',
  redSoft: '#FDECEC',
  green: '#1F9D55',
  greenSoft: '#E6F6EC',
  pink: '#FDE7EE',
  pinkLine: '#F2B8C9',
  claude: '#D97757',
};

export const SANS = '"Inter", system-ui, sans-serif';
export const MONO = '"JetBrains Mono", ui-monospace, monospace';

loadFont({ family: 'Inter', url: staticFile('fonts/InterVariable.woff2'), weight: '100 900' });
loadFont({ family: 'JetBrains Mono', url: staticFile('fonts/jetbrains-mono-latin-500-normal.woff2'), weight: '500' });
loadFont({ family: 'JetBrains Mono', url: staticFile('fonts/jetbrains-mono-latin-700-normal.woff2'), weight: '700' });

export const shadow = '0 1px 2px rgba(0,0,0,0.04), 0 10px 28px rgba(0,0,0,0.07)';

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

// public/source.mp4 is the same tightened, cleaned-up cut as trims-eps2-claude (130.5s).
export const TOTAL = s(131.0);

/*
 * Platform UI (TikTok, Reels, Shorts) covers the bottom ~660 px and a ~120 px column on the right,
 * so the mouth and the captions stay above y ~1260.
 *  split - UI card on top (y 160-490), the cut-out person below on the grid, the room card from eye level (y 860) down
 *  anim  - illustration only on the grid, the voice keeps playing under captions
 */
export type Mode = 'split' | 'anim';
export const LAYOUT: [number, Mode][] = [
  [0, 'split'], // hook: the year counter
  [19.25, 'anim'], // profile card: Claude Shannon
  [25.35, 'split'], // information theory, bit
  [39.0, 'anim'], // 1951: Theseus
  [52.8, 'split'], // the maze is the brain
  [97.633, 'anim'], // Bell Labs, secret projects
  [114.233, 'split'], // poll + outro
];

/** frames a layout change takes */
export const MORPH = 12;

/**
 * talking-head card: 0.72x, like the reference: the room shows from eye level down, and above the card's
 * top edge (y 860) the person is cut out (alpha matte) so hair and forehead pop out over the grid.
 * Video top lands at page y 218: hair ~y 520, eyes ~y 850, mouth ~y 1154 (clear of the platform UI at y 1260).
 */
const K = 0.72;
const IMG_TOP = 218;
const CARD_TOP = 860;
export const HEAD = { k: K, x: Math.round((1080 - 1080 * K) / 2), y: CARD_TOP, w: Math.round(1080 * K), h: Math.round(IMG_TOP + 1920 * K) - CARD_TOP, sy: Math.round((CARD_TOP - IMG_TOP) / K) };
/** top UI card */
export const TOP = { x: 151, y: 160, w: 778, h: 330 };
/** caption centre line */
export const CAP_Y = 1222;
