import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BODY, C, HEAD } from './theme';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 0→1 with a little overshoot, starting at frame `at`. */
const usePop = (at: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping: 12, stiffness: 180 } });
};

/** Slides up and fades in at frame `at`. */
const Rise: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number }> = ({ at, children, style, dist = 60 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * dist}px)`, ...style }}>{children}</div>;
};

/** Pops in with scale and rotation at frame `at`. */
const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; rot?: number }> = ({ at, children, style, rot = 0 }) => {
  const p = usePop(at);
  return <div style={{ transform: `scale(${p}) rotate(${rot * p}deg)`, opacity: p > 0.01 ? 1 : 0, ...style }}>{children}</div>;
};

/** Text typed out one character per frame-step. */
const Type: React.FC<{ at: number; text: string; speed?: number }> = ({ at, text, speed = 1.5 }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) / speed)));
  const caret = f >= at && Math.floor(f / 8) % 2 === 0;
  return (
    <span>
      {text.slice(0, n)}
      <span style={{ opacity: caret ? 1 : 0 }}>|</span>
    </span>
  );
};

const Kicker: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, letterSpacing: 6, textTransform: 'uppercase', color: dark ? C.grey : C.grey }}>
    {children}
  </div>
);

const Page: React.FC<{ dark?: boolean; children: React.ReactNode; justify?: 'center' | 'flex-start' }> = ({ dark, children, justify = 'center' }) => (
  <AbsoluteFill
    style={{
      background: dark ? C.ink : C.paper,
      color: dark ? C.paper : C.ink,
      padding: '170px 90px 210px',
      justifyContent: justify,
      fontFamily: BODY,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- hook */

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const stamp = usePop(30);
  const shake = f >= 30 && f < 40 ? Math.sin(f * 3) * 10 : 0;
  return (
    <Page dark>
      <div style={{ transform: `translateX(${shake}px)` }}>
        <Rise at={0} dist={30}>
          <div style={{ fontFamily: HEAD, fontSize: 100, lineHeight: 1.05 }}>Akun Claude Pro</div>
        </Rise>
        <Pop at={8}>
          <div style={{ fontFamily: HEAD, fontSize: 170, lineHeight: 1, marginTop: 20, whiteSpace: 'nowrap' }}>Rp25 ribu?</div>
        </Pop>
        <div
          style={{
            marginTop: 90,
            display: 'inline-block',
            background: C.paper,
            color: C.ink,
            fontFamily: HEAD,
            fontSize: 120,
            padding: '20px 44px',
            transform: `scale(${interpolate(stamp, [0, 1], [2.4, 1])}) rotate(-6deg)`,
            opacity: f >= 30 ? 1 : 0,
          }}
        >
          JANGAN.
        </div>
        <Rise at={50}>
          <div style={{ fontSize: 50, marginTop: 70, color: C.grey, fontWeight: 500 }}>Itu bukan murah. Itu jebakan.</div>
        </Rise>
      </div>
    </Page>
  );
};

/* ---------------------------------------------------------------- the Threads post */

export const Post: React.FC = () => {
  const f = useCurrentFrame();
  const W = 900;
  const scale = W / 1170;
  const card = usePop(4);
  // the "54" reply count sits at about (440, 218) in the 1170px-wide crop
  const ring = interpolate(f, [40, 58], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const R = 2 * Math.PI * 70;
  return (
    <Page>
      <Rise at={0}>
        <Kicker>Dari Threads hari ini</Kicker>
      </Rise>
      <div
        style={{
          marginTop: 40,
          width: W + 16,
          border: `8px solid ${C.ink}`,
          borderRadius: 36,
          overflow: 'visible',
          background: C.paper,
          position: 'relative',
          transform: `scale(${card}) rotate(${-2 * card}deg)`,
          boxShadow: `18px 18px 0 ${C.ink}`,
        }}
      >
        <div style={{ borderRadius: 28, overflow: 'hidden' }}>
          <Img src={staticFile('post.png')} style={{ width: W, display: 'block', filter: 'grayscale(1)' }} />
        </div>
        <svg width={220} height={180} style={{ position: 'absolute', left: 440 * scale - 110 + 8, top: 218 * scale - 90 + 8, overflow: 'visible' }}>
          <ellipse
            cx={110}
            cy={90}
            rx={100}
            ry={50}
            fill="none"
            stroke={C.ink}
            strokeWidth={8}
            strokeDasharray={R * 1.2}
            strokeDashoffset={R * 1.2 * (1 - ring)}
            transform="rotate(-8 110 90)"
          />
        </svg>
      </div>
      <Rise at={56}>
        <div style={{ fontFamily: HEAD, fontSize: 92, marginTop: 110, lineHeight: 1.05 }}>54 balasan.</div>
      </Rise>
      <Rise at={84}>
        <div style={{ fontSize: 58, marginTop: 24, fontWeight: 500 }}>Padahal jawaban yang aman cuma satu:</div>
      </Rise>
      <Pop at={112} rot={-2}>
        <div style={{ display: 'inline-block', marginTop: 40, background: C.ink, color: C.paper, fontFamily: HEAD, fontSize: 70, padding: '22px 36px' }}>
          Beli di platform resminya.
        </div>
      </Pop>
    </Page>
  );
};

/* ---------------------------------------------------------------- what people get offered */

const OFFERS = [
  ['Claude Pro SHARING 1 bulan', 'Rp25.000'],
  ['Akun PRIVATE murah, "dijamin aman"', 'Rp60.000'],
  ['Patungan 1 akun, ber-5', 'Rp15.000/org'],
];

export const Offers: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Page>
      <Rise at={0}>
        <div style={{ fontFamily: HEAD, fontSize: 80, lineHeight: 1.08 }}>Tapi yang sering ditawarin di DM malah ini:</div>
      </Rise>
      <div style={{ marginTop: 70, display: 'flex', flexDirection: 'column', gap: 36 }}>
        {OFFERS.map(([name, price], i) => {
          const cut = interpolate(f, [80 + i * 8, 92 + i * 8], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <Pop key={i} at={18 + i * 12} rot={i % 2 ? 1 : -1}>
              <div style={{ position: 'relative', border: `6px solid ${C.ink}`, borderRadius: 24, padding: '30px 36px', background: C.paper, boxShadow: `12px 12px 0 ${C.ink}` }}>
                <div style={{ fontSize: 46, fontWeight: 700 }}>{name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, alignItems: 'center' }}>
                  <div style={{ fontFamily: HEAD, fontSize: 64 }}>{price}</div>
                  <div style={{ fontSize: 34, border: `3px solid ${C.ink}`, borderRadius: 40, padding: '6px 20px', fontWeight: 600 }}>Chat penjual</div>
                </div>
                <div style={{ position: 'absolute', left: -20, top: '50%', height: 14, width: `${cut * 1.05}%`, background: C.ink, transform: 'rotate(-4deg)' }} />
              </div>
            </Pop>
          );
        })}
      </div>
      <Pop at={110} rot={-4} style={{ marginTop: 70, alignSelf: 'flex-start' }}>
        <div style={{ background: C.ink, color: C.paper, fontFamily: HEAD, fontSize: 64, padding: '16px 34px' }}>Ini risikonya ↓</div>
      </Pop>
    </Page>
  );
};

/* ---------------------------------------------------------------- the three risks */

const Risk: React.FC<{ n: string; title: string; body: string; children: React.ReactNode }> = ({ n, title, body, children }) => (
  <Page dark>
    <Rise at={0}>
      <div style={{ fontFamily: HEAD, fontSize: 200, lineHeight: 1, color: 'transparent', WebkitTextStroke: `4px ${C.paper}` }}>{n}</div>
    </Rise>
    <Rise at={8}>
      <div style={{ fontFamily: HEAD, fontSize: 88, lineHeight: 1.05, marginTop: 20 }}>{title}</div>
    </Rise>
    <Rise at={22}>
      <div style={{ fontSize: 46, lineHeight: 1.35, marginTop: 34, color: '#CFCFCF', fontWeight: 400 }}>{body}</div>
    </Rise>
    <div style={{ marginTop: 70 }}>{children}</div>
  </Page>
);

export const Risk1: React.FC = () => {
  const f = useCurrentFrame();
  const hit = f >= 85;
  const stamp = usePop(85);
  const shake = f >= 85 && f < 95 ? Math.sin(f * 3) * 12 : 0;
  return (
    <Risk n="01" title="Akunnya bisa di-banned kapan aja." body="Jual-beli & sharing akun melanggar aturan pemakaian. Ketahuan sekali, akun ditutup. Uang hangus, semua chat hilang.">
      <Pop at={40}>
        <div style={{ position: 'relative', transform: `translateX(${shake}px)`, border: `5px solid ${C.paper}`, borderRadius: 28, padding: '36px 40px' }}>
          <div style={{ fontSize: 36, color: C.grey }}>Akun</div>
          <div style={{ fontSize: 46, fontWeight: 700, marginTop: 6 }}>sharing.prem07@…</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 26, fontSize: 42, fontWeight: 600 }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: hit ? 'transparent' : C.paper, border: `4px solid ${C.paper}` }} />
            {hit ? 'Tidak aktif' : 'Aktif'}
          </div>
          <div
            style={{
              position: 'absolute',
              right: 20,
              top: 40,
              border: `8px solid ${C.paper}`,
              background: C.ink,
              fontFamily: HEAD,
              fontSize: 64,
              padding: '10px 24px',
              transform: `scale(${interpolate(stamp, [0, 1], [2.5, 1])}) rotate(-10deg)`,
              opacity: hit ? 1 : 0,
            }}
          >
            DITUTUP
          </div>
        </div>
      </Pop>
    </Risk>
  );
};

const Eye: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 40 24">
    <path d="M2 12 Q20 -6 38 12 Q20 30 2 12 Z" fill="none" stroke={C.ink} strokeWidth={3.5} />
    <circle cx={20} cy={12} r={5.5} fill={C.ink} />
  </svg>
);

const CHATS = ['Revisi CV + gaji yang aku minta', 'Data laporan keuangan kantor', 'Draft surat resign', 'Curhat soal atasan'];

export const Risk2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Risk n="02" title="Chat kamu bisa dibaca orang lain." body="Satu akun dipakai rame-rame = riwayat chat kamu kelihatan semua. Penjualnya juga pegang password-nya.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {CHATS.map((c, i) => {
          const seen = Math.min(5, Math.max(0, Math.floor((f - 70 - i * 6) / 5)));
          return (
            <Rise key={i} at={40 + i * 7} dist={30}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.paper, color: C.ink, borderRadius: 20, padding: '24px 30px' }}>
                <div style={{ fontSize: 40, fontWeight: 600 }}>{c}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 36, fontWeight: 700, opacity: seen > 0 ? 1 : 0 }}>
                  <Eye />
                  {seen}
                </div>
              </div>
            </Rise>
          );
        })}
      </div>
    </Risk>
  );
};

const RECEIPT: [string, string][] = [
  ['Refund resmi', 'TIDAK ADA'],
  ['Support resmi', 'TIDAK ADA'],
  ['Asal pembayaran', '???'],
  ['Umur akun', 'Untung-untungan'],
];

export const Risk3: React.FC = () => (
  <Risk n="03" title="Nggak ada jaminan apa-apa." body="Asal pembayarannya nggak jelas, kadang dari kartu curian. Akun mati di tengah jalan? Nggak ada yang bisa kamu komplain.">
    <Pop at={40} rot={-1.5}>
      <div style={{ background: C.paper, color: C.ink, padding: '34px 44px', borderRadius: 8, fontFamily: '"DejaVu Sans Mono", monospace' }}>
        <div style={{ fontFamily: HEAD, fontSize: 44, textAlign: 'center', paddingBottom: 18, borderBottom: `4px dashed ${C.ink}` }}>STRUK AKUN MURAH</div>
        {RECEIPT.map(([k, v], i) => (
          <Rise key={k} at={55 + i * 10} dist={20}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 38, marginTop: 20, fontFamily: BODY, fontWeight: 600 }}>
              <span>{k}</span>
              <span style={{ fontWeight: 800 }}>{v}</span>
            </div>
          </Rise>
        ))}
      </div>
    </Pop>
  </Risk>
);

/* ---------------------------------------------------------------- the official way */

const STEPS = [
  ['Buka claude.ai', 'atau app Claude resmi di App Store / Google Play'],
  ['Login pakai email kamu sendiri', 'akun atas nama kamu, bukan punya orang'],
  ['Klik Upgrade → pilih Pro', 'harga & tagihan jelas dari awal'],
  ['Bayar pakai kartu / metode bayar kamu', 'bisa berhenti langganan kapan aja'],
];

export const Official: React.FC = () => {
  const f = useCurrentFrame();
  const press = f >= 66 && f < 76 ? 0.94 : 1;
  return (
    <Page justify="flex-start">
      <Rise at={0}>
        <Kicker>Cara yang aman</Kicker>
      </Rise>
      <Rise at={6}>
        <div style={{ fontFamily: HEAD, fontSize: 92, lineHeight: 1.05, marginTop: 14 }}>Beli langsung di sumbernya.</div>
      </Rise>
      {/* a plain browser window, no logos */}
      <Pop at={16}>
        <div style={{ marginTop: 50, border: `6px solid ${C.ink}`, borderRadius: 26, overflow: 'hidden', boxShadow: `14px 14px 0 ${C.ink}` }}>
          <div style={{ background: C.ink, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 20, height: 20, borderRadius: 10, border: `3px solid ${C.paper}` }} />
            ))}
            <div style={{ flex: 1, marginLeft: 14, background: C.paper, borderRadius: 30, padding: '10px 26px', fontSize: 38, fontWeight: 700 }}>
              <Type at={26} text="claude.ai" speed={2} />
            </div>
          </div>
          <div style={{ padding: '34px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.paper }}>
            <div style={{ fontSize: 40, fontWeight: 600 }}>Paket kamu: Free</div>
            <div
              style={{
                background: f >= 66 ? C.ink : C.paper,
                color: f >= 66 ? C.paper : C.ink,
                border: `4px solid ${C.ink}`,
                borderRadius: 18,
                padding: '14px 30px',
                fontSize: 40,
                fontWeight: 700,
                transform: `scale(${press})`,
              }}
            >
              Upgrade
            </div>
          </div>
        </div>
      </Pop>
      <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 30 }}>
        {STEPS.map(([t, s], i) => (
          <Rise key={i} at={90 + i * 26} dist={40}>
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 76px', height: 76, borderRadius: 38, background: C.ink, color: C.paper, fontFamily: HEAD, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.15 }}>{t}</div>
                <div style={{ fontSize: 34, color: '#555', marginTop: 6 }}>{s}</div>
              </div>
            </div>
          </Rise>
        ))}
      </div>
    </Page>
  );
};

/* ---------------------------------------------------------------- applies to every AI */

const SITES = [
  ['ChatGPT', 'chatgpt.com'],
  ['Gemini', 'gemini.google.com'],
  ['Claude', 'claude.ai'],
];

export const Rule: React.FC = () => (
  <Page>
    <Rise at={0}>
      <div style={{ fontFamily: HEAD, fontSize: 92, lineHeight: 1.05 }}>Berlaku buat semua AI.</div>
    </Rise>
    <div style={{ marginTop: 70, display: 'flex', flexDirection: 'column', gap: 26 }}>
      {SITES.map(([n, u], i) => (
        <Pop key={n} at={18 + i * 10}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `5px solid ${C.ink}`, paddingBottom: 22 }}>
            <div style={{ fontSize: 56, fontWeight: 700 }}>{n}</div>
            <div style={{ fontSize: 46, fontWeight: 500, background: C.ink, color: C.paper, padding: '8px 22px', borderRadius: 12 }}>{u}</div>
          </div>
        </Pop>
      ))}
    </div>
    <Rise at={70}>
      <div style={{ fontSize: 58, fontWeight: 600, marginTop: 90, lineHeight: 1.25 }}>
        Cek URL-nya. Bayar di situ.
        <br />
        <span style={{ fontFamily: HEAD, fontSize: 76 }}>Bukan di DM.</span>
      </div>
    </Rise>
  </Page>
);

/* ---------------------------------------------------------------- outro */

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const bar = interpolate(f, [30, 50], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Page dark>
      <Rise at={0}>
        <div style={{ fontFamily: HEAD, fontSize: 112, lineHeight: 1.05, color: C.grey }}>Murah di depan,</div>
      </Rise>
      <Rise at={18}>
        <div style={{ fontFamily: HEAD, fontSize: 124, lineHeight: 1.05, marginTop: 10 }}>mahal di belakang.</div>
      </Rise>
      <div style={{ height: 10, width: `${bar}%`, background: C.paper, marginTop: 60 }} />
      <Rise at={60}>
        <div style={{ fontSize: 52, marginTop: 60, lineHeight: 1.35, fontWeight: 500 }}>
          Kirim ini ke teman yang lagi nyari
          <br />
          <span style={{ fontWeight: 700 }}>"akun AI murah"</span>.
        </div>
      </Rise>
    </Page>
  );
};
