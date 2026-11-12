import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import VO from './vo.json';

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
  night: '#2F2A45',
  white: '#FFFFFF',
};
export type Accent = 'sage' | 'pink' | 'butter' | 'lavender';

export const SERIF = '"Fraunces", serif';
export const SCRIPT = '"Dancing Script", cursive';
export const SANS = '"Nunito", sans-serif';

loadFont({ family: 'Fraunces', url: staticFile('fonts/Fraunces-700.woff2'), weight: '700' });
loadFont({ family: 'Fraunces', url: staticFile('fonts/Fraunces-800.woff2'), weight: '800' });
loadFont({ family: 'Dancing Script', url: staticFile('fonts/DancingScript-700.woff2'), weight: '700' });
loadFont({ family: 'Nunito', url: staticFile('fonts/Nunito-600.woff2'), weight: '600' });
loadFont({ family: 'Nunito', url: staticFile('fonts/Nunito-800.woff2'), weight: '800' });

export const NAME = 'Migu';

export type Icon = 'sun' | 'bottle' | 'duck' | 'cloud' | 'ball' | 'moon' | 'book' | 'bag';

export type Shot = {
  id: string; // voice clip: public/vo/<id>.wav, length read from src/vo.json
  vo: string; // what Migu says (also shown as subtitle)
  src?: string; // public/clips/<src>; face positions come from src/media.json
  card?: 'bath'; // illustrated card instead of footage
  dur: number; // minimum seconds; stretched to fit the voice clip
  fx?: number; // crop focus 0..1 (0 = left/top, 1 = right/bottom)
  fy?: number;
  night?: boolean; // lights go out during the shot
};

export type Chapter = { time: string; title: string; accent: Accent; icon: Icon; shots: Shot[] };

export const OPENING: Shot = { id: 'opening', vo: 'Halo semua, aku Migu! Ini cerita kegiatan sehari-hariku.', dur: 8 };
export const COLLAGE = [
  'foto-05-merangkak.jpg', 'foto-02-minum-susu.jpg', 'foto-22-kartu-baby-vision.jpg', 'foto-08-sensory-beras.jpg',
  'foto-17-tidur-closeup-2.jpg', 'foto-19-gendong-ibu-mall.jpg', 'foto-18-main-kantong-kapas.jpg', 'foto-07-mainan-teether.jpg',
  'foto-13-gendong-ayah-kafe.jpg', 'foto-24-foto-keluarga-finger-heart.jpg',
];

