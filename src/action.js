import { bell, OCTAVE_START, OCTAVE_END, NOTES_PER_OCTAVE, OCTAVE_RANGE } from "./audio";
import { randInt, randItem, getScale, getKey, getFreqFromMidiNumber, printMidi, wrapMidiNumber, setKey } from "./helpers"

export const RANDOM_NOTE_COUNT = 6;
export const ARP_SPEED = 125;

export function actionRandomize() {
  const key = randInt(0, NOTES_PER_OCTAVE);

  console.log(key);

  setKey(key);

  console.log(getKey());
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
  const freq = getFreqFromMidiNumber(midiNumber);

  bell(freq);
}