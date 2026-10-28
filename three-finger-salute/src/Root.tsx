import React from 'react';
import { Composition } from 'remotion';
import { ThreeFingerSalute } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="ThreeFingerSalute" component={ThreeFingerSalute} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
