<template>
<div class="container" id="note-container">
  <div v-for="row in 6" :key="row" class="container-row">
    <div v-for="col in 12" :key="col" class="container-col">
      <button :id="'note-' + ((row + 2)*12 + (col - 1))" class="interact note" @click="playNote((row + 2)*12 + (col - 1))"></button>
    </div>
  </div>
</div>
</template>

<script>
import { getFullNoteName } from '../helpers';
import { playNote } from '../action';

export default {
  methods: {
    getFullNoteName,
    playNote,
  }
};
</script>