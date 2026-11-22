import type { Booking, CheckResult, Interval, Room } from "@/types";

import {
  minutesToLabel,
  MINUTES_PER_DAY,
} from "./time";

export {
  labelToMinutes,
  minutesToLabel,
  MINUTES_PER_DAY,
} from "./time";

export const MAX_BOOKING_MINUTES = 120;


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
