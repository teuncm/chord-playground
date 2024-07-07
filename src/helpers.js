import { MIDI_OFFSET, NOTES_PER_OCTAVE, BASE_FREQ } from "./audio";

let key = 0;
let scale = [0, 3, 7];

/* Table of standard note names using flats. */
export const NOTE_NAME_TABLE = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B"
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

/* Get note name / pitch class. */
export function getNoteFromMidiNumber(midiNumber) {
  return NOTE_NAME_TABLE[midiNumber % NOTES_PER_OCTAVE];
}

/* Get note name and octave position. */
export function getFullNoteName(midiNumber) {
  return getNoteFromMidiNumber(midiNumber) + getOctaveFromMidiNumber(midiNumber);
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

/* Draw random list item. */
export function randItem(itemList) {
  const randIdx = randInt(0, itemList.length);

  return itemList[randIdx];
}

/* Print midi number, fully qualified note name and frequency. */
export function printMidi(midiNumber) {
  const fullNoteName = getFullNoteName(midiNumber);
  const freqStr = getFreqFromMidiNumber(midiNumber).toFixed(2) + "Hz";
  console.log("Note: " + midiNumber.toString(), fullNoteName, freqStr);
}