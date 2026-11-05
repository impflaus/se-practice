export interface BookingInterval {
  start: number;
  end: number;
}

export interface CanBookInput {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: BookingInterval[];
}

const MINUTES_PER_DAY = 1440;
const MAX_BOOKING_MINUTES = 120;

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: CanBookInput): boolean {
  if (start < 0 || end > MINUTES_PER_DAY) {
    return false;
  }

  if (!(start < end)) {
    return false;
  }

  if (start <= now) {
    return false;
  }

  if (end - start > MAX_BOOKING_MINUTES) {
    return false;
  }

  if (blocked) {
    return false;
  }

  for (const booking of bookings) {
    if (start < booking.end && booking.start < end) {
      return false;
    }
  }

  return true;
}