import React from 'react';
import { Composition } from 'remotion';
import { Uang147M } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="Uang147M" component={Uang147M} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
