<template>
  <div>
    <h1>Audio Component</h1>
    <button @click="initializeAudio">Initialize Audio</button>
    <p>Current Chord: {{ chord }}</p>
    <button @click="changeChord">Change Chord</button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useAudioStore } from '../stores/store';

export default {
  setup() {
    const audioStore = useAudioStore();

    const initializeAudio = () => {
      audioStore.initializeAudio();
    };

    const chord = computed(() => {
      if (audioStore.audioInstance) {
        return audioStore.getChord();
      }
      return [];
    });

    const changeChord = () => {
      // audioStore.setChord([0, 4, 7]);

      audioStore.audioInstance.chord = [0, 4, 7];
    };

    return {
      initializeAudio,
      chord,
      changeChord
    };
  }
};
</script>