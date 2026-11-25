import React from 'react';
import { Composition } from 'remotion';
import { TrimsEps2 } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="TrimsEps2" component={TrimsEps2} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
