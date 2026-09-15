/**
 * audio.ts — Web Audio API synth sounds (zero external files)
 * All sounds: <350ms duration, max vol 0.08 — subconscious feel
 * Always wrapped in try/catch — safe on all browsers
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

const AUDIO_MUTE_KEY = 'portfolio_audio_muted';

function checkInitialMute(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(AUDIO_MUTE_KEY);
    if (saved !== null) return saved === 'true';
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
  } catch {
    /* ignore storage error */
  }
  return false;
}

let mutedState: boolean = checkInitialMute();

export function isAudioMuted(): boolean {
  return mutedState;
}

export function setAudioMuted(muted: boolean): void {
  mutedState = muted;
  try {
    localStorage.setItem(AUDIO_MUTE_KEY, String(muted));
    window.dispatchEvent(new CustomEvent('portfolio:audio-mute-change', { detail: { muted } }));
  } catch {
    /* ignore storage error */
  }
}

export function toggleAudioMuted(): boolean {
  const next = !mutedState;
  setAudioMuted(next);
  if (!next) {
    // Immediate sensory feedback confirming audio is unmuted
    playHoverTick();
  }
  return next;
}

/** Call once on first user interaction to unblock AudioContext */
export function unlockAudio() {
  if (isAudioMuted()) return;
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    /* ignore audio unlock error */
  }
}

/** Navbar / link hover — ultra-brief high-pitched tick */
export function playHoverTick() {
  if (isAudioMuted()) return;
  try {
    const ac  = getCtx();

    const osc  = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ac.currentTime + 0.06);

    gain.gain.setValueAtTime(0.055, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.09);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.09);
  } catch {
    /* ignore audio error */
  }
}

/** Button click — soft triangle synth snap */
export function playClick() {
  if (isAudioMuted()) return;
  try {
    const ac  = getCtx();
    const osc  = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.14);

    gain.gain.setValueAtTime(0.07, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.16);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.16);
  } catch {
    /* ignore audio error */
  }
}

/** Card hover — subtle low synth pulse */
export function playSynthPulse() {
  if (isAudioMuted()) return;
  try {
    const ac     = getCtx();
    const osc    = ac.createOscillator();
    const gain   = ac.createGain();
    const filter = ac.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    osc.type     = 'sawtooth';
    filter.type  = 'lowpass';
    filter.frequency.setValueAtTime(900, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, ac.currentTime + 0.28);

    osc.frequency.setValueAtTime(140, ac.currentTime);
    gain.gain.setValueAtTime(0.045, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.32);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.32);
  } catch {
    /* ignore audio error */
  }
}

/** Page transition — white-noise whoosh band-pass sweep */
export function playTransitionWhoosh() {
  if (isAudioMuted()) return;
  try {
    const ac = getCtx();
    const bufLen = Math.floor(ac.sampleRate * 0.28);
    const buffer = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data   = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const source = ac.createBufferSource();
    source.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type  = 'bandpass';
    filter.frequency.setValueAtTime(180, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2200, ac.currentTime + 0.22);
    filter.Q.setValueAtTime(1.5, ac.currentTime);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.055, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.28);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    source.start();
  } catch {
    /* ignore audio error */
  }
}

/** IntroScreen 100% completion — futuristic dual-harmonic chime */
export function playSystemReadyChime() {
  if (isAudioMuted()) return;
  try {
    const ac = getCtx();
    if (ac.state === 'suspended') ac.resume();

    // Tone 1: Fundamental
    const osc1 = ac.createOscillator();
    const gain1 = ac.createGain();
    osc1.connect(gain1);
    gain1.connect(ac.destination);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ac.currentTime); // D5
    gain1.gain.setValueAtTime(0.045, ac.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.22);
    osc1.start(ac.currentTime);
    osc1.stop(ac.currentTime + 0.22);

    // Tone 2: Harmonic Fifth (staggered by 45ms)
    const osc2 = ac.createOscillator();
    const gain2 = ac.createGain();
    osc2.connect(gain2);
    gain2.connect(ac.destination);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ac.currentTime + 0.045); // A5
    gain2.gain.setValueAtTime(0.0001, ac.currentTime);
    gain2.gain.setValueAtTime(0.05, ac.currentTime + 0.045);
    gain2.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.32);
    osc2.start(ac.currentTime + 0.045);
    osc2.stop(ac.currentTime + 0.32);
  } catch {
    /* ignore audio error */
  }
}

/** IntroScreen Split-Open — pneumatic shutter release & stereo laser whoosh */
export function playApertureSplitSound() {
  if (isAudioMuted()) return;
  try {
    const ac = getCtx();

    if (ac.state === 'suspended') ac.resume();

    // 1. High-frequency seam snap / laser unlatch
    const snapOsc = ac.createOscillator();
    const snapGain = ac.createGain();
    snapOsc.connect(snapGain);
    snapGain.connect(ac.destination);

    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(1800, ac.currentTime);
    snapOsc.frequency.exponentialRampToValueAtTime(240, ac.currentTime + 0.09);

    snapGain.gain.setValueAtTime(0.05, ac.currentTime);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.09);

    snapOsc.start(ac.currentTime);
    snapOsc.stop(ac.currentTime + 0.09);

    // 2. Wide pneumatic whoosh as shutters slide apart
    const bufLen = Math.floor(ac.sampleRate * 0.35);
    const buffer = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const source = ac.createBufferSource();
    source.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2800, ac.currentTime + 0.18);
    filter.frequency.exponentialRampToValueAtTime(350, ac.currentTime + 0.35);
    filter.Q.setValueAtTime(1.8, ac.currentTime);

    const whooshGain = ac.createGain();
    whooshGain.gain.setValueAtTime(0.06, ac.currentTime);
    whooshGain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.35);

    source.connect(filter);
    filter.connect(whooshGain);
    whooshGain.connect(ac.destination);

    source.start(ac.currentTime);
    source.stop(ac.currentTime + 0.35);
  } catch {
    /* ignore audio error */
  }
}

