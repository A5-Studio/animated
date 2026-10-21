import React from 'react';
import { Composition } from 'remotion';
import { IhsgMsci } from './Video';
import { FPS } from './theme';
import { DURATION } from './timeline';

export const Root: React.FC = () => (
  <Composition id="IhsgMsci" component={IhsgMsci} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
