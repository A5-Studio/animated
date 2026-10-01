import { useCurrentFrame } from "remotion";
import {
  B,
  border,
  Caption,
  Mark,
  popIn,
  SAFE,
  shadow,
  Title,
  BrutalBg,
  Sfx,
} from "./kit";

const Cell: React.FC<{ readonly win: boolean; readonly children: string }> = ({
  win,
  children,
}) => (
  <div
    style={{
      flex: 1,
      background: win ? B.green : B.white,
      border,
      boxShadow: win ? shadow(6) : "none",
      padding: "14px 18px",
      fontSize: 34,
      fontWeight: win ? 700 : 500,
      color: win ? B.ink : "#555",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

const Row: React.FC<{
  readonly at: number;
  readonly label: string;
  readonly bucket: string;
  readonly pipe: string;
  readonly pipeWins: boolean;
}> = ({ at, label, bucket, pipe, pipeWins }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        ...popIn(frame, at),
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        <Cell win={!pipeWins}>{bucket}</Cell>
        <Cell win={pipeWins}>{pipe}</Cell>
      </div>
    </div>
  );
};

export const BrutalCompare: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BrutalBg>
      <Title>
        <Mark color={B.orange}>Ember</Mark> vs <Mark color={B.water}>Pipa</Mark>
      </Title>

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 400,
          width: SAFE.width - 10,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 18,
            fontSize: 40,
            fontWeight: 700,
            textAlign: "center",
            ...popIn(frame, 10),
          }}
        >
          <div
            style={{
              flex: 1,
              background: B.orange,
              border,
              boxShadow: shadow(6),
              padding: "8px 0",
            }}
          >
            EMBER
          </div>
          <div
            style={{
              flex: 1,
              background: B.water,
              border,
              boxShadow: shadow(6),
              padding: "8px 0",
            }}
          >
            PIPA
          </div>
        </div>
        <Row
          at={25}
          label="USAHA DI AWAL"
          bucket="Kecil"
          pipe="Besar"
          pipeWins={false}
        />
        <Row
          at={50}
          label="SETIAP HARI"
          bucket="Capek, berulang"
          pipe="Otomatis"
          pipeWins
        />
        <Row
          at={75}
          label="KUALITAS"
          bucket="Sering tumpah"
          pipe="Bersih"
          pipeWins
        />
        <Row
          at={100}
          label="SAAT TUMBUH"
          bucket="Kewalahan"
          pipe="Tinggal perbesar"
          pipeWins
        />
      </div>

      <Caption from={140} to={250} color={B.yellow}>
        Jangka panjang? Pipa menang telak.
      </Caption>
      <Sfx at={4} name="pop" />
      <Sfx at={10} name="thud" volume={0.6} />
      <Sfx at={25} name="pop" />
      <Sfx at={50} name="pop" />
      <Sfx at={75} name="pop" />
      <Sfx at={100} name="pop" />
      <Sfx at={140} name="mouse-click" />
    </BrutalBg>
  );
};
