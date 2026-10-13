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
  Title,
} from "../brutal/kit";

const W = SAFE.width - 10;
const HALF = (W - 20) / 2;
const SORT = 100;

const Item: React.FC<{
  readonly at: number;
  readonly keep: boolean;
  readonly children: string;
}> = ({ at, keep, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [SORT, SORT + 12], [0, 1], clamp);
  const pop = popIn(frame, at, keep ? -1 : 1);
  return (
    <div
      style={{
        position: "relative",
        width: HALF,
        height: 110,
        boxSizing: "border-box",
        border,
        background: t > 0.5 ? (keep ? B.green : "#E4E4E4") : B.white,
        boxShadow:
          keep && t > 0.5 ? `10px 10px 0 ${B.ink}` : `6px 6px 0 ${B.ink}`,
        display: "flex",
        alignItems: "center",
        padding: "0 22px",
        fontSize: 38,
        fontWeight: 700,
        color: !keep && t > 0.5 ? "#777" : B.ink,
        ...pop,
        opacity: (pop.opacity as number) * (keep ? 1 : 1 - 0.45 * t),
        scale: frame < at + 12 ? pop.scale : keep ? 1 + 0.04 * t : 1 - 0.06 * t,
      }}
    >
      {children}
      {!keep ? (
        <div
          style={{
            position: "absolute",
            left: 14,
            top: 51,
            height: 8,
            background: B.red,
            width: `${t * (HALF - 40)}px`,
          }}
        />
      ) : null}
    </div>
  );
};

export const CtAbstract: React.FC = () => (
  <BrutalBg>
    <Title kicker="3 · ABSTRAKSI" kickerColor={B.pink}>
      Fokus yang <Mark color={B.pink}>penting</Mark>
    </Title>

    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 545,
        width: W,
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
      }}
    >
      <Item at={15} keep>
        Nasi
      </Item>
      <Item at={25} keep={false}>
        Merek kompor
      </Item>
      <Item at={35} keep={false}>
        Warna wajan
      </Item>
      <Item at={45} keep>
        Bumbu
      </Item>
      <Item at={55} keep>
        Api sedang
      </Item>
      <Item at={65} keep={false}>
        Jam masak
      </Item>
    </div>

    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 960,
        width: W,
        display: "flex",
        gap: 20,
        fontSize: 32,
        fontWeight: 700,
      }}
    >
      <AbstractLegend />
    </div>

    <Caption from={140} to={250}>
      Buang detail yang tidak mengubah hasil.
    </Caption>

    <Sfx at={0} name="pop" />
    {[15, 25, 35, 45, 55, 65].map((at) => (
      <Sfx key={at} at={at} name="pop" volume={0.4} />
    ))}
    <Sfx at={SORT} name="whip" volume={0.5} />
    <Sfx at={SORT + 6} name="page-turn" volume={0.6} />
    <Sfx at={140} name="mouse-click" />
  </BrutalBg>
);

const AbstractLegend: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <div
        style={{
          ...popIn(frame, SORT + 14, -2),
          background: B.green,
          border,
          padding: "6px 16px",
        }}
      >
        dipakai
      </div>
      <div
        style={{
          ...popIn(frame, SORT + 20, 2),
          background: "#E4E4E4",
          border,
          padding: "6px 16px",
        }}
      >
        diabaikan
      </div>
    </>
  );
};
