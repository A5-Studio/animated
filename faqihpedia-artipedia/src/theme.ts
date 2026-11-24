import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

/*
 * TRIMS palette (Faqihpedia segment kit): sambal orange, egg-yolk yellow,
 * rice white and ink. Red, green and blue belong to the other segments
 * (Marketing 0 KM, Spreadsheet Gym), so here `blue` and `green` are mapped
 * to warm tints, and red is kept only for the tiny "wrong" marks.
 */
export const C = {
  bg: '#FFF6E8', // nasi
  ink: '#111111',
  white: '#FFFFFF',
  yellow: '#FFD600', // kuning telur (also the Faqihpedia accent)
  pink: '#FF7AC6',
  blue: '#FFC59A', // peach tint
  green: '#FFE68A', // light yolk tint
  orange: '#FF8A3D', // sambal, the TRIMS colour
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
// The TRIMS end card takes over at END_CARD and holds for a few seconds.
export const END_CARD = 112.35;
export const TOTAL = s(115.5);

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
  [9.0, 'anim'], // pedia comes from Greek paideia (the TRIMS bumper is spliced in at BUMPER_AT)
  [21.2, 'split'], // pedia <-> pediatri
  [33.2, 'full'], // "kalau mau dibedah lebih dalam"
  [35.8, 'anim'], // ensiklopedia = pendidikan melingkar, A-Z
  [55.4, 'split'], // wikipedia = pendidikan cepat
  [68.2, 'anim'], // toko + ensiklopedia = tokopedia
  [86.1, 'full'], // faqihpedia
  [93.2, 'split'], // sharing what I know
  [106.2, 'full'], // like + trims
];

/**
 * Safe area shared by TikTok, Instagram Reels and the Instagram feed (1080x1920).
 *  - TikTok: top tabs ~150px, caption/music ~420px at the bottom, action buttons ~140px on the right
 *  - Reels: header ~220px, caption/audio ~420px at the bottom, icons on the right
 *  - Feed: reels are cropped to 4:5 (y 285-1635), the profile grid to 3:4 (y 240-1680)
 * Every caption, sticker, title and illustration stays inside this box.
 */
export const SAFE = { left: 60, right: 940, top: 285, bottom: 1500 };
export const SAFE_CX = (SAFE.left + SAFE.right) / 2; // 500

/** frames a layout change takes */
export const MORPH = 14;

/** where scripts/splice.sh inserts the 3s TRIMS bumper (seconds in this render) */
export const BUMPER_AT = 9.5;
