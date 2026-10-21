import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;
/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

// Taken from the product photo: lavender backdrop, cream, terracotta heart, herb green.
export const C = {
  lav: '#6C5C94',
  lavLight: '#9C8CC6',
  lavDeep: '#3F3366',
  cream: '#FFF8F1',
  white: '#FFFFFF',
  ink: '#2E2650',
  red: '#C4584A',
  green: '#6E9E4E',
  gold: '#F4C95D',
};

export const FONT = 'Inter, sans-serif';
loadFont({ family: 'Inter', url: staticFile('fonts/InterVariable.woff2'), weight: '100 900' });

/** scene start times in seconds; each runs until the next */
export const SCENES = {
  hook: 0,
  reveal: 3.2,
  ingredients: 7.6,
  benefits: 12.2,
  howto: 16.8,
  cta: 20.8,
  end: 24.5,
};
export const TOTAL = s(SCENES.end);
