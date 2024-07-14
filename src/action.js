import { bell, OCTAVE_START, OCTAVE_END, NOTES_PER_OCTAVE, OCTAVE_RANGE } from "./audio";
import { randInt, randItem, getScale, getKey, getFreqFromMidiNumber, printMidi, wrapMidiNumber, setKey } from "./helpers"
import { synthState } from "./stores/store";

export const RANDOM_NOTE_COUNT = 6;
export const ARP_SPEED = 125;

/* Randomize the playground parameters. */
export function actionRandomize() {
  let chordShift = 0;

  let chord = [];
  for (let i = 0; i < 3; i++) {
    chord.push(randInt(0, NOTES_PER_OCTAVE));
  }
  chord = [...new Set(chord)].toSorted();

  let chordRoot = randItem(chord);
  
  synthState.chordShift = chordShift;
  synthState.chord = chord;
  synthState.chordRoot = chordRoot;
}

export function actionRandom() {
  const scale = getScale();
  /* Do nothing if scale is empty! */
  if (!scale.length) {
    return;
  }

  for (let i = 0; i < RANDOM_NOTE_COUNT; i++) {
    const octaveOffset = randInt(OCTAVE_START, OCTAVE_END + 1);
    const noteOffset = randItem(scale);
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

    for(let j = 0; j < scale.length; j++) {
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

    for(let j = 0; j < scale.length; j++) {
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

export function playNote(midiNumber) {
  for (let chordNote of synthState.chord) {
    const shift = chordNote == synthState.chordRoot ? 0 : synthState.chordShift;
    const offsetMidi = midiNumber + (chordNote - synthState.chordRoot) + shift;

    const freq = getFreqFromMidiNumber(offsetMidi);
    bell(freq);

    if (chordNote == synthState.chordRoot) {
      continue;
    }

    const button = document.getElementById("note-" + offsetMidi);
    button.classList.add('light-up');
    setTimeout(() => {
      button.classList.remove('light-up');
    }, 100);
  }
}