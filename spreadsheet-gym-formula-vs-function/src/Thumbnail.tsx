import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Barbell } from './scenes';
import { Fx } from './Sheet';
import { BORDER, C, EPISODE_LABEL, HEAD, MAIN_FORMULA, MONO, shadow } from './theme';

/*
 * Reels / TikTok cover, laid out like the Spreadsheet Gym cover in
 * brand/segment-kit.html: formula bar on top, segment chip top-left, a title
 * of at most 6 words in the top third, a tilted sticker, the face centered
 * low, and the black @faqihpedia strip. Title and face stay inside the
 * centered 3:4 area (y 240–1680) that the Instagram profile grid shows.
 */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
    {/* cell grid */}
    <AbsoluteFill
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(17,17,17,.14) 2px, transparent 2px), linear-gradient(rgba(17,17,17,.14) 2px, transparent 2px)',
        backgroundSize: '160px 64px',
      }}
    />
    {/* formula bar */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 120, background: C.white, borderBottom: `${BORDER + 2}px solid ${C.ink}`, display: 'flex' }}>
      <div style={{ width: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `${BORDER + 2}px solid ${C.ink}`, fontFamily: MONO, fontStyle: 'italic', fontWeight: 700, fontSize: 50 }}>fx</div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 32px', fontFamily: MONO, fontWeight: 700, fontSize: 58 }}>
        <Fx text={MAIN_FORMULA} />
      </div>
    </div>
    {/* segment chip */}
    <div style={{ position: 'absolute', left: 50, top: 260, background: C.green, border: `${BORDER}px solid ${C.ink}`, borderRadius: 18, boxShadow: shadow(8), padding: '12px 24px', fontFamily: MONO, fontWeight: 700, fontSize: 40 }}>
      GYM · {EPISODE_LABEL}
    </div>
    {/* title: max 6 words */}
    <div style={{ position: 'absolute', left: 50, right: 50, top: 380, fontFamily: HEAD, fontSize: 116, lineHeight: 1.18, color: C.ink }}>
      {['Formula &', 'Function', 'itu beda!'].map((l, i) => (
        <div key={l}>
          <span
            style={{
              background: i === 0 ? C.green : i === 1 ? C.blue : C.white,
              border: `${BORDER}px solid ${C.ink}`, boxShadow: shadow(10), padding: '0 18px', display: 'inline-block',
              transform: `rotate(${[-1.5, 1, -1][i]}deg)`, marginBottom: 14,
            }}
          >
            {l}
          </span>
        </div>
      ))}
    </div>
    {/* tilted sticker */}
    <div style={{ position: 'absolute', right: 40, top: 1000, transform: 'rotate(-6deg)', background: C.yellow, border: `${BORDER}px solid ${C.ink}`, borderRadius: 18, boxShadow: shadow(9), padding: '14px 26px', fontFamily: HEAD, fontSize: 50 }}>
      Jangan salah lagi!
    </div>
    {/* face */}
    <div style={{ position: 'absolute', left: 540 - 270, top: 1120, width: 540, height: 540, borderRadius: '50%', border: `${BORDER + 4}px solid ${C.ink}`, boxShadow: shadow(14), overflow: 'hidden', background: C.white }}>
      <Img src={staticFile('face.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    {/* barbell next to the face */}
    <div style={{ position: 'absolute', left: 30, top: 1420, transform: 'rotate(-12deg)' }}>
      <Barbell w={250} />
    </div>
    {/* bottom strip */}
    <div style={{ position: 'absolute', left: 0, bottom: 0, width: 1080, height: 110, background: C.ink, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 44px', boxSizing: 'border-box', fontFamily: MONO, fontWeight: 700, fontSize: 36, letterSpacing: 2 }}>
      <span>SPREADSHEET GYM</span>
      <span>@faqihpedia</span>
    </div>
  </AbsoluteFill>
);
