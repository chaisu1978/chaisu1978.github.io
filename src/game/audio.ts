import { storage } from "./storage";

// Procedural retro SFX — Web Audio oscillators, no asset files needed.
class Sfx {
  private ctx: AudioContext | null = null;

  private ensure() {
    this.ctx ??= new AudioContext();
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  get muted() {
    return storage.muted;
  }

  toggleMute() {
    storage.muted = !storage.muted;
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType = "square",
    vol = 0.05,
    delay = 0,
    slideTo?: number
  ) {
    if (this.muted) return;
    this.ensure();
    const ctx = this.ctx!;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 1), t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  jump() {
    this.tone(280, 0.15, "square", 0.045, 0, 620);
  }
  collect() {
    this.tone(660, 0.06);
    this.tone(990, 0.09, "square", 0.05, 0.06);
  }
  power() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.09, "triangle", 0.05, i * 0.06));
  }
  hit() {
    this.tone(180, 0.25, "sawtooth", 0.06, 0, 55);
  }
  resolve() {
    this.tone(520, 0.08, "triangle", 0.05);
    this.tone(780, 0.12, "triangle", 0.05, 0.07);
  }
  smash() {
    this.tone(140, 0.12, "square", 0.08, 0, 70);
  }
  win() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.12, "triangle", 0.05, i * 0.09));
  }
  lose() {
    [400, 300, 220, 140].forEach((f, i) => this.tone(f, 0.18, "sawtooth", 0.05, i * 0.13));
  }
}

export const sfx = new Sfx();
