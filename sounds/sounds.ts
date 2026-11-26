/* ── Bencho sounds ─────────────────────────────────────────
   30 interface sounds from https://bencho.dev/sounds, synthesised with the
   Web Audio API: no files, no dependencies, a few hundred bytes
   each. Every sound is a list of notes — an oscillator or a burst
   of filtered noise, a lowpass, and an envelope.

     import { play } from "./sounds";
     button.onclick = () => play("tick");

   Browsers only allow audio after a user gesture, so call play()
   from a click, a key press or a pointer event.

   MIT licensed. Beacon and Plop are rebuilt from cuelume by
   Daniel Belyi (MIT, © 2026 Daniel Belyi) — see THIRD_PARTY.md. */

export type Note = {
  hz: number;        // pitch, or the filter's corner for noise
  to?: number;       // glide to this
  glide?: number;    // ms the glide takes, if not the whole note
  ms: number;        // length
  gain?: number;
  wave?: OscillatorType;
  cut?: number;      // lowpass
  at?: number;       // start, ms after play()
  atk?: number;      // attack, ms
  noise?: "bandpass" | "lowpass";
  q?: number;
  lin?: true;        // linear swell instead of exponential
};

export const SOUNDS = {
  /* Glint · Selection */
  glint: [
    { hz: 2270, to: 2080, ms: 30, gain: 0.04, atk: 1, glide: 10 },
    { hz: 3370, to: 3100, ms: 26, gain: 0.032, atk: 1 },
    { hz: 4200, ms: 18, gain: 0.04, noise: "bandpass", q: 1.2, atk: 1 },
    { hz: 520, to: 420, ms: 30, gain: 0.0096, atk: 1 },
  ],
  /* Clack · Selection */
  clack: [
    { hz: 2600, ms: 5, gain: 0.19, noise: "bandpass", q: 0.5, atk: 0.5 },
    { hz: 75, to: 48, ms: 48, gain: 0.071, at: 2, atk: 2, glide: 12 },
    { hz: 55, ms: 48, gain: 0.026, at: 3, atk: 3 },
    { hz: 2800, ms: 5, gain: 0.19, noise: "bandpass", q: 0.5, at: 106, atk: 0.5 },
    { hz: 75, to: 48, ms: 48, gain: 0.077, at: 108, atk: 2, glide: 12 },
    { hz: 55, ms: 48, gain: 0.03, at: 110, atk: 3 },
  ],
  /* Dial · Progress */
  dial: [
    { hz: 900, to: 1800, glide: 600, ms: 718, gain: 0.076, noise: "bandpass", q: 2, atk: 150, lin: true },
    { hz: 200, to: 500, glide: 600, ms: 744, gain: 0.057, noise: "lowpass", q: 0.7, atk: 150, lin: true },
    { hz: 2600, to: 3600, glide: 600, ms: 737, gain: 0.019, noise: "bandpass", q: 4, atk: 150, lin: true },
  ],
  /* Crinkle · Actions */
  crinkle: [
    { hz: 3400, ms: 22, gain: 0.05, at: 0, q: 2, noise: "bandpass", atk: 1 },
    { hz: 2600, ms: 18, gain: 0.04, at: 34, q: 2, noise: "bandpass", atk: 1 },
    { hz: 4200, ms: 16, gain: 0.035, at: 61, q: 2, noise: "bandpass", atk: 1 },
    { hz: 3000, ms: 24, gain: 0.045, at: 92, q: 2, noise: "bandpass", atk: 1 },
  ],
  /* Toss · Movement */
  toss: [
    { hz: 1100, to: 520, ms: 170, gain: 0.03, q: 0.8, noise: "bandpass", atk: 40, lin: true },
  ],
  /* Till · Feedback */
  till: [
    { hz: 45, to: 32, ms: 135, gain: 0.05, atk: 70, lin: true },
    { hz: 3200, ms: 110, gain: 0.04, noise: "bandpass", q: 0.6, at: 50, atk: 25, lin: true },
    { hz: 5000, ms: 600, gain: 0.012, noise: "bandpass", q: 2, at: 100, atk: 10 },
    { hz: 5300, ms: 1000, gain: 0.011, at: 95, atk: 4 },
    { hz: 5478, ms: 750, gain: 0.0084, at: 95, atk: 4 },
    { hz: 4160, ms: 1500, gain: 0.0096, at: 115, atk: 4 },
    { hz: 4370, ms: 1400, gain: 0.009, at: 115, atk: 4 },
    { hz: 3735, ms: 1200, gain: 0.0048, at: 300, atk: 40 },
    { hz: 3095, ms: 1200, gain: 0.0042, at: 400, atk: 40 },
  ],
  /* Paid · Feedback */
  paid: [
    { hz: 587, ms: 170, gain: 0.05, wave: "sine", cut: 2600, atk: 5 },
    { hz: 880, ms: 460, gain: 0.046, wave: "sine", cut: 2800, atk: 6, at: 95 },
    { hz: 1760, ms: 300, gain: 0.009, wave: "sine", atk: 8, at: 100 },
  ],
  /* Landed · Feedback */
  landed: [
    { hz: 330, to: 620, ms: 120, gain: 0.018, wave: "triangle", cut: 1400, atk: 30 },
    { hz: 784, ms: 120, gain: 0.04, wave: "sine", cut: 2600, atk: 4, at: 70 },
    { hz: 1047, ms: 130, gain: 0.04, wave: "sine", cut: 2800, atk: 4, at: 140 },
    { hz: 1319, ms: 520, gain: 0.044, wave: "sine", cut: 3000, atk: 5, at: 210 },
    { hz: 2638, ms: 320, gain: 0.007, wave: "sine", atk: 8, at: 215 },
  ],
  /* Plop · Actions */
  plop: [
    { hz: 480, to: 300, glide: 18, ms: 23, gain: 0.064, atk: 1 },
    { hz: 600, to: 900, glide: 40, ms: 61, gain: 0.015, atk: 12 },
    { hz: 960, to: 600, glide: 18, ms: 18, gain: 0.016, atk: 1 },
  ],
  /* Beacon · Notifications */
  beacon: [
    { hz: 2500, ms: 5, gain: 0.029, noise: "lowpass", q: -3, atk: 1 },
    { hz: 880, ms: 602, gain: 0.026, atk: 3 },
    { hz: 2428.8, ms: 283, gain: 0.0077, atk: 3 },
    { hz: 4752, ms: 172, gain: 0.0026, atk: 3 },
    { hz: 882, ms: 573, gain: 0.014, atk: 3 },
    { hz: 1318.51, ms: 562, gain: 0.02, atk: 3 },
    { hz: 3639.1, ms: 264, gain: 0.0059, atk: 3 },
  ],
  /* Drift · Movement */
  drift: [
    { hz: 174, to: 155, ms: 250, gain: 0.034, wave: "sine", cut: 640, atk: 28 },
  ],
  /* Hush · System */
  hush: [
    { hz: 330, to: 247, ms: 88, gain: 0.03, wave: "sine", cut: 720, atk: 8 },
  ],
  /* Wisp · Movement */
  wisp: [
    { hz: 660, to: 720, ms: 38, gain: 0.028, wave: "sine" },
  ],
  /* Sigh · Feedback */
  sigh: [
    { hz: 262, to: 131, ms: 28, gain: 0.065, wave: "triangle", cut: 1700, atk: 8 },
  ],
  /* Perk · Notifications */
  perk: [
    { hz: 330, ms: 360, gain: 0.053, wave: "sine", cut: 560, atk: 90 },
  ],
  /* Purr · System */
  purr: [
    { hz: 92, ms: 350, gain: 0.046, wave: "triangle", cut: 1100, atk: 32 },
  ],
  /* Lull · Movement */
  lull: [
    { hz: 234, ms: 214, gain: 0.054, wave: "sine", cut: 820, atk: 8 },
  ],
  /* Whisk · Navigation */
  whisk: [
    { hz: 124, to: 65, ms: 130, gain: 0.067, wave: "sine", cut: 560, atk: 50 },
  ],
  /* Buzz · Feedback */
  buzz: [
    { hz: 344, to: 239, ms: 24, gain: 0.048, wave: "triangle", cut: 1100, atk: 7 },
  ],
  /* Bump · Feedback */
  bump: [
    { hz: 208, to: 165, ms: 120, gain: 0.03, wave: "sine", cut: 520, atk: 10 },
  ],
  /* Float · Movement */
  float: [
    { hz: 262, ms: 322, gain: 0.052, wave: "sine", cut: 820, atk: 16 },
  ],
  /* Glide · Navigation */
  glide: [
    { hz: 397, to: 276, ms: 205, gain: 0.065, wave: "sine", cut: 820, atk: 90 },
  ],
  /* Step · Navigation */
  step: [
    { hz: 227, to: 114, ms: 311, gain: 0.051, wave: "sine", cut: 820, atk: 90 },
  ],
  /* Wander · Movement */
  wander: [
    { hz: 315, ms: 326, gain: 0.061, wave: "sine", cut: 820, atk: 7 },
  ],
  /* Tick · Selection */
  tick: [
    { hz: 196, to: 130, ms: 150, gain: 0.07, wave: "sine", cut: 900 },
  ],
  /* Latch · Selection */
  latch: [
    { hz: 256, ms: 90, gain: 0.058, wave: "square", cut: 2400, atk: 10 },
  ],
  /* Hail · Notifications */
  hail: [
    { hz: 392, ms: 360, gain: 0.051, wave: "sine", cut: 560, atk: 90 },
  ],
  /* Drape · Movement */
  drape: [
    { hz: 220, ms: 215, gain: 0.059, wave: "sine", cut: 560, atk: 8 },
  ],
  /* Boot · System */
  boot: [
    { hz: 291, ms: 360, gain: 0.043, wave: "sine", cut: 560, atk: 90 },
  ],
  /* Drone · System */
  drone: [
    { hz: 115, ms: 294, gain: 0.068, wave: "sine", cut: 560, atk: 72 },
  ],
} satisfies Record<string, Note[]>;

