import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { At, Box, Gingham, Sticker } from './components';
import { BODY, BORDER, C, HEAD, shadow } from './theme';
import { TrimsLogo } from './Video';

/*
 * TRIMS cover (Faqihpedia segment kit):
 *  - gingham "taplak warung" background
 *  - segment label top-left (no episode number for now)
 *  - label + title kept inside the 3:4 profile-grid crop (y 240-1680); title is 4 words
 *  - "LAUK HARI INI" fact card, yellow, tilted 6 degrees
 *  - face center-bottom, here served on the TRIMS plate between a fork and a spoon
 *  - black strip at the bottom with the series name and @faqihpedia
 */
const mark: React.CSSProperties = {
  background: C.white, boxShadow: `inset 0 0 0 6px ${C.ink}`, borderRadius: 14, padding: '0 18px',
  boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
};

const Fork: React.FC<{ h: number }> = ({ h }) => (
  <svg width={h * 0.28} height={h} viewBox="0 0 40 140" style={{ filter: `drop-shadow(8px 8px 0 ${C.ink})` }}>
    <rect x="14" y="40" width="12" height="96" rx="5" fill={C.white} stroke={C.ink} strokeWidth="5" />
    <rect x="6" y="4" width="28" height="46" rx="5" fill={C.white} stroke={C.ink} strokeWidth="5" />
    <line x1="15" y1="4" x2="15" y2="32" stroke={C.ink} strokeWidth="4" />
    <line x1="25" y1="4" x2="25" y2="32" stroke={C.ink} strokeWidth="4" />
  </svg>
);

const Spoon: React.FC<{ h: number }> = ({ h }) => (
  <svg width={h * 0.28} height={h} viewBox="0 0 40 140" style={{ filter: `drop-shadow(8px 8px 0 ${C.ink})` }}>
    <rect x="14" y="56" width="12" height="80" rx="5" fill={C.white} stroke={C.ink} strokeWidth="5" />
    <ellipse cx="20" cy="30" rx="16" ry="26" fill={C.white} stroke={C.ink} strokeWidth="5" />
  </svg>
);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: `${Gingham(96)}, ${C.bg}`, overflow: 'hidden' }}>
    {/* segment label, top-left */}
    <div style={{ position: 'absolute', left: 48, top: 262, transform: 'rotate(-2deg)' }}>
      <Box bg={C.orange} pad="10px 26px 10px 16px" radius={16} sh={8} style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: HEAD, fontSize: 46, whiteSpace: 'nowrap' }}>
        <TrimsLogo size={92} />
        TRIMS
      </Box>
    </div>

    {/* title: 4 words, top third */}
    <div style={{ position: 'absolute', left: 60, right: 60, top: 400, fontFamily: HEAD, fontSize: 122, lineHeight: 1.22, color: C.ink }}>
      <span style={mark}>Apa sih arti</span>
      <br />
      <span style={{ ...mark, background: C.yellow }}>“PEDIA”?</span>
    </div>

    {/* the three -pedia names */}
    <At x={250} y={850} r={-5}>
      <Box bg={C.white} pad="14px 18px" radius={18} sh={9}>
        <Img src={staticFile('tokopedia.png')} style={{ width: 360, display: 'block' }} />
      </Box>
    </At>
    <At x={850} y={790} r={6}>
      <Sticker bg={C.yellow} size={44}>Lauk hari ini</Sticker>
    </At>
    <At x={870} y={945} r={4}>
      <Box bg={C.white} pad="12px 14px" radius={18} sh={9}>
        <Img src={staticFile('wikipedia.png')} style={{ width: 150, display: 'block' }} />
      </Box>
    </At>
    <At x={300} y={985} r={3}>
      <Sticker bg={C.white} size={44}>Ensiklopedia</Sticker>
    </At>

    {/* face on the TRIMS plate, between a fork and a spoon */}
    <At x={135} y={1345}>
      <Fork h={430} />
    </At>
    <At x={945} y={1345}>
      <Spoon h={430} />
    </At>
    <At x={540} y={1345}>
      <div style={{ width: 660, height: 660, borderRadius: '50%', background: C.white, border: `${BORDER + 4}px solid ${C.ink}`, boxShadow: shadow(16), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 540, height: 540, borderRadius: '50%', overflow: 'hidden', border: `${BORDER + 2}px solid ${C.ink}`, background: C.yellow }}>
          <Img src={staticFile('thumb-face.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </At>
    <At x={780} y={1090} r={10}>
      <div style={{ width: 130, height: 130, borderRadius: '50%', background: C.orange, border: `${BORDER + 2}px solid ${C.ink}`, boxShadow: shadow(8), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 92 }}>?</div>
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
