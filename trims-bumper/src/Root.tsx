import React from 'react';
import { Composition } from 'remotion';
import { TrimsBumper } from './Bumper';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="TrimsBumper" component={TrimsBumper} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
