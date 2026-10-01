import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

// Neobrutalism palette: flat, loud colors, black ink everywhere.
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

// Scene timeline, in frames at 30fps. Everything else is local to its scene.
export const SCENES = {
  hook: { from: 0, dur: 150 },
  cast: { from: 150, dur: 240 },
  step1: { from: 390, dur: 300 },
  step2: { from: 690, dur: 240 },
  step3: { from: 930, dur: 300 },
  step4: { from: 1230, dur: 330 },
  step5: { from: 1560, dur: 210 },
  recap: { from: 1770, dur: 240 },
};
export const TOTAL = 2010;
