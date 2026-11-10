import React from 'react';
import { Composition, Still } from 'remotion';
import { Infographic } from './Infographic';
import { Wallts147M } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="Wallts147M" component={Wallts147M} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Still id="WalltsInfografik" component={Infographic} width={1080} height={1350} />
  </>
);
