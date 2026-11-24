import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

// Calm editorial look, after the reference: cream paper, soft white cards,
// serif headlines, grey caption pills.
export const C = {
  bg: '#F4F1EA',
  paper: '#FBFAF6',
  card: '#FFFFFF',
  ink: '#1F1E1C',
  sub: '#6F6B63',
  faint: '#A9A49A',
  line: '#E7E2D8',
  // map colours (generic, Google-Maps-like)
  land: '#F2EFE8',
  park: '#CFE6C6',
  water: '#AED2F0',
  road: '#FFFFFF',
  roadEdge: '#E1DCD1',
  major: '#FBE2A4',
  majorEdge: '#EBC873',
  blue: '#1A73E8',
  red: '#EA4335',
  green: '#1E8E3E',
  star: '#F5B400',
  matcha: '#7DA453',
};

export const SERIF = '"Newsreader", Georgia, serif';
export const SANS = '"Inter", system-ui, sans-serif';

loadFont({ family: 'Newsreader', url: staticFile('fonts/newsreader-latin-400-normal.woff2'), weight: '400' });
loadFont({ family: 'Newsreader', url: staticFile('fonts/newsreader-latin-500-normal.woff2'), weight: '500' });
loadFont({ family: 'Inter', url: staticFile('fonts/InterVariable.woff2'), weight: '100 900' });

export const soft = '0 2px 6px rgba(31,30,28,0.06), 0 18px 48px rgba(31,30,28,0.10)';

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

// public/source.mp4 is the talking head with dead air already cut (scripts/cut.py).
export const TOTAL = s(60.3);

/**
 * How the talking head is shown. Each entry starts at the given second
 * (of source.mp4) and lasts until the next one.
 *  full  - talking head fills the frame
 *  split - illustration in the top half, talking head in the bottom half
 *  anim  - illustration only, the voice keeps playing under captions
 */
export type Mode = 'full' | 'split' | 'anim';
export const LAYOUT: [number, Mode][] = [
  [0, 'split'], // hook
  [19.98, 'full'], // "tapi sekarang dengan AI udah berubah banget"
  [22.34, 'anim'], // Ask Maps title
  [26.8, 'split'], // typing the prompt + criteria
  [43.7, 'anim'], // the answer
  [49.46, 'split'], // dulu vs sekarang
  [54.88, 'full'], // outro
];

/** frames a layout change takes */
export const MORPH = 12;
