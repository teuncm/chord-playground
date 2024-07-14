<template>
  <div class="container" id="scale-container">
    <div class="container-row">
      <div v-for="n in 12" :key="n" class="container-col">
        <label class="custom-select">
          <input :disabled="n == 1" type="checkbox" :id="'scale-' + (n-1)" :value="(n-1)" v-model="scale">
          <span class="custom-checkbox interact">
            {{ n == 1 ? '+' : (n-1) }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { getNoteSymbol } from '../helpers';
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
    getNoteFromMidiNumber: getNoteSymbol,
    getScale,
    setScale,
  }
};
</script>