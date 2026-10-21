import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);

// News-desk palette: deep navy, market red / green, Indonesian red-white accents.
export const C = {
  bg: '#0E1626',
  panel: '#16213A',
  line: '#2A3A5C',
  text: '#F3F6FC',
  dim: '#8FA0C2',
  red: '#FF4D5E',
  green: '#2BD98A',
  amber: '#FFB938',
  blue: '#4DA3FF',
};

export const FONT = 'Inter, sans-serif';
loadFont({ family: 'Inter', url: staticFile('fonts/InterVariable.woff2'), weight: '100 900' });
