import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { SafeAreaGuide, Sfx } from "../brutal/kit";
import { CtAbstract } from "./Abstract";
import { CtAlgorithm } from "./Algorithm";
import { CtDecompose } from "./Decompose";
import { CtIntro } from "./Intro";
import { CtOutro } from "./Outro";
import { CtPattern } from "./Pattern";
import { CtProblem } from "./Problem";
import { CtRecap } from "./Recap";

export type CtVideoProps = {
  readonly showSafeArea: boolean;
};

export const CtVideo: React.FC<CtVideoProps> = ({ showSafeArea }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const t = linearTiming({ durationInFrames: 12 });

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Pembuka"
          durationInFrames={160}
          premountFor={fps}
        >
          <CtIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={t}
        />
        <TransitionSeries.Sequence
          name="Contoh"
          durationInFrames={160}
          premountFor={fps}
        >
          <CtProblem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={t}
        />
        <TransitionSeries.Sequence
          name="Dekomposisi"
          durationInFrames={250}
          premountFor={fps}
        >
          <CtDecompose />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={t}
        />
        <TransitionSeries.Sequence
          name="Pola"
          durationInFrames={280}
          premountFor={fps}
        >
          <CtPattern />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={t}
        />
        <TransitionSeries.Sequence
          name="Abstraksi"
          durationInFrames={250}
          premountFor={fps}
        >
          <CtAbstract />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-top-left" })}
          timing={t}
        />
        <TransitionSeries.Sequence
          name="Algoritma"
          durationInFrames={310}
          premountFor={fps}
        >
          <CtAlgorithm />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={t}
        />
        <TransitionSeries.Sequence
          name="Ringkasan"
          durationInFrames={220}
          premountFor={fps}
        >
          <CtRecap />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={t}
        />
        <TransitionSeries.Sequence
          name="Penutup"
          durationInFrames={150}
          premountFor={fps}
        >
          <CtOutro />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Audio
        name="Music"
        src={staticFile("music-ct.wav")}
        premountFor={fps}
        volume={(f) =>
          interpolate(
            f,
            [0, 15, durationInFrames - 45, durationInFrames],
            [0, 0.85, 0.85, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )
        }
      />
      {/* transition sounds at each cut: whoosh for slides, whip for wipes */}
      <Sfx at={147} name="whoosh" volume={0.7} />
      <Sfx at={295} name="whip" volume={0.5} />
      <Sfx at={533} name="whoosh" volume={0.7} />
      <Sfx at={801} name="whoosh" volume={0.7} />
      <Sfx at={1039} name="whip" volume={0.5} />
      <Sfx at={1337} name="whoosh" volume={0.7} />
      <Sfx at={1545} name="whoosh" volume={0.7} />
      {showSafeArea ? <SafeAreaGuide /> : null}
    </AbsoluteFill>
  );
};
