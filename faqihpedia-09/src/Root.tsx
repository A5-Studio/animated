import React from 'react';
import { Composition } from 'remotion';
import { Faqihpedia09 } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="Faqihpedia09" component={Faqihpedia09} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
