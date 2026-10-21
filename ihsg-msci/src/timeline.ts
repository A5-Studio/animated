import { AUDIO_SECONDS } from './audio-data';
import { s } from './theme';

/** the speech starts after a short title card */
export const SPEECH_AT = 1.2;
/** the risk card stays up this long after the speech ends */
export const HOLD = 6;
export const DURATION = s(SPEECH_AT + AUDIO_SECONDS + HOLD);

/** panel scenes in seconds (absolute), timed to the speech */
export const PANELS = {
  msci: SPEECH_AT, // "Saya hanya katakan kepada MSCI… tidak akan gentar"
  chart: SPEECH_AT + 9.0, // applause, then "kita tidak takut"
  week: SPEECH_AT + 18.0, // "kita punya kekuatan… keberanian"
  risk: SPEECH_AT + 24.6, // "rela berkorban… tidak mengenal menyerah", then held
};
