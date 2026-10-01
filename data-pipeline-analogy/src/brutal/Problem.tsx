import { useCurrentFrame } from "remotion";
import { B, border, Caption, Drop, popIn, SAFE, shadow, Title , BrutalBg } from "./kit";

const Icon: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="-55 -55 110 110" style={{ width: 100, height: 100, flexShrink: 0, background: B.white, border }}>
    {children}
  </svg>
);

const Card: React.FC<{
  readonly at: number;
  readonly color: string;
  readonly rotate: number;
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly desc: string;
}> = ({ at, color, rotate, icon, title, desc }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        background: color,
        border,
        boxShadow: shadow(),
        padding: "20px 22px",
        ...popIn(frame, at, rotate),
      }}
    >
      <Icon>{icon}</Icon>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 48, fontWeight: 700, textTransform: "uppercase", letterSpacing: -1 }}>
          {title}
        </div>
        <div style={{ fontSize: 34, fontWeight: 500 }}>{desc}</div>
      </div>
    </div>
  );
};

export const BrutalProblem: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BrutalBg>
      <Title kicker="MASALAHNYA" kickerColor={B.red}>
        Cara ember bikin capek
      </Title>

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 540,
          width: SAFE.width - 10,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <Card at={18} color={B.yellow} rotate={-1} title="Lambat" desc="Setiap permintaan harus antre."
          icon={
            <g>
              <circle r={36} fill={B.white} stroke={B.ink} strokeWidth={6} />
              <line y2={-24} stroke={B.ink} strokeWidth={7} strokeLinecap="round" transform={`rotate(${frame * 12})`} />
              <line x2={16} stroke={B.ink} strokeWidth={7} strokeLinecap="round" transform={`rotate(${frame})`} />
            </g>
          }
        />
        <Card at={45} color={B.blue} rotate={1} title="Tumpah di jalan" desc="Data hilang & salah ketik."
          icon={
            <g transform="translate(0 6)">
              <g transform="scale(0.8)"><Drop r={28} /></g>
              <line x1={-34} y1={34} x2={34} y2={-38} stroke={B.red} strokeWidth={9} strokeLinecap="round" />
            </g>
          }
        />
        <Card at={72} color={B.pink} rotate={-1} title="Diulang terus" desc="Besok? Ambil lagi dari nol."
          icon={
            <g transform={`rotate(${frame * 6})`}>
              <path d="M 0 -32 A 32 32 0 1 1 -30 -10" fill="none" stroke={B.ink} strokeWidth={8} strokeLinecap="round" />
              <path d="M -44 -20 L -30 2 L -14 -18 Z" fill={B.ink} />
            </g>
          }
        />
      </div>

      <Caption from={110} to={220} color={B.green}>
        Makin banyak yang butuh, makin kewalahan.
      </Caption>
    </BrutalBg>
  );
};
