import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

// Black and white only. Grey is just a tint of the same ink.
export const C = { ink: '#0A0A0A', paper: '#FAFAFA', grey: '#8C8C8C', line: '#2A2A2A' };

export const HEAD = '"Archivo Black", sans-serif';
export const BODY = '"Space Grotesk", sans-serif';

loadFont({ family: 'Archivo Black', url: staticFile('fonts/ArchivoBlack.woff2') });
loadFont({ family: 'Space Grotesk', url: staticFile('fonts/SpaceGrotesk.woff2'), weight: '300 700' });

// Scene timeline, in frames at 30fps. `dark` picks the background.
export const SCENES = {
  hook: { from: 0, dur: 80, dark: true },
  post: { from: 80, dur: 170, dark: false },
  offers: { from: 250, dur: 160, dark: false },
  risk1: { from: 410, dur: 200, dark: true },
  risk2: { from: 610, dur: 200, dark: true },
  risk3: { from: 810, dur: 200, dark: true },
  official: { from: 1010, dur: 270, dark: false },
  rule: { from: 1280, dur: 150, dark: false },
  outro: { from: 1430, dur: 160, dark: true },
};
export const TOTAL = 1590;
