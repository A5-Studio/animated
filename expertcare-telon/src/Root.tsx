import React from 'react';
import { Composition } from 'remotion';
import { ExpertCareTelon } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="ExpertCareTelon" component={ExpertCareTelon} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
