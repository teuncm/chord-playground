import { OCTAVE_START, OCTAVE_END, NOTES_PER_OCTAVE, OCTAVE_RANGE, MAX_TUNING_OFFSET } from "./constants";
import { getFreqFromMidiNumber, wrapMidiNumber } from "./helpers"
import { synthState } from "./synthState";
import { bell } from "./audioState";
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

  synthState.chordShift = chordShift;
  synthState.chord = chord;
  synthState.chordRoot = chordRoot;
  synthState.tuningOffset = tuningOffset;
}

export function actionRandom() {
  const scale = getScale();
  /* Do nothing if scale is empty! */
  if (!scale.length) {
    return;
  }

  for (let i = 0; i < RANDOM_NOTE_COUNT; i++) {
    const octaveOffset = random(OCTAVE_START, OCTAVE_END + 1);
    const noteOffset = sample(scale);
    const key = getKey();
    const midiNumber = wrapMidiNumber(octaveOffset * NOTES_PER_OCTAVE + key + noteOffset);
    const freq = getFreqFromMidiNumber(midiNumber);

    const button = document.getElementById("note-" + midiNumber);
    button.classList.add('light-up');
    setTimeout(() => {
      button.classList.remove('light-up');
    }, 100);

    bell(freq);
  }
}

export function actionUp() {
  const scale = getScale();
  /* Do nothing if scale is empty! */
  if (!scale.length) {
    return;
  }

  for (let i = 0; i < OCTAVE_RANGE + 1; i++) {
    const octaveOffset = i + OCTAVE_START;

    for (let j = 0; j < scale.length; j++) {
      const noteOffset = scale[j];
      const key = getKey();
      const midiNumber = wrapMidiNumber(octaveOffset * NOTES_PER_OCTAVE + key + noteOffset);
      const freq = getFreqFromMidiNumber(midiNumber);

      const timeout = (i * scale.length + j) * ARP_SPEED;

      setTimeout(() => {
        const button = document.getElementById("note-" + midiNumber);
        button.classList.add('light-up');
        setTimeout(() => {
          button.classList.remove('light-up');
        }, 100);

        bell(freq);
      }, timeout);
    }
  }
}

export function actionDown() {
  const scale = getScale();
  /* Do nothing if scale is empty! */
  if (!scale.length) {
    return;
  }

  for (let i = 0; i < OCTAVE_RANGE + 1; i++) {
    const octaveOffset = i + OCTAVE_START;

    for (let j = 0; j < scale.length; j++) {
      const noteOffset = scale[j];
      const key = getKey();
      const midiNumber = wrapMidiNumber(octaveOffset * NOTES_PER_OCTAVE + key + noteOffset);
      const freq = getFreqFromMidiNumber(midiNumber);

      const timeout = ((OCTAVE_RANGE - i) * scale.length + (scale.length - 1 - j)) * ARP_SPEED;

      setTimeout(() => {
        const button = document.getElementById("note-" + midiNumber);
        button.classList.add('light-up');
        setTimeout(() => {
          button.classList.remove('light-up');
        }, 100);

        bell(freq);
      }, timeout);
    }
  }
}

// export function playNote(midiNumber) {
//   for (let chordNote of synthState.chord) {
//     const shift = chordNote == synthState.chordRoot ? 0 : synthState.chordShift;
//     const offsetMidi = midiNumber + (chordNote - synthState.chordRoot) + shift;

//     const freq = getFreqFromMidiNumber(offsetMidi);
//     bell(freq);

//     if (chordNote == synthState.chordRoot) {
//       continue;
//     }

//     const button = document.getElementById("note-" + offsetMidi);
//     button.classList.add('light-up');
//     setTimeout(() => {
//       button.classList.remove('light-up');
//     }, 100);
//   }
// }

export function playNote(midiNumber) {
  for (let chordNote of synthState.chord) {
    const shift = chordNote == synthState.chordRoot ? 0 : synthState.chordShift;
    const offsetMidi = midiNumber + (chordNote - synthState.chordRoot) + shift;

    const freq = synthState.transformMidiNumber(offsetMidi);
    bell(freq);

    if (chordNote == synthState.chordRoot) {
      continue;
    }

    lightUpNote(offsetMidi);
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