import { AUDIO_SECONDS } from './audio-data';
import { s } from './theme';

/** the speech starts after a short title card */
export const SPEECH_AT = 1.2;
/** the risk card stays up this long after the speech ends */
export const HOLD = 6;
export const DURATION = s(SPEECH_AT + AUDIO_SECONDS + HOLD);

const D = AUDIO_SECONDS;
/** panel scenes in seconds (absolute) */
export const PANELS = {
  msci: SPEECH_AT,
  chart: SPEECH_AT + D * 0.38,
  week: SPEECH_AT + D * 0.62,
  risk: SPEECH_AT + D * 0.82,
};
