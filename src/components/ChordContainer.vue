<script>
import { getNoteSymbol, getNoteIndices } from '../helpers';
import { mySynthState } from '../mySynthState';
import { computed } from 'vue';
import { sample } from 'lodash';

export default {
  setup() {
    const chord = computed({
      get: () => mySynthState.chord,
      set: (value) => {
        mySynthState.chord = value.map(Number);
        if (!mySynthState.chord.includes(mySynthState.chordRoot)) {
          mySynthState.chordRoot = sample(mySynthState.chord);
        }
      }
    });

    const chordRoot = computed(() => mySynthState.chordRoot);

    return {
      chord,
      chordRoot,
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
          <span :class="{ chordroot: idx == chordRoot }" class="custom-select-label interact">{{ getNoteSymbol(idx) }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

