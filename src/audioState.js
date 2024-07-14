import { defineStore } from 'pinia';

export class Audio {
  audioCtx;
  synthOut;
  out;

  chord;

  // chord = [0, 3, 7];
  

  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.synthOut = this.audioCtx.createGain();
    this.out = this.audioCtx.destination;
    
    this.chord = [0, 3, 7];

    // this.initialize();
  }

  /* Return current audio context timestamp. */
  static now() {
    return Audio.audioCtx.currentTime;
  }
}

export const DEFAULT_BASE_TUNING = 440;

export const DEFAULT_TUNING_OFFSET = 0;

export const DEFAULT_CHORD = [0, 5, 9];
export const DEFAULT_CHORD_ROOT = 0;
export const DEFAULT_CHORD_SHIFT = 0;

export const DEFAULT_OCTAVE_SHIFT = 0;

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
}