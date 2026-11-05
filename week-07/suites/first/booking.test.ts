import { describe, expect, it } from 'vitest';
import { canBook, type BookingInterval, type CanBookInput } from './canBook'; // Adjust path if needed

// Fixed Default Fixtures
const DEFAULT_NOW = 540;
const DEFAULT_BLOCKED = false;
const createDefaultBookings = (): BookingInterval[] => [
  { start: 600, end: 660 },
];

function createInput(overrides: Partial<CanBookInput> = {}): CanBookInput {
  return {
    start: 660,
    end: 720,
    now: DEFAULT_NOW,
    blocked: DEFAULT_BLOCKED,
    bookings: createDefaultBookings(),
    ...overrides,
  };
}

describe('canBook domain function tests (AC1 - AC5)', () => {
  // --- AC1: Interval validation (0 <= start < end <= 1440 and start > now) ---
  describe('AC1: Candidate Interval Validation', () => {
    it('T02: rejects request starting exactly at current time (start = now)', () => {
      const input = createInput({ start: 540, end: 570 });
      expect(canBook(input)).toBe(false);
    });

    it('T03: rejects zero-duration interval (start === end)', () => {
      const input = createInput({ start: 720, end: 720 });
      expect(canBook(input)).toBe(false);
    });

    it('T04: rejects invalid interval where start > end', () => {
      const input = createInput({ start: 750, end: 720 });
      expect(canBook(input)).toBe(false);
    });

    it('T05: rejects request ending past day boundary (end > 1440)', () => {
      const input = createInput({ start: 1380, end: 1441 });
      expect(canBook(input)).toBe(false);
    });

    it('X1: accepts maximum valid interval ending at boundary (1440)', () => {
      const input = createInput({ start: 1320, end: 1440 });
      expect(canBook(input)).toBe(true);
    });

    it('X2: rejects start = now even with empty bookings list', () => {
      const input = createInput({ start: 540, end: 660, bookings: [] });
      expect(canBook(input)).toBe(false);
    });
  });

  // --- AC2: Maximum duration (<= 120 mins) ---
  describe('AC2: Booking Duration Limits', () => {
    it('T06: accepts booking of exactly 120 minutes', () => {
      const input = createInput({ start: 720, end: 840 });
      expect(canBook(input)).toBe(true);
    });

    it('T07: rejects booking exceeding 120 minutes (121 mins)', () => {
      const input = createInput({ start: 720, end: 841 });
      expect(canBook(input)).toBe(false);
    });
  });

  // --- AC3: Room blocked state ---
  describe('AC3: Blocked Room Handling', () => {
    it('T13: rejects request when room is blocked', () => {
      const input = createInput({ start: 660, end: 720, blocked: true });
      expect(canBook(input)).toBe(false);
    });
  });

  // --- AC4: Overlap checks & endpoint touching ---
  describe('AC4: Booking Overlap Rules', () => {
    it('T01: accepts candidate starting when existing booking ends (touches right endpoint)', () => {
      const input = createInput({ start: 660, end: 720 });
      expect(canBook(input)).toBe(true);
    });

    it('T08: accepts candidate ending when existing booking starts (touches left endpoint)', () => {
      const input = createInput({ start: 570, end: 600 });
      expect(canBook(input)).toBe(true);
    });

    it('T09: rejects partial overlap starting inside existing booking', () => {
      const input = createInput({ start: 630, end: 690 });
      expect(canBook(input)).toBe(false);
    });

    it('T10: rejects candidate that completely encompasses existing booking', () => {
      const input = createInput({ start: 570, end: 690 });
      expect(canBook(input)).toBe(false);
    });

    it('T11: rejects candidate completely inside existing booking', () => {
      const input = createInput({ start: 615, end: 645 });
      expect(canBook(input)).toBe(false);
    });

    it('T12: rejects exact matching interval with existing booking', () => {
      const input = createInput({ start: 600, end: 660 });
      expect(canBook(input)).toBe(false);
    });

    it('T14: accepts candidate when bookings array is empty', () => {
      const input = createInput({ start: 630, end: 690, bookings: [] });
      expect(canBook(input)).toBe(true);
    });
  });

  // --- AC5: Decision output & data immutability ---
  describe('AC5: Data Immutability & Pure Decision Output', () => {
    it('returns Boolean decision and leaves input data untouched', () => {
      const originalBookings: BookingInterval[] = [
        { start: 600, end: 660 },
      ];
      const frozenInputData = JSON.stringify(originalBookings);

      const input: CanBookInput = {
        start: 660,
        end: 720,
        now: DEFAULT_NOW,
        blocked: DEFAULT_BLOCKED,
        bookings: originalBookings,
      };

      const result = canBook(input);

      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
      expect(JSON.stringify(input.bookings)).toBe(frozenInputData);
      expect(input.bookings).toBe(originalBookings);
    });
  });
});