<template>
  <div class="container" id="chord-container">
    <div class="container-row">
      <div v-for="n in 12" :key="n" class="container-col">
        <label class="custom-select">
          <input type="radio" @change="changeKey(n-1)" :id="'key-' + (n-1)" name="key" :value="(n-1)" v-model="key">
          <span class="custom-checkbox interact">{{ getNoteFromMidiNumber(n-1) }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { getNoteFromMidiNumber } from '../helpers';
import { getScale, setScale } from '../helpers';

export default {
  data() {
    return {
      scale: getScale(),
    }
  },
  watch: {
    scale: {
      handler(newValues) {
        setScale(newValues);
      },
    }
  },
  methods: {
    getNoteFromMidiNumber,
    getScale,
    setScale,
  }
};
</script>