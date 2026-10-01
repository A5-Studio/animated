import { interpolate, useCurrentFrame } from "remotion";
import { B, Caption, Drop, Mark, Panel, SAFE, Sticker, STROKE, Title , BrutalBg } from "./kit";

export const BrutalIntro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BrutalBg>
      <Title kicker="DATA 101" kickerColor={B.yellow}>
        Data itu seperti <Mark color={B.water}>air</Mark>
      </Title>

      <Panel top={530} height={400} color={B.waterLight}>
        <svg viewBox="-352 -200 704 388" style={{ width: "100%", height: "100%" }}>
          {[0, 1, 2].map((i) => {
            const t = ((frame + i * 25) % 75) / 75;
            return (
              <ellipse
                key={i}
                cx={0}
                cy={130}
                rx={70 + t * 230}
                ry={16 + t * 40}
                fill="none"
                stroke={B.ink}
                strokeWidth={STROKE - 2}
                opacity={1 - t}
              />
            );
          })}
          <g
            transform={`translate(0 ${Math.sin(frame / 10) * 10}) scale(${interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`}
          >
            <Drop r={95} />
            <ellipse cx={-38} cy={10} rx={16} ry={30} fill={B.white} stroke={B.ink} strokeWidth={4} />
          </g>
        </svg>
      </Panel>

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 975,
          width: SAFE.width,
          display: "flex",
          gap: 18,
        }}
      >
        <Sticker at={40} color={B.pink} rotate={-4} style={{ fontSize: 34 }}>
          Laporan
        </Sticker>
        <Sticker at={50} color={B.green} rotate={3} style={{ fontSize: 34 }}>
          Dashboard
        </Sticker>
        <Sticker at={60} color={B.yellow} rotate={-2} style={{ fontSize: 34 }}>
          Keputusan
        </Sticker>
      </div>

      <Caption from={90} to={160}>
        Lalu, bagaimana cara mengambilnya?
      </Caption>
    </BrutalBg>
  );
};
