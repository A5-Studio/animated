import { interpolate, useCurrentFrame } from "remotion";
import {
  B,
  border,
  BrutalBg,
  Bucket,
  Caption,
  clamp,
  Mark,
  popIn,
  SAFE,
  shadow,
  snap,
  Title,
  Sfx,
} from "./kit";

const START = 20;
const CYCLE = 50;
// Bucket centre y (screen px) at the river and at the team.
const TOP_Y = 735;
const BOTTOM_Y = 885;
const TRACK_X = 300;

const Block: React.FC<{
  readonly top: number;
  readonly color: string;
  readonly at: number;
  readonly title: string;
  readonly sub: string;
}> = ({ top, color, at, title, sub }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: SAFE.width - 10,
        height: 120,
        boxSizing: "border-box",
        background: color,
        border,
        boxShadow: shadow(),
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 28px",
        ...popIn(frame, at),
      }}
    >
      <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: -1 }}>
        {title}
      </div>
      <div style={{ fontSize: 34, fontWeight: 500 }}>{sub}</div>
    </div>
  );
};

export const BrutalBucket: React.FC = () => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - START);
  const t = local % CYCLE;
  // 0–10 fill at river, 10–18 snap down, 18–30 pour, 30–38 snap up, 38–50 rest.
  const y = interpolate(
    t,
    [10, 18, 30, 38],
    [TOP_Y, BOTTOM_Y, BOTTOM_Y, TOP_Y],
    {
      ...clamp,
      easing: snap,
    },
  );
  const fill = interpolate(t, [0, 8, 20, 28], [0, 1, 1, 0], clamp);
  const tilt = interpolate(t, [18, 22, 26, 30], [0, -35, -35, 0], clamp);
  const trips = frame < START + 22 ? 0 : Math.floor((local - 22) / CYCLE) + 1;
  const sinceTrip = (local - 22) % CYCLE;
  const bump =
    trips > 0 ? interpolate(sinceTrip, [0, 4, 10], [1, 1.25, 1], clamp) : 1;

  return (
    <BrutalBg>
      <Title kicker="CARA 1" kickerColor={B.orange}>
        Ambil pakai <Mark color={B.orange}>ember</Mark>
      </Title>

      <Block
        top={530}
        color={B.water}
        at={6}
        title="SUNGAI"
        sub="sumber data"
      />
      <Block
        top={955}
        color={B.pink}
        at={12}
        title="TIM BISNIS"
        sub="butuh data"
      />

      {/* dashed track between the two blocks */}
      <div
        style={{
          position: "absolute",
          left: TRACK_X - 3,
          top: 660,
          height: 290,
          borderLeft: `6px dashed ${B.ink}`,
          opacity: interpolate(frame, [14, 20], [0, 1], clamp),
        }}
      />

      {/* bucket */}
      <svg
        viewBox="-60 -60 120 140"
        style={{
          position: "absolute",
          left: TRACK_X - 60,
          top: y - 70,
          width: 120,
          height: 140,
          ...popIn(frame, 16),
          rotate: `${tilt}deg`,
        }}
      >
        <Bucket fill={fill} id="b-bucket" />
      </svg>

      {/* trip counter */}
      <div
        style={{
          position: "absolute",
          left: 440,
          top: 690,
          width: 380,
          height: 230,
          boxSizing: "border-box",
          background: B.yellow,
          border,
          boxShadow: shadow(),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          ...popIn(frame, 20, 2),
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>
          BOLAK-BALIK
        </div>
        <div
          style={{ fontSize: 120, fontWeight: 700, lineHeight: 1, scale: bump }}
        >
          {trips}×
        </div>
      </div>

      <Caption from={20} to={165}>
        Butuh data? Ambil sendiri, manual.
      </Caption>
      <Caption from={170} to={340}>
        Export, copy-paste, kirim email… lagi dan lagi.
      </Caption>
      <Sfx at={0} name="pop" />
      <Sfx at={6} name="thud" volume={0.6} />
      <Sfx at={12} name="thud" volume={0.6} />
      <Sfx at={20} name="pop" />
      <Sfx at={20} name="mouse-click" />
      {/* every trip: a whip as the bucket drops, a switch when the counter ticks */}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <Sfx
          key={`whip-${k}`}
          at={START + k * CYCLE + 10}
          name="whip"
          volume={0.25}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <Sfx
          key={`tick-${k}`}
          at={START + k * CYCLE + 22}
          name="switch"
          volume={0.45}
        />
      ))}
      <Sfx at={170} name="mouse-click" />
    </BrutalBg>
  );
};
