import { interpolate, useCurrentFrame } from "remotion";
import {
  B,
  border,
  BrutalBg,
  Caption,
  clamp,
  Mark,
  Panel,
  popIn,
  SAFE,
  Sfx,
  Title,
} from "../brutal/kit";
import { Check } from "./parts";

const ROW_H = 78;
const RUN = 150;
// Frame each step becomes the active one while the "program" runs; step 4 loops 3×.
const ACTIVE = [RUN, RUN + 15, RUN + 30, RUN + 45, RUN + 105];
const LOOP_TICKS = [RUN + 45, RUN + 65, RUN + 85];

const Line: React.FC<{
  readonly i: number;
  readonly at: number;
  readonly indent?: boolean;
  readonly loop?: boolean;
  readonly children: React.ReactNode;
}> = ({ i, at, indent, loop, children }) => {
  const frame = useCurrentFrame();
  const active =
    frame >= ACTIVE[i] && (i === ACTIVE.length - 1 || frame < ACTIVE[i + 1]);
  return (
    <div
      style={{
        height: ROW_H,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 20px",
        background: active ? B.yellow : "transparent",
        borderTop: active ? border : "6px solid transparent",
        borderBottom: active ? border : "6px solid transparent",
        boxSizing: "border-box",
        ...popIn(frame, at),
      }}
    >
      <div style={{ width: 40, fontSize: 32, fontWeight: 700, color: "#888" }}>
        {i + 1}
      </div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 700,
          paddingLeft: indent ? 30 : 0,
          flex: 1,
        }}
      >
        {children}
      </div>
      {loop ? <LoopCount /> : null}
    </div>
  );
};

const LoopCount: React.FC = () => {
  const frame = useCurrentFrame();
  const n = LOOP_TICKS.filter((t) => frame >= t).length;
  return (
    <div
      style={{
        background: B.pink,
        border,
        padding: "2px 12px",
        fontSize: 30,
        fontWeight: 700,
        opacity: n ? 1 : 0,
      }}
    >
      ×{n}
    </div>
  );
};

export const CtAlgorithm: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BrutalBg>
      <Title kicker="4 · ALGORITMA" kickerColor={B.yellow}>
        Susun <Mark color={B.yellow}>langkah</Mark> urut
      </Title>

      <Panel top={540} height={500} color={B.white}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: border,
            background: B.ink,
            color: B.white,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          <span>resep.txt</span>
          <span
            style={{
              background: B.green,
              color: B.ink,
              padding: "0 12px",
              opacity: interpolate(frame, [RUN - 6, RUN], [0, 1], clamp),
            }}
          >
            ▶ JALAN
          </span>
        </div>
        <div style={{ paddingTop: 8 }}>
          <Line i={0} at={20}>
            Panaskan minyak
          </Line>
          <Line i={1} at={40}>
            Tumis bumbu
          </Line>
          <Line i={2} at={60}>
            Masukkan nasi
          </Line>
          <Line i={3} at={80} loop>
            Aduk <span style={{ color: "#C2185B" }}>sampai panas</span>
          </Line>
          <Line i={4} at={100}>
            Sajikan
          </Line>
        </div>
      </Panel>

      <div
        style={{
          position: "absolute",
          left: SAFE.right - 120,
          top: 975,
          ...popIn(frame, ACTIVE[4] + 6, -6),
        }}
      >
        <Check size={90} />
      </div>

      <Caption from={RUN + 120} to={310} color={B.green}>
        Langkah jelas → siapa pun bisa mengikuti.
      </Caption>

      <Sfx at={0} name="pop" />
      <Sfx at={6} name="thud" volume={0.6} />
      {[20, 40, 60, 80, 100].map((at) => (
        <Sfx key={at} at={at} name="mouse-click" volume={0.4} />
      ))}
      <Sfx at={RUN - 6} name="switch" volume={0.6} />
      {[ACTIVE[0], ACTIVE[1], ACTIVE[2], ...LOOP_TICKS, ACTIVE[4]].map((at) => (
        <Sfx key={`run-${at}`} at={at} name="pop" volume={0.45} />
      ))}
      <Sfx at={ACTIVE[4] + 6} name="ding" volume={0.45} />
      <Sfx at={RUN + 120} name="mouse-click" />
    </BrutalBg>
  );
};
