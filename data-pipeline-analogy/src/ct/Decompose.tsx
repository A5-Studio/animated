import { interpolate, useCurrentFrame } from "remotion";
import {
  B,
  BrutalBg,
  Caption,
  clamp,
  Mark,
  SAFE,
  Sfx,
  Title,
} from "../brutal/kit";
import { Card, NumBadge } from "./parts";

const W = SAFE.width - 10;
const HALF = (W - 20) / 2;

const Part: React.FC<{
  readonly at: number;
  readonly n: number;
  readonly color: string;
  readonly children: string;
}> = ({ at, n, color, children }) => (
  <Card
    at={at}
    color={color}
    rotate={n % 2 ? -1.5 : 1.5}
    style={{
      width: HALF,
      height: 150,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <NumBadge n={n} />
    <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.1 }}>
      {children}
    </div>
  </Card>
);

export const CtDecompose: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BrutalBg>
      <Title kicker="1 · DEKOMPOSISI" kickerColor={B.green}>
        Pecah jadi <Mark color={B.green}>bagian kecil</Mark>
      </Title>

      <div
        style={{ position: "absolute", left: SAFE.left, top: 545, width: W }}
      >
        <Card
          at={8}
          color={B.yellow}
          style={{
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          MASAK NASI GORENG
        </Card>
      </div>

      {/* arrow from the big task to its parts */}
      <svg
        viewBox="0 0 60 60"
        style={{
          position: "absolute",
          left: SAFE.left + W / 2 - 30,
          top: 660,
          width: 60,
          height: 55,
          opacity: interpolate(frame, [30, 36], [0, 1], clamp),
        }}
      >
        <path
          d="M 30 4 L 30 40 M 14 26 L 30 44 L 46 26"
          fill="none"
          stroke={B.ink}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 725,
          width: W,
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <Part at={40} n={1} color={B.white}>
          Siapkan bahan
        </Part>
        <Part at={55} n={2} color={B.white}>
          Tumis bumbu
        </Part>
        <Part at={70} n={3} color={B.white}>
          Masukkan nasi
        </Part>
        <Part at={85} n={4} color={B.white}>
          Aduk &amp; sajikan
        </Part>
      </div>

      <Caption from={120} to={250} color={B.green}>
        Masalah besar → tugas kecil yang mudah.
      </Caption>

      <Sfx at={0} name="pop" />
      <Sfx at={8} name="thud" volume={0.6} />
      <Sfx at={30} name="whip" volume={0.35} />
      {[40, 55, 70, 85].map((at) => (
        <Sfx key={at} at={at} name="pop" />
      ))}
      <Sfx at={120} name="mouse-click" />
    </BrutalBg>
  );
};
