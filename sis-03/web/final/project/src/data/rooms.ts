import type { Room } from "@/types";

// Fictional sample data only.
export const SAMPLE_ROOMS: Room[] = [
  {
    id: "room-aurora",
    name: "Aurora Hall",
    building: "North Wing",
    capacity: 24,
    blocked: false,
    bookings: [
      { start: 540, end: 600, title: "Intro to Algorithms", owner: "Prof. Lin" },
      { start: 780, end: 840, title: "Design Studio", owner: "Prof. Okafor" },
    ],
  },
  {
    id: "room-beacon",
    name: "Beacon 204",
    building: "East Tower",
    capacity: 12,
    blocked: false,
    bookings: [
      { start: 600, end: 660, title: "Team Standup", owner: "Robotics Club" },
    ],
  },
  {
    id: "room-cedar",
    name: "Cedar Lab",
    building: "Science Block",
    capacity: 30,
    blocked: true,
    blockedReason: "Maintenance — HVAC repair scheduled today.",
    bookings: [
      { start: 600, end: 660, title: "Reserved Block", owner: "Facilities" },
    ],
  },
  {
  id: "room-delta",
  name: "Delta Seminar Room",
  building: "South Pavilion",
  capacity: 8,
  blocked: false,
  bookings: [
    { start: 600, end: 660, title: "Morning Session", owner: "Faculty" },
    { start: 700, end: 760, title: "Project Review", owner: "Faculty" },
  ],
},
];
