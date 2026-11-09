export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: { start: number; end: number }[];
};

export const ROOMS: Room[] = [
  {
    id: "A-204",
    name: "Study Room A-204",
    capacity: 4,
    equipment: ["Projector", "Whiteboard"],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: "B-105",
    name: "Study Room B-105",
    capacity: 8,
    equipment: ["Projector", "Computers"],
    blocked: false,
    bookings: [{ start: 720, end: 780 }],
  },
  {
    id: "C-301",
    name: "Study Room C-301",
    capacity: 12,
    equipment: ["Whiteboard", "TV"],
    blocked: false,
    bookings: [],
  },
  {
    id: "D-102",
    name: "Study Room D-102",
    capacity: 6,
    equipment: ["Whiteboard"],
    blocked: true,
    bookings: [],
  },
];
