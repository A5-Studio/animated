import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { BrutalBucket } from "./Bucket";
import { BrutalCompare } from "./Compare";
import { BrutalIntro } from "./Intro";
import { SafeAreaGuide, Sfx } from "./kit";
import { BrutalOutro } from "./Outro";
import { BrutalPipeline } from "./Pipeline";
import { BrutalProblem } from "./Problem";
import { BrutalTap } from "./Tap";

export type BrutalVideoProps = {
  readonly showSafeArea: boolean;
};

export const BrutalVideo: React.FC<BrutalVideoProps> = ({ showSafeArea }) => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Pembuka"
          durationInFrames={150}
          premountFor={fps}
        >
          <BrutalIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence
          name="Cara ember"
          durationInFrames={330}
          premountFor={fps}
        >
          <BrutalBucket />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence
          name="Masalah"
          durationInFrames={210}
          premountFor={fps}
        >
          <BrutalProblem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence
          name="Cara pipa"
          durationInFrames={330}
          premountFor={fps}
        >
          <BrutalPipeline />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence
          name="Buka keran"
          durationInFrames={240}
          premountFor={fps}
        >
          <BrutalTap />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-top-left" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence
          name="Perbandingan"
          durationInFrames={240}
          premountFor={fps}
        >
          <BrutalCompare />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence
          name="Penutup"
          durationInFrames={150}
          premountFor={fps}
        >
          <BrutalOutro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio
        name="Music"
        src={staticFile("music-brutal.wav")}
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
      {/* transition sounds: whoosh for slides, whip for wipes (frames where each transition starts) */}
      <Sfx at={137} name="whoosh" volume={0.7} />
      <Sfx at={455} name="whip" volume={0.5} />
      <Sfx at={653} name="whoosh" volume={0.7} />
      <Sfx at={971} name="whoosh" volume={0.7} />
      <Sfx at={1199} name="whip" volume={0.5} />
      <Sfx at={1427} name="whoosh" volume={0.7} />
      {showSafeArea ? <SafeAreaGuide /> : null}
    </AbsoluteFill>
  );
};
