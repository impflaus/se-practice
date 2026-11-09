export const MINUTES_PER_DAY = 1440;

/** Convert minutes from 00:00 to an HH:MM label. */
export function minutesToLabel(minutes: number): string {
  const m =
    ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;

  const h = Math.floor(m / 60);
  const mm = m % 60;

  return `${h.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}`;
}

/** Convert an HH:MM label to minutes from 00:00. */
export function labelToMinutes(label: string): number | null {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(label.trim());

  if (!match) return null;

  return Number(match[1]) * 60 + Number(match[2]);
}