import { DEFAULT_BASE_TUNING, DEFAULT_TUNING_OFFSET, DEFAULT_CHORD, DEFAULT_CHORD_ROOT, DEFAULT_CHORD_SHIFT, DEFAULT_OCTAVE_SHIFT } from "./constants";
import { wrapMidiNumber, getFreqFromMidiNumber } from "./helpers";
import { reactive } from 'vue';

/* Reactive synth parameters. */
class SynthState {
  /* In Hz. */
  baseTuning = DEFAULT_BASE_TUNING;

  /* In cents. */
  tuningOffset = DEFAULT_TUNING_OFFSET;

  /* In semitones. */
  chord = DEFAULT_CHORD;
  chordRoot = DEFAULT_CHORD_ROOT;
  chordShift = DEFAULT_CHORD_SHIFT;

  /* In octaves. */
  octaveShift = DEFAULT_OCTAVE_SHIFT;

  transformMidi(midiNumber) {
    const transformedMidiNumber = wrapMidiNumber(midiNumber);

    return getFreqFromMidiNumber(transformedMidiNumber);
  }
}

export const synthState = reactive(new SynthState());