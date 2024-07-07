<template>
  <div class="container" id="scale-container">
    <div class="container-row">
      <div v-for="n in 12" :key="n" class="container-col">
        <label class="custom-select">
          <input type="checkbox" :id="'scale-' + (n-1)">
          <span class="custom-checkbox interact"></span>
        </label>
      </div>
    </div>
  </div>
</template>