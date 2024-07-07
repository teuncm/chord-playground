<template>
  <div id="buttons-container">
    <label>
      Number of octaves:
      <input type="range" min="1" max="10" v-model.number="rowCount" />
    </label>
    <p>Number of rows: {{ rowCount }}</p>

    <label>
      Number of columns:
      <input type="range" min="1" max="12" v-model.number="colCount" />
    </label>
    <p>Number of columns: {{ colCount }}</p>

    <div v-for="row in rowCount" :key="row" class="row">
      <div v-for="col in colCount" :key="col" class="col">
        <button @click="handleButtonClick(row, col)">Button {{ row }}-{{ col }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rowCount: 1,
      colCount: 1,
    };
  },
  methods: {
    handleButtonClick(row, col) {
      alert(`Button ${row}-${col} clicked!`);
    },
  },
};
</script>

<style scoped>
.row {
  display: flex;
}

.col {
  margin: 4px;
}
</style>
