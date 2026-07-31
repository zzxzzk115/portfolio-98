"use client";

// Synthesized Win98-ish UI sounds — no audio files. The AudioContext is
// created lazily on the first user gesture (autoplay policy).
// These aim for the *character* of the classic sounds (soft pad swells,
// woody ticks, the chord.wav "dong") without sampling anything.

export type SoundName =
  | "startup"
  | "click"
  | "error"
  | "shutdown"
  | "modem";

const STORAGE_KEY = "win98-sound";

let ctx: AudioContext | null = null;
let modemNodes: AudioNode[] = [];

export function soundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== "off";
}

export function setSoundEnabled(on: boolean) {
  localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  if (!on) stopModem();
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface PadOpts {
  attack?: number;
  release?: number;
  gain?: number;
  type?: OscillatorType;
  detune?: number; // cents, applied ± as a chorus pair
  lpf?: number;
}

// Soft synth-pad voice: two detuned oscillators through a lowpass, with a
// slow attack — the backbone of the startup/shutdown swells.
function pad(
  ac: AudioContext,
  freq: number,
  start: number,
  dur: number,
  {
    attack = 0.25,
    release = 1.2,
    gain = 0.05,
    type = "sawtooth",
    detune = 6,
    lpf = 1400,
  }: PadOpts = {}
) {
  const t0 = ac.currentTime + start;
  const g = ac.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.setValueAtTime(gain, t0 + dur);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + release);
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = lpf;
  filter.Q.value = 0.3;
  g.connect(filter).connect(ac.destination);
  const nodes: AudioNode[] = [g, filter];
  [-detune, detune].forEach((d) => {
    const osc = ac.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = d;
    osc.connect(g);
    osc.start(t0);
    osc.stop(t0 + dur + release + 0.1);
    nodes.push(osc);
  });
  return nodes;
}

// Bell-ish partial for sparkle on top of the pads.
function bell(
  ac: AudioContext,
  freq: number,
  start: number,
  dur: number,
  gain = 0.04
) {
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
  return [osc, g];
}

function tone(
  ac: AudioContext,
  freq: number,
  start: number,
  dur: number,
  gainVal: number,
  type: OscillatorType = "sine"
) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ac.currentTime + start);
  g.gain.linearRampToValueAtTime(gainVal, ac.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.05);
  return [osc, g];
}

function noise(ac: AudioContext, start: number, dur: number, gainVal: number) {
  const len = Math.ceil(ac.sampleRate * dur);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const g = ac.createGain();
  g.gain.value = gainVal;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  src.connect(filter).connect(g).connect(ac.destination);
  src.start(ac.currentTime + start);
  return [src, g];
}

export function stopModem() {
  modemNodes.forEach((n) => {
    try {
      (n as OscillatorNode).stop?.();
      n.disconnect();
    } catch {
      // already stopped
    }
  });
  modemNodes = [];
}

export function playSound(name: SoundName) {
  if (!soundEnabled()) return;
  const ac = getCtx();
  if (!ac) return;

  switch (name) {
    case "startup": {
      // Slow warm swell on a wide major-add9 voicing, with a couple of
      // bell partials blooming on top — The Microsoft Mood™.
      pad(ac, 65.41, 0, 2.2, { attack: 0.5, release: 2.0, gain: 0.05, lpf: 700 }); // C2
      pad(ac, 130.81, 0.05, 2.2, { attack: 0.6, release: 2.0, gain: 0.045 }); // C3
      pad(ac, 196.0, 0.1, 2.1, { attack: 0.7, release: 2.0, gain: 0.04 }); // G3
      pad(ac, 329.63, 0.15, 2.0, { attack: 0.8, release: 2.2, gain: 0.035 }); // E4
      pad(ac, 587.33, 0.2, 1.9, { attack: 0.9, release: 2.4, gain: 0.025, lpf: 2400 }); // D5
      bell(ac, 1046.5, 0.9, 2.2, 0.028); // C6
      bell(ac, 1567.98, 1.3, 2.4, 0.02); // G6
      break;
    }
    case "click": {
      // Woody navigation tick: a tiny damped sine knock.
      tone(ac, 1100, 0, 0.03, 0.09, "sine");
      tone(ac, 320, 0, 0.05, 0.05, "triangle");
      break;
    }
    case "error": {
      // chord.wav vibes: a blunt, slightly dissonant "dong".
      tone(ac, 392.0, 0, 0.45, 0.07, "triangle"); // G4
      tone(ac, 415.3, 0, 0.45, 0.06, "triangle"); // G#4 — the rub
      tone(ac, 196.0, 0, 0.5, 0.06, "sine"); // G3 body
      break;
    }
    case "shutdown": {
      // Gentle descending swell — the day is done.
      pad(ac, 392.0, 0, 1.0, { attack: 0.3, release: 1.6, gain: 0.04 }); // G4
      pad(ac, 329.63, 0.25, 1.0, { attack: 0.3, release: 1.6, gain: 0.04 }); // E4
      pad(ac, 261.63, 0.5, 1.1, { attack: 0.3, release: 1.8, gain: 0.045 }); // C4
      pad(ac, 130.81, 0.7, 1.2, { attack: 0.4, release: 2.0, gain: 0.05, lpf: 800 }); // C3
      break;
    }
    case "modem": {
      // Abridged 56k handshake: dial tone, DTMF blips, carrier, static.
      modemNodes = [
        ...tone(ac, 350, 0, 0.5, 0.05),
        ...tone(ac, 440, 0, 0.5, 0.05),
        ...tone(ac, 1209, 0.6, 0.09, 0.07),
        ...tone(ac, 852, 0.75, 0.09, 0.07),
        ...tone(ac, 1336, 0.9, 0.09, 0.07),
        ...tone(ac, 2100, 1.15, 0.5, 0.05),
        ...tone(ac, 1300, 1.7, 0.35, 0.05, "square"),
        ...tone(ac, 980, 1.7, 0.35, 0.04),
        ...noise(ac, 2.1, 1.1, 0.05),
      ];
      break;
    }
  }
}