export const CHAPTERS: Chapter[] = [
  { time: '06.00', title: 'Bangun pagi', accent: 'butter', icon: 'sun', shots: [
    { id: 'bangun', vo: 'Aku biasanya udah bangun pagi-pagi.', src: 'foto-05-merangkak.jpg', dur: 4 },
    { id: 'cermin', vo: 'Eh, siapa tuh di cermin? Aku dong!', src: 'foto-01-cermin.jpg', dur: 4, fx: 0.5 },
  ] },
  { time: '07.00', title: 'Minum susu', accent: 'pink', icon: 'bottle', shots: [
    { id: 'susu', vo: 'Habis bangun, aku langsung minum susu. Nyam nyam!', src: 'foto-02-minum-susu.jpg', dur: 4.5, fy: 0.3 },
  ] },
  { time: '07.30', title: 'Bobok lagi', accent: 'lavender', icon: 'cloud', shots: [
    { id: 'bobok-lagi', vo: 'Kenyang... terus aku bobok lagi deh, hehe.', src: 'foto-17-tidur-closeup-2.jpg', dur: 4 },
  ] },
  { time: '09.00', title: 'Mandi', accent: 'sage', icon: 'duck', shots: [
    { id: 'mandi', vo: 'Jam sembilan, baru deh aku mandi. Seger!', card: 'bath', dur: 4 },
  ] },
  { time: '10.00', title: 'Belajar', accent: 'butter', icon: 'book', shots: [
    { id: 'belajar', vo: 'Habis mandi, waktunya belajar!', src: 'foto-22-kartu-baby-vision.jpg', dur: 3.5, fy: 0.2 },
    { id: 'emosi', vo: 'Aku kenalan sama kartu emosi.', src: 'foto-03-kartu-emosi.jpg', dur: 3.5 },
    { id: 'buku-umma', vo: 'Terus dibacain buku sama Umma.', src: 'foto-16-dibacakan-buku-ibu.jpg', dur: 3.5, fy: 0.2 },
    { id: 'kisah', vo: 'Aku juga suka dengerin kisah Nabi.', src: 'foto-06-buku-kisah.jpg', dur: 3.5, fy: 0.2 },
  ] },
  { time: '11.00', title: 'Main', accent: 'pink', icon: 'ball', shots: [
    { id: 'tummy', vo: 'Tummy time sama Baba. Lihat, aku kuat angkat kepala!', src: 'video-01.mp4', dur: 7, fx: 0.2 },
    { id: 'beras', vo: 'Aku udah mulai main sensory pakai beras loh!', src: 'foto-08-sensory-beras.jpg', dur: 4.5, fy: 0.4 },
    { id: 'teether', vo: 'Teether? Aku gigit!', src: 'foto-07-mainan-teether.jpg', dur: 3 },
    { id: 'kapas', vo: 'Kapas juga aku pegang-pegang.', src: 'foto-18-main-kantong-kapas.jpg', dur: 3, fy: 0.2 },
  ] },
  { time: '13.00', title: 'Bobok siang', accent: 'lavender', icon: 'cloud', shots: [
    { id: 'gendong', vo: 'Aku lagi suka bobok sambil digendong.', src: 'video-03.mp4', dur: 5, fy: 1 },
    { id: 'gendong-umma', vo: 'Digendong Umma juga enak.', src: 'foto-14-gendong-ibu.jpg', dur: 3.5, fy: 0.3 },
    { id: 'gaya', vo: 'Kalau di kasur, gayaku begini...', src: 'foto-12-tidur-telentang.jpg', dur: 3.5, fx: 0.75 },
    { id: 'gaya-2', vo: '...atau begini, hehe.', src: 'foto-21-tengkurap-buku.jpg', dur: 3 },
  ] },
  { time: '15.00', title: 'Jalan-jalan', accent: 'sage', icon: 'bag', shots: [
    { id: 'klinik', vo: 'Kadang aku ke klinik, cek kesehatan.', src: 'foto-10-klinik.jpg', dur: 3.5, fx: 0.6 },
    { id: 'lift', vo: 'Naik lift sama Umma dan Baba.', src: 'foto-09-lift-keluarga.jpg', dur: 3, fx: 0.4 },
    { id: 'kafe', vo: 'Nemenin Baba ngopi.', src: 'foto-13-gendong-ayah-kafe.jpg', dur: 3, fy: 0.6 },
    { id: 'mall', vo: 'Atau jalan-jalan ke mall sama Umma.', src: 'foto-19-gendong-ibu-mall.jpg', dur: 3.5, fy: 0.4 },
  ] },
  { time: '17.00', title: 'Senam sore', accent: 'butter', icon: 'ball', shots: [
    { id: 'senam', vo: 'Sore-sore, senam dulu sama Baba!', src: 'video-02.mp4', dur: 7, fy: 0.45 },
  ] },
  { time: '18.00', title: 'Bobok malam', accent: 'lavender', icon: 'moon', shots: [
    { id: 'malam', vo: 'Jam enam sore, kalau lampu kamar udah gelap, aku mulai tidur.', src: 'foto-20-tidur-guling.jpg', dur: 5.5, night: true },
    { id: 'dari-lahir', vo: 'Aku udah belajar ini dari lahir loh!', src: 'foto-04-tidur.jpg', dur: 4, night: true },
  ] },
];

export const OUTRO: Shot = { id: 'outro', vo: 'Dadah semua! Sampai ketemu lagi ya.', src: 'foto-24-foto-keluarga-finger-heart.jpg', dur: 6, fy: 0.5 };

/* ------------------------------ timing ------------------------------ */
const voLen = VO as Record<string, number>;
/** seconds a shot lasts: its minimum, or the voice clip plus breathing room */
export const shotDur = (sh: Shot) => Math.max(sh.dur, (voLen[sh.id] ?? 0) + 0.9);
/** voice starts this long into each shot */
export const VO_DELAY = 0.35;
/** frames two chapters overlap for the wipe */
export const XFADE = 12;

export const chapterDur = (c: Chapter) => c.shots.reduce((a, sh) => a + shotDur(sh), 0);
export const TOTAL = s(shotDur(OPENING) + CHAPTERS.reduce((a, c) => a + chapterDur(c), 0) + shotDur(OUTRO));
