import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { TOTAL_SEC } from './timing';

export const FPS = 30;

// AI (An Info) look: cream paper, soft white cards, serif headlines, grey caption pills.
export const C = {
  bg: '#F4F1EA',
  paper: '#FBFAF6',
  card: '#FFFFFF',
  ink: '#1F1E1C',
  sub: '#6F6B63',
  faint: '#A9A49A',
  tag: '#ECE8DF',
  blue: '#1A73E8',
  red: '#EA4335',
  green: '#1E8E3E',
  amber: '#F5B400',
};

// Terminal colours, after Claude Code's default dark theme.
export const T = {
  bg: '#1C1B19',
  bar: '#2A2926',
  text: '#E8E6E1',
  dim: '#8F8B83',
  line: '#4A4843',
  claude: '#D97757',
  bypass: '#FF6B80',
  accept: '#AF87FF',
  plan: '#48968C',
  ok: '#4EBA65',
};

export const SERIF = '"Newsreader", Georgia, serif';
export const SANS = '"Inter", system-ui, sans-serif';
export const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';

loadFont({ family: 'Newsreader', url: staticFile('fonts/newsreader-latin-400-normal.woff2'), weight: '400' });
loadFont({ family: 'Newsreader', url: staticFile('fonts/newsreader-latin-500-normal.woff2'), weight: '500' });
loadFont({ family: 'Inter', url: staticFile('fonts/InterVariable.woff2'), weight: '100 900' });
loadFont({ family: 'JetBrains Mono', url: staticFile('fonts/JetBrainsMono-400.woff2'), weight: '400' });
loadFont({ family: 'JetBrains Mono', url: staticFile('fonts/JetBrainsMono-700.woff2'), weight: '700' });

export const soft = '0 2px 6px rgba(31,30,28,0.06), 0 18px 48px rgba(31,30,28,0.10)';

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

export const TOTAL = s(TOTAL_SEC);
