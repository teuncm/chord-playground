import { MIDI_OFFSET, NOTES_PER_OCTAVE, BASE_FREQ, MIDI_START, MIDI_RANGE } from "./audio";

let key = 0;
let scale = [0, 3, 7];

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

export function getKey() {
  return key;
}

export function setKey(newKey) {
  key = newKey;
}

export function getScale() {
  return scale;
}

export function setScale(newScale) {
  scale = newScale;
}

/* Obtain the octave from midi number. */
export function getOctaveFromMidiNumber(midiNumber) {
  return Math.floor(midiNumber / NOTES_PER_OCTAVE) - 1;
}

/* Get absolute oscillator frequency from midi number. */
export function getFreqFromMidiNumber(midiNumber) {
  return BASE_FREQ * 2 ** ((midiNumber - MIDI_OFFSET) / NOTES_PER_OCTAVE);
}

/* Get note symbol / pitch class symbol. */
export function getNoteSymbol(midiNumber) {
  return NOTE_NAME_TABLE[midiNumber % NOTES_PER_OCTAVE];
}

export function getNoteIndices() {
  return Object.keys(NOTE_NAME_TABLE);
}

/* Get shift symbol. */
export function getShiftSymbol(offset) {
  return NOTE_OFFSET_NAME_TABLE[offset];
}

export function getShiftIndices() {
  return Object.keys(NOTE_OFFSET_NAME_TABLE);
}

/* Wrap midi around the grid. */
export function wrapMidiNumber(midiNumber) {
  return (midiNumber - MIDI_START) % MIDI_RANGE + MIDI_START;
}

/* Get note name and octave position. */
export function getFullNoteName(midiNumber) {
  return getNoteSymbol(midiNumber) + getOctaveFromMidiNumber(midiNumber);
}

/* Draw random integer. */
export function randInt(randMin, randMax) {
  const randRange = randMax - randMin;

  return Math.floor(Math.random() * randRange) + randMin;
}

/* Draw random float. */
export function randFloat(randMin, randMax) {
  const randRange = randMax - randMin;

  return Math.random() * randRange + randMin;
}

/* Draw random list item, or null if list is empty. */
export function randItem(itemList) {
  if (itemList == []) {
    return null;
  }

  const randIdx = randInt(0, itemList.length);

  return itemList[randIdx];
}

/* Print midi number, fully qualified note name and frequency. */
export function printMidi(midiNumber) {
  const fullNoteName = getFullNoteName(midiNumber);
  const freqStr = getFreqFromMidiNumber(midiNumber).toFixed(2) + "Hz";
  console.log("Note: " + midiNumber.toString(), fullNoteName, freqStr);
}