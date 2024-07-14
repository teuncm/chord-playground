import { defineStore } from 'pinia';
import { Audio } from '../audioState';

export const useAudioStore = defineStore('audio', {
  state: () => ({
    audioInstance: null
  }),
  actions: {
    initializeAudio() {
      this.audioInstance = new Audio();
    },
    getChord() {
      return this.audioInstance.chord;
    },
    setChord(chord) {
      this.audioInstance.chord = chord;
    }
  }
});