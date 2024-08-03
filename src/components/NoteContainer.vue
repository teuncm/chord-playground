<script>
import { getAllMidiNumbers, getNoteSymbol, getOctaveFromMidiNumber } from '../helpers';
import { playNote } from '../action';
import { reverse } from 'lodash';

export default {
  methods: {
    playNote,
    getAllMidiNumbers,
    getOctaveFromMidiNumber,
    getNoteSymbol,
    reverse,
  },
};
</script>

<template>
<div class="container" id="note-container">
  <div v-for="midiNumbers in reverse(getAllMidiNumbers())" class="container-row">
    <div v-for="midiNumber in midiNumbers" class="container-col">
      <button :id="'note-' + midiNumber" class="interact note" @click="playNote(midiNumber)">{{ getNoteSymbol(midiNumber) }} <sub> {{ getOctaveFromMidiNumber(midiNumber) }} </sub> </button>
    </div>
  </div>
</div>
</template>