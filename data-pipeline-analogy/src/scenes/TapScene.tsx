import { interpolate, useCurrentFrame } from "remotion";
import { C, clamp, easeOut, pop } from "../theme";
import { Caption, SceneBg, Title, wavePath } from "../ui";

const OPEN = 30;
const POUR = 48;

const Badge: React.FC<{ readonly at: number; readonly children: string }> = ({
  at,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: C.white,
        borderRadius: 999,
        padding: "16px 30px 16px 18px",
        fontSize: 44,
        fontWeight: 800,
        boxShadow: "0 10px 24px rgba(15,42,61,0.12)",
        opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
        scale: interpolate(frame, [at, at + 18], [0.5, 1], { ...clamp, easing: pop }),
      }}
    >
      <svg viewBox="-30 -30 60 60" style={{ width: 56, height: 56 }}>
        <circle r={30} fill={C.good} />
        <path d="M -13 1 L -4 10 L 14 -9" fill="none" stroke={C.white} strokeWidth={7}
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </div>
  );
};

export const TapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const handle = interpolate(frame, [OPEN, OPEN + 15], [0, -90], { ...clamp, easing: easeOut });
  const stream = interpolate(frame, [POUR, POUR + 12], [0, 1], clamp);
  const level = interpolate(frame, [POUR + 10, 170], [0, 0.82], { ...clamp, easing: easeOut });
  const surface = 960 - 330 * level;

  return (
    <SceneBg>
      <Title kicker="HASILNYA" kickerColor={C.good}>
        Butuh data? Tinggal buka keran.
      </Title>

      <svg
        viewBox="0 120 1080 900"
        style={{ position: "absolute", top: 560, left: 0, width: 1080, height: 900 }}
      >
        {/* pipe + tap */}
        <rect x={0} y={190} width={560} height={60} fill={C.pipe} />
        <rect x={0} y={208} width={560} height={24} fill={C.waterLight} opacity={0.5} />
        <rect x={520} y={170} width={140} height={100} rx={26} fill={C.pipeDark} />
        <path d="M 600 260 L 600 300 Q 600 320 620 320 L 640 320 L 640 260 Z" fill={C.pipeDark} />
        <g transform={`rotate(${handle} 590 170)`}>
          <rect x={584} y={110} width={12} height={60} fill={C.pipeDark} />
          <rect x={530} y={98} width={120} height={26} rx={13} fill={C.bucket} />
        </g>

        {/* water stream */}
        <rect
          x={606}
          y={318}
          width={28}
          height={(surface - 318) * stream}
          rx={14}
          fill={C.water}
          opacity={stream > 0 ? 1 : 0}
        />

        {/* glass */}
        <clipPath id="glass">
          <path d="M 470 600 L 770 600 L 740 980 L 500 980 Z" />
        </clipPath>
        <path d="M 470 600 L 770 600 L 740 980 L 500 980 Z" fill={C.white} opacity={0.7} />
        <path
          d={wavePath(440, 800, surface, 6, 90, frame / 4, 1000)}
          fill={C.water}
          clipPath="url(#glass)"
          opacity={level > 0.005 ? 1 : 0}
        />
        <path d="M 470 600 L 770 600 L 740 980 L 500 980 Z" fill="none"
          stroke={C.pipeDark} strokeWidth={8} strokeLinejoin="round" />
        <rect x={500} y={640} width={18} height={240} rx={9} fill={C.white} opacity={0.6} />
      </svg>

      <div
        style={{
          position: "absolute",
          top: 1450,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <Badge at={100}>Cepat</Badge>
        <Badge at={115}>Bersih</Badge>
        <Badge at={130}>Otomatis</Badge>
      </div>

      <Caption from={150} to={250}>
        Laporan &amp; dashboard siap kapan pun dibutuhkan.
      </Caption>
    </SceneBg>
  );
};
