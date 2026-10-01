import { interpolate, useCurrentFrame } from "remotion";
import { C, clamp, easeOut, pop } from "../theme";
import { Caption, SceneBg, Title, wavePath } from "../ui";

const PIPES = [
  { d: "M 220 910 L 220 1010", len: 100, from: 15, to: 35 },
  { d: "M 220 800 L 220 640 L 440 640", len: 380, from: 35, to: 75 },
  { d: "M 640 640 L 840 640 L 840 470", len: 370, from: 95, to: 135 },
  { d: "M 740 250 L 330 250 L 330 285", len: 445, from: 155, to: 190 },
];

const FLOW_START = 200;

// Scales an SVG group in from its own centre.
const popStyle = (frame: number, at: number): React.CSSProperties => ({
  transformBox: "fill-box",
  transformOrigin: "center",
  transform: `scale(${interpolate(frame, [at, at + 18], [0, 1], { ...clamp, easing: pop })})`,
});

export const PipelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const flow = interpolate(frame, [FLOW_START, FLOW_START + 15], [0, 1], clamp);
  const level = interpolate(frame, [FLOW_START + 20, 320], [0, 0.75], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <SceneBg>
      <Title kicker="CARA 2" kickerColor={C.water}>
        Bangun pipa, sekali saja
      </Title>

      <svg
        viewBox="0 150 1080 950"
        style={{
          position: "absolute",
          top: 540,
          left: 0,
          width: 1080,
          height: 950,
        }}
      >
        {/* river */}
        <rect x={0} y={930} width={1080} height={40} fill={C.grass} />
        <path d={wavePath(0, 1080, 975, 10, 180, frame / 6, 1100)} fill={C.water} />
        <text x={900} y={1060} textAnchor="middle" fontSize={38} fontWeight={800} fill={C.white}>
          SUNGAI
        </text>

        {/* pipes */}
        {PIPES.map((p) => (
          <path
            key={p.d}
            d={p.d}
            fill="none"
            stroke={C.pipe}
            strokeWidth={34}
            strokeLinejoin="round"
            strokeDasharray={p.len}
            strokeDashoffset={interpolate(frame, [p.from, p.to], [p.len, 0], clamp)}
          />
        ))}
        {/* water moving through the pipes */}
        {PIPES.map((p) => (
          <path
            key={`flow-${p.d}`}
            d={p.d}
            fill="none"
            stroke={C.waterLight}
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="28 22"
            strokeDashoffset={-frame * 5}
            opacity={flow}
          />
        ))}

        {/* 1. pump: extract */}
        <g style={popStyle(frame, 12)}>
          <rect x={120} y={790} width={200} height={130} rx={24} fill={C.pipeDark} />
          <text x={220} y={850} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.white}>
            AMBIL
          </text>
          <text x={220} y={893} textAnchor="middle" fontSize={28} fontWeight={600} fill={C.waterLight}>
            Extract
          </text>
        </g>

        {/* 2. filter: transform */}
        <g style={popStyle(frame, 72)}>
          <rect x={430} y={560} width={220} height={160} rx={24} fill={C.white}
            stroke={C.pipeDark} strokeWidth={8} />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={460 + i * 40} y1={575} x2={460 + i * 40} y2={600}
              stroke={C.pipe} strokeWidth={6} strokeLinecap="round" />
          ))}
          <text x={540} y={655} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.ink}>
            SARING
          </text>
          <text x={540} y={697} textAnchor="middle" fontSize={28} fontWeight={600} fill={C.waterDark}>
            Transform
          </text>
        </g>

        {/* 3. tank: load */}
        <g style={popStyle(frame, 128)}>
          <clipPath id="tank">
            <rect x={740} y={170} width={200} height={300} rx={28} />
          </clipPath>
          <rect x={740} y={170} width={200} height={300} rx={28} fill={C.white} />
          <rect
            x={740}
            y={470 - 300 * level}
            width={200}
            height={300}
            fill={C.waterLight}
            clipPath="url(#tank)"
          />
          <rect x={740} y={170} width={200} height={300} rx={28} fill="none"
            stroke={C.pipeDark} strokeWidth={8} />
          <text x={840} y={240} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.ink}>
            SIMPAN
          </text>
          <text x={840} y={282} textAnchor="middle" fontSize={28} fontWeight={600} fill={C.waterDark}>
            Load
          </text>
        </g>

        {/* 4. tap */}
        <g style={popStyle(frame, 185)}>
          <rect x={300} y={270} width={60} height={40} rx={10} fill={C.pipeDark} />
          <rect x={368} y={196} width={26} height={40} rx={8} fill={C.bucket} />
          <text x={330} y={370} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.ink}>
            KERAN
          </text>
          <text x={330} y={412} textAnchor="middle" fontSize={28} fontWeight={600} fill={C.muted}>
            Dashboard &amp; laporan
          </text>
        </g>
      </svg>

      <Caption from={10} to={195}>
        Butuh usaha di awal: pipa, saringan, tandon.
      </Caption>
      <Caption from={200} to={340}>
        Setelah jadi, air mengalir sendiri. Otomatis.
      </Caption>
    </SceneBg>
  );
};
