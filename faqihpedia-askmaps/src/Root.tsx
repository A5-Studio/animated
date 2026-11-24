import React from 'react';
import { Composition } from 'remotion';
import { AskMaps } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="AskMaps" component={AskMaps} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
