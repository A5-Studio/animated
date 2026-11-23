import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

// Same neobrutalism palette as faqihpedia-22 / faqihpedia-27.
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

// public/source.mp4 is the tightened cut (112.8s), "Trims!" ends at ~112.3s.
export const TOTAL = s(112.75);

/**
 * Where the source jumps (seconds in source.mp4). Each piece gets its own
 * punch-in so the jump cuts read as intentional.
 */
export const CUTS = [9.333, 16.988, 18.854, 22.775, 52.756, 65.956, 68.136, 72.446, 86.096];

/**
 * How the talking head is shown. Each entry starts at the given second and
 * lasts until the next one.
 *  full  - talking head fills the frame
 *  split - illustration on top, talking head (cropped) on the bottom
 *  anim  - illustration only, voice keeps playing with captions
 */
export type Mode = 'full' | 'split' | 'anim';
export const LAYOUT: [number, Mode][] = [
  [0, 'full'], // hook: ensiklopedia, tokopedia, wikipedia
  [9.25, 'anim'], // pedia comes from Greek paideia
  [21.2, 'split'], // pedia <-> pediatri
  [33.2, 'full'], // "kalau mau dibedah lebih dalam"
  [35.8, 'anim'], // ensiklopedia = pendidikan melingkar, A-Z
  [55.4, 'split'], // wikipedia = pendidikan cepat
  [68.2, 'anim'], // toko + ensiklopedia = tokopedia
  [86.1, 'full'], // faqihpedia
  [93.2, 'split'], // sharing what I know
  [106.2, 'full'], // like + trims
];

/** frames a layout change takes */
export const MORPH = 14;
