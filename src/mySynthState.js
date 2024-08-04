import { MIDI_A4, FREQ_A4, DEFAULT_TUNING_OFFSET, DEFAULT_CHORD, DEFAULT_CHORD_ROOT, DEFAULT_CHORD_SHIFT, DEFAULT_OCTAVE_SHIFT, NOTES_PER_OCTAVE } from "./constants";
import { wrapMidiNumber } from "./helpers";
import { reactive } from 'vue';

/* Synth parameters. */
class MySynthState {
  /* In Hz. */
  baseTuning = FREQ_A4;

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
    return this.baseTuning * 2**((midiNumber - MIDI_A4 + (this.tuningOffset / 100)) / NOTES_PER_OCTAVE);
  }
}

/* Reactive synth object. */
export const mySynthState = reactive(new MySynthState());