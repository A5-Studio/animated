import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { At, Box, Sticker } from './components';
import { Barbell } from './scenes';
import { BORDER, BODY, C, EPISODE_LABEL, HEAD } from './theme';

/*
 * Cover, same rules as the TRIMS covers (trims-eps2-claude/src/Thumbnail.tsx
 * on claude/awesome-hawking-b9e871), in the Spreadsheet Gym identity:
 *  - segment motif on top (a spreadsheet: column letters, row numbers, cell grid),
 *    segment label + logo top-left tilted -2°, a short title (5 words)
 *  - a real frame of the video across the bottom half; no face in this segment,
 *    so it's the warm-up question at 18.1 s (boss request, both formulas,
 *    "Formula?" / "Function?"). It must not show the answer.
 *  - a tilted card on the panel edge (episode number, plate blue)
 *  - black series strip at the bottom
 */
const SAFE = { left: 60, right: 940, top: 285, bottom: 1500 };

const mark: React.CSSProperties = {
  background: C.white, boxShadow: `inset 0 0 0 6px ${C.ink}`, borderRadius: 14, padding: '0 16px',
  boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
};

const PHOTO_TOP = 690;
const FRAME_Y = 330; // first row of the video frame shown at the panel top
const K = 0.9; // frame scale, so the bubble, sheet and both question stickers fit
const STRIP = 150;

/** spreadsheet motif: header row with column letters, row numbers, cell grid */
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

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
    <SheetMotif />

    {/* real video frame, bleeding off the bottom */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: PHOTO_TOP, bottom: 0, overflow: 'hidden', borderTop: `${BORDER + 4}px solid ${C.ink}`, background: C.bg }}>
      <Img src={staticFile('thumb-frame.png')} style={{ position: 'absolute', left: (1080 - 1080 * K) / 2, top: -FRAME_Y * K, width: 1080 * K, height: 1920 * K }} />
    </div>

    {/* segment label, top-left */}
    <div style={{ position: 'absolute', left: SAFE.left + 30, top: SAFE.top + 10, transform: 'rotate(-2deg)' }}>
      <Box bg={C.green} pad="8px 22px 8px 14px" radius={14} sh={7} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: HEAD, fontSize: 38, whiteSpace: 'nowrap' }}>
        <Barbell w={96} />
        SPREADSHEET GYM
      </Box>
    </div>

    {/* title: 5 words */}
    <div style={{ position: 'absolute', left: SAFE.left + 30, top: 405, fontFamily: HEAD, fontSize: 80, lineHeight: 1.26, color: C.ink, whiteSpace: 'nowrap' }}>
      <span style={mark}>Formula &amp; Function</span>
      <br />
      <span style={{ ...mark, background: C.yellow }}>itu beda?!</span>
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
  </AbsoluteFill>
);
