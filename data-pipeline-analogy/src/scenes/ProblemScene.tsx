import { interpolate, useCurrentFrame } from "remotion";
import { C, clamp, easeOut } from "../theme";
import { Caption, Drop, SceneBg, Title } from "../ui";

const ClockIcon: React.FC<{ readonly frame: number }> = ({ frame }) => (
  <g>
    <circle r={44} fill="none" stroke={C.white} strokeWidth={8} />
    <line x1={0} y1={0} x2={0} y2={-28} stroke={C.white} strokeWidth={8} strokeLinecap="round"
      transform={`rotate(${frame * 12})`} />
    <line x1={0} y1={0} x2={18} y2={0} stroke={C.white} strokeWidth={8} strokeLinecap="round"
      transform={`rotate(${frame})`} />
  </g>
);

const SpillIcon: React.FC<{ readonly frame: number }> = ({ frame }) => (
  <g transform={`translate(0 ${Math.sin(frame / 6) * 4})`}>
    <Drop r={26} fill={C.white} />
    <line x1={-38} y1={40} x2={38} y2={-40} stroke={C.danger} strokeWidth={9} strokeLinecap="round" />
  </g>
);

const LoopIcon: React.FC<{ readonly frame: number }> = ({ frame }) => (
  <g transform={`rotate(${frame * 6})`}>
    <path d="M 0 -40 A 40 40 0 1 1 -38 -12" fill="none" stroke={C.white} strokeWidth={8}
      strokeLinecap="round" />
    <path d="M -52 -24 L -36 -2 L -18 -22 Z" fill={C.white} />
  </g>
);

const ProblemCard: React.FC<{
  readonly at: number;
  readonly color: string;
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly desc: string;
}> = ({ at, color, icon, title, desc }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 36,
        background: C.white,
        borderRadius: 36,
        padding: "34px 40px",
        boxShadow: "0 14px 34px rgba(15,42,61,0.12)",
        opacity: interpolate(frame, [at, at + 10], [0, 1], clamp),
        translate: interpolate(frame, [at, at + 20], ["160px 0px", "0px 0px"], {
          ...clamp,
          easing: easeOut,
        }),
      }}
    >
      <svg viewBox="-70 -70 140 140" style={{ width: 140, height: 140, flexShrink: 0 }}>
        <circle r={70} fill={color} />
        {icon}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 56, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 40, fontWeight: 500, color: C.muted, lineHeight: 1.3 }}>
          {desc}
        </div>
      </div>
    </div>
  );
};

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneBg>
      <Title kicker="MASALAHNYA" kickerColor={C.danger}>
        Ember tidak bisa diandalkan
      </Title>

      <div
        style={{
          position: "absolute",
          top: 620,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 36,
        }}
      >
        <ProblemCard
          at={20}
          color={C.bucket}
          icon={<ClockIcon frame={frame} />}
          title="Lambat"
          desc="Setiap permintaan harus menunggu diambilkan."
        />
        <ProblemCard
          at={50}
          color={C.water}
          icon={<SpillIcon frame={frame} />}
          title="Tumpah di jalan"
          desc="Data hilang, salah ketik, beda versi."
        />
        <ProblemCard
          at={80}
          color={C.shirt}
          icon={<LoopIcon frame={frame} />}
          title="Diulang terus"
          desc="Besok? Ambil lagi dari nol."
        />
      </div>

      <Caption from={115} to={220}>
        Makin banyak yang butuh, makin kewalahan.
      </Caption>
    </SceneBg>
  );
};
