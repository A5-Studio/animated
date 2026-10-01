import { Composition, Folder } from "remotion";
import { BrutalVideo } from "./brutal/BrutalVideo";
import { BrutalBucket } from "./brutal/Bucket";
import { BrutalCompare } from "./brutal/Compare";
import { BrutalIntro } from "./brutal/Intro";
import { BrutalOutro } from "./brutal/Outro";
import { BrutalPipeline } from "./brutal/Pipeline";
import { BrutalProblem } from "./brutal/Problem";
import { BrutalTap } from "./brutal/Tap";
import { DataPipelineVideo } from "./DataPipelineVideo";
import { BucketScene } from "./scenes/BucketScene";
import { CompareScene } from "./scenes/CompareScene";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { PipelineScene } from "./scenes/PipelineScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { TapScene } from "./scenes/TapScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 7 scenes (1650 frames) minus 6 transitions of 15 frames = 1560 frames, 52s */}
      <Composition
        id="DataPipelineAnalogy"
        component={DataPipelineVideo}
        durationInFrames={1560}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Neobrutalism version, laid out inside the TikTok safe area.
          7 scenes (1650 frames) minus 6 transitions of 12 frames = 1578 frames */}
      <Composition
        id="DataPipelineBrutal"
        component={BrutalVideo}
        durationInFrames={1578}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ showSafeArea: false }}
      />
      <Folder name="Brutal-Scenes">
        <Composition id="BrutalPembuka" component={BrutalIntro} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="BrutalCaraEmber" component={BrutalBucket} durationInFrames={330} fps={30} width={1080} height={1920} />
        <Composition id="BrutalMasalah" component={BrutalProblem} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="BrutalCaraPipa" component={BrutalPipeline} durationInFrames={330} fps={30} width={1080} height={1920} />
        <Composition id="BrutalBukaKeran" component={BrutalTap} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="BrutalPerbandingan" component={BrutalCompare} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="BrutalPenutup" component={BrutalOutro} durationInFrames={150} fps={30} width={1080} height={1920} />
      </Folder>
      <Folder name="Scenes">
        <Composition id="Pembuka" component={IntroScene} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="CaraEmber" component={BucketScene} durationInFrames={330} fps={30} width={1080} height={1920} />
        <Composition id="Masalah" component={ProblemScene} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="CaraPipa" component={PipelineScene} durationInFrames={330} fps={30} width={1080} height={1920} />
        <Composition id="BukaKeran" component={TapScene} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="Perbandingan" component={CompareScene} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="Penutup" component={OutroScene} durationInFrames={150} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
