import { MIDI_OFFSET, NOTES_PER_OCTAVE, MIDI_START, MIDI_RANGE, OCTAVE_RANGE, OCTAVE_START, OCTAVE_END, NOTE_NAME_TABLE, NOTE_OFFSET_NAME_TABLE } from "./constants";
import { synthState } from "./stores/store";
import { range, map } from "lodash";

/* Obtain the octave from midi number. */
export function getOctaveFromMidiNumber(midiNumber) {
  return Math.floor(midiNumber / NOTES_PER_OCTAVE) - 1;
}

/* Get absolute oscillator frequency from midi number. */
export function getFreqFromMidiNumber(midiNumber) {
  return synthState.baseTuning * 2 ** ((midiNumber - MIDI_OFFSET + (synthState.tuningOffset / 100)) / NOTES_PER_OCTAVE);
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

/* Get all midi over all octaves. */
export function getAllMidi() {
  const octaves = range(OCTAVE_START, OCTAVE_END);
  const allMidi = map(octaves, (octave) => range(octave*NOTES_PER_OCTAVE, octave*NOTES_PER_OCTAVE + NOTES_PER_OCTAVE));

  return allMidi;
}

/* Wrap midi around the grid. */
export function wrapMidiNumber(midiNumber) {
  return (midiNumber - MIDI_START) % MIDI_RANGE + MIDI_START;
}

/* Get note name and octave position. */
export function getFullNoteName(midiNumber) {
  return getNoteSymbol(midiNumber) + getOctaveFromMidiNumber(midiNumber);
}

/* Print midi number, fully qualified note name and frequency. */
export function printMidi(midiNumber) {
  const fullNoteName = getFullNoteName(midiNumber);
  const freqStr = getFreqFromMidiNumber(midiNumber).toFixed(2) + "Hz";
  console.log("Note: " + midiNumber.toString(), fullNoteName, freqStr);
}