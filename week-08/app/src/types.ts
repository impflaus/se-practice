export interface Booking {
  start: number; // minutes from 00:00
  end: number; // minutes from 00:00
  title: string;
  owner: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export interface Interval {
  start: number;
  end: number;
}

export type Decision = "available" | "unavailable";

export interface CheckResult {
  decision: Decision;
  reasons: string[];
}
