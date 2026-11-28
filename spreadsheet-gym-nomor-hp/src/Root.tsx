import React from 'react';
import { Composition, Still } from 'remotion';
import { Thumbnail, ThumbnailSafeCheck } from './Thumbnail';
import { SpreadsheetGym } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="SpreadsheetGym" component={SpreadsheetGym} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Still id="Thumbnail" component={Thumbnail} width={1080} height={1920} />
    <Still id="ThumbnailSafeCheck" component={ThumbnailSafeCheck} width={1080} height={1920} />
  </>
);
