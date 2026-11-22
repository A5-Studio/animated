import React from 'react';
import { Composition } from 'remotion';
import { BeliAIResmi } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="BeliAIResmi" component={BeliAIResmi} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
