/* Static infographic (1080×1350, Instagram feed). Same numbers and style as the video. */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Box, Sticker, rp } from './components';
import {
  BODY, BORDER, C, DOMPET, EVEREST_M, HARGA, HEAD, JENIS, KALI_TERJUAL, LARIS, LARIS_HARGA, LARIS_JENIS, LARIS_RANK,
  LARIS_TERJUAL, PRODUK, SISA, TAHUN_GANTI, TAS, TERJUAL, TINGGI_M, TINGGI_TAS_CM, shadow,
} from './theme';

const Logo: React.FC<{ size: number }> = ({ size }) => (
  <Img
    src={staticFile('wallts-logo.png')}
    style={{ width: size, height: size, display: 'block', flex: 'none', borderRadius: size * 0.22, border: `${Math.max(3, size * 0.05)}px solid ${C.ink}`, boxShadow: shadow(5), boxSizing: 'border-box' }}
  />
);

const Mark: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = C.yellow }) => (
  <span style={{ background: bg, border: `3px solid ${C.ink}`, borderRadius: 8, padding: '0 8px' }}>{children}</span>
);

const ProductRow: React.FC<{
  tag: string; tagBg: string; img: string; name: string; price: number; note: string; big: string; unit: string; sub: string; bg: string; flip?: boolean;
}> = ({ tag, tagBg, img, name, price, note, big, unit, sub, bg, flip }) => (
  <div style={{ position: 'relative', display: 'flex', flexDirection: flip ? 'row-reverse' : 'row', gap: 22, alignItems: 'stretch' }}>
    <Box bg={C.white} pad="12px 12px 14px" style={{ width: 470, flex: 'none' }}>
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 12 }}>
        <Img src={staticFile(img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24, marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo size={34} />
        {name}
      </div>
      <div style={{ fontFamily: HEAD, fontSize: 50, lineHeight: 1.05, color: C.red, WebkitTextStroke: `2px ${C.ink}` }}>Rp{rp(price)}</div>
      <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 17 }}>{note}</div>
    </Box>
    <Box bg={bg} pad="20px 22px" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 26 }}>Rp14,7 M ÷ Rp{rp(price)} =</div>
      <div style={{ fontFamily: HEAD, fontSize: 80, lineHeight: 1.05, marginTop: 6 }}>{big}</div>
      <div style={{ fontFamily: HEAD, fontSize: 40 }}>{unit}</div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 22, marginTop: 10, lineHeight: 1.3 }}>{sub}</div>
    </Box>
    <div style={{ position: 'absolute', top: -26, [flip ? 'right' : 'left']: 24, transform: `rotate(${flip ? 3 : -3}deg)` }}>
      <Sticker bg={tagBg} size={26} style={tagBg === C.red ? { color: C.white } : undefined}>{tag}</Sticker>
    </div>
  </div>
);

const Fact: React.FC<{ bg: string; big: string; small: string }> = ({ bg, big, small }) => (
  <Box bg={bg} pad="14px 14px" style={{ flex: 1, textAlign: 'center' }}>
    <div style={{ fontFamily: HEAD, fontSize: 46, lineHeight: 1 }}>{big}</div>
    <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 20, marginTop: 8, lineHeight: 1.25, whiteSpace: 'pre-line' }}>{small}</div>
  </Box>
);

export const Infographic: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.bg, padding: '40px 52px 36px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 34,
      backgroundImage: `linear-gradient(${C.ink}12 3px, transparent 3px), linear-gradient(90deg, ${C.ink}12 3px, transparent 3px)`,
      backgroundSize: '90px 90px',
    }}
  >
    {/* title */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <Logo size={110} />
      <div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30 }}>Kalau punya uang</div>
        <div style={{ fontFamily: HEAD, fontSize: 58, lineHeight: 1.2, margin: '4px 0' }}>
          <Mark>Rp14.700.000.000</Mark>
        </div>
        <div style={{ fontFamily: HEAD, fontSize: 34, marginTop: 8 }}>bisa borong berapa produk Wallts?</div>
      </div>
    </div>

    <ProductRow
      tag="✓ Termahal" tagBg={C.red} img="teva-3.png" name={`${PRODUK} · ${JENIS}`} price={HARGA}
      note={`harga dengan voucher · ${TERJUAL} terjual`} big={rp(TAS)} unit="tas" sub={`kembalian Rp${rp(SISA)}`} bg={C.yellow}
    />
    <ProductRow
      tag="★ Terlaris · 10RB+ terjual" tagBg={C.yellow} img="brock.png" name={`${LARIS} · ${LARIS_JENIS}`} price={LARIS_HARGA}
      note={`harga dengan voucher · ${LARIS_RANK}`} big={rp(DOMPET)} unit="dompet" sub={`±${Math.floor(DOMPET / LARIS_TERJUAL)}× semua yang pernah terjual`} bg={C.orange} flip
    />

    {/* fun facts about the Teva haul */}
    <div>
      <div style={{ fontFamily: HEAD, fontSize: 30, marginBottom: 12 }}>Biar kebayang, {rp(TAS)} tas Teva itu…</div>
      <div style={{ display: 'flex', gap: 18 }}>
        <Fact bg={C.blue} big={`${(TINGGI_M / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} km`} small={'kalau ditumpuk\n≈ 2× Gunung Everest'} />
        <Fact bg={C.green} big={`${TAHUN_GANTI} thn`} small={'ganti tas baru\ntiap hari'} />
        <Fact bg={C.pink} big={`${KALI_TERJUAL}×`} small={`lipat dari yang\nsudah terjual (${TERJUAL})`} />
      </div>
    </div>

    <div style={{ marginTop: 'auto', fontFamily: BODY, fontWeight: 500, fontSize: 16, lineHeight: 1.35, background: C.white, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '8px 14px' }}>
      Harga dengan voucher di Shopee Mall Wallts, 10 Nov 2026. Asumsi tinggi 1 tas ±{TINGGI_TAS_CM} cm; Everest {rp(EVEREST_M)} m.
      Terjual = angka yang tampil di halaman produk.
    </div>
  </AbsoluteFill>
);
