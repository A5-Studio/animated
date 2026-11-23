import React from 'react';
import { Composition } from 'remotion';
import { FaqihpediaArtipedia } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="FaqihpediaArtipedia" component={FaqihpediaArtipedia} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
