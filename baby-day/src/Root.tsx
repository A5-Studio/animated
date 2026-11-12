import React from 'react';
import { Composition } from 'remotion';
import { BabyDay } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="BabyDay" component={BabyDay} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
