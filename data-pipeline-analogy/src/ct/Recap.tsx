import { B, BrutalBg, Caption, Mark, SAFE, Sfx, Title } from "../brutal/kit";
import { Card, NumBadge } from "./parts";

const W = SAFE.width - 10;
const HALF = (W - 20) / 2;

const Pillar: React.FC<{
  readonly at: number;
  readonly n: number;
  readonly color: string;
  readonly name: string;
  readonly sub: string;
}> = ({ at, n, color, name, sub }) => (
  <Card
    at={at}
    color={color}
    rotate={n % 2 ? -1 : 1}
    style={{
      width: HALF,
      height: 250,
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <NumBadge n={n} />
    <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -1 }}>
      {name}
    </div>
    <div style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.15 }}>{sub}</div>
  </Card>
);

export const CtRecap: React.FC = () => (
  <BrutalBg>
    <Title kicker="RINGKASNYA" kickerColor={B.purple}>
      4 langkah <Mark color={B.yellow}>berpikir</Mark>
    </Title>

    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 550,
        width: W,
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
      }}
    >
      <Pillar
        at={15}
        n={1}
        color={B.green}
        name="DEKOMPOSISI"
        sub="Pecah masalah besar"
      />
      <Pillar at={30} n={2} color={B.blue} name="POLA" sub="Cari yang sama" />
      <Pillar
        at={45}
        n={3}
        color={B.pink}
        name="ABSTRAKSI"
        sub="Fokus yang penting"
      />
      <Pillar
        at={60}
        n={4}
        color={B.yellow}
        name="ALGORITMA"
        sub="Susun langkah urut"
      />
    </div>

    <Caption from={95} to={220}>
      Dipakai programmer, dan kamu, setiap hari.
    </Caption>

    <Sfx at={0} name="pop" />
    {[15, 30, 45, 60].map((at) => (
      <Sfx key={at} at={at} name="thud" volume={0.55} />
    ))}
    <Sfx at={95} name="mouse-click" />
  </BrutalBg>
);
