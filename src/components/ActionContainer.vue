<script>
import { actionDown, actionRandom, actionRandomize, actionUp, actionFull } from '../action';

export default {
  methods: {
    actionRandom,
    actionUp,
    actionFull,
    actionDown,
    actionRandomize
  }
};
</script>

<template>
  <div class="container" id="action-container">
    <div class="container-row">
      <button class="action-button interact" id="action-up" @click="actionUp()">↑</button>
      <button class="action-button interact" id="action-down" @click="actionDown()">↓</button>
      <button class="action-button interact" id="action-full" @click="actionFull()">○</button>
      <button class="action-button interact" id="action-random" @click="actionRandom()">☆</button>
      <button class="action-button interact" id="action-randomize" @click="actionRandomize()">↻</button>
    </div>
  </div>
</template>