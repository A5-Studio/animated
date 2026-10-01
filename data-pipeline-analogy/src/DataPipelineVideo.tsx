import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { BucketScene } from "./scenes/BucketScene";
import { CompareScene } from "./scenes/CompareScene";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { PipelineScene } from "./scenes/PipelineScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { TapScene } from "./scenes/TapScene";

export const DataPipelineVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Pembuka" durationInFrames={150} premountFor={fps}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence name="Cara ember" durationInFrames={330} premountFor={fps}>
        <BucketScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence name="Masalah" durationInFrames={210} premountFor={fps}>
        <ProblemScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence name="Cara pipa" durationInFrames={330} premountFor={fps}>
        <PipelineScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence name="Buka keran" durationInFrames={240} premountFor={fps}>
        <TapScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence name="Perbandingan" durationInFrames={240} premountFor={fps}>
        <CompareScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence name="Penutup" durationInFrames={150} premountFor={fps}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
