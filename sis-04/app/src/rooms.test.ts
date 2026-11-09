import { describe, expect, it } from "vitest";
import { ROOMS } from "./rooms";

describe("SIS 04 room catalog", () => {
  it("contains at least four complete rooms with equipment and bookings", () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(4);

    for (const room of ROOMS) {
      expect(room.id).toBeTruthy();
      expect(room.name).toBeTruthy();
      expect(room.capacity).toBeGreaterThan(0);
      expect(Array.isArray(room.equipment)).toBe(true);
      expect(typeof room.blocked).toBe("boolean");
      expect(Array.isArray(room.bookings)).toBe(true);
    }
  });
});
