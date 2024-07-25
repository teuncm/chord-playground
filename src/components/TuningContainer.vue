<script>
import { computed } from 'vue';
import { synthState } from '../synthState';
import { MAX_TUNING_OFFSET } from '../constants';

export default {
  setup() {
    const tuningOffset = computed({
      get: () => synthState.tuningOffset,
      set: (value) => {
        synthState.tuningOffset = parseInt(value);
      }
    });

    return {
      tuningOffset,
    };
  },

  data() {
    return {
      MAX_TUNING_OFFSET,
    };
  }
}
</script>

<template>
  <div class="container" id="shift-container">
    <div class="container-row">
      <input class="slider" type="range" v-model="tuningOffset" :min=" - MAX_TUNING_OFFSET" :max="MAX_TUNING_OFFSET" step="1" list="my-detents" />
    </div>
    <div class="container-row detents">
    <datalist id="my-detents">
      <!-- <option value="-50" label="-50ct"></option> -->
      <option value="0" label="0ct"></option>
      <!-- <option value="50" label="+50ct"></option> -->
    </datalist>
  </div>
  </div>
</template>

<style scoped>
.container-row {
  margin-left: 20%;
  margin-right: 20%;
}

input[type="range"] {
  min-width: 0px;
  width: 0px;
  display: flex;
  flex: 1;
  font-size: 0px;
}
</style>