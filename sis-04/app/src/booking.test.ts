import { describe, expect, it } from 'vitest';
import { canBook, type CanBookInput, type BookingInterval } from './booking';

const DEFAULT_NOW = 540;

const createDefaultFixture = (): {
  now: number;
  blocked: boolean;
  bookings: BookingInterval[];
} => ({
  now: DEFAULT_NOW,
  blocked: false,
  bookings: [{ start: 600, end: 660 }],
});

describe('canBook Unit Tests', () => {
  // AC1: Accept candidate interval only when 0 <= start < end <= 1440 and start > now
  describe('AC1 - Valid Time Interval & Bounds', () => {
    it('rejects negative start time (start < 0)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: -1, end: 60 })).toBe(false);
    });

    it('T02: rejects request starting exactly at current time (540-570)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 540, end: 570 })).toBe(false);
    });

    it('T03: rejects zero-duration interval (720-720)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 720, end: 720 })).toBe(false);
    });

    it('T04: rejects inverted interval where start > end (750-720)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 750, end: 720 })).toBe(false);
    });

    it('T05: rejects interval exceeding 1440 limit (1380-1441)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 1380, end: 1441 })).toBe(false);
    });

    it('X1: accepts interval up to exact upper boundary of 1440 (1320-1440)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 1320, end: 1440 })).toBe(true);
    });

    it('accepts exact 1-minute slot ending at 1440 limit (1439-1440)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 1439, end: 1440 })).toBe(true);
    });

    it('X2: rejects start == now even when bookings list is empty (540-660)', () => {
      const fixture = createDefaultFixture();
      expect(
        canBook({ ...fixture, start: 540, end: 660, bookings: [] })
      ).toBe(false);
    });
  });

  // AC2: Reject booking longer than 120 minutes
  describe('AC2 - Maximum Duration Limit', () => {
    it('accepts booking of 119 minutes (720-839)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 720, end: 839 })).toBe(true);
    });

    it('B1 AC2: accepts booking of exactly 120 minutes (720-840)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 720, end: 840 })).toBe(true);
    });

    it('B2 AC2: rejects booking exceeding 120 minutes (720-841)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 720, end: 841 })).toBe(false);
    });
  });

  // AC3: Reject request when room is blocked
  describe('AC3 - Blocked Room Status', () => {
    it('T13: rejects request on a blocked room (660-720)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 660, end: 720, blocked: true })).toBe(false);
    });
  });

  // AC4: Overlap rule (touching endpoints permitted)
  describe('AC4 - Booking Overlaps & Boundaries', () => {
    it('B3 AC4: accepts request touching endpoint after existing booking (660-720)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 660, end: 720 })).toBe(true);
    });

    it('T08: accepts request touching endpoint before existing booking (570-600)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 570, end: 600 })).toBe(true);
    });

    it('B4 AC4: rejects request overlapping end of existing booking (630-690)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 630, end: 690 })).toBe(false);
    });

    it('T10: rejects request completely encapsulating existing booking (570-690)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 570, end: 690 })).toBe(false);
    });

    it('T11: rejects request inside existing booking (615-645)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 615, end: 645 })).toBe(false);
    });

    it('T12: rejects request matching existing booking bounds exactly (600-660)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 600, end: 660 })).toBe(false);
    });

    it('T14: accepts request when no existing bookings exist (630-690)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 630, end: 690, bookings: [] })).toBe(true);
    });

    it('accepts valid request fitting between two non-adjacent existing bookings', () => {
      const multipleBookings: BookingInterval[] = [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ];
      expect(
        canBook({
          now: DEFAULT_NOW,
          blocked: false,
          start: 660,
          end: 720,
          bookings: multipleBookings,
        })
      ).toBe(true);
    });
  });

  // AC5: Available/Unavailable decision without changing existing booking data
  describe('AC5 - Pure Function Decision & Immutability', () => {
    it('AC5: returns explicit boolean and leaves frozen input data untouched', () => {
      const originalBookings: BookingInterval[] = Object.freeze([
        Object.freeze({ start: 600, end: 660 }),
      ]) as unknown as BookingInterval[];

      const input: CanBookInput = {
        start: 660,
        end: 720,
        now: DEFAULT_NOW,
        blocked: false,
        bookings: originalBookings,
      };

      const result = canBook(input);

      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
      expect(input.bookings).toHaveLength(1);
      expect(input.bookings[0]).toEqual({ start: 600, end: 660 });
    });
  });
});

  describe('Week 08 regression tests', () => {
    it('BUG-A: accepts request touching bookings on both sides', () => {
      const bookings: BookingInterval[] = [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ];

      expect(
        canBook({
          start: 660,
          end: 720,
          now: 540,
          blocked: false,
          bookings,
        })
      ).toBe(true);
    });

    it('BUG-B: available request does not mutate bookings', () => {
      const bookings: BookingInterval[] = [
        { start: 600, end: 660 },
      ];
      const before = bookings.map((booking) => ({ ...booking }));

      const result = canBook({
        start: 720,
        end: 780,
        now: 540,
        blocked: false,
        bookings,
      });

      expect(result).toBe(true);
      expect(bookings).toEqual(before);
    });
  });