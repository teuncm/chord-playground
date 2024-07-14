<script>
import { getNoteSymbol, getNoteIndices } from '../helpers';
import { synthState } from '../stores/store';
import { computed } from 'vue';

export default {
  setup() {
    const chord = computed({
      get: () => synthState.chord,
      set: (value) => {
        synthState.chord = value;
      }
    });

    return {
      chord,
    };
  },
  methods: {
    getNoteIndices,
    getNoteSymbol,
  },
};
</script>

<template>
  <div class="container" id="chord-container">
    <div class="container-row">
      <div v-for="idx in getNoteIndices()" :key="idx" class="container-col">
        <label class="custom-select">
          <input v-model="chord" type="checkbox" :id="'chord-' + idx" name="chord" :value="idx" />
          <span class="custom-select-label interact">{{ getNoteSymbol(idx) }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

