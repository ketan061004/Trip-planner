"use client";

// Card/pill-style single choice. options: [{value,label,icon?,desc?}] or strings.
export default function SegmentedControl({ label, options = [], value, onChange, columns }) {
  const cols = columns || Math.min(options.length, 3);
  return (
    <div>
      {label && <p className="label">{label}</p>}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.value;
          const text = typeof o === "string" ? o : o.label;
          const Icon = typeof o === "object" ? o.icon : null;
          const desc = typeof o === "object" ? o.desc : null;
          const active = value === val;
          return (
            <button
              type="button"
              key={val}
              onClick={() => onChange(val)}
              className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center text-sm transition ${
                active
                  ? "border-brand-600 bg-brand-50 text-brand-800 shadow-sm ring-1 ring-brand-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-slate-50"
              }`}
            >
              {Icon && <Icon className={`h-5 w-5 ${active ? "text-brand-600" : "text-slate-400"}`} />}
              <span className="font-medium">{text}</span>
              {desc && <span className="text-xs text-slate-400">{desc}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
