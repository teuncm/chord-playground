<script>
import { getAllMidiNumbers, getNoteSymbol } from '../helpers';
import { playNote } from '../action';
import { reverse } from 'lodash';

export default {
  methods: {
    playNote,
    getAllMidiNumbers,
    getNoteSymbol,
    reverse,
  },
};
</script>

<template>
<div class="container" id="note-container">
  <div v-for="midiNumbers in reverse(getAllMidiNumbers())" class="container-row">
    <div v-for="midiNumber in midiNumbers" class="container-col">
      <button :id="'note-' + midiNumber" class="interact note" @click="playNote(midiNumber)">{{ getNoteSymbol(midiNumber) }}</button>
    </div>
  </div>
</div>
</template>