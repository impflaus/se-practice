import { Clock, DoorClosed } from "lucide-react";
import type { Room } from "@/types";
import { minutesToLabel } from "@/lib/availability";

interface RoomScheduleProps {
  room: Room;
}

export function RoomSchedule({ room }: RoomScheduleProps) {
  const sorted = [...room.bookings].sort((a, b) => a.start - b.start);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <DoorClosed className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-800">
            {room.name} · {room.building}
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          Cap. {room.capacity}
        </span>
      </div>

      {room.blocked && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {room.blockedReason ?? "This room is currently blocked."}
        </p>
      )}

      <div className="mt-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          Today's bookings
        </p>
        {sorted.length === 0 ? (
          <p className="text-sm text-slate-400">No bookings scheduled.</p>
        ) : (
          <ul className="space-y-2">
            {sorted.map((b, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {b.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">{b.owner}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-slate-600">
                  {minutesToLabel(b.start)}–{minutesToLabel(b.end)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
