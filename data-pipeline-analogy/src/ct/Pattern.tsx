import { interpolate, useCurrentFrame } from "remotion";
import {
  B,
  border,
  BrutalBg,
  Caption,
  clamp,
  Mark,
  popIn,
  SAFE,
  Sfx,
  Sticker,
  Title,
} from "../brutal/kit";

const W = SAFE.width - 10;
const CHIP_W = (W - 2 * 16) / 3;
const HIGHLIGHT = 115;

const Chip: React.FC<{ readonly same: boolean; readonly children: string }> = ({
  same,
  children,
}) => {
  const frame = useCurrentFrame();
  const on = frame >= HIGHLIGHT;
  return (
    <div
      style={{
        width: CHIP_W,
        height: 70,
        boxSizing: "border-box",
        border,
        background: on ? (same ? B.green : B.yellow) : B.white,
        boxShadow: on && same ? `6px 6px 0 ${B.ink}` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
};

const Dish: React.FC<{
  readonly at: number;
  readonly name: string;
  readonly main: string;
}> = ({ at, name, main }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        ...popIn(frame, at),
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 700 }}>{name}</div>
      <div style={{ display: "flex", gap: 16 }}>
        <Chip same>Bumbu</Chip>
        <Chip same={false}>{`+ ${main}`}</Chip>
        <Chip same>Aduk</Chip>
      </div>
    </div>
  );
};

export const CtPattern: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BrutalBg>
      <Title kicker="2 · POLA" kickerColor={B.blue}>
        Cari yang <Mark color={B.blue}>sama</Mark>
      </Title>

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 475,
          width: W,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <Dish at={20} name="Nasi goreng" main="Nasi" />
        <Dish at={45} name="Mie goreng" main="Mie" />
        <Dish at={70} name="Kwetiau goreng" main="Kwetiau" />
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 905,
          width: W,
          display: "flex",
          gap: 16,
          opacity: interpolate(
            frame,
            [HIGHLIGHT + 10, HIGHLIGHT + 16],
            [0, 1],
            clamp,
          ),
        }}
      >
        <div
          style={{
            width: CHIP_W,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          sama ✓
        </div>
        <div
          style={{
            width: CHIP_W,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          beda
        </div>
        <div
          style={{
            width: CHIP_W,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          sama ✓
        </div>
      </div>

      <div style={{ position: "absolute", left: SAFE.left, top: 975 }}>
        <Sticker at={150} color={B.yellow} rotate={-2} style={{ fontSize: 36 }}>
          Pola: bumbu → bahan → aduk
        </Sticker>
      </div>

      <Caption from={175} to={280}>
        Ketemu pola = satu cara untuk banyak masalah.
      </Caption>

      <Sfx at={0} name="pop" />
      <Sfx at={20} name="thud" volume={0.55} />
      <Sfx at={45} name="thud" volume={0.55} />
      <Sfx at={70} name="thud" volume={0.55} />
      <Sfx at={HIGHLIGHT} name="switch" volume={0.6} />
      <Sfx at={HIGHLIGHT + 10} name="ding" volume={0.35} />
      <Sfx at={150} name="pop" />
      <Sfx at={175} name="mouse-click" />
    </BrutalBg>
  );
};
