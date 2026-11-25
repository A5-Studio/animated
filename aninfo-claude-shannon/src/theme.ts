import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

// AI (An Info) segment look (see the "AI (An Info): Segment Standard" doc and faqihpedia-askmaps):
// cream paper, soft white cards, serif headlines, grey caption pills, one accent per scene.
export const C = {
  bg: '#F4F1EA',
  paper: '#FBFAF6',
  card: '#FFFFFF',
  ink: '#1F1E1C',
  sub: '#6F6B63',
  faint: '#A9A49A',
  line: '#E7E2D8',
  tag: '#ECE8DF',
  blue: '#1A73E8', // the AI feature / Claude
  blueSoft: '#E8F0FD',
  red: '#EA4335',
  green: '#1E8E3E',
  greenSoft: '#E9F5EC',
  amber: '#F5B400', // highlights
  claude: '#D97757', // the Claude logo tile
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

// public/source.mp4 is the same tightened, cleaned-up cut as trims-eps2-claude (130.5s). No bumper, no music bed.
export const TOTAL = s(131.0);

/**
 *  full  - talking head fills the frame (turn-like beats and the outro)
 *  split - visual in the top half (0-960), talking head in the bottom half (default)
 *  anim  - visual only, the voice keeps playing under captions (title cards, proof)
 */
export type Mode = 'full' | 'split' | 'anim';
export const LAYOUT: [number, Mode][] = [
  [0, 'split'], // hook headline + "ya kalian gak salah denger"
  [5.35, 'split'], // no official statement from Anthropic
  [12.7, 'split'], // forums believe
  [19.25, 'anim'], // name card: Claude Shannon
  [25.35, 'split'], // father of information theory, bit
  [39.0, 'anim'], // 1951: Theseus
  [52.8, 'split'], // the maze is the brain
  [66.95, 'split'], // 0 = off, 1 = on
  [76.3, 'split'], // look it up: YouTube
  [83.95, 'split'], // same era as Alan Turing
  [92.0, 'split'], // The Imitation Game
  [97.633, 'anim'], // they met at Bell Labs
  [114.233, 'split'], // who is more influential?
  [124.383, 'full'], // outro
];

/** frames a layout change takes (12 frames = 0.4 s, per the standard) */
export const MORPH = 12;
