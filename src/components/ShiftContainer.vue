<script>
import { computed } from 'vue';
import { getShiftSymbol, getShiftIndices } from '../helpers';
import { mySynthState } from '../mySynthState';

export default {
  setup() {
    const chordShift = computed({
      get: () => mySynthState.chordShift,
      set: (value) => {
        mySynthState.chordShift = parseInt(value);
      }
    });

    return {
      chordShift,
    };
  },
  methods: {
    getShiftIndices,
    getShiftSymbol,
  },
}
</script>

<template>
  <div class="container" id="shift-container">
    <div class="container-row">
      <div v-for="idx in getShiftIndices()" :key="idx" class="container-col">
        <label class="custom-select">
          <input v-model="chordShift" type="radio" :id="'shift-' + idx" name="shift" :value="idx" >
          <span class="custom-select-label interact">{{ getShiftSymbol(idx) }}</span>
        </label>
      </div>
    </div>
  </div>
</template>