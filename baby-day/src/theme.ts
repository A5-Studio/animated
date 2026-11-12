import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;
/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

// Soft pastel nursery palette (from the "Loja Infantil" reference).
export const C = {
  bg: '#F8F2EA', // warm cream
  paper: '#FFFCF7',
  sage: '#9EC4B5',
  sageDeep: '#7FAE9D',
  pink: '#EBA7B0',
  butter: '#F2CE86',
  lavender: '#A996C4',
  wood: '#E3C394',
  ink: '#6E6478', // soft plum-grey text, never pure black
  white: '#FFFFFF',
};

export const SERIF = '"Fraunces", serif';
export const SCRIPT = '"Dancing Script", cursive';
export const SANS = '"Nunito", sans-serif';

loadFont({ family: 'Fraunces', url: staticFile('fonts/Fraunces-700.woff2'), weight: '700' });
loadFont({ family: 'Fraunces', url: staticFile('fonts/Fraunces-800.woff2'), weight: '800' });
loadFont({ family: 'Dancing Script', url: staticFile('fonts/DancingScript-700.woff2'), weight: '700' });
loadFont({ family: 'Nunito', url: staticFile('fonts/Nunito-600.woff2'), weight: '600' });
loadFont({ family: 'Nunito', url: staticFile('fonts/Nunito-800.woff2'), weight: '800' });

/* ------------------------------------------------------------------ */
/* Edit here: the baby's name and the day's moments.                   */
/* Put each clip/photo in public/clips/. Missing files show a          */
/* placeholder card so the timing can be checked before footage lands. */
/* ------------------------------------------------------------------ */
export const BABY = 'Si Kecil'; // ganti dengan nama bayi

export type Moment = {
  time: string; // clock shown in the pill
  title: string; // big serif word
  note: string; // handwritten caption
  file: string; // public/clips/<file>, .mp4/.mov or .jpg/.png
  dur: number; // seconds
  accent: keyof typeof C;
  icon: 'sun' | 'bottle' | 'duck' | 'cloud' | 'ball' | 'moon';
  /**
   * Face cover keyframes, in seconds from the start of this moment.
   * x/y = face centre as a fraction of the footage frame (0..1),
   * size = sticker width as a fraction of the frame width.
   * Positions are interpolated between keyframes, so add one whenever the baby moves.
   */
  face?: { t: number; x: number; y: number; size: number }[];
};

export const MOMENTS: Moment[] = [
  { time: '06.00', title: 'Bangun', note: 'selamat pagi, dunia!', file: '01-bangun.mp4', dur: 4, face: [{ t: 0, x: 0.5, y: 0.4, size: 0.42 }], accent: 'butter', icon: 'sun' },
  { time: '07.00', title: 'Sarapan', note: 'nyam nyam susu hangat', file: '02-sarapan.mp4', dur: 4, face: [{ t: 0, x: 0.5, y: 0.4, size: 0.42 }], accent: 'pink', icon: 'bottle' },
  { time: '09.00', title: 'Mandi', note: 'main air sama bebek', file: '03-mandi.mp4', dur: 4, face: [{ t: 0, x: 0.5, y: 0.4, size: 0.42 }], accent: 'sage', icon: 'duck' },
  { time: '12.00', title: 'Tidur siang', note: 'shh... lagi mimpi indah', file: '04-tidur-siang.mp4', dur: 4, face: [{ t: 0, x: 0.5, y: 0.4, size: 0.42 }], accent: 'lavender', icon: 'cloud' },
  { time: '16.00', title: 'Main', note: 'jalan-jalan sore', file: '05-main.mp4', dur: 4, face: [{ t: 0, x: 0.5, y: 0.4, size: 0.42 }], accent: 'butter', icon: 'ball' },
  { time: '19.00', title: 'Bobo', note: 'sampai jumpa besok', file: '06-bobo.mp4', dur: 4, face: [{ t: 0, x: 0.5, y: 0.4, size: 0.42 }], accent: 'lavender', icon: 'moon' },
];

export const INTRO = 3.5;
export const OUTRO = 3.5;
/** frames two neighbouring scenes overlap */
export const XFADE = 12;

export const TOTAL = s(INTRO + MOMENTS.reduce((a, m) => a + m.dur, 0) + OUTRO);
