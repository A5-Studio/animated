import React from 'react';
import { useCurrentFrame } from 'remotion';
import {
  ActorLabel, AddressTag, At, Background, Bolt, Box, Burst, Captions, Envelope, Header, HouseIcon,
  Phone, PostIcon, Road, ShopIcon, Sticker, Truck, between, ease, lin, pop, qbez,
} from './components';
import { BODY, BORDER, C, HEAD, shadow } from './theme';

const shake = (f: number, a: number, b: number, amp = 6) => (f > a && f < b ? Math.sin(f * 2.2) * amp * (1 - (f - a) / (b - a)) : 0);

/* ================================================================== */
/* 0. Hook                                                             */
/* ================================================================== */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Background color={C.blue} />
      <At x={540} y={300} s={pop(f, 0)} r={-2}>
        <Box bg={C.white} pad="20px 34px" style={{ fontFamily: HEAD, fontSize: 64, lineHeight: 1.08, textAlign: 'center', width: 900 }}>
          Kok HP-mu tahu ada pesan baru…
        </Box>
      </At>
      <At x={560} y={490} s={pop(f, 30)} r={3}>
        <Sticker bg={C.yellow} size={44}>padahal app-nya DITUTUP?!</Sticker>
      </At>
      <At x={540 + shake(f, 22, 50, 10)} y={1010} s={1.2 * pop(f, 4)} r={shake(f, 22, 50, 4)}>
        <Phone notif={pop(f, 22, 200)} />
      </At>
      <At x={850} y={700} s={pop(f, 22, 220)} r={12}>
        <Burst size={240} rot={f * 0.8}>TING!</Burst>
      </At>
      <Captions lines={[{ from: 72, to: 150, text: 'Yuk, bahas pakai *bahasa awam*. Gampang kok!' }]} />
    </>
  );
};

/* ================================================================== */
/* 1. The cast: an analogy everybody knows                             */
/* ================================================================== */
const CAST = [
  { icon: <HouseIcon size={170} />, bg: C.pink, who: 'HP kamu', is: 'RUMAH', note: 'yang nerima surat' },
  { icon: <ShopIcon size={170} />, bg: C.blue, who: 'Aplikasi (TokoKu)', is: 'PENGIRIM', note: 'yang mau kirim kabar' },
  { icon: <PostIcon size={170} />, bg: C.green, who: 'Google (FCM)', is: 'KANTOR POS', note: 'yang ngurus pengiriman' },
];
export const Cast: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Background />
      <Header title={"Anggap aja kayak\nkirim SURAT"} color={C.yellow} />
      {CAST.map((c, i) => {
        const p = pop(f, 20 + i * 35);
        const dir = i % 2 ? 1 : -1;
        return (
          <At key={i} x={540 + dir * 700 * (1 - p)} y={620 + i * 265} r={dir * -1.5}>
            <Box bg={c.bg} pad="18px 28px" style={{ width: 900, display: 'flex', alignItems: 'center', gap: 26 }}>
              <div style={{ flex: 'none', background: C.white, border: `${BORDER}px solid ${C.ink}`, borderRadius: 18, padding: 4 }}>{c.icon}</div>
              <div>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36 }}>{c.who} =</div>
                <div style={{ fontFamily: HEAD, fontSize: 62, lineHeight: 1.05 }}>{c.is}</div>
                <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 30 }}>{c.note}</div>
              </div>
            </Box>
          </At>
        );
      })}
      <Captions lines={[{ from: 135, to: 240, text: 'Cuma ada *3 pemain*. Ingat-ingat ya!' }]} />
    </>
  );
};

/* ================================================================== */
/* 2. Step 1: register, get an address (token)                         */
/* ================================================================== */
const PH = { x: 260, y: 1010 };
export const Step1: React.FC = () => {
  const f = useCurrentFrame();
  const sendP = ease(f, 40, 78);
  const env = qbez({ x: 330, y: 800 }, { x: 480, y: 560 }, { x: 720, y: 660 }, sendP);
  const flyP = ease(f, 165, 200);
  const tag = qbez({ x: 790, y: 1000 }, { x: 560, y: 900 }, { x: 270, y: 1180 }, flyP);
  const postBump = 1 + 0.08 * Math.sin(Math.PI * lin(f, 80, 92));
  return (
    <>
      <Background />
      <Header step={1} title="Minta alamat dulu" color={C.pink} />
      <At x={PH.x} y={680} s={pop(f, 8)}><ActorLabel title="Rumah" sub="HP kamu" bg={C.pink} /></At>
      <At x={PH.x} y={PH.y} s={0.85 * pop(f, 4)} r={-2}>
        <Phone glow={Math.sin(Math.PI * lin(f, 20, 36))} />
      </At>
      <At x={790} y={660} s={pop(f, 10) * postBump}><PostIcon size={240} /></At>
      <At x={790} y={830} s={pop(f, 14)}><ActorLabel title="Kantor Pos" sub="Google FCM" bg={C.green} /></At>
      <At x={env.x} y={env.y} s={0.8} o={between(f, 40, 82, 4)} r={-8 + 16 * sendP}>
        <Envelope w={150} label="DAFTAR" />
      </At>
      <At x={tag.x} y={tag.y} s={(f < 165 ? pop(f, 95) : 1) * (1 - 0.38 * flyP)} r={-6 + 4 * flyP} o={f >= 95 ? 1 : 0}>
        <AddressTag />
      </At>
      <Captions
        lines={[
          { from: 10, to: 145, text: 'Waktu kamu *pertama buka* aplikasinya, HP-mu daftar dulu ke Kantor Pos Google.' },
          { from: 145, to: 300, text: 'Kantor Pos kasih *alamat unik*. Di dunia teknologi, namanya *TOKEN*.' },
        ]}
      />
    </>
  );
};

