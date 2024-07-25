/*--- Audio constants. ---*/
/* In seconds. */
export const AUDIO_SCHEDULING_GLOBAL_OFFSET = 0.060;

/*--- Action constants. ---*/
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

/*--- Synth constants. ---*/
export const MIDI_OFFSET = 69;

/* In Hz. */
export const DEFAULT_BASE_TUNING = 440;
export const DEFAULT_TUNING_OFFSET = 0;
export const MAX_TUNING_OFFSET = 50;

export const DEFAULT_CHORD = [0, 4, 7];
export const DEFAULT_CHORD_ROOT = 0;
export const DEFAULT_CHORD_SHIFT = 0;

export const DEFAULT_OCTAVE_SHIFT = 0;

/* Table of standard note names using sharps. */
export const NOTE_NAME_TABLE = {
  0: "C",
  1: "C♯",
  2: "D",
  3: "D♯",
  4: "E",
  5: "F",
  6: "F♯",
  7: "G",
  8: "G♯",
  9: "A",
  10: "A♯",
  11: "B"
};

/* Table of offsets in semitones using accidentals and numbers. */
export const NOTE_OFFSET_NAME_TABLE = {
  0: "♮",
  1: "♯",
  2: "♯♯",
  3: "+3",
  4: "+4",
  5: "+5",
  6: "±6",
  7: "−5",
  8: "−4",
  9: "−3",
  10: "♭♭",
  11: "♭"
};