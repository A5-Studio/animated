import { useCurrentFrame } from "remotion";
import { B, border, BrutalBg, Drop, popIn, SAFE, shadow, Sfx } from "./kit";

export const BrutalOutro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BrutalBg color={B.yellow}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: SAFE.top,
          width: SAFE.width,
          height: SAFE.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 34,
        }}
      >
        <svg
          viewBox="-110 -180 220 300"
          style={{ width: 170, height: 230, ...popIn(frame, 0, -6) }}
        >
          <Drop r={90} fill={B.water} />
        </svg>
        <div
          style={{
            background: B.ink,
            color: B.white,
            border,
            boxShadow: shadow(12),
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -2,
            padding: "10px 30px",
            ...popIn(frame, 8, -2),
          }}
        >
          DATA PIPELINE
        </div>
        <div
          style={{
            background: B.water,
            border,
            boxShadow: shadow(),
            fontSize: 56,
            fontWeight: 700,
            padding: "8px 24px",
            ...popIn(frame, 18, 2),
          }}
        >
          = pipa untuk datamu
        </div>
        <div
          style={{
            background: B.white,
            border,
            boxShadow: shadow(),
            fontSize: 44,
            fontWeight: 700,
            padding: "14px 24px",
            maxWidth: SAFE.width - 20,
            textWrap: "balance",
            ...popIn(frame, 32, -1),
          }}
        >
          Bangun sekali, nikmati setiap hari.
        </div>
      </div>
      <Sfx at={0} name="pop" />
      <Sfx at={8} name="thud" volume={0.7} />
      <Sfx at={18} name="pop" />
      <Sfx at={32} name="ding" volume={0.5} />
    </BrutalBg>
  );
};
