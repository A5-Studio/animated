import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// 60 fps so the 2-second bounce reads smooth.
export const FPS = 60;
export const TOTAL = 120; // 2.0 s

// Same neobrutalism palette as the other Faqihpedia videos.
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

export const BORDER = 8;
export const shadow = (n = 14) => `${n}px ${n}px 0 ${C.ink}`;

export const HEAD = '"Archivo Black", sans-serif';
export const BODY = '"Space Grotesk", sans-serif';

loadFont({ family: 'Archivo Black', url: staticFile('fonts/ArchivoBlack.woff2') });
loadFont({ family: 'Space Grotesk', url: staticFile('fonts/SpaceGrotesk.woff2'), weight: '300 700' });

/**
 * Cue frames. scripts/jingle.py places its sounds on the same times.
 */
export const CUE = {
  plate: 6, // plate slams in (thud at 0.10s)
  letters: [14, 19, 24, 29, 34], // T R I M S
  question: 44, // "?" boing
  ribbon: 50, // "Trivia Makan Siang"
  cutlery: 56, // fork + spoon clink
  stamp: 70, // @faqihpedia + ta-da
  out: 106, // iris close
};
