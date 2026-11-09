import { describe, expect, it } from "vitest";
import type { Room } from "./rooms";
import { filterRooms } from "./filter";

const rooms: Room[] = [
  {
    id: "A",
    name: "Room A",
    capacity: 4,
    equipment: ["Projector", "Whiteboard"],
    blocked: false,
    bookings: [],
  },
  {
    id: "B",
    name: "Room B",
    capacity: 8,
    equipment: ["Projector"],
    blocked: false,
    bookings: [],
  },
  {
    id: "C",
    name: "Room C",
    capacity: 12,
    equipment: ["Projector", "Whiteboard", "Computers"],
    blocked: false,
    bookings: [],
  },
];

describe("filterRooms", () => {
  it("F1 B5: includes a room when capacity exactly equals attendees", () => {
    const result = filterRooms(rooms, {
      attendees: 8,
      equipment: [],
    });

    expect(result.map((room) => room.id)).toContain("B");
  });

  it("F1 B6: excludes a room one seat below requested attendees", () => {
    const result = filterRooms(rooms, {
      attendees: 9,
      equipment: [],
    });

    expect(result.map((room) => room.id)).not.toContain("B");
  });

  it("F2: room must contain ALL selected equipment", () => {
    const result = filterRooms(rooms, {
      attendees: 1,
      equipment: ["Projector", "Whiteboard"],
    });

    expect(result.map((room) => room.id)).toEqual(["A", "C"]);
  });
});
