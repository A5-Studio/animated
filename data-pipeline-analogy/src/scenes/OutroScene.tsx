import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, clamp, easeOut, pop } from "../theme";
import { Drop, SceneBg } from "../ui";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneBg dark>
      <svg viewBox="0 0 1080 200" style={{ position: "absolute", top: 1380, left: 0, width: 1080, height: 200 }}>
        <path d="M -20 100 L 1100 100" stroke={C.pipe} strokeWidth={50} />
        <path
          d="M -20 100 L 1100 100"
          stroke={C.waterLight}
          strokeWidth={20}
          strokeLinecap="round"
          strokeDasharray="40 30"
          strokeDashoffset={-frame * 6}
        />
      </svg>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "0 80px",
          gap: 36,
          paddingBottom: 200,
        }}
      >
        <svg
          viewBox="-120 -200 240 340"
          style={{
            width: 200,
            height: 280,
            scale: interpolate(frame, [0, 20], [0, 1], { ...clamp, easing: pop }),
          }}
        >
          <Drop r={100} fill={C.waterLight} />
        </svg>
        <div
          style={{
            fontSize: 100,
            fontWeight: 800,
            lineHeight: 1.05,
            opacity: interpolate(frame, [8, 22], [0, 1], clamp),
            translate: interpolate(frame, [8, 26], ["0px 40px", "0px 0px"], {
              ...clamp,
              easing: easeOut,
            }),
          }}
        >
          Data pipeline
          <br />
          <span style={{ color: C.waterLight }}>= pipa untuk datamu</span>
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: "#B9D9EA",
            opacity: interpolate(frame, [35, 50], [0, 1], clamp),
          }}
        >
          Bangun sekali, nikmati setiap hari.
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};
