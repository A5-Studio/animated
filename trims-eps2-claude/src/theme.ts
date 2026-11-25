import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

/*
 * TRIMS palette (Faqihpedia segment kit): sambal orange, egg-yolk yellow,
 * rice white and ink. Same tokens as faqihpedia-artipedia (TRIMS episode 1).
 */
export const C = {
  bg: '#FFF6E8', // nasi
  ink: '#111111',
  white: '#FFFFFF',
  yellow: '#FFD600', // kuning telur
  pink: '#FF7AC6',
  blue: '#FFC59A', // peach tint
  green: '#FFE68A', // light yolk tint
  orange: '#FF8A3D', // sambal, the TRIMS colour
  purple: '#B69CFF',
  red: '#FF5A5A',
  claude: '#D97757', // the Claude logo tile
};

export const BORDER = 6;
export const shadow = (n = 12) => `${n}px ${n}px 0 ${C.ink}`;

export const HEAD = '"Archivo Black", sans-serif';
export const BODY = '"Space Grotesk", sans-serif';

loadFont({ family: 'Archivo Black', url: staticFile('fonts/ArchivoBlack.woff2') });
loadFont({ family: 'Space Grotesk', url: staticFile('fonts/SpaceGrotesk.woff2'), weight: '300 700' });

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

// public/source.mp4 is the tightened cut (130.5s); "Trims!" ends at ~130.2s.
export const END_CARD = 130.333;
export const TOTAL = s(133.633);

/** where the source jumps (seconds in source.mp4): each piece gets its own punch-in */
export const CUTS = [
  3.7, 5.233, 12.6, 16.567, 19.2, 25.25, 28.434, 38.6, 45.167, 47.467, 52.267, 66.8, 76.333, 83.9, 84.933, 95.0, 96.833,
  97.533, 106.766, 114.566, 124.299, 125.366, 129.666,
];

/**
 *  full  - talking head fills the frame
 *  split - illustration on top, talking head card on the bottom
 *  anim  - illustration only, voice keeps playing with captions
 */
export type Mode = 'full' | 'split' | 'anim';
export const LAYOUT: [number, Mode][] = [
  [0, 'full'], // hook: Claude in the 1950s? + "ya kalian gak salah denger"
  [5.35, 'anim'], // no official statement from Anthropic
  [12.7, 'split'], // forums believe: Claude Shannon
  [19.25, 'anim'], // full name card
  [25.35, 'split'], // father of information theory, bit
  [39.0, 'anim'], // 1951: Theseus, the mouse with no brain
  [52.8, 'anim'], // the maze is the brain: metal, electromagnets, relays
  [66.95, 'split'], // 0 = off, 1 = on, the mouse finds the exit
  [76.3, 'split'], // "cari sendiri deh": the YouTube search
  [83.95, 'split'], // same era as Alan Turing
  [92.0, 'split'], // The Imitation Game
  [97.633, 'anim'], // they met at Bell Labs, secret projects
  [114.233, 'split'], // who is more influential?
  [124.383, 'full'], // komen, like, trims
];

/** Safe area shared by TikTok, Reels and the IG feed (1080x1920). Same box as episode 1. */
export const SAFE = { left: 60, right: 940, top: 285, bottom: 1500 };
export const SAFE_CX = (SAFE.left + SAFE.right) / 2; // 500

/** frames a layout change takes */
export const MORPH = 14;

/** where scripts/splice.sh inserts the 3s TRIMS bumper (seconds in this render) */
export const BUMPER_AT = 3.7; // right after the hook line, before "ya kalian gak salah denger"