export type SoundName = keyof typeof SOUNDS;
export const SOUND_NAMES = Object.keys(SOUNDS) as SoundName[];

let ctx: AudioContext | null = null;
const NOISE = new WeakMap<BaseAudioContext, AudioBuffer>();
function noiseFor(c: BaseAudioContext) {
  let b = NOISE.get(c);
  if (!b) {
    b = c.createBuffer(1, Math.floor(c.sampleRate * 2), c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    NOISE.set(c, b);
  }
  return b;
}

/* write a sound's notes into any context, at a time — the same
   code plays it live and can render it into an OfflineAudioContext */
export function schedule(c: BaseAudioContext, notes: readonly Note[], when: number, volume = 1, bend = 1) {
  for (const n of notes) {
    const t0 = when + (n.at ?? 0) / 1000;
    const t1 = t0 + n.ms / 1000;
    const tg = n.glide ? t0 + n.glide / 1000 : t1;
    let src: AudioScheduledSourceNode;
    let head: AudioNode;
    if (n.noise) {
      const s = c.createBufferSource();
      s.buffer = noiseFor(c);
      s.loop = true;
      const f = c.createBiquadFilter();
      f.type = n.noise;
      f.frequency.setValueAtTime(n.hz * bend, t0);
      if (n.to) f.frequency.exponentialRampToValueAtTime(n.to * bend, tg);
      if (n.q !== undefined) f.Q.value = n.q;
      s.connect(f);
      src = s;
      head = f;
    } else {
      const o = c.createOscillator();
      o.type = n.wave ?? "sine";
      o.frequency.setValueAtTime(n.hz * bend, t0);
      if (n.to) o.frequency.exponentialRampToValueAtTime(n.to * bend, tg);
      src = o;
      head = o;
    }
    /* nothing starts at full gain: that is a click on the front */
    const g = c.createGain();
    const atk = Math.min((n.atk ?? 4) / 1000, (n.ms / 1000) * 0.6);
    const peak = (n.gain ?? 0.05) * volume;
    g.gain.setValueAtTime(0.0001, t0);
    if (n.lin) g.gain.linearRampToValueAtTime(peak, t0 + atk);
    else g.gain.exponentialRampToValueAtTime(peak, t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t1);
    let tail: AudioNode = head;
    if (n.cut) {
      const f = c.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = n.cut;
      head.connect(f);
      tail = f;
    }
    tail.connect(g).connect(c.destination);
    if (n.noise) (src as AudioBufferSourceNode).start(t0, Math.random() * 1.5);
    else src.start(t0);
    src.stop(t1 + 0.02);
  }
}

/* play a sound now. `volume` scales it (1 is as designed);
   `pitch` bends it, 1 being as written — 1.12 is about two
   semitones up, handy for a row of items that should rise */
export function play(name: SoundName, o: { volume?: number; pitch?: number } = {}) {
  if (typeof window === "undefined") return;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  schedule(ctx, SOUNDS[name], ctx.currentTime + 0.005, o.volume ?? 1, o.pitch ?? 1);
}
