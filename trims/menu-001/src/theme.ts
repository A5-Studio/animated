import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import VO from './vo.json';

export const FPS = 30;

// Faqihpedia neobrutalism palette + the TRIMS segment colors (brand/segments.ts).
export const C = {
  bg: '#FFF1C9',
  ink: '#111111',
  white: '#FFFFFF',
  yellow: '#FFD600',
  orange: '#FF8A3D', // TRIMS lead
  rice: '#FFF6E8',
  blue: '#5AC8FF',
  green: '#7CF29A',
  pink: '#FF7AC6',
  red: '#FF5A5A',
  claude: '#D97757',
};

export const BORDER = 6;
export const shadow = (n = 12) => `${n}px ${n}px 0 ${C.ink}`;

export const HEAD = '"Archivo Black", sans-serif';
export const BODY = '"Space Grotesk", sans-serif';
export const MONO = '"DejaVu Sans Mono", monospace';

loadFont({ family: 'Archivo Black', url: staticFile('fonts/ArchivoBlack.woff2') });
loadFont({ family: 'Space Grotesk', url: staticFile('fonts/SpaceGrotesk.woff2'), weight: '300 700' });

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

/**
 * The script, one entry per beat. `dur` is the length of that beat's voice
 * clip in seconds (public/vo/NN.wav, made by scripts/voice.py) plus a short
 * breath; `vo` is null for the bumper. Captions split `vo` on " | ".
 */
export type Beat = { id: string; vo: string | null; dur: number };
export const BEATS: Beat[] = [
  { id: 'hook', vo: 'Tiap hari pakai Claude, | tapi tahu nggak, Claude itu sebenarnya *siapa*?', dur: 3.4 },
  { id: 'bumper', vo: null, dur: 3.0 }, // trims-bumper.mp4 (branch claude/determined-ride-gofg2k)
  { id: 'shannon', vo: 'Nama AI buatan Anthropic ini *diyakini* | sebagai penghormatan untuk seorang ilmuwan | bernama *Claude Shannon*.', dur: 6.5 },
  { id: 'bit', vo: 'Beliau matematikawan dan insinyur elektro | asal Amerika Serikat. | Dia yang mempopulerkan istilah *bit*, nol dan satu, | dan dijuluki *Father of Information Theory*.', dur: 9.5 },
  { id: 'turing', vo: 'Fun fact: Shannon hidup sezaman | dengan ilmuwan komputer asal Inggris yang lebih terkenal, | *Alan Turing*.', dur: 6.0 },
  { id: 'turingWork', vo: 'Turing ini yang merumuskan konsep | *mesin komputer universal*, | dan ikut memecahkan sandi *Enigma* | milik Jerman di Perang Dunia II.', dur: 8.0 },
  { id: 'meet', vo: 'Dan mereka berdua pernah ketemu, | ngobrol di *kantin Bell Labs* tahun 1943.', dur: 5.0 },
  { id: 'predict', vo: 'Tahun 1951, Shannon bikin eksperimen: | orang disuruh *nebak huruf berikutnya* dalam sebuah kalimat. | Nebak yang berikutnya itu | persis cara kerja AI kayak *Claude* sekarang.', dur: 10.0 },
  { id: 'lifespan', vo: 'Shannon hidup cukup lama, sampai umur *84 tahun*. | Beliau meninggal tahun *2001*, | sempat lihat internet tumbuh dari teorinya.', dur: 7.0 },
  { id: 'ask', vo: 'Kalau menurut kalian, siapa yang lebih berpengaruh di dunia AI? | *Alan Turing* atau *Claude Shannon*?', dur: 5.5 },
  { id: 'outro', vo: 'Trims udah makan siang bareng. | Sampai jumpa besok!', dur: 3.5 },
];

/** start frame and length in frames of each beat */
const voDur = VO as Record<string, number>;
/** a beat lasts as long as its voice clip plus a breath, else its scripted guess */
const BREATH = 0.45;
export const TIMING = (() => {
  let at = 0;
  return BEATS.map((b) => {
    const d = voDur[b.id] ? voDur[b.id] + BREATH : b.dur;
    const t = { ...b, from: at, len: s(d) };
    at += t.len;
    return t;
  });
})();
export const TOTAL = TIMING[TIMING.length - 1].from + TIMING[TIMING.length - 1].len;
export const beat = (id: string) => TIMING.find((t) => t.id === id)!;
