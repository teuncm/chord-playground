<script>
import { getFullNoteName, getAllMidiNumbers } from '../helpers';
import { playNote } from '../action';

export default {
  methods: {
    getFullNoteName,
    playNote,
    getAllMidiNumbers,
  },
};
</script>

<template>
<div class="container" id="note-container">
  <div v-for="midiNumbers in getAllMidiNumbers()" class="container-row">
    <div v-for="midiNumber in midiNumbers" class="container-col">
      <button :id="'note-' + midiNumber" class="interact note" @click="playNote(midiNumber)"></button>
    </div>
  </div>
</div>
</template>