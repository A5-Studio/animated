import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, SANS, SERIF, soft } from './theme';
import { SegmentTag, Sparkle } from './ui';

/*
 * Cover for TikTok, IG Reels and the IG feed (AI An Info standard, same layout as faqihpedia-askmaps):
 * tag ~y 330, serif headline y 380-720, key visual y 760-1240, all inside the safe box x 120-960, y 285-1250.
 * Below the box only decoration: it sits under the TikTok/Reels UI but shows in the IG 3:4 and 4:5 crops.
 */
const chip: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, background: C.card, borderRadius: 40, padding: '14px 24px',
  boxShadow: soft, fontFamily: SANS, fontSize: 28, fontWeight: 600, color: C.ink,
};

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill style={{ background: `radial-gradient(1200px 900px at 50% 30%, ${C.paper}, ${C.bg})` }} />

    <div style={{ position: 'absolute', left: 0, right: 0, top: 306, textAlign: 'center' }}>
      <SegmentTag topic="Asal nama Claude" size={28} />
    </div>
    <div style={{ position: 'absolute', left: 120, width: 840, top: 372, textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: 104, lineHeight: 1.0, whiteSpace: 'nowrap', letterSpacing: -2.5, color: C.ink }}>
      Claude ternyata<br />udah ada sejak<br /><span style={{ color: C.blue }}>1950-an.</span>
    </div>

    {/* key visual: Claude the AI next to Claude the scientist */}
    <div style={{ position: 'absolute', left: 120, top: 760, width: 370, height: 470, borderRadius: 34, background: C.card, boxShadow: soft, padding: 30, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
      <div style={{ width: 200, height: 200, borderRadius: 48, overflow: 'hidden', background: C.claude }}>
        <Img src={staticFile('img/claude-logo.png')} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
      <div style={{ textAlign: 'center', fontFamily: SANS }}>
        <div style={{ fontSize: 38, fontWeight: 700, color: C.ink }}>Claude</div>
        <div style={{ fontSize: 24, fontWeight: 500, color: C.sub, marginTop: 4 }}>AI dari Anthropic</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 490, top: 950, width: 100, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 72, color: C.faint }}>?</div>
    <div style={{ position: 'absolute', left: 590, top: 760, width: 370, height: 470, borderRadius: 34, background: C.card, boxShadow: soft, padding: 14, boxSizing: 'border-box' }}>
      <div style={{ width: 342, height: 340, borderRadius: 22, overflow: 'hidden' }}>
        <Img src={staticFile('img/shannon-portrait.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%', filter: 'grayscale(1) contrast(1.04)' }} />
      </div>
      <div style={{ fontFamily: SANS, fontSize: 32, fontWeight: 700, color: C.ink, marginTop: 16, paddingLeft: 8 }}>Claude Shannon</div>
      <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 500, color: C.sub, marginTop: 2, paddingLeft: 8 }}>Ilmuwan · 1916–2001</div>
    </div>

    {/* lower band, decoration only */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', fontFamily: SANS, fontSize: 26, fontWeight: 600, letterSpacing: 2, color: C.sub }}>
      DARI BIT SAMPAI TIKUS ROBOT
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1352, display: 'flex', justifyContent: 'center', gap: 14 }}>
      <div style={chip}><span style={{ fontFamily: SERIF, fontSize: 34, color: C.blue }}>bit</span> = binary digit</div>
      <div style={chip}><Sparkle size={28} /> Theseus, 1951</div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1446, display: 'flex', justifyContent: 'center', gap: 14 }}>
      <div style={chip}>Bell Labs</div>
      <div style={chip}>Shannon × Turing</div>
    </div>
  </AbsoluteFill>
);
