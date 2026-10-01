import { interpolate, useCurrentFrame } from "remotion";
import { B, Caption, clamp, easeOut, Mark, Panel, snap, STROKE, Title, wavePath , BrutalBg } from "./kit";

const PIPES = [
  { d: "M 115 520 L 115 585", len: 65, from: 15, to: 30 },
  { d: "M 115 420 L 115 330 L 270 330", len: 245, from: 30, to: 70 },
  { d: "M 450 330 L 650 330 L 650 260", len: 270, from: 90, to: 130 },
  { d: "M 570 90 L 260 90 L 260 120", len: 340, from: 150, to: 185 },
];
const FLOW_START = 200;
const S = { stroke: B.ink, strokeWidth: STROKE, strokeLinejoin: "round" as const };

const popStyle = (frame: number, at: number): React.CSSProperties => ({
  transformBox: "fill-box",
  transformOrigin: "center",
  transform: `scale(${interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: snap })})`,
});

const Label: React.FC<{ readonly x: number; readonly y: number; readonly main: string; readonly sub: string }> = ({
  x, y, main, sub,
}) => (
  <>
    <text x={x} y={y} textAnchor="middle" fontSize={36} fontWeight={700} fill={B.ink}>{main}</text>
    <text x={x} y={y + 34} textAnchor="middle" fontSize={26} fontWeight={500} fill={B.ink}>{sub}</text>
  </>
);

export const BrutalPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const flow = interpolate(frame, [FLOW_START, FLOW_START + 10], [0, 1], clamp);
  const level = interpolate(frame, [FLOW_START + 15, 320], [0, 0.6], { ...clamp, easing: easeOut });

  return (
    <BrutalBg>
      <Title kicker="CARA 2" kickerColor={B.blue}>
        Bangun <Mark color={B.green}>pipa</Mark> sekali
      </Title>

      <Panel top={530} height={550} color={B.white}>
        <svg viewBox="0 0 840 640" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
          <rect x={-10} y={540} width={860} height={30} fill={B.grass} {...S} />
          <path d={wavePath(-10, 850, 580, 8, 160, frame / 6, 660)} fill={B.water} {...S} />
          <text x={720} y={628} textAnchor="middle" fontSize={30} fontWeight={700} fill={B.ink}>SUNGAI</text>

          {PIPES.map((p) => (
            <g key={p.d}>
              <path d={p.d} fill="none" stroke={B.ink} strokeWidth={40} strokeLinejoin="round"
                strokeDasharray={p.len} strokeDashoffset={interpolate(frame, [p.from, p.to], [p.len, 0], clamp)} />
              <path d={p.d} fill="none" stroke={B.grey} strokeWidth={26} strokeLinejoin="round"
                strokeDasharray={p.len} strokeDashoffset={interpolate(frame, [p.from, p.to], [p.len, 0], clamp)} />
              <path d={p.d} fill="none" stroke={B.waterLight} strokeWidth={12} strokeDasharray="22 18"
                strokeDashoffset={-frame * 5} opacity={flow} />
            </g>
          ))}

          <g style={popStyle(frame, 12)}>
            <rect x={30} y={420} width={170} height={100} fill={B.orange} {...S} />
            <Label x={115} y={462} main="AMBIL" sub="Extract" />
          </g>
          <g style={popStyle(frame, 68)}>
            <rect x={270} y={270} width={180} height={120} fill={B.yellow} {...S} />
            <Label x={360} y={325} main="SARING" sub="Transform" />
          </g>
          <g style={popStyle(frame, 126)}>
            <clipPath id="b-tank"><rect x={570} y={30} width={220} height={230} /></clipPath>
            <rect x={570} y={30} width={220} height={230} fill={B.white} />
            <rect x={570} y={260 - 230 * level} width={220} height={230} fill={B.waterLight} clipPath="url(#b-tank)" />
            <rect x={570} y={30} width={220} height={230} fill="none" {...S} />
            <Label x={680} y={140} main="SIMPAN" sub="Load" />
          </g>
          <g style={popStyle(frame, 182)}>
            <rect x={232} y={110} width={56} height={40} fill={B.grey} {...S} />
            <rect x={300} y={40} width={26} height={34} fill={B.pink} {...S} />
            <Label x={260} y={200} main="KERAN" sub="Dashboard & laporan" />
          </g>
        </svg>
      </Panel>

      <Caption from={10} to={195}>
        Usaha di awal: pipa, saringan, tandon.
      </Caption>
      <Caption from={200} to={340} color={B.green}>
        Setelah jadi, air mengalir sendiri.
      </Caption>
    </BrutalBg>
  );
};
