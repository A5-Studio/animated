import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { At, Box, Sticker } from './components';
import { Barbell } from './scenes';
import { BORDER, BODY, C, EPISODE_LABEL, HEAD } from './theme';

/*
 * Cover, same rules and geometry as the TRIMS cover (trims-eps2-claude/src/Thumbnail.tsx
 * on claude/awesome-hawking-b9e871), which already respects the safe area:
 *  - SAFE box x 60-940, y 285-1500 (trims-eps2-claude/src/theme.ts): label, title,
 *    card and the key part of the photo panel stay inside it
 *  - segment motif on top, segment label + logo tilted -2°, a short title (5 words)
 *    on white/yellow marks, top 405
 *  - a real frame of the video across the bottom half (panel from y 690 to the strip);
 *    no face in this segment, so it's the problem scene at 30.8 s (row 501 arrives with
 *    an empty total, "Total-nya kosong!", "Narik lagi…"). The frame is cropped below the
 *    video's header row, so =ARRAYFORMULA never shows: the cover doesn't give the answer away.
 *  - a tilted card on the panel edge, black series strip at the bottom
 */
export const SAFE = { left: 60, right: 940, top: 285, bottom: 1500 };

const mark: React.CSSProperties = {
  background: C.white, boxShadow: `inset 0 0 0 6px ${C.ink}`, borderRadius: 14, padding: '0 16px',
  boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
};

const PHOTO_TOP = 690;
const STRIP = 150;
const K = 1; // frame scale
// frame rows: sheet window starts ~580, the two stickers end ~1365. Show from 565 so the
// stickers end at 690 + (1365 - 565) = 1490, inside SAFE.bottom.
const FRAME_Y = 565;

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
      {Array.from({ length: 9 }, (_, r) => (
        <div key={r} style={{ position: 'absolute', left: 0, top: headH + r * rowH, width: numW, height: rowH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 28, borderBottom: `3px solid ${C.ink}55` }}>
          {r + 1}
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** overlays for checking: platform UI (red), IG crops (blue 3:4, green 4:5), SAFE box (orange) */
const Guides: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 240, background: 'rgba(255,0,80,0.18)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: STRIP, background: 'rgba(255,0,80,0.18)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 240, height: 1440, border: '4px dashed #0A84FF', boxSizing: 'border-box' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 285, height: 1350, border: '4px dashed #34C759', boxSizing: 'border-box' }} />
    <div style={{ position: 'absolute', left: SAFE.left, top: SAFE.top, width: SAFE.right - SAFE.left, height: SAFE.bottom - SAFE.top, border: '5px solid #FF9F0A', boxSizing: 'border-box' }} />
  </AbsoluteFill>
);

export const Thumbnail: React.FC<{ guides?: boolean }> = ({ guides = false }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
    <SheetMotif />

    {/* real video frame, bleeding off the bottom */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: PHOTO_TOP, bottom: 0, overflow: 'hidden', borderTop: `${BORDER + 4}px solid ${C.ink}`, background: C.bg }}>
      <Img src={staticFile('thumb-frame.png')} style={{ position: 'absolute', left: (1080 - 1080 * K) / 2, top: -FRAME_Y * K, width: 1080 * K, height: 1920 * K }} />
    </div>

    {/* segment label, top-left */}
    <div style={{ position: 'absolute', left: SAFE.left, top: SAFE.top + 10, transform: 'rotate(-2deg)' }}>
      <Box bg={C.green} pad="8px 22px 8px 14px" radius={14} sh={7} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: HEAD, fontSize: 38, whiteSpace: 'nowrap' }}>
        <Barbell w={96} />
        SPREADSHEET GYM
      </Box>
    </div>

    {/* title: 6 words, right edge inside SAFE.right */}
    <div style={{ position: 'absolute', left: SAFE.left, top: 405, fontFamily: HEAD, fontSize: 74, lineHeight: 1.3, color: C.ink, whiteSpace: 'nowrap' }}>
      <span style={mark}>Masih narik formula</span>
      <br />
      <span style={{ ...mark, background: C.yellow }}>tiap data baru?!</span>
    </div>

    {/* card on the panel edge */}
    <At x={790} y={672} r={6}>
      <Sticker bg={C.blue} size={40}>{EPISODE_LABEL}</Sticker>
    </At>

    {/* series strip */}
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height: STRIP, background: C.ink, color: C.white,
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
