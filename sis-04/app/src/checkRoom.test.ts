import { describe, expect, it } from "vitest";
import { checkRoom } from "./booking";
import type { Room } from "./rooms";

const rooms: Room[] = [
  {
    id: "A",
    name: "Room A",
    capacity: 4,
    equipment: ["Projector"],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: "B",
    name: "Room B",
    capacity: 8,
    equipment: ["Whiteboard"],
    blocked: false,
    bookings: [{ start: 720, end: 780 }],
  },
  {
    id: "C",
    name: "Room C",
    capacity: 6,
    equipment: ["Projector"],
    blocked: true,
    bookings: [],
  },
];

describe("checkRoom", () => {
  it("F3: blocked room is never available", () => {
    expect(
      checkRoom(rooms, "C", {
        start: 660,
        end: 720,
        now: 540,
      }),
    ).toBe(false);
  });

  it("F5: uses the selected room's own bookings", () => {
    expect(
      checkRoom(rooms, "A", {
        start: 600,
        end: 660,
        now: 540,
      }),
    ).toBe(false);

    expect(
      checkRoom(rooms, "B", {
        start: 600,
        end: 660,
        now: 540,
      }),
    ).toBe(true);
  });

  it("unknown room id is unavailable", () => {
    expect(
      checkRoom(rooms, "missing", {
        start: 660,
        end: 720,
        now: 540,
      }),
    ).toBe(false);
  });
});
