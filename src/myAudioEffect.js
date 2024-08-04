/**
 * Classes designed to handle arbitrary AudioNode effect chains while keeping latency at a minimum.
 * 
 * Any MyAudioEffectWrapper w or superclass:
 * - Has its only input node located at w.recursiveIn()
 * - Has its only output node located at w.recursiveOut()
 * - Uses as few AudioNode instances as possible to minimize latency
 */

import { MyAudioState } from "./myAudioState";

export class MyAudioEffectWrapper {
  in = null;
  out = null;

  constructor(nodeIn=null, nodeOut=null) {
    if (nodeIn !== null) {
      if (!(nodeIn instanceof AudioNode)) { 
        throw new Error("Input must be an AudioNode.");
      }
      this.in = nodeIn;

      if (nodeOut !== null) {
        if (!(nodeOut instanceof AudioNode)) { 
          throw new Error("Output must be an AudioNode.");
        }

        this.out = nodeOut;
      } else {
        this.out = nodeIn;
      }
    }
  }

  recursiveIn() {
    if (this.in instanceof MyAudioEffectWrapper) {
      return this.in.recursiveIn();
    } else {
      return this.in;
    }
  }

  recursiveOut() {
    if (this.out instanceof MyAudioEffectWrapper) {
      return this.out.recursiveOut();
    } else {
      return this.out;
    }
  }

  connectWrapper(nextNode) {
    if (!(nextNode instanceof MyAudioEffectWrapper)) {
      nextNode = new MyAudioEffectWrapper(nextNode);
    }

    this.recursiveOut().connect(nextNode.recursiveIn());

    return nextNode;
  }
}

export class MyAudioEffectLane extends MyAudioEffectWrapper {
  effects = null;

  /* Connect effects serially. */
  constructor(effects, connect=true) {
    super();

    const wrappedEffects = effects.map( (x) => x instanceof MyAudioEffectWrapper ? x : new MyAudioEffectWrapper(x) );
    this.effects = wrappedEffects;
    
    this.in = wrappedEffects[0].recursiveIn();

    if (connect) {
      for (let i = 1; i < wrappedEffects.length; i++) {
        wrappedEffects[i-1].recursiveOut().connect(wrappedEffects[i].recursiveIn());
      }
    }

    this.out = wrappedEffects[wrappedEffects.length - 1].recursiveOut();
  }
}

export class MyAudioEffectRack extends MyAudioEffectWrapper {
  effectLanes = null;

  constructor(effectLanes) {
    super();

    const wrappedEffectLanes = effectLanes.map( (x) => x instanceof MyAudioEffectWrapper ? x : new MyAudioEffectWrapper(x) );
    this.effectLanes = wrappedEffectLanes;

    this.in = MyAudioState.audioCtx.createGain();
    this.out = MyAudioState.audioCtx.createGain();

    /* Connect effect lanes or effects parallelly. */
    for (const effectLane of wrappedEffectLanes) {
      this.in.connect(effectLane.recursiveIn());
      effectLane.recursiveOut().connect(this.out);
    }
  }
}

export class MyAudioEffectMix extends MyAudioEffectWrapper {
  dry = null;
  effectRack = null;
  wet = null;

  constructor(effectNode) {
    super();
    
    this.dry = MyAudioState.audioCtx.createGain();
    this.wet = MyAudioState.audioCtx.createGain();

    const wetLane = new MyAudioEffectLane([effectNode, this.wet]);
    this.effectRack = new MyAudioEffectRack([wetLane, this.dry]);

    this.setDryWet(0.66, 0.66);
  }

  setDryWet(dryLevel, wetLevel) {
    this.dry.gain.value = dryLevel;
    this.wet.gain.value = wetLevel;

    return this;
  }
}