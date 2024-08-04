/**
 * Maintains the current reactive state of the synthesizer. This includes the tuning and currently selected
 * chord and chord shift information.
 */

import { DEFAULT_TUNING_OFFSET, DEFAULT_CHORD, DEFAULT_CHORD_ROOT, DEFAULT_CHORD_SHIFT, DEFAULT_OCTAVE_SHIFT } from "./constants";
import { reactive } from 'vue';

/* Synth parameters. */
class MySynthState {
  /* In cents. */
  tuningOffset = DEFAULT_TUNING_OFFSET;

  /* In semitones. */
  chord = DEFAULT_CHORD;
  chordRoot = DEFAULT_CHORD_ROOT;
  chordShift = DEFAULT_CHORD_SHIFT;

  /* In octaves. */
  octaveShift = DEFAULT_OCTAVE_SHIFT;
}

/* Reactive synth object. */
export const mySynthState = reactive(new MySynthState());