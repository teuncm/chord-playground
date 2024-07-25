import { AUDIO_SCHEDULING_GLOBAL_OFFSET } from "./constants";
import { zip, random } from 'lodash';

export class MyAudioState {
  static audioCtx = null;
  static synthOut = null;
  static out = null;

  static ensureAudioCtx() {
    if (this.audioCtx === null) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.synthOut = this.audioCtx.createGain();
      this.out = this.audioCtx.destination;

      this.initializeChain();
    }
  }

  /* Initialize the global effect chain. */
  static initializeChain() {
    /* Reverb. */
    const reverbEffect = new MyAudioEffect(
      setProps(this.audioCtx.createConvolver(), {
        normalize: true,
        buffer: createConvBuffer(0.1, 2, 2)
      })).setDryWet(1, 0.9);


    /* High shelf. */
    const highShelfEffect = new MyAudioEffect(
      setProps(this.audioCtx.createBiquadFilter(), {
        type: "highshelf",
        frequency: 4000,
        gain: -48
      }));

    /* Compress. */
    const compressorEffect = new MyAudioEffect(
      setProps(this.audioCtx.createDynamicsCompressor(), {
        threshold: -30,
        ratio: 5,
        attack: 0.1,
        release: 0.1
      }));

    /* Clip. */
    const waveShaperEffect = new MyAudioEffect(
      setProps(this.audioCtx.createWaveShaper(), {
        curve: new Float32Array([-1, 1])
      }));

    this.synthOut.connect(reverbEffect.in);
    reverbEffect
    .connect(highShelfEffect)
    .connect(compressorEffect)
    .connect(waveShaperEffect)
    .connect(this.out);
  }

  /* Return the current audio sample rate. */
  static sampleRate() {
    return this.audioCtx.sampleRate;
  }

  /* Return current audio context timestamp. */
  static now() {
    return MyAudioState.audioCtx.currentTime + AUDIO_SCHEDULING_GLOBAL_OFFSET;
  }
}

export function bell(bellFrequency) {
  MyAudioState.ensureAudioCtx();

  const oscillator = setProps(MyAudioState.audioCtx.createOscillator(), {
    type: 'sawtooth',
    frequency: bellFrequency
  });
  const gainNode = MyAudioState.audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(MyAudioState.synthOut);

  /* Control params. */
  const volume = 0.1;
  const delayTime = 0;
  const attackTime = 0.1;
  const holdTime = 0.1;
  /* Scale decay inversely based on frequency. */
  const octaveFactor = Math.log(bellFrequency / 27.5);
  const decayTime = 3 * Math.exp(-octaveFactor) + 0.4;

  const timestamps = DAHD(gainNode, "gain", {
    floor: 0,
    level: volume,
    delay: delayTime,
    attack: attackTime,
    hold: holdTime,
    decay: decayTime,
  });

  console.log(timestamps);

  oscillator.start(timestamps[0]);
  oscillator.stop(timestamps[-1]);
}

export class MyAudioEffect {
  in = null;

  nodeIn = null;
  nodeOut = null;
  wet = null;

  dry = null;
  out = null;

  constructor(nodeIn, nodeOut=null) {
    if (nodeOut === null) {
      nodeOut = nodeIn;
    }

    this.in = MyAudioState.audioCtx.createGain();

    this.nodeIn = nodeIn;
    this.nodeOut = nodeOut;
    this.dry = MyAudioState.audioCtx.createGain();
    this.wet = MyAudioState.audioCtx.createGain();

    this.out = MyAudioState.audioCtx.createGain();

    /* Dry. */
    this.in.connect(this.dry);
    this.dry.connect(this.out);

    /* Wet. */
    this.in.connect(nodeIn);
    nodeOut.connect(this.wet);
    this.wet.connect(this.out);

    /* Default to 100% wet. */
    this.setDryWet(0, 1);
  }

  connect(nextNode) {
    if (nextNode instanceof MyAudioEffect) {
      this.out.connect(nextNode.in);

      return nextNode;
    } else {
      return this.out.connect(nextNode);
    }
  }

  setDryWet(dryLevel, wetLevel) {
    setProp(this.dry, "gain", dryLevel);
    setProp(this.wet, "gain", wetLevel);

    return this;
  }
}

/* Create basic Delay-Attack-Hold-Decay envelope. */
export function DAHD(node, prop, envelope) {
  const values = [envelope.floor, envelope.floor, envelope.level, envelope.level, envelope.floor];
  const timestamps = normalizeTimestamps([0, envelope.delay, envelope.attack, envelope.hold, envelope.decay]);
  setEnvelope(node, prop, values, timestamps);

  return timestamps;
}

export function normalizeTimestamps(timestamps) {
  let curTimestamp = MyAudioState.now();
  
  for (let idx = 0; idx < timestamps.length; idx++) {
    curTimestamp += timestamps[idx];
    timestamps[idx] = curTimestamp;
  }

  return timestamps;
}

/* Create an audioParam envelope. */
export function setEnvelope(node, prop, values, timestamps) {
  if (!(node[prop] instanceof AudioParam)) {
    console.error("Property is not an AudioParam.");

    return;
  }
  
  for (const [index, [value, timestamp]] of zip(values, timestamps).entries()) {
    if (index === 0) {
      setProp(node, prop, value, timestamp);
    } else {
      rampPropAt(node, prop, value, timestamp);
    }
  }

  return node;
}

/* Ramp a property on a parameter to a value at a certain timestamp. */
export function rampPropAt(node, prop, value, timestamp) {
  if (!(node[prop] instanceof AudioParam)) {
    console.error("Property is not an AudioParam.");

    return;
  } else {
    node[prop].linearRampToValueAtTime(value, timestamp);
  }

  return node;
}

/* Set multiple properties on a node. */
export function setProps(node, props) {
  for (const [prop, value] of Object.entries(props)) {
    setProp(node, prop, value);
  }

  return node;
}

/* Set a property on a node. */
export function setProp(node, prop, value, timestamp=MyAudioState.now()) {
  if (node[prop] instanceof AudioParam) {
    node[prop].setValueAtTime(value, timestamp);
  } else {
    node[prop] = value;
  }

  return node;
}

/* Generate noise buffer for basic reverb convolutions. */
function createConvBuffer(delay, duration, numChannels) {
  const sampleRate = MyAudioState.sampleRate();
  const convBuffer = MyAudioState.audioCtx.createBuffer(numChannels, duration * sampleRate, sampleRate);

  const maxIdx = duration * sampleRate - 1
  for (let channelIdx = 0; channelIdx < numChannels; channelIdx++) {
    let channel = convBuffer.getChannelData(channelIdx);

    /* Leave buffer empty over initial delay. */
    for (let sampleIdx = 0; sampleIdx < delay * sampleRate; sampleIdx++) {
      channel[sampleIdx] = 0;
    }

    for (let sampleIdx = delay * sampleRate; sampleIdx < channel.length; sampleIdx++) {
      /* Decay amplitude over time. */
      let amp = (maxIdx - sampleIdx) / maxIdx;

      /* Decaying white noise. */
      channel[sampleIdx] = amp * random(-1, 1);
    }
  }

  return convBuffer
}