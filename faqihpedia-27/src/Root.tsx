import React from 'react';
import { Composition } from 'remotion';
import { Faqihpedia27 } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="Faqihpedia27" component={Faqihpedia27} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
