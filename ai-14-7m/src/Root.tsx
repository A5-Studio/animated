import React from 'react';
import { Composition } from 'remotion';
import { Ai147M } from './Video';
import { Ai147MH } from './VideoH';
import { FPS, TOTAL, TOTAL_H } from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="Ai147MH" component={Ai147MH} durationInFrames={TOTAL_H} fps={FPS} width={1920} height={1080} />
    <Composition id="Ai147M" component={Ai147M} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
  </>
);
