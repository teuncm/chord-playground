import { MIDI_OFFSET, DEFAULT_BASE_TUNING, DEFAULT_TUNING_OFFSET, DEFAULT_CHORD, DEFAULT_CHORD_ROOT, DEFAULT_CHORD_SHIFT, DEFAULT_OCTAVE_SHIFT, NOTES_PER_OCTAVE } from "./constants";
import { wrapMidiNumber } from "./helpers";
import { reactive } from 'vue';

/* Synth parameters. */
class MySynthState {
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

  transformMidiNumber(midiNumber) {
    const transformedMidiNumber = wrapMidiNumber(midiNumber);

    return this.getFreqFromMidiNumber(transformedMidiNumber);
  }

  /* Get absolute oscillator frequency from midi number. */
  getFreqFromMidiNumber(midiNumber) {
    return this.baseTuning * 2**((midiNumber - MIDI_OFFSET + (this.tuningOffset / 100)) / NOTES_PER_OCTAVE);
  }
}

/* Reactive synth object. */
export const mySynthState = reactive(new MySynthState());