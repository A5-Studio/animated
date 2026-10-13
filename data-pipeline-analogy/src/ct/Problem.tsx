import { useCurrentFrame } from "remotion";
import {
  B,
  BrutalBg,
  Caption,
  Mark,
  Panel,
  SAFE,
  Sfx,
  Sticker,
  Title,
} from "../brutal/kit";
import { Pan } from "./parts";

export const CtProblem: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BrutalBg>
      <Title kicker="CONTOH" kickerColor={B.orange}>
        Masak <Mark color={B.orange}>nasi goreng</Mark>
      </Title>

      <Panel top={540} height={440} color={B.waterLight}>
        <svg
          viewBox="-352 -215 704 430"
          style={{ width: "100%", height: "100%" }}
        >
          <g transform="translate(-40 30) scale(1.35)">
            <Pan frame={frame} />
          </g>
        </svg>
      </Panel>

      <div style={{ position: "absolute", left: SAFE.left + 20, top: 570 }}>
        <Sticker at={30} color={B.yellow} rotate={-6} style={{ fontSize: 44 }}>
          ?
        </Sticker>
      </div>
      <div style={{ position: "absolute", left: SAFE.left + 560, top: 600 }}>
        <Sticker at={40} color={B.pink} rotate={8} style={{ fontSize: 44 }}>
          ?
        </Sticker>
      </div>
      <div style={{ position: "absolute", left: SAFE.left + 20, top: 1010 }}>
        <Sticker at={55} color={B.white} rotate={-2} style={{ fontSize: 40 }}>
          Mulai dari mana?
        </Sticker>
      </div>

      <Caption from={85} to={160}>
        Kelihatan ribet? Pakai 4 langkah ini.
      </Caption>

      <Sfx at={0} name="pop" />
      <Sfx at={6} name="thud" volume={0.6} />
      <Sfx at={30} name="pop" />
      <Sfx at={40} name="pop" />
      <Sfx at={55} name="pop" />
      <Sfx at={85} name="mouse-click" />
    </BrutalBg>
  );
};
