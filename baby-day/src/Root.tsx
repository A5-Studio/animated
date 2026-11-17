import React from 'react';
import { Composition, Still } from 'remotion';
import { Thumbnail } from './Thumbnail';
import { BabyDay } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="BabyDay" component={BabyDay} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Still id="Thumbnail" component={Thumbnail} width={1080} height={1920} />
  </>
);
