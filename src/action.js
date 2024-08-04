/**
 * Functions that are triggered by user actions.
 */

import { OCTAVE_START, OCTAVE_END, NOTES_PER_OCTAVE, MAX_TUNING_OFFSET, ARP_SPEED, OCTAVE_RANGE } from "./constants";
import { getFreqFromMidiNumber, shiftMidiNumbers, wrapMidiNumberGrid, transformMidiNumber, filterMidiNumbers, wrapMidiNumberOctave } from "./helpers"
import { mySynthState } from "./mySynthState";
import { bell } from "./myAudioState";
import { random, sample, reverse } from "lodash"

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

/* Play the full chord over one random octave. */
export function actionFull() {
  mySynthState.octaveShift = 0;

  const chord = mySynthState.chord;
  /* Do nothing if scale is empty! */
  if (!chord.length) {
    return;
  }

  const octaveOffset = random(OCTAVE_START, OCTAVE_END - 1);

  for (let j = 0; j < chord.length; j++) {
    const noteOffset = chord[j];
    const chordShift = mySynthState.chordShift;
    const midiNumber = wrapMidiNumberOctave(octaveOffset * NOTES_PER_OCTAVE + chordShift + noteOffset, octaveOffset);
    const freq = getFreqFromMidiNumber(midiNumber);

    lightUpNote(midiNumber);

    bell(freq);
  }
}

/* Select random notes from chord. */
export function actionRandom() {
  mySynthState.octaveShift = null;

  const chord = mySynthState.chord;
  /* Do nothing if scale is empty! */
  if (!chord.length) {
    return;
  }

  for (let i = 0; i < chord.length; i++) {
    const octaveOffset = random(OCTAVE_START, OCTAVE_END - 1);
    const noteOffset = sample(chord);
    const chordShift = mySynthState.chordShift;
    const midiNumber = wrapMidiNumberGrid(octaveOffset * NOTES_PER_OCTAVE + chordShift + noteOffset);
    const freq = getFreqFromMidiNumber(midiNumber);

    lightUpNote(midiNumber);

    bell(freq);
  }
}

/* Arpeggiate over all octaves, upwards. */
export function actionUp() {
  mySynthState.octaveShift = 1;

  const chord = mySynthState.chord;
  /* Do nothing if scale is empty. */
  if (!chord.length) {
    return;
  }

  const filteredMidiNumbers = filterMidiNumbers(chord);
  const shiftedMidiNumbers = shiftMidiNumbers(filteredMidiNumbers, mySynthState.chordShift);

  arp(shiftedMidiNumbers);
}

/* Arpeggiate over all octaves, downwards. */
export function actionDown() {
  mySynthState.octaveShift = -1;

  const chord = mySynthState.chord;
  /* Do nothing if scale is empty. */
  if (!chord.length) {
    return;
  }

  const filteredMidiNumbers = filterMidiNumbers(chord);
  const shiftedMidiNumbers = shiftMidiNumbers(filteredMidiNumbers, mySynthState.chordShift);
  const reversedMidiNumbers = reverse(shiftedMidiNumbers);

  arp(reversedMidiNumbers);
}

/* Arpeggiate over a list of midi numbers. */
export function arp(midiNumbers) {
  for (let i = 0; i < midiNumbers.length; i++) {
    const midiNumber = midiNumbers[i];
    const freq = transformMidiNumber(midiNumber);

    const timeout = i * ARP_SPEED;

    setTimeout(() => {
      lightUpNote(midiNumber);

      bell(freq);
    }, timeout);
  }
}

/* Play a note and its corresponding chord when clicking on the grid. 
Note that this function changes effect based on previous actions
that set octaveShift. */
export function playNote(midiNumber) {
  const chord = mySynthState.chord;
  /* Do nothing if scale is empty. */
  if (!chord.length) {
    return;
  }

  const rootIdx = chord.indexOf(mySynthState.chordRoot);
  const octaveShift = mySynthState.octaveShift;

  for (let i = 0; i < chord.length; i++) {
    const chordNote = chord[i];
    
    /* Distance from root. */
    const rootOffsetIdx = i - rootIdx;

    /* Shift only non-root notes. */
    const shiftEnabler = i == rootIdx ? 0 : 1;

    const curShift = mySynthState.chordShift * shiftEnabler;
    
    let curOctaveShift = null;
    if (octaveShift !== null) {
      curOctaveShift = octaveShift * rootOffsetIdx;
    } else {
      curOctaveShift = random(0, OCTAVE_RANGE);
    }
    curOctaveShift *= shiftEnabler;

    const offsetMidi = wrapMidiNumberGrid(midiNumber + (chordNote - mySynthState.chordRoot) + curShift + curOctaveShift * NOTES_PER_OCTAVE);
    const freq = transformMidiNumber(offsetMidi);

    bell(freq);

    /* Light up depending on whether the current note is
    the root (anchor) of the chord. */
    if (i == rootIdx) {
      lightUpRoot(offsetMidi);
    } else {
      lightUpNote(offsetMidi);
    }
  }

  // for (let chordNote of mySynthState.chord) {
  //   const shift = chordNote == mySynthState.chordRoot ? 0 : mySynthState.chordShift;
  //   const offsetMidi = wrapMidiNumberGrid(midiNumber + (chordNote - mySynthState.chordRoot) + shift);
  //   const freq = transformMidiNumber(offsetMidi);

  //   bell(freq);

  //   if (chordNote == mySynthState.chordRoot) {
  //     lightUpRoot(offsetMidi)
  //   } else {
  //     lightUpNote(offsetMidi);
  //   }
  // }
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