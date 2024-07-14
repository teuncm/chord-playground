<script>
import { getNoteSymbol, getNoteIndices } from '../helpers';
import { getScale, setScale } from '../helpers';

export default {
  methods: {
    getNoteIndices,
    getNoteSymbol,
    getScale,
    setScale,
  }
};
</script>

<template>
  <div class="container" id="chord-container">
    <div class="container-row">
      <div v-for="idx in getNoteIndices()" :key="idx" class="container-col">
        <label class="custom-select">
          <input type="checkbox" :id="'chord-' + idx" name="chord" :value="idx" />
          <span class="custom-select-label interact">{{ getNoteSymbol(idx) }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

