import { OCTAVE_START, OCTAVE_END, NOTES_PER_OCTAVE, OCTAVE_RANGE, MAX_TUNING_OFFSET, MIDI_RANGE, MIDI_START } from "./constants";
import { wrapMidiNumber } from "./helpers"
import { mySynthState } from "./mySynthState";
import { bell } from "./myAudioState";
import { random, sample } from "lodash"

export const RANDOM_NOTE_COUNT = 6;
export const ARP_SPEED = 125;

/* Randomize the playground parameters. */
export function actionRandomize() {
  let chordShift = 0;

  let chord = [];
  for (let i = 0; i < 3; i++) {
    chord.push(random(0, NOTES_PER_OCTAVE - 1));
  }
  chord = [...new Set(chord)].toSorted();

  let chordRoot = sample(chord);
  let tuningOffset = random(-MAX_TUNING_OFFSET, MAX_TUNING_OFFSET);

  mySynthState.chordShift = chordShift;
  mySynthState.chord = chord;
  mySynthState.chordRoot = chordRoot;
  mySynthState.tuningOffset = tuningOffset;
}

export function actionFull() {
  const chord = mySynthState.chord;
  /* Do nothing if scale is empty! */
  if (!chord.length) {
    return;
  }

  const octaveOffset = random(OCTAVE_START, OCTAVE_END - 1);

  for (let j = 0; j < chord.length; j++) {
    const noteOffset = chord[j];
    const chordShift = mySynthState.chordShift;
    const midiNumber = wrapMidiNumber(octaveOffset * NOTES_PER_OCTAVE + chordShift + noteOffset);
    const freq = mySynthState.transformMidiNumber(midiNumber);

    setTimeout(() => {
      lightUpNote(midiNumber);

      bell(freq);
    }, 0.2);
  }
}

export function actionRandom() {
  const chord = mySynthState.chord;
  /* Do nothing if scale is empty! */
  if (!chord.length) {
    return;
  }

  for (let i = 0; i < RANDOM_NOTE_COUNT; i++) {
    const octaveOffset = random(OCTAVE_START, OCTAVE_END - 1);
    const noteOffset = sample(chord);
    const chordShift = mySynthState.chordShift;
    const midiNumber = wrapMidiNumber(octaveOffset * NOTES_PER_OCTAVE + chordShift + noteOffset);
    const freq = mySynthState.transformMidiNumber(midiNumber);

    lightUpNote(midiNumber);

    bell(freq);
  }
}

export function actionUp() {
  const chord = mySynthState.chord;
  /* Do nothing if scale is empty! */
  if (!chord.length) {
    return;
  }

  for (let i = 0; i < OCTAVE_RANGE; i++) {
    const octaveOffset = i + OCTAVE_START;

    for (let j = 0; j < chord.length; j++) {
      const noteOffset = chord[j];
      const chordShift = mySynthState.chordShift;
      const midiNumber = wrapMidiNumber(octaveOffset * NOTES_PER_OCTAVE + chordShift + noteOffset);
      const freq = mySynthState.transformMidiNumber(midiNumber);

      const timeout = (i * chord.length + j) * ARP_SPEED;

      setTimeout(() => {
        lightUpNote(midiNumber);

        bell(freq);
      }, timeout);
    }
  }
}

export function actionDown() {
  const chord = mySynthState.chord;
  /* Do nothing if scale is empty! */
  if (!chord.length) {
    return;
  }

  for (let i = 0; i < OCTAVE_RANGE; i++) {
    const octaveOffset = i + OCTAVE_START;

    for (let j = 0; j < chord.length; j++) {
      const noteOffset = chord[j];
      const chordShift = mySynthState.chordShift;
      const midiNumber = wrapMidiNumber(octaveOffset * NOTES_PER_OCTAVE + chordShift + noteOffset);
      const freq = mySynthState.transformMidiNumber(midiNumber);

      const timeout = ((OCTAVE_RANGE - 1 - i) * chord.length + (chord.length - 1 - j)) * ARP_SPEED;

      setTimeout(() => {
        lightUpNote(midiNumber);

        bell(freq);
      }, timeout);
    }
  }
}

export function playNote(midiNumber) {
  for (let chordNote of mySynthState.chord) {
    const shift = chordNote == mySynthState.chordRoot ? 0 : mySynthState.chordShift;
    const offsetMidi = wrapMidiNumber(midiNumber + (chordNote - mySynthState.chordRoot) + shift);
    const freq = mySynthState.transformMidiNumber(offsetMidi);

    bell(freq);

    if (chordNote == mySynthState.chordRoot) {
      lightUpRoot(offsetMidi)
    } else {
      lightUpNote(offsetMidi);
    }
  }
}

/* Briefly light up a note on the grid with the given midi number. */
export function lightUpNote(midiNumber) {
  const button = document.getElementById("note-" + midiNumber);
  button.classList.add('light-up');
  setTimeout(() => {
    button.classList.remove('light-up');
  }, 100);
}

/* Briefly light up a note on the grid with the given midi number. */
export function lightUpRoot(midiNumber) {
  const button = document.getElementById("note-" + midiNumber);
  button.classList.add('light-up-root');
  setTimeout(() => {
    button.classList.remove('light-up-root');
  }, 100);
}