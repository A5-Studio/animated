import { useCurrentFrame } from "remotion";
import { B, border, BrutalBg, popIn, SAFE, Sfx, shadow } from "../brutal/kit";

export const CtOutro: React.FC = () => {
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
        <div
          style={{
            background: B.ink,
            color: B.white,
            border,
            boxShadow: shadow(12),
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.05,
            padding: "14px 30px",
            ...popIn(frame, 0, -2),
          }}
        >
          COMPUTATIONAL
          <br />
          THINKING
        </div>
        <div
          style={{
            background: B.green,
            border,
            boxShadow: shadow(),
            fontSize: 48,
            fontWeight: 700,
            padding: "8px 24px",
            ...popIn(frame, 12, 2),
          }}
        >
          = cara berpikir untuk
          <br />
          memecahkan masalah
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
            ...popIn(frame, 28, -1),
          }}
        >
          Coba pakai untuk masalahmu hari ini!
        </div>
      </div>
      <Sfx at={0} name="thud" volume={0.7} />
      <Sfx at={12} name="pop" />
      <Sfx at={28} name="ding" volume={0.5} />
    </BrutalBg>
  );
};
