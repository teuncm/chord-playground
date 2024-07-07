export const BASE_FREQ = 440;
export const MIDI_OFFSET = 69;
export const NOTES_PER_OCTAVE = 12;
export const OCTAVE_START = 3;
export const OCTAVE_END = 8;
export const OCTAVE_RANGE = OCTAVE_END - OCTAVE_START;
export const MIDI_START = OCTAVE_START * NOTES_PER_OCTAVE;
export const MIDI_END = OCTAVE_END * NOTES_PER_OCTAVE + NOTES_PER_OCTAVE;
export const MIDI_RANGE = MIDI_END - MIDI_START;
export const DELAY_TIME = 0.3;

import { randFloat } from "./helpers";

export class Audio {
  static audioCtx = null;
  static synthOut = null;
  static out = null;

  static ensureAudioCtx() {
    if (this.audioCtx === null) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.synthOut = this.audioCtx.createGain();
      this.out = this.audioCtx.destination;

      /* Reverb. */
      const reverbFilter = this.audioCtx.createBiquadFilter();
      reverbFilter.type = "highpass";
      reverbFilter.frequency.setValueAtTime(400, this.now());
      reverbFilter.Q.setValueAtTime(0, this.now());

      const reverbDry = this.audioCtx.createGain();
      const reverbWet = this.audioCtx.createGain();
      const convolver = this.createConvReverb(0.1, 5);

      reverbDry.gain.setValueAtTime(1, this.now());
      reverbWet.gain.setValueAtTime(0.7, this.now());
  
      this.synthOut.connect(reverbDry);
      this.synthOut.connect(convolver);
      convolver.connect(reverbFilter);
      reverbFilter.connect(reverbWet);

      const reverb = this.audioCtx.createGain();
      reverbDry.connect(reverb);
      reverbWet.connect(reverb);

      /* Filter. */
      const highShelf = this.audioCtx.createBiquadFilter();
      highShelf.type = "highshelf";
      highShelf.frequency.setValueAtTime(5700, this.now());
      highShelf.gain.setValueAtTime(-40, this.now());

      /* Compress. */
      const compressor = this.audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-28, this.now());
      compressor.ratio.setValueAtTime(8, this.now());
      compressor.attack.setValueAtTime(0.2, this.now());
      compressor.release.setValueAtTime(0.4, this.now());

      /* Clip. */
      const shaper = this.audioCtx.createWaveShaper();
      shaper.curve = new Float32Array([-1, 1]);

      reverb.connect(highShelf);
      highShelf.connect(compressor);
      compressor.connect(shaper);
      shaper.connect(this.out);
    }
  }

  static createConvReverb(delay, duration) {
    const convolver = this.audioCtx.createConvolver();
    
    const numChannels = 2;
    const sr = this.audioCtx.sampleRate;
    const impulseBuffer = this.audioCtx.createBuffer(numChannels, duration * sr, sr);
  
    const maxIdx = duration * sr - 1
    for (let i = 0; i < numChannels; i++) {
      let c = impulseBuffer.getChannelData(i);
  
      /* Empty buffer over initial delay. */
      for (let j = 0; j < delay*sr; j++) {
        c[j] = 0;
      }

      for (let j = delay*sr; j < c.length; j++) {
        /* Decay amplitude over time. */
        let amp = ((maxIdx - j) / maxIdx) ** 1;

        /* Decaying white noise. */
        c[j] = amp * randFloat(-1, 1);
      }
    }
  
    /* Assign buffer. */
    convolver.normalize = true;
    convolver.buffer = impulseBuffer;
  
    return convolver;
  }

  static now() {
    return Audio.audioCtx.currentTime;
  }
}

export function bell(bellFrequency) {
  Audio.ensureAudioCtx();

  const oscillator = Audio.audioCtx.createOscillator();
  const gainNode = Audio.audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(Audio.synthOut);

  /* Control params. */
  const volume = 0.1;
  const delayTime = 0;
  const attackTime = 0.012;
  /* Scale decay inversely based on frequency. */
  const octaveFactor = Math.log(bellFrequency / 55);
  const decayTime = 3 * Math.exp(-octaveFactor) + 0.3;

  /* Calculated params. */
  const curTime = Audio.now();
  const curDelayTime = curTime + delayTime
  const curAttackTime = curDelayTime + attackTime;
  const curDecayTime = curAttackTime + decayTime;

  const delayFrequency = bellFrequency * 0.6;
  const decayFrequency = bellFrequency * 1.01

  /* Oscillator. */
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(bellFrequency, curTime);
  oscillator.frequency.setValueAtTime(delayFrequency, curDelayTime);
  oscillator.frequency.linearRampToValueAtTime(bellFrequency, curAttackTime);
  oscillator.frequency.linearRampToValueAtTime(decayFrequency, curDecayTime);

  /* Volume envelope. */
  gainNode.gain.setValueAtTime(0, curTime);
  gainNode.gain.setValueAtTime(0, curDelayTime);
  gainNode.gain.linearRampToValueAtTime(volume, curAttackTime);
  gainNode.gain.linearRampToValueAtTime(0, curDecayTime);

  oscillator.start(curTime);
  oscillator.stop(curDecayTime);
}