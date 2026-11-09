import { describe, expect, it } from "vitest";

import { checkRoom } from "./booking";
import { filterRooms } from "./filter";
import type { Room } from "./rooms";

const rooms: Room[] = [
  {
    id: "A",
    name: "Room A",
    capacity: 4,
    equipment: ["Projector", "Whiteboard"],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: "B",
    name: "Room B",
    capacity: 8,
    equipment: ["Projector"],
    blocked: false,
    bookings: [{ start: 720, end: 780 }],
  },
];

describe("room filtering and availability integration", () => {
  it("INT: filters matching rooms and checks the selected room's own bookings", () => {
    const matches = filterRooms(rooms, {
      attendees: 4,
      equipment: ["Projector"],
    });

    expect(matches.map((room) => room.id)).toEqual(["A", "B"]);

    expect(
      checkRoom(matches, "A", {
        start: 600,
        end: 660,
        now: 540,
      }),
    ).toBe(false);

    expect(
      checkRoom(matches, "B", {
        start: 600,
        end: 660,
        now: 540,
      }),
    ).toBe(true);
  });
});
