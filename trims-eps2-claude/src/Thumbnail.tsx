import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { At, Box, Gingham, Sticker } from './components';
import { ClaudeTile, Photo } from './scenes';
import { BODY, BORDER, C, HEAD, SAFE } from './theme';
import { TrimsLogo } from './Video';

/*
 * TRIMS cover, same rules as episode 1 (faqihpedia-artipedia/src/Thumbnail.tsx):
 *  - gingham background, TRIMS label top-left, a short title (5 words)
 *  - a real frame of the video across the bottom half (the "1950-an?!" raised-brow moment, source 1.4s)
 *  - "LAUK HARI INI" card tilted 6 degrees, plus the Claude tile and the Claude Shannon photo
 *  - black series strip at the bottom
 */
const mark: React.CSSProperties = {
  background: C.white, boxShadow: `inset 0 0 0 6px ${C.ink}`, borderRadius: 14, padding: '0 16px',
  boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
};

// source frame 1080x1920 shown at 0.88: hair top lands ~730, chin ~1700 (above the strip), face a bit left of centre.
// The strips left and right of it are filled with a blurred copy of the same frame.
const PHOTO_TOP = 690;
const K = 0.88;
const IMG_LEFT = 67;
const IMG_TOP = 360 - PHOTO_TOP; // image top relative to the panel

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: `${Gingham(96)}, ${C.bg}`, overflow: 'hidden' }}>
    {/* photo panel, bleeding off the bottom */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: PHOTO_TOP, bottom: 0, overflow: 'hidden', borderTop: `${BORDER + 4}px solid ${C.ink}`, background: C.ink }}>
      <Img src={staticFile('thumb-frame.jpg')} style={{ position: 'absolute', left: -60, top: IMG_TOP - 100, width: 1200, height: 2133, filter: 'blur(28px) brightness(0.9)' }} />
      <Img src={staticFile('thumb-frame.jpg')} style={{ position: 'absolute', left: IMG_LEFT, top: IMG_TOP, width: 1080 * K, height: 1920 * K }} />
    </div>

    {/* segment label, top-left */}
    <div style={{ position: 'absolute', left: SAFE.left, top: SAFE.top + 10, transform: 'rotate(-2deg)' }}>
      <Box bg={C.orange} pad="8px 22px 8px 14px" radius={14} sh={7} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: HEAD, fontSize: 38, whiteSpace: 'nowrap' }}>
        <TrimsLogo size={74} />
        TRIMS
      </Box>
    </div>

    {/* title: 5 words */}
    <div style={{ position: 'absolute', left: SAFE.left, right: 1080 - SAFE.right - 40, top: 405, fontFamily: HEAD, fontSize: 86, lineHeight: 1.24, color: C.ink, whiteSpace: 'nowrap' }}>
      <span style={mark}>Claude udah ada</span>
      <br />
      <span style={{ ...mark, background: C.yellow }}>sejak 1950-an?!</span>
    </div>

    {/* fact card on the panel edge */}
    <At x={790} y={672} r={6}>
      <Sticker bg={C.yellow} size={40}>Lauk hari ini</Sticker>
    </At>

    {/* the Claude tile on the wall beside the face */}
    <At x={890} y={900} r={7}>
      <ClaudeTile size={170} />
    </At>

    {/* the scientist it may be named after, over the shoulder */}
    <At x={900} y={1440} r={6}>
      <Photo src="img/shannon-portrait.png" w={210} h={250} pos="50% 15%" label="C. SHANNON" labelBg={C.yellow} />
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
