interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  id: string;
}

export function TimeInput({ label, value, onChange, hint, id }: TimeInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-slate-500"
      >
        {label}
      </label>
      <input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
