/**
 * Helpers for audio and midi.
 */

import { NOTES_PER_OCTAVE, MIDI_START, MIDI_RANGE, OCTAVE_START, OCTAVE_END, NOTE_NAME_TABLE, NOTE_OFFSET_NAME_TABLE, FREQ_A4, MIDI_A4 } from "./constants";
import { sortBy, range, map, filter, flatten } from "lodash";
import { MyAudioState } from "./myAudioState";
import { mySynthState } from "./mySynthState";

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
  return NOTE_NAME_TABLE[mod(midiNumber, NOTES_PER_OCTAVE)];
}

/* Get all indices that belong to note symbols. */
export function getNoteIndices() {
  return Object.keys(NOTE_NAME_TABLE);
}

/* Get shift symbol. */
export function getShiftSymbol(offset) {
  return NOTE_OFFSET_NAME_TABLE[mod(offset, NOTES_PER_OCTAVE)];
}

/* Get all indices that belong to shift symbols. */
export function getShiftIndices() {
  return Object.keys(NOTE_OFFSET_NAME_TABLE);
}

/* Get all midi over all octaves in a 2D grid. */
export function getAllMidiNumbers() {
  const octaves = range(OCTAVE_START, OCTAVE_END);
  const allMidi = map(octaves, (octave) => range(octave*NOTES_PER_OCTAVE, octave*NOTES_PER_OCTAVE + NOTES_PER_OCTAVE));

  return allMidi;
}

/* Filter all midi numbers such that only chord notes are left. */
export function filterMidiNumbers(chord) {
  const allMidi = flatten(getAllMidiNumbers());
  const filteredMidi = filter(allMidi, (midi) => chord.includes(mod(midi, NOTES_PER_OCTAVE)));

  return filteredMidi;
}

/* Wrap midi around the grid. */
export function wrapMidiNumberGrid(midiNumber) {
  return mod(midiNumber - MIDI_START, MIDI_RANGE) + MIDI_START;
}

/* Wrap midi around an octave. */
export function wrapMidiNumberOctave(midiNumber, cur_octave) {
  return mod(midiNumber - cur_octave*NOTES_PER_OCTAVE, NOTES_PER_OCTAVE) + cur_octave*NOTES_PER_OCTAVE;
}

/* Shift all midi numbers by a certain amount. */
export function shiftMidiNumbers(midiNumbers, shift) {
  const shiftedMidiNumbers = map(midiNumbers, (midi) => wrapMidiNumberGrid(midi + shift));
  const sortedMidiNumbers = sortBy(shiftedMidiNumbers);
  
  return sortedMidiNumbers;
}

/* Convenience function to combine grid wrapping and frequency conversion. */
export function transformMidiNumber(midiNumber) {
  const transformedMidiNumber = wrapMidiNumberGrid(midiNumber);
  const freq = getFreqFromMidiNumber(transformedMidiNumber);

  return freq;
}

/* Get oscillator frequency from midi number based on 12-TET system, standard concert pitch and current tuning offset. */
export function getFreqFromMidiNumber(midiNumber) {
  return FREQ_A4 * 2**((midiNumber - MIDI_A4 + (mySynthState.tuningOffset / 100)) / NOTES_PER_OCTAVE);
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

/* Modulo function that behaves consistently in the negatives. 
Source: https://stackoverflow.com/a/17323608 */
function mod(n, m) {
  return ((n % m) + m) % m;
}