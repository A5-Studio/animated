// Faqihpedia segment identities. Visual guide: brand/segment-kit.html.
// Every segment keeps the master neobrutalist system (cream bg, ink borders,
// hard shadows, Archivo Black + Space Grotesk) and adds one lead color,
// one motif and one episode-number format.

export const MASTER = {
  bg: '#FFF1C9',
  ink: '#111111',
  white: '#FFFFFF',
  yellow: '#FFD600',
};

export const SEGMENTS = {
  trims: {
    name: 'TRIMS',
    full: 'Trivia Makan Siang',
    tagline: 'Lauk obrolan buat jam makan siang.',
    lead: '#FF8A3D', // sambal orange
    accent: '#FFD600', // egg yolk
    surface: '#FFF6E8', // rice
    motif: 'plate with "?", fork + spoon; orange gingham tablecloth',
    episode: (n: number) => `MENU #${String(n).padStart(3, '0')}`,
    open: 'Bahan obrolan makan siang hari ini…',
    close: 'Trims udah makan siang bareng. Besok lauk baru.',
    sfx: 'spoon "ting" on a plate',
  },
  nolKm: {
    name: 'Marketing 0 KM',
    full: 'Digital marketing dari titik nol',
    tagline: 'Satu istilah, satu kilometer.',
    lead: '#FF5A5A', // kilometer-post red
    accent: '#5AC8FF', // road-sign blue
    surface: '#3A3A3A', // asphalt
    motif: 'white kilometer post with red cap; dashed road marking; blue sign cards for terms',
    episode: (n: number) => `KM ${String(n).padStart(2, '0')}`,
    open: 'Marketing 0 KM, kilometer [n].',
    close: 'Udah satu kilo. Sampai ketemu di KM berikutnya.',
    sfx: 'turn-signal tick-tock between points',
  },
  gym: {
    name: 'Spreadsheet Gym',
    full: 'Latihan studi kasus Google Sheets',
    tagline: 'Latihan rumus, bukan hafalan.',
    lead: '#7CF29A', // Sheets green
    accent: '#5AC8FF', // 20 kg plate blue
    surface: '#F2FFF5', // sheet
    formula: '#157A3A',
    motif: 'barbell with cell-grid plates and an "fx" bar; cell grid bg; formula bar on top',
    // Difficulty follows real weightlifting plate colors.
    levels: {
      5: { label: '5 KG', meaning: 'dasar', color: '#FFFFFF' },
      10: { label: '10 KG', meaning: 'menengah', color: '#7CF29A' },
      20: { label: '20 KG', meaning: 'berat', color: '#5AC8FF' },
    },
    episode: (n: number, kg: 5 | 10 | 20) => `SESI ${String(n).padStart(2, '0')} · ${kg} KG`,
    open: 'Spreadsheet Gym, sesi [n]. Beban hari ini: [kg] kilo.',
    close: 'Pendinginan: kerjain repetisinya, jawab di komentar.',
    sfx: 'coach whistle at start; 10s countdown for "pause dulu"',
  },
} as const;
