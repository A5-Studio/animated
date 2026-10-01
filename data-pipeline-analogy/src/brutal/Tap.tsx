import { interpolate, useCurrentFrame } from "remotion";
import { B, Caption, clamp, easeOut, Mark, Panel, SAFE, STROKE, Sticker, Title, wavePath , BrutalBg } from "./kit";

const OPEN = 25;
const POUR = 42;
const S = { stroke: B.ink, strokeWidth: STROKE, strokeLinejoin: "round" as const };
const GLASS = "M 300 260 L 580 260 L 555 505 L 325 505 Z";

export const BrutalTap: React.FC = () => {
  const frame = useCurrentFrame();
  const handle = interpolate(frame, [OPEN, OPEN + 10], [0, -90], { ...clamp, easing: easeOut });
  const stream = interpolate(frame, [POUR, POUR + 10], [0, 1], clamp);
  const level = interpolate(frame, [POUR + 8, 160], [0, 0.8], { ...clamp, easing: easeOut });
  const surface = 505 - 235 * level;

  return (
    <BrutalBg>
      <Title kicker="HASILNYA" kickerColor={B.green}>
        Tinggal buka <Mark color={B.water}>keran</Mark>
      </Title>

      <Panel top={530} height={440} color={B.yellow}>
        <svg viewBox="0 0 840 525" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
          <rect x={-10} y={90} width={400} height={50} fill={B.grey} {...S} />
          <rect x={430} y={190} width={28} height={(surface - 190) * stream} fill={B.water}
            stroke={B.ink} strokeWidth={4} opacity={stream > 0 ? 1 : 0} />
          <rect x={370} y={70} width={120} height={90} fill={B.grey} {...S} />
          <path d="M 424 160 L 424 196 L 464 196 L 464 160" fill={B.grey} {...S} />
          <g transform={`rotate(${handle} 430 70)`}>
            <rect x={424} y={34} width={12} height={36} fill={B.ink} />
            <rect x={370} y={18} width={120} height={26} fill={B.pink} {...S} />
          </g>

          <clipPath id="b-glass"><path d={GLASS} /></clipPath>
          <path d={GLASS} fill={B.white} />
          <path d={wavePath(280, 600, surface, 6, 90, frame / 4, 520)} fill={B.water}
            clipPath="url(#b-glass)" opacity={level > 0.005 ? 1 : 0} />
          <path d={GLASS} fill="none" {...S} />
        </svg>
      </Panel>

      <div style={{ position: "absolute", left: SAFE.left, top: 1000, width: SAFE.width, display: "flex", gap: 18 }}>
        <Sticker at={95} color={B.green} rotate={-3} style={{ fontSize: 36 }}>Cepat</Sticker>
        <Sticker at={105} color={B.blue} rotate={2} style={{ fontSize: 36 }}>Bersih</Sticker>
        <Sticker at={115} color={B.pink} rotate={-2} style={{ fontSize: 36 }}>Otomatis</Sticker>
      </div>

      <Caption from={140} to={250}>
        Laporan &amp; dashboard siap kapan pun.
      </Caption>
    </BrutalBg>
  );
};
