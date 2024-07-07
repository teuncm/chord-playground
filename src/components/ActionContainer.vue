<template>
  <div class="container" id="action-container">
    <div class="container-row">
      <!-- <button class="action-button interact" id="action-down" @click="actionDown(id)">Down</button> -->
      <button class="action-button interact" id="action-random" @click="actionRandom()">Try me</button>
      <!-- <button class="action-button interact" id="action-up" @click="actionUp(id)">Up</button> -->
    </div>
  </div>
</template>

<script>
import { actionRandom } from '../action';

export default {
  methods: {
    actionRandom
  }
};
</script>