import React from 'react';

/*
 * Cartoon of the speaker at a podium: black peci, white shirt.
 * Drawn on a 600x760 box. Everything is driven from outside:
 *  mouth - 0 closed .. 1 wide open (from the voice volume)
 *  blink - 0 open .. 1 shut
 *  tilt  - head tilt in degrees
 *  point - 0 hand down .. 1 index finger raised
 */
const SKIN = '#D9A37E';
const SKIN_SHADE = '#C08A66';
const INK = '#2B2118';
const SHIRT = '#F7F5F0';
const SHIRT_SHADE = '#DCD8CF';
const PECI = '#1C1C1F';
const HAIR = '#8E8A86';
const WOOD = '#7A4B2A';
const WOOD_DARK = '#5C371E';

export const Character: React.FC<{ mouth: number; blink: number; tilt: number; point: number }> = ({ mouth, blink, tilt, point }) => {
  const m = Math.max(0, Math.min(1, mouth));
  const eyeH = 9 * (1 - 0.9 * Math.max(0, Math.min(1, blink)));
  // raised forearm swings up around the elbow
  const arm = -95 * point;
  return (
    <svg width={600} height={760} viewBox="0 0 600 760" style={{ overflow: 'visible' }}>
      {/* torso */}
      <path d="M95 760 L110 560 Q120 470 210 450 L390 450 Q480 470 490 560 L505 760 Z" fill={SHIRT} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M300 455 L300 760" stroke={SHIRT_SHADE} strokeWidth={6} />
      {[520, 580, 640].map((y) => <circle key={y} cx={300} cy={y} r={6} fill={SHIRT_SHADE} />)}
      {/* collar */}
      <path d="M235 450 L300 505 L365 450 L345 432 L300 470 L255 432 Z" fill={SHIRT} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* neck */}
      <path d="M255 410 L255 450 Q300 478 345 450 L345 410 Z" fill={SKIN_SHADE} />

      {/* head, tilts around the neck */}
      <g transform={`rotate(${tilt} 300 430)`}>
        {/* ears */}
        <ellipse cx={168} cy={290} rx={22} ry={34} fill={SKIN} stroke={INK} strokeWidth={5} />
        <ellipse cx={432} cy={290} rx={22} ry={34} fill={SKIN} stroke={INK} strokeWidth={5} />
        {/* face: broad, full cheeks */}
        <path d="M170 230 Q168 145 300 140 Q432 145 430 230 L436 320 Q438 440 300 446 Q162 440 164 320 Z" fill={SKIN} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {/* grey hair at the temples, under the peci */}
        <path d="M178 205 Q176 250 182 268 L194 268 Q190 236 196 208 Z" fill={HAIR} />
        <path d="M422 205 Q424 250 418 268 L406 268 Q410 236 404 208 Z" fill={HAIR} />
        {/* peci */}
        <path d="M182 210 L196 112 Q300 92 404 112 L418 210 Q300 196 182 210 Z" fill={PECI} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M196 120 Q300 102 404 120" fill="none" stroke="#3A3A40" strokeWidth={5} />
        {/* brows */}
        <path d="M218 252 Q248 236 280 248" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
        <path d="M320 248 Q352 236 382 252" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
        {/* eyes */}
        <ellipse cx={250} cy={278} rx={11} ry={eyeH} fill={INK} />
        <ellipse cx={350} cy={278} rx={11} ry={eyeH} fill={INK} />
        {/* nose */}
        <path d="M300 285 Q282 330 284 340 Q300 350 316 340 Q318 330 300 285" fill={SKIN_SHADE} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        {/* cheeks / jowls */}
        <path d="M205 345 Q215 395 262 410" fill="none" stroke={SKIN_SHADE} strokeWidth={6} strokeLinecap="round" />
        <path d="M395 345 Q385 395 338 410" fill="none" stroke={SKIN_SHADE} strokeWidth={6} strokeLinecap="round" />
        {/* double chin */}
        <path d="M245 432 Q300 452 355 432" fill="none" stroke={SKIN_SHADE} strokeWidth={6} strokeLinecap="round" />
        {/* moustache shadow */}
        <path d="M262 362 Q300 352 338 362" fill="none" stroke={SKIN_SHADE} strokeWidth={8} strokeLinecap="round" />
        {/* mouth: opens with the voice */}
        <path
          d={`M262 378 Q300 ${384 - 4 * m} 338 378 Q330 ${384 + 46 * m} 300 ${386 + 52 * m} Q270 ${384 + 46 * m} 262 378 Z`}
          fill="#5A2320" stroke={INK} strokeWidth={5} strokeLinejoin="round"
        />
        {m > 0.25 && <path d={`M272 ${383 + 2 * m} Q300 ${388 + 2 * m} 328 ${383 + 2 * m}`} fill="none" stroke="#F4EFE6" strokeWidth={7} strokeLinecap="round" />}
      </g>

      {/* right arm (viewer's left): raises a finger on emphasis */}
      <g transform={`rotate(${arm} 150 600)`}>
        <path d="M120 520 Q100 580 150 600 L215 610" fill="none" stroke={INK} strokeWidth={70} strokeLinecap="round" />
        <path d="M120 520 Q100 580 150 600 L215 610" fill="none" stroke={SHIRT} strokeWidth={58} strokeLinecap="round" />
        <circle cx={236} cy={612} r={28} fill={SKIN} stroke={INK} strokeWidth={5} />
        <rect x={250} y={560} width={16} height={48} rx={8} fill={SKIN} stroke={INK} strokeWidth={5} transform="rotate(35 258 608)" />
      </g>

      {/* podium with microphone */}
      <path d="M300 520 Q300 470 330 452" fill="none" stroke="#333" strokeWidth={8} strokeLinecap="round" />
      <rect x={322} y={430} width={28} height={40} rx={12} fill="#222" />
      <path d="M110 600 L490 600 L470 760 L130 760 Z" fill={WOOD} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <rect x={95} y={580} width={410} height={32} rx={8} fill={WOOD_DARK} stroke={INK} strokeWidth={6} />
      <circle cx={300} cy={680} r={34} fill="#C9A44C" stroke={INK} strokeWidth={5} />
      <circle cx={300} cy={680} r={20} fill="none" stroke={INK} strokeWidth={4} />
    </svg>
  );
};
