import { interpolate, useCurrentFrame } from "remotion";
import { C, clamp, easeOut, pop } from "../theme";
import { Caption, Drop, SceneBg, Title } from "../ui";

const Chip: React.FC<{ readonly at: number; readonly children: string }> = ({
  at,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        background: C.white,
        color: C.waterDark,
        fontSize: 44,
        fontWeight: 700,
        padding: "18px 34px",
        borderRadius: 999,
        boxShadow: "0 10px 24px rgba(27,125,176,0.18)",
        opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
        scale: interpolate(frame, [at, at + 18], [0.6, 1], {
          ...clamp,
          easing: pop,
        }),
      }}
    >
      {children}
    </div>
  );
};

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneBg>
      <Title sub="Semua tim butuh. Setiap hari.">
        Data itu seperti <span style={{ color: C.water }}>air</span>
      </Title>

      <svg
        viewBox="-300 -300 600 600"
        style={{
          position: "absolute",
          left: 240,
          top: 640,
          width: 600,
          height: 600,
          scale: interpolate(frame, [10, 35], [0, 1], { ...clamp, easing: pop }),
        }}
      >
        {[0, 1, 2].map((i) => {
          const t = ((frame + i * 25) % 75) / 75;
          return (
            <ellipse
              key={i}
              cx={0}
              cy={190}
              rx={80 + t * 200}
              ry={20 + t * 50}
              fill="none"
              stroke={C.water}
              strokeWidth={6}
              opacity={(1 - t) * 0.6}
            />
          );
        })}
        <g transform={`translate(0 ${Math.sin(frame / 12) * 12 - 10})`}>
          <Drop r={130} />
          <ellipse cx={-50} cy={20} rx={22} ry={40} fill={C.white} opacity={0.5} />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          top: 1290,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <Chip at={45}>Laporan</Chip>
        <Chip at={57}>Dashboard</Chip>
        <Chip at={69}>Keputusan</Chip>
      </div>

      <Caption from={95} to={160}>
        Lalu, bagaimana cara mengambilnya?
      </Caption>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.bg,
          opacity: interpolate(frame, [0, 10], [1, 0], { ...clamp, easing: easeOut }),
        }}
      />
    </SceneBg>
  );
};
