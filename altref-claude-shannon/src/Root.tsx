import React from 'react';
import { Composition } from 'remotion';
import { AltRefClaude } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="AltRefClaude" component={AltRefClaude} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
