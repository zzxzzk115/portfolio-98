"use client";

// Synthesized Win98-ish UI sounds — no audio files. The AudioContext is
// created lazily on the first user gesture (autoplay policy).

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
  g.gain.exponentialRampToValueAtTime(
    0.0001,
    ac.currentTime + start + dur
  );
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
      // Rising major chord, soft pad
      [261.63, 329.63, 392.0, 523.25].forEach((f, i) =>
        tone(ac, f, i * 0.12, 1.4 - i * 0.1, 0.08, "triangle")
      );
      break;
    }
    case "click": {
      tone(ac, 880, 0, 0.04, 0.06, "square");
      break;
    }
    case "error": {
      tone(ac, 220, 0, 0.18, 0.1, "square");
      tone(ac, 174, 0.16, 0.3, 0.1, "square");
      break;
    }
    case "shutdown": {
      [523.25, 392.0, 329.63, 261.63].forEach((f, i) =>
        tone(ac, f, i * 0.14, 0.9 - i * 0.05, 0.08, "triangle")
      );
      break;
    }
    case "modem": {
      // Abridged 56k handshake: dial tone, two DTMF-ish blips, carrier
      // tones, then static.
      modemNodes = [
        ...tone(ac, 350, 0, 0.5, 0.05),
        ...tone(ac, 440, 0, 0.5, 0.05),
        ...tone(ac, 1209, 0.6, 0.09, 0.07, "sine"),
        ...tone(ac, 852, 0.75, 0.09, 0.07, "sine"),
        ...tone(ac, 1336, 0.9, 0.09, 0.07, "sine"),
        ...tone(ac, 2100, 1.15, 0.5, 0.05),
        ...tone(ac, 1300, 1.7, 0.35, 0.05, "square"),
        ...tone(ac, 980, 1.7, 0.35, 0.04),
        ...noise(ac, 2.1, 1.1, 0.05),
      ];
      break;
    }
  }
}
