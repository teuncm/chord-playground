import { wrapMidiNumber, getFreqFromMidiNumber } from "./helpers";

/* Action constants. */
export const NOTES_PER_OCTAVE = 12;

export const OCTAVE_START = 3;
export const OCTAVE_END = 9;
export const OCTAVE_RANGE = OCTAVE_END - OCTAVE_START;

export const MIDI_START = OCTAVE_START * NOTES_PER_OCTAVE;
export const MIDI_END = OCTAVE_END * NOTES_PER_OCTAVE + NOTES_PER_OCTAVE;
export const MIDI_RANGE = MIDI_END - MIDI_START;

export const RANDOM_NOTE_COUNT = 6;
export const ARP_SPEED = 125;
export const DELAY_TIME = 0.3;

/* Synth constants. */
export const MIDI_OFFSET = 69;
export const DEFAULT_BASE_TUNING = 440;

export const DEFAULT_TUNING_OFFSET = 0;

export const DEFAULT_CHORD = [0, 4, 7];
export const DEFAULT_CHORD_ROOT = 0;
export const DEFAULT_CHORD_SHIFT = 0;

export const DEFAULT_OCTAVE_SHIFT = 0;

/* Synth parameters. */
export class SynthState {
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
    transformedMidiNumber = wrapMidiNumber(midiNumber);

    return getFreqFromMidiNumber(transformedMidiNumber);
  }
}