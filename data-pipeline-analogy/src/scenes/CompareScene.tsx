import { interpolate, useCurrentFrame } from "remotion";
import { C, clamp, easeOut } from "../theme";
import { Caption, SceneBg, Title } from "../ui";

const Cell: React.FC<{
  readonly bg: string;
  readonly win: boolean;
  readonly children: string;
}> = ({ bg, win, children }) => (
  <div
    style={{
      flex: 1,
      background: bg,
      borderRadius: 24,
      padding: "22px 26px",
      fontSize: 42,
      fontWeight: win ? 800 : 600,
      color: win ? C.ink : C.muted,
      lineHeight: 1.25,
      outline: win ? `5px solid ${C.good}` : "none",
      outlineOffset: -5,
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
        gap: 12,
        opacity: interpolate(frame, [at, at + 10], [0, 1], clamp),
        translate: interpolate(frame, [at, at + 18], ["0px 40px", "0px 0px"], {
          ...clamp,
          easing: easeOut,
        }),
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 700, color: C.muted, letterSpacing: 2 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <Cell bg={C.bucketSoft} win={!pipeWins}>
          {bucket}
        </Cell>
        <Cell bg={C.pipeSoft} win={pipeWins}>
          {pipe}
        </Cell>
      </div>
    </div>
  );
};

export const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneBg>
      <Title>
        <span style={{ color: C.bucketDark }}>Ember</span> vs{" "}
        <span style={{ color: C.water }}>Pipa</span>
      </Title>

      <div
        style={{
          position: "absolute",
          top: 400,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 48,
            fontWeight: 800,
            textAlign: "center",
            color: C.white,
            opacity: interpolate(frame, [10, 20], [0, 1], clamp),
          }}
        >
          <div style={{ flex: 1, background: C.bucket, borderRadius: 24, padding: "16px 0" }}>
            Ember
          </div>
          <div style={{ flex: 1, background: C.water, borderRadius: 24, padding: "16px 0" }}>
            Pipa
          </div>
        </div>
        <Row at={25} label="USAHA DI AWAL" bucket="Kecil, langsung jalan" pipe="Besar, perlu dibangun" pipeWins={false} />
        <Row at={55} label="SETIAP HARI" bucket="Capek, berulang" pipe="Mengalir otomatis" pipeWins />
        <Row at={85} label="KUALITAS" bucket="Sering tumpah" pipe="Tersaring & bersih" pipeWins />
        <Row at={115} label="SAAT KEBUTUHAN TUMBUH" bucket="Makin kewalahan" pipe="Tinggal perbesar pipa" pipeWins />
      </div>

      <Caption from={150} to={250}>
        Untuk jangka panjang, pipa jauh lebih hemat tenaga.
      </Caption>
    </SceneBg>
  );
};
