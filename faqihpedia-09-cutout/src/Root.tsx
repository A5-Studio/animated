import React from 'react';
import { Composition } from 'remotion';
import { Faqihpedia09Cutout } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="Faqihpedia09Cutout" component={Faqihpedia09Cutout} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
