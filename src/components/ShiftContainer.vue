<script>
import { getShiftSymbol, getShiftIndices } from '../helpers';

export default {
  data() {
    return {
      
    };
  },
  methods: {
    getShiftIndices,
    getShiftSymbol,
  }
}
</script>

<template>
  <div class="container" id="shift-container">
    <div class="container-row">
      <div v-for="idx in getShiftIndices()" :key="idx" class="container-col">
        <label class="custom-select">
          <input type="radio" :id="'shift-' + idx" name="shift" :value="idx">
          <span class="custom-select-label interact">{{ getShiftSymbol(idx) }}</span>
        </label>
      </div>
    </div>
  </div>
</template>