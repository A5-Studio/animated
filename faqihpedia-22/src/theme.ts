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

// The source is cut right before "Mungkin itu saja video ke-22…" (73.0s).
export const TOTAL = s(72.8);

/**
 * How the talking head is shown. Each entry starts at the given second and
 * lasts until the next one.
 *  full  - talking head fills the frame
 *  split - illustration on top, talking head (cropped) on the bottom
 *  anim  - illustration only, voice keeps playing with our own captions
 */
export type Mode = 'full' | 'split' | 'anim';
export const LAYOUT: [number, Mode][] = [
  [0, 'full'],
  [3.3, 'anim'], // the GJLS podcast with Anies Baswedan
  [12.0, 'full'],
  [16.0, 'split'], // years on the job, still confused
  [27.4, 'anim'], // the sharp one: dropped into a new field, gets A to Z
  [40.6, 'full'],
  [45.8, 'anim'], // years go up, learning stays at zero
  [51.3, 'split'], // learn as much as you can
  [63.3, 'anim'], // same years, more learned
];

/** frames a layout change takes */
export const MORPH = 14;
