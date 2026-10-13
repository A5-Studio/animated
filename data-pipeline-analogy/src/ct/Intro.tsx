import { useCurrentFrame } from "remotion";
import {
  B,
  border,
  BrutalBg,
  Caption,
  Mark,
  Panel,
  SAFE,
  Sfx,
  Sticker,
  Title,
} from "../brutal/kit";

const LINE1 = "> computational thinking";
const LINE2 = "= cara memecahkan masalah";
const LINE3 = "  langkah demi langkah";

const typed = (text: string, frame: number, start: number) =>
  text.slice(0, Math.max(0, Math.floor((frame - start) / 1.2)));

export const CtIntro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BrutalBg>
      <Title kicker="BERPIKIR KOMPUTASIONAL" kickerColor={B.yellow}>
        Computational <Mark color={B.green}>Thinking</Mark>
      </Title>

      <Panel top={540} height={330} color={B.white}>
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "14px 18px",
            borderBottom: border,
            background: B.blue,
          }}
        >
          {[B.red, B.yellow, B.green].map((c) => (
            <div
              key={c}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                background: c,
                border: `4px solid ${B.ink}`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            padding: "24px 28px",
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.45,
            whiteSpace: "pre",
          }}
        >
          <div>{typed(LINE1, frame, 14)}</div>
          <div style={{ color: "#0A6FD6" }}>{typed(LINE2, frame, 46)}</div>
          <div style={{ color: "#0A6FD6" }}>
            {typed(LINE3, frame, 78)}
            <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0 }}>
              ▌
            </span>
          </div>
        </div>
      </Panel>

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 920,
          width: SAFE.width,
        }}
      >
        <Sticker
          at={100}
          color={B.pink}
          rotate={-3}
          style={{ fontSize: 38, display: "inline-block" }}
        >
          Bukan cuma untuk programmer!
        </Sticker>
      </div>

      <Caption from={115} to={160}>
        Kita coba pakai contoh sehari-hari.
      </Caption>

      <Sfx at={0} name="pop" />
      <Sfx at={6} name="thud" volume={0.6} />
      {[14, 46, 78].map((at) => (
        <Sfx key={at} at={at} name="mouse-click" volume={0.35} />
      ))}
      <Sfx at={100} name="pop" />
      <Sfx at={115} name="mouse-click" />
    </BrutalBg>
  );
};
