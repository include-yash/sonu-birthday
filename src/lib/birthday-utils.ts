export const isPlaceholder = (v?: string | null) => !v || /\[ADD_[A-Z0-9_]+\]/.test(v);

/** Returns real content, or the fallback when the value is still a placeholder. */
export const txt = (v: string | undefined, fallback = "") => (isPlaceholder(v) ? fallback : (v as string));

export type TimeLeft = { done: boolean; days: number; hours: number; minutes: number; seconds: number };

export function timeUntil(targetISO: string, now: Date = new Date()): TimeLeft {
  const diff = new Date(targetISO).getTime() - now.getTime();
  if (diff <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const s = Math.floor(diff / 1000);
  return { done: false, days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}
