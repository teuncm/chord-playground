import { bell, OCTAVE_START, OCTAVE_END, NOTES_PER_OCTAVE } from "./audio";
import { randInt, randItem, getScale, getKey, getFreqFromMidiNumber, printMidi } from "./helpers"

export function actionRandom() {
  for (let i = 0; i < 6; i++) {
    const octaveOffset = randInt(OCTAVE_START, OCTAVE_END + 1);
    const noteOffset = randItem(getScale());
    const key = getKey();
    const midiNumber = octaveOffset * NOTES_PER_OCTAVE + key + noteOffset;
    const freq = getFreqFromMidiNumber(midiNumber);

    // const button = document.getElementById("note-" + midiNumber);
    // button.classList.add('light-up');
    // setTimeout(() => {
    //   button.classList.remove('light-up');
    // }, 100);

    bell(freq);
    printMidi(midiNumber);
  }

}