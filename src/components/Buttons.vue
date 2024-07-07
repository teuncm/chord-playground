<template>
  <div id="buttons">
      <div v-for="id in range" :key="id">
          <button @click="ring(id)">Button {{ id }}</button>
      </div>
  </div>
</template>

<script>
import { ring } from '../action';

export default {
    props: {
        start: {
            type: Number,
            required: true
        },
        end: {
            type: Number,
            required: true
        }
    },
    computed: {
        range() {
            let rangeArray = [];
            for (let i = this.start; i <= this.end; i++) {
                rangeArray.push(i);
            }
            return rangeArray;
        }
    },
    methods: {
        ring
    }
};
</script>