import React from 'react';
import { Composition } from 'remotion';
import { Ai147M } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="Ai147M" component={Ai147M} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
