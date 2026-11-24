import React from 'react';
import { Composition, Still } from 'remotion';
import { Thumbnail, Thumbnail4x5, ThumbnailGuides } from './Thumbnail';
import { AskMaps } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="AskMaps" component={AskMaps} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Still id="Thumbnail" component={Thumbnail} width={1080} height={1920} />
    <Still id="ThumbnailGuides" component={ThumbnailGuides} width={1080} height={1920} />
    <Still id="Thumbnail4x5" component={Thumbnail4x5} width={1080} height={1350} />
  </>
);
