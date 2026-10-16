import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

// Dark neon: navy base, glowing accents.
export const C = {
  bg: '#0A0E1F',
  panel: '#141A33',
  text: '#F4F6FF',
  dim: '#8A93B8',
  cyan: '#3CF0FF',
  pink: '#FF4FD8',
  lime: '#B6FF3B',
  amber: '#FFB020',
  red: '#FF4D5E',
  violet: '#8B5CFF',
};

export const FONT = 'Inter, sans-serif';
loadFont({ family: 'Inter', url: staticFile('fonts/InterVariable.woff2'), weight: '100 900' });

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

// Cut right before "Mungkin itu aja sih video ke-9…" (77.9s), inside the pause.
export const TOTAL = s(77.75);

/**
 *  full - the original talking head fills the frame (with punch-in zooms)
 *  cut  - the person is cut out of the room and stands in front of the
 *         animated scene; scenes.tsx sets where they stand per scene
 */
export type Mode = 'full' | 'cut';
export const LAYOUT: [number, Mode][] = [
  [0, 'full'],
  [16.4, 'cut'],
  [37.8, 'full'],
  [41.4, 'cut'],
  [57.9, 'full'],
  [61.9, 'cut'],
];

/** frames the scan line takes to sweep the room away (or back) */
export const SCAN = 12;
/** frames the person takes to move into their scene pose */
export const POSE = 16;

/** punch-in zooms on the full-frame talking head: [from, to, scale] */
export const ZOOMS: [number, number, number][] = [
  [1.5, 3.1, 1.22], // "gampang ketipu"
  [5.0, 6.3, 1.12], // "buat menilai orang"
  [12.8, 16.2, 1.16], // "kalau ada yang tau… komen aja"
  [38.6, 41.3, 1.18], // "nah kalau aku mencoba menilai orang"
  [59.7, 61.8, 1.22], // "cukup menyederhanakan"
];
