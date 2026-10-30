import { useMemo, useState } from "react";
import { Building2, CalendarClock, Check, RefreshCw } from "lucide-react";
import type { CheckResult, Room } from "@/types";
import { SAMPLE_ROOMS } from "@/data/rooms";
import {
  checkAvailability,
  labelToMinutes,
  minutesToLabel,
  MINUTES_PER_DAY,
} from "@/lib/availability";
import { TimeInput } from "@/components/TimeInput";
import { ResultPanel } from "@/components/ResultPanel";
import { RoomSchedule } from "@/components/RoomSchedule";

function nowInMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function App() {
  const [rooms] = useState<Room[]>(SAMPLE_ROOMS);
  const [currentStr, setCurrentStr] = useState<string>(() =>
    minutesToLabel(nowInMinutes()),
  );
  const [roomId, setRoomId] = useState<string>(rooms[0]?.id ?? "");
  const [startStr, setStartStr] = useState<string>("09:00");
  const [endStr, setEndStr] = useState<string>("10:00");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [lastInterval, setLastInterval] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const currentTime = useMemo(() => labelToMinutes(currentStr) ?? 0, [currentStr]);
  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === roomId) ?? rooms[0],
    [rooms, roomId],
  );

  const handleCheck = () => {
    const start = labelToMinutes(startStr);
    const end = labelToMinutes(endStr);
    const cur = labelToMinutes(currentStr);

    if (start === null || end === null || cur === null) {
      setFormError("Please enter all times in HH:MM (24-hour) format.");
      setResult(null);
      setLastInterval(null);
      return;
    }
    setFormError(null);

    const interval = { start, end };
    const check = checkAvailability(selectedRoom, interval, cur);
    setResult(check);
    setLastInterval(interval);
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
        {/* Header */}
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Smart Campus Room Availability
            </h1>
            <p className="text-sm text-slate-500">
              Check whether a room is free for your time slot.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* Left: form + result */}
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Booking request
              </h2>

              {/* Current time */}
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
                    className="flex items-center gap-1 text-xs font-medium text-sky-600 transition hover:text-sky-700"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Use now
                  </button>
                </div>
                <input
                  id="current-time"
                  type="time"
                  value={currentStr}
                  onChange={(e) => setCurrentStr(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Bookings must start after this time (max 23:59).
                </p>
              </div>

              {/* Room select */}
              <div className="mb-5 flex flex-col gap-1">
                <label
                  htmlFor="room-select"
                  className="text-xs font-medium uppercase tracking-wide text-slate-500"
                >
                  Room
                </label>
                <select
                  id="room-select"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.building}
                      {r.blocked ? " (blocked)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time range */}
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
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  <Check className="h-4 w-4" />
                  Check availability
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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

          {/* Right: schedule */}
          <section>
            {selectedRoom && <RoomSchedule room={selectedRoom} />}
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
