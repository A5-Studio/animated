import React from 'react';
import { Composition } from 'remotion';
import { Faqihpedia22 } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="Faqihpedia22" component={Faqihpedia22} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