/* ================================================================== */
/* 3. Step 2: give the address to the shop (your server)               */
/* ================================================================== */
const BOOK = [
  ['Sari', '#k2Lm-77'],
  ['Andi', '#pQ8z-03'],
  ['Budi', '#fGx9-Q2'],
];
export const Step2: React.FC = () => {
  const f = useCurrentFrame();
  const flyP = ease(f, 25, 65);
  const tag = qbez({ x: 270, y: 1180 }, { x: 540, y: 760 }, { x: 790, y: 800 }, flyP);
  const book = pop(f, 70);
  const newRow = pop(f, 82);
  return (
    <>
      <Background />
      <Header step={2} title="Kasih alamat ke toko" color={C.blue} />
      <At x={PH.x} y={680}><ActorLabel title="Rumah" sub="HP kamu" bg={C.pink} /></At>
      <At x={PH.x} y={PH.y} s={0.85} r={-2}><Phone /></At>
      <At x={270} y={1180} s={0.62} r={-2}><AddressTag /></At>
      <At x={790} y={600} s={pop(f, 4)}><ActorLabel title="Toko" sub="server aplikasi" bg={C.blue} /></At>
      <At x={790} y={790} s={pop(f, 0) * (1 + 0.08 * Math.sin(Math.PI * lin(f, 62, 74)))}><ShopIcon size={240} /></At>
      <At x={tag.x} y={tag.y} s={0.62 * (1 - 0.3 * lin(f, 55, 66))} r={-2 + 10 * flyP} o={between(f, 22, 68, 4)}>
        <AddressTag />
      </At>
      <At x={760} y={1110} s={book} r={2}>
        <Box bg={C.white} pad="16px 22px" style={{ width: 400 }}>
          <div style={{ fontFamily: HEAD, fontSize: 28, borderBottom: `4px solid ${C.ink}`, paddingBottom: 8, marginBottom: 6 }}>BUKU ALAMAT</div>
          {BOOK.map(([n, t], i) => {
            const isNew = i === BOOK.length - 1;
            return (
              <div key={n} style={{
                display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontWeight: 700, fontSize: 28, padding: '6px 8px', borderRadius: 8,
                opacity: isNew ? newRow : 0.45, background: isNew ? C.yellow : 'transparent', border: isNew ? `3px solid ${C.ink}` : '3px solid transparent',
                transform: isNew ? `translateX(${(1 - newRow) * 40}px)` : undefined,
              }}>
                <span>{n}</span><span>{t}</span>
              </div>
            );
          })}
        </Box>
      </At>
      <Captions
        lines={[
          { from: 8, to: 110, text: 'Lalu aplikasinya *kasih alamat itu* ke server TokoKu.' },
          { from: 110, to: 240, text: 'TokoKu nyatet di *buku alamat*. Sekarang toko tahu harus kirim ke mana.' },
        ]}
      />
    </>
  );
};

