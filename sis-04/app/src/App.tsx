import { useMemo, useState } from "react";
import { Building2, CalendarClock, Check, RefreshCw } from "lucide-react";

import type { CheckResult } from "@/types";
import { ROOMS } from "@/rooms";
import { filterRooms } from "@/filter";
import { checkRoom } from "@/booking";
import {
  labelToMinutes,
  minutesToLabel,
  MINUTES_PER_DAY,
} from "@/lib/availability";

import { TimeInput } from "@/components/TimeInput";
import { ResultPanel } from "@/components/ResultPanel";
import { RoomSchedule } from "@/components/RoomSchedule";

const EQUIPMENT_OPTIONS = ["Projector", "Whiteboard", "Computers", "TV"];

function nowInMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function App() {
  const [currentStr, setCurrentStr] = useState(() =>
    minutesToLabel(nowInMinutes()),
  );
  const [startStr, setStartStr] = useState("09:00");
  const [endStr, setEndStr] = useState("10:00");

  const [attendees, setAttendees] = useState(1);
  const [equipment, setEquipment] = useState<string[]>([]);

  const filteredRooms = useMemo(
    () =>
      filterRooms(ROOMS, {
        attendees,
        equipment,
      }),
    [attendees, equipment],
  );

  const [roomId, setRoomId] = useState(ROOMS[0]?.id ?? "");

  const selectedRoom =
    filteredRooms.find((room) => room.id === roomId) ??
    filteredRooms[0] ??
    null;

  const [result, setResult] = useState<CheckResult | null>(null);
  const [lastInterval, setLastInterval] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCriteriaChange = () => {
    setResult(null);
    setLastInterval(null);
  };

  const handleRoomChange = (newRoomId: string) => {
    setRoomId(newRoomId);
    setResult(null);
    setLastInterval(null);
    setFormError(null);
  };

  const handleEquipmentChange = (item: string) => {
    setEquipment((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );

    handleCriteriaChange();
  };

  const handleCheck = () => {
    const start = labelToMinutes(startStr);
    const end = labelToMinutes(endStr);
    const now = labelToMinutes(currentStr);

    if (start === null || end === null || now === null) {
      setFormError("Please enter all times in HH:MM (24-hour) format.");
      setResult(null);
      setLastInterval(null);
      return;
    }

    if (!selectedRoom) {
      setFormError("No room is selected.");
      setResult(null);
      setLastInterval(null);
      return;
    }

    setFormError(null);

    const available = checkRoom(ROOMS, selectedRoom.id, {
      start,
      end,
      now,
    });

    const checkResult: CheckResult = {
      decision: available ? "available" : "unavailable",
      reasons: available
        ? []
        : ["The selected room is not available for this time slot."],
    };

    setResult(checkResult);
    setLastInterval({ start, end });
  };

  const handleReset = () => {
    setResult(null);
    setLastInterval(null);
    setFormError(null);
  };

  const resetToNow = () => setCurrentStr(minutesToLabel(nowInMinutes()));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Smart Campus Room Availability
            </h1>
            <p className="text-sm text-slate-500">
              Find a room and check whether it is free for your time slot.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Room requirements
              </h2>

              <div className="mb-5">
                <label
                  htmlFor="attendees"
                  className="text-xs font-medium uppercase tracking-wide text-slate-500"
                >
                  Attendees
                </label>

                <input
                  id="attendees"
                  type="number"
                  min="1"
                  value={attendees}
                  onChange={(event) => {
                    setAttendees(Math.max(1, Number(event.target.value) || 1));
                    handleCriteriaChange();
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                />
              </div>

              <div className="mb-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Required equipment
                </p>

                <div className="flex flex-wrap gap-3">
                  {EQUIPMENT_OPTIONS.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={equipment.includes(item)}
                        onChange={() => handleEquipmentChange(item)}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              {filteredRooms.length === 0 ? (
                <p className="mb-5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  No rooms match your requirements.
                </p>
              ) : (
                <div className="mb-5 flex flex-col gap-1">
                  <label
                    htmlFor="room-select"
                    className="text-xs font-medium uppercase tracking-wide text-slate-500"
                  >
                    Matching room
                  </label>

                  <select
                    id="room-select"
                    value={selectedRoom?.id ?? ""}
                    onChange={(event) => handleRoomChange(event.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                  >
                    {filteredRooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} · capacity {room.capacity}
                        {room.blocked ? " (blocked)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Booking request
              </h2>

              <div className="mb-5 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="current-time"
                    className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500"
                  >
                    <CalendarClock className="h-3.5 w-3.5" />
                    Current time
                  </label>

                  <button
                    type="button"
                    onClick={resetToNow}
                    className="flex items-center gap-1 text-xs font-medium text-sky-600"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Use now
                  </button>
                </div>

                <input
                  id="current-time"
                  type="time"
                  value={currentStr}
                  onChange={(event) => setCurrentStr(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Bookings must start after this time (max{" "}
                  {minutesToLabel(MINUTES_PER_DAY)}).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TimeInput
                  id="start-time"
                  label="Start"
                  value={startStr}
                  onChange={setStartStr}
                  hint="After current time"
                />

                <TimeInput
                  id="end-time"
                  label="End"
                  value={endStr}
                  onChange={setEndStr}
                  hint="Max 120 min"
                />
              </div>

              {formError && (
                <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {formError}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={!selectedRoom}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Check availability
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Reset
                </button>
              </div>
            </div>

            <ResultPanel
              result={result}
              roomName={selectedRoom?.name}
              interval={lastInterval}
            />
          </section>

          <section>
            {selectedRoom ? (
              <RoomSchedule room={selectedRoom} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                Select different requirements to see matching rooms.
              </div>
            )}
          </section>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Fictional sample data · One-day schedule (00:00–24:00)
        </footer>
      </div>
    </div>
  );
}

export default App;