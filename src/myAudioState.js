import { AUDIO_SCHEDULING_GLOBAL_OFFSET } from "./constants";
import { setNodeProp, setNodeProps } from "./helpers";
import { zip, random } from 'lodash';
import { MyAudioEffectLane, MyAudioEffectRack } from "./myAudioEffect";

export class MyAudioState {
  static audioCtx = null;
  static synthOut = null;
  static out = null;

  static ensureAudioCtx() {
    if (this.audioCtx === null) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.synthOut = this.audioCtx.createGain();
      this.out = this.audioCtx.destination;

      this.constructEffectChain();
    }
  }

  /* Bypass the effect chain. */
  static bypassEffectChain() {
    this.synthOut.connect(this.out);
  }

  /* Construct and connect the effect chain. */
  static constructEffectChain() {
    const delayNodeLeft = setNodeProps(this.audioCtx.createDelay(), {
      delayTime: 0.2
    });
    const delayNodeRight = setNodeProps(this.audioCtx.createDelay(), {
      delayTime: 0.2
    });
    const feedbackNode = setNodeProps(this.audioCtx.createGain(), {
      gain: 0.6
    });
    const mergerNode = this.audioCtx.createChannelMerger(2);

    feedbackNode.connect(delayNodeLeft);
    delayNodeLeft.connect(delayNodeRight);
    delayNodeRight.connect(feedbackNode);

    delayNodeLeft.connect(mergerNode, 0, 0);
    delayNodeRight.connect(mergerNode, 0, 1);

    const pingpongDry = setNodeProps(this.audioCtx.createGain(), {
      gain: 1
    });

    const pingpongWet = setNodeProps(this.audioCtx.createGain(), {
      gain: 0.5
    });

    mergerNode.connect(pingpongWet);

    /* Ping-pong. */
    const pingpongEffect = new MyAudioEffectRack([
      new MyAudioEffectLane([feedbackNode, mergerNode, pingpongWet], false),
      pingpongDry
    ]);

    /* Reverb. */
    const reverbNode = setNodeProps(this.audioCtx.createConvolver(), {
      normalize: true,
      buffer: createConvBuffer(0.08, 2, 2)
    });

    const reverbDry = setNodeProps(this.audioCtx.createGain(), {
      gain: 1
    });

    const reverbWet = setNodeProps(this.audioCtx.createGain(), {
      gain: 0.7
    });

    const highPass = setNodeProps(this.audioCtx.createBiquadFilter(), {
      type: "highpass",
      frequency: 300,
      gain: -30,
      channelCount: 2,
    });

    const reverbEffect = new MyAudioEffectRack([
      new MyAudioEffectLane([reverbNode, highPass, reverbWet]),
      reverbDry
    ]);

    /* Effect chain. */
    const effects = new MyAudioEffectLane([
      pingpongEffect,
      reverbEffect,
      setNodeProps(this.audioCtx.createBiquadFilter(), {
        type: "highshelf",
        frequency: 4000,
        gain: -48,
        channelCount: 2,
      }),
      setNodeProps(this.audioCtx.createDynamicsCompressor(), {
        threshold: -30,
        ratio: 6,
        attack: 0,
        release: 0.3
      }),
      setNodeProps(this.audioCtx.createWaveShaper(), {
        curve: new Float32Array([-1, 1])
      })
    ]);

    this.synthOut.connect(effects.recursiveIn());
    effects.recursiveOut().connect(this.out);
  }

  /* Return the current audio sample rate. */
  static sampleRate() {
    return this.audioCtx.sampleRate;
  }

  /* Return current audio context timestamp. 
  Important: add constant offset to ease browser event scheduling
  and reduce audio glitches. */
  static now() {
    return MyAudioState.audioCtx.currentTime + AUDIO_SCHEDULING_GLOBAL_OFFSET;
  }
}

export function bell(bellFrequency) {
  MyAudioState.ensureAudioCtx();

  const oscillator = setNodeProps(MyAudioState.audioCtx.createOscillator(), {
    type: 'sawtooth',
    frequency: bellFrequency
  });
  const gainNode = setNodeProps(MyAudioState.audioCtx.createGain(), {
    gain: 0.2
  });

  oscillator.connect(gainNode);
  gainNode.connect(MyAudioState.synthOut);

  /* Control params. */
  const gainLevel = 0.1;
  const delayTime = 0;
  const attackTime = 0.1;
  const holdTime = 0.1;
  const decayTime = 0.2;
  /* Scale decay inversely based on frequency. */
  // const octaveFactor = Math.log(bellFrequency / 27.5);
  // const decayTime = 3 * Math.exp(-octaveFactor) + 0.4;

  const levels = [0, gainLevel, gainLevel, 0];
  const timestamps = [delayTime, attackTime, holdTime, decayTime];

  // console.log(timestamps);

  oscillator.start(MyAudioState.now());
  oscillator.stop(MyAudioState.now() + 0.15);
}

/* Create basic Delay-Attack-Hold-Decay envelope. */
export function DAHD(node, prop, values, timestamps) {
  normalizedTimestamps = normalizeTimestamps(timestamps);
  setEnvelope(node, prop, values, normalizedTimestamps);
}

export function normalizeTimestamps(timestamps) {
  let curTimestamp = MyAudioState.now();
  const normalizedTimestamps = [];
  
  for (let idx = 0; idx < timestamps.length; idx++) {
    curTimestamp += timestamps[idx];
    normalizedTimestamps.push(curTimestamp);
  }

  return normalizedTimestamps;
}

/* Create an audioParam envelope. */
export function setEnvelope(node, prop, values, timestamps) {
  if (!(node[prop] instanceof AudioParam)) {
    console.error("Property is not an AudioParam.");

    return;
  }
  
  for (const [index, [value, timestamp]] of zip(values, timestamps).entries()) {
    if (index === 0) {
      setNodeProp(node, prop, value, timestamp);
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

/* Generate noise buffer for basic reverb convolutions. 
Warning: convolution is a very expensive operation, see e.g. 
https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/convolution.html) */
function createConvBuffer(convDelay, convDuration, numChannels) {
  const sampleRate = MyAudioState.sampleRate();
  const convBuffer = MyAudioState.audioCtx.createBuffer(numChannels, convDuration * sampleRate, sampleRate);

  const maxSampleIdx = convDuration * sampleRate - 1;
  const convDelayIdx = convDelay * sampleRate;
  /* Create separate noise buffer for each channel. */
  for (let channelIdx = 0; channelIdx < numChannels; channelIdx++) {
    let channel = convBuffer.getChannelData(channelIdx);

    /* Leave buffer empty over initial delay. */
    for (let sampleIdx = 0; sampleIdx < convDelayIdx; sampleIdx++) {
      channel[sampleIdx] = 0;
    }

    /* Linearly decay white noise over time. */
    for (let sampleIdx = convDelayIdx; sampleIdx < channel.length; sampleIdx++) {
      let whiteNoise = random(-1, 1);
      let amp = (maxSampleIdx - sampleIdx) / maxSampleIdx;
      channel[sampleIdx] = amp * whiteNoise;
    }
  }

  return convBuffer
}