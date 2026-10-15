import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

// Same neobrutalism palette as push-notification-id.
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

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

// The source is cut right before "Mungkin itu aja sih video ke-9…" (77.9s),
// inside the pause that ends at 78.1s.
export const TOTAL = s(77.75);

/**
 * How the talking head is shown. Each entry starts at the given second and
 * lasts until the next one.
 *  full  - talking head fills the frame (with punch-in zooms, see ZOOMS)
 *  split - illustration on top, talking head (cropped) on the bottom
 *  anim  - illustration only, voice keeps playing with our own captions
 */
export type Mode = 'full' | 'split' | 'anim';
export const LAYOUT: [number, Mode][] = [
  [0, 'full'],
  [16.4, 'split'], // "semacam skala": people waiting to be placed on a line
  [25.3, 'anim'], // 0 = really bad, 100 = really good, nobody is either
  [37.8, 'full'],
  [41.4, 'split'], // start everyone at 50, slide with what they do
  [57.9, 'full'],
  [61.9, 'anim'], // new people: not too far right, not too far left
];

/** frames a layout change takes */
export const MORPH = 14;

/**
 * Punch-in zooms on the full-frame talking head: [from, to, scale].
 * The zoom snaps in at `from`, creeps a little while held, and eases out at `to`.
 */
export const ZOOMS: [number, number, number][] = [
  [1.5, 3.1, 1.22], // "gampang ketipu"
  [5.0, 6.3, 1.12], // "buat menilai orang"
  [12.8, 16.2, 1.16], // "kalau ada yang tau… komen aja"
  [38.6, 41.3, 1.18], // "nah kalau aku mencoba menilai orang"
  [59.7, 61.8, 1.22], // "cukup menyederhanakan"
];
