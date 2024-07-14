import { defineStore } from 'pinia';
import { Audio, SynthState } from '../audioState';
import { reactive } from 'vue';

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

// export const useSynthStore = defineStore('synth', {
//   state: () => ({
//     synthState: SynthState
//   }),
//   actions: {

//   }
// });

export const synthState = reactive(new SynthState());