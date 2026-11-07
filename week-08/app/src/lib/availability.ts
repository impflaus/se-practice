import type { Booking, CheckResult, Interval, Room } from "@/types";

export const MINUTES_PER_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

/** minutes for a single day, with zero-padding. */
export function minutesToLabel(minutes: number): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}

/** "HH:MM" -> minutes from 00:00. Returns null when malformed. */
export function labelToMinutes(label: string): number | null {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(label.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Two intervals overlap when each starts strictly before the other ends. */
export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Evaluate a candidate booking against AC1–AC4.
 * Never mutates room state (AC5).
 */
export function checkAvailability(
  room: Room,
  candidate: Interval,
  currentTime: number,
): CheckResult {
  const reasons: string[] = [];

  // AC1: 0 <= start < end <= 1440 and start after current time.
  if (candidate.start < 0 || candidate.end > MINUTES_PER_DAY) {
    reasons.push("Booking must fall within 00:00–24:00.");
  }
  if (!(candidate.start < candidate.end)) {
    reasons.push("Start time must be earlier than end time.");
  }
  if (candidate.start <= currentTime) {
    reasons.push(
      `Start time must be after the current time (${minutesToLabel(currentTime)}).`,
    );
  }

  // AC2: booking longer than 120 minutes.
  if (candidate.end - candidate.start > MAX_BOOKING_MINUTES) {
    reasons.push("Bookings cannot be longer than 120 minutes.");
  }

  // AC3: room blocked.
  if (room.blocked) {
    reasons.push(
      `This room is blocked${room.blockedReason ? `: ${room.blockedReason}` : ""}.`,
    );
  }

  // AC4: overlap with existing bookings (touching endpoints allowed).
  const conflicting = room.bookings.filter((b: Booking) =>
    overlaps(candidate, b),
  );
  if (conflicting.length > 0) {
    const first = conflicting[0];
    reasons.push(
      `Overlaps existing booking "${first.title}" (${minutesToLabel(first.start)}–${minutesToLabel(first.end)}).`,
    );
  }

  return {
    decision: reasons.length === 0 ? "available" : "unavailable",
    reasons,
  };
}
