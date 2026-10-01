import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { BrutalBucket } from "./Bucket";
import { BrutalCompare } from "./Compare";
import { BrutalIntro } from "./Intro";
import { SafeAreaGuide } from "./kit";
import { BrutalOutro } from "./Outro";
import { BrutalPipeline } from "./Pipeline";
import { BrutalProblem } from "./Problem";
import { BrutalTap } from "./Tap";

export type BrutalVideoProps = {
  readonly showSafeArea: boolean;
};

export const BrutalVideo: React.FC<BrutalVideoProps> = ({ showSafeArea }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Pembuka" durationInFrames={150} premountFor={fps}>
          <BrutalIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Cara ember" durationInFrames={330} premountFor={fps}>
          <BrutalBucket />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Masalah" durationInFrames={210} premountFor={fps}>
          <BrutalProblem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Cara pipa" durationInFrames={330} premountFor={fps}>
          <BrutalPipeline />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Buka keran" durationInFrames={240} premountFor={fps}>
          <BrutalTap />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-top-left" })} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Perbandingan" durationInFrames={240} premountFor={fps}>
          <BrutalCompare />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Penutup" durationInFrames={150} premountFor={fps}>
          <BrutalOutro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {showSafeArea ? <SafeAreaGuide /> : null}
    </AbsoluteFill>
  );
};
