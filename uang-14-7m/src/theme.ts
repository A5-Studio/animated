import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FPS = 30;

// Same neobrutalist palette as push-notification-id.
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

/* ------------------------------------------------------------------ */
/* the numbers (all prices as of early November 2026)                  */
/* ------------------------------------------------------------------ */
export const UANG = 14_700_000_000;

// Beras medium, rata-rata nasional Bapanas per 2 Nov 2026.
export const BERAS_PER_KG = 13_686;
export const BERAS_KG = UANG / BERAS_PER_KG; // ≈ 1.074.090 kg
export const NASI_PER_ORANG = 80; // asumsi konsumsi beras ±80 kg/orang/tahun
export const ORANG_MAKAN = BERAS_KG / NASI_PER_ORANG; // ≈ 13.426 orang

// UKT: tidak ada angka resmi rata-rata nasional; pakai Rp5,2 juta/semester (dikutip Kompas.id).
export const UKT = 5_200_000;
export const SEMESTER = 8;
export const BIAYA_S1 = UKT * SEMESTER; // Rp41,6 juta
export const SARJANA = Math.floor(UANG / BIAYA_S1); // 353 orang

// Pertalite Rp10.000/liter (Pertamina, berlaku sejak 2 Sep 2026).
export const PERTALITE = 10_000;
export const LITER = UANG / PERTALITE; // 1.470.000 liter
export const KM_PER_LITER = 40; // asumsi motor irit
export const KM = LITER * KM_PER_LITER; // 58,8 juta km
export const KELILING_BUMI = 40_075;
export const PUTARAN = Math.floor(KM / KELILING_BUMI); // 1.467 kali

// Scene timeline, in frames at 30fps.
export const SCENES = {
  hook: { from: 0, dur: 150 },
  beras: { from: 150, dur: 420 },
  kuliah: { from: 570, dur: 420 },
  bensin: { from: 990, dur: 420 },
  recap: { from: 1410, dur: 270 },
};
export const TOTAL = 1680;