/* ================================================================== */
/* 4. Step 3: the shop hands a letter to the post office (FCM)          */
/* ================================================================== */
export const Step3: React.FC = () => {
  const f = useCurrentFrame();
  const letter = pop(f, 40);
  const letterOut = ease(f, 112, 124);
  const flyP = ease(f, 124, 165);
  const env = qbez({ x: 540, y: 1060 }, { x: 640, y: 1000 }, { x: 820, y: 720 }, flyP);
  return (
    <>
      <Background />
      <Header step={3} title={"Toko titip surat\nke Kantor Pos"} color={C.green} />
      <At x={240} y={700} s={pop(f, 0) * (1 + 0.06 * Math.sin(Math.PI * lin(f, 15, 28)))}><ShopIcon size={220} /></At>
      <At x={240} y={865} s={pop(f, 4)}><ActorLabel title="Toko" sub="server aplikasi" bg={C.blue} /></At>
      <At x={820} y={700} s={pop(f, 2) * (1 + 0.08 * Math.sin(Math.PI * lin(f, 165, 178)))}><PostIcon size={220} /></At>
      <At x={820} y={865} s={pop(f, 6)}><ActorLabel title="Kantor Pos" sub="Google FCM" bg={C.green} /></At>
      <At x={330} y={540} s={pop(f, 15)} r={-4} o={1 - lin(f, 110, 118)}>
        <Box bg={C.yellow} pad="8px 20px" sh={7} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: HEAD, fontSize: 30, whiteSpace: 'nowrap' }}>
          <Bolt size={44} /> Paket Budi dikirim!
        </Box>
      </At>
      {/* the letter, written out */}
      <At x={540} y={1090} s={letter * (1 - 0.7 * letterOut)} o={1 - letterOut} r={-2}>
        <Box bg={C.white} pad="22px 30px" style={{ width: 640, fontSize: 32, lineHeight: 1.4 }}>
          <div style={{ fontFamily: HEAD, fontSize: 30, marginBottom: 6 }}>SURAT</div>
          <div><b>Kepada:</b> <span style={{ background: C.yellow, border: `3px solid ${C.ink}`, borderRadius: 8, padding: '0 8px', fontFamily: HEAD }}>#fGx9-Q2</span></div>
          <div><b>Isi:</b> Paketmu sudah dikirim!</div>
        </Box>
      </At>
      <At x={env.x} y={env.y} s={(f < 124 ? lin(f, 112, 124) : 1) * (1 - 0.35 * flyP)} o={between(f, 112, 170, 4)} r={-6 + 12 * flyP}>
        <Envelope w={170} label="#fGx9-Q2" />
      </At>
      <At x={540} y={1110} s={pop(f, 178, 200)} r={-4}>
        <Box bg={C.red} pad="20px 30px" style={{ fontFamily: HEAD, fontSize: 44, lineHeight: 1.15, textAlign: 'center', width: 760 }}>
          Toko NGGAK kirim langsung ke HP-mu!
        </Box>
      </At>
      <Captions
        lines={[
          { from: 10, to: 125, text: 'Ada kabar baru? TokoKu *nulis surat* + tempel alamatmu…' },
          { from: 125, to: 300, text: '…lalu *titip ke Kantor Pos Google*. Semua surat lewat sana dulu.' },
        ]}
      />
    </>
  );
};

/* ================================================================== */
/* 5. Step 4: the courier delivers over one shared road                 */
/* ================================================================== */
const ROAD = { x1: 690, y1: 760, x2: 400, y2: 930 };
const onRoad = (p: number) => ({ x: ROAD.x1 + (ROAD.x2 - ROAD.x1) * p, y: ROAD.y1 + (ROAD.y2 - ROAD.y1) * p });
export const Step4: React.FC = () => {
  const f = useCurrentFrame();
  const road = ease(f, 10, 40);
  const off = lin(f, 155, 165) * (1 - lin(f, 228, 238));
  const truckP = ease(f, 245, 290);
  const truck = onRoad(truckP);
  const others = [
    { c: C.blue, a: 50, back: false },
    { c: C.green, a: 80, back: true },
    { c: C.pink, a: 110, back: false },
  ];
  return (
    <>
      <Background />
      <Header step={4} title="Kurir antar ke HP" color={C.purple} />
      <Road {...ROAD} progress={road} width={34} dashed={false} color={off > 0.5 ? C.red : C.ink} />
      <Road {...ROAD} progress={road} width={8} color={C.yellow} />
      <At x={790} y={630} s={pop(f, 0)}><PostIcon size={220} /></At>
      <At x={790} y={800}><ActorLabel title="Kantor Pos" sub="Google FCM" bg={C.green} /></At>
      <At x={290} y={720}><ActorLabel title="Rumah" sub="HP kamu" bg={C.pink} /></At>
      <At x={290} y={1040} s={0.8} r={-2}>
        <Phone offline={off} glow={Math.sin(Math.PI * lin(f, 288, 305))} />
      </At>
      <At x={760} y={1020} s={pop(f, 40)} r={3} o={1 - lin(f, 150, 158)}>
        <Box bg={C.green} pad="12px 22px" sh={8} style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: HEAD, fontSize: 34 }}>1 JALUR KHUSUS</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24 }}>Google Play services</div>
        </Box>
      </At>
      {/* other apps' letters share the same road */}
      {others.map((o, i) => {
        const p = lin(f, o.a, o.a + 40);
        const pt = onRoad(o.back ? 1 - p : p);
        return (
          <At key={i} x={pt.x} y={pt.y - 30} s={0.45} o={p > 0 && p < 1 ? 1 : 0}>
            <Envelope w={150} bg={o.c} />
          </At>
        );
      })}
      {/* roadblock while offline */}
      <At x={(ROAD.x1 + ROAD.x2) / 2} y={(ROAD.y1 + ROAD.y2) / 2} s={pop(f, 158) * (1 - lin(f, 228, 236))} o={f > 156 && f < 238 ? 1 : 0} r={-30}>
        <div style={{ width: 200, height: 44, border: `${BORDER}px solid ${C.ink}`, borderRadius: 10, boxShadow: shadow(6), background: `repeating-linear-gradient(45deg, ${C.red} 0 22px, ${C.white} 22px 44px)` }} />
      </At>
      {/* our letter waits at the post office */}
      <At x={820} y={900} s={pop(f, 172)} o={f > 170 && f < 246 ? 1 : 0} r={-4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Envelope w={130} label="TokoKu" />
          <Sticker bg={C.yellow} size={30}>Nunggu…</Sticker>
        </div>
      </At>
      {/* the courier */}
      <At x={truck.x} y={truck.y - 40} s={0.8 * pop(f, 240)} o={f > 240 && f < 296 ? 1 : 0}>
        <div style={{ transform: 'scaleX(-1)' }}><Truck w={200} wheel={f * 18} /></div>
      </At>
      <Captions
        lines={[
          { from: 8, to: 152, text: 'HP Android punya *1 jalur khusus* ke Kantor Pos. Dipakai bareng semua aplikasi, jadi *hemat baterai*.' },
          { from: 152, to: 330, text: 'HP lagi *offline*? Suratnya ditahan dulu, lalu diantar begitu HP *online lagi*.' },
        ]}
      />
    </>
  );
};

