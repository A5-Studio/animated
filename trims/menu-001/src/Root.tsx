import React from 'react';
import { Composition } from 'remotion';
import { TrimsMenu001 } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="TrimsMenu001" component={TrimsMenu001} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
