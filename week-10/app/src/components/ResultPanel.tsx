import { CheckCircle2, XCircle } from "lucide-react";
import type { CheckResult } from "@/types";
import { minutesToLabel } from "@/lib/availability";

interface ResultPanelProps {
  result: CheckResult | null;
  roomName?: string;
  interval: { start: number; end: number } | null;
}

export function ResultPanel({ result, roomName, interval }: ResultPanelProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
        Fill in a room and a time range to see whether it is available.
      </div>
    );
  }

  const available = result.decision === "available";

  return (
    <div
      className={`rounded-xl border p-5 transition ${
        available
          ? "border-emerald-200 bg-emerald-50"
          : "border-rose-200 bg-rose-50"
      }`}
    >
      <div className="flex items-start gap-3">
        {available ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
        )}
        <div className="min-w-0 flex-1">
          <p
            className={`text-base font-semibold ${
              available ? "text-emerald-800" : "text-rose-800"
            }`}
          >
            {available ? "Available" : "Unavailable"}
          </p>
          {roomName && interval && (
            <p className="mt-0.5 text-sm text-slate-600">
              {roomName} · {minutesToLabel(interval.start)}–
              {minutesToLabel(interval.end)}
            </p>
          )}
          {result.reasons.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-slate-700">
              {result.reasons.map((reason, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-rose-500">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          )}
          {available && (
            <p className="mt-3 text-sm text-emerald-700">
              No conflicts. This slot is free and within the booking rules.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
