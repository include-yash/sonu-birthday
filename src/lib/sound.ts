import { isPlaceholder } from "./birthday-utils";

/** Tiny synthesized SFX (no assets needed) + single shared music element. */
let ctx: AudioContext | null = null;
let muted = false;
let lastSfx = 0;
let music: HTMLAudioElement | null = null;
let musicSrc = "";

export const setMuted = (m: boolean) => {
  muted = m;
  if (music) music.muted = m;
};

function ac() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "triangle", vol = 0.12) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.05);
}

export type Sfx = "fanfare" | "pop" | "stamp" | "pluck" | "whoosh" | "chime" | "boop";

export function sfx(kind: Sfx) {
  if (muted) return;
  const now = performance.now();
  if (now - lastSfx < 70) return; // prevent overlap spam
  lastSfx = now;
  switch (kind) {
    case "fanfare": [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, i === 3 ? 0.6 : 0.16, "square", 0.06)); break;
    case "pop": tone(880, 0, 0.08, "sine", 0.15); tone(1320, 0.04, 0.08, "sine", 0.08); break;
    case "stamp": tone(90, 0, 0.18, "square", 0.12); tone(60, 0.02, 0.2, "sine", 0.2); break;
    case "pluck": tone(1200 + Math.random() * 500, 0, 0.15, "sine", 0.1); break;
    case "whoosh": tone(300, 0, 0.3, "sawtooth", 0.03); tone(150, 0.05, 0.3, "sawtooth", 0.03); break;
    case "chime": [784, 988, 1175].forEach((f, i) => tone(f, i * 0.09, 0.5, "sine", 0.08)); break;
    case "boop": tone(220, 0, 0.12, "square", 0.06); break;
  }
}

/** Plays a music file if it has been supplied; returns false when unavailable. */
export async function playMusic(src: string): Promise<boolean> {
  if (isPlaceholder(src) || typeof window === "undefined") return false;
  if (music && musicSrc === src) {
    try { await music.play(); return true; } catch { return false; }
  }
  music?.pause();
  music = new Audio(src);
  musicSrc = src;
  music.loop = true;
  music.volume = 0.5;
  music.muted = muted;
  try { await music.play(); return true; } catch { music = null; musicSrc = ""; return false; }
}
export const pauseMusic = () => music?.pause();
export const isMusicPlaying = () => !!music && !music.paused;
