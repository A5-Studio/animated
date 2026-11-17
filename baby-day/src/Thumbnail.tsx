import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Background, Cloud, Heart, Star } from './components';
import { ClockFace, Frame, Media } from './media';
import { C, NAME, SANS, SCRIPT, SERIF } from './theme';

// Cover / thumbnail, 1080x1920. Same props as the video: {"private": true} drops the stickers.
const Word: React.FC<{ text: string; size: number }> = ({ text, size }) => {
  const cols = [C.sage, C.pink, C.butter, C.lavender];
  let k = 0;
  return (
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: size, lineHeight: 0.95, letterSpacing: -2, whiteSpace: 'nowrap' }}>
      {[...text].map((ch, i) => ch === ' '
        ? <span key={i}> </span>
        : <span key={i} style={{ color: cols[k++ % 4], WebkitTextStroke: `${size * 0.05}px ${C.white}`, paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(110,100,120,0.10)' }}>{ch}</span>)}
    </div>
  );
};

const Polaroid: React.FC<{ src: string; x: number; y: number; w: number; h: number; r: number; fy?: number }> = ({ src, x, y, w, h, r, fy }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(${r}deg)`, width: w, height: h, background: C.paper, padding: '14px 14px 44px', borderRadius: 18, boxShadow: '0 16px 34px rgba(110,100,120,0.25)' }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden' }}>
      <Media src={src} w={w - 28} h={h - 58} fy={fy} zoom={false} />
    </div>
  </div>
);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Cloud x={70} y={170} w={230} face />
    <Cloud x={800} y={1060} w={200} color={C.pink} drift={0} />
    <Star x={880} y={360} size={70} />
    <Star x={90} y={1010} size={52} color={C.lavender} />
    <Heart x={940} y={250} size={50} />
    <Heart x={60} y={560} size={44} color={C.pink} />

    {/* title */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, letterSpacing: 14, color: C.ink, opacity: 0.85 }}>A DAY IN</div>
      <Word text={`${NAME}'s`} size={210} />
      <div style={{ marginTop: -10 }}><Word text="Life" size={210} /></div>
      <div style={{ marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 18, padding: '16px 52px', background: C.sage, color: C.ink, fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 4, clipPath: 'polygon(0 0,100% 0,96% 50%,100% 100%,0 100%,4% 50%)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 7, border: `2.5px dashed ${C.white}` }} />
        <span style={{ color: C.pink }}>♥</span>EPS: KEGIATAN SEHARI-HARI<span style={{ color: C.pink }}>♥</span>
      </div>
    </div>

    {/* hero photo + day snapshots */}
    <Polaroid src="foto-17-tidur-closeup-2.jpg" x={30} y={1180} w={300} h={360} r={-8} />
    <Polaroid src="foto-26-sensory-board.jpg" x={760} y={1220} w={290} h={350} r={7} fy={0.3} />
    <div style={{ position: 'absolute', left: 215, top: 870, transform: 'rotate(-2deg)' }}>
      <Frame w={650} h={820} accent={C.pink}>
        <Media src="foto-05-merangkak.jpg" w={614} h={784} fy={0.35} zoom={false} />
      </Frame>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, transform: 'rotate(-10deg)', filter: 'drop-shadow(0 10px 18px rgba(110,100,120,0.25))' }}>
      <ClockFace minutes={6 * 60} size={190} />
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1720, display: 'flex', justifyContent: 'center' }}>
      <div style={{ fontFamily: SCRIPT, fontWeight: 700, fontSize: 92, color: C.lavender, textShadow: `0 0 18px ${C.bg}, 0 0 8px ${C.bg}` }}>dari bangun sampai bobok</div>
    </div>
  </AbsoluteFill>
);
