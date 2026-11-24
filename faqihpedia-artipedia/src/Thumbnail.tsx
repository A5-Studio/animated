import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { At, Box, Gingham, Sticker } from './components';
import { BODY, BORDER, C, HEAD, SAFE } from './theme';
import { TrimsLogo } from './Video';

/*
 * TRIMS cover (Faqihpedia segment kit):
 *  - gingham "taplak warung" background with the label (top-left) and a 4-word title
 *  - a real frame of the video across the bottom half, face center-bottom
 *  - "LAUK HARI INI" fact card, yellow, tilted 6 degrees, plus the -pedia names
 *  - black strip at the bottom with the series name and @faqihpedia
 * Everything that matters sits inside SAFE (x 60-940, y 285-1500): clear of the
 * TikTok/Reels UI and inside the 4:5 feed and 3:4 profile-grid crops.
 */
const mark: React.CSSProperties = {
  background: C.white, boxShadow: `inset 0 0 0 6px ${C.ink}`, borderRadius: 14, padding: '0 18px',
  boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
};

// the photo: source frame 1080x1920, scaled so the face sits around x 450, eyes at y ~1150
const PHOTO_TOP = 830;
const PHOTO_SCALE = 1.15;
const PHOTO_SHIFT_Y = 219 - PHOTO_TOP; // image top relative to the panel

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: `${Gingham(96)}, ${C.bg}`, overflow: 'hidden' }}>
    {/* photo panel, bleeding off the bottom */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: PHOTO_TOP, bottom: 0, overflow: 'hidden', borderTop: `${BORDER + 4}px solid ${C.ink}`, background: C.ink }}>
      <Img src={staticFile('thumb-frame.jpg')} style={{ position: 'absolute', left: 0, top: PHOTO_SHIFT_Y, width: 1080 * PHOTO_SCALE, height: 1920 * PHOTO_SCALE }} />
    </div>

    {/* segment label, top-left */}
    <div style={{ position: 'absolute', left: SAFE.left, top: SAFE.top + 10, transform: 'rotate(-2deg)' }}>
      <Box bg={C.orange} pad="8px 22px 8px 14px" radius={14} sh={7} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: HEAD, fontSize: 38, whiteSpace: 'nowrap' }}>
        <TrimsLogo size={74} />
        TRIMS
      </Box>
    </div>

    {/* title: 4 words */}
    <div style={{ position: 'absolute', left: SAFE.left, right: 1080 - SAFE.right, top: 410, fontFamily: HEAD, fontSize: 112, lineHeight: 1.22, color: C.ink }}>
      <span style={mark}>Apa sih arti</span>
      <br />
      <span style={{ ...mark, background: C.yellow }}>“PEDIA”?</span>
    </div>

    {/* fact card + the -pedia names, overlapping the photo edge and the wall beside the face */}
    <At x={745} y={740} r={6}>
      <Sticker bg={C.yellow} size={40}>Lauk hari ini</Sticker>
    </At>
    <At x={225} y={815} r={-5}>
      <Box bg={C.white} pad="12px 16px" radius={18} sh={9}>
        <Img src={staticFile('tokopedia.png')} style={{ width: 270, display: 'block' }} />
      </Box>
    </At>
    <At x={800} y={930} r={4}>
      <Box bg={C.white} pad="10px 12px" radius={18} sh={9}>
        <Img src={staticFile('wikipedia.png')} style={{ width: 120, display: 'block' }} />
      </Box>
    </At>
    <At x={800} y={1062} r={-3}>
      <Sticker bg={C.white} size={30}>Ensiklopedia</Sticker>
    </At>

    {/* series strip */}
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: C.ink, color: C.white,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px',
      fontFamily: BODY, fontWeight: 700, fontSize: 36, letterSpacing: 3,
    }}>
      <span>TRIVIA MAKAN SIANG</span>
      <span>@faqihpedia</span>
    </div>
  </AbsoluteFill>
);