/* ================================================================== */
/* 6. Step 5: TING!                                                     */
/* ================================================================== */
export const Step5: React.FC = () => {
  const f = useCurrentFrame();
  const dialog = lin(f, 95, 105) * (1 - lin(f, 168, 176));
  const press = Math.sin(Math.PI * lin(f, 148, 160));
  return (
    <>
      <Background color={C.yellow} />
      <Header step={5} title="TING! Notif muncul" color={C.green} />
      <At x={540 + shake(f, 10, 40, 12)} y={1010} s={1.15 * pop(f, 0)} r={shake(f, 10, 40, 4)}>
        <Phone notif={pop(f, 10, 200)} dialog={dialog} press={press} />
      </At>
      <At x={860} y={700} s={pop(f, 10, 220) * (1 - lin(f, 88, 96))} r={10}>
        <Burst size={260} color={C.pink} rot={f}>TING!</Burst>
      </At>
      <At x={845} y={1120} s={pop(f, 108)} r={6} o={1 - lin(f, 200, 210)}>
        <Sticker bg={C.purple} size={28}>Android 13+</Sticker>
      </At>
      <Captions
        lines={[
          { from: 5, to: 95, text: 'Android langsung *munculin notifikasinya*. TING!' },
          { from: 95, to: 210, text: 'Asal kamu sudah klik *Izinkan*. Kalau ditolak, notif nggak bakal muncul.' },
        ]}
      />
    </>
  );
};

/* ================================================================== */
/* 7. Recap                                                             */
/* ================================================================== */
const RECAP = [
  { bg: C.pink, t: 'HP daftar, dapat *alamat (token)*' },
  { bg: C.blue, t: 'Alamat dikasih ke *toko (server)*' },
  { bg: C.green, t: 'Toko titip surat ke *Kantor Pos (FCM)*' },
  { bg: C.purple, t: 'Kurir antar lewat *1 jalur khusus*' },
  { bg: C.yellow, t: '*TING!* Notif muncul di HP' },
];
export const Recap: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Background color={C.pink} />
      <Header title="Jadi, intinya:" color={C.yellow} />
      {RECAP.map((r, i) => {
        const p = pop(f, 12 + i * 14);
        return (
          <At key={i} x={540 + (1 - p) * (i % 2 ? 600 : -600)} y={540 + i * 150} r={i % 2 ? 1 : -1}>
            <Box bg={C.white} pad="14px 22px" sh={10} style={{ width: 880, display: 'flex', alignItems: 'center', gap: 22 }}>
              <div style={{ flex: 'none', width: 76, height: 76, borderRadius: '50%', background: r.bg, border: `${BORDER}px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 38 }}>
                {i + 1}
              </div>
              <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38, lineHeight: 1.2 }}>
                {r.t.split('*').map((s, j) => (j % 2 ? <span key={j} style={{ fontFamily: HEAD, fontWeight: 400 }}>{s}</span> : s))}
              </div>
            </Box>
          </At>
        );
      })}
      <Captions lines={[{ from: 100, to: 245, text: '*Simpan* & kirim ke temanmu yang masih bingung! Follow buat penjelasan teknologi ala awam.' }]} />
    </>
  );
};
