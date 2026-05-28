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

/** Call once on first user interaction to unblock AudioContext */
export function unlockAudio() {
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {}
}

/** Navbar / link hover — ultra-brief high-pitched tick */
export function playHoverTick() {
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
  } catch {}
}

/** Button click — soft triangle synth snap */
export function playClick() {
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
  } catch {}
}

/** Card hover — subtle low synth pulse */
export function playSynthPulse() {
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
  } catch {}
}

/** Page transition — white-noise whoosh band-pass sweep */
export function playTransitionWhoosh() {
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
  } catch {}
}
