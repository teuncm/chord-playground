import { defineStore } from 'pinia';

export class Audio {
  audioCtx;
  synthOut;
  out;

  chord;

  // chord = [0, 3, 7];
  

  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.synthOut = this.audioCtx.createGain();
    this.out = this.audioCtx.destination;
    
    this.chord = [0, 3, 7];

    // this.initialize();
  }

  /* Return current audio context timestamp. */
  static now() {
    return Audio.audioCtx.currentTime;
  }
}