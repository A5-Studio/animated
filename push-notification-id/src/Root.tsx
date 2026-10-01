import React from 'react';
import { Composition } from 'remotion';
import { PushNotifID } from './Video';
import { FPS, TOTAL } from './theme';

export const Root: React.FC = () => (
  <Composition id="PushNotifID" component={PushNotifID} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
