export const MINUTES_PER_DAY = 1440;

/** Convert minutes from midnight to a display label. */
export function minutesToLabel(minutes: number): string {
  if (minutes === MINUTES_PER_DAY) {
    return "24:00";
  }

  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const mm = m % 60;

  return `${h.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}`;
}

/** "HH:MM" -> minutes from 00:00. Returns null when malformed. */
export function labelToMinutes(label: string): number | null {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(label.trim());

  if (!match) return null;

  return Number(match[1]) * 60 + Number(match[2]);
}