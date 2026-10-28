import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;
// 10 s loop. Every motion is periodic over TOTAL frames, so frame 0 follows the last frame seamlessly.
export const TOTAL = 300;
export const W = 1080;
export const H = 1920;

export const C = {
  green: '#1E9E4A',
  blue: '#1F4FBF',
  red: '#D62828',
  ink: '#0B0B0F',
  hand: '#F6EFE2',
  flameDeep: '#B3121F',
  flame: '#FF5A1F',
  flameHot: '#FFB020',
  flameCore: '#FFE58A',
};

loadFont({ family: 'Anton', url: staticFile('fonts/Anton-Regular.ttf') });

// Phase helpers: `cycles` must be an integer so the value at frame TOTAL equals frame 0.
export const TAU = Math.PI * 2;
export const phase = (frame: number, cycles: number) => (frame / TOTAL) * cycles;
export const wave = (frame: number, cycles: number, offset = 0) => Math.sin(TAU * (phase(frame, cycles) + offset));

// Deterministic pseudo-random in [0, 1).
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
