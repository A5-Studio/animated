import React from 'react';
import { Composition } from 'remotion';
import { SpreadsheetGym } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="SpreadsheetGym" component={SpreadsheetGym} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
