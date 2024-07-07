<template>
  <div class="container" id="key-container">
    <div class="container-row">
      <div v-for="n in 12" :key="n" class="container-col">
        <label class="custom-select">
          <input type="radio" :id="'key-' + (n-1)" name="key">
          <span class="custom-radio interact">{{ getNoteFromMidiNumber(n-1) }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { getNoteFromMidiNumber } from '../helpers';

export default {
  methods: {
    getNoteFromMidiNumber
  }
};
</script>