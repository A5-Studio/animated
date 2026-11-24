import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { MapArt, PINS } from './scenes';
import { C, SANS, SERIF, soft } from './theme';
import { Pin, Sparkle, Star, Tag } from './ui';

/*
 * Cover for TikTok, IG Reels and IG Feed. Headline + key visual stay inside
 * the shared safe box x 120-960, y 285-1250 (see SAFE); only the face sits below.
 */
export const SAFE = { x: 120, y: 285, w: 840, h: 965 };

const Guides: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {/* TikTok UI: top 240, bottom 660, 120 each side */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 240, background: 'rgba(255,0,80,0.18)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 670, background: 'rgba(255,0,80,0.18)' }} />
    <div style={{ position: 'absolute', right: 0, top: 240, bottom: 670, width: 120, background: 'rgba(255,0,80,0.18)' }} />
    {/* IG grid 3:4 and feed 4:5 crops */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 240, height: 1440, border: '4px dashed #0A84FF', boxSizing: 'border-box' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 285, height: 1350, border: '4px dashed #34C759', boxSizing: 'border-box' }} />
    <div style={{ position: 'absolute', left: SAFE.x, top: SAFE.y, width: SAFE.w, height: SAFE.h, border: '5px solid #FF9F0A', boxSizing: 'border-box' }} />
  </AbsoluteFill>
);

const OldWay: React.FC = () => (
  <div style={{ position: 'absolute', left: 120, top: 750, width: 380, height: 480, borderRadius: 32, background: C.card, boxShadow: soft, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: -90, top: -60, transform: 'scale(0.7)', transformOrigin: '0 0' }}>
      <div style={{ position: 'relative', width: 960, height: 830 }}>
        <MapArt />
        {PINS.map(([x, y], k) => (
          <div key={k} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -100%)' }}>
            <Pin size={56} />
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 22px', background: 'rgba(255,255,255,0.96)', fontFamily: SANS }}>
      <Tag style={{ fontSize: 22 }}>Dulu</Tag>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, color: C.ink }}>12 tempat,<br />dicek satu-satu</div>
    </div>
  </div>
);

const NewWay: React.FC = () => (
  <div style={{ position: 'absolute', left: 560, top: 725, width: 400, height: 525 }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: 44, background: '#141414', boxShadow: '0 24px 60px rgba(0,0,0,0.22)' }}>
      <div style={{ position: 'absolute', left: 10, top: 10, right: 10, bottom: 10, borderRadius: 36, overflow: 'hidden', background: '#fff' }}>
        <Img src={staticFile('thumb_result.jpg')} style={{ width: 380, display: 'block' }} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 24, right: 24, bottom: 22, display: 'flex', alignItems: 'center', gap: 12, background: C.card, borderRadius: 22, padding: '14px 18px', boxShadow: soft, fontFamily: SANS }}>
      <Sparkle size={30} />
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>1 jawaban, langsung</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 20, color: C.sub }}>
          Matcha Times Blok M · 5,0 <Star size={20} />
        </div>
      </div>
    </div>
  </div>
);

export const Cover: React.FC<{ guides?: boolean; offsetY?: number; faceY?: number }> = ({ guides = false, offsetY = 0, faceY = 455 }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: 'absolute', left: 0, top: -offsetY, width: 1080, height: 1920 }}>
      <AbsoluteFill style={{ background: `radial-gradient(1200px 900px at 50% 30%, ${C.paper}, ${C.bg})` }} />
      {/* face: the split layout from the video (4:5 shows less of it, so it is framed on eyes + mouth) */}
      <div style={{ position: 'absolute', left: 0, top: 1270, width: 1080, height: 650, overflow: 'hidden' }}>
        <Img src={staticFile('thumb_face.jpg')} style={{ position: 'absolute', left: 0, top: -faceY, width: 1080 }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 318, textAlign: 'center' }}>
        <Tag style={{ fontSize: 26, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <b style={{ color: C.ink }}>AI · An Info</b> — Ask Maps
        </Tag>
      </div>
      <div style={{ position: 'absolute', left: 120, width: 840, top: 368, textAlign: 'center', fontFamily: SERIF, fontSize: 104, lineHeight: 1.0, whiteSpace: 'nowrap', letterSpacing: -2.5, color: C.ink }}>
        Cari kafe,<br />nggak perlu<br /><span style={{ color: C.blue }}>cek satu-satu.</span>
      </div>
      <OldWay />
      {/* arrow between the two */}
      <svg width={80} height={60} style={{ position: 'absolute', left: 495, top: 960 }}>
        <path d="M8 30 H62 M48 14 L66 30 L48 46" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <NewWay />
    </div>
    {guides && <Guides />}
  </AbsoluteFill>
);

export const Thumbnail: React.FC = () => <Cover />;
export const ThumbnailGuides: React.FC = () => <Cover guides />;
export const Thumbnail4x5: React.FC = () => <Cover offsetY={285} faceY={640} />;
