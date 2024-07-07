<template>
<div class="container" id="note-container">
  <div v-for="row in 6" :key="row" class="container-row">
    <div v-for="col in 12" :key="col" class="container-col">
      <button class="interact note">{{ (row + 2)*12 + (col - 1) }}</button>
    </div>
  </div>
</div>
</template>