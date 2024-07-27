import { NOTES_PER_OCTAVE, MIDI_START, MIDI_RANGE, OCTAVE_START, OCTAVE_END, NOTE_NAME_TABLE, NOTE_OFFSET_NAME_TABLE } from "./constants";
import { range, map } from "lodash";
import { MyAudioState } from "./myAudioState";

/* Set multiple properties on an audio node. */
export function setNodeProps(node, props) {
  for (const [prop, value] of Object.entries(props)) {
    setNodeProp(node, prop, value);
  }

  return node;
}

/* Set a property on an audio node. */
export function setNodeProp(node, prop, value, timestamp=MyAudioState.now()) {
  if (node[prop] instanceof AudioParam) {
    node[prop].setValueAtTime(value, timestamp);
  } else {
    node[prop] = value;
  }

  return node;
}

/* Get note symbol / pitch class symbol. */
export function getNoteSymbol(midiNumber) {
  return NOTE_NAME_TABLE[midiNumber % NOTES_PER_OCTAVE];
}

/* Get all indices that belong to note symbols. */
export function getNoteIndices() {
  return Object.keys(NOTE_NAME_TABLE);
}

/* Get shift symbol. */
export function getShiftSymbol(offset) {
  return NOTE_OFFSET_NAME_TABLE[offset % NOTES_PER_OCTAVE];
}

/* Get all indices that belong to shift symbols. */
export function getShiftIndices() {
  return Object.keys(NOTE_OFFSET_NAME_TABLE);
}

/* Get all midi over all octaves. */
export function getAllMidiNumbers() {
  const octaves = range(OCTAVE_START, OCTAVE_END);
  const allMidi = map(octaves, (octave) => range(octave*NOTES_PER_OCTAVE, octave*NOTES_PER_OCTAVE + NOTES_PER_OCTAVE));

  return allMidi;
}

/* Wrap midi around the grid. */
export function wrapMidiNumber(midiNumber) {
  return (midiNumber - MIDI_START) % MIDI_RANGE + MIDI_START;
}

/* Obtain the octave from midi number. */
export function getOctaveFromMidiNumber(midiNumber) {
  return Math.floor(midiNumber / NOTES_PER_OCTAVE) - 1;
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