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
/* the numbers                                                          */
/* ------------------------------------------------------------------ */
export const UANG = 14_700_000_000;

// Produk Wallts termahal di Shopee (Wallts Mall), screenshot 10 Nov 2026.
export const PRODUK = 'Wallts Teva';
export const JENIS = 'Travel Backpack';
export const HARGA = 373_350; // harga dengan voucher
export const TERJUAL = 74; // "74 Terjual" di halaman produk

export const TAS = Math.floor(UANG / HARGA); // 39.373 tas
export const SISA = UANG - TAS * HARGA; // Rp90.450

export const TINGGI_TAS_CM = 45; // asumsi tinggi 1 ransel
export const TINGGI_M = (TAS * TINGGI_TAS_CM) / 100; // ≈ 17.718 m
export const EVEREST_M = 8_849;
export const KALI_TERJUAL = Math.floor(TAS / TERJUAL); // 532×
export const TAHUN_GANTI = Math.floor(TAS / 365); // tas baru tiap hari: 107 tahun

// Produk terlaris: Wallts BROCK, dompet lipat pria (Shopee Mall, screenshot 10 Nov 2026).
export const LARIS = 'Wallts BROCK';
export const LARIS_JENIS = 'Dompet Lipat Pria';
export const LARIS_HARGA = 144_704; // harga dengan voucher
export const LARIS_TERJUAL = 10_000; // "10RB+ Terjual"
export const LARIS_RANK = 'No. 5 terlaris di dompet cowok bifold';
export const DOMPET = Math.floor(UANG / LARIS_HARGA); // 101.586 dompet
export const DOMPET_SISA = UANG - DOMPET * LARIS_HARGA; // Rp99.456

// Scene timeline, in frames at 30fps (1920×1080).
export const SCENES = {
  hook: { from: 0, dur: 150 },
  produk: { from: 150, dur: 330 },
  tumpuk: { from: 480, dur: 300 },
  fakta: { from: 780, dur: 300 },
  laris: { from: 1080, dur: 330 },
  recap: { from: 1410, dur: 240 },
};
export const TOTAL = 1650;
