import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { At, Box, Sticker } from './components';
import { Barbell } from './scenes';
import { BORDER, BODY, C, EPISODE_LABEL, HEAD, shadow } from './theme';

/*
 * Cover for TikTok, IG Reels and the IG feed.
 *
 * Safe area (same as faqihpedia-askmaps/src/Thumbnail.tsx): label, title and
 * key visual stay inside the shared safe box x 120-960, y 285-1250. Outside it
 * there is only decoration, because TikTok's UI covers the top 240, the bottom
 * 670 and the right 120 px, and IG crops to 3:4 (grid) and 4:5 (feed).
 *
 * Inside the box it follows the TRIMS cover rules (trims-eps2-claude):
 * segment label + logo tilted -2°, a short title on white/yellow marks,
 * a tilted card on the edge of a real video frame, and the black series strip.
 * No face in this segment. The frame is the warm-up question (18.1 s: both
 * formulas, "Formula?" / "Function?"), so the cover never gives the answer away.
 */
export const SAFE = { x: 120, y: 285, w: 840, h: 965 };

const mark: React.CSSProperties = {
  background: C.white, boxShadow: `inset 0 0 0 6px ${C.ink}`, borderRadius: 14, padding: '0 16px',
  boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
};

// key visual: the sheet + question stickers of the warm-up frame (source y 690-1475, x 40-1040)
const PANEL = { x: SAFE.x, y: 660, w: SAFE.w, h: SAFE.y + SAFE.h - 660 };
const SRC = { x: 40, y: 690, w: 1000, h: 785 };
const K = Math.min((PANEL.w - 40) / SRC.w, (PANEL.h - 20) / SRC.h);

/** spreadsheet motif: header row with column letters, row numbers, cell grid (decoration) */
const SheetMotif: React.FC = () => {
  const colW = 180;
  const rowH = 72;
  const headH = 56;
  const numW = 70;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: C.bg,
          backgroundImage: 'linear-gradient(90deg, rgba(17,17,17,.2) 3px, transparent 3px), linear-gradient(rgba(17,17,17,.2) 3px, transparent 3px)',
          backgroundSize: `${colW}px ${rowH}px`,
          backgroundPosition: `${numW}px ${headH}px`,
        }}
      />
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: headH, background: C.green, borderBottom: `4px solid ${C.ink}` }} />
      {'ABCDEF'.split('').map((l, i) => (
        <div key={l} style={{ position: 'absolute', left: numW + i * colW, top: 0, width: colW, height: headH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 30, borderRight: `3px solid ${C.ink}55` }}>
          {l}
        </div>
      ))}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: numW, background: C.green, borderRight: `4px solid ${C.ink}` }} />
      {Array.from({ length: 26 }, (_, r) => (
        <div key={r} style={{ position: 'absolute', left: 0, top: headH + r * rowH, width: numW, height: rowH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 28, borderBottom: `3px solid ${C.ink}55` }}>
          {r + 1}
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** overlays for checking the layout: platform UI (red), IG crops (blue 3:4, green 4:5), safe box (orange) */
const Guides: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 240, background: 'rgba(255,0,80,0.18)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 670, background: 'rgba(255,0,80,0.18)' }} />
    <div style={{ position: 'absolute', right: 0, top: 240, bottom: 670, width: 120, background: 'rgba(255,0,80,0.18)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 240, height: 1440, border: '4px dashed #0A84FF', boxSizing: 'border-box' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 285, height: 1350, border: '4px dashed #34C759', boxSizing: 'border-box' }} />
    <div style={{ position: 'absolute', left: SAFE.x, top: SAFE.y, width: SAFE.w, height: SAFE.h, border: '5px solid #FF9F0A', boxSizing: 'border-box' }} />
  </AbsoluteFill>
);

export const Thumbnail: React.FC<{ guides?: boolean }> = ({ guides = false }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
    <SheetMotif />

    {/* decoration below the safe box: faded formulas in the grid */}
    {[['=A1+A2+A3+A4+A5', 1330], ['=SUM(A1:A5)', 1474], ['=AVERAGE(B2:B9)', 1618]].map(([fx, y], i) => (
      <div key={i} style={{ position: 'absolute', left: 130 + i * 90, top: y as number, fontFamily: '"Space Mono", monospace', fontWeight: 700, fontSize: 46, color: C.formula, opacity: 0.22 }}>
        {fx}
      </div>
    ))}

    {/* segment label */}
    <div style={{ position: 'absolute', left: SAFE.x, top: SAFE.y + 18, transform: 'rotate(-2deg)', transformOrigin: 'left center' }}>
      <Box bg={C.green} pad="8px 22px 8px 14px" radius={14} sh={7} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: HEAD, fontSize: 36, whiteSpace: 'nowrap' }}>
        <Barbell w={90} />
        SPREADSHEET GYM
      </Box>
    </div>

    {/* title: 5 words, fits the 840 px box */}
    <div style={{ position: 'absolute', left: SAFE.x, top: 405, width: SAFE.w, fontFamily: HEAD, fontSize: 74, lineHeight: 1.28, color: C.ink, whiteSpace: 'nowrap' }}>
      <span style={mark}>Formula &amp; Function</span>
      <br />
      <span style={{ ...mark, background: C.yellow }}>itu beda?!</span>
    </div>

    {/* key visual: real frame of the warm-up question */}
    <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, overflow: 'hidden', background: C.bg, border: `${BORDER}px solid ${C.ink}`, borderRadius: 26, boxShadow: shadow(12), boxSizing: 'border-box' }}>
      <Img
        src={staticFile('thumb-frame.png')}
        style={{ position: 'absolute', left: (PANEL.w - SRC.w * K) / 2 - SRC.x * K - BORDER, top: 10 - SRC.y * K - BORDER, width: 1080 * K, height: 1920 * K }}
      />
    </div>

    {/* card on the panel edge */}
    <At x={830} y={PANEL.y} r={6}>
      <Sticker bg={C.blue} size={38}>{EPISODE_LABEL}</Sticker>
    </At>

    {/* series strip (decoration, under the platform UI) */}
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: C.ink, color: C.white,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px',
      fontFamily: BODY, fontWeight: 700, fontSize: 36, letterSpacing: 3,
    }}>
      <span>SPREADSHEET GYM</span>
      <span>@faqihpedia</span>
    </div>

    {guides && <Guides />}
  </AbsoluteFill>
);

export const ThumbnailSafeCheck: React.FC = () => <Thumbnail guides />;
