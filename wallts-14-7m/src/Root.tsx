import React from 'react';
import { Composition } from 'remotion';
import { Wallts147M } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="Wallts147M" component={Wallts147M} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
