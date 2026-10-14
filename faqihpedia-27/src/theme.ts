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

// The source is cut right before "Itu aja video ke-27…" (88.8s).
export const TOTAL = s(88.55);

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
  [3.4, 'anim'], // Pandji quote
  [12.6, 'full'],
  [17.8, 'split'], // penasaran berbulan-bulan, takut nyesel
  [33.0, 'full'],
  [37.8, 'split'], // penonton dikit, mulai dari kecil
  [43.2, 'anim'], // "ada yang bilang" -> 10 penonton = kamar penuh
  [58.6, 'full'],
  [62.2, 'split'], // alasan buat berhenti
  [71.2, 'full'],
  [74.2, 'anim'], // hari ke-27, tinggal 3
  [82.8, 'split'], // konsep baru setelah 30 hari
];

/** frames a layout change takes */
export const MORPH = 14;
