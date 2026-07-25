"use client";

// Labeled range slider that snaps to a set of named stops.
export default function Slider({ label, stops = [], value, onChange }) {
  const index = Math.max(0, stops.indexOf(value));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={stops.length - 1}
        step={1}
        value={index}
        onChange={(e) => onChange(stops[Number(e.target.value)])}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600"
      />
      <div className="mt-1 flex justify-between text-[11px] text-slate-400">
        {stops.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </div>
  );
}
